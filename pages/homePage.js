let searchWord = "";
let cart = [];
let cartShown;
let cachedBooks;

const mainWrapper = document.querySelector(".main-wrapper");

const cartAmount = (document.querySelector(".cart-amount").innerHTML =
  cart.length);
const cartButtonHomePage = document.querySelector(".fa-cart-arrow-down");
cartButtonHomePage.addEventListener("click", () => {
  navigateToCartPage();
});
const navigateToCartPage = () => {
  window.history.pushState({}, null, "/cart");
  renderCart();
};
const navLogo = document.querySelector(".amir-books-logo");
navLogo.addEventListener("click", () => {
  window.history.pushState({}, null, `/`);
  renderHome();
  const searchBar = document.querySelector(".search-bar");
  searchWord = "";
  searchBar.value = "";
});
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

const handleItemAmount = (
  item,
  minusElement,
  plusElement,
  itemAmountElement
) => {
  minusElement.addEventListener("click", () => {
    if (item.amount > 1) {
      itemAmountElement.innerHTML = item.amount -= 1;
    } else {
      removeFromCart(item);
    }
    const cartAmount = document.querySelector(".cart-amount");
    cartAmount.innerHTML = cart.length;
  });
  plusElement.addEventListener("click", () => {
    itemAmountElement.innerHTML = item.amount += 1;
  });
};

const addToCartBox = item => {
  const cartBox = document.querySelector(".cart-box");
  const cartItem = createElement("div", {
    class: "cart-item",
    "data-cart-item-id": item.id
  });
  const cartItemAmountWrapper = createElement("div", {
    class: "cart-item-amount-wrapper"
  });

  const cartItemAmount = createElement("span", {
    class: "cart-item-amount"
  });
  const cartItemTitle = createElement("p", {
    class: "cart-item-title"
  });

  cartItemTitle.innerHTML =
    item.title.length < 25 ? item.title : item.title.slice(0, 25) + "...";

  cartItemTitle.addEventListener("click", () => {
    navigateToBookPage(item.id);
  });

  const cartItemImage = createElement("img", {
    class: "cart-item-amount"
  });
  cartItemImage.src = item.image;

  cartItemAmount.innerHTML = item.amount;

  const cartItemAmountMinus = createElement("span", {
    class: "cart-item-amount-minus"
  });
  cartItemAmountMinus.innerHTML = `<ion-icon name="remove-circle-outline"></ion-icon>`;
  const cartItemAmountPlus = createElement("span", {
    class: "cart-item-amount-plus"
  });
  cartItemAmountPlus.innerHTML = `<ion-icon name="add-circle-outline"></ion-icon>`;

  appendChildren(cartItemAmountWrapper, [
    cartItemAmountMinus,
    cartItemAmount,
    cartItemAmountPlus
  ]);
  cartItem.appendChild(cartItemAmountWrapper);
  appendChildren(cartItem, [cartItemTitle, cartItemImage]);
  cartBox.appendChild(cartItem);

  handleItemAmount(
    item,
    cartItemAmountMinus,
    cartItemAmountPlus,
    cartItemAmount
  );
};
const addToCart = item => {
  let currentBook = {
    id: item.id,
    amount: 1,
    price: item.saleInfo.listPrice
      ? item.saleInfo.listPrice.amount
      : Math.round(Math.random() * 20) + 5,
    title: item.volumeInfo.title,
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
  const cartPageItem = document.querySelector(
    `[data-cart-page-item-id=${item.id}]`
  );
  const cardItemButton = document.querySelector(
    `[data-card-item-id=${item.id}]`
  );
  if (cartBoxItem) {
    cartBoxItem.parentElement.removeChild(cartBoxItem);
  } else {
    cartPageItem.parentElement.removeChild(cartPageItem);
  }
  if (cart.length === 0) {
    const cartBox = document.querySelector(".cart-box");
    if (cartBox) {
      cartBox.style.opacity = "0";
    } else {
      const cartPageTableWrapper = document.querySelector(
        ".cart-table-wrapper"
      );
      cartPageTableWrapper.innerHTML += `<h1>There is no item in your cart</h1>`;
    }
  }
  if (cardItemButton) {
    cardItemButton.style.backgroundColor = "#6c9a36";
    cardItemButton.innerHTML = `<ion-icon name="cart-outline"></ion-icon>`;
  }
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
const navigateToBookPage = bookId => {
  window.history.pushState({}, null, `/book?id=${bookId}`);
  renderBook(bookId);
};
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

const appendChildren = (element, children) => {
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
        const card = createElement("div", { class: "card" });
        const addOrRemoveButton = createElement("span", {
          class: "add-remove-button",
          "data-card-item-id": item.id
        });

        if (isAdded) {
          addOrRemoveButton.style.backgroundColor = "#c3063f";
        }
        addOrRemoveButton.innerHTML = isAdded
          ? `<ion-icon name="trash-outline"></ion-icon>`
          : `<ion-icon name="cart-outline"></ion-icon>`;
        addOrRemoveButton.addEventListener("click", e => {
          e.stopPropagation();
          const cartAmount = document.querySelector(".cart-amount");
          const cartBox = document.querySelector(".cart-box");
          isAdded = cart.find(book => book.id === item.id);
          if (isAdded) {
            addOrRemoveButton.style.backgroundColor = "#6c9a36";
            removeFromCart(item);
            addOrRemoveButton.innerHTML = `<ion-icon name="cart-outline"></ion-icon>`;
          } else {
            cartBox.style.opacity = "1";
            addOrRemoveButton.style.backgroundColor = !isAdded
              ? "#c3063f"
              : "#6c9a36";
            addToCart(item);
            addOrRemoveButton.innerHTML = `<ion-icon name="trash-outline"></ion-icon>`;
          }
          cartAmount.innerHTML = cart.length;
          if (cart.length === 0) {
            cartBox.style.opacity = "0";
          }
        });

        card.appendChild(addOrRemoveButton);

        const cardBookImage = createElement("img", {
          class: "card-book-image"
        });

        const cardBookTitle = createElement("span", {
          class: "card-book-title"
        });

        let bookTitle = item.volumeInfo.title;

        cardBookTitle.innerHTML =
          bookTitle.length <= 25 ? bookTitle : bookTitle.slice(0, 25) + "...";
        item.volumeInfo.imageLinks
          ? (cardBookImage.src = `${item.volumeInfo.imageLinks.thumbnail}`)
          : (cardBookImage.src = `https://www.ottofrei.com/sc-app/extensions/VintenCloud/OttoFreiSuiteCommerceTheme/18.2.0/img/no_image_available.jpeg`);

        appendChildren(card, [cardBookTitle, cardBookImage]);

        card.addEventListener("click", () => {
          navigateToBookPage(item.id);
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
window.onscroll = () => {
  scrollHandler();
};

const scrollHandler = () => {
  const logo = document.querySelector(".amir-books-logo");
  const nav = document.querySelector("nav");
  if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
    logo.style.width = "150px";
    nav.style.backgroundColor = "#18181d";
  } else {
    logo.style.width = "300px";
    nav.style.backgroundColor = "";
  }
};
