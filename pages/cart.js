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
  const cartTable = document.querySelector(".cart-page-table");
  cart.map(item => {
    const itemRow = createElement("tr");
    const itemTitle = createElement("td");
    const itemPrice = createElement("td");
    const itemAmount = createElement("td");
    const itemTotal = createElement("td");

    itemTitle.innerHTML = item.title;
    itemPrice.innerHTML = `€${item.price}`;
    itemAmount.innerHTML = item.amount;
    itemTotal.innerHTML = `€${item.price * item.amount}`;
    appendChildren(itemRow, [itemTitle, itemPrice, itemAmount, itemTotal]);
    cartTable.appendChild(itemRow);
  });
};
