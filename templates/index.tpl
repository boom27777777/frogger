{% extends 'base.tpl' %}
{% block content %}
    <div class="container-fluid">
        <div class="card-deck">
            <div class="card shadow-sm">
                <div class="card-header"><h5>Tiled Game Map</h5></div>
                <div class="card-body">
                    <div class="card-text">
                        This is an example tile map to handle combat on.
                    </div>
                    Map made with <a href="https://www.mapeditor.org/">Tiled</a> using this
                    <a href="/static/img/fantasy.png">Tile Set</a>
                    <br>
                </div>
                <div class="app-container card-footer">
                    <input id="grid-lines" type="checkbox">
                    <label for="grid-lines">
                        Show Grid Lines
                    </label>
                    <br>
                    Selected Tile: <br><span id="coords">0, 0</span>
                    <canvas id="application" width="320" height="320"></canvas>
                </div>
            </div>
            <div class="card shadow-sm">
                <div class="card-header"><h5>3D Dice Roller</h5></div>
                <div class="card-body">
                    This is an example dice roller
                </div>
                <div class="app-container card-footer">
                    <canvas id="dice" width="320" height="320"></canvas>
                </div>
            </div>
        </div>
    </div>
    <script src="/static/js/tilemap.js"></script>
    <script src="/static/js/three.min.js"></script>
    <script src="/static/js/dice.js"></script>
{% endblock %}
