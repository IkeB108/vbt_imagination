/*
How to use:
- Press the ` key to switch between console and canvas
    - Requires a keyboard to be connected to mobile device
- console.log() now logs things to the embedded console
- To log things to the normal, native console, use nativeLog()
- When the project is complete, follow directions in index.html
for publishing the project.
*/


placementMode = false;
//When true, user can drag around drawings and they won't have depth
imagesLoaded = 0;

setInterval( ()=> {
  if(typeof loadingScreenGone == "undefined"){
    let loadingText = document.getElementById("p5_loading")
    console.log(loadingText)
    loadingText.innerHTML = "Loading... " + imagesLoaded + "/63 images"
  }
}, 100)

function preload(){
  paper_image = loadImage("Photos/paper.png")
  layersPlacement = layersPlacement.split("\n");
  var nlp = [];
  for(var i = 0; i < layersPlacement.length; i ++){
    nlp.push(layersPlacement[i].split(" "))
  }
  layersPlacement = nlp;
  // 
  // if(typeof drawing_files[0] == "string") {
  //   //If we're not using the json...
  //   drawings = []
  //   for(var i = 0; i < drawing_files.length; i ++){
  //     if(drawing_files[i].length > 1){
  //       if(drawing_files[i].endsWith("_float.png") ){
  //         var type = "float"
  //         var z = map(i, 0, drawing_files.length, 0.5, 1)
  //       }
  //       if(drawing_files[i].endsWith("_ground.png") ){
  //         var type = "ground"
  //         var z = map(i, 0, drawing_files.length, 0.5, 1)
  //       }
  //       if(drawing_files[i].endsWith("_full.png") ){
  //         var type = "full"
  //         var z = 0.4
  //       }
  //       var x = i * 50 * z;
  //       if(placementMode)x = i * 50;
  //       var img_obj = {
  //         type: type,
  //         x: x,
  //         x_at_press: x,
  //         y: 0,
  //         z: z,
  //         image: loadImage("photos/" + drawing_files[i]),
  //         fileName: drawing_files[i]
  //       }
  //       drawings.push( img_obj )
  //     }
  // 
  //   }
  // } else {
  //   var len = drawing_files.length
  //   drawings = [];
  //   for(var i = 0; i < len; i ++){
  //     var di = drawing_files[i]
  //     if(di.type == "float"){
  //       var z = map(i, 0, len, 0.5, 1)
  //     }
  //     if(di.type == "ground"){
  //       var z = map(i, 0, len, 0.5, 1)
  //     }
  //     if(di.type == "full"){
  //       var z = 0.4
  //     }
  //     var img_obj = {
  //       type: di.type,
  //       x: di.x,
  //       x_at_press: di.x,
  //       y: 0,
  //       z: z,
  //       image: loadImage("photos/" + di.fileName),
  //       fileName: di.fileName
  //     }
  //     drawings.push(img_obj)
  //   }
  //   nativeLog("DONE")
  // }
  
  //Drawing files are numbered. Load them in this order so we can
  //draw them in this order.
  drawings = [];
  for(var i = 1; i < 63; i ++){
    if(i < 20){
      //Image type is "full"
      var drawing_type = "full"
      var z = 20/63;
    }
    if(i.isBetween(20, 55) ){
      //Image type is "float"
      drawing_type = "float"
      var z = i/63;
    }
    if(i > 55){
      //Image type is "ground"
      drawing_type = "ground"
      var z = i/63;
    }
    var fileName = "Photos/" + drawing_type + "/" + i + ".png"
    var x = int(layersPlacement[i-1][0]) * (z * 2)
    drawings.push({
      type: drawing_type,
      x: x,
      x_at_press: x,
      y: int(layersPlacement[i-1][1]),
      z: z,
      image: loadImage(fileName, successCall, failCall),
      fileName: fileName
    })
  }
  drawings.push({
    type: "text",
    x: 800,
    x_at_press: 800,
    y: 0,
    z: 1,
    image: loadImage("Photos/text.png"),
    fileName: "text.png"
  } )
}

function successCall(){
  imagesLoaded ++;
};

function failCall(e){
}


function setup() {
  loadingScreenGone = true;
  
  pixelDensity(1);
  pxSpacing = 20;
  createCanvas(1,1)
  setupCanvas();
  createCanvasEventListeners();
  logMouse = false;
  
  drawings[drawings.length - 1].y = height/2; //Y coord of text image
  
  
  full_drawings_indeces = [];
  non_full_drawings_indeces = [];
  
  //Set width and height of all drawings
  height_of_full = 1000; //px
  width_of_full = 17619; //px
  width_of_display_gallery = width_of_full * (height/height_of_full)
  for(var i = 0; i < drawings.length; i ++){
    var di = drawings[i]
    var h = height * (di.image.height/height_of_full);
    var w = di.image.width * (h/di.image.height)
    di.w = w;
    di.h  =h;
    di.x *= width_of_display_gallery/width_of_full;
    di.y *= height/height_of_full
  }
  
  // for(var i = 0; i < drawings.length; i ++){
  //   var di = drawings[i];
  //   if(di.type == 'float' || di.type == "ground"){
  //     di.h = height * random(1/3, 2/3)
  //     di.w = di.image.width * (di.h/di.image.height)
  //     non_full_drawings_indeces.push(i)
  //     if(di.type == "float")di.y = (height/2) - (di.h/2)
  //   }
  //   if(di.type == "full"){
  //     di.h = height
  //     di.w = di.image.width * (di.h/di.image.height)
  //     full_drawings_indeces.push(i)
  //   }
  //   if(di.type == "text"){
  //     di.h = height * (1/20)
  //     di.w = di.image.width * (di.h/di.image.height)
  //     non_full_drawings_indeces.push(i)
  //   }
  //   di.x *= (width/591)
  // }
  
  
  scrollSpeed = 0;
  mousepos_array = [];
  for(var i = 0; i < 5; i ++)mousepos_array.push({x:0,y:0})
  mouse_movement_multiplier = 0.2;
  
  //in placement mode, set this to the index of the drawing currently selected, if any
  drawing_selected = "none";
  drawing_selected_x_at_press = 0;
  mousepos_at_previous_press = {x: 0, y: 0}
}

function draw() {
  background(0);
  paperBackground();
  updateDrawings();
  displayDrawings();
  
  mousepos_array.shift();
  mousepos_array.push( {x:mousepos.x, y:mousepos.y} )
}

function paperBackground(){
  //Draw the paper image as the background
  var p = paper_image
  if( (p.width/p.height) >= (width/height) ){
    //Paper photo is too wide or the exact right width.
    //Match its height to canvas height
    var h = height;
    var w = (h/p.height) * p.width
  }
  else {
    //Paper photo's height is too large.
    //Match its width to canvas width
    var w = width;
    var h = (w/p.width) * p.height
  }
  image(p, 0, 0, w, h)
}

function displayDrawings(){
  
  for(var i = 0; i < drawings.length; i ++){
    di = drawings[ i ]
    image(di.image, di.x, di.y, di.w, di.h)
    // if(drawing_selected == full_drawings_indeces[i])rect(di.x, 0, di.w, di.h)
  }
}

function updateDrawings(){
  var user_is_dragging = (mousepos.pressed && !placementMode) || mousepos.buttons_down.includes("right")
  if( user_is_dragging ){
    for(var i = 0; i < drawings.length; i ++){
      var depth_multiplier = drawings[i].z
      // depth_multiplier = 1;
      drawings[i].x = drawings[i].x_at_press + ((mousepos.x - mousepos_at_press.x) * depth_multiplier * mouse_movement_multiplier)
    }
  } else {
    for(var i = 0; i < drawings.length; i ++){
      var depth_multiplier = drawings[i].z
      // depth_multiplier = 1;
      drawings[i].x += (scrollSpeed * depth_multiplier);
    }
  }
  if(drawing_selected !== 'none'){
    drawings[drawing_selected].x = drawing_selected_x_at_press + (mousepos.x - mousepos_at_press.x)
  }
  
  if(drawings[18].x < -1 * (drawings[18].w) ){
    nativeLog("Loop time")
    for(var i = 0; i < drawings.length; i ++){
      var di = drawings[i]
      var x = int(layersPlacement[i][0]) * (di.z * 2)
      drawings[i].x = x;
      drawings[i].x_at_press = x;
      di.x *= width_of_display_gallery/width_of_full;
      di.y *= height/height_of_full
    }
  }
}

function setDrawingSelected(){
  new_drawing_selected = 100000;
  for(var i = 0; i < drawings.length; i ++){
    var di = drawings[i]
    if(drawings[i].type == "float" || drawings[i].type == "text"){
      var mouse_is_over = collidePointRect(mousepos.x, mousepos.y, di.x, di.y, di.w, di.h)
    }
    if(drawings[i].type == "ground"){
      var mouse_is_over = collidePointRect(mousepos.x, mousepos.y, di.x, height - di.h, di.w, di.h)
    }
    if(drawings[i].type == "full"){
      var mouse_is_over = collidePointRect(mousepos.x, mousepos.y, di.x, 0, di.w, di.h)
    }
    if(mousepos.x == mousepos_at_previous_press.x && mousepos.y == mousepos_at_previous_press.y){
      if(i >= previous_drawing_selected)mouse_is_over = false;
    }
    if(mouse_is_over){new_drawing_selected = i}
  }
  if(new_drawing_selected == 100000)drawing_selected = 'none';
  else {
    drawing_selected = new_drawing_selected;
    drawing_selected_x_at_press = drawings[drawing_selected].x
  }
}

function getDrawingFiles(){
  var ret = [];
  for(var i = 0; i < drawings.length; i ++){
    ret.push( {
      'fileName': drawings[i].fileName,
      'x': drawings[i].x
    } )
  }
  saveJSON(ret, "drawing_files")
}
