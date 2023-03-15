const iframeElement = document.getElementById("player-sc");
const widget = SC.Widget(iframeElement);

widget.bind(SC.Widget.Events.READY, function () {
    widget.setVolume(0);
    widget.getCurrentSound((sound) => {
        console.log(sound);
    });
});

// widget.bind(SC.Widget.Events.READY, function () {
//     widget.getDuration((duration) => {
//         audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(duration);
//     });
//     if (localStorage.getItem("volume") === null) {
//         widget.setVolume(50);
//         localStorage.setItem("volume", 50);
//     } else {
//         widget.setVolume(localStorage.getItem("volume"));
//     }
//     mutePlayer();
//     widget.getCurrentSound((sound) => {
//         audioPlayer.querySelector(".name .title").textContent = sound.title;
//     });
//     setThumbnail();
//     // Set click listener to the whole page
//     document.addEventListener("mouseup", firstClickListener);
//     function firstClickListener(event) {
//         if (isFirstClick) {
//             isFirstClick = false;
//             unMutePlayer();
//             console.log("No longer muted!");
//             document.getElementById("mute-msg").style.display = "none";
//         }
//     }

//     //click on timeline to skip around
//     timeline.addEventListener("click", (e) => {
//         widget.getDuration((duration) => {
//             console.log(duration);
//             const timelineWidth = window.getComputedStyle(timeline).width;
//             const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * duration;
//             widget.seekTo(timeToSeek);
//             // roomSocket.send(
//             //     JSON.stringify({
//             //         event: "CHANGE_TIME",
//             //         time: timeToSeek,
//             //         message: "Change time.",
//             //     })
//             // );
//         });
//     });

//     //hover over timeline to see time in current mouse position
//     timeline.addEventListener("mousemove", (e) => {
//         widget.getDuration((duration) => {
//             const timelineWidth = window.getComputedStyle(timeline).width;
//             const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * duration;
//             tooltip.text(getTimeCodeFromNum(timeToSeek));
//             tooltip.get(0).style.left =
//                 e.pageX + tooltip.get(0).clientWidth + 15 < document.body.clientWidth
//                     ? e.pageX + 10 + "px"
//                     : document.body.clientWidth - tooltip.get(0).clientWidth - 5 + "px";
//         });
//     });

//     //click (or hold) volume slider to change volume
//     volumeSlider.addEventListener("input", (e) => {
//         renderVolumeSlider();
//         newVolume = volumeSlider.value;
//         widget.setVolume(newVolume);
//         localStorage.setItem("volume", newVolume);
//         if (newVolume == 0) {
//             mutePlayer();
//         } else if (player.isMuted() && newVolume != 0) {
//             // Just change the icon and unmute
//             //widget.unMute();
//             volumeEl.classList.add("icono-volumeMedium");
//             volumeEl.classList.remove("icono-volumeMute");
//         }
//     });

//     //check audio percentage and update time accordingly
//     setInterval(() => {
//         widget.getPosition((position) => {
//             widget.getDuration((duration) => {
//                 progressBar.style.width = (position / duration) * 100 + "%";
//             });
//             audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(position);
//         });
//     }, 100);

//     //toggle between playing and pausing on button click
//     playBtn.addEventListener("click", () => {
//         widget.isPaused((isPaused) => {
//             if (isPaused) {
//                 roomSocket.send(
//                     JSON.stringify({
//                         event: "PLAY",
//                         message: "Track is now playing",
//                     })
//                 );
//             } else {
//                 roomSocket.send(
//                     JSON.stringify({
//                         event: "PAUSE",
//                         message: "Track is now paused.",
//                     })
//                 );
//             }
//         });
//     });

//     audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
//         widget.getVolume((volume) => {
//             if (volume != 0) {
//                 mutePlayer();
//             } else {
//                 unMutePlayer();
//             }
//         });
//     });

//     connect();
// });

// // function onPlayerError(event) {
// //     console.log("Player error.");
// //     console.log(event);
// // }

// widget.bind(SC.Widget.Events.FINISH, function () {
//     if (username == users[0].username && loop) {
//         changeTrack("", getCurrentTrackData());
//         return;
//     }
//     if (username == users[0].username) {
//         roomSocket.send(
//             JSON.stringify({
//                 event: "TRACK_ENDED",
//                 message: "Track has ended. Need new one.",
//                 track: getCurrentTrackData(),
//             })
//         );
//     }
// });

// function getCurrentTrackData() {
//     widget.getCurrentSound((sound) => {
//         console.log(sound);
//     });
//     const trackData = {
//         url: "Test",
//         name: "Test",
//     };
//     return trackData;
// }

// function mutePlayer() {
//     widget.setVolume(0);
//     // Change the volume percentage to zero
//     volumeSlider.value = 0;
//     renderVolumeSlider();
//     volumeEl.classList.remove("icono-volumeMedium");
//     volumeEl.classList.add("icono-volumeMute");
// }

// function unMutePlayer() {
//     widget.setVolume(10);
//     // Restore the volume percentage as it was before mute
//     volumeSlider.value = 10;
//     renderVolumeSlider();
//     volumeEl.classList.add("icono-volumeMedium");
//     volumeEl.classList.remove("icono-volumeMute");
// }

// //turn 128 seconds into 2:08
// function getTimeCodeFromNum(num) {
//     let seconds = parseInt(num / 1000);
//     let minutes = parseInt(seconds / 60);
//     seconds -= minutes * 60;
//     const hours = parseInt(minutes / 60);
//     minutes -= hours * 60;

//     if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
//     return `${hours}:${String(minutes).padStart(2, 0)}:${String(seconds % 60).padStart(2, 0)}`;
// }

// function renderVolumeSlider() {
//     const min = volumeSlider.min;
//     const max = volumeSlider.max;
//     const value = volumeSlider.value;
//     volumeSlider.style.backgroundSize = ((value - min) * 100) / (max - min) + "% 100%";
// }

// function changeLoop() {
//     roomSocket.send(
//         JSON.stringify({
//             event: "CHANGE_LOOP",
//             message: "Loop settings changed",
//         })
//     );
// }

// function setThumbnail() {
//     widget.getCurrentSound((sound) => {
//         let url = sound.artwork_url;
//         thumb.src = url;
//         thumb.hidden = false;
//     });
// }

// function pauseTrack() {
//     playBtn.classList.remove("pause");
//     playBtn.classList.add("play");
//     stopEqualizerAnimation();
//     widget.pause();
// }

// function playTrack() {
//     playBtn.classList.remove("play");
//     playBtn.classList.add("pause");
//     startEqualizerAnimation();
//     widget.play();
// }

// function backward() {
//     roomSocket.send(
//         JSON.stringify({
//             event: "TRACK_ENDED",
//             message: "Track has ended. Need new one.",
//             track: getCurrentTrackData(),
//             previous: true,
//         })
//     );
// }

// function forward() {
//     roomSocket.send(
//         JSON.stringify({
//             event: "TRACK_ENDED",
//             message: "Track has ended. Need new one.",
//             track: getCurrentTrackData(),
//         })
//     );
// }
