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
    cartPageTableWrapper.innerHTML += `<h1>There is no item in your cart</h1>`;
  } else {
  }
  const cartTable = document.querySelector(".cart-page-table");
  cart.map(item => {
    const itemRow = createElement("tr", { "data-cart-page-item-id": item.id });
    const itemImage = createElement("img", { class: "cart-page-item-image" });
    const itemMinus = createElement("span", {
      class: "cart-item-amount-minus"
    });
    itemMinus.innerHTML = `<ion-icon name="remove-circle-outline"></ion-icon>`;
    const itemPlus = createElement("span", { class: "cart-item-amount-plus" });
    itemPlus.innerHTML = `<ion-icon name="add-circle-outline"></ion-icon>`;
    const itemTitle = createElement("p", { class: "cart-page-item-title" });
    const itemTitleWrapper = createElement("td", {
      class: "cart-page-item-title-wrapper"
    });
    const itemPrice = createElement("td");
    const itemAmount = createElement("span");
    const itemAmountwrapper = createElement("td");
    appendChildren(itemAmountwrapper, [itemMinus, itemAmount, itemPlus]);
    const itemTotal = createElement("td");
    itemTitle.innerHTML = item.title;
    itemImage.src = item.image;
    itemPrice.innerHTML = `€${item.price}`;
    itemAmount.innerHTML = item.amount;
    itemTotal.innerHTML = `€${item.price * item.amount}`;
    appendChildren(itemTitleWrapper, [itemImage, itemTitle]);
    appendChildren(itemRow, [
      itemTitleWrapper,
      itemPrice,
      itemAmountwrapper,
      itemTotal
    ]);
    handleItemAmount(item, itemMinus, itemPlus, itemAmount);
    cartTable.appendChild(itemRow);
  });
};
