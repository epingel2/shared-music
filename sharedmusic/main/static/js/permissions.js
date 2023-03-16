class PermissionsManager {
    constructor() {
        this.permissions = {};
        this.permsBlock = $(".permissions");
        this.settings = $(".perms-menu").children();
    }

    showPermsModal() {
        if (users.username == users.hostUsername) {
            permsModalHost.show();
            // Read the value of each setting before showing it to the host
            // And set the radio buttons "checked" property
            this.settings.each((idx, setting) => {
                setting = $(setting);
                if (setting.attr("data") == "title") {
                    return;
                }
                let currentValue = this.permissions[setting.attr("data")];
                setting.find(`input[type="radio"][value="${currentValue}"]`).prop("checked", true);
            });
        } else {
            permsModalUser.show();
        }
    }

    save() {
        if (users.username != users.hostUsername) {
            return;
        }
        // Read the values of radio buttons and update permissions object
        this.settings.each((idx, setting) => {
            setting = $(setting);
            if (setting.attr("data") == "title") {
                return;
            }
            let perm = setting.attr("data");
            let newValue = setting.find('input[type="radio"]:checked').val();
            this.permissions[perm] = newValue;
        });
        roomSocket.send(
            JSON.stringify({
                event: "CHANGE_PERMISSIONS",
                message: "Room permissions changed",
                permissions: this.permissions,
            })
        );
        permsModalHost.hide();
    }

    updatePerms(newPerms) {
        this.permissions = newPerms;
        this.render();
    }

    render() {
        console.log(this.permissions);
        let dict = {
            PAUSE: "Pause track",
            ADD_TRACK: "Add track",
            CHANGE_TIME: "Change time",
            CHANGE_TRACK: "Change track",
            DELETE_TRACK: "Delete track",
        };
        let allow = 1;
        if (users.username === users.hostUsername) {
            allow = 5;
        }
        this.permsBlock.text("");
        for (let perm in this.permissions) {
            let sign = '<i class="fa-solid fa-xmark"></i>';
            if (this.permissions[perm] <= allow) {
                // if allowed
                sign = '<i class="fa-solid fa-check"></i>';
            }
            let node = `<div>${dict[perm]}: ${sign}</div>`;
            this.permsBlock.append(node);
        }
    }
}

const permissions = new PermissionsManager();
