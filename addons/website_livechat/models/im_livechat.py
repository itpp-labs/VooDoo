# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, models, fields
from odoo.tools.translate import html_translate


class Im_LivechatChannel(models.Model):
    _name = 'im_livechat.channel'

    _inherit = ['im_livechat.channel', 'website.published.mixin']

    def _compute_website_url(self):
        super()._compute_website_url()
        for channel in self:
            if channel.id:
                channel.website_url = "/livechat/channel/%s" % (self.env['ir.http']._slug(channel),)
            else:
                channel.website_url = channel._origin.website_url

    website_description = fields.Html(
        "Website description", default=False, translate=html_translate,
        sanitize_overridable=True,
        sanitize_attributes=False, sanitize_form=False,
        help="Description of the channel displayed on the website page")
