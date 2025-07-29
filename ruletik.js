import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'

//Mapper Function
const mapper = gsap.utils.mapRange(0, 1000, 0, 1)

const canvas = document.querySelector('canvas.webgl')
const clock = new THREE.Clock()
//Sizes
const sizes = {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
const renderer = new THREE.WebGLRenderer({
                                                canvas: canvas
                                            })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)//Setting pixel ratio
renderer.setClearColor(0xD5CDC0) //Instead of black background

const textureLoader = new THREE.TextureLoader()
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height) // FOV vertical angle, aspect ratio with/height
camera.position.set(0,0,2)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableRotate = false
controls.zoomSpeed = 0.75

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



scene.add(drawEyesCircles(preloaderEyes, preloaderTexture))




function rotateEyes () {
    eyesCirclesArray[0].rotation.z += 0.0015
    eyesCirclesArray[1].rotation.z -= 0.001
    eyesCirclesArray[2].rotation.z += 0.0005
}


let currentTile = 0
let lastTile = 133

function scrollEyeTexture () {
    currentTile++
    if (currentTile == lastTile) { currentTile = 0 }
    let offsetX = (currentTile % preloaderEyes.tilesCountX) / preloaderEyes.tilesCountX
    let offsetY = (preloaderEyes.tilesCountY - Math.floor(currentTile / preloaderEyes.tilesCountX) - 1) / preloaderEyes.tilesCountY

    preloaderTexture.offset.x = offsetX
    preloaderTexture.offset.y = offsetY
}


const frequency = 60
let currentFrame = 0
let secondsPassed = 0
let siteReady = false


//Animation Loop
const updateFrame = () => {


    rotateEyes() // Rotate Eye Cirecles Around
    scrollEyeTexture() //Scroll Texture In Eyes

    currentFrame++
    //Time in Seconds
    if (currentFrame == frequency ) {

        currentFrame = 0
        secondsPassed = Math.round(clock.getElapsedTime())
        console.clear()
        console.log(secondsPassed + ' Seconds')

        if (secondsPassed == 1) {
            siteReady = true
        }



    }

    if (siteReady == true) {
        camera.position.lerp({x: camera.position.x, y: camera.position.y, z: 0.5},0.075)
    }

    if (camera.position.z <= 0.51) {
        siteReady = false
    }







    //Update
    controls.update() // Update Controls
    renderer.render(scene, camera) //Render Current Frame
    window.requestAnimationFrame(updateFrame) //Request Next Frame

}
updateFrame() //Start First Frame




function drawEyesCircles (eyes, texture) {

    const preloaderEyesGroup = new THREE.Group()
    //First Loop is Circle
    for (let c = 0; c < 3; c++) {

        const angleDiff = 2 * Math.PI / eyes.count[c]



        //Second loop for eyes
        for (let i = 0; i < eyes.count[c]; i++) {

            eyes.geometry = new THREE.PlaneGeometry(eyes.width * eyes.scale[c], eyes.height * eyes.scale[c])


            let temp = new THREE.Mesh(
                eyes.geometry,
                new THREE.MeshBasicMaterial( { map: texture, transparent: true })
            )

            temp.position.x = Math.sin(angleDiff * i) * eyes.spaceBetween[c]
            temp.position.y = Math.cos(angleDiff * i) * eyes.spaceBetween[c]

            temp.rotateZ(-i*angleDiff)


            eyesCirclesArray[c].add(temp)

        }

        preloaderEyesGroup.add(eyesCirclesArray[c])
    }

    return preloaderEyesGroup
}






//----------------- UTILITY ------------//

//Check if browser tab was not active
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        console.log('Left Tab')
    } else {
        console.log('Returned to the Tab')
    }
});

//Resize Canvas when resizing main windows
window.addEventListener('resize', () => {
    
    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix() // Update Camera

    renderer.setSize(sizes.width, sizes.height) //Update Renderer - Better put here so user when moving windows from screen to screen would receive better experience

})