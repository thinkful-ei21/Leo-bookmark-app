/* global list ,bookmark ,api */

const store = (function(){

  const setError = function(error) {
    this.error = error;
  };

  const addBookmark = function(bookmark) {
    this.bookmarks.push(bookmark);
  };

  const findById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const findAndUpdate = function(id, newData) {
    const bookmark = this.findById(id);
    Object.assign(bookmark, newData);
  };

  const toggleAddForm = function() {
    this.addForm = !this.addForm;
  };

  const toggleEditForm = function() {
    this.addForm = !this.addForm;
  };
  // const toggleRatingForm = function() {
  //   this.ratingForm = !this.ratingForm;
  // };

  const setRatingFilter = function(rating) {
    this.ratingFilter = rating;
  };

  return {
    bookmarks: [
      //{ id:4, title:'test',url:'https://dashboard.thinkful.com/', description:'test', rating:4}
    ],
    error: null,
    addForm: true,
    ratingFilter: 0,
    // ratingForm: true,

    addBookmark,
    setError,
    findById,
    findAndDelete,
    findAndUpdate,
    toggleAddForm,
    toggleEditForm,
    // toggleRatingForm,
    setRatingFilter,
  };
  
}());