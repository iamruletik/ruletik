import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TextureUtils } from 'three/src/extras/TextureUtils.js'
import {Pane} from 'tweakpane'

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
renderer.setClearColor(0xD3CCBF) //Instad of black background

//Texture Loader
const textureLoader = new THREE.TextureLoader()

//Scene
const scene = new THREE.Scene()

//Preloader Eyes

//Video Texture
const video = document.createElement('video')
video.setAttribute('src', 'eyeTexture.mp4')
video.muted = true
video.playsInline = true
video.loop = true
video.play();

//Check if browser tab was not active
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        video.pause()
        console.log(video.paused)
    } else {
        video.play()
        console.log(video.paused)

    }
  });


const videoTexture = new THREE.VideoTexture(video)
videoTexture.colorSpace = THREE.SRGBColorSpace




//videoTexture.wrapS = THREE.RepeatWrapping
//videoTexture.wrapT = THREE.RepeatWrapping

videoTexture.minFilter = THREE.NearestFilter

const preloaderEyes = {
    geometry: null,
    material: new THREE.MeshBasicMaterial( { map:videoTexture }),
    count: [
        8, 12, 16
    ],
    spaceBetween: [
        0.75, 1.5, 2.5
    ],
    videoWidth: mapper(480),
    videoHeight: mapper(270),
    videoScale: [
        1, 1.5, 1.75
    ]
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

        //Second loop for eyes
        for (let i = 0; i < preloaderEyes.count[c]; i++) {

            preloaderEyes.geometry = new THREE.PlaneGeometry(preloaderEyes.videoWidth * preloaderEyes.videoScale[c], preloaderEyes.videoHeight * preloaderEyes.videoScale[c])
            
            let temp = new THREE.Mesh(
                preloaderEyes.geometry,
                preloaderEyes.material
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