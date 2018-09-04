function get(path, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(this.responseText)
        }
    };
    xhttp.open('GET', path);
    xhttp.send();
}

function Lock(number, callback) {
    this.locks = number;
    this.unlock = function () {
        this.locks--;
        if (this.locks === 0) {
            callback();
        }
    }

}

let images = {};
function tileImage(path) {
    let realPath = '/static/maps/' + path;
    let image;
    if (images[realPath] !== undefined) {
        image = images[realPath];
    }
    else {
        image = new Image();
        image.src = '/static/maps/' + path;
        images[realPath] = image
    }
    return image;
}

function TileMap(canvas, blob) {
    this.canvas = canvas;
    this.map = blob;

    this.ctx = this.canvas.getContext('2d');

    this.tileSize = 32;

    this.height = this.map.height;
    this.width = this.map.width;

    this.line = function (startX, startY, endX, endY) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    };

    this.box = function (x, y, w, h) {
        this.ctx.strokeRect(x, y, w, h);
        this.ctx.stroke()
    };

    this.loadTileSets = function () {
        this.tileSets = {};
        let self = this;
        let lock = new Lock(this.map.tilesets.length, function () {self.render()});
        this.map.tilesets.forEach(function (tileset) {
            let path = '/static/maps/' + tileset.source;
            get(path, function (response) {
                self.tileSets[tileset.firstgid] = JSON.parse(response);

                // Preload image
                tileImage(self.tileSets[tileset.firstgid].image).onload = function () {
                    lock.unlock();
                };
            })
        });
    };

    this.getTile = function (tileGID) {
        let tileSet = this.tileSets[1]; //TODO: Determine the tile set a GID belongs to
        let tileWidth = tileSet.tilewidth;
        let tileHeight = tileSet.tileheight;
        let image;
        if (tileGID > 0) {
            image = tileImage(tileSet.image);
        }
        else {
            return
        }

        let x = (tileGID - 1) % tileSet.columns * tileWidth;
        let y = Math.floor((tileGID - 1) / tileSet.columns) * tileHeight;

        return {x: x, y: y, w: tileWidth, h: tileHeight, image: image}
    };

    this.grid = function () {
        let layer = this.map.layers[0];
        for (let x = 0; x < layer.width; x++) {
            for (let y = 0; y < layer.height; y++) {
                let pos = this.getTile(layer.data[x + y * layer.width]);
                if (pos !== undefined) {
                    this.ctx.drawImage(
                        pos.image,
                        pos.x,
                        pos.y,
                        pos.w,
                        pos.h,
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    )
                }
            }
        }
    };

    this.render = function () {
        if (this.tileSets === undefined) {
            this.loadTileSets();
            return
        }
        this.rect = {
            x: 0,
            y: 0,
            w: this.canvas.width,
            h: this.canvas.height,
        };

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.box(0, 0, this.canvas.width, this.canvas.height);
        this.grid();
    };

    this.getCell = function (posX, posY) {
        let x = (posX - posX % this.tileSize) / this.tileSize;
        let y = (posY - posY % this.tileSize) / this.tileSize;
        return {x: x, y: y};
    };

    this.highlight = function (posX, posY) {
        let cell = this.getCell(posX, posY);
        this.render();
        this.ctx.strokeStyle = 'red';
        this.box(cell.x * this.tileSize, cell.y * this.tileSize, this.tileSize, this.tileSize);
        this.ctx.strokeStyle = 'black';
        document.getElementById('coords').innerText = cell.x + ', ' + cell.y;
    };
}

function Application(blob) {
    this.canvas = document.getElementById('application');
    this.canvas.width = blob.width * blob.tilewidth;
    this.canvas.height = blob.height * blob.tileheight;

    this.tilemap = new TileMap(this.canvas, blob);

    this.resize = function () {
        let self = this;
        return function () {
            let container = document.getElementById('app-container').getBoundingClientRect();
            self.canvas.width = self.width;
            self.canvas.height = self.height;
            self.tilemap.render();
        }
    };

    this.mouseMove = function () {
        let self = this;
        return function (event) {
            let bounds = self.canvas.getBoundingClientRect();
            let x = event.clientX - bounds.x;
            let y = event.clientY - bounds.y;
            self.tilemap.highlight(x, y);
        }
    };

    window.addEventListener('resize', this.resize());
    this.canvas.addEventListener('mousemove', this.mouseMove());
}

window.onload = function () {
    get('/static/maps/example.json', function (response) {
        let app = new Application(JSON.parse(response));
        app.tilemap.render();
    });
};
