let config = {
    //Dice
    diceUrl: "./assets/DiceT6.glb",
    selectionMeshUrl: "./assets/DiceCollider.glb",
    selectionMeshScale: 1.1,
    diceScale: 1.,
    FFFenvironmentUrl: `./assets/spruit_sunrise_4k.hdr.jpg`,//citrus_orchard_road_1k (1).hdr`,//oxTqLelBTDo54v1q7Rs_pc78N8XiEHoTaQVLhyKQP90.jpg`,

    environmentUrl:`./assets/loc00184-23-0-preview.jpg`,
    //floorTexture: './assets/paper.jpg',
    //floorRepeat: 14,
    floorRoughness: 1,
    floorMetalness: 0,

    //Camera stuff
    cameraPosition: [0, 45, 20],
    cameraLookAt: [0, 0, 0],
    freeCamera:true,  //Let the camera move for debugging...
    fov: 75,

    // physics
    restitution: .3,
    //How bouncy the dice are 0 to 1
    friction: .1,
    // How much friction
    diceForce: 10,
    //Throwing force of dice...

    //Appearance:
    playFieldScale: 6,
    // Scale of walls relative to screen
    environmentRotation: [Math.PI, 0, 0],
    //Rotate the environment map/background
    debugWalls: false,

    //Bloom/glow
    bloomThreshold: .8,
    bloomStrength: .4,
    bloomRadius: 0,
    bloomExposure: 1,

    //Misc experiments
    diceRoughness: .25,
    // Dice roughness override
    diceMetalness: .7,
    // Dice metalness override
    //diceUrl:`./assets/shiba.glb`,
    //diceScale: .5,
    //diceUrl: `./assets/cube.glb`

}

import {Renderer} from "./renderer.js";
let renderer3 = new Renderer(config);
let {THREE, scene, camera, renderer, controls, ambientLight, directionalLight, events, gui, glbLoader, raycasting, postProcessing} = renderer3;

gui.hide();

if (config.bloomThreshold)
    postProcessing.params.bloomThreshold = config.bloomThreshold;
if (config.bloomStrength)
    postProcessing.params.bloomStrength = config.bloomStrength;
if (config.bloomRadius)
    postProcessing.params.bloomRadius = config.bloomRadius;
if (config.bloomExposure)
    postProcessing.params.bloomExposure = config.bloomExposure;


/*
import {SimpleDice} from "./simple-dice.js"
let simpleDice = await SimpleDice({
    THREE,
    renderer,
    scene,
    camera,
    glbLoader,
    raycasting,
    events,
    config
})
*/







//simpleDice.loadFromJSON(await (await fetch('./dice.json')).json());

//scene.background = new THREE.Color(.7,.6,.8)
//window.rules.innerHTML=await (await fetch('bar-dice-rules.html')).text();

import {Flite} from "./flite.js"

let flite = new Flite(renderer3,config);
flite.init();