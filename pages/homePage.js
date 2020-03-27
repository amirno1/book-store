let searchWord = "";
let cart = [];
let cartShown;
let cachedBooks;

// creating home page template
const homePageTemplate = () => `
    <div class="search-wrapper">
      <div class="fas fa-cart-arrow-down"><span class="cart-amount">${cart.length}</span></div>
      <div class="cart-box"></div>
      </div>
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

// const eventAttachement = item => {

//   });
// };
// add The book to the cart
const addToCart = item => {
  const cartBox = document.querySelector(".cart-box");
  const alreadyExisted = checkIfAlreadyAdded(item.id);
  if (!alreadyExisted) {
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

    const cartItem = createElement("div", {
      class: "cart-item",
      "data-item-id": currentBook.id
    });
    const cartItemAmountWrapper = createElement("div", {
      class: "cart-item-amount-wrapper"
    });
    const cartItemAmountMinus = createElement("span", {
      class: "cart-item-amount-minus"
    });
    cartItemAmountMinus.innerHTML = "-";
    const cartItemAmount = createElement("span", {
      class: "cart-item-amount"
    });
    const cartItemTitle = createElement("p", {
      class: "cart-item-title"
    });
    cartItemTitle.innerHTML = currentBook.title;

    const cartItemImage = createElement("img", {
      class: "cart-item-amount"
    });
    cartItemImage.src = currentBook.image;

    cartItemAmount.innerHTML = currentBook.amount;
    const cartItemAmountPlus = createElement("span", {
      class: "cart-item-amount-plus"
    });
    cartItemAmountPlus.innerHTML = "+";

    appendChilderen(cartItemAmountWrapper, [
      cartItemAmountMinus,
      cartItemAmount,
      cartItemAmountPlus
    ]);
    cartItem.appendChild(cartItemAmountWrapper);
    appendChilderen(cartItem, [cartItemTitle, cartItemImage]);
    cartBox.appendChild(cartItem);

    cartItemAmountMinus.addEventListener("click", () => {
      cartItemAmount.innerHTML = currentBook.amount -= 1;
    });
    cartItemAmountPlus.addEventListener("click", () => {
      cartItemAmount.innerHTML = currentBook.amount += 1;
    });
  }
};

const removeFromCart = itemId => {
  cart = cart.filter(cartItem => cartItem.id !== itemId);
};

const checkIfAlreadyAdded = itemId => {
  const alreadyExisted = cart.filter(cartItem => cartItem.id === itemId);
  if (alreadyExisted.length !== 0) {
    return true;
  } else {
    return false;
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
  const mainWrapper = document.querySelector(".main-wrapper");
  mainWrapper.innerHTML = homePageTemplate();

  const searchBar = document.querySelector(".search-bar");
  const searchButton = document.querySelector(".search-button");
  const result = document.querySelector(".result");
  if (searchWord) {
    searchBar.value = searchWord;
  }

  searchBar.addEventListener("keyup", () => {
    searchWord = searchBar.value;
    checkForWarning();
  });

  searchBar.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      result.innerHTML = "";
      cachedBooks = null;
      renderBooks(searchWord);
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
        let isAdded;
        const card = createElement("div", { class: "card" }, [Image, bookInfo]);

        const addOrRemoveButton = createElement("span", {
          class: "add-remove-button"
        });

        if (checkIfAlreadyAdded(item.id)) {
          addOrRemoveButton.style.backgroundColor = "#F43E00";
          isAdded = true;
        }
        addOrRemoveButton.innerHTML = isAdded ? "x" : "+";
        addOrRemoveButton.addEventListener("click", e => {
          e.stopPropagation();
          const cartAmount = document.querySelector(".cart-amount");
          const cartBox = document.querySelector(".cart-box");
          if (isAdded) {
            addOrRemoveButton.style.backgroundColor = "#6c9a36";
            removeFromCart(item.id);
            addOrRemoveButton.innerHTML = "+";
          } else {
            cartBox.style.opacity = "1";
            addOrRemoveButton.style.backgroundColor = !isAdded
              ? "#F43E00"
              : "#6c9a36";
            addToCart(item);
            addOrRemoveButton.innerHTML = "x";
          }
          cartAmount.innerHTML = cart.length;
          if (cart.length === 0) {
            cartBox.style.opacity = "0";
          }
          isAdded = !isAdded;
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
