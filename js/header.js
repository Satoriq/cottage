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

  let z = document.getElementById('js-nav__info');
  if (z.className === 'nav__info') {
      z.className += ' nav__info--show';
  }
  else {
      z.className = 'nav__info';
  }
}

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
