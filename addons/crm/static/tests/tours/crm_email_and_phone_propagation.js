/** @odoo-module **/
    
    import { registry } from "@web/core/registry";
    import { stepUtils } from "@web_tour/tour_service/tour_utils";

    registry.category("web_tour.tours").add('crm_email_and_phone_propagation_edit_save', {
        test: true,
        url: '/odoo',
        steps: () => [
        stepUtils.showAppsMenuItem(),
        {
            trigger: '.o_app[data-menu-xmlid="crm.crm_menu_root"]',
            content: 'open crm app',
            run: "click",
        }, {
            trigger: '.o_kanban_record:contains(Test Lead Propagation)',
            content: 'Open the first lead',
            run: 'click',
        },
        {
            trigger: ".o_form_editable .o_field_widget[name=email_from] input",
        },
        {
            trigger: '.o_form_button_save',
            content: 'Save the lead',
            run: 'click',
        },
    ]});

    registry.category("web_tour.tours").add('crm_email_and_phone_propagation_remove_email_and_phone', {
        test: true,
        url: '/odoo',
        steps: () => [
        stepUtils.showAppsMenuItem(),
        {
            trigger: '.o_app[data-menu-xmlid="crm.crm_menu_root"]',
            content: 'open crm app',
            run: "click",
        }, {
            trigger: '.o_kanban_record:contains(Test Lead Propagation)',
            content: 'Open the first lead',
            run: 'click',
        },
        {
            trigger: ".o_form_editable .o_field_widget[name=phone] input",
        },
        {
            trigger: '.o_form_editable .o_field_widget[name=email_from] input',
            content: 'Remove the email and the phone',
            run: "clear && clear .o_form_editable .o_field_widget[name=phone] input",
        },
        {
            trigger: ".o_form_sheet_bg .fa-exclamation-triangle:not(.o_invisible_modifier)",
        },
        {
            trigger: '.o_back_button',
            // wait the warning message to be visible
            content: 'Save the lead and exit to kanban',
            run: 'click',
        },{
            trigger: '.o_kanban_renderer',
        }
    ]});
