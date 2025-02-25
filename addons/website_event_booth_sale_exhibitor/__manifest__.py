# -*- coding: utf-8 -*-

{
    'name': 'Booths Sale/Exhibitors Bridge',
    'category': 'Marketing/Events',
    'version': '1.0',
    'summary': 'Bridge module between website_event_booth_exhibitor and website_event_booth_sale.',
    'depends': ['website_event_exhibitor', 'website_event_booth_sale'],
    'auto_install': True,
    'assets': {
        'web.assets_tests': [
            'website_event_booth_sale_exhibitor/static/tests/tours/website_event_booth_sale_exhibitor.js',
        ],
    },
    'author': 'Odoo S.A.',
    'license': 'LGPL-3',
}
