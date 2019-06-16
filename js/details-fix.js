
//fix details margin in case of hyphenation
var details = document.getElementsByClassName('food__details');
var titleName = document.getElementsByClassName('food__title-name');
function adaptDetailsMargin() {
  for (let i = 0; i < titleName.length; i++) {
    if (titleName[i].clientHeight > 31) {
      details[i].style.marginTop = '5px';
    } else if (titleName[i].clientHeight < 30) {
      details[i].style.marginTop = '20px';
    }
  }
}
adaptDetailsMargin();
window.addEventListener('resize', adaptDetailsMargin);