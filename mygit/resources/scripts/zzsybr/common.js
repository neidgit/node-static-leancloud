$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
$(document).ready(
		function() {
			$.blockUI.defaults.message = "<h5><img src='"+contextPath+"/resources/images/busy.gif' /> 正在处理, 请稍候...</h5>";
			if(ssqrqbz == "XZRQ" && dqbz != "nm"){
				$("#selectFb").hide();
				$("#div_id_infoSSSQ").dialog({
					bgiframe:       true ,
					autoOpen : 		false,
					modal : 		true,
					height : 		200,
					width : 		400,
					closeOnEscape : false,
					resizable : 	true,
					draggable :     true,
					position: 		[320,130],
					buttons : {"确定": function() {createToolOK();},
							"取消": function() {ret_userinfo();}}
				});
				$('#div_id_infoSSSQ').dialog('open');
				$('#div_id_infoSSSQ').dialog('moveToTop');
				$("#bddmName").val(bdmc);
				$("#timeQ").val(crtTimeFtt(sssqq));
				$("#timeZ").val(crtTimeFtt(sssqz));
			}else{
				createTool();
			}
		});
function crtTimeFtt(val) {
    if (val!= null && val.length==8) {
    	//var date = new Date(val);
    	//return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    	return val.substring(0,4)+"-"+val.substring(4,6)+"-"+val.substring(6,8);
    }
}
function createToolOK(){
	sssqq = $("#timeQ").val().replace(/-/g,'');
	if (sssqq == null || sssqq == "") {
		alert("请选择所属期起！");
		return;
	}
	sssqz = $("#timeZ").val().replace(/-/g,'');
	if (sssqz == null || sssqz == "") {
		alert("请选择所属期止！");
		return;
	}
	if (sssqq > sssqz) {
		alert("起时间不能晚于止时间,请重新选择！");
		return;
	}
	$.ajax({
		type: "POST",
		url: contextPath + "/ajaxDo.do",
		dataType: "json",
		data: {
			method : "cxSbzt",
			bddm : bddm,
			sssqq : sssqq,
			sssqz : sssqz
		},success: function(data){
			if(data != null && (data.sbzt == "2" || data.sbzt == "1")){
				$('#div_id_infoSSSQ').dialog('close');
				$("#selectFb").show(); 
				createTool();
			} else {
				alert("您选的所属期的报表还未申报，请从新选择！");
			}
	   }
	});
}
function createTool(){
	if(!(typeof(menuId)=="undefined") && "62" == menuId){
		if(dqbz == "nm"){
			createToolbar_zzsYbjc_NM('T');
		}else{
			createToolbar_zzsYbjc('T');
		}
	}
	else if(gdzcbz == "Y" && bddm=="SBCM815"){
		createToolbar_SBCM815();
	}
	else if(bddm=="SB00303"){
		createToolbar_SB00303();
	}
	
	else if(bddm=="SB00302"){
		createToolbar_SB00302();
	}
	else if(bddm=="ZDSY100"){
		createToolbar_ZDSY100();
	}
	else if(bddm=="SSDC100"){
		createToolbar_SSDC100();
	}
	else if(bddm.indexOf('CWBB')>-1)
		createToolbar_CWBB();
	else if(bddm != "" && bddm != null && "noSave"!=noSave)
		createToolbar('T');
	else{
		//document.title="历史报表打印";
		createToolbar_lsbb();
	}
	$("#tablePages .ss").hide();
	$("#tablePages .ss:first").show();
	setTimeout(function(){loadScript(scriptUrl);},300);
}
$(document).on('change',function(e){
	switch(e.target.name){
	case 'MSXMMX-MXXZMC':
		//根据应税项目代码动态添加"增值税税率或征收率"下拉框内容。
		var ssjmxzhzDM = $Map("#HEAD-SSJMXZHZ_DM-0").val();
		var msxmDm = $(e.target).children('option:selected').val();
		if(ssjmxzhzDM.indexOf(msxmDm) == -1){
			alert("您选择的减免税性质代码未备案，请重新选择");
		}
		break;
	case 'JSXMMX-JMXZMC':
		//根据应税项目代码动态添加"增值税税率或征收率"下拉框内容。
		var ssjmxzhzDM = $Map("#HEAD-SSJMXZHZ_DM-0").val();
		var msxmDm = $(e.target).children('option:selected').val();
		if(ssjmxzhzDM.indexOf(msxmDm) == -1){
			alert("您选择的减免税性质代码未备案，请重新选择");
		}
		break;
	}
});



function createToolbar(useable) {
	var toolbar = new Toolbar( {
		renderTo : 'toolbarId',
		border : 'top',
		items : [ 
			{type : 'button',text : '返回',bodyStyle : 'new',useable : 'T',handler : function(){ret_userinfo();}},
			{type : 'button',text : '保存',bodyStyle : 'new',useable : 'T',handler : function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,0);}},
			{type : 'button',text : '校验',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'jy');}},
			{type : 'button',text : '申报',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'sb');}},
			{type : 'button',text : '打印/导出',bodyStyle : 'new',useable : 'T',handler : function(){preview();}
		} ],
		active : 'ALL'//激活哪个
	});
	toolbar.render();
	toolbar.genAZ();
}
function createToolbar_CWBB(useable) {
	var toolbar = new Toolbar( {
		renderTo : 'toolbarId',
		border : 'top',
		items : [ 
		         {type : 'button',text : '返回',bodyStyle : 'new',useable : 'T',handler : function(){ret_userinfo();}},
		         {type : 'button',text : '保存',bodyStyle : 'new',useable : 'T',handler : function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,0);}},
		         {type : 'button',text : '校验',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'jy');}},
		         {type : 'button',text : '申报',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'sb');}},
		         {type : 'button',text : '导入',bodyStyle : 'new',useable : 'T',handler : function(){importCwbbExcel();}},
		         {type : 'button',text : '打印/导出',bodyStyle : 'new',useable : 'T',handler : function(){preview();}
		         } ],
		         active : 'ALL'//激活哪个
	});
	toolbar.render();
	toolbar.genAZ();
}
function createToolbar_SB00303(useable) {
	var toolbar = new Toolbar( {
		renderTo : 'toolbarId',
		border : 'top',
		items : [ 
			{type : 'button',text : '返回',bodyStyle : 'new',useable : 'T',handler : function(){ret_userinfo();}},
			{type : 'button',text : '保存',bodyStyle : 'new',useable : 'T',handler : function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,0);}},
			{type : 'button',text : '校验',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'jy');}},
			{type : 'button',text : '申报',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'sb');}},
			{type : 'button',text : '打印/导出',bodyStyle : 'new',useable : 'T',handler : function(){preview();}},
			{type : 'button',text : '导入附表四',bodyStyle : 'new',useable : 'T',handler : function(){importXFS_JLFB4();}
		} ],
		active : 'ALL'//激活哪个
	});
	toolbar.render();
	toolbar.genAZ();
}
function createToolbar_SB00304(useable) {
	var toolbar = new Toolbar( {
		renderTo : 'toolbarId',
		border : 'top',
		items : [ 
			{type : 'button',text : '返回',bodyStyle : 'new',useable : 'T',handler : function(){ret_userinfo();}},
			{type : 'button',text : '保存',bodyStyle : 'new',useable : 'T',handler : function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,0);}},
			{type : 'button',text : '校验',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'jy');}},
			{type : 'button',text : '申报',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'sb');}},
			{type : 'button',text : '打印/导出',bodyStyle : 'new',useable : 'T',handler : function(){preview();}},
			{type : 'button',text : '导入附表四',bodyStyle : 'new',useable : 'T',handler : function(){importXFS_JLFB4();}},
			{type : 'button',text : '销售及入库数量',bodyStyle : 'new',useable : 'T',handler : function(){showcpyMessage();}
		} ],
		active : 'ALL'//激活哪个
	});
	toolbar.render();
	toolbar.genAZ();
}
function createToolbar_zzsYbjc(useable) {
	var toolbar = new Toolbar( {
		renderTo : 'toolbarId',
		border : 'top',
		items : [ 
			{type : 'button',text : '返回',bodyStyle : 'new',useable : 'T',handler : function(){ret_userinfo();}},
			{type : 'button',text : '保存',bodyStyle : 'new',useable : 'T',handler : function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,0);}},
			//{type : 'button',text : '校验',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'jy');}},
			//{type : 'button',text : '手工归集',bodyStyle : 'new',useable : useable,handler : function(){toOpenSggj();}},
			{type : 'button',text : '生成报表',bodyStyle : 'new',useable : useable,handler : function(){toZzsYbr();}},//checkCell(jyData,'sb');
			{type : 'button',text : '打印/导出',bodyStyle : 'new',useable : 'T',handler : function(){preview();}
		} ],
		active : 'ALL'//激活哪个
	});
	toolbar.render();
	toolbar.genAZ();
}
function createToolbar_zzsYbjc_NM(useable) {
	var toolbar = new Toolbar( {
		renderTo : 'toolbarId',
		border : 'top',
		items : [ 
			{type : 'button',text : '返回',bodyStyle : 'new',useable : 'T',handler : function(){ret_userinfo();}},
			{type : 'button',text : '保存',bodyStyle : 'new',useable : 'T',handler : function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,0);}},
			{type : 'button',text : '校验',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'jy');}},
			//{type : 'button',text : '手工归集',bodyStyle : 'new',useable : useable,handler : function(){toOpenSggj();}},
			{type : 'button',text : '生成报表',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'sb');}},
			{type : 'button',text : '打印/导出',bodyStyle : 'new',useable : 'T',handler : function(){preview();}
		} ],
		active : 'ALL'//激活哪个
	});
	toolbar.render();
	toolbar.genAZ();
}
function createToolbar_SBCM815(useable) {
	var toolbar = new Toolbar( {
		renderTo : 'toolbarId',
		border : 'top',
		items : [ 
			{type : 'button',text : '返回',bodyStyle : 'new',useable : 'T',handler : function(){ret_userinfo();}},
			{type : 'button',text : '保存',bodyStyle : 'new',useable : 'T',handler : function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,0);}},
			{type : 'button',text : '校验',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'jy');}},
			{type : 'button',text : '申报',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'sb');}},
			{type : 'button',text : '固定资产加速折旧',bodyStyle : 'new',useable : 'T',handler : function(){addTaiZCell();}},
			{type : 'button',text : '打印/导出',bodyStyle : 'new',useable : 'T',handler : function(){preview();}
		} ],
		active : 'ALL'//激活哪个
	});
	toolbar.render();
	toolbar.genAZ();
}
function createToolbar_SB00302(useable) {
	var toolbar = new Toolbar( {
		renderTo : 'toolbarId',
		border : 'top',
		items : [ 
			{type : 'button',text : '返回',bodyStyle : 'new',useable : 'T',handler : function(){ret_userinfo();}},
			{type : 'button',text : '保存',bodyStyle : 'new',useable : 'T',handler : function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,0);}},
			{type : 'button',text : '校验',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'jy');}},
			{type : 'button',text : '申报',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'sb');}},
			{type : 'button',text : '打印/导出',bodyStyle : 'new',useable : 'T',handler : function(){preview();}},
			{type : 'button',text : '导入',bodyStyle : 'new',useable : 'T',handler : function(){importXFS_YL();}}
			],
		active : 'ALL'//激活哪个
	});
	toolbar.render();
	toolbar.genAZ();
}
function createToolbar_ZDSY100(useable) {
	var toolbar = new Toolbar( {
		renderTo : 'toolbarId',
		border : 'top',
		items : [ 
			{type : 'button',text : '返回',bodyStyle : 'new',useable : 'T',handler : function(){ret_userinfo();}},
			{type : 'button',text : '保存',bodyStyle : 'new',useable : 'T',handler : function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,0);}},
			{type : 'button',text : '校验',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'jy');}},
			//{type : 'button',text : '申报',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'sb');}},
			{type : 'button',text : '审核',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'sb');}},
	        {type : 'button',text : '审核结果',bodyStyle : 'new',useable : 'T',handler : function(){ZdsyQuery();}},
			{type : 'button',text : '打印/导出',bodyStyle : 'new',useable : 'T',handler : function(){preview();}}
			 //{type : 'button',text : '导入',bodyStyle : 'new',useable : 'T',handler : function(){importXFS_YL();}}
			],
		active : 'ALL'//激活哪个
	});
	toolbar.render();
	toolbar.genAZ();
}
function createToolbar_SSDC100(useable) {
	var toolbar = new Toolbar( {
		renderTo : 'toolbarId',
		border : 'top',
		items : [ 
			{type : 'button',text : '返回',bodyStyle : 'new',useable : 'T',handler : function(){ret_userinfo();}},
			{type : 'button',text : '保存',bodyStyle : 'new',useable : 'T',handler : function(){SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,0);}},
			{type : 'button',text : '校验',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'jy');}},
			//{type : 'button',text : '申报',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'sb');}},
			{type : 'button',text : '审核',bodyStyle : 'new',useable : useable,handler : function(){checkCell(jyData,'sb');}},
	        {type : 'button',text : '审核结果',bodyStyle : 'new',useable : 'T',handler : function(){ZdsyQuery();}},
			{type : 'button',text : '打印/导出',bodyStyle : 'new',useable : 'T',handler : function(){preview();}}
			 //{type : 'button',text : '导入',bodyStyle : 'new',useable : 'T',handler : function(){importXFS_YL();}}
			],
		active : 'ALL'//激活哪个
	});
	toolbar.render();
	toolbar.genAZ();
}


function loadScript(url){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.onreadystatechange = function(){
        if(script.readyState == "loaded" || script.readyState == "complete"){
            script.onreadystatechange = null;
            if(bddm != "" && bddm != null){
            	//qyj20171121 重点税源查询退回数据重新加载
            	if(strTemp == "lsxxjz"){
	            	loadData2Html(bddm,initData);
	            	//先加载下拉框。
	            	initXllb();
	            	//再加载本地明细行初始化数据。
	            	initJjMxXml();
	            	//然后加对表样控制。
	            	init();
	            	//最后加载监听事件。
	            	setListener();
	            	//触发表头公共信息加载。
	            	$("select[name='SFFXCSB_MX-XM']").trigger("change");
	            	$("input[name^='SFFXCSB_MX-']").each(function(){$(this).next().val($(this).val());});
	            	$("#HEAD-NSRSBH-0,#HEAD-NSRMC-0,#HEAD-SSSQQ-0,#HEAD-SSSQZ-0,#HEAD-TBRQ-0,#HEAD-HYMC-0,#HEAD-FRDB-0,#HEAD-ZCDZ-0,#HEAD-SJJYDZ-0,#HEAD-KHZH-0,#HEAD-DJLXDM-0,#HEAD-DHHM-0,#HEAD-KHYHZH-0,#HEAD-DJZCLXMC-0").trigger("change");
            	 //判断是否需要加载本地文件，如果需要，做加载本地文件的初始化，然后加载公式和文件，否则，按原流程加载。
            	//lpp 增加增值税一表集成流程，如果zzsYbjcData有数据，说明是从一表集成跳转过来的，不加载本地数据。直接加载接口和一表集成数据。
            	}else if((zzsYbjcData.length == 0) && IfHaveFile(nsrsbh,sssqq,sssqz,bddm)){
    	 			$.ajax({
    		 			   type: "POST",
    		 			   url: contextPath+"/zzsYbrInit.do",
    		 			   dataType : "json",
    		 			   async:false,
    		 			   data: {
    		 					actID: "unzip",
    		 					data: initXmlVar,
    		 					method: "zipData"
    		 			   },
    		 			   success: function(data){
    						    //loadData2Html(bddm,data.xmlString);
    							//先加载下拉框。
    							initXllb();
    							//lpp 20180321 调整到下拉框初始化后面，有些固定明细行也需要先做下拉框，然后初始化
    							loadData2Html(bddm,data.xmlString);
    							//再加载本地明细行初始化数据。
    							initJjMxXml();
    							//然后加对表样控制。
    							init();
    							//最后加载监听事件。
    							setListener();
    							//触发表头公共信息加载。
    							$("select[name='SFFXCSB_MX-XM']").trigger("change");
    							$("input[name^='SFFXCSB_MX-']").each(function(){$(this).next().val($(this).val());});
    							$("#HEAD-NSRSBH-0,#HEAD-NSRMC-0,#HEAD-SSSQQ-0,#HEAD-SSSQZ-0,#HEAD-TBRQ-0,#HEAD-HYMC-0,#HEAD-FRDB-0,#HEAD-ZCDZ-0,#HEAD-SJJYDZ-0,#HEAD-KHZH-0,#HEAD-DJLXDM-0,#HEAD-DHHM-0,#HEAD-KHYHZH-0,#HEAD-DJZCLXMC-0").trigger("change");
    		 			   }
    	 			});
                }else{
                	setListener();
                    setTimeout(function(){initCell();},300);
                }
            }else{
            	if(strTemp == "newPage"){	//历史报表查询
            		setListener();
            		//loadData2Html(bddm,initData);
            		//先加载下拉框。
            		initXllb();
            		//lpp 2018411 调整到下拉框初始化后面，有些固定明细行也需要先做下拉框，然后初始化(同加载本地文件)
            		loadData2Html(bddm,initData);
            		//再加载本地明细行初始化数据。
            		initJjMxXml();
            		//然后加对表样控制。
            		//init();
            		//最后加载监听事件。
            		$("#HEAD-NSRSBH-0,#HEAD-NSRMC-0,#HEAD-SSSQQ-0,#HEAD-SSSQZ-0,#HEAD-TBRQ-0,#HEAD-HYMC-0,#HEAD-FRDB-0,#HEAD-ZCDZ-0,#HEAD-SJJYDZ-0,#HEAD-KHZH-0,#HEAD-DJLXDM-0,#HEAD-DHHM-0,#HEAD-KHYHZH-0,#HEAD-DJZCLXMC-0").trigger("change");
            		$("input,select").prop('disabled',true);
            		$("#selectFb select").prop('disabled',false);
               		$('input[name="SFFXCSB_MX-ZZSSL"],input[name="SFFXCSB_MX-YYSSL"]').each(function(){
            			$(this).parent().find('select').remove();
            			$(this).replaceWith($(this).val());
            		});
            	}else if(strTemp != "" && "noSave"!=noSave){
            		var fso = new ActiveXObject("Scripting.FileSystemObject");
            		var ts = fso.OpenTextFile(strTemp,ForReading);
            		initXmlVar= ts.ReadAll();
            		$.ajax({
            			type: "POST",
            			url: contextPath+"/zzsYbrInit.do",
            			dataType : "json",
            			async:false,
            			data: {
            				actID: "unzip",
            				data: initXmlVar,
            				method: "zipData"
            			},
            			success: function(data){
            				loadData2Html(bddm,data.xmlString);
            				//先加载下拉框。
            				initXllb();
            				//再加载本地明细行初始化数据。
            				initJjMxXml();
            				//然后加对表样控制。
            				//init();
            				//最后加载监听事件。
            				setListener();
            				$("#HEAD-NSRSBH-0,#HEAD-NSRMC-0,#HEAD-SSSQQ-0,#HEAD-SSSQZ-0,#HEAD-TBRQ-0,#HEAD-HYMC-0,#HEAD-FRDB-0,#HEAD-ZCDZ-0,#HEAD-SJJYDZ-0,#HEAD-KHZH-0,#HEAD-DJLXDM-0,#HEAD-DHHM-0,#HEAD-KHYHZH-0,#HEAD-DJZCLXMC-0").trigger("change");
            				$("input,select").prop('disabled',true);
            				$("#selectFb select").prop('disabled',false);
            			}
            		});
            	}
            }
		  	myInput = $("table").find("input:not([readonly=readonly],[disabled=disabled])"); //获取所有输入框
        }
    };
    script.src = url + '?t='+new Date().getTime();
    document.getElementsByTagName("head")[0].appendChild(script);
}



/**
 * 调用接口，获取cell格式的初始化xml
 * @return
 */
function initCell(){
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
			if(data.success){
				var temp_flag = false;
				//lpp 20170828 增值税一表集成，先把下拉框内容加载上，方便后面初始化。20170922挪到后面
				if(bddm == "SB00213" || bddm == "ZDSY100" || bddm == "SBCA717"){
					initXllb();
				}
				//初始化报表栏次内容。
				var len = data.initJson.length;
				for(i=0;i<len;i++){
					var nodeValue = data.initJson[i].nodeValue;
					var nodeName = data.initJson[i].nodeName;
					var $item = $Map("#"+nodeName);
					//lpp 20180420 所得税年报9010，放后面单独处理。####这个地方用了break;初始化文件再有初始化内容一定要写到9010前面。###
					if(bddm == "SBCM717" && nodeName.indexOf("9010-")!=-1) {
						temp_flag = true;
						break;
					}
					//lpp end
					var nTmp = nodeName.split("-");
					if($item.length==0) {//如果nodeName不是ID
						var $add = $Map("#"+nTmp[0]+"-ADD");
						if(nTmp[0] == "CPBSQ"){
							$add = $Map("#CPB-ADD");
						}
						if($add.length!=0) {	//存在按钮，是明细行
							$item = $("[name='"+nTmp[0]+"-"+nTmp[1]+"']:not(.changeSelect):eq("+nTmp[2]+")");
							if($item.length==0){
								$add.trigger("click");
							}
							$item = $("[name='"+nTmp[0]+"-"+nTmp[1]+"']:not(.changeSelect):eq("+nTmp[2]+")");
						}
					}
					$Val($item,nodeValue);
					if($item.attr("class") == "changeSelect"){
						$item.next().val(nodeValue);
					}
					else if($item.attr("type") == "radio" && nodeValue == 1){
						$item.attr("checked",true); 
					}
					else if($item.attr("type") == "checkbox" && nodeValue == 1){
						$item.attr("checked",true); 
					}
				}
				//if(tkbz == 1) alert("已申报期限：\n" + str);
				if(bddm == "SB00112"){
					var strHzbFzjgMx = $Map("#HEAD-FZJGLIST-0").val();
				//初始化汇总分配表，分支机构信息。
					var arrFzjg = strHzbFzjgMx.split(";");
				    for(var i=0; i<arrFzjg.length-1; i++){
				    	//var arrTemp = arrFzjg[i].split("^");
				    	$Map('#FZJGXSSRMX-ADD').trigger("click");
				    	$('#hznszzsTable .insertBefore').prev().find("[name='FZJGXSSRMX-FZJGNSRSBH']").val(arrFzjg[i]);
				    }
				}
				//初始化表样上的下拉框内容。
				if(bddm != "SB00213" && bddm != "ZDSY100" && bddm != "SBCA717"){//增值税一表集成的情况，先做下拉框，再做初始化。
					initXllb();
				}
				//根据初始化内容，控制报表栏次。
				//lpp 20180420 所得税年报9010单独处理
				if(bddm == "SBCM717"){
					init(data.initData,temp_flag);
				}else if(bddm == "SBCA702"){
					init("notbz");//没有加载本地
				}else{
					init();
				}
				
				//lpp 本来写到这个方法外面，发现下拉框等数据加载不到，写到其他初始化完成之后。
				 //lpp 加载一表集成数据。
                if(zzsYbjcData.length>0){
                	//删除明细行初始数据
                	$('#JSXMMX-ADD,#MSXMMX-ADD,#SFFXCSB_MX-ADD').parents('table').find('.append').nextUntil('.insertBefore').remove();
                	loadData2Html(bddm,zzsYbjcData);
					//再加载本地明细行初始化数据。
 					initJjMxXml();
	            	$("select[name='SFFXCSB_MX-XM']").trigger("change");
                }
			}else{
				noSave="noSave";
				self.location = encodeURI(contextPath+"/error.jsp?errmsg="+data.err_msg);
			}
		}
	}); 
}



//*********************************qyj************************
//初始化报表栏次内容
function initXml(xml){
	//获取初始化的变量
	var xmlDoc = $.parseXML(xml);
	var x = $(xmlDoc).find("Root RecID");
	//根据id获取单元格进行赋值
	for (i=0;i<x.length;i++){
		var sTableName = x[i].getAttribute("TableName");
		var iRow = x[i].getAttribute("Row");
		var iCountField = x[i].childNodes.length;
		for(j=0;j<iCountField;j++){
			var sNodeName = x[i].childNodes[j].nodeName;
			var sNodeText = x[i].childNodes[j].text;
			if(sNodeText == "0" || sNodeText == "0.0" || sNodeText == "0.00"){
				sNodeText = "";
			}
			var id = sTableName+"-"+sNodeName+"-"+iRow;
			$Map("#"+id+"").val(sNodeText);
		}
	}
}



//导入
function importCwbbExcel(){
	//清空文件input框
	var file = $("#cwbbimpFile");
	file.after(file.clone().val("")); 
	file.remove(); 
	$("#self_info_div_id_cwbbimp").dialog({
		bgiframe : true,
		autoOpen : false,
		modal : true,
		height : 250,
		width : 650,
		closeOnEscape : false,
		resizable : true,
		draggable : true,
		position : [ 220, 80 ],
		buttons : {"导入": function() {uploadCwbbExcel();},
				"取消": function() {$( this ).dialog( "close" );}}
	});

	$('#self_info_div_id_cwbbimp').dialog('open');
	$('#self_info_div_id_cwbbimp').dialog('moveToTop');
}
function uploadCwbbExcel(){
	if(impFileCheck()){
		$( '#self_info_div_id_cwbbimp' ).dialog( "close" );
		$.ajaxFileUpload({
	        fileElementId: 'cwbbimpFile',    //需要上传的文件域的ID，即<input type="file">的ID。
	        url: contextPath+"/zzsYbrInit.do?method=uploadCwbbExcel&bddm="+bddm, //后台方法的路径
	        type: 'post',   //当要提交自定义参数时，这个参数要设置成post
	        secureuri: false,   //是否启用安全提交，默认为false。
	        async : true,   //是否是异步
	        success: function(data) {   //提交成功后自动执行的处理函数，参数data就是服务器返回的数据。
	        	initGdIDXml(data.xml,false);
	        }
	    });
	}
}
function impFileCheck(){
	var impFile = document.getElementById('cwbbimpFile');
        return /.(xls|xlsx|7z|xml)$/.test(impFile.value)?true:(function() {
            alert('该功能只支持excel, xml, 7z压缩文件');
            return false;
        })();
}
//导入
function importXFS_JLFB4(){
	//清空文件input框
	var file = $("#XfsJlfile");
	file.after(file.clone().val("")); 
	file.remove(); 
	$("#self_info_div_id_infoXFSJLFB4").dialog({
		bgiframe : true,
		autoOpen : false,
		modal : true,
		height : 250,
		width : 650,
		closeOnEscape : false,
		resizable : true,
		draggable : true,
		position : [ 220, 80 ],
		buttons : {"导入": function() {$( this ).dialog( "close" );upLoadXFSJlFb4File();},
				"取消": function() {$( this ).dialog( "close" );}}
	});

	$('#self_info_div_id_infoXFSJLFB4').dialog('open');
	$('#self_info_div_id_infoXFSJLFB4').dialog('moveToTop');
}
//20180321
function xfscpy_ok(){
	   
	    var xssl_qy_ycqy =  $Map("#HEAD-XSSL_QY_YCQY-0").val(); 
 	 	var xssl_rhy_rhy =  $Map("#HEAD-XSSL_RHY_RHY-0").val(); 
 	 	var rksl_qy = $Map("#HEAD-RKSL_QY-0").val(); 
 	 	var rksl_cy = $Map("#HEAD-RKSL_CY-0").val(); 
 	 	var rksl_sny = $Map("#HEAD-RKSL_SNY-0").val(); 
 	 	var rksl_rhy = $Map("#HEAD-RKSL_RHY-0").val();  
 	 	var rksl_rly = $Map("#HEAD-RKSL_RLY-0").val(); 
 	 	
 	 	var ycqy_xxsl_input = $("#ycqy_xssl_input").val();
 	 	
	 	var zcqy_sl_input = $("#zcqy_sl_input").val();
	 	var rhy_sl_input = $("#rhy_sl_input").val();
	 	var qy_zjxxsl_input = $("#qy_zjxxsl_input").val();
	 	var cy_zjxxsl_input = $("#cy_zjxxsl_input").val();
	 	var sny_zjxxsl_input = $("#sny_zjxxsl_input").val();
	 	var rhy_zjxxsl_input = $("#rhy_zjxxsl_input").val();
	 	var rly_zjxxsl_input = $("#rly_zjxxsl_input").val();
	 	
 	 	if(parseInt(xssl_qy_ycqy)>0)
 	 	{  
 	 		$("#HEAD-YCQY_XXSL-0").val(ycqy_xxsl_input);
 	 		$("#HEAD-ZCQY_SL-0").val(zcqy_sl_input);
 	 	    //setInput("A0N1402Y_YCQY_XXSL",0,"-1",ycqy_xxsl_input,2,1);
 	 	    //setInput("A0N1402Y_ZCQY_SL",0,"-1",zcqy_sl_input,2,1);
 	 	}
 	 	if(parseInt(xssl_rhy_rhy)>0)
 	 	{	 // cellData_W("A0V0050Y_RHY_SL",0,rhy_sl_input);
 	 		//setInput("A0N1402Y_RHY_SL",0,"-1",rhy_sl_input,2,1);
 	 		$("#HEAD-RHY_SL-0").val(rhy_sl_input);
 	 	}
		 if(parseInt(rksl_qy)>0)
 	 	{	 //cellData_W("A0V0050Y_QY_ZJXXSL",0,qy_zjxxsl_input);
 	 	     //setInput("A0N1402Y_QY_ZJXXSL",0,"-1",qy_zjxxsl_input,2,1);
			 $("#HEAD-QY_ZJXXSL-0").val(qy_zjxxsl_input);
 	 	}
		 if(parseInt(rksl_cy)>0)
 	 	{	// cellData_W("A0V0050Y_CY_ZJXXSL",0,cy_zjxxsl_input);
 	 	    // setInput("A0N1402Y_CY_ZJXXSL",0,"-1",cy_zjxxsl_input,2,1);
			 $("#HEAD-CY_ZJXXSL-0").val(cy_zjxxsl_input);
 	 	}
		 if(parseInt(rksl_sny)>0)
 	 	{	 //cellData_W("A0V0050Y_SNY_ZJXXSL",0,sny_zjxxsl_input);
 	 	   //  setInput("A0N1402Y_SNY_ZJXXSL",0,"-1",sny_zjxxsl_input,2,1);
			 $("#HEAD-SNY_ZJXXSL-0").val(sny_zjxxsl_input);
 	 	}
		if(parseInt(rksl_rhy)>0)
 	 	{	// cellData_W("A0V0050Y_RHY_ZJXXSL",0,rhy_zjxxsl_input);
 	 	    // setInput("A0N1402Y_RHY_ZJXXSL",0,"-1",rhy_zjxxsl_input,2,1);
			$("#HEAD-RHY_ZJXXSL-0").val(rhy_zjxxsl_input);
 	 	}
		 if(parseInt(rksl_rly)>0)
 	 	{	// cellData_W("A0V0050Y_RLY_ZJXXSL",0,rly_zjxxsl_input);
 	 	    // setInput("A0N1402Y_RLY_ZJXXSL",0,"-1",rly_zjxxsl_input,2,1);
			 $("#HEAD-RLY_ZJXXSL-0").val(rly_zjxxsl_input);
	    }
	 	//jspCellInitCtrl("show");
	 	//void(0);
	 	
	 	

	
}
function showcpyMessage(){
	
	$("#self_info_div_id_cpy").dialog({
			bgiframe:       true ,
		autoOpen : 		false,
		modal : 		true,
		height : 		250,
		width : 		650,
		closeOnEscape : false,
		resizable : 	true,
		draggable :     true,
		position: 		[220,80],
		open :   function() {
			$(".ui-dialog-titlebar-close").hide();
		},
		buttons : {"确定": function() {$( this ).dialog( "close" );xfscpy_ok();},
			"取消": function() {$( this ).dialog( "close" );}}
	});
	
	$('#self_info_div_id_cpy').dialog('open');
	$('#self_info_div_id_cpy').dialog('moveToTop');
	//20180321
	//var ybtse = $Map("#HEAD-YBTSE-0").val();
	var xssl_qy_ycqy = $Map("#HEAD-XSSL_QY_YCQY-0").val(); 
	 	var xssl_rhy_rhy = $Map("#HEAD-XSSL_RHY_RHY-0").val(); 
	 	var rksl_qy =  $Map("#HEAD-RKSL_QY-0").val();
	 	var rksl_cy = $Map("#HEAD-RKSL_CY-0").val(); 
	 	var rksl_sny = $Map("#HEAD-RKSL_SNY-0").val(); 
	 	var rksl_rhy = $Map("#HEAD-RKSL_RHY-0").val(); 
	 	var rksl_rly = $Map("#HEAD-RKSL_RLY-0").val(); 
	 	if(parseInt(xssl_qy_ycqy)>0)
	 	{   $("#ycqy_xssl").show();
	 	}
	 	 if(parseInt(xssl_rhy_rhy)>0)
	 	{	 $("#rhy_sl").show();}
	 	if(parseInt(rksl_qy)>0)
	 	{	$("#qy_zjxssl").show();}
	 	if(parseInt(rksl_cy)>0)
	 	{	$("#cy_zjxssl").show();}
	 	if(parseInt(rksl_sny)>0)
	 	{	$("#sny_zjxssl").show();}
	 	if(parseInt(rksl_rhy)>0)
	 	{	$("#rhy_zjxssl").show();}
	 	if(parseInt(rksl_rly)>0)
	 	{	$("#rly_zjxssl").show();}
	 	
}
//解析读取导入文件。
function upLoadXFSJlFb4File(){
	var path = ($("#XfsJlfile").val());
	var type = path.substring(path.lastIndexOf(".") + 1);
	if ((type == "xls" || type == "xlsx") && path.length >= 4) {
		var tempStr = "";
		//创建操作EXCEL应用程序的实例  
        var oXL = new ActiveXObject("Excel.application"); 
        //打开指定路径的excel文件  
       var oWB = oXL.Workbooks.open(path);  
       //操作第一个sheet(从一开始，而非零)  
       oWB.worksheets(1).select();  
       var oSheet = oWB.ActiveSheet;  
       //使用的行数  
       var rows =  oSheet.usedrange.rows.count;
       try {  
    	   //清空 html
    	   $("#fb403Table").find(".insertBefore").prevAll().remove();
          for (var i = 3; i <= rows; i++) {
             tempStr += "<tr><td style='width:20px'><input type='checkbox' readonly='readonly' name='a' class='radio_btn'/></td>"
            	 	 + "<td style='width:38px'><input name='jlfb4-XH' class='fb4033' readonly='readonly' value='" + parseInt(i-2) +"'/></td>"
            	 	 + "<td><input type='text' name='jlfb4-PM' value='" + oSheet.Cells(i, 3).value + "'/></td>"
            	 	 + "<td><input type='text' name='jlfb4-GE' value='" + oSheet.Cells(i, 4).value + "'/></td>"
            	 	 + "<td><input type='text' class='number' name='jlfb4-JG' value='" + parseFloat(oSheet.Cells(i, 5).value).toFixed(2) + "'/></td>"
            	 	 + "<td colspan='2'><input type='text' class='number' name='jlfb4-ZDJG' value='" + parseFloat(oSheet.Cells(i, 6).value).toFixed(2) + "'/></td>"
            	 	 + "<td><input type='text' name='jlfb4-BZ' value=''/></td></tr>";
          } 
          $("#selectFb").find("select").val("fb4").change();
          $(tempStr).insertBefore($("#fb403Table").find(".insertBefore"));
       } catch(e) {  
          alert("导入失败!");
       }  
       //退出操作excel的实例对象  
       oXL.Application.Quit();
       //初始化附表
       //var fl = cell_InsRow_Down("jlfb4",rows-2,1);
       //Cell_DispXml(tempStr,true);
	}else {
		alert("文件类型错误,请重新选择！");
	}

}
//导入卷烟附表一
function importXFS_YL() {
	//清空文件input框
	var file = $("#myXFSfile");
	file.after(file.clone().val("")); 
	file.remove(); 
	$("#self_info_div_id_infoXFSYLSC").dialog({
		bgiframe : true,
		autoOpen : false,
		modal : true,
		height : 250,
		width : 650,
		closeOnEscape : false,
		resizable : true,
		draggable : true,
		position : [ 220, 80 ],
		buttons : {"导入": function() {$( this ).dialog( "close" );upLoadXFSJYFB1File();},
			"取消": function() {$( this ).dialog( "close" );}}
	});
	$('#self_info_div_id_infoXFSYLSC').dialog('open');
	$('#self_info_div_id_infoXFSYLSC').dialog('moveToTop');

}

function checkCell_editRemark(msgId){
	$("#checkRemark").html(msgJson[msgId].remark);
	$("#self_editRemark_div_id_checkCell").dialog({
			bgiframe:       true ,
		autoOpen : 		false,
		modal : 		true,
		height : 		250,
		width : 		650,
		closeOnEscape : false,
		resizable : 	true,
		draggable :     true,
		position: 		[220,80],
		buttons: {"完成": function() {
				var remark = $("#checkRemark").html();
				msgJson[msgId].remark = remark;
				var itmpTmp = $(msgJson[msgId].inputId);
				if(remark.length>0){
					for(var i=0;i<itmpTmp.length;i++){
						$(itmpTmp[i]).removeClass('error');
						$(itmpTmp[i]).siblings('select').removeClass('error');
						$(itmpTmp[i]).parent().removeAttr('title');
					}
				}else{
					for(var i=0;i<itmpTmp.length;i++){
						$(itmpTmp[i]).addClass("error");
						$(itmpTmp[i]).siblings('select').addClass("error");
						$(itmpTmp[i]).parent().attr("title",this.msg);
					}
				}

				$('#checkCellMsg').find("tr:eq("+(msgId+1)+") td:eq(2)").html(remark);
				$( this ).dialog( "close" );
			},
			"取消": function() {$( this ).dialog( "close" );}}
	});
	$('#self_editRemark_div_id_checkCell').dialog('open');
	$('#self_editRemark_div_id_checkCell').dialog('moveToTop');
}

//点击申报
function checkCell_go(){
	if(bddm == "SBCM717" && Sszctx =="Y"){
		$('#self_info_div_id_Sszctx').dialog('open');
		$('#self_info_div_id_Sszctx').dialog('moveToTop');
	} 
	else {
		doSb_step1('wssb');
	}
		//doSb_step1('wssb');
}

function doSb_step1(fs){
	var sbfs = fs;
	upload_page(contextPath,bddm,nsrsbh,sssqq,sssqz,server_version,jyData,xfsfl,xfsmcfl,sbfs);
}
//上传cell数据
function upload_page(contextPath,bddm,nsrsbh,sssqq,sssqz,server_version,jydata,xfsfl,xfsmcfl,sbfs){
	setTimeout(function(){doUploadCellData(contextPath,bddm,nsrsbh,sssqq,sssqz,server_version,jydata,xfsfl,xfsmcfl,sbfs);},300);
}


//从CELL生成XML上传
function doUploadCellData(contextPath,bddm,nsrsbh,sssqq,sssqz,server_version,jydata,xfsfl,xfsmcfl,sbfs){ 
	var strCellData = cellData();       // 申报文件生成
	if(strCellData == ""){
		return false;
	}
	$("#xmltext").val(strCellData);
	if("HGWS001" == bddm){
		doHgSb();
	}else if("SBCA717" == bddm){//lpp 20180124 所得税A类年报基础信息表提交。
		doJcxxTj();
	}else{
		showJks();
	}
	
}
function showJks(){
	if("CWBB"== bddm.substring(0,4)	|| "SB00908"== bddm|| "ZDSY100"==bddm || "SB00916"== bddm){
		document.getElementById("cwbb_display").style.display = "none";
	}
	if("ZDSY100"==bddm){
		document.getElementById("self_info_div_id_infoJKS").title='申报内容'; 
	}
	//给缴款书赋值。
	var ybtse = $Map("#HEAD-YBTSE-0").val();
	if(ybtse == ""){
		ybtse = "0.00";
	}
	var sjse = $Map("#HEAD-SJSE-0").val();
	if(sjse == ""){
		sjse = "0.00";
	}
	$("#sbrq").val($Map("#HEAD-TBRQ-0").val());
	$("#sssqq").val($Map("#HEAD-SSSQQ-0").val());
	$("#sssqz").val($Map("#HEAD-SSSQZ-0").val());
	$("#ybtse").val(ybtse);
	$("#sjse").val(sjse);
	$("#cellName").val(bdmc);
	$("#self_info_div_id_infoJKS").dialog({
		bgiframe:       true ,
		autoOpen : 		false,
		modal : 		true,
		height : 		250,
		width : 		650,
		closeOnEscape : false,
		resizable : 	true,
		draggable :     true,
		position: 		[220,80],
		buttons :  {
			"下一步": function() {
		          $( this ).dialog( "close" );
		          yksOK();
		        },
	        "取消": function() {
		          $( this ).dialog( "close" );
		        }
		      },
	});
	$('#self_info_div_id_infoJKS').dialog('open');
	$('#self_info_div_id_infoJKS').dialog('moveToTop');
}

function yksOK(){
	if(bddm == "ZDSY100" || bddm == "SSDC100")
		ZdsyTJ();
	else
		doYcs();
}

function doYcs(){
	var xmlText = $("#xmltext").val();
	var signature = null;
	if(carzbz == "1"){
		var certKey = caxh;
		//检查是否插入证书
		if(!AXSecurity.OpenCert(2,certKey,1)){
			alert("没有找到证书，请插数字证书！");
			return false;
		}
		//设置签名证书
		if(!AXSecurity.SetSignerCert(2,certKey)){
			alert("签名证书设置失败:" + AXSecurity.GetLastError());
			return false;
		}
		signature = AXSecurity.SignString(xmlText,true);  //true为签名不带原文  false为带原文
		if (signature == ""){
			alert("签名失败:" + AXSecurity.GetLastError());
			return false;
		} 
	}
	var sbjg = "0";
	var ybtse = 0; 
	var sbfsDm = "34";
	//lpp 20171009 一表集成的时候，修改申报方式代码sbfsDm为35.
	 if(zzsYbjcData.length != 0){
		 sbfsDm = "35";
	 }
	 //lpp 所得税A类年报，需要传填报表单：
	 sbtbb = $("#HEAD-QYSDS_NDSBTBB-0").val();
	$.ajax({
	   type: "POST",
	   url: contextPath + "/ajaxDo.do",
	   dataType: "json",
	   data: {
	   		method : "doYcs",
			bddm: bddm,
			sssqq: sssqq,
			sssqz: sssqz,
			nsrsbh: nsrsbh,
			jmxxData: jmxxData,
			menuId: menuId,
			xmlText: xmlText,
			signature: signature,
			sbtbb:sbtbb,
			sbfsDm : sbfsDm
	   },
	   success: function(data){
		   sbjg = data.ztcode;
		   ybtse = data.ybtse;
		   if(sbjg=="2"){
			   alert(data.RtnMsg);
			   SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,1);
			   $("#toolbarId").text("");
			   if(bddm == "SBCM717"){
				   createToolbar_SBCM717("F");
			   }else{
				   createToolbar('F');
			   }
			   $('input,select').prop('disabled',true);
			   $("#selectFb select").prop('disabled',false);
			   if(data.ybtse > 0.01){
				   if(data.kkbz == "Y"){
					   smsCode(bddm,data.yzpzzlDm,sssqq,sssqz,"WSKK",false, data.smsFlag);
					   //需要扣款，江西所得税年报需要弹框处理：是否需要填写关联业务往来。lpp 20180426
					   jxg3_tsTz_SB00916();
				   }else if(data.kkbz == "N"){
					   var str = "暂不扣款，请于限缴日期前自行在【更新企业申报缴款状态】页面中发起扣款。";
					   if(dqbz == "nb")
						   str = "未发起扣款，如需扣款，需要切换到【网上缴款】-【网上缴款】中查询扣款。";
					   $( "#self_info_div_wskk" ).find('span:first').html(data.ybtse);
					   if(data.isgz == "isgz")
						   $( "#self_info_div_wskk" ).find('#gzAlert').show();
					   else
						   $( "#self_info_div_wskk" ).find('#gzAlert').hide();
					   $( "#self_info_div_wskk" ).find('span:eq(1)').html(str);
					   $( "#self_info_div_wskk" ).dialog({
						    modal: true,
							height : 250,
							width : 700,
						    buttons: {
						        "确定": function() {
						          $( this ).dialog( "close" );
						          if(dqbz == "nm" && sfxyh=="N"){
									   kfstyle(data.djxh,data.yzpzzlDm,data.yzpzxh,data.zgswskfjdm,sssqq,sssqz);
								   }else{
									   if(bddm=="SB00113"){
										   doNextYjb(data.djxh,data.yzpzzlDm,data.yzpzxh,sssqq,sssqz,"WSKK");
									   }else{
										   smsCode(bddm,data.yzpzzlDm,sssqq,sssqz,"WSKK",false, data.smsFlag);
										   //需要扣款，江西所得税年报需要弹框处理：是否需要填写关联业务往来。lpp 20180426
										   jxg3_tsTz_SB00916();
									   }
								   }
						       },
						       "取消": function() {
							          $( this ).dialog( "close" );
							          //需要扣款，江西所得税年报需要弹框处理：是否需要填写关联业务往来。lpp 20180426
							          jxg3_tsTz_SB00916();
						       }
						   }
						});
				   }
			   }else{
				 //不需要扣款，江西所得税年报需要弹框处理：是否需要填写关联业务往来。lpp 20180426
				 jxg3_tsTz_SB00916();
			   }
		   }else{
			   if(data.sfycbd == "Y" || data.sfycbd == "N"){
				   if((bddm=="SB00112" || bddm=="SB00212") && data.bdjgbz == "N"){
					   displayBdjg(data.sfyczb,data.bdjgList,data.RtnMsg);
				   }else{
					   alert(data.RtnMsg);
				   }
			   }else{
				   alert(data.RtnMsg);
			   }
		   }
	   },
	   complete : function(XMLHttpRequest, textStatus) {
	   		var data = XMLHttpRequest.responseText;
	   		if (data == "timeout") {
	   			if (window.top != window.self) {
	   				window.top.location = "relogin.jsp?errmsg=timeout";
	   			}
			}
	   }
	});
}
function displayBdjg(f, bdjgList, msg){
	var btn = null;
	if(f=="F"){
		$("#zzz_Y").hide();
		$("#zzz_S").hide();
		btn = {"取消": function() {$( this ).dialog( "close" );}};
	}
	else{
		if(f=="Y")
		{
			$("#zzz_Y").show();
			$("#zzz_S").hide();
		}
		else if(f=="S")
		{
			$("#zzz_Y").hide();
			$("#zzz_S").show();
		}
		btn = {"继续申报":function(){
			$('#HEAD-SFYCZB-0').val(f);
			$( this ).dialog( "close" );
			$("#xmltext").val(cellData());
			doYcs();
		},
		"取消": function() {$( this ).dialog( "close" );}	};
	}
	$("#bdjgmx tbody").empty();
	var trs = "";
	if(bdjgList.length>0){
		$('#bdjgmx').show();
		$('#dbjgmsg').hide();
		$(bdjgList).each(function(index){ 
			trs += "<tr><td>"+(index+1)+"</td><td>";
			if(this.bdlx=="1"){
				trs += "<font color='red'>"+this.bdmc+"</font>";
			}else{
				trs += this.bdmc;
			}
			trs += "</td><td>"+this.bdnr+"</td><td>"+this.bdbfjgbcnr+"</td></tr>";
		}); 
	}else{
		$('#dbjgmsg').find('td').html(msg);
		$('#dbjgmsg').show();
		$('#bdjgmx').hide();
	}
	$("#self_info_div_id_bdjg").dialog({
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
	});
	$('#self_info_div_id_bdjg').dialog('open');
	$('#self_info_div_id_bdjg').dialog('moveToTop');
	$("#bdjgmx tbody").html(trs);
}
//审核提交
function ZdsyTJ(){
	var xmlText = $("#xmltext").val();
	$.ajax({
		type: "POST",
		url: contextPath + "/Sszctx.do",
		dataType: "json",
		data: {
			method : "sptj",
			bddm : bddm,
			sssqq : sssqq,
			sssqz : sssqz,
			xmlText : xmlText
		},success: function(data){
			if(data != null &&  data.success){
				alert("报表数据提交成功，请等待税务局审核。");
				SaveInfoToFile(bddm,nsrsbh,sssqq,sssqz,1);
				$("#toolbarId").text("");
				//qyj 查询更正时不可撤回
				if(strTemp == "lsxxjz")
					createToolbar_ZDSY100('F');
				else
					reCreateToolbar_ZDSY100('F');
		     	$('input,select').prop('disabled',true);
				$("#selectFb select").prop('disabled',false);
			}else{
				alert(data.returnMessage);
			}
	   }
	});
}
/**
 * lpp 20180426
 * @des 江西，所得税年报申报成功和缴款成功或者缴款取消的时候，提示是否填写关联，如果填写，跳转到关联页面。
 * */
function jxg3_tsTz_SB00916(){
   if(dqbz == "jxg3" && bddm == "SBCM717"){
	   jConfirm("请如实申报企业关联业务往来情况并承担相应法律责任。本公司所属期内是否存在关联业务往来？","操作提示", function (_value) {
			if(_value){
				$("#nav",top.document)[0].contentWindow.clickTree("239");
			}
		});
   }
}
