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
  const cartItems = cart.map(item => {
    return `
    <tr>
      <td>${item.title}</td>
      <td>€25</td>
      <td>${item.amount}</td>
      <td>$€25</td>
    </tr>`;
  });
  mainWrapper.innerHTML = cartTemplate;
  const cartTable = document.querySelector(".cart-page-table");
  cartTable.innerHTML += cartItems;
};
