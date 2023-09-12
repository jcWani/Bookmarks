const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnOpenModal = document.querySelector(".btn-show-modal");
const btnCloseModal = document.querySelector(".btn-close-modal");
const websiteNameEl = document.querySelector("#website-name");
const websiteUrlEl = document.querySelector("#website-url");
const formLabel = document.querySelector(".form-label");
const bookmarkForm = document.querySelector("#modal-form");
const bookmarksContainer = document.querySelector(".bookmarks-container");

let bookmarks = [];

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Validate Form
const validate = function (nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);

  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields.");
    return false;
  }

  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address");
    return false;
  }

  // Valid
  return true;
};

const storeBookmark = function () {
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  if (!urlValue.includes("http://", "https://")) {
    urlValue = `https://${urlValue}`;
  }

  if (!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    urlValue: urlValue,
  };
  bookmarks.push(bookmark);
  persistsBookmarks(bookmarks);
  renderBookmark(bookmark);
  bookmarkForm.reset();
  websiteNameEl.focus();
};

const persistsBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
};

const generateMarkup = function (bookmark) {
  return `
  <div class="item">
    <i class="fa-solid fa-circle-xmark btn-delete-bookmark" title="delete-bookmark" onclick="deleteBookmark('${bookmark.urlValue}')"></i>
    <div class="name">
      <img src="https://s2.googleusercontent.com/s2/favicons?domain=${bookmark.urlValue}" alt="Favicon" />
      <a href="${bookmark.urlValue}" target="_blank">${bookmark.name}</a>
    </div>
  </div>
  `;
};

const renderBookmark = function (bookmark) {
  const markup = generateMarkup(bookmark);
  bookmarksContainer.insertAdjacentHTML("beforeend", markup);
};

const renderBookmarks = function () {
  bookmarks.map((bookmark) => {
    const markup = generateMarkup(bookmark);
    bookmarksContainer.insertAdjacentHTML("beforeend", markup);
  });
};

const loadBookmarks = function () {
  const storage = localStorage.getItem("bookmarks");
  if (!storage) return;

  bookmarks = JSON.parse(storage);
  renderBookmarks();
};

const deleteBookmark = function (url) {
  const index = bookmarks.findIndex((bookmark) => bookmark.urlValue === url);
  bookmarks.splice(index, 1);

  persistsBookmarks();
  bookmarksContainer.innerHTML = "";
  renderBookmarks();
};

loadBookmarks();
// Event Handlers

btnOpenModal.addEventListener("click", openModal);
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

bookmarkForm.addEventListener("submit", function (e) {
  e.preventDefault();
  storeBookmark();
});
