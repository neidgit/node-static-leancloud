/**
 * @pzzlDm : 凭证种类代码。
 * @act ： 操作：(WSKK)
 * @ifs : 是否首页调用，即在mainFrame.html中调用，(true:是，false:否，申报结束后调用。)
 * */
function doNext(bddm,pzzlDm, sssqq, sssqz, act,ifs){
	$.blockUI();
	alert('本操作将进行实时扣款，对于单个税种仅支持一次操作。请您在扣款前确认帐户余额，如因余额不足造成扣款失败，则需去办税服务厅补扣税款。\n一般情况下，银行扣款受理时间为【上午8点-下午5点】，请您尽量在此期间发起扣款。');
	$.ajax({
		   type: "POST",
		   url: "ajaxDo.do",
		   dataType : "json",
		   data: {
				method: "updateYsbqc",
				pzzlDm: pzzlDm,
				bddm:bddm,
				sssqq:sssqq, 
				sssqz:sssqz,
				act: act
		   },
		   success: function(data){
			  $.unblockUI();
			  if(data.kkbz != "Y")
				  alert(data.RtnMsg);
			  if(ifs){
				  $("#mainFrameContent",top.document)[0].contentWindow.initNsrJbxx();
			  }else{
				/**
				 * close by lpp 20150112 去掉提示页面。
				 * if(confirm("是否切换到【主界面】查询申报扣款状态？")){
					$("#nav",top.document)[0].contentWindow.clickTree(11);
				}*/
			  }
		   } 
		}); 
	
}
/**
 * 短信验证码
 */
function smsCode(bddm,pzzlDm, sssqq, sssqz, act,ifs, smsFlag){
	if(dqbz=="nm"){
		alert("由于国库财税库银系统升级，2018年4月28日22点至2018年5月1日8点网上缴款业务暂停办理，届时您可选择去税务大厅办理扣款业务，给您带来的不便敬请谅解！");
		return;
	}
	var returnVal = true;
	if(smsFlag && act=="WSKK"){
		var params = new Array("1234567890");
		var returnVal = window.showModalDialog("frame/smsCode.html?",params,"dialogWidth=400px;dialogHeight=200px;");
	}
	if(returnVal){
		doNext(bddm,pzzlDm, sssqq, sssqz, act,ifs);
	}
}

//lpp 20160905 设置千分位状态显示。
var qfw_zt = false;
function setQFW(){
	if(!qfw_zt){
		qfw_zt = true;
	}else{
		qfw_zt = false;
	}
	
	var totalsheetNum,MaxCol,MaxRow,curCol,curRow,curCellSheet;
	var curCellSheet_Now;
	totalsheetNum = CellWeb1.GetTotalSheets;
	curCellSheet_Now = CellWeb1.GetCurSheet();
	
	for(var iLoop1 = 0; iLoop1<totalsheetNum; iLoop1++){
		curCellSheet = iLoop1;
		CellWeb1.SetCurSheet(curCellSheet);
		MaxCol =  CellWeb1.GetCols(curCellSheet) - 1;  //最大列号
	    MaxRow =  CellWeb1.GetRows(curCellSheet) - 1;  //最大行号
	    
	    for(var iLoop2 = 0; iLoop2<MaxCol; iLoop2++){ //逐列
	    	for(var iLoop3=1; iLoop3<MaxRow; iLoop3++){ //逐行
	    		curCol = iLoop2;
		        curRow = iLoop3;
		        //判断如果是数值类型的，设置为千分位显示。
		        //if(CellWeb1.GetCellInput(curCol,curRow,curCellSheet) == 2){
		        if(CellWeb1.GetCellNumType(curCol,curRow,curCellSheet) == 1){
					//如果原来是千分位，设为不是千分位，否则设为千分位。
		        	if(!qfw_zt){
		        		CellWeb1.SetCellSeparator(curCol,curRow,curCellSheet,2);
					}else{
						CellWeb1.SetCellSeparator(curCol,curRow,curCellSheet,0);
					}
			    }
			}
		}
	}
	CellWeb1.SetCurSheet(curCellSheet_Now);
}
/////////////////////////////////////////////////////////////////////////////////////////
//预缴表扣款
function doNextYjb(djxh, pzzlDm, pzxh, sssqq, sssqz, act,ifs){
	$.blockUI();
	if(dqbz != "nb")
		alert('本操作将进行实时扣款。请您在扣款前确认帐户余额，如因余额不足造成扣款失败，则需去办税服务厅补扣税款。\n一般情况下，银行扣款受理时间为【上午8点-下午5点】，请您尽量在此期间发起扣款。');
	$.ajax({
		   type: "POST",
		   url: contextPath+"/Yjb.do",
		   async: false,
		   dataType : "json",
		   data: {
				method: "updateYjb",
				pzzlDm: pzzlDm,
				djxh:djxh,
				pzxh:pzxh,
				sssqq:sssqq, 
				sssqz:sssqz,
				act: act
		   },
		   success: function(data){
			  $.unblockUI();
			  if(data.kkbz != "Y")
				  alert(data.RtnMsg);
			  if(ifs){
				  $("#mainFrameContent",top.document)[0].contentWindow.initYjb();
			  }else{
				
			  }
		   } 
		}); 
}

/**
* 短信验证码
*/
function smsCodeYjb(djxh, pzzlDm, pzxh, sssqq, sssqz, act,ifs, smsFlag){
	var returnVal = true;
	if(smsFlag && act=="WSKK"){
		var params = new Array("1234567890");
		var returnVal = window.showModalDialog("frame/smsCode.html?",params,"dialogWidth=400px;dialogHeight=200px;");
	}
	if(returnVal){
		doNextYjb(djxh, pzzlDm, pzxh, sssqq, sssqz, act,ifs);
	}
}

/**
 * @author lpp
 * @作用：根据纳税人识别号，查询企业名称和主管税务机关代码。
 */
function getQyxxBySbh(nsrsbh,currow){
	$.ajax({
		   type: "POST",
		   url: "ajaxDo.do",
		   dataType : "json",
		   data: {
				method: "getQyXgxxBySbh",
				nsrsbh: nsrsbh
		   },
		   success: function(data){
			  if(data.success){
				  if(data.qymc.length>0)
				  {
					  cellData_W("B3V0100Y_QYMC",currow,data.qymc);
					  cellData_W("B3V0050Y_BTZZGSWJG",currow,data.zgswjgmc);
				  }
				  
			  }else{
				  
			  }
		   } 
		}); 
}

/**
 * @des 废弃，用到的cll中的鼠标单击事件，可能是有问题，改成$E的按钮方式。
 * @author lpp 关联关系表G112000填写详细信息界面。
 * @param currow
 * @return
 */
function jwglfXxxx_G112000(currow,CELLXML){
	var timeN = new Date();
	childInit = cellData_R("Z3V0600Y_INITXML",currow);
	var url = smtPath+"/glgx/glgx_G112000.jsp?index="+currow;//+"&timeN="+timeN;
	//window.showModalDialog(encodeURI(url), window,'dialogWidth:1025px;dialogHeight:450px;');
	//window.showModalDialog(url, window,'dialogWidth:1025px;dialogHeight:450px;');
	window.open(url,"newwindow","toolbar=no,menubar=no,depended=yes,resizable=yes,scrollbars=yes,location=no,status=yes,fullScreen=yes");
	//window.showModalDialog(url, window,'dialogWidth:1025px;dialogHeight:450px;');
	url = null;
	
	
}

//把录入的明细增加到明细行
function addGlgxG112000MX(strInitData){
	if(Cell_DispXml(strInitData,true) == false)
	{ 
			alert("添加明细初始化数据出错！");
	  	return false;
	}
}
//跳转扣款选择模式
function kfstyle(djxh,yzpzzlDm,yzpzxh,zgswskfjdm,sssqq,sssqz) {
	$.blockUI();
	setTimeout(function() {
		var url = contextPath+"/sb/QRcodekf.jsp?yzpzzlDm=" + yzpzzlDm + "&yzpzxh="+yzpzxh + "&djxh="+djxh + "&zgswskfjdm="+zgswskfjdm + "&sssqq="+sssqq + "&sssqz="+sssqz;
		window.showModalDialog(url, window, 'dialogWidth:600px;dialogHeight:350px');
		setTimeout(function() {
			$.unblockUI();
		}, 300);
	}, 300);
}

/**
 * @des 税收调查表，点击按钮弹出复选框。
 * @param eRow
 * @param iTable
 * @param sheetindex
 * @param btnName
 * @return
 */
function openFxkSelectMx(eRow, iTable,sheetindex,btnName){
	var btnValue;
	var yhFlag;
	if("A0V0005Y_YYSYHBTN" == btnName){
		btnValue = Cell_CtrlDataR(CellWeb1,"B0V0080N_YYSYHZCDM",0);
		yhFlag = "yys";
	}else if("A0V0005Y_ZZSYHBTN" == btnName){
		btnValue = Cell_CtrlDataR(CellWeb1,"B0V0080N_ZZSYHZCDM",0);
		yhFlag = "zzs";
	}else if("HEAD-ZZSYHBTN-0" == btnName){
		//btnValue = Cell_CtrlDataR(CellWeb1,"B0V0080N_ZZSYHZCDM",0);
		btnValue = $("#XXB-ZZSYHZCDM-0").val();
		yhFlag = "zzs";
	}else if("HEAD-YYSYHBTN-0" == btnName){
		btnValue = $("#XXB-YYSYHZCDM-0").val();
		yhFlag = "yys";
	}
	
	var url = contextPath+"/sb/FxkSelectMx.jsp?btnValue="+btnValue+"&yhFlag="+yhFlag;
	window.showModalDialog(url, window, 'dialogWidth:600px;dialogHeight:350px');
}
//保存复选框内容
function saveCheckBoxSelect(strChecked,yhFlag){
	if(yhFlag == "yys"){
		//cellData_W("B0V0080N_YYSYHZCDM",0,strChecked);
		$Val($Map("#XXB-YYSYHZCDM-0"), strChecked);
	}else{
		//cellData_W("B0V0080N_ZZSYHZCDM",0,strChecked);
		$Val($Map("#XXB-ZZSYHZCDM-0"), strChecked);
	}
}