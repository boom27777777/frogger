function genDieMat() {
    let helper = function (url) {
        return new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(url)})
    };

    return [
        helper('/static/img/die1.png'),
        helper('/static/img/die2.png'),
        helper('/static/img/die3.png'),
        helper('/static/img/die4.png'),
        helper('/static/img/die5.png'),
        helper('/static/img/die6.png'),
    ];
}

function Die(x, y, z) {
    this.geom = new THREE.BoxGeometry(1, 1, 1);
    this.texture = new THREE.TextureLoader().load('/static/img/die.jpg');
    this.mat = genDieMat();
    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.mesh.position.set(x, y, z);

    this.cannonGeom = new CANNON.Box(new CANNON.Vec3(0.9, 0.9, 0.9));
    this.body = new CANNON.Body({mass: 0.5, shape: this.cannonGeom});
    this.body.position.set(x, y, z);
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(
        Math.random(),
        Math.random(),
        Math.random()
    ), -Math.PI / 2);

    this.update = function () {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    };

    this.done = function () {
        return this.body.velocity.x < 0.01 &&
            this.body.velocity.y < 0.01 &&
            this.body.velocity.z < 0.01 &&
            this.body.angularVelocity.x < 0.01 &&
            this.body.angularVelocity.y < 0.01 &&
            this.body.angularVelocity.z < 0.01
    };

    this.getUpsideValue = function () {
        let vector = new THREE.Vector3(0, 1, 0);
        let closest_face;
        let closest_angle = Math.PI * 2;
        for (let i = 0; i < this.mesh.geometry.faces.length; ++i) {
            let face = this.mesh.geometry.faces[i];
            // if (face.materialIndex === 0) continue;

            let angle = face.normal.clone().applyQuaternion(this.body.quaternion).angleTo(vector);
            if (angle < closest_angle) {
                closest_angle = angle;
                closest_face = face;
            }
        }

        return closest_face.materialIndex + 1;
    }
}

function Ground(x, y, z) {
    this.geom = new THREE.PlaneGeometry(15, 15);
    this.mat = new THREE.MeshBasicMaterial({color: new THREE.Color(0xC7C7C7)});
    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.mesh.position.set(x, y, z);

    this.cannonGeom = new CANNON.Plane();
    this.body = new CANNON.Body({mass: 0, shape: this.cannonGeom});
    this.body.position.set(x, y, z);
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    this.update = function () {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}

function DiceApplication() {
    this.running = true;
    this.canvas = document.getElementById('dice');
    this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true
    });

    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.quatNormalizeFast = false;
    this.world.quatNormalizeSkip = 0;
    this.world.broadphase = new CANNON.NaiveBroadphase();

    // this.container.innerHTML = '';
    // this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, 1.0, 0.2, 20000);
    // this.camera.position.z = 20;
    this.camera.position.y = 15;
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xCFCFCF);

    this.ground = new Ground(0, 0, 0);
    this.world.bodies.push(this.ground.body);
    this.scene.add(this.ground.mesh);

    this.dice = [
        new Die(0, 2, 2),
        new Die(3, 2, 2),
        new Die(-3, 2, 2)
    ];

    this.dice.forEach(function (die) {
        this.scene.add(die.mesh);
        this.world.bodies.push(die.body);
        die.body.velocity.z = -4;
        die.body.angularVelocity.set(
            Math.random() * 5,
            Math.random() * 5,
            Math.random() * 5,
        );
    }, this);

    this.light = new THREE.SpotLight(0xFFFFFF);
    this.light.position.y = 10;
    this.light.target.position.set(0, 0, 0);
    this.light.castShadow = true;

    this.light.shadowCameraNear = 10;
    this.light.shadowCameraFar = 100;
    this.light.shadowCameraFov = 30;

    this.light.shadowMapBias = 0.0039;

    this.scene.add(this.light);

    this.counter = 0;
    this.animate = function (dt) {
        this.counter += dt / 2000;
        this.camera.position.x = Math.sin(this.counter) * 10;
        this.camera.position.z = Math.cos(this.counter) * 10;

        this.camera.lookAt(0, 0, 0);

    };


    this.physics = function (dt) {
        if (dt <= 0) {
            return
        }
        this.world.step(dt / 1000);
        this.ground.update();
        let done = true;
        this.dice.forEach(function (die) {
            die.update();
            done = done && die.done();
        }, this);
        if (done) {
            this.running = false;
            this.dice.forEach(function (die) {
                console.log(die.getUpsideValue())
            })
        }
    };

    this.render = function () {
        this.renderer.render(this.scene, this.camera);
    };

    let self = this;
    let last = Date.now();
    this.run = function () {
        var now = Date.now();
        var dt = now - last;
        last = now;

        // self.animate(dt);
        self.physics(dt);
        self.render();

        if (self.running) {
            requestAnimationFrame(self.run);
        }
    }
}

window.addEventListener('load', function () {
    let app = new DiceApplication();
    app.run();
});

