class PlaylistManager {
    constructor() {
        this.urlField = $("#url-field");
        this.playlistTooltip = $("#playlist-tooltip");
        this.playlist = $("#playlist");
        this.playlistError = $("#playlist-error");
        this.playlistContent = [];
        this.activeTrackUrl = "";
    }

    deleteTrack(event, trackData, chosenTrackUrl) {
        roomSocket.send(
            JSON.stringify({
                event: "DELETE_TRACK",
                message: "Delete track.",
                track: trackData,
                chosenTrackUrl: chosenTrackUrl,
            })
        );
    }

    changeTrack(event, trackData) {
        roomSocket.send(
            JSON.stringify({
                event: "CHANGE_TRACK",
                message: "Change track.",
                track: trackData,
            })
        );
    }

    updateTracks(newPlaylist) {
        this.playlistContent = newPlaylist;
        this.render();
    }

    updateActiveTrackUrl(url) {
        this.activeTrackUrl = url;
        this.render();
    }

    render() {
        this.clear();
        search.render();
        if (this.playlistContent.length === 0) {
            this.playlist.text("No tracks in playlist :(");
        }
        this.playlistContent.forEach((track) => {
            let trackElement = $(`<div class="playlist__track"></div>`);
            let playButton = $(
                `<button title="Play track" class="track__playButton"><i class="fas fa-play"></i></button>`
            );
            let trackTitle = $(
                `<div class="track__title" data-title="${track.name}">${track.name}</div>`
            );
            let deleteButton = $(
                `<button title="Delete track from playlist" class="track__deleteButton"><i class="fa-solid fa-trash-can"></i></button>`
            );
            let trackData = {
                name: track.name,
                url: track.url,
            };
            playButton.on("click", (e) => {
                this.changeTrack(e, track);
            });
            try {
                let activeTrackId = youtube_parser(this.activeTrackUrl);
                let trackId = youtube_parser(track.url);
                if (activeTrackId === trackId) {
                    playButton = $(`
              <div title="Play/Pause track" class="box">
                <div class="line-1"></div>
                <div class="line-2"></div>
                <div class="line-3"></div>
                <div class="line-4"></div>
                <div class="line-5"></div>
              </div>`);
                    playButton.on("click", (e) => {
                        if (!player.isPaused()) {
                            roomSocket.send(
                                JSON.stringify({
                                    event: "PAUSE",
                                    message: "Track is now paused.",
                                })
                            );
                        } else {
                            roomSocket.send(
                                JSON.stringify({
                                    event: "PLAY",
                                    message: "Track is now playing",
                                })
                            );
                        }
                    });
                }
            } catch (error) {
                console.log(error);
            }
            deleteButton.on("click", (e) => {
                this.deleteTrack(e, trackData, this.activeTrackUrl);
            });
            trackTitle.hover(
                (e) => tooltipHover(e, track.name, this.playlistTooltip),
                (e) => tooltipUnhover(e, this.playlistTooltip)
            );
            trackElement.append(playButton, trackTitle, deleteButton);
            this.playlist.prepend(trackElement);
            // If track is paused, stop animation
            if (player.isPaused()) {
                stopEqualizerAnimation();
            }
        });
    }

    clear() {
        this.playlist.empty();
    }

    addTrack() {
        const id = youtube_parser(this.urlField.val());
        fetch("https://noembed.com/embed?url=" + youtubeRawLink + id)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error(data.error);
                    throw Error;
                }
                let youtubeURL = "https://www.youtube.com/watch?v=" + id;
                let title = data.title;
                if (id) {
                    roomSocket.send(
                        JSON.stringify({
                            event: "ADD_TRACK",
                            url: youtubeURL,
                            name: title,
                            message: "Add new track.",
                        })
                    );
                } else {
                    throw Error;
                }
                this.urlField.val("");
            })
            .catch((err) => {
                console.log(`Track with id=${id} not found`);
                this.setError("Track not found");
            });
    }

    setError(error) {
        toastr["error"](error);
    }
}

const playlist = new PlaylistManager();
