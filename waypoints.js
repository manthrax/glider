export default function Waypoints(THREE,scene){
    let geo = new THREE.TorusGeometry(4);
    geo.scale(10,10,10)
    let mat = new THREE.MeshStandardMaterial({
        color:'white',
        metalness:1,
        roughness:.01,
     //   vertexColors:true,
    });
    let ct = 200;
    let im=new THREE.InstancedMesh(geo,mat,ct);
    im.frustumCulled = false;
    let d = new THREE.Object3D();
    let rings = new Array(ct)
    let yellow = new THREE.Color('yellow')
    let red = new THREE.Color('red')
    for(let i=0;i<ct;i++){
        rings[i]={
            index:i,
            angle:d.rotation.y=Math.random()*6,
            position:d.position.randomDirection().setLength(1000).clone()
        }
        for(let i=0;i<ct;i++)
                im.setColorAt(i,yellow)
    }
    scene.add(im)
    let d2=100;
    let domain=(v)=>v-(Math.floor((v+d2)/d2)*d2);
    this.update=(position)=>{
        for(let i=0;i<ct;i++){
            let r = rings[i];
            d.rotation.y=r.angle;
            r.angle+=.01;
            let p = d.position.copy(r.position);
            
            d.updateMatrix();
            im.setMatrixAt(i,d.matrix);
            if((!r.grabbed)&&position.distanceTo(d.position) < 100){
                r.grabbed = true;
                im.setColorAt(i,red)
            }
        }
        im.instanceMatrix.needsUpdate = true;
        im.instanceColor.needsUpdate = true;
    }
}