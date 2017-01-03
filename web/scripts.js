console.log('script loaded');
var jQuery = $;
var state = 0;			  
var listen = true;
var bufferHeight = 2800;
var evenSpeed = 5.8;


var getAverage = function(arr, n){
  var sum=0;
  if(n>arr.length){
    n = arr.length;
  }
  
  for(var ii=arr.length-n; ii<arr.length; ii++){
    sum += arr[ii];
  }
  return sum/n;
}

//floor sign
var heightPerFloor = ($(document).height())/8;
for(var j=0; j<= $(document).height() ; j+=heightPerFloor){ 
  var floorNum = ($(document).height()-j)/heightPerFloor //+1;  
  var floorHeight = j-200;
  $('body').append(`<div style="position:absolute; top:${floorHeight}px; left:20px">floor${floorNum}</div>`);
}
console.log("total height:  "+$(document).height()+"px");

var patternUp = function(){
  $( "html, body" ).stop();
  console.log("go up");
  direction = "up";

 	$('#up').addClass('change');  
 	$('#down').removeClass('change'); 
  $('#stop').removeClass('change');   
  
  //buffer
  $("html, body").animate( 
    {scrollTop: document.body.scrollTop-bufferHeight
    },{
      duration:1800 ,   
      easing: "easeInQuad"} 
  ); 
  //even speed
  $("html, body").animate( 
    {scrollTop: $("html, body").offset().top +"px"
    },{
      duration: document.body.scrollTop/evenSpeed,   
      easing: "linear"} 
  );
} 

var patternDown = function(){
  $( "html, body" ).stop();
  console.log("go down");
  direction = "down";
  $('#up').removeClass('change');  
  $('#down').addClass('change'); 
  $('#stop').removeClass('change');  
  //buffer
  $("html, body").animate( 
    {scrollTop: document.body.scrollTop+bufferHeight
    },{
      duration:1800 ,   
      easing: "easeInQuad"} 
  ); 
  //even speed
  $("html, body").animate({     
    scrollTop:$(document).height()
  }, {
    duration:(($(document).height()-document.body.scrollTop)/evenSpeed),  
    easing: "linear"
  });
  return
}

var patternStop = function(){
  $( "html, body" ).stop();
  $('#up').removeClass('change'); 
  $('#down').removeClass('change'); 
  $('#stop').addClass('change');  
  
  if(direction == "up"){
    console.log("stop");
    setTimeout(function(){  
      $('html, body').animate({ scrollTop: document.body.scrollTop-bufferHeight},
          { duration: 1800, 
           easing: 'easeOutQuad' });
    }, 0);
  }
  if(direction == "down"){
    console.log("stop");
    setTimeout(function(){  
      $('html, body').animate({ scrollTop: document.body.scrollTop+bufferHeight},
          { duration: 1800, 
           easing: 'easeOutQuad' });
    }, 0);      
  }
  if(direction == null){      
  }

  direction = null;
}


//var accelerations = ["9653","9718","9718","9733","9691","9728","9691","9717","9703","9684","9698","9711","9720","9726","9710","9715","9678","9726","9686","9708","9735","9689","9630","9657","9538","9722","9577","9618","9552","9461","9413","9361","9313","9314","9200","9256","9210","9207","9247","9198","9193","9210","9189","9182","9268","9305","9308","9501","9551","9531","9711","9680","9765","9753","9829","9964","9988","9997","10063","10214","10250","10210","10194","10176","10195","10183","10222","10209","10187","10161","10110","10067","10046","9960","9973","9871","9898","9789","9825","9705","9678","9699","9687","9739","9718","9662","9689","9869","9608","9862","9758","9796","9764","9750","9708","9685","9758","9675","9780","9650","9765","9620","9734","9783","9644","9599","9742","9629","9656","9726","9724","9714","9698","9727","9707","9720","9677","9710","9668","9720","9835","9697","9606","9673","9722","9711","9724","9687","9733","9753","9702","9717","9751","9638","9675","9618","9789","9723","9686","9727","9724","9709","9665","9734","9645","9722","9757","9704","9744","9722","9695","9678","9680","9680","9669","9723","9807","9777","9848","9806","9892","9938","10019","9977","10074","10106","10274","10246","10203","10205","10236","10224","10203","10203","10193","10184","10199","10109","9963","9967","9921","9788","9740","9717","9641","9659","9610","9507","9440","9338","9276","9216","9243","9242","9168","9210","9193","9197","9125","9213","9222","9179","9308","9328","9376","9420","9425","9466","9501","9517","9614","9656","9687","9718","9692","9673","9748","9594","9617","9655","9665","9635","9653","9641","9697","9648","9693","9645","9707","9705","9643","9748","9745","9648","9651","9869","9697","9741","9756","9626","9726","9686","9683","9671","9641","9648","9649","9680","9677","9718","9726","9656","9724","9701","9622","9685","9667","9649","9721","9642","9684","9713","9707","9705","9665","9711","9689","9669","9696","9672","9704","9684","9701","9704","9708","9689","9703","9697","9710","9709","9693","9655","9655","9647","9601","9580","9576","9657","9563","9582","9438","9447","9332","9358","9279","9333","9197","9095","9204","9134","9235","9189","9206","9155","9207","9220","9223","9363","9309","9458","9534","9647","9651","9732","9730","9729","9699","9722","9702","9746","9693","9673","9668","9689","9659","9659","9691","9703","9709","9691","9638","9714","9650","9734","9610","9702","9673","9716","9693","9672","9684","9697","9675","9758","9760","9905","9966","10032","10096","10155","10237","10199","10197","10207","10137","10191","10179","10199","10246","10137","10036","10134","9985","9983","9933","9902","9819","9783","9710","9692","9637","9686","9680","9631","9657","9697","9720","9766","9710","9709","9774","9691","9792","9718","9721","9699","9693","9741","9663","9740","9805","9704","9759","9703","9600","9723","9693","9762","9698","9698","9672","9650","9633","9697","9644","9675","9638","9730","9721","9728","9611","9607","9667","9687","9662","9698","9704","9660","9680","9683","9660","9703","9691","9689","9649","9698","9709","9698","9651","9685","9690","9638","9702","9651","9695","9691","9691","9642","9666","9678","9680","9702","9680","9673","9464","9529","9347","9565","9411","9481","9394","9344","9308","9206","9271","9134","9181","9170","9220","9153","9206","9218","9155","9186","9185","9224","9387","9426","9528","9637","9665","9698","9674","9679","9699","9705","9671","9757","9677","9763","9660","9697","9668","9705","9644","9727","9641","9721","9660","9696","9649","9656","9693","9709","9650","9689","9678","9699","9643","9735","9698","9648","9686","9713","9660","9703","9644","9690","9668","9696","9667","9698","9656","9669","9683","9662","9727","9648","9695","9648","9669","9677","9665","9665","9679","9722","9683","9653","9679","9691","9691","9631","9687","9667","9619","9696","9681","9680","9655","9704","9677","9697","9666","9671","9763","9686","9685","9656","9656","9710","9581","9713","9686","9724","9667","9639","9705","9636","9704","9696","9651","9741","9643","9699","9660","9650","9659","9668","9654","9699","9717","9689","9655","9693","9651","9638","9680","9702","9672","9698","9666","9678","9736","9665","9720","9671","9663","9672","9683","9678","9675","9662","9654","9662","9686","9663","9628","9681","9668","9701"]
var sampleAccelerations =["9675","9703","9732","9716","9644","9716","9692","9665","9838","9745","9673","9671","9774","9708","9715","9667","9704","9710","9655","9729","9691","9704","9800","9699","9707","9763","9696","9733","9714","9728","9709","9762","9701","9675","9715","9698","9704","9699","9677","9698","9702","9685","9692","9695","9861","9752","9836","9934","9853","10026","10052","10050","10183","10140","10246","10278","10215","10212","10170","10248","10169","10152","10137","10148","10111","10009","9993","9848","9827","9732","9660","9689","9680","9611","9466","9420","9369","9283","9236","9170","9171","9203","9191","9220","9220","9219","9218","9216","9213","9270","9307","9367","9385","9450","9513","9574","9576","9657","9667","9730","9685","9746","9708","9716","9710","9701","9724","9590","9759","9576","9699","9636","9651","9669","9698","9672","9696","9697","9738","9654","9741","9772","9707","9681","9722","9545","9781","9687","9673","9675","9709","9641","9709","9698","9679","9644","9708","9575","9915","9531","9848","9648","9693","9636","9730","9766","9667","9763","9781","9647","9744","9740","9777","9663","9764","9653","9733","9666","9742","9695","9746","9690","9690","9716","9723","9681","9692","9696","9723","9642","9765","9656","9715","9732","9689","9669","9699","9667","9783","9590","9844","9593","9684","9722","9697","9716","9677","9720","9684","9720","9715","9686","9651","9675","9801","9713","9645","9668","9678","9710","9689","9739","9711","9741","9665","9695","9705","9716","9695","9683","9727","9726","9581","9741","9722","9747","9811","9811","9793","9885","9900","9934","9979","10091","10057","10140","10197","10246","10243","10197","10195","10194","10212","10159","10195","10201","10158","10157","9991","9977","9888","9745","9802","9671","9636","9768","9671","9696","9777","9643","9814","9708","9701","9765","9714","9726","9673","9764","9736","9701","9775","9741","9744","9739","9666","9677","9757","9695","9702","9701","9752","9668","9687","9762","9599","9710","9701","9600","9837","9628","9821","9744","9645","9602","9425","9446","9327","9319","9156","9186","9200","9200","9198","9204","9218","9182","9209","9177","9250","9283","9365","9349","9464","9448","9527","9550","9602","9657","9604","9685","9651","9705","9623","9665","9575","9720","9723","9698","9698","9709","9665","9581","9732","9722","9588","9683","9642","9729","9713","9765","9766","9614","9669","9733","9660","9675","9696","9684","9714","9684","9741","9697","9708","9723","9689","9691","9713","9701","9703","9656","9715","9683","9707","9699","9693","9702","9711","9724","9672","9662","9691","9677","9693","9681","9673","9705","9727","9683","9735","9691","9713","9678","9686","9735","9775","9667","9678","9702","9704","9656","9727","9675","9717","9685","9653","9717","9661","9691","9693","9723","9684","9689","9697","9704","9673","9647","9689","9669","9711","9698","9679","9702","9707","9681","9695","9674","9691","9718","9723","9760","9868","9775","9880","9865","9979","9957","10080","10007","10236","10128","10255","10176","10216","10212","10201","10214","10179","10182","10216","10170","10066","10038","9903","9777","9765","9716","9709","9629","9605","9611","9473","9413","9361","9313","9247","9167","9205","9193","9201","9163","9229","9205","9195","9209","9207","9266","9314","9380","9394","9484","9501","9526","9590","9656","9679","9722","9659","9728","9642","9735","9720","9541","9662","9626","9657","9647","9632","9661","9635","9697","9587","9823","9623","9637","9637","9583","9599","9637","9687","9802","9851","9466","9738","9654","9689","9716","9701","9684","9669","9732","9690","9689","9701","9684","9678","9678","9679","9663","9735","9660","9699","9717","9686","9701","9672","9672","9698","9697","9671","9679","9693","9642","9848","9623","9699","9790","9653","9686","9704","9681","9649","9741","9686","9690","9689","9681","9677","9720","9707","9715","9708","9705","9686","9702","9724","9806","9631","9701","9716","9648","9708","9678","9673","9672","9736","9702","9748","9741","9713","9641","9724","9656","9738","9751","9689","9704","9679","9680","9746","9697","9711","9702","9685","9717","9667","9667","9691","9662","9739","9655","9739","9882","9789","9843","9872","9914","9963","10018","10078","10105","10169","10188","10306","10207","10254","10210","10210","10182","10197","10184","10169","10171","10124","9920","10017","9787","9821","9705","9681","9684","9729","9667","9721","9699","9686","9690","9701","9691","9686","9691","9717","9657","9723","9696","9724","9722","9656","9710","9741","9718","9686","9741","9684","9757","9675","9723","9726","9714","9708","9671","9703","9686","9678","9713","9698","9766","9698","9739","9727","9704","9672","9722","9661","9729","9696","9752","9734","9723","9710","9728","9674","9732","9689","9714","9742","9718","9709","9702","9677","9727","9695","9718","9696","9713","9732","9715","9717","9741","9686","9736","9705","9741","9754","9684","9727","9698","9718","9716","9705","9765","9798","9681","9717","9698","9745","9599","9606","9484","9437","9418","9242","9209","9189","9140","9204","9193","9235","9171","9199","9191","9248","9250","9313","9341","9402","9432","9478","9564","9526","9620","9683","9704","9717","9739","9666","9629","9602","9655","9709","9653","9672","9641","9771","9702","9692","9758","9787","9724","9697","9689","9736","9693","9813","9651","9691","9811","9689","9679","9764","9704","9693","9683","9723","9726","9729","9705","9726","9738","9702","9723","9724","9733","9484","9655","9841","9711","9595","9847","9782","9648","9612","9675","9695","9717","9727","9738","9723","9732","9697","9686","9703","9718","9762","9666","9683","9718","9710","9726","9721","9697","9684","9672","9707","9720","9752","9660","9631","9780","9671","9684","9697","9709","9730","9702","9781","9729","9735","9662","9668","9733","9653","9782","9695","9722","9698","9714","9702","9754","9698","9708","9681","9691","9686","9680","9751","9691","9679","9653","9695","9607","9546","9656","9595","9572","9514","9499","9441","9364","9358","9261","9254","9206","9217","9204","9247","9155","9234","9188","9194","9201","9219","9266","9393","9473","9522","9657","9655","9744","9704","9729","9680","9714","9691","9689","9665","9782","9647","9748","9690","9739","9668","9697","9672","9735","9691","9720","9721","9704","9674","9734","9669","9697","9672","9711","9657","9716","9686","9681","9691","9657","9684","9668","9728","9667","9718","9667","9666","9726","9678","9656","9696","9701","9696","9704","9698","9696","9693","9653","9714","9672","9722","9716","9693","9689","9724","9715","9702","9684","9683","9734","9698","9681","9751","9684","9734","9675","9674","9691","9687","9734","9690","9687","9679","9698","9660","9696","9695","9697","9711","9685","9693","9673","9696","9721","9699","9788","9871","9963","10044","10062","10153","10187","10227","10176","10234","10160","10231","10212","10153","10167","10181","10102","10063","10043","9950","9967","9874","9879","9781","9774","9711","9644","9735","9709","9669","9724","9633","9681","9575","9728","9717","9776","9671","9783","9684","9729","9701","9766","9714","9752","9668","9671","9759","9739","9727","9523","9732","9537","9818","9654","9745","9539","9997","9449","9776","9722","9668","9689","9624","9770","9738","9742","9637","9764","9605","9691","9686","9747","9666","9686","9663","9733","9702","9693","9721","9709","9714","9738","9721","9696","9716","9722","9698","9722","9702","9709","9679","9677","9673","9727","9697","9697","9671","9681","9740","9678","9720","9714","9697","9709","9663","9659","9679","9683","9674","9717","9636","9697","9752","9678","9758","9691","9684","9654","9701","9674","9763","9701","9618","9641","9695","9680","9705","9702","9663","9720","9649","9673","9588","9626","9483","9684","9568","9550","9480","9426","9385","9358","9267","9292","9195","9164","9205","9175","9201","9199","9209","9188","9167","9234","9237","9307","9346","9522","9459","9633","9709","9667","9776","9704","9838","9926","9997","9999","10421","10102","10257","10238","10140","10207","10097","10284","10173","10236","10169","10131","10109","10063","9942","9972","9890","9835","9812","9817","9672","9684","9673","9639","9722","9605","9733","9733","9730","9733","9721","9715","9758","9760","9668","9656","9653","9698","9613","9620","9635","9674","9650","9660","9729","9814","9587","9704","9833","9685","9692","9680","9705","9678","9726","9641","9681","9684","9732","9691","9690","9698","9702","9696","9668","9708","9704","9637","9689","9675","9675","9674","9690","9684","9686","9679","9673","9673","9668","9702","9665","9693","9727","9681","9677","9669","9685","9702","9701","9691","9692","9698","9647","9703","9721","9642","9726","9657","9662","9707","9702","9650","9703","9680","9703","9622","9663","9651","9697","9649","9668","9701","9701","9732","9695","9689","9740","9673","9696","9674","9684","9692","9685","9697","9680","9648","9665","9619","9584","9544","9598","9611","9521","9520","9495","9376","9379","9323","9218","9240","9157","9173","9199","9224","9169","9198","9165","9217","9222","9176","9297","9332","9436","9539","9598","9639","9707","9741","9695","9729","9697","9659","9647","9695","9683","9683","9722","9678","9710","9709","9679","9715","9651","9690","9689","9671","9704","9703","9667","9695","9666","9690","9644","9642","9715","9710","9660","9716","9639","9726","9643","9697","9644","9675","9772","9729","9853","9857","9916","10141","10076","10257","10207","10140","10240","10159","10202","10161","10152","10175","10178","10110","9838","9973","9962","9944","9886","9843","9879","9780","9672","9717","9671","9654","9662","9680","9674","9746","9776","9695","9753","9716","9705","9693","9732","9727","9663","9747","9624","9756","9663","9845","9443","9726","9903","9377","9653","9674","9780","9632","9669","9710","9665","9766","9620","9758","9611","9730","9544","9856","9583","9776","9665","9802","9633","9674","9669","9835","9379","9650","9756","9495","9862","9546","9708","9696","9704","9657","9697","9734","9685","9718","9702","9668","9669","9686","9711","9693","9695","9650","9677","9720","9691","9659","9750","9679","9724","9599","9745","9707","9655","9667","9705","9739","9678","9679","9644","9711","9657","9701","9678","9653","9644","9671","9635","9726","9707","9738","9684","9714","9654","9588","9616","9602","9566","9589","9650","9521","9547","9423","9464","9356","9304","9319","9241","9204","9206","9155","9230","9179","9176","9193","9200","9198","9223","9260","9361","9374","9502","9519","9638","9663","9721","9771","9798","9874","9966","10006","10123","10112","10238","10203","10199","10191","10154","10201","10117","10148","10152","10136","10120","10030","10025","9957","9944","9874","9862","9874","9711","9713","9656","9671","9678","9632","9673","9678"];
sampleAccelerations = sampleAccelerations.map(function(n){
	return parseInt(n,10);
}) //convert string into integer

//var accelerations =["9691", "9808", "9708", "9775", "9699", "9757", "9729", "9750", "9772", "9805", "9690", "9800", "9736", "9738", "9702", "9770", "9723", "9768", "9740", "9718", "9774", "9723", "9741", "9701", "9734", "9718", "9747", "9752", "9754", "9718", "9724", "9735", "9746", "9741", "9704", "9711", "9765", "9746", "9703", "9740", "9769", "9708", "9715", "9715", "9718", "9745", "9757", "9732", "9756", "9732", "9732", "9726", "9733", "9724", "9722", "9739", "9734", "9730", "9726", "9715", "9724", "9720", "9687", "9727", "9730", "9745", "9692", "9656", "9647", "9709", "9748", "9764", "9697", "9713", "9704", "9756", "9734", "9728", "9701", "9778", "9723", "9637", "9726", "9732", "9718", "9689", "9730", "9759", "9739", "9572", "9687", "9709", "9727", "9754", "9692", "9727", "9729", "9711", "9742", "9708", "9717", "9744", "9705", "9778", "9927", "9805", "9888", "9930", "9969", "10069", "10084", "10140", "10199", "10181", "10280", "10187", "10267", "10171", "10225", "10267", "10207", "10178", "10178", "10216", "10024", "10029", "9923", "9826", "9821", "9721", "9711", "9645", "9665", "9570", "9490", "9373", "9364", "9358", "9174", "9252", "9250", "9133", "9272", "9215", "9246", "9235", "9231", "9220", "9256", "9339", "9326", "9410", "9472", "9493", "9534", "9571", "9636", "9675", "9738", "9736", "9695", "9722", "9721", "9780", "9643", "9684", "9795", "9622", "9697", "9672", "9703", "9741", "9748", "9651", "9704", "9704", "9708", "9698", "9727", "9770", "9741", "9668", "9721", "9787", "9722", "9770", "9815", "9517", "9774", "9601", "9790", "9698", "9701", "9680", "9716", "9716", "9696", "9713", "9710", "9721", "9713", "9739", "9701", "9738", "9704", "9722", "9708", "9739", "9697", "9695", "9703", "9690", "9740", "9707", "9709", "9711", "9710", "9722", "9711", "9707", "9714", "9709", "9741", "9708", "9709", "9718", "9740", "9727", "9709", "9715", "9728", "9714", "9686", "9724", "9697", "9711", "9674", "9705", "9660", "9673", "9608", "9654", "9668", "9711", "9703", "9727", "9718", "9708", "9690", "9714", "9714", "9722", "9733", "9678", "9699", "9717", "9774", "9775", "9722", "9660", "9709", "9732", "9514", "9757", "9748", "9681", "9730", "9703", "9693", "9707", "9726", "9697", "9728", "9691", "9753", "9724", "9867", "9819", "9813", "9917", "9862", "9993", "10020", "10021", "10142", "10151", "10225", "10238", "10233", "10202", "10234", "10258", "10196", "10201", "10184", "10189", "10143", "10092", "9940", "9988", "9877", "9764", "9717", "9608", "9642", "9643", "9672", "9711", "9735", "9744", "9820", "9645", "9663", "9665", "9707", "9703", "9720", "9768", "9756", "9705", "9679", "9618", "9657", "9701", "9735", "9730", "9746", "9729", "9643", "9772", "9647", "9651", "9690", "9711", "9734", "9750", "9750", "9677", "9744", "9647", "9645", "9678", "9653", "9735", "9703", "9752", "9692", "9724", "9671", "9697", "9686", "9667", "9697", "9751", "9801", "9699", "9729", "9744", "9693", "9714", "9681", "9741", "9730", "9759", "9711", "9751", "9718", "9653", "9728", "9690", "9729", "9593", "9543", "9424", "9382", "9305", "9218", "9176", "9223", "9235", "9228", "9228", "9211", "9216", "9204", "9203", "9258", "9310", "9322", "9446", "9434", "9475", "9543", "9589", "9563", "9687", "9739", "9759", "9754", "9680", "9793", "9596", "9675", "9569", "9668", "9715", "9691", "9644", "9669", "9715", "9677", "9692", "9657", "9702", "9690", "9851", "9680", "9650", "9793", "9630", "9639", "9727", "9619", "9809", "9695", "9639", "9747", "9720", "9695", "9692", "9730", "9758", "9657", "9705", "9699", "9710", "9692", "9720", "9701", "9705", "9707", "9738", "9711", "9714", "9710", "9715", "9729", "9698", "9681", "9722", "9707", "9714", "9714", "9702", "9714", "9718", "9733", "9697", "9702", "9708", "9739", "9707", "9703", "9690", "9685", "9716", "9729", "9710", "9674", "9639", "9691", "9656", "9783", "9718", "9686", "9661", "9729", "9714", "9702", "9691", "9701", "9660", "9701", "9750", "9647", "9707", "9677", "9644", "9740", "9675", "9677", "9704", "9689", "9851", "9716", "9754", "9653", "9709", "9684", "9699", "9716", "9713", "9696", "9713", "9703", "9721", "9744", "9952", "9727", "9917", "9819", "9966", "9940", "10044", "10032", "10133", "10141", "10231", "10248", "10201", "10210", "10195", "10232", "10206", "10219", "10210", "10179", "10159", "10056", "9959", "9887", "9923", "9730", "9716", "9675", "9711", "9701", "9649", "9702", "9701", "9651", "9643", "9655", "9753", "9696", "9686", "9678", "9651", "9633", "9726", "9751", "9756", "9728", "9729", "9747", "9638", "9730", "9698", "9730", "9720", "9705", "9711", "9693", "9751", "9648", "9684", "9685", "9744", "9718", "9741", "9686", "9732", "9662", "9656", "9695", "9708", "9662", "9796", "9666", "9738", "9685", "9689", "9631", "9683", "9657", "9803", "9697", "9768", "9748", "9760", "9697", "9756", "9678", "9683", "9537", "9525", "9459", "9335", "9280", "9261", "9165", "9177", "9165", "9226", "9250", "9206", "9203", "9211", "9224", "9252", "9282", "9352", "9350", "9412", "9458", "9538", "9568", "9644", "9671", "9750", "9698", "9717", "9735", "9673", "9638", "9734", "9607", "9665", "9639", "9633", "9759", "9736", "9710", "9616", "9775", "9733", "9760", "9626", "9736", "9728", "9674", "9764", "9738", "9912", "9620", "9590", "9729", "9758", "9699", "9695", "9695", "9722", "9722", "9701", "9702", "9707", "9714", "9739", "9667", "9690", "9716", "9699", "9685", "9699", "9697", "9720", "9696", "9685", "9703", "9709", "9709", "9713", "9679", "9678", "9683", "9728", "9740", "9724", "9735", "9764", "9707", "9680", "9727", "9685", "9729", "9691", "9729", "9693", "9709", "9713", "9765", "9735", "9771", "9713", "9641", "9732", "9739", "9717", "9689", "9695", "9789", "9690", "9632", "9728", "9696", "9677", "9801", "9711", "9701", "9713", "9741", "9708", "9718", "9661", "9724", "9800", "9748", "9741", "9695", "9735", "9675", "9733", "9707", "9693", "9705", "9702", "9709", "9733", "9849", "9750", "9905", "9824", "9918", "9960", "10023", "10062", "10060", "10110", "10233", "10209", "10230", "10171", "10199", "10207", "10208", "10219", "10199", "10193", "10245", "10126", "10056", "9970", "9820", "9765", "9792", "9777", "9722", "9720", "9622", "9519", "9443", "9383", "9323", "9254", "9106", "9219", "9176", "9266", "9195", "9232", "9215", "9246", "9260", "9235", "9229", "9337", "9345", "9423", "9466", "9458", "9558", "9576", "9628", "9707", "9734", "9714", "9730", "9732", "9681", "9636", "9689", "9570", "9616", "9680", "9635", "9665", "9663", "9689", "9673", "9723", "9680", "9659", "9718", "9684", "9844", "9756", "9675", "9709", "9787", "9575", "9878", "9704", "9689", "9695", "9754", "9754", "9692", "9739", "9696", "9717", "9673", "9738", "9721", "9683", "9689", "9704", "9713", "9716", "9713", "9687", "9691", "9678", "9696", "9711", "9716", "9718", "9698", "9691", "9698", "9701", "9705", "9703", "9708", "9717", "9740", "9684", "9732", "9710", "9686", "9709", "9698", "9681", "9701", "9709", "9736", "9704", "9703", "9699", "9724", "9686", "9698", "9711", "9741", "9669", "9736", "9739", "9661", "9692", "9668", "9703", "9701", "9661", "9754", "9638", "9778", "9729", "9649", "9699", "9717", "9662", "9629", "9740", "9716", "9730", "9696", "9708", "9692", "9709", "9650", "9687", "9692", "9787", "9709", "9702", "9690", "9714", "9703", "9716", "9690", "9720", "9705", "9708", "9697", "9678", "9713", "9686", "9696", "9717", "9704", "9701", "9672", "9701", "9686", "9684", "9691", "9716", "9696", "9727", "9696", "9695", "9709", "9722", "9693", "9699", "9711", "9696", "9697", "9710", "9699", "9681", "9711", "9729", "9687", "9710", "9720", "9717", "9695", "9685", "9693", "9699", "9683", "9678", "9698", "9691", "9675", "9704", "9701", "9708", "9701", "9687", "9697", "9701", "9698", "9702", "9726", "9701", "9655", "9738", "9709", "9713", "9691", "9720", "9692", "9721", "9674", "9717", "9680", "9692", "9729", "9697", "9702", "9639", "9684", "9710", "9672", "9643", "9686", "9217", "9447", "9751", "9557", "9713", "9600", "9284", "9563", "9672", "10009", "9638", "9811", "9203", "9707", "9708", "9715", "9678", "9726", "9726", "9732", "9715", "9707", "9702", "9683", "9721", "9711", "9709", "9583", "9717", "9772", "9727", "9698", "9705", "9723", "9699", "9710", "9665", "9730", "9754", "10226", "9769", "12957", "10384", "5932", "7237", "9065", "9584", "9936", "9593", "9380", "10292", "9520", "10176", "10379", "9521", "9535", "9800", "9642", "9879", "9583", "10024", "9601", "9483", "9850", "9819", "9626", "9839", "9394", "9620", "10219", "9562", "9550", "9751", "9695", "9958", "9644", "9708", "9757", "9972", "9987", "9754", "9704", "9630", "9379", "9922", "9789", "9687", "9842", "9660", "9891", "9776", "9800", "9757", "9906", "9711", "9780", "9672", "9741", "9600", "9702", "9705", "9756", "9848", "9740", "9696", "9723", "9997", "9584", "9721", "9776", "9806", "9988", "9814", "9704", "9783", "9656", "9643", "9823", "9748", "9760", "9798", "9744", "9715", "9739", "9748", "9757", "9435", "9819", "9565", "9671", "9705", "10262", "9766", "9710", "9787", "9663", "9866", "10085", "9587", "9765", "9619", "9713", "9772", "9843", "9717", "9875", "9808", "9653", "9740", "9762", "9679", "9551", "9786", "9709", "9758", "10005", "9794", "9778", "9654", "9710", "9583", "9655", "9721", "9760", "9449", "9966", "9675", "9735", "10129", "9878", "9744", "9770", "9508", "9745", "9718", "9830", "9728", "9650", "9849", "9745", "9721", "9729", "9778", "9633", "9780", "9830", "9677", "9775", "9695", "9786", "9745", "9736", "9709", "9718", "9720", "9745", "9768", "9765", "9741", "9794", "9726", "9727", "9747", "9723", "9747", "9742", "9740", "9715", "9775", "9744", "9772", "9730", "9732", "9687", "9803", "9745", "9938", "9680", "9732", "9750", "9659", "9794", "9795", "9794", "9812", "9705", "9789", "9752", "9689", "9807", "9817", "9619", "9817", "9754", "9752", "9759", "9763", "9726", "9855", "9762", "9760", "9711", "9771", "9735", "9738", "9769", "9738", "9718", "9713", "9656", "9686", "9538", "9701", "9630", "9605", "9596", "9529", "9497", "9446", "9337", "9276", "9291", "9204", "9256", "9230", "9224", "9229", "9201", "9248", "9229", "9207", "9237", "9243", "9386", "9519", "9513", "9534", "9692", "9698", "9768", "9775", "9856", "9910", "9981", "10037", "10076", "10215", "10270", "10255", "10264", "10188", "10255", "10195", "10255", "10163", "10205", "10142", "10172", "10145", "10026", "10140", "9953", "9940", "9902", "9855", "9831", "9724", "9685", "9698", "9733", "9698", "9710", "9715", "9665", "9736", "9624", "9752", "9820", "9724", "9768", "9754", "9763", "9729", "9747", "9639", "9720", "9745", "9736", "9563", "9783", "9796", "9650", "9760", "9747", "9855", "9614", "9602", "9788", "9707", "9746", "9709", "9720", "9745", "9693", "9704", "9736", "9698", "9744", "9730", "9735", "9708", "9728", "9692", "9717", "9714", "9680", "9742", "9713", "9723", "9735", "9740", "9720", "9746", "9710", "9745", "9707", "9672", "9729", "9739", "9711", "9726", "9730", "9726", "9733", "9728", "9707", "9727", "9739", "9742", "9714", "9754", "9753", "9720", "9715", "9727", "9717", "9735", "9662", "9697", "9835", "9702", "9686", "9654", "9777", "9752", "9710", "9775", "9683", "9776", "9697", "9809", "9768", "9679", "9633", "9742", "9693", "9715", "9714", "9733", "9750", "9732", "9927", "9717", "9693", "9692", "9710", "9729", "9693", "9723", "9699", "9729", "9689", "9604", "9593", "9593", "9628", "9630", "9611", "9582", "9465", "9481", "9344", "9374", "9291", "9285", "9198", "9240", "9247", "9254", "9182", "9212", "9204", "9229", "9211", "9252", "9270", "9340", "9377", "9453", "9575", "9657", "9684", "9698", "9742", "9695", "9732", "9748", "9687", "9741", "9770", "9696", "9753", "9622", "9705", "9689", "9693", "9691", "9754", "9690", "9758", "9711", "9786", "9637", "9683", "9685", "9681", "9745", "9726", "9733", "9726", "9678", "9699", "9718", "9705", "9724", "9699", "9763", "9722", "9701", "9753", "9748", "9636", "9707", "9699", "9724", "9701", "9782", "9720", "9680", "9723", "9724", "9717", "9721", "9713", "9678", "9716", "9692", "9690", "9754", "9714", "9760", "9722", "9891", "9902", "10007", "10097", "10173", "10149", "10161", "10185", "10258", "10219", "10203", "10203", "10225", "10176", "10191", "10171", "10042", "10081", "10002", "9982", "9939", "9891", "9880", "9794", "9746", "9665", "9721", "9625", "9655", "9790", "9771", "9802", "9770", "9752", "9802", "9710", "9738", "9681", "9739", "9610", "9770", "9675", "9657", "9724", "9752", "9577", "9781", "9613", "9606", "9880", "9764", "9708", "9679", "9677", "9727", "9689", "9678", "9669", "9748", "9697", "9714", "9669", "9697", "9687", "9722", "9705", "9741", "9726", "9714", "9715", "9714", "9695", "9713", "9709", "9738", "9717", "9699", "9720", "9681", "9710", "9739", "9654", "9689", "9710", "9703", "9758", "9778", "9745", "9699", "9771", "9708", "9595", "9754", "9708", "9701", "9753", "9673", "9638", "9698", "9685", "9671", "9742", "9661", "9675", "9763", "9667", "9730", "9730", "9672", "9738", "9753", "9643", "9669", "9758", "9769", "9729", "9695", "9666", "9718", "9691", "9669", "9716", "9702", "9723", "9686", "9702", "9746", "9701", "9696", "9707", "9602", "9630", "9587", "9606", "9623", "9643", "9558", "9514", "9489", "9429", "9375", "9328", "9276", "9261", "9223", "9229", "9192", "9231", "9181", "9199", "9211", "9205", "9238", "9223", "9328", "9369", "9374", "9489", "9558", "9669", "9705", "9745", "9685", "9765", "9730", "9748", "9699", "9745", "9686", "9659", "9704", "9770", "9744", "9674", "9728", "9637", "9643", "9679", "9713", "9693", "9762", "9742", "9774", "9651", "9718", "9645", "9757", "9696", "9729", "9735", "9699", "9689", "9647", "9684", "9661", "9740", "9759", "9714", "9716", "9730", "9643", "9724", "9674", "9684", "9710", "9728", "9674", "9675", "9701", "9678", "9675", "9697", "9669", "9701", "9739", "9750", "9730", "9740", "9692", "9754", "9636", "9695", "9709", "9689", "9708", "9697", "9756", "9759", "9792", "9885", "9960", "10007", "10133", "10213", "10272", "10201", "10179", "10232", "10182", "10181", "10173", "10188", "10183", "10135", "10178", "10082", "10027", "9965", "9991", "9892", "9882", "9820", "9765", "9707", "9643", "9687", "9690", "9692", "9723", "9703", "9744", "9750", "9787", "9698", "9784", "9727", "9766", "9830", "9730", "9729", "9724", "9729", "9756", "9748", "9768", "9741", "9661", "9668", "9635", "9553", "9588", "9824", "9815", "9744", "9668", "9666", "9745", "9642", "9730", "9726", "9710", "9724", "9722", "9685", "9710", "9726", "9699", "9668", "9711", "9721", "9675", "9724", "9680", "9708", "9745", "9721", "9707", "9714", "9683", "9724", "9734", "9729", "9699", "9689", "9728", "9717", "9699", "9703", "9714", "9742", "9693", "9680", "9701", "9697", "9697", "9699", "9789", "9707", "9720", "9666", "9693", "9703", "9750", "9758", "9686", "9650", "9754", "9736", "9681", "9708", "9656", "9760", "9782", "9742", "9648", "9771", "9660", "9720", "9721", "9704", "9745", "9667", "9683", "9702", "9692", "9726", "9684", "9713", "9748", "9710", "9689", "9418", "9644", "9593", "9605", "9668", "9622", "9553", "9563", "9467", "9411", "9369", "9340", "9314", "9246", "9175", "9179", "9213", "9211", "9204", "9191", "9228", "9256", "9189", "9207", "9305", "9394", "9422", "9533", "9557", "9702", "9726", "9748", "9760", "9829", "9981", "10001", "10103", "10226", "10166", "10210", "10173", "10213", "10187", "10197", "10228", "10179", "10203", "10182", "10141", "10104", "10100", "10014", "9972", "9947", "9863", "9884", "9808", "9735", "9711", "9674", "9708", "9687", "9697", "9723", "9638", "9701", "9701", "9766", "9705", "9748", "9777", "9799", "9750", "9820", "9746", "9747", "9608", "9759", "9714", "9715", "9662", "9833", "9879", "9624", "9973", "9499", "9954", "9238", "9043", "9402", "8624"];
var i = 0;
var accelerationArr=[];

setTimeout(function(){

	//load image & scroll down
	console.log("load image for 2 secs");
	$('html, body').animate({
      scrollTop: $(document).height()
  }, 2000);
	console.log("scroll down to bottom");

	//run data
	setTimeout(function(){
		setInterval(function(){

		  //get moving averag value of acceleration
			var oneAcceleration = sampleAccelerations[i];
		  if(oneAcceleration === undefined){
		    console.log('no more accelerations, please refresh page');
		    return;
		  };
		  i++;
			accelerationArr.push(oneAcceleration);
			var acceleration = getAverage(accelerationArr,5);
		  console.log('average', acceleration);


      //changing direction
	    if(listen == false){
	    	return;
	    }

			if(acceleration > 10100){
				if(state == 1){
					return;
				}
				state++;
				listen = false; 
				setTimeout(function(){
					listen = true;
				},2000)

			}else if(acceleration < 9300){
				if(state == -1){
					return;
				}
				state--;
				listen = false; 
				setTimeout(function(){
					listen = true;
				},2000)

			}else{
				return;
			}

			if(state === 1){
				console.log("up");
				patternUp();
			} else if(state === 0){
				console.log("stop");
				patternStop();
			} else if(state === -1){
				console.log("down");
				patternDown();
			}


		}, 100);
	
	},2000);

},2000);




