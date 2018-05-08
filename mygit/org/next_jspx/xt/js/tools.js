window.console = window.console || (function(){ 
	var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){}; 
	return c; 
})(); 
/*功能：系统自定义功能函数集，主要包含常用的数据验证，系统窗体复写及其它功能（见具体函数说明）；
 *使用方法：在页面中写先引入jQuery文件，然后再引入该文件
 *版本：v1.0
 *创建人：chengyang
 *创建时间：2013/10/31
 *修改历史：
 *			
*/
_R_=parseInt(Math.random()*10000);
$(document).ready(function(){
	$(document).on("focus",":text[dv],textarea[dv]",function(){
		if($(this).val()==$(this).attr("dv")){
			$(this).attr("style","");
			$(this).val(""); 
		}
	}).on("blur",":text[dv],textarea[dv]",function(){
		if($(this).val()===""){
			$(this).attr("style","color:#000000");
			$(this).val($(this).attr("dv"));
		}
	});
	$(":text[dv],textarea[dv]").each(function(index,e){
		if($(this).val()===""){
			$(this).attr("style","color:#000000");
			$(this).val($(this).attr("dv"));
		}
	});
	try{
	$(":text[data-role='datebox']").mobiscroll({
           preset: 'datetime', //日期
           theme: 'jqm', //皮肤样式
           display: 'modal', //显示方式 
           mode: 'mixed', //日期选择模式
           dateFormat: 'yy-mm-dd', // 日期输出格式
           timeFormat: 'HH:ii:ss',
           dateOrder: 'yymmdd', //面板中日期排列格式
           setText: '确定', //确认按钮名称
           cancelText: '取消',//取消按钮名籍我
           dayText: '日', //面板中日文字
           monthText: '月', //面板中月文字
           yearText: '年', //面板中年文字
           endYear: 2020, //结束年份
           hourText: '时',
           minuteText: '分',
           secText: '秒',
           lang: 'zh' //语言
		}
	);
	
	$(":text[data-role='datefield']").mobiscroll({
           preset: 'date', //日期
           theme: 'jqm', //皮肤样式
           display: 'modal', //显示方式 
           mode: 'mixed', //日期选择模式
           dateFormat: 'yy-mm-dd', // 日期输出格式
           dateOrder: 'yymmdd', //面板中日期排列格式
           setText: '确定', //确认按钮名称
           cancelText: '取消',//取消按钮名籍我
           dayText: '日', //面板中日文字
           monthText: '月', //面板中月文字
           yearText: '年', //面板中年文字
           endYear: 2020, //结束年份
           hourText: '时',
           minuteText: '分',
           secText: '秒',
           lang: 'zh' //语言
		}
	);
/*	$("body").taphold(function(e){
		if(typeof(_page_)==="string"&&(_page_==="usolve"||_page_==="send"||_page_==="receive"||_page_==="other"||_page_==="create")){
			if(!(e.target.tagName==="INPUT"||e.target.tagName==="SPAN")){
				alert("ssss");
				location.href=basePath+"/auth/index.jspx";
			}
		}
	});*/
	}catch(e){}
	
	/*从for循环开始将样式为text的选择框转为文本框*/
	var select = $("select.text");
	for(var i=0;i<select.length;i++){
		_resetSelect(select.eq(i));
	}
});
window.toast=function(){
	var shortCutFunction = "warning";
    var title = arguments[0]?arguments[0]:"";
    var handle = null;
    var t;
    if(arguments[1]&&arguments[1]!=null){
    	if(typeof(arguments[1]) === "string"){
    		shortCutFunction = arguments[1];
    	}else if(typeof(arguments[1]) === "function"){
    		handle = arguments[1];
    	}else if(typeof(arguments[1]) === "object"){
    		if(arguments[1].type){
    			shortCutFunction = arguments[1].type;
    		}
    		if(arguments[1].handle){
    			handle = arguments[1].handle;
    		}
    	}
    }

    if(window.toastr){
		var msg = "";
		toastr.options = {
	                positionClass: 'toast-top-full-width',
	                onclick: null
	            }
	    $("#toastrOptions").text("Command: toastr["
	                    + shortCutFunction
	                    + "](\""
	                    + msg
	                    + (title ? "\", \"" + title : '')
	                    + "\")\n\ntoastr.options = "
	                    + JSON.stringify(toastr.options, null, 2)
	    );
	    toastr[shortCutFunction](msg, title);
	    if(handle != null){
	    	t = setInterval(function(){
		    	clearInterval(t);
	    		handle();
	    	},3000);
	    }
    }else{
    	layer.alert(title);
    	return;
    }
};
/*选择纳税人识别号*/
var commitNumber = 0;
function doNsrsbh(){
	var param = null;
	var handle = false;
	if(typeof(arguments[0])=="function"){
		handle = arguments[0];
	}else if("object"==typeof(arguments[0])){
		param = arguments[0];
	}
	if(typeof(arguments[1])=="function"){
		handle = arguments[1];
	}else if("object"==typeof(arguments[0])){
		param = arguments[1];
	}
	$.ajax({
		url:basePath+"/arc/findUserE.jspx?"+Math.random(),
		type: 'POST',
		dataType: 'XML',
		data:param,
		timeout: 50000,
		async:false,
		beforeSend: function() { 
		}, 
		complete:function(){
		},
		error:function(resp){
			toast(resp.responseText);
		},
		success: function(html){
			var data = new utype(html);
			if(data.code!=0){
				alert(data.message);
				return;
			}
			data = data.find("DATA");
			var size = data.length;
			if(size<1){
				alert("用户没有注册纳税人信息");
				return;
			}
			if(handle){
				var arr = [];
				if(size>1){
					for(var i=0;i<size;i++){
						var d = data.eq(i);
						var code = d.find("NSRSBH").text();
						var name = d.find("NSRMC").text();
						arr.push({'name':name,'code':code});
					}
				}else{
					data = data.eq(0);
					var code = data.find("NSRSBH").text();
					var name = data.find("NSRMC").text();
					if(param!=null && param.showOne===true){
						arr.push({'name':name,'code':code});
					}else{
						if(handle){
							handle(code);
							return;
						}
					}
				}
				var div = "<div style=\"OVERFLOW-Y: auto; OVERFLOW-X:hidden;height:200px;border:5px solid #E8E8E8\" class=\"dtzfbg ysptc\" id=\"popDiv1988\">"+
							"<div class=\"dtzf\">"+
				    		"<h1>当前用户下的纳税人信息。</h1><a href=\"#\" class=\"wq_close\"></a>"+
				        	"<div class=\"dtzf_con\">";
				for(var i=0;i<arr.length;i++){
				        	div+="<input type=\"radio\" name='nasdfasdwe121' value='"+arr[i].code+"'/><label>"+arr[i].name+"</label><br>";
				}
				        	div+="</div>"+
				        	"<input name=\"opt\" type=\"button\" id='asdweew1o98' value=\"选择\" class=\"bton1\" />&nbsp;&nbsp;&nbsp;"+
				        	"<input name=\"opt\" type=\"button\" id='asdweew1o97' value=\"取消\" class=\"bton2\" />"+
				    		"</div>"+
							"</div>";
				$("#popDiv1988").remove();
				$("body").append(div);
				$("#popDiv1988").show();
				$("#asdweew1o97").one("click",function(){
					$("#popDiv1988").remove();
				});
				$("#asdweew1o98").click(function(){
					if(commitNumber!=0){
						toast("不允许重复提交");
						return;
					}
					if(handle){
						var cks = $(":radio[name='nasdfasdwe121']:checked");
						if(cks.length<1){
							toast("请选择一个纳税人");
							return;
						}else{
							handle(cks.val(),cks.next().text());
							commitNumber=commitNumber+1;
						}
						return;
					}
				});
				
			}
		}
	});
}
function openChat(p){
	var type = "3";
	if(p.type)type = p.type;
	var objCode = "";
	if(p.objCode){
		objCode = p.objCode;
	}else{
		p.objCode = objCode;
	}
	var objName = "围群聊天室";
	if(p.objName){
		objName = p.objName;
	}else{
		p.objName = objName;
	}
	var appCode = "";
	if(p.appCode){
		appCode = p.appCode;
	}else{
		p.appCode = appCode;
	}
	var appDetail = "";
	if(p.appDetail){
		appDetail = p.appDetail;
	}else{
		p.appDetail = appDetail;
	}
	if(window.wqjs&&window.wqjs.startTalk){
		try{
			window.wqjs.startTalk(type,objCode,objName,appCode,appDetail);
		}catch(e){
			alert("聊天室启动失败");
		}
	}else{
		if(window.opener){
			if(window.opener.showDialogue){
				window.opener.showDialogue(type=="7"?"5":type,objCode,objName,(type=="5"||type=="7")?true:false,(type=="5"||type=="7")?true:false,appCode)
				if(window.opener.focus)window.opener.focus();
			}else{
				if(window.opener.parent&&window.opener.parent.showDialogue){
					window.opener.parent.showDialogue(type=="7"?"5":type,objCode,objName,!(type=="1"||type=="2")?true:false,true,appCode)
					if(window.opener.parent.focus)window.opener.parent.focus();
					
					//  if(Notification.permission==='granted'){
            		//	var notification = new Notification('您发起了咨询服务',{body:"您发起了咨询服务，请在原网页查看"});
			        //	}else{
			        //	if(Notification.requestPermission){
			        //        Notification.requestPermission();
			        //        new Notification('您发起了咨询服务',{body:"您发起了咨询服务，请在原网页查看"});
			        //    }
			       // }
				}
			}
		}else if(window.parent&&window.parent.startTalk){
			window.parent.startTalk(p);
		}else{
			alert("聊天室启动失败");
		}
	}
}
/*显示对话框*/
function showLightBox(contWidth,contHeight,msg){
	var ary = [document.body.scrollHeight,document.body.offsetHeight,document.body.clientHeight,window.screen.availHeight];
	var btmHeight = ary.sort(function(a,b){return b-a;})[0];
	if($.browser.version === '6.0'){
		$('select').hide();
	}
	var max = 1000; // ZIndex
	var b = document.getElementsByTagName("body")[0];
	var b1 = document.getElementById("LightBoxBtm");
		if(!b1){
			b1 = document.createElement("div");
			b1.id = 'LightBoxBtm';
			b1.style.zIndex = max + 1;
			b1.style.top = "120px";
			b1.style.left = "40%";
			b1.style.height = btmHeight + "px";
			b1.style.border ="2px solid #95b8e7";
			b1.style.width = "265px";
			b1.style.height = "57px";
			b1.style.background ="#fff";
			b1.style.position ="absolute";
			b1.oncontextmenu = function(){return false;}
			b.appendChild(b1);
		}else{
			$("#LightBoxBtm").show();
		}
	var b3 = document.getElementById("LightBoxBg");
		if(!b3){
			b3 = document.createElement("div");
			b3.id = 'LightBoxBg';
			b3.style.zIndex = "-1";
			b3.style.width = "100%";
			b3.style.height = "100%";
			b3.style.position ="absolute";
			b3.style.top = "0" + "px";
			b3.style.left = "0" + "px";
			b3.style.background ="#f3f8ff";
			b3.style.opacity =".8";
			b3.oncontextmenu = function(){return false;}
			b.appendChild(b3);
		}else{
			$("#LightBoxBg").show();
		}
	var b2 = document.getElementById("LightBoxCont");
		if(!b2){
			b2 = document.createElement("div");
			b2.id = 'LightBoxCont';
			b2.innerHTML = msg;
			b2.style.width = "211px";
			b2.style.padding ="10px 20px";
			b2.style.marginLeft = "auto";
			b2.style.marginRight = "auto";
			b2.style.height = contHeight + "px";
			b2.style.lineHeight = "35px"
			b2.style.background = "#fff";
			b2.style.fontSize = "16px";
			b2.style.zIndex = max + 2;
			b2.oncontextmenu = function(){return false;}
			b1.appendChild(b2);
			$("#LightBoxCont").prepend("<img style='float:left;' src='../images/loading.gif'/>");
		}else{
			$("#LightBoxCont").html(msg);
			$("#LightBoxCont").prepend("<img style='float:left;' src='../images/loading.gif'/>");
			$("#LightBoxCont").show();
			
		}
	
}

/*关闭对话框*/
function closeLightBox() {
	$("#LightBoxBtm,#LightBoxCont,#LightBoxBg").hide();
	if($.browser.version === '6.0'){
		$('select').show();
	}
}

/*显示对话框*/
function showLightBox_new(contWidth,contHeight,msg){
	var ary = [document.body.scrollHeight,document.body.offsetHeight,document.body.clientHeight,window.screen.availHeight];
	var btmHeight = ary.sort(function(a,b){return b-a;})[0];
	if($.browser.version === '6.0'){
		$('select').hide();
	}
	var max = 1000; // ZIndex
	var b = document.getElementsByTagName("body")[0];
	var b1 = document.getElementById("LightBoxBtm");
		if(!b1){
			b1 = document.createElement("div");
			b1.id = 'LightBoxBtm';
			b1.style.zIndex = max + 1;
			b1.style.top = "180px";
			b1.style.left = "35%";
			b1.style.height = btmHeight + "px";
			//b1.style.border ="2px solid #95b8e7";
			b1.style.width = "0px";
			b1.style.height = "0px";
			b1.style.background ="#fff";
			b1.style.position ="absolute";
			b1.oncontextmenu = function(){return false;}
			b.appendChild(b1);
		}else{
			$("#LightBoxBtm").show();
		}
	var b2 = document.getElementById("LightBoxCont");
		if(!b2){
			b2 = document.createElement("div");
			b2.id = 'LightBoxCont';
			b2.innerHTML = msg;
			b2.style.width = contWidth + "px"
			//b2.style.padding ="10px 20px";
			b2.style.marginLeft = "auto";
			b2.style.marginRight = "auto";
			b2.style.height = contHeight + "px";
			b2.style.lineHeight = "35px"
			b2.style.background = "#fff";
			b2.style.fontSize = "16px";
			b2.style.zIndex = max + 2;
			b2.oncontextmenu = function(){return false;}
			b1.appendChild(b2);
			//$("#LightBoxCont").prepend("<img style='float:left;' src='../images/loading.gif'/>");
		}else{
			$("#LightBoxCont").html(msg);
			//$("#LightBoxCont").prepend("<img style='float:left;' src='../images/loading.gif'/>");
			$("#LightBoxCont").show();
			
		}
	
}

/*关闭弹出层*/
function closeDiv(){
	document.getElementById('popDiv').style.display='none';
	}

/*显示对话框*/
function showLoading(){
	var info = "";
	if(arguments[0]){
		info = arguments[0];
		if(mobileAccess===true){
			$.mobile.showPageLoadingMsg("b",info,false);
		}
	}else{
		if(mobileAccess===true){
			$.mobile.showPageLoadingMsg("b",info,false);
		}
	}
}
/*格式化图片显示区域*/
function format(e){
	var arg = arguments[1];
	var ow = e.width;
	var oh = e.height;
	var rw = null;
	var rh = null;
	if(arg.width>0){
		rw = arg.width/ow;
	}
	if(arg.height>0){
		rh = arg.height/oh;
	}
	var width = ow;
	if(rw!=null){
		width = ow*rw;
	}else if(rh!=null){
		width = ow*rh;
	}
	var height = oh;
	if(rh!=null){
		height = oh*rh;
	}else if(rw!=null){
		height = oh*rw;
	}
	e.width = width;
	e.height = height;
}
/*关闭对话框*/
function hideLoading() {
	if(mobileAccess===true){$.mobile.hidePageLoadingMsg();}
}
/*
 *异步保存数据（含文件）
*/
window.ajax2=function(url,data){
	var success = null;
	var error = null;
	if(typeof(arguments[2])=="function"){
		success = arguments[2];
	}
	if(typeof(arguments[3])=="function"){
		error = arguments[3];
	}
	try {
		//showLoading();
		layerloading();
		var xhr = new XMLHttpRequest();
		xhr.open("post",url, true);
		xhr.setRequestHeader("RequestType","AJAX");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.onreadystatechange = function() {
			if(xhr.readyState==4){
				if (xhr.status == 200) {
					//hideLoading();
					layerCloseLoading();
					var flag = xhr.responseText;
					var ut = new utype(flag);
					if(ut.code!=0){
						if(error!=null){
							error(ut);
						}else{
							toast(ut.message);
						}
					}else{
						if(success!=null){
							success(flag);
						}
					}
				}else if(xhr.status == 500){
					//hideLoading();
					layerCloseLoading();
					var flag = xhr.responseText;
					try{
						var ut = new utype(flag);
						if(ut.code!=0){
							if(error!=null){
								error(ut);
							}else{
								toast(ut.message);
							}
						}
					}catch(e){
						toast(flag);
					}
				}else if(xhr.status == 404){
					//hideLoading();
					layerCloseLoading();
					toast("没有处理模块");
				}
			}
		};
		//执行发送表单数据
		xhr.send(data);
	} catch (e) {
		//hideLoading();
		layerCloseLoading();
	} 
}
/*自定义ajax实现，依赖jQuery。
 *主要作用在于设置请求头信息
*/
window.ajax=function(pac){
	if(!pac)return;
	var packet = {};
	if(!pac.url){
		packet.url='';
	}else{
		packet.url=pac.url;
	}
	if(!pac.method){
		packet.type='POST';
	}else{
		packet.type=pac.method;
	}
	if(!pac.dataType){
		packet.dataType='xml';
	}else{
		packet.dataType=pac.dataType;
	}
	if(!pac.data){
		packet.data={};
	}else{
		packet.data=pac.data;
	}
	if(!pac.timeout){
		packet.timeout=-1;
	}else{
		packet.timeout=pac.timeout;
	}
	if(pac.async===false)packet.async=pac.async;
	if(!pac.beforeSend){
		packet.beforeSend=function(request){
			request.setRequestHeader("RequestType","AJAX");
			window.status='Processing...';
			layerloading();
		};
	}else{
		packet.beforeSend=function(request){
			request.setRequestHeader("RequestType","AJAX");
			window.status='Processing...';
			pac.beforeSend(request);
			layerloading();
		};
	}
	packet.complete=function(request){
		request.setRequestHeader("RequestType","AJAX");
		window.status='Processing...';
		pac.beforeSend(request);
	};
	if(!pac.error){
		packet.error=function(data){
			if(data.status=="404") {
            	layer.alert( "对不起，请求路径找不到[404]，请联系运维！");
            }else if (data.status=="500") {
            	if(packet.dataType=="xml"){
					var ut = new utype(data.error().responseText);
					if(ut.code!=0){
						if((null==ut.message || ''==ut.message) && ut.code=='-999'){
							layer.alert("错误代码："+ut.code+"<Br>错误信息：用户登录信息已失效，请关闭当前窗口后重新登录！");
						}else{
							layer.alert("错误代码："+ut.code+"<Br>错误信息："+ut.message);
						}
					}else{
						layer.alert("对不起，程序运行出现错误，请联系运维!");
					}
				}else{
					layer.alert("对不起，程序运行出现错误，请联系运维!");
				}
            }else if(data.status=="200"){
            	layer.alert("对不起，程序运行出现错误，请联系运维!");
            }else {
            	layer.alert("对不起，程序运行出现错误，请联系运维!");
            }
		};
	}else{
		packet.error=function(err){
			pac.error(err);
		};
	}
	if(!pac.complete){
		packet.complete=function(){
			window.status='';
			layerCloseLoading();
		};
	}else{
		packet.complete=function(){
			window.status='';
			pac.complete();
			layerCloseLoading();
		};
	}
	if(pac.success){
		packet.success=pac.success;
	}
	$.ajax(packet);
};
function getContextPath(){
	if(typeof(basePath)=="undefined"){
		return "/WQOAApp1.0";
	}else{
		return basePath;
	}
}
var _imgs_em_ = ["\\[/呵呵\\]","\\[/嘻嘻\\]","\\[/哈哈\\]","\\[/可爱\\]","\\[/可怜\\]","\\[/挖鼻屎\\]","\\[/吃惊\\]","\\[/害羞\\]","\\[/挤眼\\]","\\[/闭嘴\\]","\\[/鄙视\\]","\\[/爱你\\]","\\[/泪\\]","\\[/偷笑\\]","\\[/亲亲\\]","\\[/生病\\]","\\[/太开心\\]","\\[/懒得理你\\]","\\[/右哼哼\\]","\\[/左哼哼\\]","\\[/嘘\\]","\\[/衰\\]","\\[/委屈\\]","\\[/吐\\]","\\[/打哈欠\\]","\\[/抱抱\\]","\\[/怒\\]","\\[/疑问\\]","\\[/馋嘴\\]","\\[/拜拜\\]","\\[/思考\\]","\\[/汗\\]","\\[/困\\]","\\[/睡觉\\]","\\[/钱\\]","\\[/失望\\]","\\[/酷\\]","\\[/花心\\]","\\[/哼\\]","\\[/鼓掌\\]","\\[/晕\\]","\\[/悲伤\\]","\\[/抓狂\\]","\\[/黑线\\]","\\[/阴险\\]","\\[/怒骂\\]","\\[/心\\]","\\[/伤心\\]","\\[/猪头\\]","\\[/好\\]","\\[/棒\\]","\\[/耶\\]","\\[/不要\\]","\\[/赞\\]","\\[/来\\]","\\[/弱\\]","\\[/蜡烛\\]","\\[/钟\\]","\\[/话筒\\]","\\[/蛋糕\\]"];
/*字符串扩展*/
String.prototype.endWith = function(str){	return new RegExp(str + "$").test(this);};
String.prototype.startWith = function(s) {	return (this.indexOf(s) === 0);};
String.prototype.replaceAll  = function(s1,s2){return this.replace(new RegExp(s1,"gm"),s2);};
String.prototype.replaceAll2  = function(){//取出特特殊字符
	return this.replace(new RegExp("{","gm"),"&#123").replace(new RegExp("\\|","gm"),"&#124").replace(new RegExp("}","gm"),"&#125");
};
String.prototype.replaceAll2_v  = function(){//取出特特殊字符
	return this.replace(new RegExp("{","gm"),"_1_2_3").replace(new RegExp("\\|","gm"),"_1_2_4").replace(new RegExp("}","gm"),"_1_2_5").replace(new RegExp("," , "gm"),"_1_2_6");
};
String.prototype.replaceAll1_v  = function(){//取出特特殊字符
	return this.replace(new RegExp("@","gm"),"_1_2_1").replace(new RegExp("\\^","gm"),"_1_2_2").replace(new RegExp("\\|","gm"),"_1_2_4");
};
String.prototype.trim = function(){return this.replace(/(^\s*)|(\s*$)/g,'');};
String.prototype.len = function() {return this.replace(/[^\x00-\xff]/g, "aa").length;};
String.prototype.onlyNum = function() {return this.replace(/\D+/g, '');};
String.prototype.isNum = function () {var patrn = /^\d+$/;return patrn.test(this);};
String.prototype.addslashes = function(){return this.replace(/(["\\\.\|\[\]\^\*\+\?\$\(\)])/g, '\\$1');};
String.prototype.emotions = function(){
	var v = this;
	for(var i=0;i<_imgs_em_.length;i++){
		v = v.replace(new RegExp(_imgs_em_[i],"gm"),"<img src=\""+basePath+"/images/emotions/"+(i+1)+".gif\" >");
	}
	return v;
}
/*定义StringBuffer*/
function StringBuffer(){this.data = [];}
StringBuffer.prototype.append = function(){this.data.push(arguments[0]);return this;};
StringBuffer.prototype.toString = function(){return this.data.join("");};
/*定义Map*/
Map=function(){this.clear();};
Map.prototype.clear=function(){this.data={};};
Map.prototype.add=function(n,v){this.data[n] = v;};
Map.prototype.findValueByName=function(n){return this.data[n];};
/*定义Set*/
Set=function(){this.clear();};
Set.prototype.clear=function(){this.data={};};
Set.prototype.add=function(n){this.data['K_'+n] = '';};
Set.prototype.remove=function(n){delete this.data['K_'+n];};
Set.prototype.toString=function(){var ret = "";for(var i in this.data){if(i.length>0){ret+=","+i.substring(2);}}ret = ret.substring(1);return ret};
Set.prototype.toArray=function(n){var arr = [];for(var i in this.data){arr.push(i.substring(2));}return arr;};
Set.prototype.contains=function(n){return typeof(this.data['K_'+n])!="undefined";};
/*取对象的绝对位置，大小尺寸*/
function Offset(e){
	var t = e.offsetTop;
	var l = e.offsetLeft;
	var w = e.offsetWidth;
	var h = e.offsetHeight-2;
	while(e=e.offsetParent){
		t+=e.offsetTop;
		l+=e.offsetLeft;
	}
	return {top : t,left : l,width : w,height : h};
}
/*获取事件*/
function getEvent(){
  if(document.all){
    return window.event;//如果是ie
  }
  func=getEvent.caller;
  while(func!=null){
    var arg0=func.arguments[0];
    if(arg0){
      if((arg0.constructor==Event || arg0.constructor ==MouseEvent)||(typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)){
          return arg0;
       }
    }
    func=func.caller;
  }
  return null;
}
//获取事件发生的对象
function getEl(){
  var evt=getEvent();
  var el=evt.srcElement || evt.target;
  return el;
}
/* 信息提示函数
 * 转入的参数格式必须为json格式
 * 参数格式{url:str_url,text:str_text,tget:str_tget,func:str_func} url为链接，text为文本,tget为窗口打开的方式,func为onclick方法名
 * 参数长度不限
 * 调用示例：tips({url:'/service/gotone/',text:'停机开机'},{url:'/service/gotone/',text:'解除黑名单'},{url:'/service/gotone/',text:'备卡激活'},{url:'/service/gotone/',text:'补卡SIM卡'})
 */
var tips_box; //存储信息提示对象的全局变量
function tips(){
	if( arguments.length==0||!document.body) return;//如果无参数和没有得到body 则返回
	tips_box = tips_box||document.createElement("div");
	tips_box.className = "tips";
	var sb =  new StringBuffer();
	sb.append('<div class="tipsbody"><ul>');
	for( var i=0,j=arguments.length;i<j;i++){
		sb.append('<li>');
		sb.append("<a href=\"" + arguments[i].url +"\""+" "+"target=\""+arguments[i].tget+"\""+" onclick=\""+arguments[i].func+"\""+">·"+ arguments[i].text + "</a>");
		sb.append('</li>');
	}
	sb.append('</ul><div style="clear: both;height:8px;"></div></div><div class="tipsfoot"></div>');
	tips_box.innerHTML = sb.toString();
	var ev = getEl();
	var offset = Offset(ev);
	var T = offset.top + 18;
	var L = offset.left + 18
	tips_box.style.top = T +"px";
	tips_box.style.left = L +"px";
	try{
		document.body.appendChild(tips_box);
	}
	catch(e){};
	function settipsTimeout(){
		tipstt = setTimeout(function(){
			if(tips_box){
				try{
						document.body.removeChild(tips_box);
					}catch(e){};
			}
		},500);
	}
	ev.onmouseout = settipsTimeout;
	try{
		if(tipstt){
			clearTimeout(tipstt);
		}
	}
	catch(e){};
	tips_box.onmouseover = function(){
		try{
			if(tipstt){
				clearTimeout(tipstt);
			}
		}
		catch(e){};
		tips_box.onmouseout = settipsTimeout;
	};
}
/*获取系统用户信息，弹出选择界面
 *第一个参数：名称（随便写）
 *第二个参数：选择回调函数
 *第三个参数：关闭回调函数
 */
PepInfo=function(){
	this.name = arguments[0];
	this.doChoose = arguments[1];
	this.doClose = arguments[2];
	this.init();
}
PepInfo.prototype.init=function(){
	if(!(this.name&&this.name!=null)){
		this.name="PEP_INFO15";
	}
	if(!(this.doClose&&this.doClose!=null)){
		this.doClose=null;
	}
	if(!(this.doChoose&&this.doChoose!=null)){
		this.doChoose=null;
	}
}
PepInfo.prototype.show=function(){
	THIS=this;
	ajax({
		url:getContextPath()+"/pages/common/GetPepInfo.jsp",
		data:{type:'box',name:THIS.name},
		async:false,
		dataType:'text',
		success:function(html){
			showLightBox(0,0,html);
			$("#btn_"+THIS.name).click(function(){
				var gh = $(":text[name='txt_gh_"+THIS.name+"']").val();
				var xm = $(":text[name='txt_xm_"+THIS.name+"']").val();
				var bmdm = $(":text[name='txt_bmdm_"+THIS.name+"']").val();
				var bmmc = $(":text[name='txt_bmmc_"+THIS.name+"']").val();
				ajax({
					url:getContextPath()+"/pages/common/GetPepInfo.jsp",
					data:{'operator':gh,'usrName':xm,'orgCode':bmdm,'orgName':bmmc},
					async:false,
					dataType:'xml',
					success:function(xml){
						var tr = $("#_pep_info_sel_"+THIS.name);
						tr.html("");
						var data = $(xml);
						var line = data.find("DATA_LIST>DATA");
						for(var i=0;i<line.length;i++){
							var ti = line.eq(i);
							var operator = ti.attr("operator");
							var usrName = ti.attr("usrName");
							var deptCode = ti.attr("deptCode");
							var deptName = ti.attr("deptName");
							var urange = ti.attr("urange");
							tr.append($("<tr><td><input type='checkbox' name='ck"+THIS.name+"' value='"+operator+"' usrName='"+usrName+"' urange='"+urange+"' deptCode='"+deptCode+"' deptName='"+deptName+"' ></td><td>"+operator+"</td><td>"+usrName+"</td><td>"+deptCode+"</td><td>"+deptName+"</td></tr>"));
						}
						tr.append("<tr><td colspan='5'><input type='button' class='button' value='确定' id='con"+THIS.name+"'>&nbsp;<input type='button' class='button' value='关闭' id='can"+THIS.name+"'></td></tr>")
						$("#con"+THIS.name).click(function(){
							if(THIS.doChoose==null){
								closeLightBox();
							}else{
								var ret = [];
								var cks = $(":checkbox[name='ck"+THIS.name+"']:checked");
								for(var k=0;k<cks.length;k++){
									var j = {};
									var ck = cks.eq(k);
									j.value=ck.attr("operator");
									j.operator=ck.attr("operator");
									j.usrName=ck.attr("usrName");
									j.urange=ck.attr("urange");
									j.deptCode=ck.attr("deptCode");
									j.deptName=ck.attr("deptName");
									ret.push(j);
								}
								if(THIS.doChoose(ret)){
									closeLightBox();
								}
							}
						});
						$("#can"+THIS.name).click(function(){
							if(THIS.doClose==null){
								closeLightBox();
							}else{
								var ret = [];
								var cks = $(":checkbox[name='ck"+THIS.name+"']:checked");
								for(var k=0;k<cks.length;k++){
									var j = {};
									var ck = cks.eq(k);
									j.value=ck.attr("operator");
									j.operator=ck.attr("operator");
									j.usrName=ck.attr("usrName");
									j.urange=ck.attr("urange");
									j.deptCode=ck.attr("deptCode");
									j.deptName=ck.attr("deptName");
									ret.push(j);
								}
								if(THIS.doClose(ret)){
									closeLightBox();
								}
							}
						});
					}
				});
			});
		}
	});
}
/*获取组织结构信息，输出组织树
 *第一个参数：默认组织代码
 *第二个参数：组织类型[1-组织，2-部门，3-所有]
 *第三个参数：起始组织代码
 *第四个参数：选择类型，1-不提供，2-单选，3-多选
 *第五个参数：选择按钮名称
 */
OrgTree=function(){
	this.fobj = arguments[0];
	this.defCode = arguments[1];
	this.type = arguments[2];
	this.fromOrg = arguments[3];
	this.mulChk = arguments[4];
	this.ckName = arguments[5];
	this.jglx=arguments[6];
	this.doClose = null;
	this.doChoose = null;
	this.doClear = null;
	this.init();
}
OrgTree.prototype.init=function(){
	if(!(this.type&&this.type!=null)){
		this.type=3;
	}
	if(!(this.mulChk&&this.mulChk!=null)){
		this.mulChk=1;
	}
	if(!(this.defCode&&this.defCode!=null)){
		this.defCode='';
	}
	if(!(this.fromOrg&&this.fromOrg!=null)){
		this.fromOrg='215000000';
	}
	if(!(this.ckName&&this.ckName!=null)){
		this.ckName='organization';
	}
	if(!(this.fobj&&this.fobj!=null))this.fobj=window.eveObj;
	this.durl=getContextPath()+"/pages/common/GetOrgInfo.jsp";
	if(_R_){
		_R_++;
		var tmp = $("div[id*='DD_org']");
		if(tmp.length>0){
			tmp.remove();
		}
	}else{
		_R_=0;
	}
	this.t_r=_R_;
	THIS=this;
	var pos = this.fobj.offset();
	this.div = null;
	this.div = $("<div id='DD_org"+this.t_r+"' class='popupContent' style='text-align:left;position:absolute;left:"+pos.left+"px;top:"+(pos.top+window.eveObj.height())+"px;background-color: white;border: 1px solid #889aa8;min-width:"+window.eveObj.width()+"'></div>").mouseover(function(){
		$("body").one("dblclick",function(){
			$("div[id^='DD_org']").remove();
		});
	});
	var bar = $("<div id='bar_34wesaodiw' style='cursor:hand;text-align:right;'></div>");
	bar.append($("<span id='_aewvp22s2_' style='border: 1px solid #889aa8;padding: 2px;'>确定</span>").click(function(){
		if(THIS.doChoose==null){
			$(this).parent().parent().remove();
		}else{
			var c = $("[name='"+THIS.ckName+"']:checked");
			var p;
			if(THIS.mulChk==2){
				c = c.eq(0);
				p={};
				p.code=c.val();
				p.name=c.next().text();
				p.level=c.attr("level");
				p.dept="true"==c.attr("dept");
			}else if(THIS.mulChk==3){
				p=[];
				for(var v=0;v<c.length;v++){
					var cc=c.eq(v);
					var oo={};
					oo.code=cc.val();
					oo.name=cc.next().text();
					oo.level=cc.attr("level");
					oo.dept="true"==c.attr("dept");
					p.push(oo);
				}
			}
			if(THIS.doChoose(p)){
				$(this).parent().parent().remove();
			}
		}
	}));
	bar.append($("<span style='padding-left: 20px;'></span>"));
	bar.append($("<span style='border: 1px solid #889aa8;padding: 2px;'>关闭</span>").click(function(){
		if(THIS.doClose==null){
			$(this).parent().parent().remove();
		}else{
			if(THIS.doClose()){
				$(this).parent().parent().remove();
			}
		}
	}));
	this.div.append(bar);
	this.curO = this.div;
	this.fobj.after(this.div);
}
OrgTree.prototype.load=function(node){
	if(THIS.doClear!=null){
		var bar = $("#bar_34wesaodiw");
		bar.append($("<span style='padding-left: 20px;'></span>"));
		bar.append($("<span style='border: 1px solid #889aa8;padding: 2px;'>清除</span>").click(function(){
			if(THIS.doClear()){
				$(this).parent().parent().remove();
			}
		}));
	}
	var mdata={};
	mdata.type=this.type;
	mdata.organization=this.defCode;
	mdata.fromOrg=this.fromOrg;
	mdata.mulChk=this.mulChk;
	mdata.jglx=this.jglx;
	THIS=this;
	ajax({
		url:this.durl,
		data:mdata,
		async:false,
		success:function(xml){
			var data = $(xml);
			if(data.find("RETURN_CODE").text()!="0"){
				alert(data.find("RETURN_MSG").text());
				return;
			}
			/*组织树处理，采用异步递归方式调用*/
			var t = data.find("Root>DATA");
			var code=t.attr("code");
			var name=t.attr("name");
			var chk=t.attr("check")=="1";
			var chd=t.attr("chd")*1;
			var dept=t.attr("dept");
			var flag=t.attr("flag");
			var level=t.attr("level");
			if(!flag){
				flag="1";
			}
			//alert(code+","+name+","+chk+","+chd)
			var li = null;
			if(!node){
				node = THIS.div;
				li = $("<li class='treeview'></li>");
				node.append(li);
				//li.append("<div class='hit expandable-hit'></div>");
				if(flag=="1"){
					switch(THIS.mulChk){
						case 2:
							li.append("<input type='radio' level='"+level+"' dept='"+dept+"' name='"+THIS.ckName+"' value='"+code+"' "+(chk?"checked='checked'":"")+">")
							break;
						case 3:
							li.append("<input type='checkbox' level='"+level+"' dept='"+dept+"' name='"+THIS.ckName+"' value='"+code+"' "+(chk?"checked='checked'":"")+">")
							break;
						default:
							
					}
				}
				li.append("<a href='javascript:;'>"+name+"["+code+"]"+"</a>");
			}else{
				li = node;
			}
			if(chd>0){
				var ul = $("<ul></ul>");
				var c = t.find(">DATA");
				for(var i=0;i<c.length;i++){
					var tt=c.eq(i);
					var code1=tt.attr("code");
					var name1=tt.attr("name");
					var chk1=tt.attr("check")=="1";
					var chd1=tt.attr("chd")*1;
					var dept1=tt.attr("dept");
					var flag=tt.attr("flag");
					var level=tt.attr("level");
					if(!flag){
						flag="1";
					}
					var li1 = $("<li></li>");
					if(chd1>0){
						li1.append($("<div class='hit expandable-hit' code='"+code1+"'></div>").toggle(function(){
							$(this).attr("class","hit collapse-hit");
							var n = $(this).parent().find(">ul");
							if(n.length<1){
								THIS.fromOrg=$(this).attr("code");
								THIS.load($(this).parent());
							}
							n.show();
						},function(){
							$(this).attr("class","hit expandable-hit");
							var n = $(this).parent().find(">ul");
							n.hide();
						}));
					}
					if(flag=="1"){
						switch(THIS.mulChk){
							case 2:
								li1.append($("<input type='radio' level='"+level+"' dept='"+dept1+"' name='"+THIS.ckName+"' value='"+code1+"' "+(chk1?"checked='checked'":"")+">").click(function(){
									$("#_aewvp22s2_").click();
								}));
								break;
							case 3:
								li1.append("<input type='checkbox' level='"+level+"' dept='"+dept1+"' name='"+THIS.ckName+"' value='"+code1+"' "+(chk1?"checked='checked'":"")+">");
								break;
							default:
								
						}
						li1.append($("<a href='javascript:;'>"+name1+"["+code1+"]"+"</a>").click(function(){
							var p = $(this).prev();
							if(p.is(":radio")){
								p.attr("checked",true);
							}else if(p.is(":checkbox")){
								if(p.is(":checked")){
									p.attr("checked",false);
								}else{
									p.attr("checked",true);
								}
							}
						}));
					}else{
						li1.append($("<a href='javascript:;'>"+name1+"["+code1+"]"+"</a>"));
					}
					ul.append(li1);
				}
				li.append(ul);
			}
			/*组织树处理结束*/
		}
	});
}
/*以下是基于TAG的分页JS*/
var current_page = 1;//当前页
//跳转至第N页
function pageJump(totalPage){
	var to = "";
	if(arguments[1]){
		to = arguments[1];
	}else{
		to = event.srcElement.value;
	}
	if(!isNaN(to)){
		var v = '1';
		if(to!='') v=to;
		if(to*1<=0||to*1>totalPage){
			alert('请输入正确的页码!');
			return;
			v=1;
		}
		current_page = v;
		getAjaxHtml()
	}else{
		alert(['请输入数字!']);
	}
}

//刷新当前页
function reloadPage(){
	getAjaxHtml();
}



//第一页
function first_page(){
	current_page = 1;
	getAjaxHtml();
}

//下一页
function next_page(pageCount,curPage){
	var pn = curPage;
	if (pn == "" || pn == null){
		var nextPage = 2;
	}else{
		var nextPage = curPage + 1;
	}
	if (nextPage > pageCount){
		alert('已到达最后一页');
		return;
		nextPage = pageCount;
	}
	current_page = nextPage;
	getAjaxHtml();
}

//上一页
function prev_page(curPage){
	var pn = curPage;
	if (pn == "" || pn == null){
		first_page();
		return;
	}
	var nextPage = curPage - 1;
	
	if (nextPage < 1){
		alert('已到达第一页');
		return;
		nextPage = 1;
	}
	current_page = nextPage;
	getAjaxHtml();
}

//最未页
function last_page(pageCount){
	current_page = pageCount;
	getAjaxHtml();
}

if(typeof(_URL_AJAX_)==="undefined"){
	_URL_AJAX_="";
}
//jQuery调用
function getAjaxHtml(){
	var params = "pn="+current_page;
	if($("#QueryForm").length<1){
		if($("form").length>0){
			params=params+'&'+$("form").serialize();
		}
	}else{
		params=params+'&'+$("#QueryForm").serialize();
	}
	$.ajax({
	url: _URL_AJAX_,
	type: 'GET',
	dataType: 'TEXT',
	data:params,
	timeout: -1,
	beforeSend: function(request) {
		request.setRequestHeader("RequestType","AJAX");
		window.status='Processing...';
		if(typeof(beforeSendHandle)==='function'){
			beforeSendHandle();
		}
	}, 
	complete:function(){
		window.status='';
		if(typeof(completeHandle)==='function'){
			beforeSendHandle();
		}
	},  
	error: function(){
		if(typeof(errorHandle)==='function'){
			beforeSendHandle();
		}
	},
	success: function(html){
		if(typeof(querySuccessHandle)==='function'){
			querySuccessHandle(html);
		}else{
			document.body.innerHTML=getBodyHtml(html);
		}
	}
});
}
function getBodyHtml(html){
	var s = html.indexOf('<tbody');
	if(s<1)s = html.indexOf('<body');
	var e = html.indexOf('</tbody>');
	if(e<1)e=html.indexOf('</body>');
	return html.substring(s,e);
}

/*假分页类
 *此分页方式适用于查询总行数不大且对数据更新不敏感的情况；
 *思路：
 *	1、先查询总记录数；
 *	2、根据总数进行相应的分页设置；
 *	3、查询记录行，返回的记录行为单页数乘缓存倍数；
 *	4、将返回数据设置到回调函数；
*/
function upage(){
	this.data=null;//数据
	this.pageSize=isNaN(arguments[0])?10:1*arguments[0];//单页显示行数
	this.pageNum=1;//当前页数
	this.totalPage=0;//总页数
	this.totalCount=0;//总记录数
	this.countUrl=null;//查询记录数URL
	this.countParam=null;
	this.dataUrl=null;//查询数据URL
	this.dataParam=null;
	this.pageCtrl=null;//显示分页的元素
	this.pageCtrlType=8;//分页样式
	this.indx=0;//弹出层下标
	this.cacheSize=isNaN(arguments[1])?10:1*arguments[1];//缓存的页数
	this.startCache=1;
	this.endCache=this.cacheSize;
	
	this.dataType="text";
	
	this.countHandle=null;//查询记录数的回调，需要在回调函数中设置总记录数
	this.queryHandle=null;//查询数据的回调，需要进行格式化数据
	this.displayHandle=null;//显示数据的回调
	this.nodataHandle=null;//没有数据的回调
	
	var THIS=this;
	
	this.setDataType=function(dataType){
		THIS.dataType=dataType;
	};
	this.setPageSize=function(pageSize){
		THIS.pageSize=pageSize;
	};
	this.setCacheSize=function(cacheSize){
		THIS.cacheSize=cacheSize;
		THIS.endCache=cacheSize;
	};
	this.setCountUrl=function(url){
		THIS.countUrl = url;
		if(arguments[1]){
			THIS.countParam=arguments[1];
		}
	};
	this.setDataUrl=function(url){
		THIS.dataUrl = url;
		if(arguments[1]){
			THIS.dataParam=arguments[1];
		}
	};
	this.setPageCtrl=function(e){
		if(typeof(e)==="string"){
			THIS.pageCtrl=$("#"+e);
		}else{
			THIS.pageCtrl=e;
		}
	};
	this.setPageCtrlType=function(e){
		THIS.pageCtrlType=e;
	};
	this.setCountHandle=function(func){//需要返回记录数
		THIS.countHandle=func;
	};
	this.setQueryHandle=function(func){//需要返回数据
		THIS.queryHandle=func;
	};
	this.setDisplayHandle=function(func){//函数具有三个参数[1:数据,2:起始位置,3:结束位置]
		THIS.displayHandle=func;
	};
	this.setHandles=function(funcs){
		if(funcs.countHandle)THIS.countHandle=funcs.countHandle;
		if(funcs.queryHandle)THIS.queryHandle=funcs.queryHandle;
		if(funcs.displayHandle)THIS.displayHandle=funcs.displayHandle;
		if(funcs.nodataHandle)THIS.nodataHandle=funcs.nodataHandle;
	};
	this.load=function(){
		if(THIS.countUrl==null){
			var f = {
				dataType:THIS.dataType,
				url:THIS.dataUrl,
				beforeSend:function(){
					this.indx=layer.load("数据正在加载中，请稍后...");
	        	},
	        	complete:function(){
	        		 layer.close(this.indx);
	        	},
				success:function(data){
					if(THIS.queryHandle!=null){
						THIS.queryHandle(data);
					}
				}
			};
			if(THIS.dataParam!=null){
				f.type="POST";
				f.data=THIS.dataParam;
			}
			ajax(f);
			return;
		}
		var f = {
			dataType:THIS.dataType,
			url:THIS.countUrl,
			beforeSend:function(){
					this.indx=layer.load("数据正在加载中，请稍后...");
	    	},
	    	complete:function(){
	    		  layer.close(this.indx);
	    	},
			success:function(data){
				if(THIS.countHandle!=null){
					THIS.totalCount=THIS.countHandle(data);
				}			
				if(THIS.totalCount<1){
					THIS.totalPage=0;
					if(THIS.nodataHandle)THIS.nodataHandle();
					//return;注释掉，否则依然显示上次查询结果
				}
				THIS.totalPage=(THIS.totalCount%THIS.pageSize==0)?THIS.totalCount/THIS.pageSize:Math.floor(THIS.totalCount/THIS.pageSize)+1;
				THIS.query();
			}
		};
		if(THIS.countParam!=null){
				f.type="POST";
				f.data=THIS.countParam;
		}
		ajax(f);
	};
	this.show=function(page){
		if(page<THIS.startCache){
			if(page%THIS.cacheSize===0){
				THIS.startCache=THIS.cacheSize*Math.floor(page/THIS.cacheSize)-THIS.cacheSize+1;
			}else{
				THIS.startCache=THIS.cacheSize*Math.floor(page/THIS.cacheSize)+1;
			}
			THIS.endCache=THIS.startCache+THIS.cacheSize-1;
			THIS.query();
			return;
			//alert(THIS.startCache+":"+page+":"+THIS.endCache)
		}else if(page>THIS.endCache){
			if(page%THIS.cacheSize===0){
				THIS.startCache=THIS.cacheSize*Math.floor(page/THIS.cacheSize)-THIS.cacheSize+1;
			}else{
				THIS.startCache=THIS.cacheSize*Math.floor(page/THIS.cacheSize)+1;
			}
			THIS.endCache=THIS.startCache+THIS.cacheSize-1;
			THIS.query();
			return;
			//alert(THIS.startCache+">"+page+">"+THIS.endCache)
		}
		if(THIS.displayHandle!=null){
			var start = ((THIS.pageNum-1)*THIS.pageSize+1)%(THIS.cacheSize*THIS.pageSize);
			var end = start+THIS.pageSize-1;
			if(end>THIS.totalCount)end=THIS.totalCount;
			THIS.displayHandle(THIS.data,start,end);
		}
	};
	this.query=function(){
		var start = (THIS.startCache-1)*THIS.pageSize+1;
		var end = THIS.endCache*THIS.pageSize;
		var _url_=THIS.dataUrl;
		if(THIS.dataParam==null){
			if(THIS.dataUrl.indexOf('?')>0)_url_+="&start="+start+"&end="+end;
			else _url_+="?start="+start+"&end="+end;
			ajax({
				dataType:THIS.dataType,
				url:_url_,
				beforeSend:function(){
					this.indx=layer.load("数据正在加载中，请稍后...");
	        	},
	        	complete:function(){
	        		 layer.close(this.indx);
	        	},
				success:function(data){
					if(THIS.queryHandle!=null){
						THIS.data=THIS.queryHandle(data);
					}
					THIS.showPage();
				}
			});
		}else{
			THIS.dataParam.start=start;
			THIS.dataParam.end=end;
			ajax({
				dataType:THIS.dataType,
				url:THIS.dataUrl,
				type:'POST',
				data:THIS.dataParam,
				beforeSend:function(){
					this.indx=layer.load("数据正在加载中，请稍后...");
	        	},
	        	complete:function(){
	        		 layer.close(this.indx);
	        	},
				success:function(data){
					if(THIS.queryHandle!=null){
						THIS.data=THIS.queryHandle(data);
					}
					THIS.showPage();
				}
			});
		}
	};
	this.showPage=function(){
		THIS.show(THIS.startCache);
		if(THIS.pageCtrl!=null){
			if(THIS.pageCtrlType==8){
				THIS.pageCtrl.html('');
				THIS.pageCtrl.append("共"+THIS.totalCount+"条数据");
				THIS.pageCtrl.append("&nbsp;");
				THIS.pageCtrl.append("每页"+THIS.pageSize+"条");
				THIS.pageCtrl.append("&nbsp;");
				THIS.pageCtrl.append("共"+THIS.totalPage+"页");
				THIS.pageCtrl.append("&nbsp;[");
				THIS.pageCtrl.append($("<a href='javascript:;'>首 页</a>").click(function(){
					THIS.pageNum=1;
					THIS.show(THIS.pageNum);
					THIS.pageCtrl.find(".curpage2015").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("]&nbsp;[");
				THIS.pageCtrl.append($("<a href='javascript:;'>上一页</a>").click(function(){
					if(THIS.pageNum<=1)return;
					THIS.pageNum=THIS.pageNum-1;
					THIS.show(THIS.pageNum);
					THIS.pageCtrl.find(".curpage2015").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("]&nbsp;[");
				THIS.pageCtrl.append($("<a href='javascript:;'>下一页</a>").click(function(){
					if(THIS.pageNum>=THIS.totalPage)return;
					THIS.pageNum=THIS.pageNum+1;
					THIS.show(THIS.pageNum);
					THIS.pageCtrl.find(".curpage2015").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("]&nbsp;[");
				THIS.pageCtrl.append($("<a href='javascript:;'>末 页</a>").click(function(){
					THIS.pageNum=THIS.totalPage;
					if(THIS.pageNum<1)return;
					THIS.show(THIS.pageNum);
					THIS.pageCtrl.find(".curpage2015").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("]&nbsp;当前第<span class='curpage2015'>"+THIS.pageNum+"</span>页");
			}else if(THIS.pageCtrlType==7){
				THIS.pageCtrl.html('共');
				THIS.pageCtrl.append(THIS.totalCount);
				THIS.pageCtrl.append("条&nbsp;");
				THIS.pageCtrl.append($("<a href='javascript:;'>上一页</a>").click(function(){
					if(THIS.pageNum<=1)return;
					THIS.pageNum=THIS.pageNum-1;
					THIS.show(THIS.pageNum);
					THIS.pageCtrl.find(".curpage2015").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("&nbsp;");
				THIS.pageCtrl.append($("<a href='javascript:;'>下一页</a>").click(function(){
					if(THIS.pageNum>=THIS.totalPage)return;
					THIS.pageNum=THIS.pageNum+1;
					THIS.show(THIS.pageNum);
					THIS.pageCtrl.find(".curpage2015").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("&nbsp;<span class='curpage2015'>"+THIS.pageNum+"</span>/"+THIS.totalPage);
				THIS.pageCtrl.append("&nbsp;跳转到：<input class=\"changepage2017\" type=\"text\"/>&nbsp;");
				THIS.pageCtrl.append("<a href='javascript:;'>GO</a>").click(function(){
					var changePageNum = $(".changepage2017").val();//获取要跳转的页数
					if(""==changePageNum){return;}
					if(!/^[0-9]*$/.test(changePageNum)){layer.msg("请输入数字页数")
					}else{
						changePageNum=parseInt(changePageNum);
						if(changePageNum>THIS.totalPage){
							layer.msg("超过最大页数");return;
						}
						if(changePageNum<1){
							layer.msg("超过最小页数");return;
						}
						THIS.pageNum=changePageNum;
						THIS.show(THIS.pageNum);
						THIS.pageCtrl.find(".curpage2015").text(THIS.pageNum);
						$(".changepage2017").val("");
					}
				})
			}
		}
	}
	
}



/*假分页类
 *此分页方式适用于查询总行数不大且对数据更新不敏感的情况；
 *思路：
 *	1、先查询总记录数；
 *	2、根据总数进行相应的分页设置；
 *	3、查询记录行，返回的记录行为单页数乘缓存倍数；
 *	4、将返回数据设置到回调函数；
*/
function upage1(){
	this.data=null;//数据
	this.pageSize=isNaN(arguments[0])?10:1*arguments[0];//单页显示行数
	this.pageNum=1;//当前页数
	this.totalPage=0;//总页数
	this.totalCount=0;//总记录数
	this.countUrl=null;//查询记录数URL
	this.countParam=null;
	this.dataUrl=null;//查询数据URL
	this.dataParam=null;
	this.pageCtrl=null;//显示分页的元素
	this.pageCtrlType=8;//分页样式
	
	this.cacheSize=isNaN(arguments[1])?10:1*arguments[1];//缓存的页数
	this.startCache=1;
	this.endCache=this.cacheSize;
	
	this.dataType="text";
	
	this.countHandle=null;//查询记录数的回调，需要在回调函数中设置总记录数
	this.queryHandle=null;//查询数据的回调，需要进行格式化数据
	this.displayHandle=null;//显示数据的回调
	this.nodataHandle=null;//没有数据的回调
	
	THIS=this;
	this.setDataType=function(dataType){
		THIS.dataType=dataType;
	};
	this.setPageSize=function(pageSize){
		THIS.pageSize=pageSize;
	};
	this.setCacheSize=function(cacheSize){
		THIS.cacheSize=cacheSize;
		THIS.endCache=cacheSize;
	};
	this.setCountUrl=function(url){
		THIS.countUrl = url;
		if(arguments[1]){
			THIS.countParam=arguments[1];
		}
	};
	this.setDataUrl=function(url){
		THIS.dataUrl = url;
		if(arguments[1]){
			THIS.dataParam=arguments[1];
		}
	};
	this.setPageCtrl=function(e){
		if(typeof(e)==="string"){
			THIS.pageCtrl=$("#"+e);
		}else{
			THIS.pageCtrl=e;
		}
	};
	this.setPageCtrlType=function(e){
		THIS.pageCtrlType=e;
	};
	this.setCountHandle=function(func){//需要返回记录数
		THIS.countHandle=func;
	};
	this.setQueryHandle=function(func){//需要返回数据
		THIS.queryHandle=func;
	};
	this.setDisplayHandle=function(func){//函数具有三个参数[1:数据,2:起始位置,3:结束位置]
		THIS.displayHandle=func;
	};
	this.setHandles=function(funcs){
		if(funcs.countHandle)THIS.countHandle=funcs.countHandle;
		if(funcs.queryHandle)THIS.queryHandle=funcs.queryHandle;
		if(funcs.displayHandle)THIS.displayHandle=funcs.displayHandle;
		if(funcs.nodataHandle)THIS.nodataHandle=funcs.nodataHandle;
	};
	this.load=function(){
		if(THIS.countUrl==null){
			var f = {
				async:false,
				dataType:THIS.dataType,
				url:THIS.dataUrl,
				beforeSend:function(){
					this.indx=layer.load("数据正在加载中，请稍后...");
	        	},
	        	complete:function(){
	        		 layer.close(this.indx);
	        	},
				success:function(data){
					if(THIS.queryHandle!=null){
						THIS.queryHandle(data);
					}
				}
			};
			if(THIS.dataParam!=null){
				f.type="POST";
				f.data=THIS.dataParam;
			}
			ajax(f);
			return;
		}
		var f = {
			async:false,
			dataType:THIS.dataType,
			url:THIS.countUrl,
			beforeSend:function(){
				this.indx=layer.load("数据正在加载中，请稍后...");
	    	},
	    	complete:function(){
	    		 layer.close(this.indx);
	    	},
			success:function(data){
				if(THIS.countHandle!=null){
					THIS.totalCount=THIS.countHandle(data);
				}
			}
		};
		if(THIS.countParam!=null){
				f.type="POST";
				f.data=THIS.countParam;
			}
		ajax(f);
		if(THIS.totalCount<1){
			THIS.totalPage=0;
			if(THIS.nodataHandle)THIS.nodataHandle();
			//return;注释掉，否则依然显示上次查询结果
		}
		THIS.totalPage=(THIS.totalCount%THIS.pageSize==0)?THIS.totalCount/THIS.pageSize:Math.floor(THIS.totalCount/THIS.pageSize)+1;
		THIS.query();
		THIS.show(1);
		if(THIS.pageCtrl!=null){
			if(THIS.pageCtrlType==8){
				THIS.pageCtrl.html('');
				THIS.pageCtrl.append("共"+THIS.totalCount+"条数据");
				THIS.pageCtrl.append("&nbsp;");
				THIS.pageCtrl.append("每页"+THIS.pageSize+"条");
				THIS.pageCtrl.append("&nbsp;");
				THIS.pageCtrl.append("共"+THIS.totalPage+"页");
				THIS.pageCtrl.append("&nbsp;[");
				THIS.pageCtrl.append($("<a href='javascript:;'>首 页</a>").click(function(){
					THIS.pageNum=1;
					THIS.show(THIS.pageNum);
					$("#curpage2015_").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("]&nbsp;[");
				THIS.pageCtrl.append($("<a href='javascript:;'>上一页</a>").click(function(){
					if(THIS.pageNum<=1)return;
					THIS.pageNum=THIS.pageNum-1;
					THIS.show(THIS.pageNum);
					$("#curpage2015_").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("]&nbsp;[");
				THIS.pageCtrl.append($("<a href='javascript:;'>下一页</a>").click(function(){
					if(THIS.pageNum>=THIS.totalPage)return;
					THIS.pageNum=THIS.pageNum+1;
					THIS.show(THIS.pageNum);
					$("#curpage2015").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("]&nbsp;[");
				THIS.pageCtrl.append($("<a href='javascript:;'>末 页</a>").click(function(){
					THIS.pageNum=THIS.totalPage;
					if(THIS.pageNum<1)return;
					THIS.show(THIS.pageNum);
					$("#curpage2015_").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("]&nbsp;当前第<span id='curpage2015_'>"+THIS.pageNum+"</span>页");
			}else if(THIS.pageCtrlType==7){
				THIS.pageCtrl.html('');
				THIS.pageCtrl.append(THIS.totalCount);
				THIS.pageCtrl.append("&nbsp;");
				THIS.pageCtrl.append($("<a href='javascript:;'>上一页</a>").click(function(){
					if(THIS.pageNum<=1)return;
					THIS.pageNum=THIS.pageNum-1;
					THIS.show(THIS.pageNum);
					$("#curpage2015_").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("&nbsp;");
				THIS.pageCtrl.append($("<a href='javascript:;'>下一页</a>").click(function(){
					if(THIS.pageNum>=THIS.totalPage)return;
					THIS.pageNum=THIS.pageNum+1;
					THIS.show(THIS.pageNum);
					$("#curpage2015_").text(THIS.pageNum);
				}));
				THIS.pageCtrl.append("&nbsp;<span id='curpage2015_'>"+THIS.pageNum+"</span>/"+THIS.totalPage);
			}
		}
	};
	this.show=function(page){
		if(page<THIS.startCache){
			if(page%THIS.cacheSize===0){
				THIS.startCache=THIS.cacheSize*Math.floor(page/THIS.cacheSize)-THIS.cacheSize+1;
			}else{
				THIS.startCache=THIS.cacheSize*Math.floor(page/THIS.cacheSize)+1;
			}
			THIS.endCache=THIS.startCache+THIS.cacheSize-1;
			THIS.query();
			//alert(THIS.startCache+":"+page+":"+THIS.endCache)
		}else if(page>THIS.endCache){
			if(page%THIS.cacheSize===0){
				THIS.startCache=THIS.cacheSize*Math.floor(page/THIS.cacheSize)-THIS.cacheSize+1;
			}else{
				THIS.startCache=THIS.cacheSize*Math.floor(page/THIS.cacheSize)+1;
			}
			THIS.endCache=THIS.startCache+THIS.cacheSize-1;
			THIS.query();
			//alert(THIS.startCache+">"+page+">"+THIS.endCache)
		}
		if(THIS.displayHandle!=null){
			var start = ((THIS.pageNum-1)*THIS.pageSize+1)%(THIS.cacheSize*THIS.pageSize);
			var end = start+THIS.pageSize-1;
			if(end>THIS.totalCount)end=THIS.totalCount;
			THIS.displayHandle(THIS.data,start,end);
		}
	};
	this.query=function(){
		var start = (THIS.startCache-1)*THIS.pageSize+1;
		var end = THIS.endCache*THIS.pageSize;
		var _url_=THIS.dataUrl;
		if(THIS.dataParam==null){
			if(THIS.dataUrl.indexOf('?')>0)_url_+="&start="+start+"&end="+end;
			else _url_+="?start="+start+"&end="+end;
			ajax({
				async:false,
				dataType:THIS.dataType,
				url:_url_,
				beforeSend:function(){
					this.indx=layer.load("数据正在加载中，请稍后...");
	        	},
	        	complete:function(){
	        		 layer.close(this.indx);
	        	},
				success:function(data){
					if(THIS.queryHandle!=null){
						THIS.data=THIS.queryHandle(data);
					}
				}
			});
		}else{
			THIS.dataParam.start=start;
			THIS.dataParam.end=end;
			ajax({
				async:false,
				dataType:THIS.dataType,
				url:THIS.dataUrl,
				beforeSend:function(){
					this.indx=layer.load("数据正在加载中，请稍后...");
	        	},
	        	complete:function(){
	        		 layer.close(this.indx);
	        	},
				type:'POST',
				data:THIS.dataParam,
				success:function(data){
					if(THIS.queryHandle!=null){
						THIS.data=THIS.queryHandle(data);
					}
				}
			});
		}
	}
}


/*XML服务参数
 *用于解析服务返回信息
*/
function utype(xml){
	if(!xml){
		alert("服务参数非法");
		return;
	}
	this.xml=null;
	if(typeof(xml)=="string"){//如果参数是字符串，由于使用的jQuery版本不支持，所以手动转XML
		var xd;
		if(document.all){//IE内核
			var ARR_ACTIVEX = ["MSXML4.DOMDocument","MSXML3.DOMDocument","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XmlDom"]; 
			var XmlDomflag = false; 
			for (var i = 0;i < ARR_ACTIVEX.length && !XmlDomflag ;i++) { 
				try { 
					xd = new ActiveXObject(ARR_ACTIVEX[i]); 
					XmlDomflag = true; 
				} catch (e) { 
				} 
			}
			xd.loadXML(xml.replace(/(^\s*)|(\s*$)/g,''));
			this.xml=$(xd);
		}else{//非IE内核
	　　		xd = new DOMParser().parseFromString(xml.replace(/(^\s*)|(\s*$)/g,''), "text/xml");
			this.xml=$(xd);
		}
	}else{
		this.xml = $(xml);
	}
	this.code=-999;
	if(/^[-]?\d+$/.test(this.xml.find("RETURN_CODE").text())){
		this.code = this.xml.find("RETURN_CODE").text()*1;
	}
	this.message=this.xml.find("RETURN_MSG").text();
	this.umessage=this.xml.find("USER_MESSAGE").text();
	this.getText=function(node){
		return this.xml.find(node).text();
	};
	this.getNumber=function(node){
		return this.getText(node)*1;
	};
	this.getTime=function(node){
		return getDateFromFormat(this.getText(node),'yyyy-MM-dd HH:mm:ss');
	};
	this.getUtype=function(node){
		return new utype(this.xml.find(node));
	};
	this.find=function(t){
		return this.xml.find(t);
	}
}
/*在标签页中打开连接*/
function openPage(link,title){
	var parent = window.top;
   	if(parent){
	   	var container = parent.container;
	   	if(container){
		   	if(container._addTab){
		    	container._addTab({link:link,title:title});
		    	return;
		   	}
	   	}
   	}
   	if(true==arguments[2]){
   		window.open(link);
   	}else{
   		location.href=link;
   	}
}


function closePage(title){
	var parent = window.top;
	if(parent){
	   	var container = parent.container;
	   	if(container){
		   	if(container._closeTab){
		    	container._closeTab({title:title});
		   	}
	   	}
   	}
}

/*在标签页中提交表达*/
function submitForm(form,title){
	var parent = window.top;
	var b = true;
   	if(parent){
	   	var container = parent.container;
	   	if(container){
		   	if(container._addTab){
		   		b = false;
		    	container._submitTab({form:form,title:title});
		    	return;
		   	}
	   	}
   	}
   	if(b){
   		form.submit();
   	}
}
/*以下是常用的表单元素校验规则*/
function forA2z($) {
	var A = /^[A-Za-z]+$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forA2Z($) {
	var A = /^[A-Z]+$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function fora2z($) {
	var A = /^[a-z]+$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forNumChar($) {
	var A = /^[A-Za-z0-9]+$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forAllChar($) {
	var A = /^\w+$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forPosInt($) {
	var A = /^[0-9]*[1-9][0-9]*$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forInt($) {
	var A = /^-?\d+$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forNonNegInt($) {
	var A = /^\d+$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forNegInt($) {
	var A = /^-[0-9]*[1-9][0-9]*$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forNotNegReal($) {
	var A = /^[0-9]+((\.{1}?[0-9]{1,13})|(\.{0}?[0-9]{0}))?$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forReal($) {
	var A = /^([-]{0,1})?[0-9]+((\.{1}?[0-9]{1,13})|(\.{0}?[0-9]{0}))?$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forPostCode($) {
	var A = /^[0-9]{1}(\d){5}$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forMail($) {
	var A = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forUrl($) {
	var A = /^http:\/\/[a-za-z0-9]+\.[a-za-z0-9]+[\/=\?%\-&_~`@[\]\’:+!]*([^<>\"\"])*$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forTel($) {
	var A = /^[+]{0,1}((0(\d{2}))?([-]{0,1})([1-9]\d{7})|(0(\d{3}))?([-]{0,1})([1-9]\d{6,7}))$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forPhone($) {
	var A = /^[+]{0,1}(\d{3,4})?([-]{0,1})?(\d{7,8})+$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function forMobil(obj) {
	var patrn = /^(([1][3][456789])|([1][5][01236789])|([1][8][7])|([1][8][8])|([1][4][7])|([1][8][2])|([1][8][3]))\d{8}$/;
	var sInput = obj;
	if (sInput.search(patrn) == -1) {
		return false;
	}
	return true;
}

function for619num(obj) {
	var patrn = /^(([6][123456789]))\d{4}$/;
	var sInput = obj;
	if (sInput.search(patrn) == -1) {
		return false;
	}
	return true;
}
function forTT(obj)
{
	var patrn = /^((03)|(04))\d{8}\d$/;
	var sInput = obj;
	if(sInput.search(patrn)==-1){
		return false;
	}
	return true;
}
function forIdCard(C) {
	var F = new Array(
			"",
			"号码位数不对!",
			"号码出生日期超出范围或含有非法字符!",
			"号码校验错误!",
			"地区非法!"), G, E, _, $, B, A = C.v_name;
	if (A == null)
		A = "";
	var G = C, D = new Array();
	D = G.split("");
	switch (G.length) {
	case 15:
		if ((parseInt(G.substr(6, 2)) + 1900) % 4 == 0
				|| ((parseInt(G.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(G
						.substr(6, 2)) + 1900) % 4 == 0))
			ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;
		else
			ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;
		if (ereg.test(G))
			return true;
		else {
			//alert(A + F[2]);
			return false
		}
		break;
	case 18:
		if (parseInt(G.substr(6, 4)) % 4 == 0
				|| (parseInt(G.substr(6, 4)) % 100 == 0 && parseInt(G.substr(6,
						4)) % 4 == 0))
			ereg = /^[1-9][0-9]{5}(19|20|21)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
		else
			ereg = /^[1-9][0-9]{5}(19|20|21)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;
		if (ereg.test(G)) {
			$ = (parseInt(D[0]) + parseInt(D[10])) * 7
					+ (parseInt(D[1]) + parseInt(D[11])) * 9
					+ (parseInt(D[2]) + parseInt(D[12])) * 10
					+ (parseInt(D[3]) + parseInt(D[13])) * 5
					+ (parseInt(D[4]) + parseInt(D[14])) * 8
					+ (parseInt(D[5]) + parseInt(D[15])) * 4
					+ (parseInt(D[6]) + parseInt(D[16])) * 2 + parseInt(D[7])
					* 1 + parseInt(D[8]) * 6 + parseInt(D[9]) * 3;
			E = $ % 11;
			B = "F";
			_ = "10X98765432";
			B = _.substr(E, 1);
			if (D[17] == "x")
				D[17] = "X";
			if (B == D[17])
				return true;
			else {
				//alert(A + F[3]);
				return false
			}
		} else{
			//alert(A + F[2]);
		}
		return false;
		break;
	default:
		//alert(A + F[1]);
		return false
	}
}
function formatAsMoney($) {
	$ -= 0;
	$ = (Math.round($ * 100)) / 100;
	return ($ == Math.floor($)) ? $ + ".00"
			: (($ * 10 == Math.floor($ * 10)) ? $ + "0" : $)
}
function forMoney(A, B) {
	var $ = A;
	if (B == null)
		B = 0;
	$.toString().replace(/\$|\,/g, "");
	var _ = "";
	if (A.v_name != null)
		_ = A.v_name;
	if (isNaN($)) {
		alert(_
				+ "输入格式有误，请重新输入！");
		A.select();
		return false
	}
	if (B == 0 && $ < 0) {
		alert(_
				+ "输入金额不能为负数，请重新输入！");
		A.select();
		return false
	}
	if (B == -1 && $ > 0) {
		alert(_
				+ "输入金额不能为正数，请重新输入！");
		A.select();
		return false
	}
	A.value = formatAsMoney($);
	return true
}
function forDate(_) {
	var $ = _, B = "yyyy-MM-dd", A = getDateFromFormat($, B);
	if (A == 0)
		return false;
	return true
}
function compareDates(D, _) {
	var B = D, $ = D.v_format, F = _, E = _.v_format, A = getDateFromFormat(
			B, $), C = getDateFromFormat(F, E);
	if (A == 0)
		return -1;
	else if (C == 0)
		return -2;
	else if (A > C)
		return 1;
	return 0
}
function LZ($) {
	return ($ < 0 || $ > 9 ? "" : "0") + $
}
function _isInteger(_) {
	var A = "1234567890";
	for ( var $ = 0; $ < _.length; $++)
		if (A.indexOf(_.charAt($)) == -1)
			return false;
	return true
}
function _getInt(D, $, C, _) {
	for ( var B = _; B >= C; B--) {
		var A = D.substring($, $ + B);
		if (A.length < C)
			return null;
		if (_isInteger(A))
			return A
	}
	return null
}
function getDateFromFormat(_, O) {
	_ = _ + "";
	O = O + "";
	var F = 0, K = 0, B = "", D = "", M = "", N, J, G = new Date(), H = G
			.getYear(), $ = G.getMonth() + 1, E = 1, A = G.getHours(), C = G
			.getMinutes(), L = G.getSeconds();
	while (K < O.length) {
		B = O.charAt(K);
		D = "";
		while ((O.charAt(K) == B) && (K < O.length))
			D += O.charAt(K++);
		if (D == "yyyy") {
			N = 4;
			J = 4;
			H = _getInt(_, F, N, J);
			if (H == null)
				return 0;
			F += H.length
		} else if (D == "MM") {
			$ = _getInt(_, F, D.length, 2);
			if ($ == null || ($ < 1) || ($ > 12))
				return 0;
			F += $.length
		} else if (D == "dd") {
			E = _getInt(_, F, D.length, 2);
			if (E == null || (E < 1) || (E > 31))
				return 0;
			F += E.length
		} else if (D == "HH") {
			A = _getInt(_, F, D.length, 2);
			if (A == null || (A < 0) || (A > 23))
				return 0;
			F += A.length
		} else if (D == "mm") {
			C = _getInt(_, F, D.length, 2);
			if (C == null || (C < 0) || (C > 59))
				return 0;
			F += C.length
		} else if (D == "ss") {
			L = _getInt(_, F, D.length, 2);
			if (L == null || (L < 0) || (L > 59))
				return 0;
			F += L.length
		} else if (_.substring(F, F + D.length) != D)
			return 0;
		else
			F += D.length
	}
	if (F != _.length)
		return 0;
	if ($ == 2)
		if (((H % 4 == 0) && (H % 100 != 0)) || (H % 400 == 0)) {
			if (E > 29)
				return 0
		} else if (E > 28)
			return 0;
	if (($ == 4) || ($ == 6) || ($ == 9) || ($ == 11))
		if (E > 30)
			return 0;
	var I = new Date(H, $ - 1, E, A, C, L);
	return I.getTime()
}
function forIp($) {
	var A = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/, _ = $;
	if (_.search(A) == -1)
		return false;
	return true
}
function isKeyNumberdot(_) {
	var $ = (navigator.appname == "Netscape") ? event.which : event.keyCode;
	if (_ == 0) {
		if ($ >= 48 && $ <= 57)
			return true;
		else
			return false
	} else if (($ >= 48 && $ <= 57) || $ == 46)
		return true;
	else if ($ == 45) {
		alert("不允许输入负值,请重新输入!");
		return false
	} else
		return false
}
function checkLength(C) {
	var A = null, _ = null, B = null, D = null, $;
	for ($ = 0; $ < C.length; $++) {
		A = C.elements[$];
		_ = A.v_name;
		v_length = A.maxLength;
		D = A.v_maxlength;
		if ((D != 10000) && (A.type == "text" || A.type == "password"))
			if (A.value.trim().len() != 0
					&& A.value.trim().len() > parseInt(v_length)) {
				alert( _ + "输入信息超长，请重新输入! ", 0);
				A.select();
				return false
			}
	}
}
function forFloatPre(A, B) {
	var C = parseInt(A.v_preci), $ = A.value;
	if (B == null)
		B = 0;
	$.toString().replace(/\$|\,/g, "");
	var _ = "";
	if (A.v_name != null)
		_ = A.v_name;
	if (isNaN($)) {
		alert(_ + "输入格式有误，请重新输入！");
		A.select();
		return false
	}
	if (B == 0 && $ < 0) {
		alert(_ + "输入浮点数不能为负数，请重新输入！");
		A.select();
		return false
	}
	if (B == -1 && $ > 0) {
		alert(_ + "输入浮点数不能为正数，请重新输入！");
		A.select();
		return false
	}
	A.value = parseFloat(A.value).toFixed(C);
	return true
}
function checkPhone(_) {
	var $ = /^[0][1-9]{2,3}-[0-9]{5,10}$/, A = /^[1-9]{1}[0-9]{5,8}$/;
	if (_.length > 9) {
		if ($.test(_))
			return true;
		else
			return false
	} else if (A.test(_))
		return true;
	else
		return false
}
function checkMobile(A) {
	var $ = /^[1][0-9]{10}$/, _ = new RegExp($);
	if (_.test(A))
		return true;
	else
		return false
}
function checklength($) {
	var _ = "";
	if ($.type == "text" || $.type == "password") {
		if (typeof ($.v_maxlength) != "undefined")
			_ = $.v_maxlength;
		else if (typeof ($.maxLength) != "undefined")
			_ = $.maxLength;
		else
			return true;
		if ($.value.trim().len() > _) {
			alert("[" + $.v_name + "]长度超过" + _ + ",请重新输入");
			return false
		}
	}
	return true
}
function checkNumber(B, _) {
	var A, $;
	for ($ = 0; $ < B.length; $++) {
		A = B.charAt($);
		if (isNaN(A) || (A == " ")) {
			alert(_ + "必须是数字，请您检查后重新输入! ");
			B = "";
			return false
		}
	}
	if (B == "") {
		alert(_ + "不能为空，请您检查后重新输入! ");
		return false
	}
	return true
}
function isMobileNum(A) {
	var _, $;
	if (A == "") {
		alert("手机号码不能为空，请您检查后重新输入! ");
		return false
	}
	for ($ = 0; $ < A.length; $++) {
		_ = A.charAt($);
		if (isNaN(_) || (_ == " ")) {
			alert("手机号码必须是数字，请您检查后重新输入! ");
			return false
		}
	}
	if (A.length == 11)
		return true;
	else {
		alert("必须是11位的手机号码，请您检查后重新输入! ");
		return false
	}
}
function areAllDecDigits(A) {
	var _, $;
	for ($ = 0; $ < A.length; $++) {
		_ = A.charAt($);
		if (isNaN(_) || (_ == " "))
			return false
	}
	return true
}
function isLengthOf(val,min,max)
{
	var minlen = parseInt(min);
	var maxlen = parseInt(max);
	if (!isNaN(maxlen)){
	  if (val.len()> maxlen){
	    return false;
	  }
	}
	if (!isNaN(minlen)){
	  if (val.len() < minlen){
			return false;
		}
	}
	return true;
}
function isSizeOf(val,min,max){
    var maxval = parseFloat(max);
	var minval = parseFloat(min);
	var selval = parseFloat(val);
	if (isNaN(selval)){
	  return false;
	}
	if (!isNaN(maxval)){
	  if (selval > maxval){
	    return false;
	  }
	}
	if (!isNaN(minval)){
	  if (selval < minval){
	    return false;
	  }
	}
	return (true);
}
/*获取默认打印机*/
function getDefaultPrinter(){
	try{
		
		var nt = new ActiveXObject("WScript.Shell"); 
		var printerValue=nt.RegRead("HKEY_CURRENT_USER\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Windows\\Device");
		var printer=printerValue.split(',');
		return printer[0];
	}catch(e){
		return "";
	}
}

//屏蔽textarea的回车事件，使得回车不换行
function checkEnter(e){
	var et=e||window.event;
	var keycode=et.charCode||et.keyCode; 
	if(keycode==13){
		if(window.event)
			window.event.returnValue = false;
		else
			e.preventDefault();//for firefox
	}
}


	var arryidx; 
   function  layerloading() {
		var tidx=layer.load("数据正在加载中，请稍后...");
		arryidx=tidx;
		return tidx;
   }
   
   function layerCloseLoading(tidx){
   	   if(tidx){
	   	layer.close(tidx);
   	   }else{
   	   	layer.close(arryidx);
   	   	console.log("调用关闭方法全局变量arryidx="+arryidx);
   	   }
   }
  
   function checkIsImge(filename){
 	 var reg=/[\w\W]+\.(jpg|gif|bmp|png|jpeg)/;
 	 return  reg.test(filename.toLowerCase())
   }
   
   //
document.onkeydown = function () {
    if (window.event && window.event.keyCode == 8) {
    	//判断是否是元素获取焦点
    	if(document.activeElement && document.activeElement.tagName && ( document.activeElement.tagName.toLocaleLowerCase() =="input" || 
    	document.activeElement.tagName.toLocaleLowerCase() =="textarea")){
    		return true;
    	}
    	 if(window.event){
                   window.event.returnValue = false;
    	 }else{
                    e.preventDefault();
    	 }
    	 return false;
    }
}
   

/*重置选择框*/
function _resetSelect(sel){
	var ex = sel.attr("v_r");
	if(ex>0){
		$(":text[v_r='"+ex+"']").remove();
		$("div [id='D"+ex+"']").remove();
		$("ul [id='U"+ex+"']").remove();
	}
	_R_++;
	sel.attr("v_r",_R_);
	var pat = sel.attr("pattern");
	var len = sel.attr("tlength");
	var opt = sel.find("option[value!='']");
	var l = opt.length;
	var txt = $("<input type='text' v_r='"+_R_+"' name='"+sel.attr("name")+"_txt' style='height: 36px;width: 385px;border: 1px #0077ff solid;color:#666;font-size:15px;line-height: 36px;'>");//创建一个文本框
	var div = $("<div id='D"+_R_+"'></div>");//创建一个div显示
	var nop = $("<ul id='U"+_R_+"'></ul>");
	var closeDiv = $("<div style='text-align:right;cursor:pointer;font-size: 15px;' onclick='liClkClose("+_R_+")'>关闭</div>");
	if(l>=1){
		nop.append(closeDiv);
	}
	var num=0;var heightStr;
	for(var j=0;j<l;j++){
		if(opt.eq(j).val()!==""){
			var temp1 = opt.eq(j).text();
			nop.append($("<li seld='false' val='"+opt.eq(j).val()+"' onclick='liClk(this,"+_R_+")' style='min-width:220px;margin-bottom: 0px;height: 32px;line-height: 32px;display:block;'><p style='height:18px;display:block;white-space:nowrap;font-size:15px;margin-bottom:3px;text-align: left;margin-top: 5px;'>"+temp1+"</p></li>").hover(function(){
				$(this).attr("seld","true");
				$(this).children("p").attr("style","height:32px;line-height: 32px;display:block;white-space:nowrap;font-size:15px;margin-bottom:3px;background-color:#3367ca;text-align: left;margin-top: 5px;color:#fff;");
			},function(){
				$(this).attr("seld","false");
				$(this).children("p").attr("style","height:18px;display:block;white-space:nowrap;font-size:15px;margin-bottom:3px;text-align: left;margin-top: 5px;");
			}));
		}
		++num;
	}
	//计算DIV高度
	if(num==1){
		heightStr=60;
	}else if(num>=2&&num<=5){
		heightStr=200;
	}else if(num>=6){
		heightStr=320;
	}
	
	div.append(nop);
	if(pat!=undefined&&pat.length>0){
		txt.attr("pattern",pat);
	}
	if(len!=undefined&&len.length>0){
		txt.attr("size",len);
	}
	txt.keyup(function(){
		var at = $(this).attr("v_r");
		var v = $(this).val();
		var nop1 = $("#U"+at)
		if(v===""){
			nop1.children().show();
			return;
		}
		nop1.children().hide();
		var lis=nop1.find("li[val*='"+v+"'],li:contains('"+v+"')");
		if(lis.length<1){
			return;
		}
		if(lis.length===1){
			$("select[v_r='"+at+"']").val(lis.attr("val"));
		}
		lis.show();
	});
	txt.focus(function(){
		var pos1 = $(this).offset();
		var div1 = $("#D"+$(this).attr("v_r"));
		var leftStr;
		
		if(Number(pos1.left)+Number(div1.width())>=document.body.scrollWidth){
			leftStr=(document.body.scrollWidth-Number(div1.width()))-(document.body.scrollWidth-Number(pos1.left)-Number($(this).width()));
		}else{
			leftStr=pos1.left;
		}
		div1.attr("style","display:none;position:absolute;border: 1px solid #889aa8;overflow:auto;background-color: white;width:385px;top:"+(pos1.top+$(this).height()+1)+"px;height:"+heightStr+"px;");
		div1.show();
	});
	sel.hide();
	sel.before(txt);
	div.attr("style","display:none;");
	txt.after(div);
}

function liClk(obj,at){
	var a  = $(obj).attr("val");
	var b  = $(obj).text();
	$("#D"+at).hide();
	$(":text[v_r='"+at+"']").val(b);
	var sel1=$("select[v_r='"+at+"']");
	sel1.val(a);
    sel1.change();
}


function liClkClose(at){
	$("#D"+at).hide();
}


//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function banBackSpace(e){   
     var ev = e || window.event;//获取event对象   
     var obj = ev.target || ev.srcElement;//获取事件源   
     var t = obj.type || obj.getAttribute('type');//获取事件源类型  
     //获取作为判断条件的事件类型
     var vReadOnly = obj.getAttribute('readonly');
     //处理null值情况
     vReadOnly = (vReadOnly == "") ? false : vReadOnly;
     //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
     //并且readonly属性为true或enabled属性为false的，则退格键失效
     var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea") 
                 && vReadOnly=="readonly")?true:false;
     //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
     var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
                 ?true:false;        
     
     //判断
     if(flag2){
         return false;
     }
     if(flag1){   
         return false;   
     }   
 }
 
 window.onload=function(){
     //禁止后退键 作用于Firefox、Opera
     document.onkeypress=banBackSpace;
     //禁止后退键  作用于IE、Chrome
     document.onkeydown=banBackSpace;
 }