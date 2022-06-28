//WAIT AT LEAST 2 SECONDS FOR CONSOLE TO APPEAR
//MOVE THE SETTIMEOUT() LINE BELOW
//TO SETUP() OF P5 SKETCH
//WARNING:
//console.log() will ONLY appear in the embedded console now,
//but errors will still ONLY appear in the REAL console.

(function(){
    var theme = "xcode";
    
    var load = function(paths, callback){
        var script = document.createElement('script');
        script.setAttribute('src',paths.shift());
        document.head.appendChild(script);
        script.onload = function(){
            if(paths.length>0){
                load(paths, callback)
            }else{
                callback();
            }    
        };
    };
    load([
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js", 
            "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.9/ace.js",
            "https://cdn.rawgit.com/TarVK/chromeConsole/master/console.js"
        ], function(){
            var first = true;
            // $(window).click(function(){
            //     if(first){
            //         first = false;
            //         createWindow();
            //     }
            // });
            
            var createWindow = function(){
                // var seperateWindow = window.open("", "jsConsole", "height=300,width=700");
                var seperateWindow = window.open("", "jsConsole", "");
                // var seperateWindow = window.open("", "_self", "height=300,width=700");
                // var seperateWindow = window
                    
                //get required style elements
                var editor = ace.edit(document.createElement("div"));
                editor.setTheme("ace/theme/xcode");
                
                var styleInterval = setInterval(function(){
                    var themeStyle = $("style#ace-"+theme)[0];
                    var aceStyle1 = $("style[id='ace_editor.css']")[0];
                    var aceStyle2 = $("style#ace-tm")[0];
                    if(themeStyle && aceStyle1 && aceStyle2){
                        clearInterval(styleInterval);
                        seperateWindow.document.open().write(
                            "<html>"+
                                "<head>"+
                                    $("style#ace-"+theme)[0].outerHTML+
                                    $("style[id='ace_editor.css']")[0].outerHTML+
                                    $("style#ace-tm")[0].outerHTML+
                                    "<style>"+
                                        "html, body, .console{width:100%;height:100%;margin:0px;}"+
                                    "</style>"+
                                    '<link rel="stylesheet" href="https://cdn.rawgit.com/TarVK/chromeConsole/master/console.css" type="text/css" />'+
                                    "<title>js Console Plugin</title>"+
                                "</head>"+
                                "<body>"+
                                    "<div class=console></div>"+
                                "</body>"+
                            "</html>");
                        createConsole(seperateWindow.document);
                    }
                }, 100);
                
                $(window).on('beforeunload', function(){
                    seperateWindow.document.open().write("<script>window.close()<\/script>"); 
                });
                seperateWindow.history.pushState("console", "console", "jsConsole");
            }
            createConsole = function(doc){
                cons = $(doc).find(".console").console({theme:theme, onInput: function(text){
                    try{
                        cons.output(window.eval(text));
                    }catch(e){
                        cons.error(e);
                    }
                }});
                var wrap = function(method){
                    return function(){
                        cons[method].apply(cons, arguments);
                    }
                }
                console.log = wrap("log");
                console.error = wrap("error");
                console.warn = wrap("warn");
                console.time = wrap("time");
                console.timeEnd = wrap("timeEnd");
                console.clear = wrap("clear");
            }
        }
    );
})();

setTimeout(initializeConsole, 2000)

function initializeConsole(){
  // var initializeInterval = setInterval(function(){
  // 
  // }, 100)
  var myEditorElement = document.createElement('div')
  myEditorElement.setAttribute('id', "editorElement")
  var editor = ace.edit(myEditorElement);
  editor.setTheme("ace/theme/xcode");
  
  var styleInterval = setInterval(function(){
    var theme = "xcode"
    var themeStyle = $("style#ace-"+theme)[0];
    var aceStyle1 = $("style[id='ace_editor.css']")[0];
    var aceStyle2 = $("style#ace-tm")[0];
    if(themeStyle && aceStyle1 && aceStyle2){
      clearInterval(styleInterval);
      
      document.head.appendChild($("style#ace-"+theme)[0])
      document.head.appendChild($("style[id='ace_editor.css']")[0])
      document.head.appendChild($("style#ace-tm")[0])
      var another_style = document.createElement("style")
      another_style.innerHTML = "html, body, .console{width:100%;height:100%;margin:0px;}"
      var console_div = document.createElement("div")
      console_div.setAttribute("class", "console")
      document.body.appendChild( console_div )
      var stylesheet = document.createElement("link")
      stylesheet.setAttribute("rel", "stylesheet")
      stylesheet.setAttribute("href", "libraries/Embedded-Console/console.css")
      stylesheet.setAttribute("type", "text/css")
      document.head.appendChild(stylesheet)
      // document.write(
      //   "<html>"+
      //   "<head>"+
      //   $("style#ace-"+theme)[0].outerHTML+
      //   $("style[id='ace_editor.css']")[0].outerHTML+
      //   $("style#ace-tm")[0].outerHTML+
      //   "<style>"+
      //   "html, body, .console{width:100%;height:100%;margin:0px;}"+
      //   "</style>"+
      //   '<link rel="stylesheet" href="libraries/Embedded-Console/console.css" type="text/css" />'+
      //   "<title>js Console Plugin</title>"+
      //   "</head>"+
      //   "<body>"+
      //   "<div class=console></div>"+
      //   "</body>"+
      //   "</html>"
      // );
      
      createConsole(document);
      consoleElement = document.getElementsByClassName("console js-console root ace-xcode light")[0]
      consoleElement.hidden = true;
      nativeLog("Embedded console is loaded")
      
      blowupAllText();
      
    }
  }, 100 )
}

function blowupAllText(){
  var allElements = document.getElementsByTagName("*")
  var new_size = windowWidth * (1/25)
  for(var i = 0; i < allElements.length; i ++){
    var s = allElements[i].getAttribute("style")
    if(s == null)s = '';
    allElements[i].setAttribute("style", s + " font-size:" + new_size + "px")
  }
}
