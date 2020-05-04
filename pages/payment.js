const renderPayment = () => {
  mainWrapper.innerHTML = "<h1>Checkout and payment</h1>";
  paymentHandler();
};
const paymentHandler = () => {
  const mainWrapper = document.querySelector(".main-wrapper");
  let totalPrice = 0;
  cart.forEach(item => {
    totalPrice += item.price * item.amount;
  });
  if (window.PaymentRequest) {
    const supportedPaymentMethods = [
      {
        supportedMethods: ["basic-card"],
        data: {
          supportedNetworks: [
            "visa",
            "mastercard",
            "amex",
            "discover",
            "diners",
            "jcb",
            "unionpay"
          ]
        }
      }
    ];

    const handleDisplayItems = () => {
      const itemsToDisplay = cart.map(item => {
        return {
          label: item.title,
          amount: { currency: "EUR", value: item.price }
        };
      });
      return itemsToDisplay;
    };
    handleDisplayItems();
    const paymentDetails = {
      displayItems: handleDisplayItems(),
      total: {
        label: "Total Cost",
        amount: {
          currency: "EUR",
          value: `${totalPrice}`
        }
      }
    };
    const options = {};

    const paymentRequest = new PaymentRequest(
      supportedPaymentMethods,
      paymentDetails,
      options
    );

    paymentRequest
      .show()
      .then(paymentResponse => {
        paymentResponse.complete("success");
      })
      .then(() => {
        mainWrapper.innerHTML = `
        <div class="payment-response payment-successful">
        <h1>Payment Successful <i class="fas fa-check-circle"></i></h1>
        <h3>You are being redirected to the homepage...</h3>
        <div class="loader"></div>
        </div>
        `;
        setTimeout(() => {
          window.history.pushState({}, null, "/");
          cart = [];
          searchWord = "";
          cartAmount = document.querySelector(".cart-amount").innerHTML =
            cart.length;
          renderHome();
        }, 3000);
      })
      .catch(() => {
        mainWrapper.innerHTML = `
        <div class="payment-response payment-denied">
        <h1>Payment denied <i class="fas fa-ban"></i></h1>
        <h3>You are being redirected to your cart...</h3>
        <div class="loader"></div>
        </div>
        `;
        setTimeout(() => {
          window.history.pushState({}, null, "/cart");
          renderCart();
        }, 2000);
      });
  } else {
  }
};
