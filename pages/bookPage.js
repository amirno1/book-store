const bookInfoTitles = [
  "title",
  "subtitle",
  "authors",
  "publisher",
  "pageCount",
  "categories",
  "language"
];

let cachedBook;

// Rendering book page according to what user selects
const bookPageTemplate = book => {
  const bookPageWrapper = createElement("div", { class: "book-page-wrapper" });

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
    src: book.volumeInfo.imageLinks
      ? book.volumeInfo.imageLinks.thumbnail
      : "https://www.ottofrei.com/sc-app/extensions/VintenCloud/OttoFreiSuiteCommerceTheme/18.2.0/img/no_image_available.jpeg"
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
  let isAdded = cart.find(item => item.id === book.id);
  const bookPageAddOrRemoveWrapper = createElement("div", {
    class: "book-page-add-or-remove-wrapper"
  });

  const bookPageAddOrRemove = document.createElement("span");
  bookPageAddOrRemove.className = isAdded
    ? "fas fa-trash-alt book-page-remove"
    : "fa fa-cart-plus book-page-add";

  bookPageAddOrRemove.addEventListener("click", () => {
    const cartAmount = document.querySelector(".cart-amount");
    if (!isAdded) {
      const bookPrice = book.saleInfo.listPrice
        ? book.saleInfo.listPrice.amount
        : Math.round(Math.random() * 20) + 5;
      addToCart(book, bookPrice);
      bookPageAddOrRemove.className = "fas fa-trash-alt book-page-remove";
      cartAmount.innerHTML = cart.length;
    } else {
      cart = cart.filter(cartItem => cartItem.id !== book.id);
      bookPageAddOrRemove.className = "fa fa-cart-plus book-page-add";
      cartAmount.innerHTML = cart.length;
      cart.find(item => item.id === book.id);
    }
    isAdded = cart.find(item => item.id === book.id);
  });
  bookPageAddOrRemoveWrapper.appendChild(bookPageAddOrRemove);
  appendChildren(bookInfoWrapper, [
    bookInfoTitlesWrapper,
    bookInfoItemsWrapper
  ]);
  appendChildren(bookWrapper, [bookInfoWrapper, bookImageWrapper]);
  bookPageWrapper.appendChild(bookWrapper);
  appendChildren(bookPageWrapper, [bookWrapper, bookPageAddOrRemoveWrapper]);
  return bookPageWrapper;
};
const fetchBook = async bookId => {
  if (!cachedBook || bookId !== cachedBook.id) {
    const bookData = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}`
    );
    const bookInfo = await bookData.json();
    cachedBook = bookInfo;
  }
  return cachedBook;
};
// Fetching the chosen book information
const renderBook = async bookId => {
  try {
    const res = await fetchBook(bookId);
    if (res) {
      mainWrapper.innerHTML = "";
      mainWrapper.appendChild(bookPageTemplate(res));
    } else {
      mainWrapper.innerHTML = "We could not find this book";
    }
  } catch (error) {
    console.log(error);
    mainWrapper.innerHTML = "<h1>Something went wrong</h1>";
  }

  const backToLastSearchButton = createElement("button", {
    class: "back-to-last-search-button"
  });
  backToLastSearchButton.innerHTML = "Back";

  backToLastSearchButton.addEventListener("click", () => {
    window.history.pushState({}, null, `/`);
    renderHome();
    renderBooks(searchWord);
    const searchBar = document.querySelector(".search-bar");
    searchBar.value = searchWord;
  });
  mainWrapper.appendChild(backToLastSearchButton);
};
