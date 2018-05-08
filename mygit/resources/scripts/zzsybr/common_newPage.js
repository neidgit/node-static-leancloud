var Pub_SBPath = "C:\\AISINO_NSSB";
var Pub_sfjz = 0;
var zzsYbjcData = "";
var gdzcbz = "";//所得税固定资产标志。
var noSave = "";
var tzsid = "";
var PubCheckMsg = "";
var ifSbca717Print = "";
var myInput;
var ifJzBdwj = "";//是否加载本地文件  是：Y
var timeStamp = new Date().getTime();  //时间戳
$(window).unload(function(){
	if("noSave"!=noSave)
		SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,2);
});
/*Number.prototype.toFixed = function(s){  
	return (parseInt(this*Math.pow(10,s)+0.5)/Math.pow(10,s)).toString();  
} */ 
//数字格式输入时加两位小数
$(document).on("change",".number",function(){
	var d = $(this).val();
	var num = parseFloat(d).toFixed(2);
	if (isNaN(num) || num == 0) {
		$(this).val("");
	} else {
		$(this).val(num);
	}
//$(this).css("background-color", "#FFFFCC");
});
$(document).on("change",".number0",function(){
	var d = $(this).val();
	var num = parseInt(d);
	if (isNaN(num) || num == 0) {
		$(this).val("");
	} else {
		$(this).val(num);
	}
	//$(this).css("background-color", "#FFFFCC");
});
$(document).on("change",".number3",function(){
	var d = $(this).val();
	var num = parseFloat(d).toFixed(3);
	if (isNaN(num) || num == 0) {
		$(this).val("");
	} else {
		$(this).val(num);
	}
	//$(this).css("background-color", "#FFFFCC");
});
$(document).on("change",".number4",function(){
	var d = $(this).val();
	var num = parseFloat(d).toFixed(4);
	if (isNaN(num) || num == 0) {
		$(this).val("");
	} else {
		$(this).val(num);
	}
	//$(this).css("background-color", "#FFFFCC");
});
$(document).on("change",".number6",function(){
	var d = $(this).val();
	var num = parseFloat(d).toFixed(6);
	if (isNaN(num) || num == 0) {
		$(this).val("");
	} else {
		$(this).val(num);
	}
	//$(this).css("background-color", "#FFFFCC");
});
$(document).on("change",".number10",function(){
	var d = $(this).val();
	var num = parseFloat(d).toFixed(10);
	if (isNaN(num) || num == 0) {
		$(this).val("");
	} else {
		$(this).val(num);
	}
	//$(this).css("background-color", "#FFFFCC");
});
//lpp 纳税人识别号，校验
$(document).on("change",".nsrsbh_Jy",function(){
	var d = $(this).val();
	var reg = /^[0-9a-zA-Z]{15,20}$/;
	if (!reg.test(d)) {
		alert("输入的纳税人识别号不符合规则,或位数不对！");
	}
});
//lpp 20171228 处理税率栏次的校验，不能大于1.
$(document).on("change",".sl_Jy",function(){
	var d = $(this).val();
	if (d > 1) {
		alert("请输入正确的税率或比例！");
		$(this).val("");
	}
});
$(document).on("click","input[type='button']",function(){
	if(new Date().getTime() - timeStamp > 600000){//10min
		timeStamp = new Date().getTime();
		$.ajax({
			   type: "POST",
			   url: contextPath+"/zzsYbrInit.do",
			   async: false,data: {method: "sayHello",timeStamp:timeStamp}});
	} 
});
//加减行逻辑
$(document).on("click",".addBtn",function() {// 加号按钮
		var $tbody = $(this).parent().parent().parent().parent().parent();
		var append = $tbody.find(".append").html();
		var insert="<tr>"+append+"</tr>";	
		var wz= $tbody.find(".insertBefore");
		
		$(insert).insertBefore(wz);
		var btnId = $(this).attr("id");
			//添加事件(附表8)
		switch(btnId){
		case "JSXMMX-ADD":
			if(bddm=="SB00212"){
				fb8_js_add(wz);
			}else if(bddm=="SB00112"){
				fb8_js_lc();
			}
			break;
		case "MSXMMX-ADD":
			if(bddm=="SB00212"){
				fb8_ms_add(wz);
			}else if(bddm=="SB00112"){
				fb8_js_lc();
			}
			break;
		case "CBFHDNCP-ADD":
			fb10_lc();
			break;
		case "TRCCFHDNCP-ADD":
			fb11_lc();
			break;
		case "GJNCPSC-ADD":
			fb12_lc();
			break;
		case "GJNCPXS-ADD":
			fb13_lc();
			break;
		case "SFFXCSB_MX-ADD":
			if(bddm=="SB00112")
				fb14_lc();
			break;
		case "FZJGXSSRMX-ADD":
			break;
		case "CPYSL-ADD":
			fb19_lc();
			break;
		case "CPY-ADD":
			fb18_lc();
			break;
		case "XXSE_CDD-ADD":
			fb20_xxse_lc();
			break;
		case "JXSE_CDD-ADD":
			fb20_jxse_lc();
			break;
		case "HKYS_QDJXSE-ADD":
			fb21_lc();
			break;
		case "DLQY_XX-ADD":
			fb22_lc();
			break;
		case "DLQY_JX-ADD":
			fb22_lc();
			break;
		case "DXQY_QDJXSE-ADD":
			fb25_lc();
			break;
		case "DKDJDKQD-ADD":
			fb26_lc();
			break;
		case "YZQY_QDJXSE-ADD":
			fb23_lc();
			break;
		case "TLYSQY_QDJXSE-ADD":
			fb24_lc();
			break;
		case "HZXMMX-ADD":
			sb00213_lc();
			break;
		case "ylfb3-ADD"://消费税烟类附表三
			sb00301_fb3Lc();
			break;
		case "ylfb4-ADD"://消费税烟类附表四。
			sb00301_fb4Lc();
			break;
		case "cpyfb2-ADD"://消费税成品油附表二
			sb00304_fb2Lc();
			break;
		case "cpyfb3-ADD"://消费税成品油附表三
			sb00304_fb3Lc();
			break;
		case "cpyfb4-ADD"://消费税成品油附表四
			sb00304_fb4Lc();
			break;
		case "jlfb4-ADD"://消费税酒类附表四。
			sb00303_fb4Lc();
			break;
		case "qtfb2-ADD"://消费税其他附表二。
			sb00306_fb2Lc();
			break;
		case 'SKDKTZ-ADD':
			gongshi_skdktz_R15();
			break;
		case "ylpffb1-ADD"://消费税卷烟附表一。
			sb00302_fb1Lc();
			break;
		case 'NBBMXX-ADD'://所得税关联关系
			gongshi_sb00916_200qynbxx();
			break;
		case 'GJGLRXX-ADD'://所得税关联关系
			gongshi_sb00916_200qyglry();
			break;
		case '107000RR-ADD':
			sb00916_G1070001();
			break;
		case '107000RC-ADD':
			sb00916_G1070002();
			break;
		case '101000-ADD':
			gongshi_sb00916_G101000glgx();
			break;
		case '112000JWGL-ADD':
			gongshi_sb00916_G112000JWGL();
			break;
		case '9010-ADD':
			gongshi_9010_xgrowSpan();
			break;
		case "7020MX1-ADD":
			gongshi_7020MX1_xgrowSpan();
			break;
		case "7020MX2-ADD":
			gongshi_7020MX2_xgrowSpan();
			break;
		case "7020MX3-ADD":
			gongshi_7020MX3_xgrowSpan();
			break;
		case "7020MX4-ADD":
			gongshi_7020MX4_xgrowSpan();
			break;
		case "7020MX5-ADD":
			gongshi_7020MX5_xgrowSpan();
			break;
		case "7020MX6-ADD":
			gongshi_7020MX6_xgrowSpan();
			break;
		case "7020MX7-ADD":
			gongshi_7020MX7_xgrowSpan();
			break;
		} 
});
$(document).on("click",".minusBtn",function() {// 减号按钮
	var i = 0;
	var $tbody = $(this).parent().parent().parent().parent().parent();
	var check = $tbody.find("input[name='a']");
	$(check).each(function() {
		if ($(this).prop("checked")) {
			i += 1;
		}
	});
	if (i == 0) {
		alert("请勾选要删除的项目！");
		return;
	}
	var btnId = $(this).attr("id");
	if ("CPBBY-DEL,CPBLJ-DEL".indexOf(btnId) >=0 || confirm("确认删除选中信息吗？")) {
		$(check).each(function() {

			if ($(this).prop("checked")) {
				$(this).parent().parent().remove();
				//添加事件(附表8)
				switch(btnId){
				case "JSXMMX-DEL":
					fb8_js_lc();
					break;
				case "MSXMMX-DEL":
					fb8_ms_lc();
					break;
				case "CBFHDNCP-DEL":
					fb10_lc();
					break;
				case "TRCCFHDNCP-DEL":
					fb11_lc();
					break;
				case "GJNCPSC-DEL":
					fb12_lc();
					break;
				case "GJNCPXS-DEL":
					fb13_lc();
					break;
				case "SFFXCSB_MX-DEL":
					fb14_lc();
					break;
				case "FZJGXSSRMX-DEL":
					break;
				case "CPYSL-DEL":
					fb19_lc();
					break;
				case "CPY-DEL":
					fb18_lc();
					break;
				case "XXSE_CDD-DEL":
					fb20_xxse_lc();
					break;
				case "JXSE_CDD-DEL":
					fb20_jxse_lc();
					break;
				case "HKYS_QDJXSE-DEL":
					fb21_lc();
					break;
				case "DLQY_XX-DEL":
					fb22_lc();
					break;
				case "DLQY_JX-DEL":
					fb22_lc();
					break;
				case "DXQY_QDJXSE-DEL":
					fb25_lc();
					break;
				case "DKDJDKQD-DEL":
					fb26_lc();
					break;
				case "YZQY_QDJXSE-DEL":
					fb23_lc();
					break;
				case "TLYSQY_QDJXSE-DEL":
					fb24_lc();
					break;
				case "HZXMMX-DEL":
					sb00213_lc();
					break;
				case "ylfb3-DEL"://消费税烟类附表三
					sb00301_fb3Lc();
					break;
				case "ylfb4-DEL"://消费税烟类附表四。
					sb00301_fb4Lc();
					break;
				case "cpyfb2-DEL"://消费税成品油附表二
					sb00304_fb2Lc();
					break;
				case "cpyfb3-DEL"://消费税成品油附表三
					sb00304_fb3Lc();
					break;
				case "cpyfb4-DEL"://消费税成品油附表四
					sb00304_fb4Lc();
					break;
				case "jlfb4-DEL"://消费税酒类附表四。
					sb00303_fb4Lc();
					break;
				case "qtfb2-DEL"://消费税其他附表二。
					sb00306_fb2Lc();
					break;
				case "ylpffb1-DEL"://消费税卷烟附表一。
					sb00302_fb1Lc();
					break;
				case 'NBBMXX-DEL'://所得税关联关系
					gongshi_sb00916_200qynbxx();
					break;
				case 'GJGLRXX-DEL'://所得税关联关系
					gongshi_sb00916_200qyglry();
					break;
				case '107000RR-DEL':
					sb00916_G1070001();
					break;
				case '107000RC-DEL':
					sb00916_G1070002();
					break;
				case '101000-DEL':
					gongshi_sb00916_G101000glgx();
					break;
				case '112000JWGL-DEL':
					gongshi_sb00916_G112000JWGL();
					break;
				case '9010-DEL':
					gongshi_9010_xgrowSpan();
					break;
				case "7020MX1-DEL":
					gongshi_7020MX1_xgrowSpan();
					break;
				case "7020MX2-DEL":
					gongshi_7020MX2_xgrowSpan();
					break;
				case "7020MX3-DEL":
					gongshi_7020MX3_xgrowSpan();
					break;
				case "7020MX4-DEL":
					gongshi_7020MX4_xgrowSpan();
					break;
				case "7020MX5-DEL":
					gongshi_7020MX5_xgrowSpan();
					break;
				case "7020MX6-DEL":
					gongshi_7020MX6_xgrowSpan();
					break;
				case "7020MX7-DEL":
					gongshi_7020MX7_xgrowSpan();
					break;
				}  
			}
		});
		$tbody.find(".insertBefore").prev().find('td .number').trigger('change');
	}
});

$(document).on("click",".addInfoBtn",function() {// 填写明细按钮
	var btnId = $(this).attr("id");
	switch(btnId){
	case "112000JWGL-TXMXBTN"://关联关系--112000JWGL
		addInfo_Glgx_112000JWGL();
		break;
	case "JCXXMX1-TXMXBTN"://所得税年报-受控外国企业
		addInfo_SBCM717_SKWGQY();
		break;
	case "ZCHZTSXCL-TXMXBTN"://所得税年报-居民企业资产（股权）划转特殊性税务处理申报表
		addInfo_SBCM717_JMQYZC();
		break;
	case "QYCZMXB-TXMXBTN"://所得税年报-企业重组
		addInfo_SBCM717_QYCZSDS();
		break;
	}
});

function loadData2Html(expBddm, xmlText){
	if(expBddm!=bddm+":"+nsrsbh && bddm!=expBddm){
		return 2;
	}
	$("#initCellXml").text("");
	$("#initCellXml").text(xmlText);
	initGdIDXml(xmlText,false);
	return 1;
}
//lpp 20180102 外部调用，触发计算。
function loadData2Html_inter(expBddm, xmlText){
	if(expBddm!=bddm+":"+nsrsbh && bddm!=expBddm){
		return 2;
	}
	$("#initCellXml").text("");
	$("#initCellXml").text(xmlText);
	initGdIDXml(xmlText,false);
	//触发全表计算。
	allTab_change(true);
	return 1;
}

//lpp 20180102 全表计算，触发所有公式计算。
function allTab_change(flag){
	if(!flag) return;
	$("input[class^='number']").each(function(){
		$(this).trigger("change");
	});
}
//初始化固定ID数据
//iFlag是否触发change事件。true:是，false:否。
function initGdIDXml(xml,iFlag){
	//获取初始化的变量
	var xmlDoc = $.parseXML(xml);
	
	var x = $(xmlDoc).find("Root RecID");
	//根据id获取单元格进行赋值
	for (i=0;i<x.length;i++){
		var sTableName = x[i].getAttribute("TableName");
		var iRow = parseInt(x[i].getAttribute("Row"));
		var iCountField = x[i].childNodes.length;
		for(j=0;j<iCountField;j++){
			var sNodeName = x[i].childNodes[j].nodeName;
			var sNodeText = x[i].childNodes[j].text;
			var id = sTableName+"-"+sNodeName+"-"+iRow;
			if((sNodeText == "0" || sNodeText == "0.0" || sNodeText == "0.00") && ($Map("#"+id+"").attr("class") == "number0" || $Map("#"+id+"").attr("class") == "number")){
				sNodeText = "";
			}
			$Map("#"+id+"").val(sNodeText);
			
			//lpp 判断如果该ID是为了select准备的，需要同时给后面的select赋值。
			if($Map("#"+id+"").attr("class") == "changeSelect"){
				$Map("#"+id+"").next().val(sNodeText);
			}
			//lpp 20170830 用于所得税固定资产的插入，触发change事件，计算公式。lpp 20180101,外部调用的时候，如果有值才触发，否则不触发change.
			if(iFlag && sNodeText.length > 0 && sNodeText != "0" && sNodeText != "0.0" && sNodeText != "0.00"){
				$Map("#"+id+"").trigger("change");
			}
			//lpp 20171009 所得税单选按钮类型的单独处理，是否小微企业。
			if($Map("#"+id+"").attr("type") == "radio" && sNodeText == 1){
				$Map("#"+id+"").attr("checked",true); 
			}
			//lpp 20180118 核选框类型初始化。
			if($Map("#"+id+"").attr("type") == "checkbox" && sNodeText == 1){
				$Map("#"+id+"").attr("checked",true); 
			}
		}
	}
}
//初始化加减明细行数据
function initJjMxXml(){
	var xml = $("#initCellXml").text();
	var xmlDoc = $.parseXML(xml);
	var x = $(xmlDoc).find("Root RecID");
	//根据id获取单元格进行赋值
	for (i=0;i<x.length;i++){
		//初始化明细行。&&&&&&&&&&&
		var sTableName = x[i].getAttribute("TableName");
		if(sTableName=="CPBLJ")
		var iRow = x[i].getAttribute("Row");
		var iCountField = x[i].childNodes.length;
		//lpp 修改为通用情况，不止限于一般人几张表。
		var $add = $Map("#"+sTableName+"-ADD");
		if($add.length != 0) {
		/*if(sTableName == "JSXMMX" || sTableName == "MSXMMX" || sTableName == "SFFXCSB_MX" || sTableName == "CPY" || sTableName == "CPYSL" 
			|| sTableName == "CBFHDNCP" || sTableName == "TRCCFHDNCP" || sTableName == "GJNCPXS" || sTableName == "GJNCPSC" || sTableName == "DKDJDKQD-FB5"
			|| sTableName == "XXSE_CDD" || sTableName == "JXSE_CDD" || sTableName == "HKYS_QDJXSE" || sTableName == "DLQY_XX" || sTableName == "DLQY_JX"
			|| sTableName == "YZQY_QDJXSE" || sTableName == "TLYSQY_QDJXSE" || sTableName == "DXQY_QDJXSE" || sTableName == "FZJGXSSRMX" ||sTableName == "HZXMMX"){*/
			//lpp 20170928 消费税酒类附表一，单独处理，从第5行开始新增。
			if(sTableName == "jlfb1pj" && iRow<5){
				continue;
			}
			$("#"+sTableName+"-ADD").trigger("click");
			//var wz=$("tr[id='"+sTableName+"-insertBefore']");
			var wz=$add.parents().find("tr[class='insertBefore']");
			
			for(j=0;j<iCountField;j++){
				var sNodeName = x[i].childNodes[j].nodeName;
				var sNodeText = x[i].childNodes[j].text;
				if(sNodeText == "0" || sNodeText == "0.0" || sNodeText == "0.00"){
					sNodeText = "";
				}
				wz.prev().find("input[name='"+sTableName+"-"+sNodeName+"']").val(sNodeText);
				wz.prev().find("select[name='"+sTableName+"-"+sNodeName+"']").val(sNodeText);
//				if(sTableName == "SFFXCSB_MX" && sNodeName == "XM"){
//					$("tr td select[name='SFFXCSB_MX-XM']").trigger("change");
//				}
				//lpp 20171009 所得税单选按钮类型的单独处理，是否小微企业。
				if(wz.prev().find("input[name='"+sTableName+"-"+sNodeName+"']").attr("type") == "radio" && sNodeText == 1){
					wz.prev().find("input[name='"+sTableName+"-"+sNodeName+"']").attr("checked",true); 
				}
				//lpp 20180118 核选框类型初始化。
				if(wz.prev().find("input[name='"+sTableName+"-"+sNodeName+"']").attr("type") == "checkbox" && sNodeText == 1){
					wz.prev().find("input[name='"+sTableName+"-"+sNodeName+"']").attr("checked",true); 
				}
			}
		}
	}
}

$(document).on("focus","input:not([readonly=readonly],[disabled=disabled])",function(e){
    $(e.target).addClass("focus");
    $("input:not(:focus)").removeClass("focus");
});
$(document).on("keyup", ".notCHN",function(){				
	var str=this.value;
	str=str.replace(/[\u4e00-\u9fa5]/ig,"");
	this.value=str;
});
$(document).on("keydown","input",function(e){		
//	e.preventDefault();
	var key = e.keyCode;// 定义按键
	if (key == 13) {// 回车事件
		var nextIndex = myInput.index(this)+ 1;
		myInput.eq(nextIndex).focus();     				
	}
});

//保存文件   Flag=0：保存，1：申报成功 ， 2：临时保存
function SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,Flag) {
	//所得税年报保存时需要再运行一下主表公式。
	if(bddm == "SBCM717")gongshi_zb();
	var bddmPath = Pub_SBPath +"\\"+ bddm;
	var filePath = Pub_SBPath +"\\"+ bddm +"\\" + bddm + "_" + nsrsbh + "_" + sssqq + "_" + sssqz + "_pre.dat";
	if(Flag == 1)
		filePath = Pub_SBPath +"\\"+ bddm +"\\" + bddm + "_" + nsrsbh + "_" + sssqq + "_" + sssqz + "_OK.dat";
	var fileInfo = cellData();
	$.ajax({
		   type: "POST",
		   url: contextPath+"/zzsYbrInit.do",
		   dataType : "json",
		   async: false,
		   data: {
				actID: "zip",
				data: cellData(),
				method: "zipData"
		   },
		   success: function(data){
				var fso = new ActiveXObject("Scripting.FileSystemObject");
				if(!fso.FolderExists(Pub_SBPath))
					fso.CreateFolder(Pub_SBPath);
				if(!fso.FolderExists(bddmPath))
					fso.CreateFolder(bddmPath);
				var file = fso.CreateTextFile(filePath, true);
				file.Write(data.zipString);
				if(Flag == 0)
					alert("数据保存成功！");
				file.Close();
		   }
		   });
}
var initXmlVar = "";
//判断是否存在本地文件。
function IfHaveFile(nsrsbh,sssqq,sssqz,bddm){
	//判断是否有本地保存的文件
 	var strPath = Pub_SBPath + '\\' + bddm;
 	var strTemp = bddm + "_" + nsrsbh+"_"+sssqq+"_"+sssqz+"_pre.dat";
 	var Rtn = 0;
	var fso = new ActiveXObject("Scripting.FileSystemObject");   
	if(fso.FileExists(strPath+"\\"+strTemp)){   
	  Rtn=2;
	}
	if(Rtn==0){
		strTemp = bddm + "_" + nsrsbh+"_"+sssqq+"_"+sssqz+"_pre.TXT";
		if(fso.FileExists(strPath+"\\"+strTemp)){	Rtn=1;}
		if(Rtn==0){
			strTemp = bddm + "_" + nsrsbh+"_"+sssqq+"_"+sssqz+".dat";
			if(fso.FileExists(strPath+"\\"+strTemp)){	Rtn=3;}
		}
	}
	//lpp 20171031 重点税源需要加载已申报数据，单独处理。如果本地有_ok文件，就直接加载，如果有_pre文件就取消加载。
	if(bddm == "ZDSY100" || menuId.substring(0,1) == "8"){
		strTemp = bddm + "_" + nsrsbh+"_"+sssqq+"_"+sssqz+"_OK.dat";
		if(fso.FileExists(strPath+"\\"+strTemp)){   
			Rtn=4;
		}
	}
	//lpp end

 	if(Rtn==1||Rtn==2||Rtn==3 || Rtn==4) {
 		var truthBeTold;
 		if(bddm == "ZDSY100"){
 			if(Rtn==4){
 				truthBeTold = true;
 			}else{
 				truthBeTold = window.confirm("您本地保存的数据不是已提交的报表，是否要加载本地数据？");
 				strTemp = bddm + "_" + nsrsbh+"_"+sssqq+"_"+sssqz+"_pre.dat";
 			}
 		}else if(menuId.substring(0,1) == "8"){
 			if(bddm == "FQDQ100" || bddm == "WHSY100"){
 				var sbgz = window.confirm("是否确认更正本申报表？");
 				if(sbgz){
 					$.ajax( {
 						type : "POST",
 						url : contextPath + "/DeleteSb.do",
 						dataType : "json",
 						async : false,
 						data : {
 							act : "deletesb",
 							nsrsbh : nsrsbh,
 							pzxh : pzxh,
 							bddm: bddm,
 							zspmDm: zspmDm,
 							sssqq : sssqq,
 							sssqz : sssqz
 						},
 						success : function(data) {
 							if (data.RET_CODE == "100") {
 								alert("作废成功！");
 								if(Rtn==4)
 									truthBeTold = window.confirm("你有本地保存的已作废的报表数据，要加载吗？");
 							} else {
 								alert(data.RET_MSG);
 							}
 						}
 					});
 				}else{
 					ret_userinfo();
 					return false;
 				}
 			}else{
 				if(Rtn==4)
 					truthBeTold = window.confirm("你有本地保存的上次已申报的报表数据，要加载吗？");
 			}
 		}else{
 			truthBeTold = bddm=="HGWS001" || ifSbca717Print == "Y" || window.confirm("你有本地保存的上次未申报的报表数据，要加载吗？");
 		}
 		
	 	if (!truthBeTold) {
	 		nbtaxDeleteMyFile(strPath+"\\"+strTemp);  //删除本地保存的报表			
	 	}else{	
	 		if(menuId.substring(0,1) == "8" && bddm != "FQDQ100" && bddm.substring(0,6) != "CWBB00"){
	 			ret_sbgzid();
	 		}
	 		//首先加载固定id数据。
	 		var ts = fso.OpenTextFile(strPath+"\\"+strTemp,ForReading);
	 		initXmlVar= ts.ReadAll();
	 		ifJzBdwj = "Y";//加载本地文件标志。
			return true;
		}
 	}
 	return false;
}
//调申报更正的初始化接口获得数据
function ret_sbgzid(){
	$.ajax({
		type: "POST",
		url: contextPath + "/ajaxDo.do",
		dataType: "json",
		data: {
			method:"initCellXml",
			bddm : bddm,
			sssqq : sssqq,
			sssqz : sssqz
		},
		success: function(data){
			if(!data.success){
				alert(data.err_msg);
			}
		}
	});
}
//返回主页面
function ret_userinfo(){
	window.close();
	$("#nav",top.document)[0].contentWindow.clickTree("11");
}

//打印
var printHtml;
function preview() {
	var sId = $("#selectFb select").val();
	printHtml = $("#"+sId).html();
	var url= contextPath+"/sb/zzsybr/print.jsp?"+new Date().getTime();
    window.open(url,"newwindowtoprint","depended=yes,resizable=yes,scrollbars=yes");  
}

//获取cell报文
function cellData(){
	var cellXml = "";
	if(bddm == "SBCM717"){//所得税SBCM717拼进SBCA717的报文
		cellXml = sbca717cell.replace("</Root>", "<RecID>");
	} else {
		cellXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Root><RecID>";
	}
	var lastName,lastRow,lastColumn,numbRow;
	rowMap = {};
	$("#tablePages div table tr td input,textarea").each(function(){
		var id = $(this).attr("id");
		var name = $(this).attr("name");
		var tClass = String($(this).attr("class"));
		
		if(tClass.indexOf("copy") != -1)
		{
			var td_val = $(this).parent().text();
			$Map("#"+id+"").val(td_val);
		}
		if(id != undefined){
			var val = $Map("#"+id+"").val();
			if(val == "" && tClass.indexOf("number") != -1){
				val = "0.00";
			}else if(val == "*" && tClass.indexOf("number") != -1){
				val = "0.00";
			}
			//单选按钮单独处理。
			if($(this).attr("type") == "radio"){
				if($(this).attr("checked")){
					val = "1";
				}else{
					val = "0";
				}
			}
			//非明细行的下拉框处理
			if(tClass == "changeSelect"){
				val = $(this).next().val();
				
			}
			//核选多选框处理  lpp 20180115
			if($(this).attr("type") == "checkbox"){
				if($(this).prop("checked")){
					val = "1";
				}else{
					val = "0";
				}
			}
			
			var array = id.split("-");
			var tableName,tColumn,tRow;
			if(array.length>0){
				tableName = array[0];//表名
				tColumn = array[1];//单元格名
				tRow = array[2];//行
			}
			if(tableName != undefined && tColumn != undefined && tRow != undefined){
				if(lastName == tableName && lastRow == tRow){
					//lpp 20180402 处理所得税年报最后几张表
					if(tColumn == "SBXML" || tColumn == "CZMXL"){
						cellXml = cellXml + "<"+tColumn+">"+val+"</"+tColumn+">";
					}else{
						cellXml = cellXml + "<"+tColumn+"><![CDATA["+val+"]]></"+tColumn+">";
					}
				} else{
					cellXml = cellXml + "</RecID><RecID TableName=\""+tableName+"\" Row=\""+ tRow +"\"><"+tColumn+">"+val+"</"+tColumn+">";
				}
			}
			numbRow = 1;
		} else if(name != undefined && $(this).parents('tr').attr("class") != "append"){// $(this).parent().parent().attr("class");取得tr的class
			var val = $(this).val();
			if(val == "" && tClass.indexOf("number") != -1){
				val = "0.00";
			}else if(val == "*" && tClass.indexOf("number") != -1){
				val = "0.00";
			}
			if(tClass == "changeSelect"){
				val = $(this).next().val();
			}
			//核选多选框处理  lpp 20180408
			if($(this).attr("type") == "checkbox"){
				if($(this).prop("checked")){
					val = "1";
				}else{
					val = "0";
				}
			}
			if($(this).attr("type") == "radio"){
				if($(this).attr("checked")){
					val = "1";
				}else{
					val = "0";
				}
			}
			var array = name.split("-");
			var tableName,tColumn,tRow;
			if(array.length>0){
				tableName = array[0];//表名
				tColumn = array[1];//单元格名
			}
			if(tableName != undefined && tColumn != undefined){
				if(lastName == tableName && lastColumn != tColumn){
					//cellXml = cellXml + "<"+tColumn+"><![CDATA["+val+"]]></"+tColumn+">";
					//lpp 20180402 处理所得税年报最后几张表
					if(tColumn == "SBXML" || tColumn == "CZMXL"){
						cellXml = cellXml + "<"+tColumn+">"+val+"</"+tColumn+">";
					}else{
						cellXml = cellXml + "<"+tColumn+"><![CDATA["+val+"]]></"+tColumn+">";
					}
				} else{
					//tRow = numbRow++;//行
					//lpp 20170928 酒类附表一单独处理行号。
					tRow = $row(tableName);
					if(tableName == "jlfb1pj"){
						tRow = 4 + tRow;//行
					}
					cellXml = cellXml + "</RecID><RecID TableName=\""+tableName+"\" Row=\""+ tRow +"\"><"+tColumn+">"+val+"</"+tColumn+">";
				}
			}
		}
		lastName = tableName;
		lastColumn = tColumn;
		lastRow = tRow;
	});
	cellXml = cellXml +"</RecID></Root>";
	cellXml = cellXml.replace("<RecID></RecID>", "");
	$("#initCellXml").text(cellXml);
	return cellXml;
}
var rowMap = {};//拼cellxml的时候，记录每个表的row
var $row = function(key){
	var $rowNum = rowMap[key];
	if($rowNum===undefined){
		$rowNum = 0;
	}
	$rowNum++;
	rowMap[key] = $rowNum;
	return $rowNum;
};

/*
 * 通用工具方法
 */
var $Num = function(inputId){
	return toNum($Map(inputId).val());
};
function toNum(str){
	try{
		var num = parseFloat(str);
		if(isNaN(num))
			return 0;
		else
			return num;
	}catch(e){
		return 0;
	}
} 
function formatNum(num){
	if(isNaN(num) || num==0)
		return "";
	else
		return parseFloat(num).toFixed(2);
}
//设置值，并触发change事件
var $Val = function(item, value){
	if (value == 0) 
		item.val("");
	else{
		item.val(value);
	}
	item.trigger("change");
	//setTimeout(function(){item.trigger("change");},10);
};
//赋值之前，数值类型，保留两位小数
var $ValNum2 = function(item, value){
	item.val(value.toFixed(6));
	item.trigger("change");
	//setTimeout(function(){item.trigger("change");},10);
};
var $Eq = function(fromId,toId){
	$Val($Map(toId), $Num(fromId));
};
var $Sub = function(aId,bId,differenceId){
	var	num_a=isNaN(parseInt(aId))?$Num(aId):toNum(aId);
	var	num_b=isNaN(parseInt(bId))?$Num(bId):toNum(bId);
	$Val($Map(differenceId),num_a-num_b);
};
var domMap = {};//以id为key，保存dom元素，避免重复的DOM查找操作
var $Map = function(key){
	var $domItem = domMap[key];
	if($domItem===undefined){
		$domItem = (domMap[key] = $(key));
	}
	return $domItem;
};
function mx_hj(t, hj){
	$Total($(t).parents('table').find("input[name='"+t.name+"']"), 0, hj);
}

//计算合计，total为合计初始值
var $Total = function($each, total, $to){
	$each.each(function(){total += toNum($(this).val());});
	$Val($to, total);
};
//按ID求和：支持n个ID值，其中(第1、2...n-1)个ID为加数，第n个ID为和值
var $Sum = function(){
	var total = 0;
	var len = $(arguments).length - 1;
	for(i=0;i<len;i++){
		total += $Num(arguments[i]);
	}
	$Val($Map(arguments[len]), total);
};
//返回日期中月份（日期实例：2015年12月24日，返回12）
var $MONTH = function($mon){
	if($mon != null && $mon != ""){
		if($mon.substring(6,7) == "月"){
			return $mon.substring(5,6);
		} else {
			return $mon.substring(5,7);
		}
		
	}
};
//(第1、2...n)个ID为个数，返回值不为0的个数
var $Count = function(){
	var total = 0;
	var len = $(arguments).length;
	for(i=0;i<len;i++){
		if($Num(arguments[i]) != 0){
			total += 1;
		}		
	}
	return total;
};
/**
string 字符串数据类型参数，母串
start, 子串的开始序号(从0开始)
count  数值数据类型，字符个数
实例：Mid( "abcd", 1,2 ) 等于 "bc"
*/
var $Mid = function(str, start, count){
	if(str != null && str != ""){		
		return str.substring(start, start+count);
	}
};
var $isChecked = function(obj){
	if($(obj).prop("checked")){
		 return true;
	 } else{
		  return false;
	}
};
//返回日期中年份（日期实例：2015年12月24日，返回2015）
var $YEAR = function($year){
	if($year != null && $year != ""){
			return $mon.substring(0,4);
	}
};
//返回字符串长度
var $Strlen = function($str){
	if($str != null && $str != ""){
		return $str.length;
	} else {
		return 0;
	}
};
//返回子串在母串中的位置
var $Find = function(mstr, sstr){
	//console.log(sstr);
	//console.log(mstr);
	var str = mstr.indexOf(sstr);
	return str;
};
//返回字符串的左边子串
var $left = function(str, count){
	 if(str != null && str != ""){		
		return str.substring(0, count);
	}
};
//返回字符串的右边子串
var $right = function(str, count){
	 if(str != null && str != ""){		
		return str.substring(str.length-count, str.length);
	}
};
//将数值转为字符串 
var $String = function(str){
	 if(str != null && str != ""){		
		return str.toString();
	}
};
var $Index = function(){
	//添加数组IndexOf方法
	if (!Array.prototype.indexOf){
	  Array.prototype.indexOf = function(elt /*, from*/){
	    var len = this.length >>> 0;

	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
	         ? Math.ceil(from)
	         : Math.floor(from);
	    if (from < 0)
	      from += len;

	    for (; from < len; from++){
	      if (from in this && this[from] === elt)
	        return from;
	    }
	    return -1;
	  };
	}
};
//lpp 20180124 设置全表是否只读。
function setCellReadOnly(readOnly){
	$("input[class!='notReadOnly']").attr("disabled", readOnly);
}
//校验
function checkCell(jyData,f){
	//SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,2);
	if(!checkCell_NotNull()) return;
	if(bddm=="SBCM717" && !checkCell_jmsdsyhzc()) return;
	if(checkcell_page_new(jyData)){
		msgJson = eval('(' +PubCheckMsg + ')');
		displayCellCheckTable(f);
	}
}
function checkCell_NotNull(){
	$('.error').removeAttr('title');
	$('.error').removeClass('error');
	var rtn = 0;
	var i=0;
	var witch;
	$("tr:not(.append) td .notNull").each(function(){
		if($(this).val()==""){rtn=1;witch=this;i=$(this).parents(".ss").index();}
	});
	if(rtn==1){
		$("#tablePages .ss").hide();
		$("#tablePages .ss:eq("+i+")").show();
		$(witch).focus();
		alert("当前位置不能为空！");return false;
	}
	return true;
}
function checkcell_page_new(jydata){
	if(bddm == "SB00112"){
		var fzjglb = $Map("#HEAD-FZJGLIST-0").val();
		if(fzjglb.length>0)
			changeFbSelect("hznszzs");
	}
	var strCellData;
	strCellData = cellData();//获取表单cell
	if(strCellData == ""){
		return false;
	}
	if(jydata != null && jydata.length >0){
		if( checkcell_new(strCellData,jydata) == false){
			return false;
		}	
	}
	return true;
}


function checkcell_new(strCellData,jydata){
	var jyxml;	
	jyxml = transformXMLByXsltData(strCellData,jydata);	
	PubCheckMsg = "";
	if(bddm=="ZDSY100" || bddm=="SSDC100" )
	{
			//合并 jyxml strCellData
			var strCellData_1;
			strCellData_1 = concatXML(jyxml,strCellData);
			//xsl_ZDSY100_remark 转换
			var jyxml_1;
			jyxml_1 = transformXMLByXsltData(strCellData_1,xsl_remark);	
			//合并 xml_ZDSY100_sh
			strCellData_1 = concatXML(jyxml_1,xml_sh);
			//xsl_ZDSY100_gs 转换
			jyxml_1 = transformXMLByXsltData(strCellData_1,xsl_gs);	
			jyxml = jyxml_1;	
	}
	JYXML2JSON(jyxml);
	return true;
}

function displayCellCheckTable(f){
	var btn = null;
	if(f=="jy")
		btn = {"取消": function() {$( this ).dialog( "close" );}};
	else
		btn = {"下一步":function(){
			var psNum = 0,errNum = 0;
			$('#checkCellMsg tbody tr input').each(function(){
				errNum ++;
				if($(this).parent().prev().html().length>0)
					psNum ++;
			});
			
			if(psNum == errNum){
				$( this ).dialog( "close" );
				if(bddm=="SB00112_Ybjc"){toZzsYbr();}else{checkCell_go();}
			}else
				alert("您还有未填写的审核情况说明！请填写。");
		},
		"取消": function() {$( this ).dialog( "close" );}	};
	$("#checkCellMsg tbody").empty();
	var trs = "";
	var psFlag = false;
	if(msgJson.length>0){
		$(msgJson).each(function(index){ 
			if(this.inputId != ''){
				$(this.inputId).addClass("error");
				$(this.inputId).attr("title",this.msg);
			}
			trs += "<tr><td>"+(index+1)+"</td><td align='left'>"+this.msg+"</td><td>";
			if(this.code=="01"){
				trs += "</td><td>可忽略</td></tr>";
			}else if(this.code=="02" || this.code=="04"){
				trs += "</td><td><font color=red>不可忽略</font></td></tr>";
				btn = {"取消": function() {$( this ).dialog( "close" );}};
			}else if(this.code=="03"){
				psFlag = true;
				trs += this.remark+"</td><td><input class=mybtn type=button name=submit value='添加/修改说明' onclick='checkCell_editRemark("+index+")'/>";
			}
		}); 
		trs = "<tr><td width='50'>序号</td><td>详细描述</td>"+(psFlag?"<td width='200'>备注说明</td>":"<td></td>")+"<td width='100'>&nbsp;</td></tr>" + trs;
	}else{
		trs = "<tr><td>校验通过！</td></tr>";
	}
	$("#self_info_div_id_checkCell").dialog({
		bgiframe:       true ,
		autoOpen : 		false,
		modal : 		true,
		height : 		400,
		width : 		900,
		closeOnEscape : false,
		resizable : 	true,
		draggable :     true,
		position: 		[120,80],
		buttons: btn,
		close: function() {
			if(bddm=="ZDSY100" || bddm=="SSDC100"){
				saveCheckToCell();
				//setTimeout(function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,2);},300);
			}
        },

	});
	$('#self_info_div_id_checkCell').dialog('open');
	$('#self_info_div_id_checkCell').dialog('moveToTop');
	$("#checkCellMsg tbody").html(trs);
}
function displayCellCheckTable_SDS(){
	var btn = null;
	var msgJson = eval('(' +PubCheckMsg + ')');
	btn = {"确定": function() {$( this ).dialog( "close" );}};
	$("#checkCellMsg tbody").empty();
	var trs = "";
	var psFlag = false;
	if(msgJson.length>0){
		$(msgJson).each(function(index){ 
			if(this.inputId != ''){
				$(this.inputId).addClass("error");
				$(this.inputId).attr("title",this.msg);
			}
			trs += "<tr><td>"+(index+1)+"</td><td align='left'>"+this.msg+"</td><td>";
			if(this.code=="01"){
				trs += "</td><td>可忽略</td></tr>";
			}else if(this.code=="02" || this.code=="04"){
				trs += "</td><td><font color=red>不可忽略</font></td></tr>";
				btn = {"取消": function() {$( this ).dialog( "close" );}};
			}else if(this.code=="03"){
				psFlag = true;
				trs += this.remark+"</td><td><input class=mybtn type=button name=submit value='添加/修改说明' onclick='checkCell_editRemark("+index+")'/>";
			}
		}); 
		trs = "<tr><td width='50'>序号</td><td>详细描述</td>"+(psFlag?"<td width='200'>备注说明</td>":"<td></td>")+"<td width='100'>&nbsp;</td></tr>" + trs;
	}else{
		trs = "<tr><td>校验通过！</td></tr>";
	}
	$("#self_info_div_id_checkCell").dialog({
		bgiframe:       true ,
		autoOpen : 		false,
		modal : 		true,
		height : 		400,
		width : 		900,
		closeOnEscape : false,
		resizable : 	true,
		draggable :     true,
		position: 		[120,80],
		buttons: btn,
		close: function() {
			if(bddm=="ZDSY100" || bddm=="SSDC100"){
				saveCheckToCell();
				//setTimeout(function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,2);},300);
			}
        },

	});
	$('#self_info_div_id_checkCell').dialog('open');
	$('#self_info_div_id_checkCell').dialog('moveToTop');
	$("#checkCellMsg tbody").html(trs);
}

var fb15_hidden_1;
var fb15_hidden_2;
var fb15_hidden_3;
var fb15_hidden_4;
var fb15_hidden_5;
var fb15_hidden_6;
var fb15_hidden_7;
var fb15_hidden_8;
// 改变附表事件。
function changeFbSelect(val){
	if(new Date().getTime() - timeStamp > 600000){//10min
		timeStamp = new Date().getTime();
		$.ajax({
			   type: "POST",
			   url: contextPath+"/zzsYbrInit.do",
			   async: false,data: {method: "sayHello",timeStamp:timeStamp}});
	} 
	
	$("#tablePages .ss").hide();
	$Map("#"+val).show();
	//lpp 20170626 单独计算一般人汇总表隐藏栏次公式。
	//lpp 20180228 历史报表查询，不做计算。strTemp == "newPage"(此时为历史报表查询进入)
	if(val == "hznszzs" && strTemp != "newPage"){
		fb15_hidden_1 = gongshi_fb15_hidden_1();
		fb15_hidden_2 = gongshi_fb15_hidden_2();
		fb15_hidden_3 = gongshi_fb15_hidden_3();
		fb15_hidden_4 = gongshi_fb15_hidden_4();
		fb15_hidden_5 = gongshi_fb15_hidden5();
		fb15_hidden_6 = gongshi_fb15_hidden6();
		fb15_hidden_7 = gongshi_fb15_hidden_7();
		fb15_hidden_8 = gongshi_fb15_hidden_8();
		//计算这几个栏次之后，触发页面上对应的隐藏域，参与计算。
		$("#FZJGXSSRMX_FB15-HIDDEN-1,#FZJGXSSRMX_FB15-HIDDEN-2,#FZJGXSSRMX_FB15-HIDDEN-3,#FZJGXSSRMX_FB15-HIDDEN-4,#FZJGXSSRMX_FB15-HIDDEN-5,#FZJGXSSRMX_FB15-HIDDEN-6,#FZJGXSSRMX_FB15-HIDDEN-7,#FZJGXSSRMX_FB15-HIDDEN-8").trigger("change");
		//lpp 20171027 分配比例一进去的时候默认就有值1，需要参与计算。
		$("#FZJGXSSRMX_FB15-HIDDEN-9,#FZJGXSSRMX_FB15-HIDDEN-10,#FZJGXSSRMX_FB15-HIDDEN-11,#FZJGXSSRMX_FB15-HIDDEN-12").trigger("change");
	} else if(val == "A100000" && strTemp != "newPage" && bddm=="SBCM717"){
	    gongshi_zb();
	}
}

function ReplaceAll(str, sptr, sptr1){
    while (str.indexOf(sptr) >= 0){
       str = str.replace(sptr, sptr1);
    }
    return str;
}