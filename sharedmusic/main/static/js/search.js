class SearchManager {
    constructor() {
        this.searchTooltip = $("#search-tooltip");
        this.searchField = $("#search-field");
        this.searchResults = $("#search-results");
        this.searchBtn = $("#search-btn");
        this.lastSearch = [];
    }

    search() {
        this.searchBtn.html("<span class='loader'></span>");
        if (search) {
            fetch("https://yt-search-server.vercel.app/api?search=" + this.searchField.val())
                .then((response) => response.json())
                .then((data) => {
                    this.lastSearch = data;
                    this.render();
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.searchBtn.html("<i class='fa-solid fa-magnifying-glass'></i>");
                });
        }
    }

    render() {
        this.searchResults.empty();
        this.lastSearch.forEach((item) => {
            let result = $(`<div class="search-result"></div>`);
            let title = $(`<div class="search-result__title">${item.snippet.title}</div>`);
            let thumbnail = $(
                `<img class="search-result__thumbnail" src="${item.snippet.thumbnails.default.url}">`
            );
            let button;
            let inPlaylist = playlist.playlistContent.some((track) => {
                return track.url === "https://www.youtube.com/watch?v=" + item.id.videoId;
            });
            if (inPlaylist) {
                button = $(
                    `<button class="btn btn-image"><i class="fas fa-check search-result__inPlaylist"></i></i></button>`
                );
            } else {
                button = $(`<button class="btn btn-image"><i class="fas fa-plus"></i></button>`);
                button.on("click", () => {
                    roomSocket.send(
                        JSON.stringify({
                            event: "ADD_TRACK",
                            url: "https://www.youtube.com/watch?v=" + item.id.videoId,
                            name: item.snippet.title,
                            message: "Add new track.",
                        })
                    );
                });
            }

            title.hover(
                (e) => tooltipHover(e, item.snippet.title, this.searchTooltip),
                (e) => tooltipUnhover(e, this.searchTooltip)
            );
            result.append(thumbnail, title, button);
            this.searchResults.append(result);
        });
    }
}

const search = new SearchManager();
