const API_URL = "http://localhost:5000";


// ========================================
// GET HTML ELEMENTS
// ========================================

const workshopContainer = document.getElementById("workshopContainer");

const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");

const levelFilter = document.getElementById("levelFilter");

const sortFilter = document.getElementById("sortFilter");

const clearBtn = document.getElementById("clearBtn");

const workshopCount = document.getElementById("workshopCount");

const loading = document.getElementById("loading");

const errorMessage = document.getElementById("errorMessage");

const noResults = document.getElementById("noResults");


// ========================================
// LOAD WORKSHOPS
// ========================================

async function loadWorkshops() {

    try {

        loading.style.display = "block";

        errorMessage.style.display = "none";

        noResults.style.display = "none";

        workshopContainer.innerHTML = "";


        // --------------------------------
        // GET FILTER VALUES
        // --------------------------------

        const searchValue = searchInput.value.trim();

        const categoryValue = categoryFilter.value;

        const levelValue = levelFilter.value;

        const sortValue = sortFilter.value;


        let url;


        // --------------------------------
        // SEARCH
        // --------------------------------

        if (searchValue) {

            url = `${API_URL}/workshops/search?keyword=${encodeURIComponent(searchValue)}`;

        }

        // --------------------------------
        // NORMAL WORKSHOP API
        // --------------------------------

        else {

            const params = new URLSearchParams();


            if (categoryValue) {

                params.append("category", categoryValue);

            }


            if (levelValue) {

                params.append("level", levelValue);

            }


            if (sortValue) {

                params.append("sort", sortValue);

            }


            const queryString = params.toString();


            url = queryString
                ? `${API_URL}/workshops?${queryString}`
                : `${API_URL}/workshops`;

        }


        // --------------------------------
        // FETCH DATA
        // --------------------------------

        const response = await fetch(url);


        if (!response.ok) {

            throw new Error("Unable to fetch workshops");

        }


        const workshops = await response.json();


        // --------------------------------
        // HIDE LOADING
        // --------------------------------

        loading.style.display = "none";


        // --------------------------------
        // DISPLAY COUNT
        // --------------------------------

        workshopCount.textContent = workshops.length;


        // --------------------------------
        // NO RESULTS
        // --------------------------------

        if (workshops.length === 0) {

            noResults.style.display = "block";

            return;

        }


        // --------------------------------
        // DISPLAY WORKSHOPS
        // --------------------------------

        workshops.forEach((workshop) => {

            createWorkshopCard(workshop);

        });


    }

    catch (error) {

        console.error("Error:", error);

        loading.style.display = "none";

        workshopCount.textContent = "0";

        errorMessage.textContent =
            "Unable to connect to the backend. Please make sure the server is running on port 5000.";

        errorMessage.style.display = "block";

    }

}


// ========================================
// CREATE WORKSHOP CARD
// ========================================

function createWorkshopCard(workshop) {


    const card = document.createElement("article");

    card.className = "workshop-card";


    // Convert level to CSS class

    const levelClass = workshop.level
        .toLowerCase()
        .replace(/\s+/g, "-");


    card.innerHTML = `

        <div class="card-top">

            <span class="category-badge">
                📚 ${escapeHTML(workshop.category_name)}
            </span>

            <span class="level-badge ${levelClass}">
                ${escapeHTML(workshop.level)}
            </span>

        </div>


        <h3>
            ${escapeHTML(workshop.workshop_name)}
        </h3>


        <p class="description">
            ${escapeHTML(workshop.description)}
        </p>


        <div class="card-details">


            <div class="detail">

                <div class="detail-icon">
                    ⏱️
                </div>

                <div class="detail-text">

                    <span>Duration</span>

                    <strong>
                        ${workshop.duration} hours
                    </strong>

                </div>

            </div>


            <div class="detail">

                <div class="detail-icon">
                    👨‍🏫
                </div>

                <div class="detail-text">

                    <span>Trainer</span>

                    <strong>
                        ${escapeHTML(workshop.trainer_name)}
                    </strong>

                </div>

            </div>


        </div>

    `;


    workshopContainer.appendChild(card);

}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener("input", () => {

    loadWorkshops();

});


// ========================================
// CATEGORY FILTER
// ========================================

categoryFilter.addEventListener("change", () => {

    loadWorkshops();

});


// ========================================
// LEVEL FILTER
// ========================================

levelFilter.addEventListener("change", () => {

    loadWorkshops();

});


// ========================================
// SORT
// ========================================

sortFilter.addEventListener("change", () => {

    loadWorkshops();

});


// ========================================
// CLEAR FILTERS
// ========================================

clearBtn.addEventListener("click", () => {

    searchInput.value = "";

    categoryFilter.value = "";

    levelFilter.value = "";

    sortFilter.value = "";

    loadWorkshops();

});


// ========================================
// SECURITY HELPER
// ========================================

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ========================================
// INITIAL LOAD
// ========================================

loadWorkshops();