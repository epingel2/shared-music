class UserManager {
    constructor() {
        this.username = $("#user").attr("username");
        this.hostUsername = $("#host").attr("host_username");
        this.banlistElement = $(".banlist");
        this.usersList = [];
        this.muteList = [];
        this.banList = [];
    }

    static changeHost(newHost) {
        roomSocket.send(
            JSON.stringify({
                event: "CHANGE_HOST",
                message: "Change host.",
                new_host: newHost,
            })
        );
    }

    static banUser(username) {
        roomSocket.send(
            JSON.stringify({
                event: "BAN_USER",
                message: "Ban user.",
                username: username,
            })
        );
    }

    static unbanUser(username) {
        roomSocket.send(
            JSON.stringify({
                event: "UNBAN_USER",
                message: "Unban user.",
                username: username,
            })
        );
    }

    static muteUser(username) {
        roomSocket.send(
            JSON.stringify({
                event: "MUTE_LISTENER",
                message: "Mute user.",
                username: username,
            })
        );
    }

    static unmuteUser(username) {
        roomSocket.send(
            JSON.stringify({
                event: "UNMUTE_LISTENER",
                message: "Unmute user.",
                username: username,
            })
        );
    }

    updateHost() {
        this.hostUsername = $("#host").attr("host_username");
        this.renderUserList();
    }

    updateUserList(newUsers) {
        this.usersList = newUsers;
        this.renderUserList();
    }

    updateMutelist(newMuteList) {
        this.muteList = newMuteList;
        this.renderUserList();
    }

    renderUserList() {
        $("#room-title").text(`${this.hostUsername}'s room`);
        $("#users-list").text("");
        this.usersList.forEach((user) => {
            let node = $(
                `<li>` +
                    `<div class="online"></div>` +
                    `<div class="username">${user.username}</div>` +
                    `</li>`
            );
            if (user.username != this.hostUsername && this.username == this.hostUsername) {
                let muteOption = this.muteList.includes(user.username)
                    ? `<a href="javascript:void(0)" onclick="UserManager.unmuteUser('${user.username}')">Unmute user</a>`
                    : `<a href="javascript:void(0)" onclick="UserManager.muteUser('${user.username}')">Mute user</a>`;
                let dropdownButton = $(
                    `
            <div onmouseover="dropdownHover(this)" class="dropdown">
                <button class="dropbtn"><i class="fa-regular fa-square-caret-down"></i></button>
                <div class="dropdown-content">
                    <a href="javascript:void(0)" onclick="UserManager.changeHost('${user.username}')">Change host</a>` +
                        muteOption +
                        `<a href="javascript:void(0)" onclick="UserManager.banUser('${user.username}')">Ban user</a>
                </div>
            </div>`
                );
                node.append(dropdownButton);
            }
            if (user.username == this.hostUsername) {
                let icon = '<i class="fa-solid fa-crown"></i>';
                node.append(icon);
            }
            $("#users-list").append(node);
        });
        // Hide all elements with attribute "host-only", if user is not host
        if (this.username == this.hostUsername) {
            $("[host-only]").removeClass("hidden");
        } else {
            $("[host-only]").addClass("hidden");
        }
    }

    handleUserBan() {
        $(".content").addClass("hidden");
        $(".loading").removeClass("hidden");
        $(".loading__animation").text("");
        $(".loading__error").text("You have been banned from the room");
        let time = 10;
        $(".loading__message").text(`You will be redirected to home page in ${time} seconds`);
        let timerId = setInterval(() => {
            time -= 1;
            $(".loading__message").text(`You will be redirected to home page in ${time} seconds`);
        }, 1000);
        setTimeout(() => {
            clearInterval(timerId);
            window.location.href = "/";
        }, 10000);
    }

    updateBanlist(newBanList) {
        this.banList = newBanList;
        this.renderBanlist();
    }

    renderBanlist() {
        this.banlistElement.text("");
        if (this.banList.length === 0) {
            this.banlistElement.append($("<div>No banned users :)</div>"));
        }
        this.banList.forEach((user) => {
            let element = $(`
            <div class="banned-user">
                <div class="banned-user__username">${user.username}</div>
                <button title="Unban user" onclick="UserManager.unbanUser('${user.username}')" class="btn btn-image"><i class="fa-solid fa-ban"></i></button>
            </div>
        `);
            this.banlistElement.append(element);
        });
    }
}

const users = new UserManager();
