/* global list, store ,bookmark */

const api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/leo';

  const getBookmarks = function(callback) {
    $.getJSON(BASE_URL + '/bookmarks', callback);
  };

  const createBookmark = function(title, url, desc, rating, onSuccess, onError) { 
    const newBookmark = JSON.stringify({ title, url, desc, rating });
    $.ajax({
      url: BASE_URL + '/bookmarks',
      method: 'POST',
      contentType: 'application/json',
      data: newBookmark,
      success: onSuccess,
      error: onError,
    });
  };

  //edit portion
  const updateBookmark = function(id, updateData, callback) {
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updateData),
      success: callback
    });
  };

  const deleteBookmark = function(id, callback) {
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      method: 'DELETE',
      success: callback
    });
  };

  return {
    getBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark,
  };
}());