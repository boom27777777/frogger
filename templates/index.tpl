{% extends 'base.tpl' %}
{% block content %}
    <div class="container">
        <div class="row">
            <div class="col-lg-6 col-md-8 col-sm12 card">
                <div class="hidden">
                    <img id="tile-grass" src="/static/img/fantasy.png" alt="grass">
                </div>
                <p class="card-body">This is an example tile map to handle combat on.</p>
                <div id="app-container">
                    <canvas id="application"></canvas>
                </div>
                <div class="card-footer">
                    <input id="grid-lines" type="checkbox">
                    <label for="grid-lines">
                        Show Grid Lines
                    </label>
                    <br>
                    Selected Tile: <br><span id="coords">0, 0</span>
                </div>
            </div>
        </div>
    </div>
    <script src="/static/js/tilemap.js"></script>
{% endblock %}
