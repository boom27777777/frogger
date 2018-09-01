"""
:Date: 2018-08-31
:Version: 0.0.1
:Author:
    - Jackson McCrea (jacksonmccrea@gmail.com)

Goal
----
    Serve the Dungeons & Accessibility page

Usage
-----
    ``$ python server``
"""

from frogger.application import app
import frogger.routes

if __name__ == '__main__':
    app.run(debug=True)
