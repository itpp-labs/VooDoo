/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

const MESSAGE_TYPE = {
    UNEXPECTED_CALL_TERMINATION: "UNEXPECTED_CALL_TERMINATION",
};
const PUSH_NOTIFICATION_TYPE = {
    CALL: "CALL",
    CANCEL: "CANCEL",
};
const PUSH_NOTIFICATION_ACTION = {
    ACCEPT: "ACCEPT",
    DECLINE: "DECLINE",
};

/**
 * @param {number} channelId id of the mail discuss channel
 * @param {Object} param1
 * @param {string} [param1.action] odoo client action
 * @param {boolean} [param1.joinCall] whether we want to join a call on that channel
 * @param {Client | ServiceWorker | MessagePort} [source] if set, will not open the channel on the source
 */
async function openDiscussChannel(channelId, { action, joinCall = false, source } = {}) {
    const discussURLRegexes = [new RegExp("/odoo/discuss")];
    if (action) {
        discussURLRegexes.push(
            new RegExp(`/odoo/\\d+/action-${action}`),
            new RegExp(`/odoo/action-${action}`)
        );
    }
    let targetClient;
    for (const client of await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
    })) {
        if (source && source.id === client.id) {
            continue;
        }
        if (!targetClient || discussURLRegexes.some((r) => r.test(new URL(client.url).pathname))) {
            targetClient = client;
        }
    }
    if (targetClient) {
        targetClient.postMessage({ action: "OPEN_CHANNEL", data: { id: channelId, joinCall } });
        targetClient.focus().catch();
        return;
    }
    if (action) {
        const url = new URL(`/odoo/action-${action}`, location.origin);
        url.searchParams.set("active_id", `discuss.channel_${channelId}`);
        if (joinCall) {
            url.searchParams.set("call", "accept");
        }
        await self.clients.openWindow(url.toString());
    }
}

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    if (event.notification.data) {
        const { action, model, res_id } = event.notification.data;
        if (model === "discuss.channel") {
            if (event.action === PUSH_NOTIFICATION_ACTION.DECLINE) {
                event.waitUntil(
                    fetch("/mail/rtc/channel/leave_call", {
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify({
                            id: 1,
                            jsonrpc: "2.0",
                            method: "call",
                            params: { channel_id: res_id },
                        }),
                        method: "POST",
                        mode: "cors",
                        credentials: "include",
                    })
                );
                return;
            }
            event.waitUntil(
                openDiscussChannel(res_id, {
                    action,
                    joinCall: event.action === PUSH_NOTIFICATION_ACTION.ACCEPT,
                })
            );
        } else {
            const modelPath = model.includes(".") ? model : `m-${model}`;
            event.waitUntil(clients.openWindow(`/odoo/${modelPath}/${res_id}`));
        }
    }
});
self.addEventListener("push", async (event) => {
    const notification = event.data.json();
    switch (notification.options?.data?.type) {
        case PUSH_NOTIFICATION_TYPE.CALL:
            if (notification.options.actions && navigator.userAgent.includes("Android")) {
                // action "accept" is disabled on mobile until: https://issues.chromium.org/issues/40286493 is fixed.
                delete notification.options.actions.accept;
            }
            break;
        case PUSH_NOTIFICATION_TYPE.CANCEL: {
            const notifications = await self.registration.getNotifications({
                tag: notification.options?.tag,
            });
            for (const notification of notifications) {
                notification.close();
            }
            return;
        }
    }
    event.waitUntil(
        self.registration.showNotification(notification.title, notification.options || {})
    );
});
self.addEventListener("pushsubscriptionchange", async (event) => {
    const subscription = await self.registration.pushManager.subscribe(
        event.oldSubscription.options
    );
    await fetch("/web/dataset/call_kw/mail.push.device/register_devices", {
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            method: "call",
            params: {
                model: "mail.push.device",
                method: "register_devices",
                args: [],
                kwargs: {
                    ...subscription.toJSON(),
                    previousEndpoint: event.oldSubscription.endpoint,
                },
                context: {},
            },
        }),
        method: "POST",
        mode: "cors",
        credentials: "include",
    });
});
self.addEventListener("message", ({ data, source }) => {
    switch (data.name) {
        case MESSAGE_TYPE.UNEXPECTED_CALL_TERMINATION:
            openDiscussChannel(data.channelId, { joinCall: true, source });
            break;
    }
});
