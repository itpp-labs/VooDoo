# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Pakistan - Accounting',
    'website': 'https://www.odoo.com/documentation/master/applications/finance/fiscal_localizations.html',
    'icon': '/account/static/description/l10n.png',
    'countries': ['pk'],
    'version': '1.1',
    'category': 'Accounting/Localizations/Account Charts',
    'description': ' This is the base module to manage chart of accounts and localization for the Pakistan ',
    'depends': [
        'account',
    ],
    'auto_install': ['account'],
    'data': [
        'data/account_tax_vat_report.xml',
        'data/account_tax_wh_report.xml',
    ],
    'demo': [
        'demo/res_partner_demo.xml',
        'demo/demo_company.xml',
    ],
    'author': 'Odoo S.A.',
    'license': 'LGPL-3',
}
