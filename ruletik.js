/*****************************************************Main Function***************************************************/

window.addEventListener("DOMContentLoaded", (event) => {
    connectLenis();
});

window.addEventListener("resize", (event) => { });

/*****************************************************Main Function***************************************************/

function connectLenis() {
    const lenis = new Lenis()

    lenis.on('scroll', (e) => {
        console.log(e)
    })

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
}