const user = JSON.parse(localStorage.getItem("user"));
const navRight = document.getElementById("nav-right");
const STRAPI_URL = "http://localhost:1337";

if (user) {
    const isAdmin = localStorage.getItem("userRole") === "admin";
    navRight.innerHTML = `
        ${isAdmin ? `<a href="admin.html"><button class="login-btn">Admin</button></a>` : ""}
        <a href="profile.html"><button class="login-btn">Profil</button></a>
        <button class="register-btn" id="logout-btn">Logga ut</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        window.location.href = "index.html";
    });
}

document.getElementById("profile-username").textContent = user ? user.username : "";

let readingList = JSON.parse(localStorage.getItem("readingList")) || [];
let ratings = JSON.parse(localStorage.getItem("ratings")) || [];

function renderReadingList() {
    const container = document.getElementById("reading-list");
    if (!container) return;
    container.innerHTML = readingList.map((book, i) => `
        <div class="profile-book-card">
            <img src="${book.image.startsWith('http') ? book.image : STRAPI_URL + book.image}" class="profile-book-image" />
            <div class="profile-book-content">
                <h3>${book.tittle}</h3>
                <p>${book.author}</p>
                <button class="remove-btn" onclick="removeBook(${i})">Ta bort</button>
            </div>
        </div>
    `).join('');
}

function renderRatings() {
    const container = document.getElementById("ratings-list");
    if (!container) return;
    container.innerHTML = ratings.map((book, i) => `
        <div class="profile-book-card">
            <img src="${book.image.startsWith('http') ? book.image : STRAPI_URL + book.image}" class="profile-book-image" />
            <div class="profile-book-content">
                <h3>${book.tittle}</h3>
                <p class="profile-book-rating"> ${book.rating}/10</p>
                <button class="remove-btn" onclick="removeRating(${i})">Ta bort</button>
            </div>
        </div>
    `).join('');
}

window.removeBook = (i) => { readingList.splice(i, 1); localStorage.setItem("readingList", JSON.stringify(readingList)); renderReadingList(); };
window.removeRating = (i) => { ratings.splice(i, 1); localStorage.setItem("ratings", JSON.stringify(ratings)); renderRatings(); };

window.sortReadingByTitle = () => { readingList.sort((a,b) => a.tittle.localeCompare(b.tittle)); renderReadingList(); };
window.sortRatingsByRating = () => { ratings.sort((a,b) => b.rating - a.rating); renderRatings(); };

renderReadingList();
renderRatings();