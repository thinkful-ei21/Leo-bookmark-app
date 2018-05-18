/* global store ,bookmark ,api */

const list = (function(){

  function generateError(err) {
    let message = '';
    if (err.responseJSON && err.responseJSON.message) {
      message = err.responseJSON.message;
    } else {
      message = `${err.code} Server Error`;
    }

    return `
      <section class="error-content">
      <div class="error-bar"><button id="cancel-error">X</button></div>
      <p>${message}</p>
      </section>
    `;
  }

  function generateBookmarkElement(bookmark) {
    let currentDescription= bookmark.desc;

    //  edit extension
    if(bookmark.edit){
      currentDescription= `
      <input type="text" name="description entry" class="js-edit-description-entry description" placeholder="Description...">
      `;
    }
    let bookmarkExpanded = '';
    if (bookmark.expanded) {
      bookmarkExpanded = `
      <div class="bookmark-expanded">
       <div class="description-container">
          <p>${currentDescription}</p>
        </div>
        <button name="visit url" class="bookmark-url"><a href="${bookmark.url}" target="_blank">Visit Site</a></button>
      </div>
      `;

    }
    let currentStars = bookmark.rating;
    switch(currentStars){
    case 5:
      currentStars='★★★★★';
      break;
    case 4:
      currentStars='★★★★';
      break;
    case 3:
      currentStars='★★★';
      break;
    case 2:
      currentStars='★★';
      break;
    default: 
      currentStars='★';
      break;
    
    }

      //editing extension/////////////
    if (bookmark.edit){
      currentStars=`
      <select name="stars" class="js-rating-edit-entry add-stars">
      <option value="5">★★★★★</option>
      <option value="4">★★★★</option>
      <option value="3">★★★</option>
      <option value="2">★★</option>
      <option value="1">★</option>      
     </select>
      `;
    }
    let editSummitButton='';
    if(bookmark.edit){
      editSummitButton=`
      <button class="bookmark-checkmark js-bookmark-edit">
      &#10003;
        </button>
      `
    }
  
    return `
      <li class="js-bookmark-element bookmark row" data-bookmark-id="${bookmark.id}">
        <div class="bookmark-toggle js-bookmark-toggle">
          <p class="button-label">${bookmark.title}  ${currentStars} </p>       
          <button name="delete button" class="bookmark-delete js-bookmark-delete">
            &#x1f5d1;
            </button>
        <button class="bookmark-edit js-bookmark-edit">
        &#9998;
        </button>
          ${editSummitButton}
        </div>
        ${bookmarkExpanded}
      </li>`;

      ///

  }
  
  function generateFormElement (){
    return `  
    <div class="add-form">
       <label for="list-entry"></label>
       <input type="text" name="title entry" class="js-title-entry title" placeholder="Title...">
      <select name="stars" class="js-select-entry add-stars">
      <option value="5">★★★★★</option>
      <option value="4">★★★★</option>
      <option value="3">★★★</option>
      <option value="2">★★</option>
      <option value="1">★</option>      
     </select>
       <input type="text" name="description entry" class="js-description-entry description" placeholder="Description...">
      <input type="text"name="URL entry" class="js-url-entry url" placeholder="Website URL...">
      <button type="submit" class="add-submit">Submit</button>
      </div>
    `;
   
  }

  // function generateRatingElement (){

  //   return `

  //     `;
  // }
  //<button class="star js-star" name="star" type="submit" value="5">★★★★★</button><br>
  function generateBookmarksString(list) {
    const bookmarks = list.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
  }
  

  function render() {
    if (store.error) {
      const errorBox = generateError(store.error);
      $('.error-container').html(errorBox);
    } else {
      $('.error-container').empty();
    }
 
    console.log('----------------------------------------------------------------------------rendering');
  
    let bookmarks = store.bookmarks;
    if (store.ratingFilter>0) {
      bookmarks = store.bookmarks.filter(bookmark => bookmark.rating >= store.ratingFilter);
      
    }
    const listbookmarksString = generateBookmarksString(bookmarks);
    $('.js-list').html(listbookmarksString);

    let addFormString='';
    if (!store.addForm) {
      addFormString = generateFormElement();
    }
    $('.js-add-form').html(addFormString); 

    // let ratingFormString='';
    // if (!store.ratingForm) {
    //   ratingFormString = generateRatingElement();
    // }
    // $('.js-rating-form').html(ratingFormString); 
  }
  
  
  function handleNewBookmarkSubmit() {
    $('.js-add-form').submit(function (event) {
      event.preventDefault();
      const newBookmarkTitle = $('.js-title-entry').val();
      console.log(newBookmarkTitle);
      $('.js-title-entry').val('');
      const newbookmarkURL = $('.js-url-entry').val();
      $('.js-url-entry').val('');
      const newbookmarkDescription = $('.js-description-entry').val();
      $('.js-description-entry').val('');
      const newbookmarkRating = $('.js-select-entry').val();
      $('.js-select-entry').val('');
      console.log(newBookmarkTitle);
      api.createBookmark(newBookmarkTitle, 
        newbookmarkURL, 
        newbookmarkDescription,
        newbookmarkRating,
        (newBookmark) => {
          store.addBookmark(newBookmark);
          render();
        },
        (err) => {
          console.log(err);
          store.setError(err);
          render();
        });
      store.toggleAddForm();
    });
  }
  
  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-element')
      .data('bookmark-id');
  }
  
  function handleBookmarkExpandClicked() {
    $('.js-list').on('click', '.js-bookmark-toggle', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = store.findById(id);
      store.findAndUpdate(id, { expanded: !bookmark.expanded });
      render();
    });
  }
  
  function handleDeleteBookmarkClicked() {
    $('.js-list').on('click', '.js-bookmark-delete', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteBookmark(id, () => {
        store.findAndDelete(id);
        render();
      });
    });
  }
  

  function handleToggleAddFormClick() {
    $('.js-add-form-checked').click(() => {
      store.toggleAddForm();
      render();
    });
  }

  // function handleToggleRatingFormClick() {
  //   $('.js-rating-form-checked').click(() => {
  //     store.toggleRatingForm();
  //     console.log('rating is '+ store.ratingForm);
  //     render();
  //   });
  // }
  

  function handleRatingFilter() {
    $('.js-rating-form').on('click',function (){
      const val = $(event.target).val();
      store.ratingFilter = val;
      console.log(val);
      $('#bookmark-rating-applied').html(`${store.ratingFilter}`);
      //store.toggleRatingForm();
      render();
    });
  }

  function handleCloseError() {
    $('.error-container').on('click', '#cancel-error', () => {
      store.setError(null);
      render();
    });
  }

  //////////edit extension////

  function handleBookmarkEditClicked() {
    $('.js-list').on('click', '.js-bookmark-edit', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = store.findById(id);
      store.findAndUpdate(id, { edit: !bookmark.edit });
      render();
    });
  }

  function handleEditBookmarkSubmit() {
    $('.js-list').on('submit', '.js-edit-bookmark', event => {
      event.preventDefault();
      const id = getBookmarkIdFromElement(event.currentTarget);
      const itemRating = $(event.currentTarget).find('.js-rating-edit-entry').val();
      const itemDescription = $(event.currentTarget).find('.js-edit-description-entry').val();      
      api.updateItem(id, { rating:itemRating, desc:itemDescription }, () => {
        store.findAndUpdate(id, { rating:itemRating, desc:itemDescription });
        render();
     store.findAndUpdate(id, { edit: !bookmark.edit });
      });
    });
  }


  function bindEventListeners() {
    handleNewBookmarkSubmit();
    handleBookmarkExpandClicked();
    handleDeleteBookmarkClicked();
    handleToggleAddFormClick();
    handleBookmarkEditClicked();
   handleEditBookmarkSubmit();
    //handleToggleRatingFormClick();    
    handleRatingFilter();
    handleCloseError();
  }


  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());