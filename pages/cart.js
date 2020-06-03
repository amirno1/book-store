const cartTemplate = `
<div class="cart-page__payment-modal">
  <div class="cart-page__payment-modal-content">
    <h2>There are no items in the shopping cart!!</h2>
    <div class="cart-page__payment-modal-button-wrapper">
      <button class="cart-page__modal-button cart-page__continue-shopping-button">
        Continue shopping
      </button>
      <button class="cart-page__modal-button cart-page__close-payment-modal">Cancel</button>
    </div>
  </div>
</div>
<div class="cart-page__table-wrapper">
  <table class="cart-page__table">
    <tr class="cart-page__head-row">
      <th class="cart-page__header-row">Book Name</th>
      <th class="cart-page__header-row">Price</th>
      <th class="cart-page__header-row">Quantity</th>
      <th class="cart-page__header-row">Total</th>
      <th class="cart-page__header-row">Remove</th>
    </tr>
  </table>
</div>`;

const renderCart = () => {
  mainWrapper.innerHTML = cartTemplate;

  const paymentModal = document.querySelector(".cart-page__payment-modal");
  const continueShoppingButton = document.querySelector(
    ".cart-page__continue-shopping-button"
  );
  const closeModal = document.querySelector(".cart-page__close-payment-modal");

  continueShoppingButton.addEventListener("click", () => {
    window.history.pushState({}, null, "/");
    renderHome();
  });

  closeModal.addEventListener("click", () => {
    paymentModal.style.display = "none";
  });

  if (!cart.length) {
    const cartPageTableWrapper = document.querySelector(
      ".cart-page__table-wrapper"
    );
    cartPageTableWrapper.innerHTML += `<h1 class="cart-page__no-item">There are no items in your shopping cart</h1>`;
  } else {
  }
  const cartTable = document.querySelector(".cart-page__table");

  cart.map(item => {
    const itemRow = createElement("tr", {
      class: "cart-page__table-row",
      "data-cart-page__item-id": item.id
    });

    const itemImage = createElement("img", { class: "cart-page__item-image" });

    itemImage.addEventListener("click", () => {
      navigateToBookPage(item.id);
    });

    const itemMinus = createElement("span", {
      class: "cart-page__item-amount-minus"
    });

    itemMinus.innerHTML = `<ion-icon name="remove-circle-outline"></ion-icon>`;
    const itemPlus = createElement("span", {
      class: "cart-page__item-amount-plus"
    });

    itemPlus.innerHTML = `<ion-icon name="add-circle-outline"></ion-icon>`;
    const itemTitle = createElement("p", { class: "cart-page__item-title" });

    itemTitle.addEventListener("click", () => {
      navigateToBookPage(item.id);
    });

    const itemTitleWrapper = createElement("td", {
      class: "cart-page__item-title-wrapper"
    });

    const itemPrice = createElement("td");
    const itemAmount = createElement("span");
    const itemAmountwrapper = createElement("td");

    appendChildren(itemAmountwrapper, [itemMinus, itemAmount, itemPlus]);
    const itemTotal = createElement("td", { class: "cart-page__item-total" });

    itemTitle.innerHTML = item.title;
    itemImage.src = item.image;
    itemPrice.innerHTML = `€ ${item.price}`;
    itemAmount.innerHTML = item.amount;
    itemTotal.innerHTML = `€ ${(item.price * item.amount).toFixed(2)}`;

    const itemRemove = createElement("td");
    const itemRemoveButton = createElement("button", {
      class: "cart-page__item-remove"
    });

    itemRemoveButton.innerHTML = "Remove";
    itemRemoveButton.addEventListener("click", () => {
      removeFromCart(item);
      totalItemsHandler();
      cartAmount = document.querySelector(".nav-bar__cart-amount").innerHTML =
        cart.length;
    });

    itemRemove.appendChild(itemRemoveButton);
    appendChildren(itemTitleWrapper, [itemImage, itemTitle]);
    appendChildren(itemRow, [
      itemTitleWrapper,
      itemPrice,
      itemAmountwrapper,
      itemTotal,
      itemRemove
    ]);

    handleItemAmount(item, itemMinus, itemPlus, itemAmount);

    cartPageUpdateItemTotal(item, itemMinus, itemTotal);
    cartPageUpdateItemTotal(item, itemPlus, itemTotal);

    cartTable.appendChild(itemRow);
  });
  const priceAndPayment = createElement("div", {
    class: "cart-page__price-and-payment"
  });
  const totalCartPricewrapper = createElement("div", {
    class: "cart-page__total-cart-price-wrapper"
  });
  const totalCartPriceText = createElement("span", {
    class: "cart-page__total-cart-price-text"
  });
  totalCartPriceText.innerHTML = "Total € ";
  const totalCartPrice = createElement("span", {
    class: "cart-page__total-cart-price"
  });

  let totalItemsPrice = 0;
  cart.forEach(item => {
    totalItemsPrice += item.amount * item.price;
  });

  totalCartPrice.innerHTML =
    totalItemsPrice % 1 !== 0 ? totalItemsPrice.toFixed(2) : totalItemsPrice;
  appendChildren(totalCartPricewrapper, [totalCartPriceText, totalCartPrice]);
  const goToPayment = createElement("div", {
    class: "cart-page__go-to-payment"
  });

  goToPayment.innerHTML = `Go To Payment <ion-icon name="chevron-forward-outline"></ion-icon>`;

  goToPayment.addEventListener("click", () => {
    if (cart.length === 0) {
      paymentModal.style.display = "block";
    } else {
      window.history.pushState({}, null, "/payment");
      renderPayment(totalItemsPrice);
    }
  });

  appendChildren(priceAndPayment, [totalCartPricewrapper, goToPayment]);
  mainWrapper.appendChild(priceAndPayment);
};

const totalItemsHandler = () => {
  const totalCartPriceElement = document.querySelector(
    ".cart-page__total-cart-price"
  );
  let totalCartPrice = 0;
  cart.forEach(item => {
    totalCartPrice += item.amount * item.price;
  });
  totalCartPriceElement.innerHTML =
    totalCartPrice % 1 !== 0 ? totalCartPrice.toFixed(2) : totalCartPrice;
};

const cartPageUpdateItemTotal = (item, itemAmountElement, itemTotal) => {
  itemAmountElement.addEventListener("click", () => {
    itemTotal.innerHTML = `€ ${(item.price * item.amount).toFixed(2)}`;
    totalItemsHandler();
  });
};
