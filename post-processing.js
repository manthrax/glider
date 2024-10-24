import*as THREE from "three"
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
//import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

export function PostProcessing(renderer, scene, camera, config) {

    let composer = new EffectComposer(renderer);
composer.renderTarget1.samples = 16;
composer.renderTarget2.samples = 16;
    const renderPass = new RenderPass(scene,camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth,window.innerHeight),1.5,0.4,0.85);
bloomPass.renderTargetBright.samples = 
bloomPass.renderTargetsHorizontal.samples = 
bloomPass.renderTargetsVertical.samples = 16;
    this.params = {
        set bloomThreshold(v) {
            bloomPass.threshold = v
        },
        get bloomThreshold() {
            return bloomPass.threshold
        },
        set bloomStrength(v) {
            bloomPass.strength = v
        },
        get bloomStrength() {
            return bloomPass.strength
        },
        set bloomRadius(v) {
            bloomPass.radius = v
        },
        get bloomRadius() {
            return bloomPass.radius
        },
        set bloomExposure(v) {
            bloomPass.exposure = v
        },
        get boomExposure() {
            return bloomPass.exposure
        }
    };
    Object.assign(this.params, {
        bloomThreshold: .8,
        bloomStrength: .4,
        bloomRadius: 0,
        bloomSxposure: 1
    })

    composer.addPass(bloomPass);

    this.setSize = (width, height) => {
        composer.setSize(width, height);
    }

    this.render = (scene, camera) => {
        composer.render(scene, camera)
    }
}
