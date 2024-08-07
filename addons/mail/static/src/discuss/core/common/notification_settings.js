import { Component, useState } from "@odoo/owl";
import { ActionPanel } from "@mail/discuss/core/common/action_panel";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";
import { useService } from "@web/core/utils/hooks";

export class NotificationSettings extends Component {
    static components = { ActionPanel, Dropdown, DropdownItem };
    static props = ["hasSizeConstraints?", "thread", "close?", "className?"];
    static template = "discuss.NotificationSettings";

    setup() {
        this.store = useState(useService("mail.store"));
    }

    setMute(minutes) {
        this.store.settings.setMuteDuration(minutes, this.props.thread);
        this.props.close?.();
    }
}
