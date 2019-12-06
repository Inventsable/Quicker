console.log("Host is online");

function getColors() {
  return JSON.stringify({
    fg: app.activeDocument.defaultStrokeColor,
    bg: app.activeDocument.defaultFillColor
  });
}

function placeImage(path) {
  let file = new File(path);
  let imagePlace = app.activeDocument.activeLayer.placedItems.add();
  imagePlace.file = file;
  console.log(path);
}