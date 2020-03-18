window.onpopstate = () => {
  if (window.location.pathname === "/book") {
    renderBook(window.location.search.slice(4));
  } else if (window.location.pathname === "/") {
    renderHome();
    renderBooks(searchWord);
  }
};
