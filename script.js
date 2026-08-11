/* =====================================================
   BOLLYWOOD MOVIE EXPLORER
   OMDb API + IMDb Ratings
===================================================== */


/* =====================================================
   API CONFIGURATION
===================================================== */

// IMPORTANT:
// Paste your own OMDb API key between the quotes.

const API_KEY = "Your_API";

const API_URL = "https://www.omdbapi.com/";



/* =====================================================
   DOM ELEMENTS
===================================================== */

const movieName =
    document.getElementById("movieName");

const movieYear =
    document.getElementById("movieYear");

const ratingFilter =
    document.getElementById("ratingFilter");

const searchBtn =
    document.getElementById("searchBtn");

const resetBtn =
    document.getElementById("resetBtn");

const movieResults =
    document.getElementById("movieResults");

const resultsSection =
    document.getElementById("resultsSection");

const resultCount =
    document.getElementById("resultCount");

const statusMessage =
    document.getElementById("statusMessage");

const loading =
    document.getElementById("loading");

const noResults =
    document.getElementById("noResults");



/* =====================================================
   SEARCH BUTTON
===================================================== */

searchBtn.addEventListener("click", function () {

    searchMovies();

});



/* =====================================================
   ENTER KEY SEARCH
===================================================== */

movieName.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        searchMovies();

    }

});



/* =====================================================
   POPULAR SEARCH BUTTONS
===================================================== */

const popularButtons =
    document.querySelectorAll(".popular-btn");


popularButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        movieName.value =
            button.getAttribute("data-movie");

        movieYear.value = "";

        ratingFilter.value = "0";

        searchMovies();

    });

});



/* =====================================================
   MAIN SEARCH FUNCTION
===================================================== */

async function searchMovies() {

    const title =
        movieName.value.trim();

    const year =
        movieYear.value.trim();

    const minimumRating =
        Number(ratingFilter.value);


    /* -----------------------------------------------
       VALIDATION
    ----------------------------------------------- */

    if (title === "") {

        showStatus(
            "Please enter a movie name.",
            "error"
        );

        movieName.focus();

        return;
    }


    /* -----------------------------------------------
       UI RESET
    ----------------------------------------------- */

    hideStatus();

    hideResults();

    hideNoResults();

    showLoading();


    try {

        /* -------------------------------------------
           STEP 1:
           SEARCH MOVIES
        ------------------------------------------- */

        let searchURL =
            `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(title)}&type=movie`;


        if (year !== "") {

            searchURL +=
                `&y=${encodeURIComponent(year)}`;

        }


        const searchResponse =
            await fetch(searchURL);


        if (!searchResponse.ok) {

            throw new Error(
                "Unable to connect to OMDb API."
            );

        }


        const searchData =
            await searchResponse.json();


        console.log(
            "OMDb Search Response:",
            searchData
        );


        /* -------------------------------------------
           API ERROR
        ------------------------------------------- */

        if (searchData.Response === "False") {

            hideLoading();

            showNoResults();

            showStatus(
                searchData.Error ||
                "No movies found.",
                "error"
            );

            return;
        }


        /* -------------------------------------------
           SEARCH RESULTS
        ------------------------------------------- */

        const searchResults =
            searchData.Search || [];


        /* -------------------------------------------
           STEP 2:
           GET COMPLETE DETAILS
        ------------------------------------------- */

        const detailPromises =
            searchResults.map(function (movie) {

                return getMovieDetails(
                    movie.imdbID
                );

            });


        const detailedMovies =
            await Promise.all(detailPromises);


        /* Remove failed requests */

        const validMovies =
            detailedMovies.filter(function (movie) {

                return movie !== null;

            });


        /* -------------------------------------------
           STEP 3:
           BOLLYWOOD / INDIAN FILTER
        ------------------------------------------- */

        const bollywoodMovies =
            validMovies.filter(function (movie) {

                return isBollywoodMovie(movie);

            });


        /* -------------------------------------------
           STEP 4:
           RATING FILTER
        ------------------------------------------- */

        const filteredMovies =
            bollywoodMovies.filter(function (movie) {

                const rating =
                    parseFloat(movie.imdbRating);

                if (isNaN(rating)) {

                    return minimumRating === 0;

                }

                return rating >= minimumRating;

            });


        /* -------------------------------------------
           SORT BY IMDb RATING
        ------------------------------------------- */

        filteredMovies.sort(function (a, b) {

            const ratingA =
                parseFloat(a.imdbRating) || 0;

            const ratingB =
                parseFloat(b.imdbRating) || 0;

            return ratingB - ratingA;

        });


        hideLoading();


        /* -------------------------------------------
           DISPLAY RESULTS
        ------------------------------------------- */

        if (filteredMovies.length === 0) {

            showNoResults();

            showStatus(
                "Movies were found, but none matched your selected filters.",
                "error"
            );

            return;
        }


        displayMovies(filteredMovies);


        showStatus(
            `Successfully found ${filteredMovies.length} Bollywood movie(s).`,
            "success"
        );

    }


    catch (error) {

        console.error(
            "Movie Search Error:",
            error
        );

        hideLoading();

        showStatus(
            "Something went wrong while loading movie data. Please check your API key and internet connection.",
            "error"
        );

    }

}



/* =====================================================
   GET MOVIE DETAILS
===================================================== */

async function getMovieDetails(imdbID) {

    try {

        const url =
            `${API_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;


        const response =
            await fetch(url);


        if (!response.ok) {

            return null;

        }


        const data =
            await response.json();


        if (data.Response === "False") {

            return null;

        }


        return data;

    }

    catch (error) {

        console.error(
            "Detail API Error:",
            error
        );

        return null;

    }

}



/* =====================================================
   CHECK WHETHER MOVIE IS BOLLYWOOD / INDIAN
===================================================== */

function isBollywoodMovie(movie) {

    const country =
        (movie.Country || "").toLowerCase();

    const language =
        (movie.Language || "").toLowerCase();

    const genre =
        (movie.Genre || "").toLowerCase();


    /*
       OMDb does not provide a dedicated
       "Bollywood" category.

       Therefore we identify Indian movies
       using country/language information.
    */

    const isIndian =
        country.includes("india") ||
        language.includes("hindi");


    const hasIndianLanguage =
        language.includes("hindi") ||
        language.includes("marathi") ||
        language.includes("bengali") ||
        language.includes("tamil") ||
        language.includes("telugu") ||
        language.includes("punjabi") ||
        language.includes("urdu");


    return isIndian || hasIndianLanguage;

}



/* =====================================================
   DISPLAY MOVIES
===================================================== */

function displayMovies(movies) {

    movieResults.innerHTML = "";


    movies.forEach(function (movie) {

        const card =
            createMovieCard(movie);

        movieResults.appendChild(card);

    });


    resultCount.textContent =
        `${movies.length} movie(s) found`;


    resultsSection.classList.remove(
        "hidden"
    );

}



/* =====================================================
   CREATE MOVIE CARD
===================================================== */

function createMovieCard(movie) {

    const card =
        document.createElement("article");


    card.className =
        "movie-card";


    /* -----------------------------------------------
       POSTER
    ----------------------------------------------- */

    let posterHTML = "";


    if (
        movie.Poster &&
        movie.Poster !== "N/A"
    ) {

        posterHTML = `
            <img
                src="${escapeHTML(movie.Poster)}"
                alt="${escapeHTML(movie.Title)} poster"
                class="movie-poster"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            >

            <div
                class="poster-placeholder"
                style="display:none;"
            >
                <span>🎬</span>
                <p>Poster Not Available</p>
            </div>
        `;

    }

    else {

        posterHTML = `

            <div class="poster-placeholder">

                <span>🎬</span>

                <p>Poster Not Available</p>

            </div>

        `;

    }


    /* -----------------------------------------------
       IMDb RATING
    ----------------------------------------------- */

    let ratingText =
        "Not Rated";


    if (
        movie.imdbRating &&
        movie.imdbRating !== "N/A"
    ) {

        ratingText =
            `⭐ ${movie.imdbRating}/10`;

    }



    /* -----------------------------------------------
       GENRE
    ----------------------------------------------- */

    const genre =
        movie.Genre &&
        movie.Genre !== "N/A"
            ? movie.Genre
            : "Not Available";



    /* -----------------------------------------------
       DIRECTOR
    ----------------------------------------------- */

    const director =
        movie.Director &&
        movie.Director !== "N/A"
            ? movie.Director
            : "Not Available";



    /* -----------------------------------------------
       LANGUAGE
    ----------------------------------------------- */

    const language =
        movie.Language &&
        movie.Language !== "N/A"
            ? movie.Language
            : "Not Available";



    /* -----------------------------------------------
       COUNTRY
    ----------------------------------------------- */

    const country =
        movie.Country &&
        movie.Country !== "N/A"
            ? movie.Country
            : "Not Available";



    /* -----------------------------------------------
       PLOT
    ----------------------------------------------- */

    const plot =
        movie.Plot &&
        movie.Plot !== "N/A"
            ? movie.Plot
            : "Plot information is not available.";



    /* -----------------------------------------------
       IMDb LINK
    ----------------------------------------------- */

    let imdbLink = "#";


    if (movie.imdbID) {

        imdbLink =
            `https://www.imdb.com/title/${movie.imdbID}/`;

    }



    /* -----------------------------------------------
       CARD HTML
    ----------------------------------------------- */

    card.innerHTML = `

        ${posterHTML}

        <div class="movie-content">

            <h3 class="movie-title">
                ${escapeHTML(movie.Title)}
            </h3>


            <div class="movie-meta">

                <span class="meta-badge imdb-badge">
                    ${ratingText}
                </span>

                <span class="meta-badge">
                    📅 ${escapeHTML(movie.Year || "N/A")}
                </span>

                <span class="meta-badge">
                    🎬 ${escapeHTML(movie.Type || "Movie")}
                </span>

            </div>


            <p class="movie-info">
                <strong>🎭 Genre:</strong>
                ${escapeHTML(genre)}
            </p>


            <p class="movie-info">
                <strong>🎥 Director:</strong>
                ${escapeHTML(director)}
            </p>


            <p class="movie-info">
                <strong>🗣️ Language:</strong>
                ${escapeHTML(language)}
            </p>


            <p class="movie-info">
                <strong>🌍 Country:</strong>
                ${escapeHTML(country)}
            </p>


            <p class="movie-plot">
                ${escapeHTML(plot)}
            </p>


            <a
                href="${imdbLink}"
                target="_blank"
                rel="noopener noreferrer"
                class="imdb-button"
            >
                ⭐ View on IMDb
            </a>

        </div>

    `;


    return card;

}



/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}



/* =====================================================
   SHOW STATUS
===================================================== */

function showStatus(message, type) {

    statusMessage.textContent =
        message;


    statusMessage.className =
        "status-message";


    if (type === "success") {

        statusMessage.classList.add(
            "status-success"
        );

    }

    else {

        statusMessage.classList.add(
            "status-error"
        );

    }

}



/* =====================================================
   HIDE STATUS
===================================================== */

function hideStatus() {

    statusMessage.classList.add(
        "hidden"
    );

}



/* =====================================================
   SHOW LOADING
===================================================== */

function showLoading() {

    loading.classList.remove(
        "hidden"
    );

}



/* =====================================================
   HIDE LOADING
===================================================== */

function hideLoading() {

    loading.classList.add(
        "hidden"
    );

}



/* =====================================================
   SHOW RESULTS
===================================================== */

function showResults() {

    resultsSection.classList.remove(
        "hidden"
    );

}



/* =====================================================
   HIDE RESULTS
===================================================== */

function hideResults() {

    resultsSection.classList.add(
        "hidden"
    );

    movieResults.innerHTML = "";

}



/* =====================================================
   SHOW NO RESULTS
===================================================== */

function showNoResults() {

    noResults.classList.remove(
        "hidden"
    );

}



/* =====================================================
   HIDE NO RESULTS
===================================================== */

function hideNoResults() {

    noResults.classList.add(
        "hidden"
    );

}



/* =====================================================
   RESET BUTTON
===================================================== */

resetBtn.addEventListener(
    "click",
    function () {

        movieName.value = "";

        movieYear.value = "";

        ratingFilter.value = "0";

        movieResults.innerHTML = "";

        resultCount.textContent =
            "Movies found";

        hideResults();

        hideNoResults();

        hideStatus();

        hideLoading();

        movieName.focus();

    }
);



/* =====================================================
   INITIAL CONSOLE MESSAGE
===================================================== */

console.log(
    "🎬 Bollywood Movie Explorer Loaded Successfully."
);

console.log(
    "Using OMDb API for movie information and IMDb ratings."
);
