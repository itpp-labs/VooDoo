from odoo import models, api


class AccountFiscalPosition(models.Model):
    _name = 'account.fiscal.position'
    _inherit = ['account.fiscal.position', 'pos.load.mixin']

    @api.model
    def _load_pos_data_domain(self, data):
        fp_ids = [preset['fiscal_position_id'] for preset in data['pos.preset']]
        return [('id', 'in', data['pos.config'][0]['fiscal_position_ids'] + fp_ids)]

    @api.model
    def _load_pos_data_fields(self, config_id):
        return ['id', 'name', 'display_name', 'tax_map']
