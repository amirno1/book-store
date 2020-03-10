function main() {
  const bookInfoItems = [
    "title",
    "subtitle",
    "authors",
    "publisher",
    "categories",
    "pageCount",
    "language"
  ];
  const homePage = () => `
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

  const bookPage = book => {
    const bookWrapper = document.createElement("div");
    const homeButton = document.createElement("div");
    homeButton.className = "home-button";
    bookWrapper.className = "book-wrapper";

    Object.keys(book.volumeInfo).map(bookInfoItemKey => {
      if (bookInfoItems.includes(bookInfoItemKey)) {
        if (!Array.isArray(book.volumeInfo[bookInfoItemKey])) {
          let bookCurrentItem = document.createElement("div");
          bookCurrentItem.className = "book-info-item";
          bookCurrentItem.innerHTML = `${bookInfoItemKey.toLocaleUpperCase()}: ${
            book.volumeInfo[bookInfoItemKey]
          }`;
          bookWrapper.appendChild(bookCurrentItem);
        } else {
          let bookCurrentItemsWrapper = document.createElement("div");
          bookCurrentItemsWrapper.className = "book-info-item";
          bookCurrentItemsWrapper.innerHTML = `${bookInfoItemKey.toLocaleUpperCase()}: `;
          book.volumeInfo[bookInfoItemKey].forEach(item => {
            let bookCurrentItem = `${item} `;
            bookCurrentItemsWrapper.innerHTML += bookCurrentItem;
          });
          bookWrapper.appendChild(bookCurrentItemsWrapper);
        }
      }
    });
    const backToHome = document.createElement("button");
    backToHome.className = "back-home-button";
    backToHome.innerHTML = "Home";
    bookWrapper.appendChild(backToHome);
    return bookWrapper;
  };

  let searchWord = "";

  const renderBook = async bookId => {
    const mainWrapper = document.querySelector(".main-wrapper");
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${bookId}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data) {
          mainWrapper.innerHTML = "";
          mainWrapper.appendChild(bookPage(data));
          const homeButton = document.querySelector(".back-home-button");
          homeButton.addEventListener("click", renderHome);
        } else {
          mainWrapper.innerHTML = "We could not find this book";
        }
      }
    } catch (error) {
      console.log(error);
      mainWrapper.innerHTML = "Something went wrong";
    }
  };

  function renderHome() {
    const mainWrapper = document.querySelector(".main-wrapper");
    mainWrapper.innerHTML = homePage();

    const searchBar = document.querySelector(".search-bar");
    const searchButton = document.querySelector(".search-button");
    const result = document.querySelector(".result");

    searchBar.addEventListener("keyup", () => {
      searchWord = searchBar.value;
      checkForWarning();
    });

    searchBar.addEventListener("click", () => {
      searchBar.style.border = "";
      searchWord = "";
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
  async function renderBooks(bookName) {
    if (searchWord) {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${bookName}`
      );
      const data = await res.json();
      data.items.forEach((item, index) => {
        if (item) {
          const card = document.createElement("div");
          const image = document.createElement("img");
          const bookInfo = document.createElement("div");
          const title = document.createElement("p");
          card.className = `card ${index}`;
          let bookTitle = item.volumeInfo.title;
          title.innerHTML =
            bookTitle.length >= 25 ? bookTitle.slice(0, 25) + "..." : bookTitle;
          bookInfo.className = `book-info`;
          item.volumeInfo.imageLinks
            ? (image.src = `${item.volumeInfo.imageLinks.thumbnail}`)
            : (image.src = `https://www.ottofrei.com/sc-app/extensions/VintenCloud/OttoFreiSuiteCommerceTheme/18.2.0/img/no_image_available.jpeg`);
          image.className = "book-image";
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
}

window.onload = main();
