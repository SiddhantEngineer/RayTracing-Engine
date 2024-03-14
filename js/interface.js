import Global from "./global.js";
export default function initInterface() {
  const root = document.getElementById("objects");
  let selectedChild = "OBJECTS0";
  const cardList = [];
  const setSelectedCard = function (objectName) {
    cardList[selectedChild].element.classList.remove("selected-object");
    cardList[objectName].element.classList.add("selected-object");
    selectedChild = objectName;
    Global.UI.APP.selected = cardList[objectName].object;
    cardList[objectName].object.materialIndex = 2;
  };
  Global.TRIANGLES.forEach((object, index) => {
    const card = createObjectCard("OBJECTS" + index, setSelectedCard, object);
    cardList[card.name] = card;
    root.appendChild(card.element);
  });
  setSelectedCard(selectedChild);
}

function createObjectCard(objectName, setSelectedCard, object) {
  const card = {
    name: objectName,
    object: object,
  };
  card.element = document.createElement("div");
  card.element.classList.add("objects-object");
  card.element.innerHTML = objectName;
  card.element.onclick = function () {
    setSelectedCard(objectName);
  };
  return card;
}
