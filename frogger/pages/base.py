"""
:Date: 2018-08-31
:Author:
    - Jackson McCrea (jacksonmccrea@gmail.com)
"""

from frogger.application import enviroment


class BasePage:
    def __init__(self, file_name):
        self.tpl = enviroment.get_template(file_name)
        self.styles = ['base.css']

    def _render(self, **kwargs):
        return self.tpl.render(
            stylesheets=self.styles,
            **kwargs
        )

    def render(self):
        return self._render()
