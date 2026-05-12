(function() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.setAttribute("data-theme", savedTheme);
  }
})();

const booksGrid = document.querySelector(".books-grid");
const navRight = document.getElementById("nav-right");
const user = JSON.parse(localStorage.getItem("user"));
const successBox = document.getElementById("success-message");

async function fetchBooks() {
  try {
    const response = await fetch("http://localhost:1337/api/books?populate=*");
    const result = await response.json();
    const books = result.data;
    window.allBooks = books;
    renderBooks(books);
  } catch (error) {
    console.log(error);
  }
}

function renderBooks(books) {
  if (!booksGrid) return;
  booksGrid.innerHTML = "";

  books.forEach((book) => {
    const title = book.tittle || book.title; 
    const author = book.author;
    const pages = book.pages;
    const releaseDate = book.releaseDate;
    const image = book.cover;

    const reviews = book.reviews || [];
    let ratingHTML = ""; 

    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
      const averageRating = (sum / reviews.length).toFixed(1);
      ratingHTML = `<div class="rating">★ ${averageRating}</div>`;
    }

    booksGrid.innerHTML += `
      <a href="book.html?id=${book.documentId}" class="book-link">
        <div class="book-card">
          <img src="${image}" class="book-image" />
          <div class="book-info">
            <h3>${title}</h3>
            <p>${author}</p>
            <p>${pages} sidor</p>
            <p>${releaseDate}</p>
            ${ratingHTML}
          </div>
        </div>
      </a>
    `;
  });
}

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
    window.location.reload();
  });
} else {
  navRight.innerHTML = `
    <a href="login.html"><button class="login-btn">Logga in</button></a>
    <a href="register.html"><button class="register-btn">Registrera dig</button></a>
  `;
}

const successMessage = localStorage.getItem("successMessage");
if (successMessage && successBox) {
  successBox.innerHTML = `<div class="success-box">${successMessage}</div>`;
  localStorage.removeItem("successMessage");
  setTimeout(() => { successBox.innerHTML = ""; }, 3000);
}

document.addEventListener("input", (e) => {
  if (e.target.id === "search-input") {
    const value = e.target.value.toLowerCase();
    const filteredBooks = window.allBooks.filter((book) => {
      const titleSearch = book.tittle || book.title || "";
      return (
        titleSearch.toLowerCase().includes(value) ||
        book.author.toLowerCase().includes(value)
      );
    });
    renderBooks(filteredBooks);
  }
});

fetchBooks();