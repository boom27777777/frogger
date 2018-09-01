"""
:Date: 2018-08-31
:Author:
    - Jackson McCrea (jacksonmccrea@gmail.com)

Goal
----
    Provide a single Application instance
"""

from flask import Flask
from jinja2 import Environment, FileSystemLoader, select_autoescape

app = Flask(__name__, static_folder='../static', static_url_path='/static')

enviroment = Environment(
    auto_reload=True,
    loader=FileSystemLoader('templates'),
    autoescape=select_autoescape(['html'])
)
