import*as CANNON from "./lib/cannon-es.js";
let {sin, cos, PI, abs, max, min, floor, random} = Math;
let rrnd = (mmin=0, mmax=1) => (random() * (mmax - mmin)) + mmin;

export function Flite(renderer3, config) {
    let {THREE, renderer, scene, camera, glbLoader, controls, events, directionalLight} = renderer3;

    controls.enableDamping = false;
    let vec = THREE.Vector3;
    let quat = THREE.Quaternion;
    let frameInterval = 1 / 60;

    let tq0 = new quat();
    let tq1 = new quat();

    const gravity = new CANNON.Vec3(0,-50,0);
    const allowSleep = true;
    const params = {
        // physics
        restitution:  .5,
        friction: .001,
    };

    let simulation = new CANNON.World({
        allowSleep,
        gravity
    })
    simulation.defaultContactMaterial.restitution = params.restitution;
    simulation.defaultContactMaterial.friction = params.friction;

    let planes = []
    class Obj {
        get position() {
            return this.body.position
        }
        get quaternion() {
            return this.body.quaternion
        }
        constructor(object, body) {
            this.body = body;
            simulation.addBody(this.body);
            object.position.copy(this.body.position)
            object.quaternion.copy(this.body.quaternion)

            this.quaternion0 = new quat()
            this.position0 = new vec()
            this.quaternion1 = new quat()
            this.position1 = new vec()
            this.yawInput=0;
            this.pitchInput=0;
            this.rollInput=0;
            this.throttle=0;
            this.object = object;
            scene.add(this.object)
        }
    }

    let keyboard = {}
    let keydown=(e)=>{keyboard[e.code]=true}
    let keyup=(e)=>{keyboard[e.code]=false}


document.addEventListener('keydown',keydown);
document.addEventListener('keyup',keyup);

    let makeGround=()=>{
        let gx = 1000;
        let gy = 1;
        let gz = 500;
        const body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(gx,gy,gz)),
        });
        body.position.y = -5;
        //body.quaternion.setFromEuler(-.5 * PI, 0, 0);
        let tex = new THREE.TextureLoader().load("./assets/airfield.jpg")
        tex.colorSpace = 'srgb'
        let mesh = new THREE.Mesh(new THREE.BoxGeometry(gx*2,gy*2,gz*2),new THREE.MeshStandardMaterial({color:'#ffffff',map:tex}));
        mesh.receiveShadow = true;
        let ground = new Obj(mesh,body);
    }    
    makeGround();
    let waypoints = new Waypoints(THREE,scene);
    this.init = async () => {
        const mass = 1;
        const sleepTimeLimit = .02;
        

        /*
        
        let airport = await glbLoader.loadAsync('./assets/airport_phys.glb')
        scene.add(airport.scene);
        airport.scene.position.y-= 3.5;
        */
        let airplane = await glbLoader.loadAsync('./assets/underpoly_free_sailplane_glider_phys2.glb')
        let airplaneModel = airplane.scene;
        camera.position.set(50, 10, 50)
        let v0 = new vec();
        let v1 = new vec();
        let v2 = new vec();
        let v3 = new vec();
        let v4 = new vec();
        let frameTime = 0;
        let frameNumber = 0;
        
        let qcpy = (a, b) => {
            a.x = b.x;
            a.y = b.y;
            a.z = b.z;
            a.w = b.w;
            return a;
        }
        let hull = airplaneModel.getObjectByName('hull');
        hull.parent.remove(hull);
        scene.attach(hull);
        scene.remove(hull);
        airplaneModel.traverse(e=>e.isMesh&&(e.castShadow = e.receiveShadow = true));
        let vertices=[]
        let fa=hull.geometry.index.array;
        let faces = []
        let va = hull.geometry.attributes.position.array;
        for(let i=0;i<va.length;i+=3){
            v0.set(va[i],va[i+1],va[i+2]);
            hull.localToWorld(v0);
            airplaneModel.worldToLocal(v0)
            vertices.push(new CANNON.Vec3(v0.x,v0.y,v0.z));
        }
        for(let i=0;i<fa.length;i+=3)faces.push([fa[i],fa[i+1],fa[i+2]]);
        let shape = new CANNON.ConvexPolyhedron({vertices,faces});
        //const shape = new CANNON.Box(new CANNON.Vec3(.5,.5,.5));
        let body = new CANNON.Body({
            mass,
            shape,
            sleepTimeLimit
        });
        let plane = new Obj(airplaneModel, body)
        
        plane.body.force.set(0,0,1000);

        let ax = new THREE.Vector3(1,0,0);
        let ay = new THREE.Vector3(0,1,0);
        let az = new THREE.Vector3(0,0,1);

        let quat = CANNON.Quaternion
        let q0 = new quat()
        let lerp =(a,b,step)=>a+((b-a)*step)
        let planeUpdate=(p)=>{
            if(keyboard.KeyE)p.throttle = lerp(p.throttle,1,.1);
            if(keyboard.KeyQ)p.throttle = lerp(p.throttle,0,.1);
            if(keyboard.KeyA)p.rollInput = lerp(p.rollInput,-1,.01);
            if(keyboard.KeyD)p.rollInput = lerp(p.rollInput,1,.01);
            if(keyboard.KeyW)p.pitchInput = lerp(p.pitchInput,-1,.01);
            if(keyboard.KeyS)p.pitchInput = lerp(p.pitchInput,1,.01);

            let v = p.body.velocity;
            v0.set(0,0,p.throttle);
            if(abs(v0.dot(v))<100.)p.body.applyLocalImpulse(v0.multiplyScalar(1.1),v1.set(0,0,1));

            if(abs(p.rollInput)>.01){
                v0.set(0,p.rollInput*20.,0.);
                p.body.applyLocalImpulse(v0,v1.set(1,0,0))
                p.body.applyLocalImpulse(v0.multiplyScalar(-1),v1.set(-1,0,0))
            }
            if(abs(p.pitchInput)>.01){
                v0.set(0,p.pitchInput*-20.,0.);
                p.body.applyLocalImpulse(v0,v1.set(0,0,-1))
            }
            p.rollInput *= .5
            p.pitchInput *= .5


            
            v1.copy(ay).applyQuaternion(p.body.quaternion);
            p.body.velocity.addScaledVector(-.95*p.body.velocity.dot(v1),v1,p.body.velocity)
            v1.copy(ax).applyQuaternion(p.body.quaternion);
            p.body.velocity.addScaledVector(-.95*p.body.velocity.dot(v1),v1,p.body.velocity)
            v1.copy(az).applyQuaternion(p.body.quaternion);
            p.body.velocity.addScaledVector(-.01*p.body.velocity.dot(v1),v1,p.body.velocity)

            let pq = p.body.previousQuaternion;
            let q = p.body.quaternion;
            let tailVel = v1.set(0,0,-1).applyQuaternion(q).sub(v0.set(0,0,-1).applyQuaternion(pq));

            
            let tailImpulse = v3.set(0,0,0);
            v2.copy(ax).applyQuaternion(p.body.quaternion);
            tailImpulse.addScaledVector(v4.copy(ax),-6*tailVel.dot(v2))
            v2.copy(ay).applyQuaternion(p.body.quaternion);
            tailImpulse.addScaledVector(v4.copy(ay),-6*tailVel.dot(v2))
            p.body.applyLocalImpulse(tailImpulse,v1.set(0,0,-1))
            
        }
                
        document.addEventListener('hud-update',(e)=>{
            let p = planes[0];
            let hue = e.detail;
            hue.throttle = p.throttle
            
            let v = p.body.velocity;
            v0.set(0,0,.01);
            hue.throttle = hue.speed =  abs(v0.dot(v))*100.
            v2.copy(az).applyQuaternion(p.body.quaternion);
            let ang = 180+(Math.atan(v2.x,v2.z)*360/(Math.PI*2));
            hue.heading = ang;
        })
        
        events.frame = (dt) => {
            let time = performance.now() / 1000;
            if (time >= frameTime) 
            {
                let elapsedFrameTime = ((time - frameTime) / frameInterval);
                let elapsedFrames = (elapsedFrameTime | 0);
                for(let i=0;i<planes.length;i++){
                    let p = planes[i]
                    p.position0.copy(p.body.position)
                    p.quaternion0.copy(p.body.quaternion)
                }
                for (let i = 0; i <= elapsedFrames; i++) {
                    //this.step()
                    planeUpdate(planes[0]);
                    //simulation.fixedStep(undefined, 10);
                    simulation.step(frameInterval,frameInterval, 3);
                    frameNumber++;
                    if(i>1000){
                     console.log("phys underflow:",elapsedFrames)
                        frameTime = time;
                        break;
                        
                    }
                }
                //p.position0.x = ((floor((p.position0.x+50)/100))*100)-50;
                //p.position0.y = ((floor((p.position0.y+50)/100))*100)-50;
                //p.position0.y = ((floor((p.position0.z+50)/100))*100)-50;
                let alpha = elapsedFrameTime - elapsedFrames;
                for(let i=0;i<planes.length;i++){
                    let p = planes[i]
                    p.object.position.copy(p.position0).lerp(p.position1.copy(p.position), alpha);
                    qcpy(p.object.quaternion, p.quaternion0).slerp(p.quaternion1.copy(p.quaternion), alpha);
                    //p.object.rotation.setFromQuaternion(p.object.quaternion)
                }
                //if(camera.parent!=planes[0].object)
                //    planes[0].object.add(camera);
                v0.copy(planes[0].object.position).sub(controls.target);
                //camera.position.add(v0)
    //controls.target.add(v0)
                v0.y=0;
                directionalLight.target.position.add(v0)
                let camDist = camera.position.distanceTo(controls.target);
                //if(camDist>30)camera.position.sub(controls.target).setLength(30).add(controls.target);
                frameTime = frameNumber * frameInterval;
                //expression.innerText = 'frame: ' + frameNumber;
    //controls.update(dt);

                
                camera.quaternion.copy(planes[0].object.quaternion);
                camera.quaternion.multiply(tq0.setFromAxisAngle(v0.set(0,1,0),Math.PI));
            planes[0].object.localToWorld(v0.set(0,0,-3));
                camera.position.lerp(v0,.02);
                camera.lookAt(planes[0].object.position);
            }
            waypoints.update(planes[0].object.position);
        }
        planes.push(plane)
    }
    initMaze(scene,Obj);
}
import Waypoints from "./waypoints.js"


import *as THREE from "three"
import CSG from "https://cdn.jsdelivr.net/gh/manthrax/THREE-CSGMesh/three-csg.js"

import Maze from "./Maze.js"

let initMaze=(scene,Obj)=>{
    let m = new Maze();
    
    let bgm = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({
        color:0x808080
    }));
    m.forEach(b=>{
        let bm = bgm.clone();
        //bm.scale.set(b[1][0]-b[0][0],b[1][1]-b[0][1],b[1][2]-b[0][2]).multiplyScalar(.5);
        //bm.position.set(b[1][0]+b[0][0],b[1][1]+b[0][1],b[1][2]+b[0][2]).multiplyScalar(.5);
        bm.position.set(...b[0]);
        bm.scale.set(...b[1]);
        bm.position.multiplyScalar(100)
        bm.scale.multiplyScalar(100)

        bm.position.y += 75;


    let gx = bm.scale.x*.5
    let gy = bm.scale.y*.5
    let gz = bm.scale.z*.5
        const body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(gx,gy,gz)),
        });
        body.position.copy(bm.position);
        bm.castShadow = true;
        bm.receiveShadow = true;
        let wall = new Obj(bm,body);
    })
}
