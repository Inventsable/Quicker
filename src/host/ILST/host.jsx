console.log("Host is online");
function getColors() {
    return JSON.stringify({
        fg: app.activeDocument.defaultStrokeColor,
        bg: app.activeDocument.defaultFillColor
    });
}
function placeImage(path) {
    var file = new File(path);
    var imagePlace = app.activeDocument.activeLayer.placedItems.add();
    imagePlace.file = file;
    console.log(path);
}