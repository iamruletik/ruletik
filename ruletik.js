import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TextureUtils } from 'three/src/extras/TextureUtils.js'
import {Pane} from 'tweakpane'

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))//Setting pixel ratio 
renderer.setClearColor(0xD3CCBF) //Instead of black background

//Texture Loader
const textureLoader = new THREE.TextureLoader()

//Scene
const scene = new THREE.Scene()

//Preloader Eyes

//Sprite Texture
const eyeTexture = textureLoader.load('eyeSpriteCompressed.webp')
eyeTexture.colorSpace = THREE.SRGBColorSpace
eyeTexture.minFilter = THREE.NearestFilter


const preloaderEyes = {
    material: new THREE.SpriteMaterial( { map: eyeTexture } ),
    count: [
        8, 12, 16
    ],
    spaceBetween: [
        0.75, 1.5, 2.5
    ],
    circlesScale: [
        1, 1.5, 1.75
    ],
    tilesCountX: 9,
    tilesCountY: 15,
    currentTile: 58,
    scaleX: mapper(480),
    scaleY: mapper(270),

}

const preloaderEyesGroup = new THREE.Group()
const eyesCirclesArray = [
    new THREE.Group(),
    new THREE.Group(),
    new THREE.Group()
]

//First Loop is Circle
for (let c = 0; c < 3; c++) {

        const angleDiff = 2 * Math.PI / preloaderEyes.count[c]
        
        const offsetX = (preloaderEyes.currentTile % preloaderEyes.tilesCountX) / preloaderEyes.tilesCountX
        const offsetY = (preloaderEyes.tilesCountY - Math.floor(preloaderEyes.currentTile / preloaderEyes.tilesCountX) - 1) / preloaderEyes.tilesCountY
        
        eyeTexture.repeat.set(1 / preloaderEyes.tilesCountX, 1 / preloaderEyes.tilesCountY)
        eyeTexture.offset.x = offsetX
        eyeTexture.offset.y = offsetY

        //Second loop for eyes
        for (let i = 0; i < preloaderEyes.count[c]; i++) {
            
            let temp = new THREE.Sprite( preloaderEyes.material )
            temp.scale.set(preloaderEyes.scaleX, preloaderEyes.scaleY, 1)

            temp.position.x = Math.sin(angleDiff * i) * preloaderEyes.spaceBetween[c]
            temp.position.y = Math.cos(angleDiff * i) * preloaderEyes.spaceBetween[c]

            temp.rotateZ(-i*angleDiff)
            

            eyesCirclesArray[c].add(temp)

        }

        preloaderEyesGroup.add(eyesCirclesArray[c])
}

scene.add(preloaderEyesGroup)


//Check if browser tab was not active
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        console.log('Left Tab')
    } else {
        console.log('Returned to the Tab')
    }
})


//Camera Settings
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height) // FOV vertical angle, aspect ratio with/height
camera.position.set(0,0,2)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)


















//Animation Loop Function
const tick = () => {

    const elapsedTime = clock.getElapsedTime() //Built in function in seconds since start

    eyesCirclesArray[0].rotation.z += 0.001   
    eyesCirclesArray[1].rotation.z -= 0.001   
    eyesCirclesArray[2].rotation.z += 0.001   

    camera.lookAt(new THREE.Vector3()) //Empty Vector3 method resul in 0 0 0  Vector, basically center of the scene

    //Render Function
    renderer.render(scene, camera) //by default all objects will appear at center of the scene in 0 0 0 coordinates, meaning camera will be at the center too

    //Request next frame
    window.requestAnimationFrame(tick) // requestAnimationFrame purpose is to call a function on the next frame, thus we will need to call this function each frame
    controls.update()
}
tick()


//Resize Function
window.addEventListener('resize', () => {
    
    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix() // Update Camera

    renderer.setSize(sizes.width, sizes.height) //Update Renderer - Better put here so user when moving windows from screen to screen would recieve better expirience

})