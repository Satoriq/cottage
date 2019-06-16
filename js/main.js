// fist do it.
// then do it right.
// then do it better.
// Now I'm at the first stage =)


// var openPhotoSwipe = function() {
//   console.log('inited');
//   var pswpElement = document.querySelectorAll('.pswp')[0];

//   // build items array
//   var items = [
//       {
//           src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg',
//           w: 964,
//           h: 1024
//       },
//       {
//           src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg',
//           w: 1024,
//           h: 683
//       }
//   ];

//   // define options (if needed)
//   var options = {
//            // history & focus options are disabled on CodePen
//       history: false,
//       focus: false,

//       showAnimationDuration: 0,
//       hideAnimationDuration: 0

//   };

//   var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
//   gallery.init();
// };

// document.getElementById('imagetest').onclick = openPhotoSwipe;

var initPhotoSwipeFromDOM = function(gallerySelector) {

  // parse slide data (url, title, size ...) from DOM elements
  // (children of gallerySelector)
  var parseThumbnailElements = function(el) {
      var thumbElements = el.childNodes,
          numNodes = thumbElements.length,
          items = [],
          figureEl,
          linkEl,
          size,
          item;

      for(var i = 0; i < numNodes; i++) {

          figureEl = thumbElements[i]; // <figure> element

          // include only element nodes
          if(figureEl.nodeType !== 1) {
              continue;
          }

          linkEl = figureEl.children[0]; // <a> element

          size = linkEl.getAttribute('data-size').split('x');

          // create slide object
          item = {
              src: linkEl.getAttribute('href'),
              w: parseInt(size[0], 10),
              h: parseInt(size[1], 10)
          };



          if(figureEl.children.length > 1) {
              // <figcaption> content
              item.title = figureEl.children[1].innerHTML;
          }

          if(linkEl.children.length > 0) {
              // <img> thumbnail element, retrieving thumbnail url
              item.msrc = linkEl.children[0].getAttribute('src');
          }

          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
      }

      return items;
  };

  // find nearest parent element
  var closest = function closest(el, fn) {
      return el && ( fn(el) ? el : closest(el.parentNode, fn) );
  };

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function(e) {
      e = e || window.event;
      e.preventDefault ? e.preventDefault() : e.returnValue = false;

      var eTarget = e.target || e.srcElement;

      // find root element of slide
      var clickedListItem = closest(eTarget, function(el) {
          return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
      });

      if(!clickedListItem) {
          return;
      }

      // find index of clicked item by looping through all child nodes
      // alternatively, you may define index via data- attribute
      var clickedGallery = clickedListItem.parentNode,
          childNodes = clickedListItem.parentNode.childNodes,
          numChildNodes = childNodes.length,
          nodeIndex = 0,
          index;

      for (var i = 0; i < numChildNodes; i++) {
          if(childNodes[i].nodeType !== 1) {
              continue;
          }

          if(childNodes[i] === clickedListItem) {
              index = nodeIndex;
              break;
          }
          nodeIndex++;
      }



      if(index >= 0) {
          // open PhotoSwipe if valid index found
          openPhotoSwipe( index, clickedGallery );
      }
      return false;
  };

  // parse picture index and gallery index from URL (#&pid=1&gid=2)
  var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1),
      params = {};

      if(hash.length < 5) {
          return params;
      }

      var vars = hash.split('&');
      for (var i = 0; i < vars.length; i++) {
          if(!vars[i]) {
              continue;
          }
          var pair = vars[i].split('=');
          if(pair.length < 2) {
              continue;
          }
          params[pair[0]] = pair[1];
      }

      if(params.gid) {
          params.gid = parseInt(params.gid, 10);
      }

      return params;
  };

  var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
      var pswpElement = document.querySelectorAll('.pswp')[0],
          gallery,
          options,
          items;

      items = parseThumbnailElements(galleryElement);

      // define options (if needed)
      options = {

          // define gallery index (for URL)
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),

          getThumbBoundsFn: function(index) {
              // See Options -> getThumbBoundsFn section of documentation for more info
              var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                  pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                  rect = thumbnail.getBoundingClientRect();

              return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
          }

      };

      // PhotoSwipe opened from URL
      if(fromURL) {
          if(options.galleryPIDs) {
              // parse real index when custom PIDs are used
              // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
              for(var j = 0; j < items.length; j++) {
                  if(items[j].pid == index) {
                      options.index = j;
                      break;
                  }
              }
          } else {
              // in URL indexes start from 1
              options.index = parseInt(index, 10) - 1;
          }
      } else {
          options.index = parseInt(index, 10);
      }

      // exit if index not found
      if( isNaN(options.index) ) {
          return;
      }

      if(disableAnimation) {
          options.showAnimationDuration = 0;
      }

      // Pass data to PhotoSwipe and initialize it
      gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
  };

  // loop through all gallery elements and bind events
  var galleryElements = document.querySelectorAll( gallerySelector );

  for(var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute('data-pswp-uid', i+1);
      galleryElements[i].onclick = onThumbnailsClick;
  }

  // Parse URL and open gallery if it contains #&pid=3&gid=1
  var hashData = photoswipeParseHash();
  if(hashData.pid && hashData.gid) {
      openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
  }
};

// execute above function
initPhotoSwipeFromDOM('.my-gallery');
// Initialize Blazy
(function() {
  let bLazy = new Blazy();
})();

// Share button
document.getElementById('js-share__wrapper').onclick = function() {
  if (document.getElementById('js-share').className === 'share share--active') {
    document.getElementById('js-share').className = 'share';
  } else {
    document.getElementById('js-share').className += ' share--active';
  }
};

//
// ────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S E A R C H I N G   B Y   I N P U T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────
//
// small note, style.display = 'block' is the best choice for performance

document.getElementById('js-search').oninput = function() {
  let matcher = new RegExp(document.getElementById('js-search').value, 'i'); //  i = case-insensitive
  if (document.getElementById('js-allowed').className === 'allowed allowed--checked') {
    for (let i = 0; i < fodmapList.length; i++) {
      if ((matcher.test(fodmapList[i].name)) && (fodmapList[i].fodmap === 'low')) {
        document.getElementsByClassName('food')[i].style.display = 'block';
      } else {
        document.getElementsByClassName('food')[i].style.display = 'none';
      }
    }
  } else if (document.getElementById('js-high').className === 'banned banned--checked') {
    for (let i = 0; i < fodmapList.length; i++) {
      if ((matcher.test(fodmapList[i].name)) && (fodmapList[i].fodmap === 'high')) {
        document.getElementsByClassName('food')[i].style.display = 'block';
      } else {
        document.getElementsByClassName('food')[i].style.display = 'none';
      }
    }
  } else {
    for (let i = 0; i < fodmapList.length; i++) {
      if (matcher.test(fodmapList[i].name)) {
        document.getElementsByClassName('food')[i].style.display = 'block';
      } else {
        document.getElementsByClassName('food')[i].style.display = 'none';
      }
    }
  }
  for (let i = 0; i < document.getElementsByClassName('categories__content-item').length; i++) {
    document.getElementsByClassName('categories__content-item')[i].style.color = '#8190a5';
  }
  if (document.getElementById('js-search').value.length >= 1) {
    document.getElementsByClassName('categories__name')[0].innerHTML = 'Categories';
  }
  if (content.className === 'categories__content categories__content--show') {
    content.className = 'categories__content';
    categories.className = 'categories';
  }

  //download pictures (initialize bLazy)
  (function() {
    let bLazy = new Blazy();
  })();
};

function inputWithOnlyButtons() {
  let matcher = new RegExp(document.getElementById('js-search').value, 'i');
  for (let i = 0; i < fodmapList.length; i++) {
    if (matcher.test(fodmapList[i].name)) {
      document.getElementsByClassName('food')[i].style.display = 'block';
    } else {
      document.getElementsByClassName('food')[i].style.display = 'none';
    }
  }
}

//
// ────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: F I L T E R I N G   B Y   C A T E G O R Y : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────
//

// Show categories (for mobile)
var content = document.getElementById('js-categories__content');
var categories = document.getElementById('js-categories');

document.getElementById("js-categories").addEventListener("click", function( e ){
  e = window.event || e;
  if(this === e.target) {
    if (content.className === 'categories__content') {
      content.className += ' categories__content--show';
      categories.className += ' categories--clicked';
    } else {
      content.className = 'categories__content';
      categories.className = 'categories';
    }
  }
});

document.getElementById("js-categories__name").addEventListener("click", function( e ){
  e = window.event || e;
  if(this === e.target) {
    if (content.className === 'categories__content') {
      content.className += ' categories__content--show';
      categories.className += ' categories--clicked';
    } else {
      content.className = 'categories__content';
      categories.className = 'categories';
    }
  }
});


/*=============================================
=            FILTERING BUTTONS               =
=============================================*/

function filtering(categoryName, contentOrder){
  document.getElementById('js-search').value = '';

  for (let i = 0; i < fodmapList.length; i++) {
    //if allowed button checked, search only allowed products from clicked category
    if (document.getElementById('js-allowed').className === 'allowed allowed--checked') {
      if ((fodmapList[i].category === categoryName) && (fodmapList[i].fodmap === 'low')) {
        document.getElementsByClassName('food')[i].style.display = 'block';
      } else {
        document.getElementsByClassName('food')[i].style.display = 'none';
      }

    //if banned button checked, search only banned products from clicked category
    } else if (document.getElementById('js-high').className === 'banned banned--checked') {
      if ((fodmapList[i].category === categoryName) && (fodmapList[i].fodmap === 'high')) {
        document.getElementsByClassName('food')[i].style.display = 'block';
      } else {
        document.getElementsByClassName('food')[i].style.display = 'none';
      }

    } else {
      if (fodmapList[i].category === categoryName) {
        document.getElementsByClassName('food')[i].style.display = 'block';
      } else {
        document.getElementsByClassName('food')[i].style.display = 'none';
      }
    }
  }

  //hide categories (for mobiles)
  if (content.className === 'categories__content categories__content--show') {
    content.className = 'categories__content';
    categories.className = 'categories';
  }

  //hide categories (for pc)
  document.getElementById('js-categories__content').style.display = 'none';
  setTimeout(function() {
    document.getElementById('js-categories__content').style.display = '';
  }, 350);

  //change colors of all categories to "unpicked"
  for (let a = 0; a < document.getElementsByClassName('categories__content-item').length; a++) {
    document.getElementsByClassName('categories__content-item')[a].style.color = '#8190a5';
  }
  //change color of clicked category to "picked"
  document.getElementsByClassName('categories__content-item')[contentOrder].style.color = '#2B2D42';
  document.getElementsByClassName('categories__name')[0].innerHTML = categoryName;

  //download pictures (initialize bLazy)
  (function() {
    let bLazy = new Blazy();
  })();
  }

//All categories
function everything() {
  document.getElementById('js-search').value = '';
  //if allowed button checked, search only allowed products from clicked category
  for (let i = 0; i < fodmapList.length; i++) {
    if (document.getElementById('js-allowed').className === 'allowed allowed--checked') {
      if (fodmapList[i].fodmap === 'low') {
        document.getElementsByClassName('food')[i].style.display = 'block';
      } else {
        document.getElementsByClassName('food')[i].style.display = 'none';
      }

    //if banned button checked, search only banned products from clicked category
    } else if (document.getElementById('js-high').className === 'banned banned--checked') {
      if (fodmapList[i].fodmap === 'high') {
        document.getElementsByClassName('food')[i].style.display = 'block';
      } else {
        document.getElementsByClassName('food')[i].style.display = 'none';
      }

    } else {
      document.getElementsByClassName('food')[i].style.display = 'block';
    }
  }

  //hide categories (for mobiles)
  if (content.className === 'categories__content categories__content--show') {
    content.className = 'categories__content';
    categories.className = 'categories';
  }

  //hide categories (for pc)
  document.getElementsByClassName('categories__content')[0].style.display = 'none';
  setTimeout(function() {
    document.getElementsByClassName('categories__content')[0].style.display = '';
  }, 450);

  //change colors of all categories to "unpicked"
  for (let a = 0; a < document.getElementsByClassName('categories__content-item').length; a++) {
    document.getElementsByClassName('categories__content-item')[a].style.color = '#8190a5';
  }
  //change color of clicked category to "picked"
  document.getElementsByClassName('categories__content-item')[0].style.color = '#2B2D42';
  document.getElementsByClassName('categories__name')[0].innerHTML = 'All';

  //download pictures (initialize bLazy)
  (function() {
    let bLazy = new Blazy();
  })();
}

//Sort by low and high
function findLow() {  //had issues with switch
  for (var i = 0; i < fodmapList.length; i++) {
    if ((fodmapList[i].fodmap === 'low') && (document.getElementsByClassName('food')[i].style.display === 'block')) {
      document.getElementsByClassName('food')[i].style.display = 'block';
    } else {
      document.getElementsByClassName('food')[i].style.display = 'none';
    }
  }
  if (document.getElementById('js-allowed').className === 'allowed allowed--checked') {
    document.getElementById('js-allowed').className = 'allowed';
    if (document.getElementById('js-search').value.length >= 1) {
      inputWithOnlyButtons();
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Categories') {
      everything();
      document.getElementsByClassName('categories__name')[0].innerHTML = 'Categories';
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Breads, Cereals, Grains and Pasta') {
      filtering('Breads, Cereals, Grains and Pasta', 1);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Vegetables and legumes') {
      filtering('Vegetables and legumes', 2);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Fruit') {
      filtering('Fruit', 3);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Drinks') {
      filtering('Drinks', 4);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Meat and Substitutes') {
      filtering('Meat and Substitutes', 5);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Condiments') {
      filtering('Condiments', 6);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Milk') {
      filtering('Milk', 7);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Sweeteners') {
      filtering('Sweeteners', 8);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Dairy') {
      filtering('Dairy', 9);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Cheese') {
      filtering('Cheese', 10);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Nuts and Seeds') {
      filtering('Nuts and Seeds', 11);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'All') {
      everything();
    } else if ((document.getElementsByClassName('food').style.display === 'block') && (fodmapList[i].fodmap === 'low')) {
      document.getElementsByClassName('food').style.display = 'block';
    }
  } else {
    document.getElementById('js-allowed').className += ' allowed--checked';
  }

  //download pictures (initialize bLazy)
  (function() {
    let bLazy = new Blazy();
  })();
}

function findHigh() { //had issues with switch
  for (var i = 0; i < fodmapList.length; i++) {
    if ((fodmapList[i].fodmap === 'high') && (document.getElementsByClassName('food')[i].style.display === 'block')) {
      document.getElementsByClassName('food')[i].style.display = 'block';
    } else {
      document.getElementsByClassName('food')[i].style.display = 'none';
    }
  }
  if (document.getElementById('js-high').className === 'banned banned--checked') {
    document.getElementById('js-high').className = 'banned';
    if (document.getElementById('js-search').value.length >= 1) {
      inputWithOnlyButtons();
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Categories') {
      everything();
      document.getElementsByClassName('categories__name')[0].innerHTML = 'Categories';
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Breads, Cereals, Grains and Pasta') {
      filtering('Breads, Cereals, Grains and Pasta', 1);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Vegetables and legumes') {
      filtering('Vegetables and legumes', 2);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Fruit') {
      filtering('Fruit', 3);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Drinks') {
      filtering('Drinks', 4);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Meat and Substitutes') {
      filtering('Meat and Substitutes', 5);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Condiments') {
      filtering('Condiments', 6);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Milk') {
      filtering('Milk', 7);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Sweeteners') {
      filtering('Sweeteners', 8);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Dairy') {
      filtering('Dairy', 9);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Cheese') {
      filtering('Cheese', 10);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'Nuts and Seeds') {
      filtering('Nuts and Seeds', 11);
    } else if (document.getElementsByClassName('categories__name')[0].innerHTML === 'All') {
      everything();
    } else if ((document.getElementsByClassName('food').style.display === 'block') && (fodmapList[i].fodmap === 'high')) {
      document.getElementsByClassName('food').style.display = 'block';
    }
  } else {
    document.getElementById('js-high').className += ' banned--checked';
  }

  //download pictures (initialize bLazy)
  (function() {
    let bLazy = new Blazy();
  })();
}

// Switch banned/allowed
document.getElementById('js-allowed').onclick = function() {
  if (document.getElementById('js-high').className === 'banned banned--checked') {
    document.getElementById('js-high').click();
    findLow();
  } else {
    findLow();
  }
};

document.getElementById('js-high').onclick = function() {
  if (document.getElementById('js-allowed').className === 'allowed allowed--checked') {
    document.getElementById('js-allowed').click();
    findHigh();
  } else {
    findHigh();
  }
};
