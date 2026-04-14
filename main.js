let images = [
    "images/Nano_1.png",
    "images/Nano_2.jpg",
    "images/Nano_3.png",
    "images/Nano_4.png"
];
//doggo
let index = 0;

let captions = [];

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
}

async function loadCaptions() {
    let response = await fetch("captions.json");
    captions = await response.json();
    show(index);
}
loadCaptions();

//demos need live server
function show(i) {
    document.getElementById("slideshow-img").src = images[i];
    document.getElementById("caption").textContent = captions[i] || "";
}
//display each
function next() {
    index = (index + 1) % images.length;
    show(index);
}

function prev() {
    index = (index - 1 + images.length) % images.length;
    show(index);
}
//modulo to make sure no out of bounds (the void stares back)
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

const extraSkills = ["JavaScript", "Node.js", "Figma"];
const chipContainer = document.querySelector(".d-flex.flex-wrap.gap-2.mt-2");

for (let i=0; i<extraSkills.length; i++){
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

document.getElementById("theme-toggle").addEventListener("click", () => {
    const current = localStorage.getItem("theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
});

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
slideshowImg.addEventListener("mouseenter", () => {
    slideshowImg.style.opacity = "0.6";
});
slideshowImg.addEventListener("mouseleave", () => {
    slideshowImg.style.opacity = "1";
});
