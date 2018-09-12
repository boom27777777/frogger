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

    // This is a tuning value needed when scaling the canvas
    this.margin = {x: 0.5, y: 0.2, w: 0.5, h: 0.5};

    this.tileSize = 32;

    this.height = this.map.height;
    this.width = this.map.width;

    this.showGridLines = false;
    this.highlighted = {x: -1, y: -1};

    this.line = function (startX, startY, endX, endY) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    };

    this.box = function (x, y, w, h, color) {
        if (color === undefined) color = 'black';

        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x, y, w, h);
        this.ctx.stroke()
    };

    this.loadTileSets = function () {
        this.tileSets = {};
        let self = this;
        let lock = new Lock(this.map.tilesets.length, function () {
            self.render()
        });
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
        let tileSet;
        let offset = 0;
        if (tileGID >= 668) {
            tileSet = this.tileSets[668];
            offset = 667;
        }
        else {
            tileSet = this.tileSets[1]; //TODO: Determine the tile set a GID belongs to
        }
        let tileWidth = tileSet.tilewidth;
        let tileHeight = tileSet.tileheight;
        let image;
        if (tileGID > 0) {
            image = tileImage(tileSet.image);
        }
        else {
            return
        }

        let x = (tileGID - offset - 1) % tileSet.columns * tileWidth;
        let y = Math.floor((tileGID - offset - 1) / tileSet.columns) * tileHeight;

        return {x: x, y: y, w: tileWidth, h: tileHeight, image: image}
    };

    this.drawTile = function (x, y, layer) {
        let pos = this.getTile(layer.data[x + y * layer.width]);
        if (pos !== undefined) {
            this.ctx.drawImage(
                pos.image,
                pos.x + this.margin.x,
                pos.y + this.margin.y,
                pos.w - this.margin.x,
                pos.h - this.margin.y,
                x * this.tileSize - this.margin.w,
                y * this.tileSize - this.margin.h,
                this.tileSize + this.margin.w,
                this.tileSize + this.margin.h
            )
        }
        if (this.showGridLines) {
            this.box(
                x * this.tileSize,
                y * this.tileSize,
                this.tileSize,
                this.tileSize,
                'darkgrey'
            )
        }
    };

    this.grid = function () {
        for (let current = 0; current < this.map.layers.length; current++) {
            let layer = this.map.layers[current];
            for (let y = 0; y < layer.width; y++) {
                for (let x = 0; x < layer.height; x++) {
                    this.drawTile(x, y, layer)
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
        if (this.highlighted.x !== -1 && this.highlighted.y !== -1) {
            this.box(
                this.highlighted.x * this.tileSize,
                this.highlighted.y * this.tileSize,
                this.tileSize,
                this.tileSize,
                'red'
            );
        }
    };

    this.getCell = function (posX, posY) {
        let x = (posX - posX % this.tileSize) / this.tileSize;
        let y = (posY - posY % this.tileSize) / this.tileSize;
        return {x: x, y: y};
    };

    this.highlight = function (posX, posY) {
        this.highlighted = this.getCell(posX, posY);
        this.render();
        document.getElementById('coords').innerText =
            Math.round(this.highlighted.x) + ', ' + Math.round(this.highlighted.y);
    };
}

function Application(blob) {
    this.canvas = document.getElementById('application');
    let square = this.canvas.clientWidth;
    this.canvas.width = square;
    this.canvas.height = square;

    this.tilemap = new TileMap(this.canvas, blob);

    this.resize = function () {
        let self = this;
        return function () {
            let square = self.canvas.clientWidth;
            self.canvas.width = square;
            self.canvas.height = square;
            self.tilemap.tileSize = Math.ceil(self.canvas.clientWidth / self.tilemap.map.width);
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

    this.grindLines = function () {
        let self = this;
        return function () {
            self.tilemap.showGridLines = this.checked;
            self.tilemap.render();
        }
    };

    this.mouseoverGridlines = function () {
        let self = this;
        return function () {
            self.tilemap.showGridLines = true;
            self.tilemap.render();
        }
    };

    this.mouseoutGridlines = function () {
        let self = this;
        return function () {
            self.tilemap.showGridLines = false;
            self.tilemap.render();
        }
    };

    window.addEventListener('resize', this.resize());
    this.canvas.addEventListener('click', this.mouseMove());
    this.canvas.addEventListener('mouseover', this.mouseoverGridlines());
    this.canvas.addEventListener('mouseout', this.mouseoutGridlines());
    document.getElementById('grid-lines').addEventListener('input', this.grindLines())
}

window.addEventListener('load', function () {
    get('/static/maps/example.json', function (response) {
        let app = new Application(JSON.parse(response));
        app.resize()();
    });
});
