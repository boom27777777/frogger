function TileMap(canvas, width, height) {
    this.canvas = canvas;

    this.ctx = this.canvas.getContext('2d');
    this.tileset = {
        1: '/static/img/grass.png'
    };

    this.tileSize = 50;

    this.height = 10;
    this.width = 10;

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

    this.grid = function () {
        for (let i = 0; i < this.rect.w; i += this.tileSize) {
            for (let j = 0; j < this.rect.h; j += this.tileSize) {
                let x = i;
                let y = j;
                let w = this.tileSize;
                let h = this.tileSize;

                let grass = new Image();
                grass.src = '/static/img/grass.png';
                this.ctx.drawImage(grass, x, y, w, h);
                this.box(x, y, w, h);
            }
        }
    };

    this.render = function () {
        this.rect = {
            x: 0,
            y: 0,
            w: this.canvas.width,
            h: this.canvas.height,
        };

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.grid();
        this.line(this.rect.w, 0, this.rect.w, this.rect.h);
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
    };
}

function Application() {
    this.canvas = document.getElementById('application');
    this.tilemap = this.tilemap = new TileMap(this.canvas);

    this.resize = function () {
        let self = this;
        return function () {
            let container = document.getElementById('app-container').getBoundingClientRect();
            self.canvas.width = container.width;
            self.canvas.height = window.innerHeight - container.top;
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
    window.dispatchEvent(new Event('resize'));
}

window.onload = function () {
    let app = new Application();
};
