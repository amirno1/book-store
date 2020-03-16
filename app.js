function main() {
  const bookInfoTitles = [
    "title",
    "subtitle",
    "authors",
    "publisher",
    "pageCount",
    "categories",
    "language"
  ];
  // creating home page template
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

  // Rendering book page according to what user selects
  const bookPage = book => {
    const bookWrapper = document.createElement("div");
    bookWrapper.className = "book-wrapper";
    const bookInfoTitlesWrapper = document.createElement("div");
    bookInfoTitlesWrapper.className = "book-info-titles-wrapper";
    bookWrapper.appendChild(bookInfoTitlesWrapper);
    const bookInfoItemsWrapper = document.createElement("div");
    bookInfoItemsWrapper.className = "book-info-items-wrapper";
    const homeButton = document.createElement("div");
    homeButton.className = "home-button";

    // create info titles according to info avalibility of the book
    const bookPageCreateTitles = title => {
      const bookInfoItemtitle = document.createElement("div");
      bookInfoItemtitle.className = "book-info-title";
      bookInfoItemtitle.innerHTML =
        title[0].toLocaleUpperCase() + title.slice(1) + ":";
      bookInfoTitlesWrapper.appendChild(bookInfoItemtitle);
    };

    // Take only the information we need out of the respond we get from api
    Object.keys(book.volumeInfo).map(bookInfoItemKey => {
      if (bookInfoTitles.includes(bookInfoItemKey)) {
        bookPageCreateTitles(bookInfoItemKey);
        if (!Array.isArray(book.volumeInfo[bookInfoItemKey])) {
          let bookCurrentItem = document.createElement("div");
          bookCurrentItem.className = "book-info-item";
          bookCurrentItem.innerHTML =
            book.volumeInfo[bookInfoItemKey].toString().length <= 85
              ? `${book.volumeInfo[bookInfoItemKey]}`
              : `${book.volumeInfo[bookInfoItemKey].slice(0, 85)}...`;
          bookInfoItemsWrapper.appendChild(bookCurrentItem);
        } else {
          let bookCurrentItemsWrapper = document.createElement("div");
          bookCurrentItemsWrapper.className = "book-info-item";
          book.volumeInfo[bookInfoItemKey].forEach(item => {
            let bookCurrentItem = `${item} `;
            bookCurrentItemsWrapper.innerHTML += bookCurrentItem;
          });
          bookInfoItemsWrapper.appendChild(bookCurrentItemsWrapper);
        }
      }
    });
    bookWrapper.appendChild(bookInfoItemsWrapper);
    return bookWrapper;
  };

  let searchWord = "";

  // Fetching the chosen book information
  const renderBook = async bookId => {
    const mainWrapper = document.querySelector(".main-wrapper");
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${bookId}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data) {
          // console.log(data);
          mainWrapper.innerHTML = "";
          mainWrapper.appendChild(bookPage(data));
        } else {
          mainWrapper.innerHTML = "We could not find this book";
        }
      }
    } catch (error) {
      console.log(error);
      mainWrapper.innerHTML = "Something went wrong";
    }
    const backToHome = document.createElement("button");
    backToHome.className = "back-home-button";
    backToHome.innerHTML = "Home";
    backToHome.addEventListener("click", () => {
      window.history.pushState({}, null, `/`);
      renderHome();
    });
    mainWrapper.appendChild(backToHome);
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
}

window.onload = main();
