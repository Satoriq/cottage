//
// ────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C R E A T I N G   A   B L O C K S  W I T H  F O O D: :  :   :    :     :
// ────────────────────────────────────────────────────────────────────────────────
//
// Make blocks of food from json file 

// Creating a preety circles right of Oligos, lactose....
for (var i = 0; i < fodmapList.length; i++) {
  if (fodmapList[i].details.oligos === 0) {
    var oligos = document.createElement("span");
    oligos.className = "circle__good";
  } else if (fodmapList[i].details.oligos === 1 ){
    var oligos = document.createElement("span");
    oligos.className = "circle__middle";
  } else if (fodmapList[i].details.oligos === 2 ){
    var oligos = document.createElement("span");
    oligos.className = "circle__bad";
  } else if (fodmapList[i].details.oligos === 5 ){
    var oligos = document.createElement("span");
    oligos.className = "circle__idk";
  }

  if (fodmapList[i].details.fructose === 0) {
    var fructose = document.createElement("span");
    fructose.className = "circle__good";
  } else if (fodmapList[i].details.fructose === 1 ){
    var fructose = document.createElement("span");
    fructose.className = "circle__middle";
  } else if (fodmapList[i].details.fructose === 2 ){
    var fructose = document.createElement("span");
    fructose.className = "circle__bad";
  } else if (fodmapList[i].details.fructose === 5 ){
    var fructose = document.createElement("span");
    fructose.className = "circle__idk";
  }

  if (fodmapList[i].details.polyols === 0) {
    var polyols = document.createElement("span");
    polyols.className = "circle__good";
  } else if (fodmapList[i].details.polyols === 1 ){
    var polyols = document.createElement("span");
    polyols.className = "circle__middle";
  } else if (fodmapList[i].details.polyols === 2 ){
    var polyols = document.createElement("span");
    polyols.className = "circle__bad";
  } else if (fodmapList[i].details.polyols === 5 ){
    var polyols = document.createElement("span");
    polyols.className = "circle__idk";
  }

  if (fodmapList[i].details.lactose === 0) {
    var lactose = document.createElement("span");
    lactose.className = "circle__good";
  } else if (fodmapList[i].details.lactose === 1 ){
    var lactose = document.createElement("span");
    lactose.className = "circle__middle";
  } else if (fodmapList[i].details.lactose === 2 ){
    var lactose = document.createElement("span");
    lactose.className = "circle__bad";
  } else if (fodmapList[i].details.lactose === 5 ){
    var lactose = document.createElement("span");
    lactose.className = "circle__idk";
  }

//Creating a blocks with food
  var container = document.getElementById("js-container");
  var food = document.createElement("div");
  var foodInfo = document.createElement("div");
  var foodTitle = document.createElement("div");
  var foodName = document.createElement("div");
  var foodFodmap = document.createElement("div");
  var foodDetails = document.createElement("p");
  var foodNameText = document.createTextNode(fodmapList[i].name);
  var foodFodmapText = document.createTextNode(fodmapList[i].fodmap);
  var oligosWrapper = document.createElement("span");
  var oligosText = document.createTextNode(" Oligos: ");
  var oligosColor = document.createElement("span");
  var fructoseWrapper = document.createElement("span");
  var fructoseText = document.createTextNode(" Fructose: ");
  var fructoseColor = document.createElement("span");
  var polyolsWrapper = document.createElement("span");
  var polyolsText = document.createTextNode(" Polyols: ");
  var polyolsColor = document.createElement("span");
  var lactoseWrapper = document.createElement("span");
  var lactoseText = document.createTextNode(" Lactose: ");
  var lactoseColor = document.createElement("span");
  container.appendChild(food);
  food.appendChild(foodInfo);
  foodInfo.appendChild(foodTitle);
  foodInfo.appendChild(foodDetails);
  foodTitle.appendChild(foodName);
  foodTitle.appendChild(foodFodmap);
  foodName.appendChild(foodNameText);
  foodFodmap.appendChild(foodFodmapText);
  foodDetails.appendChild(oligosWrapper);
  oligosWrapper.appendChild(oligosText);
  oligosWrapper.appendChild(oligos);
  foodDetails.appendChild(fructoseWrapper);
  fructoseWrapper.appendChild(fructoseText);
  fructoseWrapper.appendChild(fructose);
  foodDetails.appendChild(polyolsWrapper);
  polyolsWrapper.appendChild(polyolsText);
  polyolsWrapper.appendChild(polyols);
  foodDetails.appendChild(lactoseWrapper);
  lactoseWrapper.appendChild(lactoseText);
  lactoseWrapper.appendChild(lactose);
  food.className = "food";
  foodInfo.className = "food__info";
  foodTitle.className = "food__title";
  foodName.className = "food__title-name";
  foodFodmap.className = "food__fodmap";
  foodDetails.className = "food__details";
  oligosWrapper.className = "food__details-wrapper";
  fructoseWrapper.className = "food__details-wrapper";
  polyolsWrapper.className = "food__details-wrapper";
  lactoseWrapper.className = "food__details-wrapper";
}

//Add classes for low of high fodmap

for (var i = 0; i<fodmapList.length; i++) {
  if (fodmapList[i].fodmap === "low") {
    document.getElementsByClassName("food__fodmap")[i].className += " food__fodmap--low";
  } else {
    document.getElementsByClassName("food__fodmap")[i].className += " food__fodmap--high";
  }
}

for (var i = 0; i<fodmapList.length; i++) {
  document.getElementsByClassName("food")[i].style.display="block";
}
