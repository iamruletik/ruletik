import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { Pane } from 'tweakpane'


console.log(document.fonts.status)

//Mapper Function
const mapper = gsap.utils.mapRange(0, 1000, 0, 1)

//TweakPane Gui
const pane = new Pane()
const paneFolder = pane.addFolder({ 
                                        title: 'Ruletik GUI' 
                                    })

//Canvas Element
const canvas = document.querySelector('canvas.webgl')
const clock = new THREE.Clock()
//Sizes
const sizes = {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
//Renderer
const renderer = new THREE.WebGLRenderer({
                                                canvas: canvas
                                            })
renderer.setSize(sizes.width, sizes.height)
//renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))//Setting pixel ratio
renderer.setPixelRatio(2)//Setting pixel ratio
renderer.setClearColor(0xD5CDC0) //Instead of black background

//Texture Loader
const textureLoader = new THREE.TextureLoader()

//Scene
const scene = new THREE.Scene()


const gltfLoader = new GLTFLoader()

gltfLoader.load('alexander-ruletik.glb', gltf => {
    console.log(gltf)
    scene.add(gltf.scene)
})



//Preloader Eyes

//Image Texture
const preloaderTexture = textureLoader.load('eyeSpriteCompressed.webp')
preloaderTexture.colorSpace = THREE.SRGBColorSpace
preloaderTexture.minFilter = THREE.NearestFilter


const preloaderEyes = {
    geometry: null,
    material: null,
    count: [
        8, 12, 16
    ],
    spaceBetween: [
        0.75, 1.5, 2.5
    ],
    tilesCountX: 9,
    tilesCountY: 15,
    currentTile: 1,
    width: mapper(480),
    height: mapper(270),
    scale: [
        1, 1.5, 2.25
    ]
}

const preloaderEyesGroup = new THREE.Group()
const eyesCirclesArray = [
    new THREE.Group(),
    new THREE.Group(),
    new THREE.Group()
]

const offsetX = (preloaderEyes.currentTile % preloaderEyes.tilesCountX) / preloaderEyes.tilesCountX
const offsetY = (preloaderEyes.tilesCountY - Math.floor(preloaderEyes.currentTile / preloaderEyes.tilesCountX) - 1) / preloaderEyes.tilesCountY

preloaderTexture.repeat.set(1 / preloaderEyes.tilesCountX, 1 / preloaderEyes.tilesCountY)
preloaderTexture.offset.x = offsetX
preloaderTexture.offset.y = offsetY

//First Loop is Circle
for (let c = 0; c < 3; c++) {

        const angleDiff = 2 * Math.PI / preloaderEyes.count[c]



        //Second loop for eyes
        for (let i = 0; i < preloaderEyes.count[c]; i++) {

            preloaderEyes.geometry = new THREE.PlaneGeometry(preloaderEyes.width * preloaderEyes.scale[c], preloaderEyes.height * preloaderEyes.scale[c])


            let temp = new THREE.Mesh(
                preloaderEyes.geometry,
                new THREE.MeshBasicMaterial( { map: preloaderTexture, transparent: true })
            )

            temp.position.x = Math.sin(angleDiff * i) * preloaderEyes.spaceBetween[c]
            temp.position.y = Math.cos(angleDiff * i) * preloaderEyes.spaceBetween[c]

            temp.rotateZ(-i*angleDiff)
            

            eyesCirclesArray[c].add(temp)

        }

        preloaderEyesGroup.add(eyesCirclesArray[c])
}

scene.add(preloaderEyesGroup)

//Camera Settings
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height) // FOV vertical angle, aspect ratio with/height
camera.position.set(0,0,2)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)

let spriteObj = { currentTile: 0 }
let step = 1


gsap.fromTo(spriteObj, {
    currentTile: 0,
}, {
    currentTile: 133,
    yoyo: true,
    repeat: -1,
    ease: "steps(133)",
    duration: 5
})


document.addEventListener('DOMContentLoaded', e => {

    setTimeout(() => {
        gsap.to(camera.position, {
            z: 0.4,
            duration: 2,
            ease: "power4.inOut",
        })
    }, 1200)

})



//Animation Loop Function
const tick = () => {

    const elapsedTime = clock.getElapsedTime() //Built in function in seconds since start

    eyesCirclesArray[0].rotation.z += 0.0015
    eyesCirclesArray[1].rotation.z -= 0.001
    eyesCirclesArray[2].rotation.z += 0.0005
    
        
    let offsetX = (spriteObj.currentTile % preloaderEyes.tilesCountX) / preloaderEyes.tilesCountX
    let offsetY = (preloaderEyes.tilesCountY - Math.floor(spriteObj.currentTile / preloaderEyes.tilesCountX) - 1) / preloaderEyes.tilesCountY
    //console.log(spriteObj.currentTile)

    preloaderTexture.offset.x = offsetX
    preloaderTexture.offset.y = offsetY


    camera.lookAt(new THREE.Vector3()) //Empty Vector3 method resul in 0 0 0  Vector, basically center of the scene

    //Render Function
    renderer.render(scene, camera) //by default all objects will appear at center of the scene in 0 0 0 coordinates, meaning camera will be at the center too

    //Request next frame
    window.requestAnimationFrame(tick) // requestAnimationFrame purpose is to call a function on the next frame, thus we will need to call this function each frame
    controls.update()
}
tick()



//Check if browser tab was not active
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        console.log('Left Tab')
    } else {
        console.log('Returned to the Tab')
    }
});



//Resize Function
window.addEventListener('resize', () => {
    
    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix() // Update Camera

    renderer.setSize(sizes.width, sizes.height) //Update Renderer - Better put here so user when moving windows from screen to screen would receive better experience

})