console.log("Host is online");
function getColors() {
    return JSON.stringify({
        fg: app.activeDocument.defaultStrokeColor,
        bg: app.activeDocument.defaultFillColor
    });
}
function placeImage(path, name) {
    var file = new File(path);
    var imagePlace = app.activeDocument.activeLayer.placedItems.add();
    imagePlace.file = file;
    imagePlace.name = name;
}
function placeSVG(path, name) {
    app.selection = null;
    var file = new File(path);
    var groupItem = app.activeDocument.groupItems.createFromFile(file);
    groupItem.name = name;
    groupItem.selected = true;
    return true;
}
function findAllTextFrames(item) {
    if (/text/i.test(item.typename))
        convertFontToOCRB(item);
    if (item.pageItems && item.pageItems.length)
        for (var i = 0; i < item.pageItems.length; i++)
            findAllTextFrames(item.pageItems[i]);
}
function replaceFontWithOCRB() {
    var selection = app.selection[0];
    findAllTextFrames(selection);
}
function convertFontToOCRB(item) {
    if (hasOCRBMT())
        item.textRange.characterAttributes.textFont = app.textFonts.getByName("OCRBMT");
}
function hasOCRBMT() {
    var found = false;
    for (var i = 0; i < app.textFonts.length; i++)
        if (/ocrbmt/i.test(app.textFonts[i].name))
            found = true;
    return found;
}
