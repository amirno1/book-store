const mainWrapper = document.querySelector(".main-wrapper");
const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-button");
const result = document.querySelector(".result");
const warning = document.querySelector(".warning");

let searchWord = "";

//do i need to do this with async await
async function renderBooks(bookName) {
  if (searchWord) {
    await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookName}`)
      .then(res =>
        res.json().then(data =>
          data.items.map((item, index) => {
            if (item) {
              console.log(item.volumeInfo);
              const card = document.createElement("div");
              const image = document.createElement("img");
              const bookInfo = document.createElement("div");
              const title = document.createElement("p");
              card.className = `card ${index}`;
              let bookTitle = item.volumeInfo.title;
              title.innerHTML =
                bookTitle.length >= 25
                  ? bookTitle.slice(0, 25) + "..."
                  : bookTitle;
              bookInfo.className = `book-info`;
              item.volumeInfo.imageLinks
                ? (image.src = `${item.volumeInfo.imageLinks.thumbnail}`)
                : (image.src = `https://www.ottofrei.com/sc-app/extensions/VintenCloud/OttoFreiSuiteCommerceTheme/18.2.0/img/no_image_available.jpeg`);
              image.className = "book-image";
              bookInfo.appendChild(title);
              card.appendChild(image);
              card.appendChild(bookInfo);
              result.appendChild(card);
            } else {
              result.innerHTML =
                "Unfortunately Server is not ready, Please refresh the page and try again";
            }
          })
        )
      )
      .catch(err => console.log(err));
  } else {
    checkForWarning();
  }
}
searchBar.addEventListener("keyup", () => {
  searchWord = searchBar.value;
  checkForWarning();
});
searchBar.addEventListener("click", () => {
  searchBar.style.border = "";
  searchBar.value = "";
  searchWord = "";
});
searchBar.addEventListener("keypress", e => {
  e.key === "Enter" ? ((result.innerHTML = ""), renderBooks(searchWord)) : null;
});

searchButton.addEventListener("click", () => {
  result.innerHTML = "";
  renderBooks(searchWord);
});

const checkForWarning = () => {
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

// const contetnDiv = document.querySelector(".content");
// contetnDiv.innerHTML = routes[window.location.pathname];

// let homePage = `
//   <div class="search-wrapper">
//     <h1 class="search-header">Enter a book name to search</h1>
//     <input
//       class="search-bar"
//       type="text"
//       name="search-bar"
//       id="search-bar"
//     />
//     <button class="search-button">Search</button>
//   </div>
//   <div class="result"></div>
// `;

// const routes = {
//   "/": "homePage",
//   "/book": "bookPage"
// };
