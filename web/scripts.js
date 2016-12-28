

console.log('script loaded')

var arr = [];

try {
  WebViewBridge.onMessage = function(m){
    console.log(m)
  }  
} catch(err){
  console.log(err)
}
