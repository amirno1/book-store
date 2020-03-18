let searchWord = "";
let cart = [];

// creating home page template
const homePageTemplate = () => `
    <div class="search-wrapper">
      <h1 class="search-header">Enter a book name to search</h1>
      <input
        class="search-bar"
        type="text"
        name="search-bar"
        id="search-bar"
      />
      <span class="warning">Please type a book name here >></span>
      <button class="search-button">Search</button>
    </div>
    <div class="result"></div>`;

// add The book to the cart
const addToCard = item => {
  let currentBook = {
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors[0],
    image: item.volumeInfo.imageLinks.thumbnail
  };
  cart.push(currentBook);
  console.log(cart);
};

// render home page template
function renderHome() {
  const mainWrapper = document.querySelector(".main-wrapper");
  mainWrapper.innerHTML = homePageTemplate();

  const searchBar = document.querySelector(".search-bar");
  const searchButton = document.querySelector(".search-button");
  const result = document.querySelector(".result");

  searchBar.addEventListener("keyup", () => {
    searchWord = searchBar.value;
    checkForWarning();
  });

  searchBar.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      result.innerHTML = "";
      renderBooks(searchWord);
    }
  });

  searchButton.addEventListener("click", () => {
    result.innerHTML = "";
    renderBooks(searchWord);
  });
}

renderHome();

// Render all the books that has the search woord in it
async function renderBooks(bookName) {
  if (searchWord) {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${bookName}`
    );
    const data = await res.json();
    data.items.forEach((item, index) => {
      if (item) {
        const card = document.createElement("div");
        card.className = `card ${index}`;

        const addButton = document.createElement("span");
        addButton.className = "add-button";
        addButton.innerHTML = "+";
        addButton.addEventListener("click", e => {
          e.stopPropagation();
          addToCard(item);
        });
        card.appendChild(addButton);

        const image = document.createElement("img");
        image.className = "book-image";

        const bookInfo = document.createElement("div");
        bookInfo.className = "book-info";

        const title = document.createElement("p");

        let bookTitle = item.volumeInfo.title;

        title.innerHTML =
          bookTitle.length >= 25 ? bookTitle.slice(0, 25) + "..." : bookTitle;
        item.volumeInfo.imageLinks
          ? (image.src = `${item.volumeInfo.imageLinks.thumbnail}`)
          : (image.src = `https://www.ottofrei.com/sc-app/extensions/VintenCloud/OttoFreiSuiteCommerceTheme/18.2.0/img/no_image_available.jpeg`);

        bookInfo.appendChild(title);
        card.appendChild(image);
        card.appendChild(bookInfo);

        card.addEventListener("click", () => {
          window.history.pushState({}, null, `/book?id=${item.id}`);
          renderBook(item.id);
        });

        const result = document.querySelector(".result");
        result.appendChild(card);
      } else {
        result.innerHTML =
          "Unfortunately Server is not ready, Please refresh the page and try again";
      }
    });
  } else {
    checkForWarning();
  }
}

// check whether the search bar is empty or not
const checkForWarning = () => {
  const warning = document.querySelector(".warning");
  const searchBar = document.querySelector(".search-bar");

  if (searchWord) {
    warning.style.opacity = "0";
    warning.style.left = "1%";
    searchBar.style.border = "";
  } else {
    warning.style.opacity = "1";
    warning.style.left = "9%";
    searchBar.style.border = "2px solid red";
  }
};
