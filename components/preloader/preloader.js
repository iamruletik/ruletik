fetch("components/preloader/preloader.html")
    .then(stream => stream.text())
    .then(htmlFile => define(htmlFile));


function define(htmlFile) {
    class Preloader extends HTMLElement {

        constructor() {
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = htmlFile;

        }
    }
    window.customElements.define("pre-loader", Preloader);
}