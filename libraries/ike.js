//ike.js version 2.2
//JSON AND HJSON
function handleFile(file){
  /*
  When using a createFileInput button, set this function (handleFile) as the argument.
  This function will be triggered when a file is selected by the user.
  So far, this function processes json and hjson formats.
  IMPORTANT: replace 'x' below with the variable you want the json object to be.
  This code shamelessly stolen from stackoverflow*/
  if(file.name.endsWith('.json') || file.name.endsWith('.hjson')){ //if the file is either a .json or .hjson file
    // Split file.data and get the base64 string
    let base64Str = file.data.split(",")[1];
    // Parse the base64 string into a JSON string
    let jsonStr = atob(base64Str);
    // Parse the JSON object into a Javascript object
    if(file.name.endsWith('.json'))x = JSON.parse(jsonStr); //this line of code parses a normal json file
    if(file.name.endsWith('.hjson'))x = Hjson.parse(jsonStr); //this line, however, parses an hjson file
  }
}

//DATA
function del(itemNo, List){
  newList = [];
  for(var i = 0; i < List.length; i++){
    if(i != itemNo){newList.push(List[i])}
  }
  return newList;
}
//NO! Bad. Just use array.includes(thing) or array.indexOf(thing)
/*function contains(item, List){
  for(var i = 0; i < List.length; i ++){
    if(List[i] === item){
      return true;
    }
  }
  return false
}*/

function ImageToJson(p5image){
  /*given a p5 image or p5 graphics object, returns a json object
  where json.data = a string containing base64 encoded image data*/
  p5image.loadPixels();
  return {"data":p5image.canvas.toDataURL()}
}

function JsonToImage(jsonObject){
  /*
  given a json made with ImageToJson(),
  returns a p5 image of the json data.
  It will take about 2 frames before the image is fully loaded,
  so you can't draw the image right away.
  loadJSON() must be called in preload(), and JsonToImage() must be called after preload() (in setup() or draw())
  */
  return loadImage(jsonObject.data)
}

//TRANSFORMING POINTS
function dilatePoint(thePoint, dilationFactor, centerOfDilation){ //thePoint = the point being dilated, dilationFactor = scale factor (e.g. 2 is twice as big, 0.5 is half as big), centerOfDilation = point around which the point is being dilated
  xOffset = (thePoint.x - centerOfDilation.x) * dilationFactor;
  yOffset = (thePoint.y - centerOfDilation.y) * dilationFactor;
  return createVector(centerOfDilation.x + xOffset, centerOfDilation.y + yOffset)
}
function centerOfShape(points){ //points = list of vertices of the shape
  xTotal = 0;
  yTotal = 0;
  for(var i = 0; i < points.length; i ++){
    xTotal += points[i].x
    yTotal += points[i].y
  }
  return createVector(xTotal/points.length, yTotal/points.length)
}
function rotatePoint(thePoint, rotateBy, CenterOfRotation){ //thePoint = coordinate being rotated, rotateBy = how much rotation clockwise in degrees, CenterOfRotation = point around which point is being rotated
  angleMode(DEGREES)
  xOffset = thePoint.x - CenterOfRotation.x
  yOffset = thePoint.y - CenterOfRotation.y
  angleOffset = atan(yOffset/xOffset)
  if(xOffset < 0){
    angleOffset+= 180
  }
  hypotenuse = dist(thePoint.x, thePoint.y, CenterOfRotation.x, CenterOfRotation.y)
  angleOffset += rotateBy;
  newYOffset = sin(angleOffset) * hypotenuse
  newXOffset = cos(angleOffset) * hypotenuse
  return createVector(CenterOfRotation.x + newXOffset, CenterOfRotation.y + newYOffset);
}
function shape(vertices){
  beginShape();
  for(var i = 0; i < vertices.length; i ++){
    vertex(vertices[i].x,vertices[i].y)
  }
  endShape(CLOSE);
}
function angleOf(centerPoint, destinationPoint){
  angleMode(DEGREES)
  var ret = atan((destinationPoint.x-centerPoint.x)/(centerPoint.y-destinationPoint.y));
  if(destinationPoint.y>centerPoint.y)ret += 180;
  if(ret<0)ret+=360;
  return ret;
}
function collideRectRectNoEdges(x, y, w, h, x2, y2, w2, h2) {
  //same function taken from collide2d, but this version doesn't count edge-to-edge collision
  //2d
  //add in a thing to detect rectMode CENTER
  if (x + w > x2 &&    // r1 right edge past r2 left
      x < x2 + w2 &&    // r1 left edge past r2 right
      y + h > y2 &&    // r1 top edge past r2 bottom
      y < y2 + h2) {    // r1 bottom edge past r2 top
        return true;
  }
  return false;
};

//DISPLAY
function dispSprite(spriteJson,completeImg,smallImgTitle,xarg,yarg,warg,harg){ //warg and harg optional
  var spframe = spriteJson.frames[smallImgTitle].frame;
  if(warg && harg)image(completeImg,spframe.x,spframe.y,spframe.w,spframe.h,xarg,yarg,warg,harg);
  else image(completeImg,spframe.x,spframe.y,spframe.w,spframe.h,xarg,yarg);
} //Displays "cropped" images using data from a json file (use piskelapp to generate PixiJS movies)
function changeCol(col1,col2, threshold){ //changes all pixels of col1 to col2. Threshold optional
  colorMode(RGB)
  loadPixels();
  for(var x = 0; x < width; x ++){
    for(var y = 0; y < height; y ++){
      var index = (x + (y * width)) * 4;
      var pixelCol = color(pixels[index],pixels[index+1],pixels[index+2])
      if(threshold){
        var correctCol = (abs(red(pixelCol) - red(col1))<=threshold &&
                          abs(green(pixelCol) - green(col1))<=threshold &&
                          abs(blue(pixelCol) - blue(col1))<=threshold)
      } else {
        var correctCol = (red(pixelCol) == red(col1) &&
                          green(pixelCol) == green(col1) &&
                          blue (pixelCol) == blue(col1))
      }
      if(correctCol){
           pixels[index] = red(col2)
           pixels[index+1] = green(col2)
           pixels[index+2] = blue(col2)
      }
    }
  }
  updatePixels();
}
function canvasPosition(element, canvas, xarg, yarg){
  /*positions a p5 element relative to a canvas instead of relative to the
  upper left corner of the window*/
  element.position(canvas.position().x + xarg, canvas.position().y + yarg)
}

p5.prototype.collidePointRect = function (pointX, pointY, x, y, xW, yW) {
//2d
if (pointX >= x &&         // right of the left edge AND
    pointX <= x + xW &&    // left of the right edge AND
    pointY >= y &&         // below the top AND
    pointY <= y + yW) {    // above the bottom
        return true;
}
return false;
};


Object.defineProperty(Number.prototype, "isBetween", {
  value: function(a,b,exclusive) {
    //a and b are numbers to check between
    //exclusive is a boolean stating whether to
    //exclude a and b (includes a and b by default)
    if(exclusive) return this > a && this < b
    return this >= a && this <= b
  }
})


/*

HANDY INFORMATION

To remove from an array by index:
myArray.splice(index, 1)
^-- splice here is different from the "splice" you will find in p5js Reference page

To redirect (link):
window.location = "url"

To open in new tab:
window.open("url", "_blank")

To write a text file:
var writer = createWriter('myText.txt');
writer.print(textVariable)
writer.close();

To read a text file:
loadStrings('myText.txt')

To split a string into an array:
x = split('s,t,r,i,n,g', ',')

To execute a string as a line of code:
myFunction = Function('instructions')
myFunction();
https://stackoverflow.com/questions/939326/execute-javascript-code-stored-as-a-string

To create a text area (multiline text input box):
https://discourse.processing.org/t/multi-line-text-box-needed/2318

TO COPY AN OBJECT WITHOUT SIMPLY RE-ASSIGNING THE VARIABLE:
newObject = JSON.parse(JSON.stringify(oldObject))

To load and parse a HJSON file:
- In preload(): myObject = loadStrings('myfile.hjson') in preload()
- In setup():   myObject = Hjson.parse(join(myObject, '\n'))

*/
