{% extends 'base.tpl' %}
{% block content %}
    <div class="container">
        <div class="col-lg-2 col-md-2 card">
            <div class="card-body">Demo App</div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Test!</li>
                <li class="list-group-item">Selected Tile: <br><span id="coords">0, 0</span></li>
            </ul>
        </div>
        <div class="col-lg-8 col-md-8 col-sm12 offset-lg-2 offset-md-2">
            <div class="hidden">
                <img id="tile-grass" src="/static/img/fantasy.png" alt="grass">
            </div>
            <div id="app-container">
                <canvas id="application" width="100%"></canvas>
            </div>
        </div>
    </div>
{% endblock %}
