const businesses = [
  {
    name: "The Daily Brew",
    category: "Cafés",
    icon: "☕",
    description: "Coffee, snacks & a relaxed place to work",
    rating: "4.8",
    distance: "0.8 km"
  },
  {
    name: "Urban Threads",
    category: "Shopping",
    icon: "👕",
    description: "Trendy fashion & everyday clothing",
    rating: "4.6",
    distance: "1.2 km"
  },
  {
    name: "Green Bowl",
    category: "Food",
    icon: "🥗",
    description: "Fresh, healthy & affordable meals",
    rating: "4.7",
    distance: "1.5 km"
  },
  {
    name: "Balance Studio",
    category: "Health",
    icon: "🧘",
    description: "Yoga, fitness & wellness classes",
    rating: "4.8",
    distance: "1.9 km"
  },
  {
    name: "Glow Beauty",
    category: "Beauty",
    icon: "💇",
    description: "Beauty, hair & personal care",
    rating: "4.5",
    distance: "2.1 km"
  },
  {
    name: "TechPoint",
    category: "Services",
    icon: "💻",
    description: "Laptop, mobile & technology services",
    rating: "4.6",
    distance: "2.4 km"
  }
];

let savedBusinesses = [];

function toast(message) {
  let box = document.getElementById("toast");

  if (!box) {
    box = document.createElement("div");
    box.id = "toast";
    box.className = "toast";
    document.body.appendChild(box);
  }

  box.textContent = message;
  box.classList.add("show");

  setTimeout(function () {
    box.classList.remove("show");
  }, 1800);
}

function createBusinessCard(business) {
  const isSaved = savedBusinesses.includes(business.name);

  return `
    <div class="business-card">
      <div class="business-top">
        <div class="business-icon">${business.icon}</div>

        <div class="business-info">
          <h3>${business.name}</h3>
          <p>${business.description}</p>
        </div>

        <button class="save-btn ${isSaved ? "saved" : ""}"
          onclick="toggleSave('${business.name}')">
          ${isSaved ? "♥" : "♡"}
        </button>
      </div>

      <div class="business-bottom">
        <span class="rating">⭐ ${business.rating}</span>
        <span class="distance">📍 ${business.distance}</span>
      </div>
    </div>
  `;
}

function showBusinesses(list, title) {
  const result = document.getElementById("result");

  if (!result) return;

  result.classList.add("show");

  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");

  if (resultTitle) {
    resultTitle.textContent = title;
  }

  if (resultText) {
    resultText.innerHTML = list.length
      ? `<div class="card-list">${list.map(createBusinessCard).join("")}</div>`
      : `<div class="empty">No matching businesses found.<br>Try another search.</div>`;
  }

  result.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function searchBusiness() {
  const input = document.getElementById("search");

  if (!input) return;

  const query = input.value.trim().toLowerCase();

  if (query === "") {
    document.getElementById("result").classList.remove("show");
    return;
  }

  const matches = businesses.filter(function (business) {
    return (
      business.name.toLowerCase().includes(query) ||
      business.category.toLowerCase().includes(query) ||
      business.description.toLowerCase().includes(query)
    );
  });

  showBusinesses(matches, `Results for "${input.value.trim()}"`);
}

function filterCategory(category) {
  const matches = businesses.filter(function (business) {
    return business.category.toLowerCase() === category.toLowerCase();
  });

  showBusinesses(matches, `${category} near you`);

  toast(`${category} selected`);
}

function toggleSave(name) {
  const index = savedBusinesses.indexOf(name);

  if (index === -1) {
    savedBusinesses.push(name);
    toast(`${name} saved ❤️`);
  } else {
    savedBusinesses.splice(index, 1);
    toast(`${name} removed from saved`);
  }

  refreshVisibleResults();
}

function refreshVisibleResults() {
  const result = document.getElementById("result");

  if (!result || !result.classList.contains("show")) return;

  const title = document.getElementById("resultTitle");

  if (title && title.textContent.startsWith("Results for")) {
    searchBusiness();
  }
}

function showSaved() {
  const saved = businesses.filter(function (business) {
    return savedBusinesses.includes(business.name);
  });

  showBusinesses(saved, "Your saved businesses");

  if (saved.length === 0) {
    toast("You haven't saved any businesses yet");
  }
}

function showOffers() {
  const result = document.getElementById("result");

  if (!result) return;

  result.classList.add("show");

  document.getElementById("resultTitle").textContent =
    "Today's local offers";

  document.getElementById("resultText").innerHTML = `
    <div class="card-list">
      <div class="business-card">
        <h3>☕ The Daily Brew</h3>
        <p>Get 15% off your next coffee order.</p>
      </div>

      <div class="business-card">
        <h3>👕 Urban Threads</h3>
        <p>Buy 2 items and get 10% off.</p>
      </div>

      <div class="business-card">
        <h3>🥗 Green Bowl</h3>
        <p>Healthy lunch combo available today.</p>
      </div>
    </div>
  `;

  result.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  toast("Showing nearby offers");
}

function showProfile() {
  const result = document.getElementById("result");

  if (!result) return;

  result.classList.add("show");

  document.getElementById("resultTitle").textContent =
    "Your Nearfolk profile";

  document.getElementById("resultText").innerHTML = `
    <div class="profile-card">
      <h2>👋 Welcome to Nearfolk</h2>
      <p>
        Discover local businesses, save your favourites
        and find useful offers around you.
      </p>
    </div>
  `;

  result.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function nav(button, name) {
  document.querySelectorAll(".nav").forEach(function (item) {
    item.classList.remove("active");
  });

  button.classList.add("active");

  if (name === "Home") {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  if (name === "Explore") {
    document.getElementById("search").focus();
    toast("Search local businesses");
  }

  if (name === "Offers") {
    showOffers();
  }

  if (name === "Saved") {
    showSaved();
  }

  if (name === "Profile") {
    showProfile();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const search = document.getElementById("search");

  if (search) {
    search.addEventListener("input", searchBusiness);
  }

  document.querySelectorAll(".category").forEach(function (button) {
    button.addEventListener("click", function () {
      const categoryName =
        button.querySelector(".category-name")?.textContent ||
        button.textContent.trim();

      document.querySelectorAll(".category").forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");

      filterCategory(categoryName);
    });
  });
});
