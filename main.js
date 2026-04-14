let images = [
    "images/Nano_1.png",
    "images/Nano_2.jpg",
    "images/Nano_3.png",
    "images/Nano_4.png"
];
let index = 0;
let captions = [];

async function loadCaptions() {
    let response = await fetch("captions.json");
    captions = await response.json();
    show(index);
}
loadCaptions();

function show(i) {
    document.getElementById("slideshow-img").src = images[i];
    document.getElementById("caption").textContent = captions[i] || "";
}

function next() {
    index = (index + 1) % images.length;
    show(index);
}

function prev() {
    index = (index - 1 + images.length) % images.length;
    show(index);
}

function toggle() {
    const video = document.getElementById("nano-video");
    const btn = document.querySelector("button[onclick='toggle()']");
    if (video.paused) {
        video.play();
        btn.textContent = "Pause";
    } else {
        video.pause();
        btn.textContent = "Play";
    }
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
}

document.getElementById("theme-toggle").addEventListener("click", () => {
    const current = localStorage.getItem("theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
});

const extraSkills = ["JavaScript", "Node.js", "Figma"];
const chipContainer = document.querySelector(".d-flex.flex-wrap.gap-2.mt-2");
for (let i = 0; i < extraSkills.length; i++) {
    const chip = document.createElement("span");
    chip.className = "badge skill-chip rounded-pill px-3 py-2";
    chip.textContent = extraSkills[i];
    chipContainer.appendChild(chip);
}
chipContainer.querySelectorAll(".badge").forEach(badge => {
    if (badge.textContent === "BarkScript") badge.remove();
});

const cite = document.querySelector("cite");
if (cite) cite.textContent = "— A Very Satisfied Client";

document.querySelector("#contactModal .btn.button-nano[data-bs-dismiss='modal']")
    .addEventListener("click", () => {
        const name  = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const msg   = document.getElementById("contactMsg").value.trim();
        if (name || email || msg) {
            const submission = { name, email, msg, time: new Date().toISOString() };
            localStorage.setItem("lastContact", JSON.stringify(submission));
        }
    });

const slideshowImg = document.getElementById("slideshow-img");
slideshowImg.addEventListener("mouseenter", () => { slideshowImg.style.opacity = "0.6"; });
slideshowImg.addEventListener("mouseleave", () => { slideshowImg.style.opacity = "1"; });




let allRecipes = [];
let favorites = new Set(JSON.parse(localStorage.getItem("nano_favs") || "[]"));

function saveFavs() {
    localStorage.setItem("nano_favs", JSON.stringify([...favorites]));
}

async function loadRecipes() {
    const response = await fetch("appetizer_recipes.json");
    allRecipes = await response.json();
    renderFeatured(allRecipes[0]);
    renderRecipes(allRecipes);
}
loadRecipes();

function renderFeatured(recipe) {
    if (!recipe) return;
    const el = document.getElementById("featured-content");
    el.innerHTML = `
        <div class="featured-inner">
            <img src="images/recipes/${recipe.images[0]}" alt="${recipe.name}" class="featured-img"
                 onerror="this.style.display='none'">
            <div class="featured-info">
                <h4 style="color: var(--cyan); margin-bottom: 0.5rem;">${recipe.name}</h4>
                <p style="color: var(--text-dimmer); font-size: 0.9rem; margin-bottom: 0.5rem;">
                    ${recipe.cuisine} &bull; ${recipe.prep_time} &bull; ${recipe.difficulty}
                </p>
                <div class="mb-2">
                    ${recipe.dietary.map(d => `<span class="badge" style="background:#7c3aed;font-size:0.75rem;margin-right:4px;">${d}</span>`).join("")}
                </div>
                <a href="recipe.html?id=${recipe.id}" class="btn button-nano btn-sm mt-2">View Recipe</a>
            </div>
        </div>
    `;
}

function renderRecipes(recipes) {
    const grid = document.getElementById("recipe-grid");
    const noResults = document.getElementById("no-results");
    grid.innerHTML = "";

    if (recipes.length === 0) {
        noResults.style.display = "block";
        return;
    }
    noResults.style.display = "none";

    recipes.forEach(recipe => {
        const isFaved = favorites.has(recipe.id);
        const card = document.createElement("div");
        card.className = "recipe-card";
        card.innerHTML = `
            <img src="images/recipes/${recipe.images[0]}" alt="${recipe.name}" class="recipe-thumb"
                 onerror="this.style.display='none'">
            <div class="recipe-card-body">
                <div class="recipe-card-title">${recipe.name}</div>
                <div class="recipe-card-meta">${recipe.cuisine} &bull; ${recipe.prep_time} &bull; ${recipe.difficulty}</div>
                <div class="recipe-card-tags">
                    ${recipe.dietary.map(d => `<span class="recipe-tag">${d}</span>`).join("")}
                </div>
            </div>
            <div class="recipe-card-footer">
                <a href="recipe.html?id=${recipe.id}" class="btn button-nano btn-sm">View Recipe</a>
                <button class="fav-btn ${isFaved ? "active" : ""}" aria-label="Favorite"
                        data-id="${recipe.id}">${isFaved ? "♥" : "♡"}</button>
            </div>
        `;

        card.querySelector(".fav-btn").addEventListener("click", (e) => {
            toggleFav(recipe.id, e.currentTarget, card);
        });

        grid.appendChild(card);
    });
}

function toggleFav(id, btn, card) {
    if (favorites.has(id)) {
        favorites.delete(id);
        btn.textContent = "♡";
        btn.classList.remove("active");
    } else {
        favorites.add(id);
        btn.textContent = "♥";
        btn.classList.remove("active");
        void btn.offsetWidth;
        btn.classList.add("active");
    }
    saveFavs();
}

function filterRecipes() {
    const q = document.getElementById("recipe-search").value.toLowerCase();
    const filtered = allRecipes.filter(r => r.name.toLowerCase().includes(q));
    renderRecipes(filtered);
}
