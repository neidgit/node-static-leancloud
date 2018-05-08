$(function(){
  	(function(){
      var isLogin = localStorage.getItem("user");
      if(isLogin){
        var userName = localStorage.getItem("userName");
        var select1 = localStorage.getItem("select1");
        var select2 = localStorage.getItem("select2");
        var now1 = localStorage.getItem("now1");
        var now2 = localStorage.getItem("now2");
        if($("#uName")){
          $("#uName").html(userName);
        $("#userName").html(userName);
        $(".select1").html(select1);
        $(".select2").html(select2);
        $(".now1").html(now1);
        $(".now1").attr('title',now1);
        $(".now2").html(now2);
        $(".now2").attr('title',now2);
        }
        
      }else{
        quit();
      }

    })()
  function quit(){
  localStorage.clear();
  location.href = "../../../index.html"
}
})
(function(){
   var isLogin = localStorage.getItem("user");
    if(!isLogin){
      quit()
    };
    function quit(){
  localStorage.clear();
  location.href = "../../../index.html"
}
})()