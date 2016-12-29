console.log("start");

var direction = null;
//var jQuery = $;

// $("html, body").on( "keydown", function(event) {
  
  
  // $( "#up" ).click(function() {
//   $( ".block" ).animate({ top: "-=1000px" }, 10000 );
// });
  //press "w" to go up
  //if(event.keyCode == 87){ //w top
$( "#up" ).on("click",function() {
  $( "html, body" ).stop();
  console.log("go up");
  direction = "up";
  $("html, body").animate( 
    {scrollTop: $("html, body").offset().top +"px"
    },{
      duration: document.body.scrollTop*2,   
      easing: "linear"} 
  ); 
});

  //press "s" to go down
  //if(event.keyCode == 83){ //s bottom
$( "#down" ).on("click",function() {
  $( "html, body" ).stop();
  console.log("go down");
  direction = "down";
  $("html, body").animate({     
    scrollTop:$(document).height()
  }, {
    duration:(($(document).height()-document.body.scrollTop)*2),  
    easing: "linear"
  });
  return
});
// })
  //press "p" to pause
  //if(event.keyCode == 80){ //p
$( "#stop" ).on("click",function() {
  $( "html, body" ).stop();
 
  if(direction == "up"){
    console.log("go up and stop");
    setTimeout(function(){  
      $('html, body').animate({ scrollTop: document.body.scrollTop-200 },
          { duration: 1000, 
           easing: 'easeOutQuad' });
    }, 0);
  }
  if(direction == "down"){
    console.log("go down and stop");
    setTimeout(function(){  
      $('html, body').animate({ scrollTop: document.body.scrollTop+200 },
          { duration: 1000, 
           easing: 'easeOutQuad' });
    }, 0);      
  }
  if(direction == null){      
  }
  direction = null;
});

   
  

//   
// });

// $( "#up" ).click(function() {
//   $( ".block" ).animate({ top: "-=1000px" }, 10000 );
// });


// $( "#stop" ).click(function() {
//     console.log("stop");
//   $( ".block" ).stop();
//    console.log("stop finish");
// });
 
// $( "#down" ).click(function() {
//   console.log("down to bottom");
//   $( ".block" ).animate({ top: "+=1000px" }, 10000 );
// });


// var p = $( "p:first" );
// var position = p.position();
// $( "p:last" ).text( "left: " + position.left + ", top: " + position.top );

// var p = $( ".block" );
// var position = p.position();
// $( "p:last" ).text( "left: " + position.left + ", top: " + position.top );



// var canvas = document.getElementById("myCanvas");
// var ctx = canvas.getContext("2d");
// ctx.fillText("2000px",10,2000);

  // $("html, body").animate({ 
  // top: '-=500px'}, 600, 'easeOutExpo' //function () { }
  // )



// $("html, body").click(function () {
//   $("html, body").animate({
//     scrollTop: $("html, body").offset().top//+ "px"
//      //scrollTop: '-=500px'//2倍
//     }, {
//     duration: 3000,     
//     easing: "linear" 
//   });
// })