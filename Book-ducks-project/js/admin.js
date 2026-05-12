(function() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.setAttribute("data-theme", savedTheme);
  }
})();

const navRight = document.getElementById("nav-right");
const user = JSON.parse(localStorage.getItem("user"));
const adminForm = document.getElementById("admin-form");
const adminMessage = document.getElementById("admin-message");

if (user && navRight) {
  navRight.innerHTML = `
    <a href="admin.html"><button class="login-btn">Admin</button></a>
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

window.setTheme = function(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

if (adminForm) {
  adminForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const bookData = {
      data: {
        tittle: document.getElementById("tittle").value,
        author: document.getElementById("author").value,
        pages: parseInt(document.getElementById("pages").value),
        releaseDate: document.getElementById("releaseDate").value,
        description: document.getElementById("description").value,
        cover: document.getElementById("cover").value 
      }
    };

    try {
      const response = await fetch("http://localhost:1337/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });

      if (response.ok) {
        adminMessage.innerHTML = `<p style="color: green;">Boken har sparats!</p>`;
        adminForm.reset();
      } else {
        const err = await response.json();
        adminMessage.innerHTML = `<p style="color: red;">Fel: ${err.error.message}</p>`;
      }
    } catch (error) {
      adminMessage.innerHTML = `<p style="color: red;">Kunde inte ansluta till servern.</p>`;
    }
  });
}