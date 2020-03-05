const mainWrapper = document.querySelector(".main-wrapper");
const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-button");
const result = document.querySelector(".result");

let searchWord = "";

//do i need to do this with async await
async function renderBooks(bookName) {
  await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookName}`)
    .then(res =>
      res.json().then(data =>
        data.items.map((item, index) => {
          const card = document.createElement("div");
          const title = document.createElement("div");
          card.className = `card ${index}`;
          title.innerHTML = item.volumeInfo.title;
          title.className = `title`;
          card.appendChild(title);
          result.appendChild(card);
        })
      )
    )
    .catch(err => console.log(err));
}
searchBar.addEventListener("keyup", () => {
  searchWord = searchBar.value;
});

searchButton.addEventListener("click", () => {
  renderBooks(searchWord);
});
