
function DiceApplication() {
    this.canvas = document.getElementById('dice');
    this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true
    });

    // this.container.innerHTML = '';
    // this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, 1.0, 0.2, 20000);
    this.camera.position.z = 10;
    this.camera.position.y = 5;
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xCFCFCF);

    let geom = new THREE.BoxGeometry(1, 1, 1);
    let mat = new THREE.MeshBasicMaterial({color: new THREE.Color(0x0000FF)});

    let cube1 = new THREE.Mesh(geom, mat);
    let cube2 = new THREE.Mesh(geom, mat);
    cube2.position.x = 2;
    let cube3 = new THREE.Mesh(geom, mat);
    cube3.position.z = 2;

    this.scene.add(cube1);
    this.scene.add(cube2);
    this.scene.add(cube3);

    this.counter = 0;
    let self = this;
    this.run = function () {
        requestAnimationFrame(self.run);
        self.counter += 0.01;
        self.camera.position.x = Math.sin(self.counter) * 10;
        self.camera.position.z = Math.cos(self.counter) * 10;

        self.camera.lookAt(0, 0, 0);

        self.renderer.render(self.scene, self.camera);
    }
}

window.addEventListener('load', function () {
    let app = new DiceApplication();
    app.run();
});

