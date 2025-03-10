import { Activity } from "@mail/core/common/activity_model";
import { Record } from "@mail/model/record";
import { patch } from "@web/core/utils/patch";

/** @type {import("models").Activity} */
const activityPatch = {
    setup() {
        super.setup(...arguments);
        this.request_partner_id = Record.one("Persona");
    },
};
patch(Activity.prototype, activityPatch);
