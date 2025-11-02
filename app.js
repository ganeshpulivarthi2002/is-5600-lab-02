document.addEventListener("DOMContentLoaded", () => {
  const stocksData = JSON.parse(stockContent);
  let userData = JSON.parse(userContent);

  generateUserList(userData, stocksData);
  const portfolioContainer = document.querySelector(".portfolio-list");
  portfolioContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      e.preventDefault();
      viewStock(e.target.id, stocksData);
    }
  });

  const saveBtn = document.querySelector("#btnSave");
  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const id = document.querySelector("#userID").value;
      const userIndex = userData.findIndex((u) => u.id == id);
      if (userIndex === -1) {
        alert("⚠ Please select a user first.");
        return;
      }

      userData[userIndex].user.firstname = document.querySelector("#firstname").value;
      userData[userIndex].user.lastname = document.querySelector("#lastname").value;
      userData[userIndex].user.address = document.querySelector("#address").value;
      userData[userIndex].user.city = document.querySelector("#city").value;
      userData[userIndex].user.email = document.querySelector("#email").value;

      generateUserList(userData, stocksData);

      populateForm(userData[userIndex]);
      renderPortfolio(userData[userIndex]);

      showToast(" User information updated!");
    });
  }

  const deleteBtn = document.querySelector("#btnDelete");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const id = document.querySelector("#userID").value;
      const index = userData.findIndex((u) => u.id == id);
      if (index === -1) {
        alert("⚠ Please select a user to delete.");
        return;
      }

      const deletedUser = ${userData[index].user.firstname} ${userData[index].user.lastname};
      userData.splice(index, 1);

      clearForm();
      clearPortfolio();
      generateUserList(userData, stocksData);

      showToast(🗑 Deleted user: ${deletedUser});
    });
  }
});

function generateUserList(users, stocks) {
  const list = document.querySelector(".user-list");
  list.innerHTML = "";

  users.forEach(({ user, id }) => {
    const li = document.createElement("li");
    li.textContent = ${user.firstname} ${user.lastname}; 
    li.id = id;
    list.appendChild(li);
  });

  list.onclick = (e) => handleUserClick(e, users, stocks);
}

function handleUserClick(e, users, stocks) {
  if (e.target.tagName !== "LI") return;
  const id = e.target.id;
  const user = users.find((u) => u.id == id);
  if (!user) return;
  populateForm(user);
  renderPortfolio(user);
}

function populateForm(data) {
  const { user, id } = data;
  document.querySelector("#userID").value = id;
  document.querySelector("#firstname").value = user.firstname;
  document.querySelector("#lastname").value = user.lastname;
  document.querySelector("#address").value = user.address;
  document.querySelector("#city").value = user.city;
  document.querySelector("#email").value = user.email;
}

function clearForm() {
  document.querySelector("#userID").value = "";
  document.querySelector("#firstname").value = "";
  document.querySelector("#lastname").value = "";
  document.querySelector("#address").value = "";
  document.querySelector("#city").value = "";
  document.querySelector("#email").value = "";
}

function renderPortfolio(user) {
  const container = document.querySelector(".portfolio-list");
  container.innerHTML = "";

  user.portfolio.forEach(({ symbol, owned }) => {
    const row = document.createElement("div");
    row.classList.add("portfolio-item");

    const symbolEl = document.createElement("p");
    const sharesEl = document.createElement("p");
    const viewBtn = document.createElement("button");

    symbolEl.textContent = symbol;
    sharesEl.textContent = owned;
    viewBtn.textContent = "View";
    viewBtn.id = symbol;
    viewBtn.type = "button"; 

    row.append(symbolEl, sharesEl, viewBtn);
    container.appendChild(row);
  });
}

function clearPortfolio() {
  const container = document.querySelector(".portfolio-list");
  container.innerHTML = "";
}

function viewStock(symbol, stocks) {
  const stock = stocks.find((s) => s.symbol === symbol);
  if (!stock) return;

  document.querySelector("#stockName").textContent = stock.name;
  document.querySelector("#stockSector").textContent = stock.sector;
  document.querySelector("#stockIndustry").textContent = stock.subIndustry;
  document.querySelector("#stockAddress").textContent = stock.address;

  const logo = document.querySelector("#logo");
  if (logo) logo.src = logos/${symbol}.svg;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#323232";
  toast.style.color = "white";
  toast.style.padding = "10px 16px";
  toast.style.borderRadius = "6px";
  toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  toast.style.zIndex = "1000";
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2500);
}