{% extends 'base.tpl' %}
{% block content %}
    <div class="container">
        <div class="card-deck">
            <div class="card shadow-sm">
                <canvas id="application" class="card-img-top"></canvas>
                <div class="card-header"><h5>Tiled Game Map</h5></div>
                <div class="card-body">
                    <div class="card-text">
                        This is an example tile map to handle combat on.
                    </div>
                    Map made with <a href="https://www.mapeditor.org/">Tiled</a> using this
                    <a href="/static/img/fantasy.png">Tile Set</a>
                    <br>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <input id="grid-lines" type="checkbox">
                        <label for="grid-lines">
                            Show Grid Lines
                        </label>
                    </li>
                    <li class="list-group-item">
                        Selected Tile: <br><span id="coords">0, 0</span>
                    </li>
                </ul>

            </div>
            <div class="card shadow-sm">
                <canvas id="dice" width="500" height="500" class="card-img-top"></canvas>
                <div class="card-header"><h5>3D Dice Roller</h5></div>
                <div class="card-body">
                    <div class="card-text">
                        This is an example dice roller made with <a href="https://threejs.org/">three.js</a> a 3D
                        graphics framework for JavaScript
                    </div>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><button id="roll-dice" class="btn btn-outline-primary">Roll the Dice!</button></li>
                    <li id="dice-results" class="list-group-item">You Rolled: </li>
                </ul>
            </div>
        </div>
    </div>
    <script src="/static/js/tilemap.js"></script>
    <script src="/static/js/three.min.js"></script>
    <script src="/static/js/cannon.js"></script>
    <script src="/static/js/dice.js"></script>
{% endblock %}
