// Player elements
const timeline = $(".timeline");
const progressBar = $(".progress");
const volumeEl = $(".volume-container .volume");
const volumeSlider = $(".controls .volume-slider");
const playBtn = $(".controls .toggle-play");
const thumb = $(".name .thumb");
const tooltip = $(".progress-tooltip");

const title = $(".name .title");
const length = $(".time .length");
const currentTime = $(".time .current");
const volumeButton = $(".volume-button");

let player;
let loop = false;

function onYouTubeIframeAPIReady() {
    player = new YoutubePlayer();
}

class YoutubePlayer {
    constructor() {
        this.ytPlayer = new YT.Player("player", {
            height: "240",
            width: "320",
            videoId: "",
            playerVars: { controls: 0, disablekb: 1 },
            events: {
                onReady: this.onPlayerReady,
                onStateChange: this.onPlayerStateChange,
                onError: this.onPlayerError,
            },
        });
    }

    // Arrow functions used because these are event handlers (this.ytPlayer is undefined otherwise)
    onPlayerReady = (event) => {
        length.text(getTimeCodeFromNum(this.ytPlayer.getDuration()));
        if (localStorage.getItem("volume") === null) {
            this.ytPlayer.setVolume(50);
            localStorage.setItem("volume", 50);
        } else {
            this.ytPlayer.setVolume(localStorage.getItem("volume"));
        }
        this.mutePlayer();
        title.text(this.ytPlayer.getVideoData().title);

        // Set click listener to the whole page
        const firstClickListener = (event) => {
            if (isFirstClick) {
                isFirstClick = false;
                this.unMutePlayer();
                console.log("No longer muted!");
                document.getElementById("mute-msg").style.display = "none";
            }
        };
        document.addEventListener("mouseup", firstClickListener);

        //click on timeline to skip around
        timeline.click((e) => {
            const timelineWidth = timeline.width();
            const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * this.ytPlayer.getDuration();
            roomSocket.send(
                JSON.stringify({
                    event: "CHANGE_TIME",
                    time: timeToSeek,
                    message: "Change time.",
                })
            );
        });

        //hover over timeline to see time in current mouse position
        timeline.mousemove((e) => {
            const timelineWidth = timeline.width();
            const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * this.ytPlayer.getDuration();
            tooltip.text(getTimeCodeFromNum(timeToSeek));
            const tooltipPosition =
                e.pageX + tooltip.width() + 15 < $("body").width()
                    ? e.pageX + 10 + "px"
                    : $("body").width() - tooltip.width() - 5 + "px";
            tooltip.css("left", tooltipPosition);
        });

        //click (or hold) volume slider to change volume
        volumeSlider.change((e) => {
            renderVolumeSlider();
            let newVolume = volumeSlider.val();
            this.ytPlayer.setVolume(newVolume);
            localStorage.setItem("volume", newVolume);
            if (newVolume == 0) {
                this.mutePlayer();
            } else if (this.ytPlayer.isMuted() && newVolume != 0) {
                // Just change the icon and unmute
                this.ytPlayer.unMute();
                volumeEl.addClass("icono-volumeMedium");
                volumeEl.removeClass("icono-volumeMute");
            }
        });

        //check audio percentage and update time accordingly
        setInterval(() => {
            progressBar.width(
                (this.ytPlayer.getCurrentTime() / this.ytPlayer.getDuration()) * 100 + "%"
            );
            currentTime.text(getTimeCodeFromNum(this.ytPlayer.getCurrentTime()));
        }, 100);

        //toggle between playing and pausing on button click
        playBtn.click(() => {
            if (!this.isPaused()) {
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

        volumeButton.click(() => {
            if (!this.ytPlayer.isMuted()) {
                this.mutePlayer();
            } else {
                this.unMutePlayer();
            }
        });

        connect();
    };

    onPlayerError = (event) => {
        console.log("Player error.");
        console.log(event);
    };

    onPlayerStateChange = (event) => {
        length.text(getTimeCodeFromNum(this.ytPlayer.getDuration()));
        title.text(this.ytPlayer.getVideoData().title);

        // If track on loop, send CHANGE_TRACK event with the same track
        if (
            event.data == YT.PlayerState.ENDED &&
            users.username == users.usersList[0].username &&
            loop
        ) {
            playlist.changeTrack(event, this.getCurrentTrackData());
            return;
        }

        if (event.data == YT.PlayerState.ENDED && users.username == users.usersList[0].username) {
            console.log(this.getCurrentTrackData());
            roomSocket.send(
                JSON.stringify({
                    event: "TRACK_ENDED",
                    message: "Track has ended. Need new one.",
                    track: this.getCurrentTrackData(),
                })
            );
        }
    };

    getCurrentTrackData() {
        const id = youtube_parser(this.ytPlayer.getVideoUrl());
        const trackData = {
            name: this.ytPlayer.getVideoData().title,
            url: youtubeRawLink + id,
            duration: this.ytPlayer.getDuration(),
            currentTime: this.ytPlayer.getCurrentTime(),
            isPaused: this.isPaused(),
        };
        return trackData;
    }

    seekTo(time) {
        this.ytPlayer.seekTo(time);
    }

    loadVideoById(id, time = 0) {
        this.ytPlayer.loadVideoById(id, time);
        if (id) {
            this.setThumbnail(id);
        }
    }

    stopVideo() {
        this.ytPlayer.stopVideo();
    }

    isPaused() {
        const state = this.ytPlayer.getPlayerState();
        return state == 2 || state == -1;
    }

    setThumbnail(id) {
        fetch("https://noembed.com/embed?url=" + youtubeRawLink + id)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error(data.error);
                    throw Error;
                }
                console.log(data);
                let url = data.thumbnail_url;
                thumb.attr("src", url);
                thumb.attr("hidden", false);
            })
            .catch((err) => {
                console.log(`Failed to get video thumbnail from id=${id}`);
            });
    }

    mutePlayer() {
        this.ytPlayer.mute();
        // Change the volume percentage to zero
        volumeSlider.val(0);
        renderVolumeSlider();
        volumeEl.removeClass("icono-volumeMedium");
        volumeEl.addClass("icono-volumeMute");
    }

    unMutePlayer() {
        this.ytPlayer.unMute();
        // Restore the volume percentage as it was before mute
        let newVolume = this.ytPlayer.getVolume();
        if (newVolume == 0) {
            // Restore to default value it was zero
            newVolume = 50;
            this.ytPlayer.setVolume(50);
        }
        volumeSlider.val(newVolume);
        renderVolumeSlider();
        volumeEl.addClass("icono-volumeMedium");
        volumeEl.removeClass("icono-volumeMute");
    }

    pauseTrack() {
        playBtn.removeClass("pause");
        playBtn.addClass("play");
        stopEqualizerAnimation();
        this.ytPlayer.pauseVideo();
    }

    playTrack() {
        playBtn.removeClass("play");
        playBtn.addClass("pause");
        startEqualizerAnimation();
        this.ytPlayer.playVideo();
    }
}
