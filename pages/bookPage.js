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

  const bookInfoWrapper = createElement("div", {
    class: "book-info-wrapper"
  });
  const bookInfoTitlesWrapper = createElement("div", {
    class: "book-info-titles-wrapper"
  });

  const bookInfoItemsWrapper = createElement("div", {
    class: "book-info-items-wrapper"
  });

  const bookImageWrapper = createElement("div", {
    class: "book-image-wrapper"
  });

  const bookImage = createElement("img", {
    src: book.volumeInfo.imageLinks.thumbnail
  });
  bookImageWrapper.appendChild(bookImage);

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
        let bookCurrentItem = createElement("p", { class: "book-info-item" });

        bookCurrentItem.innerHTML =
          book.volumeInfo[bookInfoItemKey].toString().length <= 80
            ? `${book.volumeInfo[bookInfoItemKey]}`
            : `${book.volumeInfo[bookInfoItemKey].slice(0, 77)}...`;
        bookInfoItemsWrapper.appendChild(bookCurrentItem);
      } else {
        let bookCurrentItemsWrapper = createElement("p", {
          class: "book-info-item"
        });
        bookCurrentItemsWrapper.className = "book-info-item";
        book.volumeInfo[bookInfoItemKey].forEach(item => {
          let bookCurrentItem = `${item} `;
          bookCurrentItemsWrapper.innerHTML += bookCurrentItem;
        });
        if (bookCurrentItemsWrapper.innerHTML.length >= 80) {
          bookCurrentItemsWrapper.innerHTML = `${bookCurrentItemsWrapper.innerHTML.slice(
            0,
            77
          )}...`;
        }
        bookInfoItemsWrapper.appendChild(bookCurrentItemsWrapper);
      }
    }
  });
  bookInfoWrapper.appendChild(bookInfoTitlesWrapper);
  bookInfoWrapper.appendChild(bookInfoItemsWrapper);
  bookWrapper.appendChild(bookInfoWrapper);
  bookWrapper.appendChild(bookImageWrapper);
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
