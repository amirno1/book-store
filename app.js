const mainWrapper = document.querySelector(".main-wrapper");
const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-button");
const result = document.querySelector(".result");

let searchWord = "";

//do i need to do this with async await
async function renderBooks(bookName) {
  await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${bookName}+intitle`
  )
    .then(res =>
      res.json().then(data =>
        data.items.map((item, index) => {
          if (item) {
            console.log(item.volumeInfo);
            const card = document.createElement("div");
            const image = document.createElement("img");
            const title = document.createElement("div");
            card.className = `card ${index}`;
            let bookTitle = item.volumeInfo.title;
            title.innerHTML =
              bookTitle.length >= 100
                ? bookTitle.slice(0, 99) + "..."
                : bookTitle;
            title.className = `title`;
            item.volumeInfo.imageLinks
              ? (image.src = `${item.volumeInfo.imageLinks.thumbnail}`)
              : (image.src = `https://www.ottofrei.com/sc-app/extensions/VintenCloud/OttoFreiSuiteCommerceTheme/18.2.0/img/no_image_available.jpeg`);
            image.className = "book-image";
            card.appendChild(title);
            card.appendChild(image);
            result.appendChild(card);
          } else {
            result.innerHTML =
              "Unfortunately Server is not ready, Please refresh the page and try again";
          }
        })
      )
    )
    .catch(err => console.log(err));
}
searchBar.addEventListener("keyup", () => {
  searchWord = searchBar.value;
});
searchBar.addEventListener("keypress", e => {
  e.key === "Enter" ? ((result.innerHTML = ""), renderBooks(searchWord)) : null;
});

searchButton.addEventListener("click", () => {
  result.innerHTML = "";
  renderBooks(searchWord);
});

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
