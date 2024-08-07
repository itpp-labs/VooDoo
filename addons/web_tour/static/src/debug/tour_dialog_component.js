import { useService } from "@web/core/utils/hooks";
import { Dialog } from "@web/core/dialog/dialog";
import { _t } from "@web/core/l10n/translation";

import { Component } from "@odoo/owl";
import { browser } from "@web/core/browser/browser";

export default class ToursDialog extends Component {
    static template = "web_tour.ToursDialog";
    static components = { Dialog };
    static props = {
        close: Function,
    };
    setup() {
        this.tourService = useService("tour_service");
        this.notification = useService("notification");
        this.onboardingTours = this.tourService.getSortedTours().filter((tour) => !tour.test);
        this.testingTours = this.tourService.getSortedTours().filter((tour) => tour.test);
    }

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Resets the given tour to its initial step, in onboarding mode.
     *
     * @private
     * @param {MouseEvent} ev
     */
    _onStartTour(ev) {
        this.tourService.startTour(ev.target.dataset.name, { mode: "manual" });
        this.props.close();
    }
    /**
     * Starts the given tour in test mode.
     *
     * @private
     * @param {MouseEvent} ev
     */
    _onTestTour(ev) {
        this.tourService.startTour(ev.target.dataset.name, {
            mode: "auto",
            stepDelay: 500,
            showPointerDuration: 250,
        });
        this.props.close();
    }
    /**
     * Copy the url to start the tour.
     *
     * @private
     * @param {MouseEvent} ev
     */
    _copyUrlTour(ev) {
        navigator.clipboard.writeText(
            `${browser.location.origin}/odoo?tour=${ev.target.dataset.name}`
        );
        this.notification.add(_t("Url copied to clipboard"), { type: "info" });
    }
}
