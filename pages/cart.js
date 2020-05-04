const cartTemplate = `
<h1 class="cart-page-header">Cart</h1>
<div class="cart-table-wrapper">
  <table class="cart-page-table">
    <tr class="cart-page-head-row">
      <th class="cart-page-header-row">Book Name</th>
      <th class="cart-page-header-row">Price</th>
      <th class="cart-page-header-row">Quantity</th>
      <th class="cart-page-header-row">Total</th>
    </tr>
  </table>
</div>`;

const renderCart = () => {
  mainWrapper.innerHTML = cartTemplate;
  if (!cart.length) {
    const cartPageTableWrapper = document.querySelector(".cart-table-wrapper");
    cartPageTableWrapper.innerHTML += `<h1 class="cart-page-no-item">There is no item in your cart</h1>`;
  } else {
  }
  const cartTable = document.querySelector(".cart-page-table");
  cart.map(item => {
    const itemRow = createElement("tr", {
      class: "cart-page-table-row",
      "data-cart-page-item-id": item.id
    });
    const itemImage = createElement("img", { class: "cart-page-item-image" });
    itemImage.addEventListener("click", () => {
      navigateToBookPage(item.id);
    });
    const itemMinus = createElement("span", {
      class: "cart-item-amount-minus"
    });
    itemMinus.innerHTML = `<ion-icon name="remove-circle-outline"></ion-icon>`;
    const itemPlus = createElement("span", { class: "cart-item-amount-plus" });
    itemPlus.innerHTML = `<ion-icon name="add-circle-outline"></ion-icon>`;
    const itemTitle = createElement("p", { class: "cart-page-item-title" });
    itemTitle.addEventListener("click", () => {
      navigateToBookPage(item.id);
    });
    const itemTitleWrapper = createElement("td", {
      class: "cart-page-item-title-wrapper"
    });
    const itemPrice = createElement("td");
    const itemAmount = createElement("span");
    const itemAmountwrapper = createElement("td");
    appendChildren(itemAmountwrapper, [itemMinus, itemAmount, itemPlus]);
    const itemTotal = createElement("td", { class: "cart-page-item-total" });
    itemTitle.innerHTML = item.title;
    itemImage.src = item.image;
    itemPrice.innerHTML = `€ ${item.price}`;
    itemAmount.innerHTML = item.amount;
    itemTotal.innerHTML = `€ ${(item.price * item.amount).toFixed(2)}`;
    appendChildren(itemTitleWrapper, [itemImage, itemTitle]);
    appendChildren(itemRow, [
      itemTitleWrapper,
      itemPrice,
      itemAmountwrapper,
      itemTotal
    ]);
    handleItemAmount(item, itemMinus, itemPlus, itemAmount);
    cartPageUpdateItemTotal(item, itemMinus, itemTotal);
    cartPageUpdateItemTotal(item, itemPlus, itemTotal);
    cartTable.appendChild(itemRow);
  });
  const priceAndPayment = createElement("div", { class: "price-and-payment" });
  const totalCartPricewrapper = createElement("div", {
    class: "total-cart-price-wrapper"
  });
  const totalCartPriceText = createElement("span", {
    class: "total-cart-price-text"
  });
  totalCartPriceText.innerHTML = "Total € ";
  const totalCartPrice = createElement("span", {
    class: "total-cart-price"
  });
  let totalItemsPrice = 0;
  cart.forEach(item => {
    totalItemsPrice += item.amount * item.price;
  });
  totalCartPrice.innerHTML =
    totalItemsPrice % 1 !== 0 ? totalItemsPrice.toFixed(2) : totalItemsPrice;
  appendChildren(totalCartPricewrapper, [totalCartPriceText, totalCartPrice]);
  const goToPayment = createElement("div", {
    class: "cart-page-go-to-payment"
  });
  goToPayment.innerHTML = `Go To Payment <ion-icon name="chevron-forward-outline"></ion-icon>`;
  goToPayment.addEventListener("click", () => {
    window.history.pushState({}, null, "/payment");
    renderPayment(totalItemsPrice);
  });
  appendChildren(priceAndPayment, [totalCartPricewrapper, goToPayment]);
  mainWrapper.appendChild(priceAndPayment);
};

const totalItemsHandler = () => {
  const totalCartPriceElement = document.querySelector(".total-cart-price");
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
