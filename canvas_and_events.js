function clickBegin( buttonName ){
  mousepos_at_press = {x:mousepos.x,y:mousepos.y}
  set_drawings_x_at_press();
  
  if(buttonName == "left" && placementMode)
  setDrawingSelected();
}
function clickEnd( buttonName ){
  if(!placementMode || buttonName == 'right'){
    var avg = 0;
    for(var i = 1; i < mousepos_array.length; i ++){
      avg += mousepos_array[i].x - mousepos_array[i-1].x
    }
    avg /= (mousepos_array.length-1)
    avg *= mouse_movement_multiplier
    scrollSpeed = avg;
  }
  
  mousepos_at_previous_press = {x: mousepos_at_press.x, y: mousepos_at_press.y}
  previous_drawing_selected = drawing_selected;
  drawing_selected = "none";
  drawing_selected_x_at_press = 0;
}
function clickMove(){
  
}

function set_drawings_x_at_press(){
  for(var i = 0; i < drawings.length; i ++){
    drawings[i].x_at_press = drawings[i].x;
  }
}

function mouseWheel(){
  
}
window.keyTyped = function keyTyped(){
  if(key == '`'){
    var made_change = false;
    if(!canvas.hidden){
      canvas.hidden = true;
      consoleElement.hidden = false;
      made_change = true;
    }
    if(canvas.hidden && !made_change){
      canvas.hidden = false;
      consoleElement.hidden = true;
    }
  }
}

function setupCanvas(){
  var h = windowHeight - pxSpacing * 2;
  var w = windowWidth - pxSpacing * 2;
  if(h/w <= 1.5)w = h / 1.5;
  resizeCanvas(round(w),round(h))
  //Set canvas attribute style to "touch-action: none"
}

function windowResized(){
  setupCanvas();
}

function createCanvasEventListeners(){
  /*
  The default mouse behaviors from P5JS are not working
  very well on mobile and I need good tap and drag functionality
  so I'm coding it myself
  */
  document.body.addEventListener("mousedown", mouseDown)
  document.body.addEventListener("mousemove", mouseMove)
  document.body.addEventListener("mouseup", mouseUp)
  document.body.addEventListener("touchstart", touchStart)
  document.body.addEventListener("touchmove", touchMove)
  document.body.addEventListener("touchend", touchEnd)
  onMobile = false;
  logMouse = false; //Set to true to log mouse/touch movements and positions
  mousepos = {'x':null, 'y':null, 'pressed':false, 'isclick':false, "buttons_down":[]}
  mousepos2 = {'x':null, 'y':null, 'pressed':false} //Second finger if on mobile
  mousepos_at_press = {x:null,y:null}
  presses_count = 0;
}



function mouseDown(e){
  if(!onMobile){
    if(logMouse)console.log("Mouse down x" + round(mousepos.x) + " y" + round(mousepos.y) )
    // console.log(mousepos)
    mousepos.pressed = true;
    if(e.button == 0)var buttonName = "left"
    if(e.button == 1)var buttonName = "middle"
    if(e.button == 2)var buttonName = "right"
    mousepos.buttons_down.push(buttonName)
    clickBegin( buttonName );
  }
}
function mouseUp(e){
  if(!onMobile){
    if(logMouse)console.log("Mouse up x" + round(mousepos.x) + " y" + round(mousepos.y) )
    // console.log(mousepos)
    mousepos.pressed = false;
    if(e.button == 0)var buttonName = "left"
    if(e.button == 1)var buttonName = "middle"
    if(e.button == 2)var buttonName = "right"
    removeButtonDown(buttonName)
    clickEnd( buttonName );
  }
}
function mouseMove(e){
  if(!onMobile){
    getMousePosFromEvent(e);
    if(mousepos.pressed)clickMove();
  }
}
function touchMove(e){
  getMousePosFromEvent(e);
  clickMove();
}
function touchStart(e){
  onMobile = true;
  if(logMouse)console.log("Touch start x" + round(mousepos.x) + " y" + round(mousepos.y) )
  getMousePosFromEvent(e);
  mousepos.pressed = true;
  clickBegin();
}
function touchEnd(e){
  // console.log(e)
  if(logMouse)console.log("Touch end x" + round(mousepos.x) + " y" + round(mousepos.y) )
  getMousePosFromEvent(e);
  mousepos.pressed = false;
  clickEnd();
}
function getMousePosFromEvent(e){
  var canvasBounding = canvas.getBoundingClientRect();
  mousepos.x = e.clientX - canvasBounding.x;
  mousepos.y = e.clientY - canvasBounding.y;
  if(e.touches){ //This is a touch, not a mouse click
    if(e.touches.length > 0){ //This is a touch start event.
      presses_count = e.touches.length
      mousepos.x = e.touches[0].clientX - canvasBounding.x;
      mousepos.y = e.touches[0].clientY - canvasBounding.y;
      if(e.touches.length > 1){ //There are two fingers on the screen
        mousepos2.x = e.touches[1].clientX - canvasBounding.x;
        mousepos2.y = e.touches[1].clientY - canvasBounding.y;
      }
    } else { //This is a touch end event
      presses_count = e.changedTouches.length
      mousepos.x = e.changedTouches[0].clientX - canvasBounding.x;
      mousepos.y = e.changedTouches[0].clientY - canvasBounding.y;
      if(e.changedTouches.length > 1){ //There are two fingers on the screen
        mousepos2.x = e.changedTouches[1].clientX - canvasBounding.x;
        mousepos2.y = e.changedTouches[1].clientY - canvasBounding.y;
      }
    }
  }
}

window.onmouseover = window.onmouseout = mouseWindowHandler;
function mouseWindowHandler(event){
  /*
  Despite what it looks like, the mouseout event is called
  whenever the mouse enters/leaves the window AND the CANVAS
  
  Leaving the canvas counts as entering the window (as long
  as the mouse is still within the window)
  And entering the canvas counts as leaving the window   
  
  So both event types will be triggered at unintended times.
  */
  if(event.type == 'mouseover'){
    //nativeLog("I'm in")
  }
  if(event.type == "mouseout"){
    //This event is triggered consistently when the mouse leaves the canvas.
    if(mousepos.pressed){
      mousepos.pressed = false;
      clickEnd();
    }
  }
}

function removeButtonDown(buttonName){
  var ret = [];
  for(var i = 0; i < mousepos.buttons_down.length; i ++){
    if(mousepos.buttons_down[i] !== buttonName)ret.push(buttonName)
  }
  mousepos.buttons_down = ret;
}
