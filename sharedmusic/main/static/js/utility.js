const youtubeRawLink = "https://www.youtube.com/watch?v=";
// Indicates whether user has clicked on window
let isFirstClick = true;

// Notification settings
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
};

function youtube_parser(url) {
    let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return "";
    }
}

function showContent() {
    $(".loading").addClass("hidden");
    $(".content").removeClass("hidden");
}

function copyLinkToClipboard(btn) {
    navigator.clipboard.writeText(window.location.href);
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-copy"></i>';
    }, 4000);
}

function dropdownHover(element) {
    element = $(element);
    let offset = element.offset();
    element.children(".dropdown-content").css("top", offset.top + element.height());
    element.children(".dropdown-content").css("left", offset.left);
}

function startEqualizerAnimation() {
    $(".box").children().css("animationPlayState", "running");
}

function stopEqualizerAnimation() {
    // When track in paused and you add (delete) track from playlist, animation starts to play
    // If I stop animation right away, it doesnt have time to start playing (height of lines is set to 0)
    // So we need some time for animation to play
    // As alternative, I can change animation styles (but I am too lazy, maybe next time)
    setTimeout(() => {
        $(".box").children().css("animationPlayState", "paused");
    }, 200);
}

function closeModal(modal) {
    modal.hide();
}

// Tooltip for titles
// Text should appear on mouse position

function tooltipHover(e, text, tooltip) {
    tooltip.text(text);
    tooltip.css("opacity", 1);
    tooltip.css("top", e.clientY - 30 - tooltip.height());
    tooltip.css("left", document.body.clientWidth / 2 - 150);
}

function tooltipUnhover(e, tooltip) {
    tooltip.text("");
    tooltip.css("opacity", 0);
}

function changeMainBlock(tab, className) {
    let tabs = $(".main-block .tabs > li");
    let blocks = $(".main-block > div");
    let selectedBlock = $(className);
    // Remove all active classes and hide all blocks
    tabs.removeClass("active");
    blocks.hide();
    // Set active class on selected tab and show block
    $(tab).addClass("active");
    selectedBlock.show();
}

const banlistModal = $modal({
    title: "Banlist",
    content: `
    <div class="banlist"></div>`,
    footerButtons: [
        {
            class: "btn btn__cancel",
            text: "Close",
            handler: "closeModal(banlistModal)",
        },
    ],
});

const permsModalHost = $modal({
    title: "Change room permissions",
    content: `<div class="perms-menu"><div class="grid-wrapper" data="title">
        <div class="perms-menu__name">Permissions</div>
        <div class="perms-menu__option">Any user</div>
        <div class="perms-menu__option">Host only</div>
    </div>
    <div class="grid-wrapper" data="PAUSE">
        <div class="perms-menu__name">Pause track</div>
        <input type="radio" name="pause" value="1" class="perms-menu__option" />
        <input type="radio" name="pause" value="5" class="perms-menu__option" />
    </div>
    <div class="grid-wrapper" data="ADD_TRACK">
        <div class="perms-menu__name">Add track</div>
        <input type="radio" name="add" value="1" class="perms-menu__option" />
        <input type="radio" name="add" value="5" class="perms-menu__option" />
    </div>
    <div class="grid-wrapper" data="CHANGE_TIME">
        <div class="perms-menu__name">Change time</div>
        <input type="radio" name="change_time" value="1" class="perms-menu__option" />
        <input type="radio" name="change_time" value="5" class="perms-menu__option" />
    </div>
    <div class="grid-wrapper" data="CHANGE_TRACK">
        <div class="perms-menu__name">Change track</div>
        <input type="radio" name="change_track" value="1" class="perms-menu__option" />
        <input type="radio" name="change_track" value="5" class="perms-menu__option" />
    </div>
    <div class="grid-wrapper" data="DELETE_TRACK">
        <div class="perms-menu__name">Delete track</div>
        <input type="radio" name="delete" value="1" class="perms-menu__option" />
        <input type="radio" name="delete" value="5" class="perms-menu__option" />
    </div>
</div>`,
    footerButtons: [
        { class: "btn btn__ok", text: "Save", handler: "permissions.save()" },
        { class: "btn btn__cancel", text: "Cancel", handler: "closeModal(permsModalHost)" },
    ],
});

const permsModalUser = $modal({
    title: "Room permissions",
    content: `
        <h5>Your permissions:</h5>
        <div class="permissions"></div>`,
    footerButtons: [
        { class: "btn btn__cancel", text: "Close", handler: "closeModal(permsModalUser)" },
    ],
});

//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${hours}:${String(minutes).padStart(2, 0)}:${String(seconds % 60).padStart(2, 0)}`;
}

function renderVolumeSlider() {
    const min = volumeSlider.attr("min");
    const max = volumeSlider.attr("max");
    const value = volumeSlider.val();
    const size = ((value - min) * 100) / (max - min);
    volumeSlider.css("background-size", `${size}% 100%`);
}

function changeLoop() {
    roomSocket.send(
        JSON.stringify({
            event: "CHANGE_LOOP",
            message: "Loop settings changed",
        })
    );
}

function backward() {
    roomSocket.send(
        JSON.stringify({
            event: "TRACK_ENDED",
            message: "Track has ended. Need new one.",
            track: player.getCurrentTrackData(),
            previous: true,
        })
    );
}

function forward() {
    roomSocket.send(
        JSON.stringify({
            event: "TRACK_ENDED",
            message: "Track has ended. Need new one.",
            track: player.getCurrentTrackData(),
        })
    );
}
