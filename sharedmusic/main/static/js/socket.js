const roomCode = $("#room").attr("room_code");
const protocol = window.location.protocol == "https:" ? "wss://" : "ws://";
const connectionString = protocol + window.location.host + "/ws/room/" + roomCode + "/";

let roomSocket = null;

// connect function is called only when player is ready
function connect() {
    roomSocket = new WebSocket(connectionString);
    roomSocket.onopen = () => {
        showContent();
        console.log("WebSocket connection created.");
        roomSocket.send(
            JSON.stringify({
                event: "CONNECT",
                message: users.username,
            })
        );
    };

    roomSocket.onerror = (e) => {
        console.log("WebSocket error.");
        const loading = $(".loading");
        const content = $(".content");
        if (loading.hasClass("hidden")) {
            content.addClass("hidden");
            loading.removeClass("hidden");
        }
        $(".loading__message").text("");
        $(".loading__error").text("Connection lost... Trying to reconnect");
    };

    roomSocket.onclose = (e) => {
        if (e.code === 1006) {
            // reconnect in 5 secs (player will be reloaded correctly)
            setTimeout(function () {
                connect();
            }, 5000);
        }
        player.pauseTrack();
    };

    roomSocket.onmessage = (e) => {
        let data = JSON.parse(e.data);
        data = data["payload"];
        console.log(data);

        if (data.event == "CONNECT") {
            permissions.updatePerms(data.permissions);
            users.updateUserList(data.listeners.users);
            chat.updateMessages(data.recent_messages);
            if (users.username === data.user) {
                playlist.updateTracks(data.playlist);
            }
        }
        if (data.event == "SEND_EXTRA_INFO") {
            if (data.mute_list) {
                users.updateMutelist(data.mute_list.map((user) => user.username));
            }
            if (data.ban_list) {
                users.updateBanlist(data.ban_list);
            }
        }
        if (data.event == "GET_TRACK_FROM_LISTENERS") {
            const trackData = player.getCurrentTrackData();
            roomSocket.send(
                JSON.stringify({
                    event: "SEND_TRACK_TO_NEW_USER",
                    message: "Send track to new user.",
                    user: data.receiver,
                    track: trackData,
                    loop: loop,
                })
            );
        }
        if (data.event == "DISCONNECT") {
            users.updateUserList(data.listeners.users);
        }
        if (data.event == "ALREADY_CONNECTED") {
            roomSocket.close(1000, (reason = "qweqweqweS"));
            console.log("Closing connection. Refresh the page.");
        }
        if (data.event == "ADD_TRACK") {
            if (!data.created) {
                playlist.setError("Track is already in playlist");
                return;
            }
            playlist.updateTracks(data.playlist);
        }
        if (data.event == "CHANGE_TRACK") {
            const id = youtube_parser(data.track.url);
            player.loadVideoById(id);
            player.playTrack();
            playlist.updateActiveTrackUrl(data.track.url);
            // In case youtube locally changes starting time (especially on long videos)
            //player.seekTo(0);
        }
        if (data.event == "SET_CURRENT_TRACK") {
            const id = youtube_parser(data.track.url);
            player.loadVideoById(id, data.track.currentTime);
            player.playTrack();
            if (data.track.isPaused) {
                setTimeout(() => {
                    player.pauseTrack();
                }, 500);
            }
            playlist.updateActiveTrackUrl(data.track.url);
            if (data.loop) {
                $(".repeat-btn").children().toggleClass("repeat-active");
                loop = data.loop;
            }
        }
        if (data.event == "DELETE_TRACK") {
            playlist.updateTracks(data.playlist);
            let currentTrackId = youtube_parser(player.getCurrentTrackData().url);
            let deletedTrackId = youtube_parser(data.deletedTrackInfo.url);
            if (currentTrackId && currentTrackId == deletedTrackId) {
                player.stopVideo();
                player.loadVideoById("");
                playlist.updateActiveTrackUrl("");
                progressBar.width(0);
                thumb.attr("src", "");
                thumb.attr("hidden", true);
            }
        }
        if (data.event == "PLAY") {
            player.playTrack();
        }
        if (data.event == "PAUSE") {
            player.pauseTrack();
        }
        if (data.event == "CHANGE_TIME") {
            player.seekTo(data.time);
        }
        if (data.event == "CHANGE_LOOP") {
            $(".repeat-btn").toggleClass("repeat-active");
            loop = !loop;
        }
        if (data.event == "HOST_CHANGED") {
            $("#host").attr("host_username", data.new_host);
            hostUsername = $("#host").attr("host_username");
            users.updateHost();
            permissions.render();
        }
        if (data.event == "CHANGE_PERMISSIONS") {
            permissions.updatePerms(data.permissions);
            toastr["info"]("Room permissions have been changed");
        }
        if (data.event == "ROOM_NOT_ALLOWED") {
            toastr["error"]("Insufficient permissions");
        }
        if (data.event == "SEND_CHAT_MESSAGE") {
            chat.updateMessages([...chat.messages, data.chat_message]);
        }
        if (data.event == "BAN_USER") {
            console.log("You have been banned.");
            users.handleUserBan();
            roomSocket.close();
        }
        if (data.event == "MUTE_LISTENER") {
            $("#muted-message").removeClass("hidden");
            toastr["warning"]("You have been muted");
        }
        if (data.event == "UNMUTE_LISTENER") {
            toastr["info"]("You are no longer muted");
        }
        if (data.event == "LISTENER_MUTED") {
            toastr["error"]("You are muted");
        }
    };

    if (roomSocket.readyState == WebSocket.OPEN) {
        roomSocket.onopen();
    }
}
