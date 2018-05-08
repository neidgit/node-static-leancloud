// JavaScript Document
//首页  登录那块  tab切换
 $(document).ready(function() {
	  var widget = $('.dltabs');
	  var tabs = widget.find('.dltabs_tit a'),
		  content = widget.find('.dltabs_con > div');
	  tabs.on('click', function (e) {
		  e.preventDefault();
		  var index = $(this).data('index');
		  tabs.removeClass('tab-active');
		  content.removeClass('dltabs_con-active');
		  $(this).addClass('tab-active');
		  content.eq(index).addClass('dltabs_con-active');
	  });
 });

//tab切换
function tab_wndt(name,cursel,n){
 for(i=1;i<=n;i++){
  var menus=document.getElementById(name+i);  //褰撳墠li
  var cons=document.getElementById("dt_"+name+"_"+i);   //褰撳墠li瀵瑰簲鐨勫唴瀹筪iv
  var b=document.getElementById(name+"b"+i);
  menus.className=(i==cursel?"dtwn_select":"");
  b.style.display=(i==cursel?"block":"none");
  cons.style.display=(i==cursel?"block":"none");
 }
}
//个人中心切换
function tab_grzz(name,cursel,n){
 for(i=1;i<=n;i++){
  var menus=document.getElementById(name+i);  //当前li
  var cons=document.getElementById("dt_"+name+"_"+i);   //当前li对应的内容div
  menus.className=(i==cursel?"dtwn_select":"");
  cons.style.display=(i==cursel?"block":"none");
 }
}
//办约搜问二级不固定数量的tab切换
$(document).ready(function() {
    var widget = $('.ejnav');
    var tabs = widget.find('.ejnav_tit li a'),
        tabarr = widget.find('.ejnav_tit li b'),
        content = widget.find('.ejnav_con > .ejnav_eg');
    tabs.on('click', function (e){
        e.preventDefault();
        var index = $(this).data('index');
        tabs.removeClass('xuanz');
        content.removeClass('ejnavc_blo');
        tabarr.css("display","none");
        $(this).addClass('xuanz');
        content.eq(index).addClass('ejnavc_blo');
        tabarr.eq(index).css("display","block");
    });
});

//在线留言弹窗
function show(){
  document.getElementById("zxmsgbg").style.display="block";
  document.getElementById("zxmsg").style.display="block";}
function hid(){
  document.getElementById("zxmsgbg").style.display="none";
  document.getElementById("zxmsg").style.display="none";}
//群首页  通讯录特效
$(document).ready(function(){
	$(".txl ul li").hover(
	function(){
		$(this).css("background-color","#f4f4f4");
		$(this).find("a").css("display","block");
		},
	function(){
		$(this).css("background-color","");
		$(this).find("a").css("display","none");
	});
	
	
});
