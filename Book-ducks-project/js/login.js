const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.body.setAttribute("data-theme", savedTheme);
}

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        identifier,
        password
      })
    });

    const result = await response.json();

    if (result.jwt) {
      localStorage.setItem("token", result.jwt);
      localStorage.setItem("user", JSON.stringify(result.user));
      
      localStorage.setItem("userRole", "admin");

      localStorage.setItem("successMessage", "✅ Du är nu inloggad!");
      window.location.href = "../pages/index.html";
    } else {
      alert("Fel email eller lösenord");
    }
  } catch (error) {
    console.log(error);
  }
});