#!/usr/bin/env bash

sudo service led-status stop

cd /home/pi/odoo
localbranch=$(git symbolic-ref -q --short HEAD)
localremote=$(git config branch.$localbranch.remote)

if [[ "$(git remote get-url "$localremote")" != *odoo/odoo* ]]; then
    git remote set-url "${localremote}" "https://github.com/odoo/odoo.git"
fi

echo "addons/iot_box_image/overwrite_after_init/home/pi/odoo" >> .git/info/sparse-checkout

git fetch "${localremote}" "${localbranch}" --depth=1
git reset "${localremote}"/"${localbranch}" --hard

sudo git clean -dfx
if [ -d /home/pi/odoo/addons/iot_box_image/overwrite_after_init ]; then
    cp -a /home/pi/odoo/addons/iot_box_image/overwrite_after_init/home/pi/odoo/* /home/pi/odoo/
    rm -r /home/pi/odoo/addons/iot_box_image/overwrite_after_init
fi

# TODO: Remove this code when v16 is deprecated
odoo_conf="addons/iot_box_image/configuration/odoo.conf"
if ! grep -q "server_wide_modules" $odoo_conf; then
    echo "server_wide_modules=hw_drivers,hw_posbox_homepage,web" >> $odoo_conf
fi

{
    sudo find /usr/local/lib/ -type f -name "*.iotpatch" 2> /dev/null | while read iotpatch; do
        DIR=$(dirname "${iotpatch}")
        BASE=$(basename "${iotpatch%.iotpatch}")
        sudo find "${DIR}" -type f -name "${BASE}" ! -name "*.iotpatch" | while read file; do
            sudo patch -f "${file}" < "${iotpatch}"
        done
    done
} || {
    true
}

sudo service led-status start
