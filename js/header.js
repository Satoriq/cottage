//Burger menu
function openBurger() {
  let a = document.getElementById('hamburger');
  if (a.className === 'hamburger') {
    a.className += ' hamburger--active';
  }
  else {
    a.className = 'hamburger';
  }
  let x = document.getElementById('navbar');
  if (x.className === 'nav__bar') {
      x.className += ' nav__bar--open';
  }
  else {
      x.className = 'nav__bar';
  }

  let y = document.getElementById('js-header');
  if (y.className === 'nav__logo') {
      y.className += ' nav__logo--hide';
  }
  else {
      y.className = 'nav__logo';
  }

  let z = document.getElementById('js-nav__info');
  if (z.className === 'nav__info') {
      z.className += ' nav__info--show';
  }
  else {
      z.className = 'nav__info';
  }
}

//Detecting wheel direction, based on https://deepmikoto.com/coding/1--javascript-detect-mouse-wheel-direction
function detectWheelDirection(e) {
  let delta = null,
    direction = false;
  if (!e) { // if the event is not provided, we get it from the window object
    e = window.event;
  }
  if (e.wheelDelta) {
    delta = e.wheelDelta / 60;
  } else if (e.detail) { // fallback for Firefox
    delta = -e.detail / 2;
  }
  if (delta !== null) {
    direction = delta > 0 ? 'up' : 'down';
  }
  return direction;
}

//Nav bar show/hide
function hideNavbar(direction) {// wheel direction down we will hide navbar, but only if Y position > 150px
  if (direction == 'down' && (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150)) {
    document.getElementById('navbar').style.top = '-70px';
  } else if (direction == 'up') { // show navbar if wheel up
    document.getElementById('navbar').style.top = '0';
  }
}
document.onmousewheel = function (e) { // Integrate direction logic with listeners
  hideNavbar(detectWheelDirection(e));
};
if (window.addEventListener) { // Integrate direction logic with listeners for firefox
  document.addEventListener('DOMMouseScroll', function (e) {
    hideNavbar(detectWheelDirection(e));
  }, {passive: true});
}

// If user at the bottom and click on logo, scroll top, otherwise go to main page
document.getElementById('js-header').onclick = function(){
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  } else {
    window.location = "site url";
  }
};

// "Go top" button
window.onscroll = function () {
  showGoTop();
};

function showGoTop() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    document.getElementById('js-top').style.opacity = '1';
    document.getElementById('js-top').style.zIndex = '1';
  } else {
    document.getElementById('js-top').style.opacity = '0';
    document.getElementById('js-top').style.zIndex = '-1';
  }
  // If user use scroll or press "Go top" after mouse wheel hided navbar
  if (window.scrollY < 149) {
    document.getElementById('navbar').style.top = '0';
  }
  var goTopButton = document.getElementById('js-top');
  goTopButton.onclick = function () {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };
}