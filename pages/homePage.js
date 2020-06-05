let searchWord = "";
let cart = [];
let cachedBooks;
let cartAmount = (document.querySelector(".nav-bar__cart-amount").innerHTML =
  cart.length);
const logoCurrentWidth = document.querySelector(".nav-bar__amir-books-logo")
  .offsetWidth;
const mainWrapper = document.querySelector(".main-wrapper");
const cartButtonHomePage = document.querySelector(".nav-bar__shopping-cart");
cartButtonHomePage.addEventListener("click", () => {
  navigateToCartPage();
});
const navigateToCartPage = () => {
  window.history.pushState({}, null, "/cart");
  renderCart();
};
const navLogo = document.querySelector(".nav-bar__amir-books-logo");
navLogo.addEventListener("click", () => {
  window.history.pushState({}, null, `/`);
  renderHome();
  const searchBar = document.querySelector(".home-page__search-bar");
  searchWord = "";
  searchBar.value = "";
});

// creating home page template
const homePageTemplate = () => `
    <div class="home-page__search-wrapper">
      <div class="home-page__cart-box"></div>
      <input
        class="home-page__search-bar"
        type="text"
        name="search-bar"
        id="search-bar"
      />
      <span class="home-page__warning">Please type a book name here >></span>
      <button class="home-page__search-button">Search</button>
    </div>
    <div class="home-page__cards"></div>`;
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
    const cartAmount = document.querySelector(".nav-bar__cart-amount");
    cartAmount.innerHTML = cart.length;
  });
  plusElement.addEventListener("click", () => {
    itemAmountElement.innerHTML = item.amount += 1;
  });
};

const addToCartBox = item => {
  const cartBox = document.querySelector(".home-page__cart-box");
  const cartItem = createElement("div", {
    class: "home-page__cart-item",
    "data-home-page__cart-item-id": `${item.id}`
  });
  const cartItemAmountWrapper = createElement("div", {
    class: "home-page__cart-item-amount-wrapper"
  });

  const cartItemAmount = createElement("span", {
    class: "home-page__cart-item-amount"
  });
  const cartItemTitle = createElement("p", {
    class: "home-page__cart-item-title"
  });

  cartItemTitle.innerHTML =
    item.title.length < 25 ? item.title : item.title.slice(0, 23) + "...";

  cartItemTitle.addEventListener("click", () => {
    navigateToBookPage(item.id);
  });

  const cartItemImage = createElement("img", {
    class: "home-page__cart-item-image"
  });
  cartItemImage.src = item.image;
  cartItemImage.addEventListener("click", () => {
    navigateToBookPage(item.id);
  });

  cartItemAmount.innerHTML = item.amount;

  const cartItemAmountMinus = createElement("span", {
    class: "home-page__cart-item-amount-minus"
  });
  cartItemAmountMinus.innerHTML = `<ion-icon name="remove-circle-outline"></ion-icon>`;
  const cartItemAmountPlus = createElement("span", {
    class: "home-page__cart-item-amount-plus"
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
const addToCart = (item, itemPrice) => {
  let currentBook = {
    id: item.id,
    amount: 1,
    price: itemPrice,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors ? item.volumeInfo.authors[0] : "Unknown",
    image: item.volumeInfo.imageLinks
      ? item.volumeInfo.imageLinks.thumbnail
      : "https://www.ottofrei.com/sc-app/extensions/VintenCloud/OttoFreiSuiteCommerceTheme/18.2.0/img/no_image_available.jpeg"
  };
  cart.push(currentBook);
  if (window.location.pathname === "/") {
    addToCartBox(currentBook);
  }
};

const removeFromCart = item => {
  cart = cart.filter(cartItem => cartItem.id !== item.id);

  if (window.location.pathname === "/cart") {
    const cartPageItem = document.querySelector(
      `[data-cart-page__item-id="${item.id}"]`
    );
    cartPageItem.parentElement.removeChild(cartPageItem);
  } else {
    const cartBoxItem = document.querySelector(
      `[data-home-page__cart-item-id="${item.id}"]`
    );
    const cardItemButton = document.querySelector(
      `[data-home-page__card-item-id="${item.id}"]`
    );
    cartBoxItem.parentElement.removeChild(cartBoxItem);
    if (cardItemButton) {
      cardItemButton.style.backgroundColor = "#6c9a36";
      cardItemButton.innerHTML = `€ ${item.price}`;
    }
  }

  if (cart.length === 0) {
    const cartBox = document.querySelector(".home-page__cart-box");
    if (cartBox) {
      cartBox.style.opacity = "0";
    } else {
      const cartPageTableWrapper = document.querySelector(
        ".cart-page__table-wrapper"
      );
      cartPageTableWrapper.innerHTML += `<h1 class="cart-page__no-item">There is no item in your cart</h1>`;
    }
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
  const cartBox = document.querySelector(".home-page__cart-box");

  const searchBar = document.querySelector(".home-page__search-bar");
  const searchButton = document.querySelector(".home-page__search-button");
  const cards = document.querySelector(".home-page__cards");
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
      cards.innerHTML = "";
      cachedBooks = null;
      renderBooks(searchWord);
    }
    if (searchWord.length === 0) {
      searchBar.placeholder = "Enter a book name to search";
    }
  });

  searchButton.addEventListener("click", () => {
    cards.innerHTML = "";
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
        const itemPrice = item.saleInfo.listPrice
          ? item.saleInfo.listPrice.amount
          : Math.round(Math.random() * 20) + 5;
        const card = createElement("div", { class: "home-page__card" });
        const addOrRemoveButton = createElement("span", {
          class: "home-page__add-remove-button",
          "data-home-page__card-item-id": `${item.id}`
        });

        if (isAdded) {
          addOrRemoveButton.style.backgroundColor = "#c3063f";
        }

        addOrRemoveButton.innerHTML = isAdded
          ? `<ion-icon class="trash-icon"name="trash-outline"></ion-icon>`
          : `€ ${itemPrice}`;
        addOrRemoveButton.addEventListener("mouseenter", () => {
          isAdded = cart.find(book => book.id === item.id);
          if (!isAdded) {
            addOrRemoveButton.innerHTML += `<span class="fa fa-cart-plus"></span>`;
          }
        });
        addOrRemoveButton.addEventListener("mouseleave", () => {
          isAdded = cart.find(book => book.id === item.id);
          if (!isAdded) {
            addOrRemoveButton.innerHTML = `€ ${itemPrice}`;
          }
        });
        addOrRemoveButton.addEventListener("click", e => {
          e.stopPropagation();
          const cartAmount = document.querySelector(".nav-bar__cart-amount");
          const cartBox = document.querySelector(".home-page__cart-box");
          isAdded = cart.find(book => book.id === item.id);
          if (isAdded) {
            addOrRemoveButton.style.backgroundColor = "#6c9a36";
            removeFromCart(item);
            addOrRemoveButton.innerHTML = `€ ${itemPrice} <span class="fa fa-cart-plus"></span>`;
          } else {
            cartBox.style.opacity = "1";
            addOrRemoveButton.style.backgroundColor = !isAdded
              ? "#c3063f"
              : "#6c9a36";
            addToCart(item, itemPrice);
            addOrRemoveButton.innerHTML = `<ion-icon class= "trash-icon" name="trash-outline"></ion-icon>`;
          }
          cartAmount.innerHTML = cart.length;
          if (cart.length === 0) {
            cartBox.style.opacity = "0";
          }
        });

        card.appendChild(addOrRemoveButton);

        const cardBookImage = createElement("img", {
          class: "home-page__card-book-image"
        });

        const cardBookTitle = createElement("span", {
          class: "home-page__card-book-title"
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

        const cards = document.querySelector(".home-page__cards");
        cards.appendChild(card);
      } else {
        cards.innerHTML =
          "Unfortunately Server is not ready, Please refresh the page and try again";
      }
    });
  } else {
    checkForWarning();
  }
}

// check whether the search bar is empty or not
const checkForWarning = () => {
  const warning = document.querySelector(".home-page__warning");
  const searchBar = document.querySelector(".home-page__search-bar");

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
  const logo = document.querySelector(".nav-bar__amir-books-logo");
  const nav = document.querySelector("nav");
  if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
    if (logoCurrentWidth < 300) {
      logo.style.width = "120px";
    } else {
      logo.style.width = "150px";
    }
    nav.style.backgroundColor = "#18181d";
  } else {
    logo.style.width = logoCurrentWidth.toString() + "px";
    nav.style.backgroundColor = "";
  }
};
