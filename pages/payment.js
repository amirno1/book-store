const renderPayment = () => {
  mainWrapper.innerHTML =
    '<div class="payment-page__response"><h1>Checkout and payment</h1></div>';
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
        handlePaymentSuccess();
      })
      .catch(() => {
        handlePaymentDenied();
      });
  } else {
  }

  const handlePaymentDenied = () => {
    mainWrapper.innerHTML = `
      <div class="payment-page__response payment-page__denied">
      <h1>Payment denied <i class="fas fa-ban"></i></h1>
      <h4>You are being redirected to your cart...</h4>
      <div class="loader"></div>
      </div>
      `;
    setTimeout(() => {
      window.history.pushState({}, null, "/cart");
      renderCart();
    }, 2000);
  };
  const handlePaymentSuccess = () => {
    mainWrapper.innerHTML = `
      <div class="payment-page__response payment-page__successful">
      <h1>Payment Successful <i class="fas fa-check-circle"></i></h1>
      <h4>You are being redirected to the homepage...</h3>
      <div class="loader"></div>
      </div>
      `;
    setTimeout(() => {
      window.history.pushState({}, null, "/");
      cart = [];
      searchWord = "";
      cartAmount = document.querySelector(".nav-bar__cart-amount").innerHTML =
        cart.length;
      renderHome();
    }, 2000);
  };
};
