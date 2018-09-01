"""
:Date: 2018-08-31
:Author:
    - Jackson McCrea (jacksonmccrea@gmail.com)

Goal
----
    Binds web routes to the web Application
"""

from frogger.application import app
from frogger.pages.index import IndexPage


index_page = IndexPage()


@app.route('/')
def index():
    return index_page.render()


@app.route('/favicon.ico')
def static_file():
    return app.send_static_file('favicon.ico')
