//var Pub_SBPath = "C:\AISINO_NSSB";
// JSP中调用CELL，在起动初进行属性控制(用于独立窗口的页面，不在主界面下)
// OpenModel:新窗口打开方式，old:是在原主界面窗口下打开；new:是另开一个新窗口
function jspCellInitCtrl(OpenModel){
	var bRtn = true;
	var lWidth = document.body.offsetWidth;
	var lHeight=document.body.offsetHeight;	
	CellWeb1 = document.all.CellWeb_jsp;
	CellWeb_print = document.all.CellWeb_print_jsp;
//	CellWeb1.style.left = 200;	
//	var lWidth = 400;// document.body.offsetWidth;
 	if(OpenModel=="new"){
	  	CellWeb1.style.height = "0%";	
	  	CellWeb1.style.width = "0%";	
	  }
	  else if(OpenModel=="show"){
		CellWeb1.style.height = "91%";
	  	CellWeb1.style.width = "100%";	
	  }
	  else if(OpenModel=="queryshow"){
	  	CellWeb1.style.height = "97%";	
	  	CellWeb1.style.width = "100%";	
	  }
}
function wjdx(){
	var url = "../wjdx.html";
	window.showModalDialog(url, window,'dialogWidth:750px;dialogHeight:350px');
	
}
function doLogoff(){
	window.parent.location.href = "../Logoff.do";
	window.parent.close();
}

// JSP中调用CELL，在窗口变动时进行属性控制
/*function window_onresize(OpenModel){
	var lWidth = document.body.offsetWidth;
	var lHeight=document.body.offsetHeight;	
	if( lWidth <= 0) 
		lWidth = 1;
//	CellWeb1.style.width =lWidth - 42;
//CellWeb1 = document.all.CellWeb_jsp;
if(CellWeb1){
	CellWeb1.style.width ="100%";
	CellWeb1.style.height ="85%";
	}
	return;
}*/

//*******************************************************************************************************************
//public 初始化cell,一般情况下window.onload=init_page
var ajaxInit = 1;
function init_page(smtPath,nsrsbh,sssqq,sssqz,bddm,server_version,initData,inistSetData,cellfile,cellSheet)
{
	var bNBTaxCom = false;	
	try
	{
    	bNBTaxCom = nbtaxcell_path(Pub_SBPath); //创建目录
  	}
  	catch (ex)
  	{
    	alert("小助手安装不正确，请重新下载本系统的小助手，并退出网上申报系统，安装后再重新进入系统。"+ex);
    	return;
   	}

   	//判断是否有本地保存的文件
   	var strPath = Pub_SBPath + '\\' + bddm;
   	var strTemp = bddm + "_" + nsrsbh+"_"+sssqq+"_"+sssqz+"_pre.cll";
	Rtn = JudgeWsbwj(nsrsbh,bddm,strTemp,server_version);
   	//add by lpp 如果是海关的采集报表，不做判断，直接打开原来保存的报表。
   	if(bddm == "HGWS001"){
	   	Rtn = 0;
   	}
   	//lpp 20170819 判断增值税一表集成情况，如果是一表集成有数据，不加载本地文件。
   	if(typeof(zzsYbjcData) != "undefined" && zzsYbjcData.length > 0){
   		Rtn = 0;
   	}
	var truthBeTold;
	if(menuId.substring(0,1) == "8"){
		strTemp = bddm + "_" + nsrsbh+"_"+sssqq+"_"+sssqz+"_OK.cll";
		Rtn = JudgeWsbwj(nsrsbh,bddm,strTemp,server_version);
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
							if(Rtn==1)
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
			if(Rtn==1)
				truthBeTold = window.confirm("你有本地保存的上次已申报的报表数据，要加载吗？");
		}
		if (!truthBeTold) {
	 		nbtaxDeleteMyFile(strPath+"\\"+strTemp);  //删除本地保存的报表			
	 	}else{	
			ajaxInit = 0;
		}
	}else if(Rtn==1) {
 		//附加税不加载本地报表，直接打开新报表
   		truthBeTold = bddm=="FJSF100"?false:window.confirm("你有本地保存的上次未申报的报表数据，要加载吗？");
	 	if (!truthBeTold) {
	 		nbtaxDeleteMyFile(strPath+"\\"+strTemp);  //删除本地保存的报表			
	 	}else{	
			ajaxInit = 0;
		}
   	}

	if(ajaxInit==0){
		if(menuId.substring(0,1) == "8" && bddm != "FQDQ100" && bddm != "WHSY100"){
 			ret_sbgzid();
 		}
		pb_handler(smtPath,nsrsbh,sssqq,sssqz,bddm,server_version,initData,inistSetData,cellfile,cellSheet);
	}else{
		$.ajax({
			type: "POST",
			url: "ajaxDo.do",
			dataType: "json",
			data: {
				method:"initCellXml",
				bddm : bddm,
				sssqq : sssqq,
				sssqz : sssqz
			},
			success: function(data){
				if(data.success){
					pb_handler(smtPath,nsrsbh,sssqq,sssqz,bddm,server_version,data.initData,inistSetData,cellfile,cellSheet);
				}else{
					self.location = encodeURI("error.jsp?errmsg="+data.err_msg);
				}
			}
		}); 
	}
	//$("#nav", top.document)[0].contentWindow.add3LevelMenu(bddm);

}

function reopen_cell(smtPath,nsrsbh,sssqq,sssqz,bddm,server_version,initData,inistSetData,cellfile,cellSheet)
{
 	//判断是否有本地保存的文件
   	var strPath = Pub_SBPath + '\\' + bddm;
   	var strTemp = bddm + "_" + nsrsbh+"_"+sssqq+"_"+sssqz+"_pre.cll";
	Rtn = JudgeWsbwj(nsrsbh,bddm,strTemp,server_version);
   	if(Rtn==1) {
    CellWeb1.CloseFile();
	 		nbtaxDeleteMyFile(strPath+"\\"+strTemp);  //删除本地保存的报表
   	}
	pb_handler(smtPath,nsrsbh,sssqq,sssqz,bddm,server_version,initData,inistSetData,cellfile,cellSheet);
	//$("#nav", top.document)[0].contentWindow.add3LevelMenu(bddm);
}

//private 
function pb_handler(smtPath,nsrsbh,sssqq,sssqz,bddm,server_version,initData,inistSetData,cellfile,cellSheet){
var time1,time2;
var initrtn;
	try {
  		jspCellInitCtrl("new");//CELL初始大小控制
		initrtn=init(smtPath,nsrsbh,sssqq,sssqz,bddm,server_version,initData,cellfile);
	}catch(e){	
		alert("小助手安装不正确，请重新下载本系统的小助手，并关闭浏览器后进行安装。");
	}finally{
			//top.stopProcessBar();
	}
	//jspCellInitCtrl("show");
	if(initrtn){
		//if(initSetXML != null && initSetXML.length >0)
		//{
		//	initSetByXml(bddm,initSetXML);
		//}
		var sheets = initCellData();	//该CELL的自身特殊初始化,需要注意的是,加载新下载的cell和加载的保存的cell都执行该方法
		//lpp 20180305 江西关联业务，判断是否存在关联，不存在的时候不需要打开报表。
		if(dqbz == "jxg3" && sheets == "N"){
			ret_userinfo();
			return;
		}
		//lpp end 
		initJbhy_Yqxh = sheets;//赋值为公共变量。
		$.ajax({
		   type: "POST",
		   url: "ajaxDo.do",
		   dataType: "json",
		   data: {
				method:"saveSheets",
				bddm: bddm,
				nsrsbh: nsrsbh,
				sheets: sheets
		   },
		   success: function(data){
			   if(window.opener == null)
				   $("#nav", top.document)[0].contentWindow.add3LevelMenu(bddm);
			}
		}); 



  		Cell_Ctrl(CellWeb1,0,1); //控制CELL表的显示属性
		jspCellInitCtrl("show");	//显示CELL
		if(cellSheet!=null && cellSheet.length>0){ 
			SelectSheetByCellSheet(cellSheet);
		}
	}else {
	   //top.newAlert("提示",PubErrMsg,"OK","");
	}	
  CellWeb1.SetModified(0);//刚打开文件，取消修改标识，不存盘，会慢。
  reloadToolbar();
  ygz9in1();
}
//**************************************************************************************************************************


//**************************************************************************************************************************
//校验方法
function checkcell_page(jydata){
	var strCellData;	
	strCellData = Cell_WriteXmlStr(2);  //剔除A3区生成，即校验xml
	//add by lpp****
	if(strCellData == "")
	{
		return false;
	}
	//end **********
	if(jydata != null && jydata.length >0)
	{
		if( checkcell(strCellData,jydata) == false)
		{
			return false;
		}	
	}
		//alert("校验通过");	
	return true;
}

//根据jyxsl校验cell
function checkcell(strCellData,jydata){
	var jyxml;	
	if(checkCellData()==1) {
  	return false;
	}	
	jyxml = transformXMLByXsltData(strCellData,jydata);	
	PubCheckMsg = "";
	DispJYXMLByXMLData(jyxml,"02","\n"); //强制性校验
	if(PubCheckMsg != null && PubCheckMsg.length > 0)
	{
		PubCheckMsg = "请您修改以下错误：\n" + PubCheckMsg;
		alert(PubCheckMsg);		
		return false;
	}	
	PubCheckMsg = "";
	DispJYXMLByXMLData(jyxml,"01","\n"); //提示性校验
	if(PubCheckMsg != null && PubCheckMsg.length > 0)
	{
		PubCheckMsg = "请您确认以下表内关系：\n" + PubCheckMsg +"\n\n是否继续？";
		if(confirm(PubCheckMsg) == false)		
			return false;
	}	
	return true;
}
function checkcell_page_new(jydata){
	var strCellData;	
	strCellData = Cell_WriteXmlStr(2);  //剔除A3区生成，即校验xml
	//add by lpp****
	if(strCellData == "")
	{
		return false;
	}
	//end **********
	if(jydata != null && jydata.length >0)
	{
		if( checkcell_new(strCellData,jydata) == false)
		{
			return false;
		}	
	}
		//alert("校验通过");	
	return true;
}
function checkcell_new(strCellData,jydata){
	var jyxml;	
	if(checkCellData()==1) {
		return false;
	}	
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
//**************************************************************************************************************************

//**************************************************************************************************************************
//保存cell
function save_page(bddm,nsrsbh,sssqq,sssqz,server_version)
{
	//top.showProgressBar("进行报表校验...");
	//if (top.showProgressBar("生成申报文件...").isVisible())
	{
		setTimeout(function(){cell_save(CellWeb1,nsrsbh,sssqq,sssqz,server_version,bddm,0);},300);
	}
}
function leave_page(bddm,nsrsbh,sssqq,sssqz,server_version)
{
	cell_save(CellWeb1,nsrsbh,sssqq,sssqz,server_version,bddm,2);
}

//保存cell_ok
function save_page_ok(bddm,nsrsbh,sssqq,sssqz,server_version,xfsfl,xfsmcfl)
{
	//top.showProgressBar("进行报表校验...");
	//if (top.showProgressBar("生成申报文件...").isVisible())
	if(false&&bddm.indexOf("SB0030")!=-1){
		xfsfl=xfsfl.split(',');
		for(i=0;i<xfsfl.length;i++){
			xfsbddm = xfsfl[i].replace(new RegExp(" ","gm"),"");
			Cell_OpenHis(CellWeb1,"C:/AISINO_NSSB/"+xfsbddm+"/"+xfsbddm+"_"+nsrsbh+"_"+sssqq+"_"+sssqz+"_pre.cll");
			cell_save(CellWeb1,nsrsbh,sssqq,sssqz,server_version,xfsbddm,1);
   	   		CellWeb1.CloseFile();
   	  }
   	  Cell_OpenHis(CellWeb1,"C:/AISINO_NSSB/"+bddm+"/"+bddm+"_"+nsrsbh+"_"+sssqq+"_"+sssqz+"_pre.cll");
	}else{
		setTimeout(function(){cell_save(CellWeb1,nsrsbh,sssqq,sssqz,server_version,bddm,1);},300);
	}
}
//**************************************************************************************************************************


//**************************************************************************************************************************
//上传cell数据
function upload_page(smtPath,bddm,nsrsbh,sssqq,sssqz,server_version,jydata,xfsfl,xfsmcfl,sbfs)
{
	//top.showProgressBar("进行报表校验...");
	//if (top.showProgressBar("生成申报文件...").isVisible())
	{
		setTimeout(function(){doUploadCellData(smtPath,bddm,nsrsbh,sssqq,sssqz,server_version,jydata,xfsfl,xfsmcfl,sbfs);},300);
	}
}


//从CELL生成XML上传
function doUploadCellData(smtPath,bddm,nsrsbh,sssqq,sssqz,server_version,jydata,xfsfl,xfsmcfl,sbfs)
{ 
	var strCellData,strTemp,newWind,strTemp2,strTemp3,JNSK_YZE,JNSK_SZE;
  //Cell_ResetSBRQ(smtPath,zsxm); 
  
  //取cell.xml做校验
  /*  if(false&&bddm.indexOf("SB0030")!=-1){
   		xfsfl=xfsfl.split(',');
   	   var bdxfsbb = "";
   	   var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); 
   	   for(i=0;i<xfsfl.length;i++){
   	   		var bdbb=nbtaxsearchReportList("C:/AISINO_NSSB/"+xfsfl[i]+"/",nsrsbh,sssqq,sssqz);
   	   		if(bdbb!=null && bdbb!=""){
   	   			bdbb = bdbb.substr(bdbb.lastIndexOf('\\')+1);
   	   			bdxfsbb = bdxfsbb + bdbb + ",";
   	   		}
   	   }
   	   if(bdxfsbb.indexOf(",")!=-1){
   	   		bdxfsbb = bdxfsbb.substring(0,bdxfsbb.length-1);
   	   }
   	   
		xfsmcfl=xfsmcfl.split(',');
		strTemp="";
   	   for (i=0;i<xfsfl.length;i++){
			if(bdxfsbb.indexOf(xfsfl[i])>=0)
				continue;
			else
				strTemp=strTemp+"<BR/><P/>"+xfsmcfl[i];
		}
		if(strTemp.length>0){
				alert("提示:以下报表尚未填写，请先填写完成并保存报表后再进行申报:"+strTemp);
				return;
		}
		bdxfsbb = bdxfsbb.split(',');
		JNSK_YZE=0.00;
		JNSK_SZE=0.00;
		strCellData = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Root>";
		for (i=0;i<bdxfsbb.length;i++){
			if (bdxfsbb[i]!=''&&bdxfsbb[i].indexOf('_pre')>0){
					var bddmList = bdxfsbb[i].split('_');
				    FileName="C:/AISINO_NSSB/"+bddmList[0]+"/"+bdxfsbb[i];
				    Cell_OpenHis(CellWeb1,FileName);
				    strTemp2=Cell_GetCellData("A0N1302Y_YBTSE",0);
				    strTemp3=Cell_GetCellData("A0N1302Y_SJSE",0);
				    JNSK_YZE=JNSK_YZE+parseFloat(strTemp2);
				    JNSK_SZE=JNSK_SZE+parseFloat(strTemp3);
	        	//initXllb(bblist[i]);  //初始化下拉框
	        	//Cell_ResetSBRQ(smtPath,bdxfsbb[i].substring(0,bdxfsbb[i].indexOf('_')));  
	        	   var xml = Cell_WriteXmlStr(1);
	        	   if (xml=="") {
	        			return false;
	        		}
	        	   var index1 = xml.indexOf("<Root>");
	        	   var index2 = xml.indexOf("</Root>");
	        	   xml = xml.substring(index1,index2+7);
	        	   xml = xml.replace(new RegExp("Root","gm"),bddmList[0]); 
				    strCellData = strCellData + xml;
	        		CellWeb1.CloseFile();
			}
		}
		Cell_OpenHis(CellWeb1,"C:/AISINO_NSSB/"+bddm+"/"+bddm+"_"+nsrsbh+"_"+sssqq+"_"+sssqz+"_pre.cll");
		strCellData = strCellData + "</Root>";
    }else{*/
		strCellData = Cell_WriteXmlStr(1);       // 申报文件生成，因此处的strCellData即申报用又校验用，所以用flag=1
		//add by lpp
		if(strCellData == "")
		{
			return false;
		}
    /*}*/
	//lpp 20170315 去掉这步校验。执行了两遍。
	/**if(jydata != null && jydata.length >0 && checkcell(strCellData,jydata) == false)
	{
		return false;
	}*/	
	
	//alert("校验成功\n");
	//把获取的数据填入form,用于提交
	//document.getElementById("bddm").value=bddm;
 	//document.getElementById("ssqq").value=sssqq;
 	//document.getElementById("ssqz").value=sssqz;
 	//document.getElementById("server_version").value =server_version ;
 	//document.getElementById("nsrsbh").value=nsrsbh;
 	//document.getElementById("xmltext").value =strCellData ;
 	
 	/****
 	submit 	
 	***/
 	//add by lpp 海关不弹出缴款书。
 	if("HGWS001" == bddm){
	 	$("#xmltext").val(strCellData);
		doHgSb();
 	}else if("SBCA714" == bddm){
	 	$("#xmltext").val(strCellData);
		doJcxxTj();
 	}else if("SBCA717" == bddm){
	 	$("#xmltext").val(strCellData);
		doJcxxTj();
 	}else{
 	//打开缴款书。 substring
 		/**if("CWBB001" == bddm || "CWBB002"== bddm || 
 				"CWBB003"== bddm || "CWBB004"== bddm || 
 				"CWBB005"== bddm || "CWBB006"== bddm || "CWBB007"== bddm ||
 				"CWBB101" == bddm || "CWBB102"== bddm || 
 				"CWBB103"== bddm || "CWBB104"== bddm || 
 				"CWBB105"== bddm || "CWBB106"== bddm || "CWBB107"== bddm || "SB00908"== bddm){*/
 		//liuhe 20160119 设立一个flag，防止被 所得税固定资产的弹出框 覆盖
 		var XWQYflag = "N";
 		//var dqbz   = "<%=dqbz%>";
 		//alert(dqbz);
 		if("SBCM815" == bddm && dqbz =="sc")
 		{
 			var sfxwqybz = Cell_GetCellData("C0V0010Y_SFXXWLQYBZ",0);
 			var sfxwqybz_init = Cell_GetCellData("C0V0010Y_SFXXWLQYBZ_INIT",0);
 			//alert("sfxwqybz\n"+ sfxwqybz);
 			//alert("sfxwqybz_init\n"+ sfxwqybz_init);
 			var sjlrelj = Cell_GetCellData("C0N1302N_SJLRELJJE",0);
 			//alert("sjlrelj"+sjlrelj);
 			if( (sfxwqybz == "0"  || sfxwqybz == "6" || sfxwqybz_init == "N") 
 					&& sjlrelj <= 300000)
 			{
 				
 				JDXWQY_TSK();
 				XWQYflag = "Y";
 			}
 		}
 		if( "SBCN815" == bddm && dqbz =="sc")
 		{
 			var sfxwqybz = Cell_GetCellData("B0V0010Y_SFXXWLQYBZ",0);
 			var sfxwqybz_init = Cell_GetCellData("B0V0010Y_SFXXWLQYBZ_INIT",0);
 			var ynssdeljje = parseFloat(Cell_GetCellData("B0N1302N_SRZEYNSSDE",0)) + parseFloat(Cell_GetCellData("B0N1302N_CBFYYNSSDE",0));
 			//alert("sfxwqybz:"+sfxwqybz);
 			//alert("ynssdeljje:"+ynssdeljje);
 			if( (sfxwqybz == "0" ||  sfxwqybz == "6" || sfxwqybz_init == "N") 
 			  && ynssdeljje <= 300000) 
 			{
 				JDXWQY_TSK();
 				XWQYflag = "Y";
 			}
 		}
 		//add by lpp 20151223  内蒙所得税A类增加固定资产统计功能。 加了一个是否打开小微企业弹出框的判断。
 		//alert("XWQYflag"+XWQYflag);
 		
 		$("#xmltext").val(strCellData);
	 	Pub_sb_saveFlag=1;
 		//给缴款书赋值。
 	 	$("#sbrq").val(Cell_GetCellData("A0D0000N_TBRQ",0));
 	 	$("#sssqq").val(Cell_GetCellData("A0D0000N_SSSQQ",0));
 	 	$("#sssqz").val(Cell_GetCellData("A0D0000N_SSSQZ",0));
 	 	if(false&&bddm.indexOf("SB0030")!=-1){
 	 		$("#ybtse").val(JNSK_YZE);
 			$("#sjse").val(JNSK_SZE);
 			$("#cellName").val("消费税");
 	 	}
 	 	else{
 	 		$("#ybtse").val(Cell_GetCellData("A0N1302Y_YBTSE",0));
 	 		$("#sjse").val(Cell_GetCellData("A0N1302Y_SJSE",0));
 	 		$("#cellName").val(Cell_GetCellData("A0V0050Y_BBMC",0));
 	 	}
 	 	
 		if(gdzcbz == "Y" && "SBCM815" == bddm && XWQYflag =="N"){
 			var zbBq_H7 = Cell_GetCellData("C0N1302N_GDZCJSZJTBQJE",0);
			var jszjYhtje_H12 = Cell_CtrlDataR(CellWeb1,"J1N1302Y_HJ_BQZJE_JSZJYHTJE",13);
			//如果附表二第11，12列有值的话，直接保存状态为3.否则让企业判断。
			//统计完之后继续申报操作。
			if(zbBq_H7 == 0 && jszjYhtje_H12 == 0){
				gdzcTJ_TSK();
			}else{
				doGDZCTJ(3);
			}
	 		
 		}else if(XWQYflag =="N"){
	 		if("CWBB"== bddm.substring(0,4) || "SB00908"== bddm || "ZDSY100"==bddm || "SSDC100"==bddm){
	 			document.getElementById("cwbb_display").style.display = "none";
	 		}
	 		
	 		jspCellInitCtrl("new");
	 		$('#self_info_div_id_infoJKS').dialog('open');
	 	 	$('#self_info_div_id_infoJKS').dialog('moveToTop');
 		}
 		
 	}
}
//**************************************************************************************************************************

/*function doUploadCellData_js(smtPath,zsxm,zsxmdm,nsrsbh,sssqq,sssqz,version,server_versiondate,savePath,sheetStr,sbfs,strCellData,newWind){
	 	var numTemp1,numTemp2;
	 	//灰化申报按钮 CELL不可写
    CellWeb1.WorkbookReadonly=true;
		top.setButtonDisable("btn_mediasb");
		top.setButtonDisable("btn_sb");
		top.setButtonDisable("btn_save");
		top.setButtonDisable("btn_ok");
		top.setButtonDisable("btn_downloadmx");
		top.setButtonDisable("btn_bbxx");
	 	
	 	top.showProgressBar("生成申报文件...");
	 	
	 	Pause(this,1000); 
	 	
	 	
		this.NextStep=function(){  
			if(zsxm!="glywwlb"&& zsxm!="cwbb"&&zsxm!="cwbb2007"){      	
				numTemp1=top.document.getElementById("JNSK_YZE").value;
			  numTemp2=top.document.getElementById("JNSK_SZE").value;
			  Cell_SetCellData("00N1302Y_YZE",numTemp1,-1,0,"N");
			  Cell_SetCellData("00N1302Y_SZE",numTemp2,-1,0,"N"); 
			}
		  
			strCellData = Cell_WriteXmlStr();
			if (strCellData=="") {
				top.stopProcessBar();
				return false;
			}
	     
	     //把获取的数据填入form,用于提交
	     document.getElementById("ssqq").value=sssqq;
	     document.getElementById("ssqz").value=sssqz;
	     document.getElementById("version").value=version;
	     document.getElementById("server_versiondate").value =server_versiondate ;
	     document.getElementById("nsrsbh").value=nsrsbh;
	     document.getElementById("xmltext").value =strCellData ;
	     Pub_sb_saveFlag=1;
	     setTimeout('top.showProgressBar("服务器正在处理，请稍候...")',400);
	     document.all.dzsbForm.target="sbframe";
	     document.all.dzsbForm.action=smtPath+"/dzsb.do?act=sb&zsxm="+zsxm+"&sbfs="+sbfs;
	     document.all.dzsbForm.submit();     
    }
}

//从CELL生成XML上传
function doUploadCellData_xfs(smtPath,zsxm,zsxmdm,nsrsbh,sssqq,sssqz,version,server_versiondate,savePath,xfsfl,xfsmcfl,sbfs)
{
		var strCellData,newWind,sheetStr,strTemp,strTemp1,strTemp2,strTemp3,bblist,pathTemp,JNSK_YZETEMP,JNSK_SZETEMP;
	  var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); 
		pathTemp = Pub_SBPath+ "\\" + savePath ;
		CellWeb1 = document.all.CellWeb_jsp;
		bblist=nbtaxsearchReportList(pathTemp,nsrsbh,sssqq,sssqz);	//已保存的消费税报表
		//检查所有消费税报表是否填写
		xfsfl=xfsfl.substring(0,xfsfl.length-1);
		xfsmcfl=xfsmcfl.substring(0,xfsmcfl.length-1);
		xfsfl=xfsfl.split(',');
		xfsmcfl=xfsmcfl.split(',');
		strTemp="";
		for (i=0;i<xfsfl.length;i++){
			if(bblist.indexOf(xfsfl[i])>=0)
				continue;
			else
				strTemp=strTemp+"<BR/><P/>"+xfsmcfl[i];
		}
		if(strTemp.length>0){
				top.newAlert("提示","以下报表尚未填写，请先填写完成并保存报表后再进行申报:<BR/>   "+strTemp,"OK",top.Ext.emptyFn);
				return;
		}
		//获取消费税cell文件和缴款书
		bblist = bblist.split(',');
		JNSK_SZETEMP=0;
		JNSK_YZETEMP=0;
		for (i=0;i<bblist.length;i++){
			if (bblist[i]!=''&&bblist[i].indexOf('_pre')>0){
				    FileName=pathTemp+ "\\" +bblist[i];
				    Cell_OpenHis(CellWeb1,FileName);
				    strTemp1=ShowJNSK(top.dateValue);
				    strTemp2=strTemp1.substring(strTemp1.lastIndexOf('#:')+2,strTemp1.length);
				    strTemp3=strTemp1.substring(strTemp1.lastIndexOf('#:',strTemp1.lastIndexOf('@:'))+2,strTemp1.lastIndexOf('@:'));
				    JNSK_YZETEMP=JNSK_YZETEMP+parseFloat(strTemp3);
				    JNSK_SZETEMP=JNSK_SZETEMP+parseFloat(strTemp2);
				    strTemp1=strTemp1.replace('#:'+strTemp3+'@:','#:'+JNSK_YZETEMP.toFixed(2)+'@:');
				    strTemp1=strTemp1.replace('#:'+strTemp2,'#:'+JNSK_SZETEMP.toFixed(2));
	        	initXllb(bblist[i]);  //初始化下拉框
	        	Cell_ResetSBRQ(smtPath,bblist[i].substring(0,bblist[i].indexOf('_')));  
				    strCellData = Cell_WriteXmlStr();
	        	if (strCellData=="") {
	        			return false;
	        	}
	        	document.getElementById(bblist[i].substring(0,bblist[i].indexOf('_'))).value=strCellData;
			}
		}
  	top.showJNSK_JS(strTemp1,doUploadCellData_js_xfs,smtPath,zsxm,zsxmdm,nsrsbh,sssqq,sssqz,version,server_versiondate,savePath,sheetStr,sbfs,strCellData,newWind);
    
}

function doUploadCellData_js_xfs(smtPath,zsxm,zsxmdm,nsrsbh,sssqq,sssqz,version,server_versiondate,savePath,sheetStr,sbfs,strCellData,newWind){
	 		top.showProgressBar("生成申报文件...");
     
     	//把获取的数据填入form,用于提交
      Pub_sb_saveFlag=1;
			document.getElementById("ssqq").value=sssqq;
	    document.getElementById("ssqz").value=sssqz;
	    document.getElementById("version").value=version;
	    document.getElementById("server_versiondate").value =server_versiondate ;
	    document.getElementById("nsrsbh").value=nsrsbh;
	    document.all.dzsbForm.target="sbframe";
	    document.all.dzsbForm.action=smtPath+"/dzsb.do?act=sb&zsxm="+zsxm+"&sbfs="+sbfs;
	    document.all.dzsbForm.submit();
}*/

//设置工具栏按钮不可见,btnid:字符串,按钮id;isVisible:boolean,设否可见,false隐藏,true可见
function setBtnVisible(btnid,isVisible){
	try{
		if (top){
			top.setVisible(btnid,isVisible);
		}
	}
	catch(e){}
}
//根据cell页签改变标题名称
function changeTabTitle(newTitle){
	try{
		if (top){
			top.changeTabTitleByCell(newTitle);
		}
	}
	catch(e){}
}

//增值税表，当切换页签时，JSP中工具条中的按钮有选择的出现
//CllSheetName:Cll中页签名称
function SelectButton(CllSheetName){
	//String.prototype.trim=function (){ return this.replace(/(^\s*)|(\s*$)/g,"")};
//alert(zsxmdm+"-"+zsxm+"-"+nsrsbh+"-"+ sssqq+ "-" + sssqz+ ":" + server_versiondate);	
 	//if (CellWeb1.IsModified == 1) //cll修改了就可以在切换页签时保存
 	//{
   // if (bddm.trim()!="" && nsrsbh.trim()!=""&& sssqq.trim()!=""&& sssqz.trim()!=""&& server_version.trim()!="")
   // {
  	//  cell_save(CellWeb1,nsrsbh,sssqq,sssqz,server_version,bddm,2);
   // }
//  }
	//changeTabTitle(CllSheetName);
/*  switch (CllSheetName) 
  {
    case "主表":
         setBtnVisible("btn_mediasb",true);    //介质申报
         setBtnVisible("btn_sb",true);         //网上申报
         setBtnVisible("btn_downloadmx",false); //下载明细
         setBtnVisible("btn_insertFPMX",false);         //导入发票明细
         setBtnVisible("btn_ok",false);         //导入普票明细
         break;
    case "附表一":
   		 setBtnVisible("btn_mediasb",false);    //介质申报
         setBtnVisible("btn_sb",false);         //网上申报
         setBtnVisible("btn_downloadmx",false); //下载明细
         setBtnVisible("btn_insertFPMX",false);         //导入发票明细
         break;
    case "附表二":
    case "固定资产进项税的抵扣情况表":
    	 setBtnVisible("btn_sb",false);  	//网上申报
    	 setBtnVisible("btn_downloadmx",false); //下载明细
         setBtnVisible("btn_insertFPMX",false);         //导入发票明细
         setBtnVisible("btn_ok",false);         //导入普票明细
    	 break;       
    case "海关完税凭证":
    	 setBtnVisible("btn_mediasb",false);    //介质申报
         setBtnVisible("btn_sb",false);         //网上申报
         setBtnVisible("btn_downloadmx",false); //下载明细
         setBtnVisible("btn_insertFPMX",false);         //导入发票明细
         break;
    case "纳税情况说明表":
         setBtnVisible("btn_mediasb",false);    //介质申报
         setBtnVisible("btn_sb",false);         //网上申报
         setBtnVisible("btn_downloadmx",false); //下载明细
         setBtnVisible("btn_ok",false);         //导入普票明细
         setBtnVisible("btn_insertFPMX",false);         //导入发票明细
         break;
    case "附表三":
    	 setBtnVisible("btn_mediasb",false);    //介质申报
         setBtnVisible("btn_sb",false);         //网上申报
         setBtnVisible("btn_downloadmx",false); //下载明细
         setBtnVisible("btn_ok",false);         //导入普票明细
         setBtnVisible("btn_insertFPMX",false);         //导入发票明细
		 break;
    case "运费发票":
   		 setBtnVisible("btn_mediasb",false);    //介质申报
         setBtnVisible("btn_sb",false);         //网上申报
         setBtnVisible("btn_downloadmx",false); //下载明细
         setBtnVisible("btn_insertFPMX",false);         //导入发票明细
         break;
  } 	

*/	
	
}
function DownloadMX(smtPath,nsrsbh,nsrmc,sssq){
	
	bblx='';
  sheetname=CellWeb1.GetSheetLabel(CellWeb1.GetCurSheet());
	switch (sheetname) {
		case "附表三":bblx=3;bblxmc = "附表三  防伪税控增值税专用发票申报抵扣明细";width=450;height=200;isAllowMax=false;break;
		case "附表四":bblx=4;bblxmc = "附表四  防伪税控增值税专用发票存根联明细";width=450;height=200;isAllowMax=false;break;
		case "附表五":bblx=5;bblxmc = "附表五  税控运费发票申报抵扣清单";width=700;height=500;isAllowMax=true;break;
		//case "附表七":bblx=7;bblxmc = "附表七  废旧物质销售(税控)发票申报抵扣明细";width=700;height=500;isAllowMax=true;break;
		//case "附表九":bblx=9;bblxmc = "附表九  废旧物资发票开具清单";width=450;height=200;isAllowMax=false;break;
		default:break;
	}	
	if(bblx == '5')    
		top.showDownloadMX('{bblx:'+bblx+',width:'+width+',height:'+height+',bblxmc:"'+bblxmc+'",nsrsbh:"'+nsrsbh+'",nsrmc:"'+nsrmc+'",sssq:'+sssq+',isAllowMax:'+isAllowMax+'}');
	else if(bblx == '3' || bblx == '4')
		top.downCellMx(nsrsbh,bblx,nsrmc,sssq);
	else
		top.newAlert("提示","本附表不能下载明细"+strTemp,"OK",top.Ext.emptyFn);
}


//-------------------------------------------------//
//功能：打印时设置小计行
//CntSheet_p:打印页数；XRow_p：X坐标；MaxLine_p: 每页打印行数　
//MaxCol_p: 最大列；
//-------------------------------------------------//
function cell_setxj(CellWeb,CntSheet_p,XRow_p,MaxLine_p,MaxCol_p,iCurSheet_p,EndRow_p,MaxRow_p,tmp_p,iLoop1){
	var iLoop2,curRow,iCurSheet ;
	var iCntSheet,XRow,MaxLine,MaxCol,EndRow,MaxRow;
	var strTemp,startCell,endCell,iTemp;
 	iCntSheet = parseInt(CntSheet_p);
	XRow      = parseInt(XRow_p);
	MaxLine   = parseInt(MaxLine_p);
	MaxCol    = parseInt(MaxCol_p);
	iCurSheet = parseInt(iCurSheet_p);
	EndRow    = parseInt(EndRow_p);
	MaxRow    = parseInt(MaxRow_p);
	curRow = (XRow +  iLoop1 * MaxLine) + 1 + (iLoop1 - 1);
	if (false && iLoop1==1){
		top.Ext.MessageBox.show({title:'提示',icon:top.Ext.MessageBox.INFO,closable:false,width:320,wait:true,waitConfig:{interval:10000000000000000},modal:false});
		top.Ext.MessageBox.getDialog().dd.lock();
		top.Ext.MessageBox.getDialog().getEl().shadow.hide();
	   	top.Ext.MessageBox.getDialog().getEl().getShim().dom.style.left=top.Ext.MessageBox.getDialog().getBox(true).x;
		top.Ext.MessageBox.getDialog().getEl().getShim().dom.style.top=top.Ext.MessageBox.getDialog().getBox(true).y;
		top.Ext.MessageBox.getDialog().getEl().getShim().dom.style.width=top.Ext.MessageBox.getDialog().getBox(true).width;
		top.Ext.MessageBox.getDialog().getEl().getShim().dom.style.height=top.Ext.MessageBox.getDialog().getBox(true).height;
	}
	if (iLoop1 < iCntSheet){
	  	CellWeb.SetRowPageBreak(curRow,1); //设置分页符 ，最后一页不需要设置
	}
	CellWeb.InsertRow(curRow,1,iCurSheet);//插入小计行
	for (iLoop2 = 1; iLoop2 < MaxCol + 1; iLoop2++){
	  CellWeb.SetCellInput (iLoop2, curRow, iCurSheet, 1 );//可写
	}
	CellWeb.Paste (1,curRow,0,1,0);//将总计行复制到当前新增行
    for (iLoop2 = 1; iLoop2 < MaxCol + 1; iLoop2++){
	  	if (CellWeb.GetCellString(iLoop2,curRow,iCurSheet) == "合计"){  
			CellWeb.SetCellInput (iLoop2, curRow, iCurSheet, 1); //可写
			CellWeb.S (iLoop2,curRow,iCurSheet,"小计");
	  	}
	  	strTemp = CellWeb.GetCellDouble2(iLoop2, curRow, iCurSheet);
	  	if (strTemp > 0){ //如果有值，证明应该有公式
			CellWeb.SetCellInput (iLoop2, curRow, iCurSheet, 1 );//可写
			startCell = CellWeb.CellToLabel(iLoop2,curRow - 1 - 25 + 1);
			endCell   = CellWeb.CellToLabel(iLoop2,curRow - 1);//
			strTemp = "SUM(" + startCell + ":" + endCell + ")";
			iTemp = CellWeb.SetFormula(iLoop2,curRow,iCurSheet,strTemp);//'重设小计公式
	 	}
    }
    if (iLoop1<iCntSheet){//最后一页不执行递归调用
//    	top.Ext.MessageBox.updateProgress(iLoop1/CntSheet_p,'正在加载第'+iLoop1+'页/共'+CntSheet_p+'页...','生成打印预览');
    	setTimeout (function(){cell_setxj(CellWeb,CntSheet_p,XRow_p,MaxLine_p,MaxCol_p,iCurSheet_p,EndRow_p,MaxRow_p,tmp_p,++iLoop1);},2);
    }else{//最后一页才执行
//    	top.Ext.MessageBox.hide();
    	CellWeb.CalculateSheet(iCurSheet);
  		CellWeb.PrintSetBottomTitle(EndRow + 1 + iCntSheet ,MaxRow + iCntSheet);
  		CellWeb.PrintSetTopTitle (2,tmp_p);
  		CellWeb_print_Preview (1);
		CellWeb.CloseFile();
  		CellWeb.ResetContent();
  		CellWeb.Clear(32);
  		
    }
}


function Cell_ResetSBRQ(webcellpath,zsxm)
{
	  XmlFileName = webcellpath+"/sb/reset_sbrq.xml";
		var xmlDoc = new ActiveXObject("MSXML2.DOMDocument.3.0");
		xmlDoc.async=false;
		xmlDoc.resolveExternals=true;  
		xmlDoc.load(XmlFileName);

    nodes = xmlDoc.selectNodes("//ROOT/"+zsxm+"/RecID");
    if(nodes != null)
    { 
      strXML = "<?xml version=\"1.0\" encoding=\"GBK\" ?><Root>";
      for ( j=0; j<nodes.length; j++) {
        strXML = strXML + nodes[j].xml;
      }
      strXML = strXML + "</Root>" ;
      strXML = strXML.replace(new RegExp("####-##-##","g"), top.dateValue) ;
    }
    if(strXML!="") 
			if(Cell_DispXml(strXML,false) == false)
			{ 
	  		alert("初始化数据出错！");
			  return;
		  }
}



function Pause(obj,iMinSecond){    
   if (window.eventList==null) window.eventList=new Array();    
   var ind=-1;    
   for (var i=0;i<window.eventList.length;i++){    
       if (window.eventList[i]==null) {    
         window.eventList[i]=obj;    
         ind=i;    
         break;    
        }    
    }    
   if (ind==-1){    
   ind=window.eventList.length;    
   window.eventList[ind]=obj;    
   }    
  setTimeout("GoOn(" + ind + ")",iMinSecond);    
}    
  
//js继续函数   
function GoOn(ind){    
  var obj=window.eventList[ind];    
  window.eventList[ind]=null;    
  if (obj.NextStep) obj.NextStep();    
  else obj();    
}   
//报表存在多个凭证序号时，提示申报情况
//function pzxhMsg(){ 
//	if(pzxh_msg!=null && pzxh_msg.length >0)
//		top.newAlert("提示",pzxh_msg,"OK","");
//} 

//设置报表是否只读
function setCellReadOnly(readOnly){
	CellWeb1.WorkbookReadonly = readOnly;
}
//向cell写值
function cellData_W(paramName,index, value){
	Cell_CtrlDataW(CellWeb1,paramName,index,value);
}
//向cell写值
function cellData_R(paramName,index){
	return Cell_CtrlDataR(CellWeb1,paramName,index);
}