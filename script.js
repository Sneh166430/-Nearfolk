
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

// Saved businesses are stored on this device.
let savedBusinesses = [];

try {
  savedBusinesses = JSON.parse(
    localStorage.getItem("nearfolk_saved") || "[]"
  );

  if (!Array.isArray(savedBusinesses)) {
    savedBusinesses = [];
  }
} catch (error) {
  savedBusinesses = [];
}

let currentView = "Home";
let currentQuery = "";
let currentCategory = "";

function storeSavedBusinesses() {
  try {
    localStorage.setItem(
      "nearfolk_saved",
      JSON.stringify(savedBusinesses)
    );
  } catch (error) {
    toast("Could not save on this device");
  }
}

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

  clearTimeout(window.nearfolkToastTimer);

  window.nearfolkToastTimer = setTimeout(function () {
    box.classList.remove("show");
  }, 1800);
}

function createBusinessCard(business) {
  const isSaved = savedBusinesses.includes(business.name);

  return `
    <article class="business-card">
      <div class="business-top">
        <div class="business-icon">${business.icon}</div>

        <div class="business-info">
          <h3>${business.name}</h3>
          <p>${business.description}</p>
        </div>

        <button
          class="save-btn ${isSaved ? "saved" : ""}"
          onclick="toggleSave('${business.name}')"
          aria-label="Save ${business.name}"
        >
          ${isSaved ? "♥" : "♡"}
        </button>
      </div>

      <div class="business-bottom">
        <span class="rating">⭐ ${business.rating}</span>
        <span class="distance">📍 ${business.distance}</span>
      </div>
    </article>
  `;
}

function showBusinesses(list, title) {
  const result = document.getElementById("result");
  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");

  if (!result || !resultTitle || !resultText) return;

  resultTitle.textContent = title;

  resultText.innerHTML = list.length
    ? `<div class="card-list">${list.map(createBusinessCard).join("")}</div>`
    : `<div class="empty">No matching demo businesses found. Try another search.</div>`;

  result.classList.add("show");

  result.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function category(name) {
  currentView = "Category";
  currentCategory = name;
  currentQuery = "";

  const matches = businesses.filter(function (business) {
    return business.category.toLowerCase() === name.toLowerCase();
  });

  showBusinesses(matches, name + " near you");
}

function searchBusiness() {
  const input = document.getElementById("search");
  const result = document.getElementById("result");

  if (!input || !result) return;

  currentQuery = input.value.trim();

  if (!currentQuery) {
    result.classList.remove("show");
    currentView = "Home";
    return;
  }

  currentView = "Search";

  const query = currentQuery.toLowerCase();

  const matches = businesses.filter(function (business) {
    return (
      business.name.toLowerCase().includes(query) ||
      business.category.toLowerCase().includes(query) ||
      business.description.toLowerCase().includes(query)
    );
  });

  showBusinesses(matches, 'Results for "' + currentQuery + '"');
}

function toggleSave(name) {
  const index = savedBusinesses.indexOf(name);

  if (index === -1) {
    savedBusinesses.push(name);
    toast(name + " saved ❤️");
  } else {
    savedBusinesses.splice(index, 1);
    toast(name + " removed from saved");
  }

  storeSavedBusinesses();
  refreshVisibleResults();
  updateSaveButtons();
}

// Supports the save(this) buttons already present in index.html.
function save(button) {
  if (!button) return;

  const card = button.closest(".business");
  const nameElement = card
    ? card.querySelector(".business-info h3")
    : null;

  if (!nameElement) return;

  const name = nameElement.textContent.trim();
  const isSaved = savedBusinesses.includes(name);

  if (isSaved) {
    savedBusinesses = savedBusinesses.filter(function (item) {
      return item !== name;
    });

    toast(name + " removed from saved");
  } else {
    savedBusinesses.push(name);
    toast(name + " saved ❤️");
  }

  storeSavedBusinesses();
  updateSaveButtons();
}

function updateSaveButtons() {
  document.querySelectorAll(".heart").forEach(function (button) {
    const card = button.closest(".business");
    const heading = card
      ? card.querySelector(".business-info h3")
      : null;

    if (!heading) return;

    const isSaved = savedBusinesses.includes(
      heading.textContent.trim()
    );

    button.classList.toggle("saved", isSaved);
    button.textContent = isSaved ? "♥" : "♡";
  });
}

function refreshVisibleResults() {
  if (currentView === "Search") {
    const input = document.getElementById("search");
    if (input) searchBusiness();
  } else if (currentView === "Category") {
    category(currentCategory);
  } else if (currentView === "Saved") {
    showSaved();
  }
}

function showSaved() {
  currentView = "Saved";

  const saved = businesses.filter(function (business) {
    return savedBusinesses.includes(business.name);
  });

  showBusinesses(saved, "Your saved businesses");
}

function showOffers() {
  currentView = "Offers";

  const result = document.getElementById("result");
  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");

  if (!result || !resultTitle || !resultText) return;

  resultTitle.textContent = "Today's demo offers";

  resultText.innerHTML = `
    <div class="card-list">
      <article class="business-card">
        <h3>☕ The Daily Brew</h3>
        <p>Demo offer: 15% off your next coffee order.</p>
      </article>

      <article class="business-card">
        <h3>👕 Urban Threads</h3>
        <p>Demo offer: Buy 2 items and get 10% off.</p>
      </article>

      <article class="business-card">
        <h3>🥗 Green Bowl</h3>
        <p>Demo offer: Healthy lunch combo.</p>
      </article>
    </div>
  `;

  result.classList.add("show");
  result.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function showProfile() {
  currentView = "Profile";

  const result = document.getElementById("result");
  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");

  if (!result || !resultTitle || !resultText) return;

  resultTitle.textContent = "Your Nearfolk profile";

  resultText.innerHTML = `
    <div class="profile-card">
      <h2>👋 Welcome to Nearfolk</h2>
      <p>
        Discover local businesses, save your favourites
        and explore local offers.
      </p>
      <p>Saved places on this device: ${savedBusinesses.length}</p>
    </div>
  `;

  result.classList.add("show");
  result.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function nav(button, name) {
  document.querySelectorAll(".nav").forEach(function (item) {
    item.classList.remove("active");
  });

  if (button) button.classList.add("active");

  if (name === "Home") {
    currentView = "Home";

    const result = document.getElementById("result");
    if (result) result.classList.remove("show");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  if (name === "Explore") {
    currentView = "Home";

    const search = document.getElementById("search");

    if (search) {
      search.focus();
      search.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    toast("Search local demo businesses");
  }

  if (name === "Offers") showOffers();
  if (name === "Saved") showSaved();
  if (name === "Profile") showProfile();
}

        
  
  
  
  
  
     
