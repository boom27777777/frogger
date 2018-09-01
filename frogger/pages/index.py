"""
:Date: 2018-08-31
:Author:
    - Jackson McCrea (jacksonmccrea@gmail.com)
"""
from .base import BasePage


class IndexPage(BasePage):
    def __init__(self):
        super().__init__('index.tpl')
