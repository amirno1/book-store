let searchWord = "";
let cart = [];
let cartShown;
let cachedBooks;

const cartAmount = (document.querySelector(".cart-amount").innerHTML =
  cart.length);
// creating home page template
const homePageTemplate = () => `
    <div class="search-wrapper">
      <div class="cart-box"></div>
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

const addToCartBox = item => {
  const cartBox = document.querySelector(".cart-box");
  const cartItem = createElement("div", {
    class: "cart-item",
    "data-cart-item-id": item.id
  });
  const cartItemAmountWrapper = createElement("div", {
    class: "cart-item-amount-wrapper"
  });
  const cartItemAmountMinus = createElement("span", {
    class: "cart-item-amount-minus"
  });
  cartItemAmountMinus.innerHTML = `<ion-icon name="arrow-back-outline"></ion-icon>`;
  const cartItemAmount = createElement("span", {
    class: "cart-item-amount"
  });
  const cartItemTitle = createElement("p", {
    class: "cart-item-title"
  });
  cartItemTitle.innerHTML = item.title;

  const cartItemImage = createElement("img", {
    class: "cart-item-amount"
  });
  cartItemImage.src = item.image;

  cartItemAmount.innerHTML = item.amount;
  const cartItemAmountPlus = createElement("span", {
    class: "cart-item-amount-plus"
  });
  cartItemAmountPlus.innerHTML = `<ion-icon name="arrow-forward-outline"></ion-icon>`;

  appendChilderen(cartItemAmountWrapper, [
    cartItemAmountMinus,
    cartItemAmount,
    cartItemAmountPlus
  ]);
  cartItem.appendChild(cartItemAmountWrapper);
  appendChilderen(cartItem, [cartItemTitle, cartItemImage]);
  cartBox.appendChild(cartItem);

  cartItemAmountMinus.addEventListener("click", () => {
    if (item.amount > 1) {
      cartItemAmount.innerHTML = item.amount -= 1;
    } else {
      const cartAmount = document.querySelector(".cart-amount");
      removeFromCart(item);
      cartAmount.innerHTML = cart.length;
    }
  });
  cartItemAmountPlus.addEventListener("click", () => {
    cartItemAmount.innerHTML = item.amount += 1;
  });
};
const addToCart = item => {
  let currentBook = {
    id: item.id,
    amount: 1,
    title:
      item.volumeInfo.title.length < 25
        ? item.volumeInfo.title
        : item.volumeInfo.title.slice(0, 25) + "...",
    authors: item.volumeInfo.authors ? item.volumeInfo.authors[0] : "Unknown",
    image: item.volumeInfo.imageLinks
      ? item.volumeInfo.imageLinks.thumbnail
      : "https://www.ottofrei.com/sc-app/extensions/VintenCloud/OttoFreiSuiteCommerceTheme/18.2.0/img/no_image_available.jpeg"
  };
  cart.push(currentBook);
  addToCartBox(currentBook);
};

const removeFromCart = item => {
  cart = cart.filter(cartItem => cartItem.id !== item.id);
  const cartBoxItem = document.querySelector(`[data-cart-item-id=${item.id}]`);
  const cardItemButton = document.querySelector(
    `[data-card-item-id=${item.id}]`
  );
  cartBoxItem.parentElement.removeChild(cartBoxItem);
  if (cart.length === 0) {
    const cartBox = document.querySelector(".cart-box");
    cartBox.style.opacity = "0";
  }
  cardItemButton.style.backgroundColor = "#6c9a36";
  cardItemButton.innerHTML = `<ion-icon name="add-outline"></ion-icon>`;
};

const createElement = (elementType, attributes) => {
  const element = document.createElement(elementType);

  for (key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
};
// render home page template
function renderHome() {
  const mainWrapper = document.querySelector(".main-wrapper");
  mainWrapper.innerHTML = homePageTemplate();
  const cartBox = document.querySelector(".cart-box");

  const searchBar = document.querySelector(".search-bar");
  const searchButton = document.querySelector(".search-button");
  const result = document.querySelector(".result");
  searchBar.placeholder = "Enter a book name to search";
  if (cart.length !== 0) {
    cart.forEach(item => addToCartBox(item));
    cartBox.style.opacity = "1";
  }
  if (searchWord) {
    searchBar.value = searchWord;
  }

  searchBar.addEventListener("keyup", () => {
    searchWord = searchBar.value;
    checkForWarning();
  });
  searchBar.addEventListener("click", () => {
    searchBar.placeholder = "";
  });

  searchBar.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      result.innerHTML = "";
      cachedBooks = null;
      renderBooks(searchWord);
    }
    if (searchWord.length === 0) {
      searchBar.placeholder = "Enter a book name to search";
    }
  });

  searchButton.addEventListener("click", () => {
    result.innerHTML = "";
    cachedBooks = null;
    renderBooks(searchWord);
  });
}

const fetchBooks = async bookName => {
  if (!cachedBooks) {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${bookName}`
    );
    const data = await res.json();
    cachedBooks = data;
  }
  return cachedBooks;
};

const appendChilderen = (element, children) => {
  children.forEach(child => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  return element;
};

// Render all the books that has the search woord in it
async function renderBooks(bookName) {
  if (searchWord) {
    const data = await fetchBooks(bookName);
    data.items.forEach(item => {
      if (item) {
        let isAdded = cart.find(book => book.id === item.id);
        const card = createElement("div", { class: "card" }, [Image, bookInfo]);

        const addOrRemoveButton = createElement("span", {
          class: "add-remove-button",
          "data-card-item-id": item.id
        });

        if (isAdded) {
          addOrRemoveButton.style.backgroundColor = "#c3063f";
        }
        addOrRemoveButton.innerHTML = isAdded
          ? `<ion-icon name="close-outline"></ion-icon>
`
          : `<ion-icon name="add-outline"></ion-icon>`;
        addOrRemoveButton.addEventListener("click", e => {
          e.stopPropagation();
          const cartAmount = document.querySelector(".cart-amount");
          const cartBox = document.querySelector(".cart-box");
          isAdded = cart.find(book => book.id === item.id);
          if (isAdded) {
            addOrRemoveButton.style.backgroundColor = "#6c9a36";
            removeFromCart(item);
            addOrRemoveButton.innerHTML = `<ion-icon name="add-outline"></ion-icon>`;
          } else {
            cartBox.style.opacity = "1";
            addOrRemoveButton.style.backgroundColor = !isAdded
              ? "#c3063f"
              : "#6c9a36";
            addToCart(item);
            addOrRemoveButton.innerHTML = `<ion-icon name="close-outline"></ion-icon>
`;
          }
          cartAmount.innerHTML = cart.length;
          if (cart.length === 0) {
            cartBox.style.opacity = "0";
          }
        });

        card.appendChild(addOrRemoveButton);

        const image = createElement("img", { class: "book-image" });

        var bookInfo = createElement("div", { class: "book-info" });

        const title = createElement("p");

        let bookTitle = item.volumeInfo.title;

        title.innerHTML =
          bookTitle.length >= 25 ? bookTitle.slice(0, 25) + "..." : bookTitle;
        item.volumeInfo.imageLinks
          ? (image.src = `${item.volumeInfo.imageLinks.thumbnail}`)
          : (image.src = `https://www.ottofrei.com/sc-app/extensions/VintenCloud/OttoFreiSuiteCommerceTheme/18.2.0/img/no_image_available.jpeg`);

        bookInfo.appendChild(title);
        appendChilderen(card, [image, bookInfo]);

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

renderHome();
