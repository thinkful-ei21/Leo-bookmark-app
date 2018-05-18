/* global list, store ,bookmark ,api */

$(document).ready(function() {
  list.bindEventListeners();
  list.render();
  api.getBookmarks((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
    list.render();
  });
});