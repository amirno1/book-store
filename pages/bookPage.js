const bookInfoTitles = [
  "title",
  "subtitle",
  "authors",
  "publisher",
  "pageCount",
  "categories",
  "language"
];

// Rendering book page according to what user selects
const bookPageTemplate = book => {
  const bookWrapper = createElement("div", { class: "book-wrapper" });

  const bookInfoTitlesWrapper = createElement("div", {
    class: "book-info-titles-wrapper"
  });

  bookWrapper.appendChild(bookInfoTitlesWrapper);
  const bookInfoItemsWrapper = createElement("div", {
    class: "book-info-items-wrapper"
  });

  // const homeButton = createElement("div", { class: "home-button" });

  // create info titles according to info avalibility of the book
  const bookPageCreateTitles = title => {
    const bookInfoItemtitle = createElement("div", {
      class: "book-info-title"
    });

    bookInfoItemtitle.innerHTML =
      title[0].toLocaleUpperCase() + title.slice(1) + ":";
    bookInfoTitlesWrapper.appendChild(bookInfoItemtitle);
  };

  // Take only the information we need out of the respond we get from api
  Object.keys(book.volumeInfo).map(bookInfoItemKey => {
    if (bookInfoTitles.includes(bookInfoItemKey)) {
      bookPageCreateTitles(bookInfoItemKey);
      if (!Array.isArray(book.volumeInfo[bookInfoItemKey])) {
        let bookCurrentItem = createElement("div", { class: "book-info-item" });

        bookCurrentItem.innerHTML =
          book.volumeInfo[bookInfoItemKey].toString().length <= 85
            ? `${book.volumeInfo[bookInfoItemKey]}`
            : `${book.volumeInfo[bookInfoItemKey].slice(0, 82)}...`;
        bookInfoItemsWrapper.appendChild(bookCurrentItem);
      } else {
        let bookCurrentItemsWrapper = createElement("div", {
          class: "book-info-item"
        });
        bookCurrentItemsWrapper.className = "book-info-item";
        book.volumeInfo[bookInfoItemKey].forEach(item => {
          let bookCurrentItem = `${item} `;
          bookCurrentItemsWrapper.innerHTML += bookCurrentItem;
        });
        if (bookCurrentItemsWrapper.innerHTML.length >= 85) {
          bookCurrentItemsWrapper.innerHTML = `${bookCurrentItemsWrapper.innerHTML.slice(
            0,
            82
          )}...`;
        }
        bookInfoItemsWrapper.appendChild(bookCurrentItemsWrapper);
      }
    }
  });
  bookWrapper.appendChild(bookInfoItemsWrapper);
  return bookWrapper;
};

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
        mainWrapper.innerHTML = "";
        mainWrapper.appendChild(bookPageTemplate(data));
      } else {
        mainWrapper.innerHTML = "We could not find this book";
      }
    }
  } catch (error) {
    console.log(error);
    mainWrapper.innerHTML = "<div>Something went wrong</div>";
  }

  const backToHome = createElement("button", {
    class: "back-home-button"
  });
  backToHome.innerHTML = "Home";

  backToHome.addEventListener("click", () => {
    window.history.pushState({}, null, `/`);
    renderHome();
    renderBooks(searchWord);
    const searchBar = document.querySelector(".search-bar");
    searchBar.value = searchWord;
  });
  mainWrapper.appendChild(backToHome);
};
