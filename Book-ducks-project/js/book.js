(function() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.setAttribute("data-theme", savedTheme);
  }
})();

const urlParams = new URLSearchParams(window.location.search);
const bookDocumentId = urlParams.get("id");
const bookContent = document.getElementById("book-content");
const navRight = document.getElementById("nav-right");
const user = JSON.parse(localStorage.getItem("user"));
let currentBook = null;

if (user && navRight) {
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

async function fetchBookDetails() {
  try {
    const response = await fetch(`http://localhost:1337/api/books/${bookDocumentId}?populate=*`);
    const result = await response.json();
    currentBook = result.data;
    renderBookDetails(currentBook);
  } catch (error) {
    console.error(error);
  }
}

function showStatus(text) {
  const statusEl = document.getElementById("status-message");
  if (statusEl) {
    statusEl.innerText = text;
    statusEl.style.display = "block";
    setTimeout(() => { statusEl.style.display = "none"; }, 3000);
  }
}

function renderBookDetails(book) {
  const image = book.cover ? book.cover : "https://via.placeholder.com/300";
  const readingList = JSON.parse(localStorage.getItem("readingList")) || [];
  const isAdded = readingList.some(b => b.tittle === book.tittle);
  
  // Här skapar vi HTML för interaktionstexten om man är utloggad
  const interactionContent = user ? `
    <div class="rating-box">
      <p>Sätt betyg:</p>
      <div class="rating-buttons">
        ${[1,2,3,4,5,6,7,8,9,10].map(num => `
          <button class="rate-num-btn" onclick="rateBookLocal(${num})">${num}</button>
        `).join('')}
      </div>
    </div>

    <button id="main-read-btn" 
            class="read-btn ${isAdded ? 'already-added' : ''}" 
            onclick="addToReadingList()">
            ${isAdded ? 'Finns i läslistan' : 'Vill läsa'}
    </button>
  ` : `
    <div class="login-prompt">
      <p><i><a href="login.html">Logga in</a> för att betygsätta eller spara boken i din läslista.</i></p>
    </div>
  `;

  bookContent.innerHTML = `
    <div class="details-container">
      <img src="${image}" alt="${book.tittle}" class="details-image" />
      <div class="details-info">
        <h1>${book.tittle}</h1>
        <p><strong>Författare:</strong> ${book.author}</p>
        <p><strong>Sidor:</strong> ${book.pages}</p>
        <p><strong>Släppt:</strong> ${book.releaseDate}</p>
        
        ${interactionContent}

        <div class="description-text">
          <p>${book.description || "Ingen beskrivning tillgänglig."}</p>
        </div>
      </div>
    </div>
  `;
}

window.addToReadingList = function() {
  if (!currentBook || !user) return;
  let readingList = JSON.parse(localStorage.getItem("readingList")) || [];
  const btn = document.getElementById("main-read-btn");
  
  if (!readingList.some(b => b.tittle === currentBook.tittle)) {
    readingList.push({
      tittle: currentBook.tittle,
      author: currentBook.author,
      image: currentBook.cover
    });
    localStorage.setItem("readingList", JSON.stringify(readingList));
    btn.classList.add("already-added");
    btn.innerText = "Finns i läslistan";
    showStatus("Lagt till i din läslista");
  }
};

window.rateBookLocal = function(val) {
  if (!val || !currentBook || !user) return;
  let ratings = JSON.parse(localStorage.getItem("ratings")) || [];
  ratings = ratings.filter(b => b.tittle !== currentBook.tittle);
  
  ratings.push({
    tittle: currentBook.tittle,
    author: currentBook.author,
    image: currentBook.cover,
    rating: Number(val)
  });
  
  localStorage.setItem("ratings", JSON.stringify(ratings));
  showStatus(`Du gav boken betyget ${val}/10!`);
};

fetchBookDetails();