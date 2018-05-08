		var ForReading = 1;
		var ForWriting = 2;
		var NewWhenNotExists = true;
		var fso=new ActiveXObject("Scripting.FileSystemObject");

		function nbtaxcell_path(path){
			var tmppath = '';
			var lastind_tmppath = 0;
			while(true){
				var ind = path.indexOf('\\',lastind_tmppath+1);
				if(ind<0){
					ind = path.length;
				}
				if (lastind_tmppath==ind){
					break;
					}
				tmppath = path.substring(0,ind);
				lastind_tmppath=ind;
				if (!fso.FolderExists(tmppath)){
					folder = fso.CreateFolder(tmppath);
				}
			}
		}

		function nbtaxcellVersion(path,nsrsbh,zsxm){
			var tf= fso.OpenTextFile(path+"\\dzsb_usr.ini",ForReading,NewWhenNotExists,-2);
			var rtn='',s = '';
			while (!tf.AtEndOfStream){
      			s = tf.ReadLine();
      			if (s.indexOf(nsrsbh+'_'+zsxm+'=')>-1){
      				rtn = s.substr(s.indexOf('=')+1);
      				break;
      			}
			}
			tf.Close();
			return rtn;
		}

		function nbtaxsavecellVersion(path,nsrsbh,zsxm,version){
			var tf= fso.OpenTextFile(path+"\\dzsb_usr.ini",ForReading,NewWhenNotExists,-2);
			var allText = '';
			if (!tf.AtEndOfStream){
				allText=tf.ReadAll();
			}
			tf.close();
			var ind = allText.indexOf(nsrsbh+'_'+zsxm);
			if (ind==0||ind>0&&allText.substring(ind-2,ind)=='\r\n'){
				allText = allText.substring(0,ind)+nsrsbh+'_'+zsxm+'='+version+'\r\n'+allText.substr(allText.indexOf('\r\n',ind)+2);
			}else{
				allText=allText+nsrsbh+'_'+zsxm+'='+version+'\r\n';
			}
			tf= fso.OpenTextFile(path+"\\dzsb_usr.ini",ForWriting,NewWhenNotExists,-2);
			tf.write(allText);
			tf.close();
		}

		function nbtaxsearchReport(path,fileName){
			var rtn = 0;
			if (fso.FileExists(path+'\\'+fileName)){
				rtn = 1;
			}
			return rtn;
		}

		function nbtaxsearchReportList(path,nsrsbh,sssqq,sssqz){
			var rtn = '';
			if (fso.FolderExists(path)){
				var f = fso.GetFolder(path);
				var fc = new Enumerator(f.files);
				var s = "";
				for (; !fc.atEnd(); fc.moveNext()){
				   s = fc.item()+'';
				   if (s.indexOf(nsrsbh)>-1&&checkDate(s,sssqq,sssqz))
					   rtn=rtn+s+',';
				}
			}
			function checkDate(s,sssqq,sssqz){
				var rtn = false;
				s=s.substring(s.lastIndexOf('\\')+1);
				s=s.substring(s.indexOf('_')+1,s.lastIndexOf('_'));//nsrsbh_ssqq_ssqz
				_ssqq = s.substring(s.indexOf('_')+1,s.indexOf('_')+9);
				_ssqz = s.substr(s.lastIndexOf('_')+1);
				if (parseInt(sssqq+'')<=parseInt(_ssqq+'')&&parseInt(sssqz+'')>=parseInt(_ssqz+''))
					rtn = true;
				return rtn;
			}
			rtn = rtn.substring(0,rtn.length-1);
			return rtn;
		}
		

		function nbtaxDeleteMyFile(path){
			if (fso.FileExists(path))
				fso.DeleteFile(path,true);
		}
		
//**************************************************************************************************************************		
//XML
function transformXMLByXsltFile(xml,xslt){
	a = new ActiveXObject("Msxml2.DOMDocument");
	a.async=false;
	a.resolveExternals=true;  
	a.loadXML(xml);
	b = new ActiveXObject("Msxml2.DOMDocument");
	b.async=false;
	b.load(xslt);
	c = new ActiveXObject("Msxml2.DOMDocument");//Microsoft.XMLDOM
	a.transformNodeToObject(b,c);
	str=c.xml.replace("UTF-16","UTF-8");
	a=null;
	b=null;
	c=null;
	return str;
}

//XML
function transformXMLFileByXsltFile(xml,xslt){
	a = new ActiveXObject("Msxml2.DOMDocument");
	a.async=false;
	a.resolveExternals=true;  
	a.load(xml);
	b = new ActiveXObject("Msxml2.DOMDocument");
	b.async=false;
	b.load(xslt);
	c = new ActiveXObject("Msxml2.DOMDocument");//Microsoft.XMLDOM
	a.transformNodeToObject(b,c);
	str=c.xml.replace("UTF-16","UTF-8");
	a=null;
	b=null;
	c=null;
	return str;
}

//XML
function transformXMLByXsltData(xml,xslt){
	var a = new ActiveXObject("Msxml2.DOMDocument");
	a.async=false;
	a.resolveExternals=true;  
	a.loadXML(xml);
	var b = new ActiveXObject("Msxml2.DOMDocument");
	b.async=false;
	b.loadXML(xslt);
	var c = new ActiveXObject("Msxml2.DOMDocument");//Microsoft.XMLDOM
	a.transformNodeToObject(b,c);
	str=c.xml.replace("UTF-16","UTF-8");
	a=null;
	b=null;
	c=null;
	return str;
}
//xml合并
function concatXML(xml1,xml2){
	if(xml1.indexOf("<ROOT>")>0)
	{
		xml1 = xml1.substring(xml1.indexOf("<ROOT>")+6);
		xml1 = xml1.replace("</ROOT>","");
	}
	if(xml1.indexOf("<Root>")>0)
	{
		xml1 = xml1.substring(xml1.indexOf("<Root>")+6);
		xml1 = xml1.replace("</Root>","");
	}
	if(xml2.indexOf("<ROOT>")>0)
	{
		xml2 = xml2.substring(xml2.indexOf("<ROOT>")+6);
		xml2 = xml2.replace("</ROOT>","");
	}
	if(xml2.indexOf("<Root>")>0)
	{
		xml2 = xml2.substring(xml2.indexOf("<Root>")+6);
		xml2 = xml2.replace("</Root>","");
	}
	var str = "<?xml version='1.0' encoding='GBK'?><ROOT>";
	str = str + xml1+xml2;
	str =str + "</ROOT>";
	return str;
}
//替换字符串
function StrRepacleALL(str,str1,str2)
{
	var iTemp = 0;
	while(str.indexOf(str1)>0 && iTemp<99)
	{
		str = str.replace(str1,str2);
		iTemp = iTemp+1;
	}
	return str;
}

//xml
function DispJYXMLByXML(xml,code,tag){
	var a = new ActiveXObject("Msxml2.DOMDocument");
	a.async=false;
	a.resolveExternals=true;  
	a.load(xml);
	var elements = a.getElementsByTagName("REC_CHK");
  for (var i = 0; i < elements.length; i++) {
    var msgTemp = elements[i].getElementsByTagName("msg")[0].firstChild.nodeValue;      
    var codeTemp = elements[i].getElementsByTagName("code")[0].firstChild.nodeValue;           
		if ( codeTemp == code)
		{
			if(msgTemp != null && msgTemp.length > 0)
				PubCheckMsg = PubCheckMsg + tag + msgTemp;
		}
	}
			
	return true;
}

function DispJYXMLByXMLData(xml,code,tag){
	var a = new ActiveXObject("Msxml2.DOMDocument");
	a.async=false;
	a.resolveExternals=true;  
	a.loadXML(xml);
	var elements = a.getElementsByTagName("REC_CHK");
  for (var i = 0; i < elements.length; i++) {
    var msgTemp = elements[i].getElementsByTagName("msg")[0].firstChild.nodeValue;      
    var codeTemp = elements[i].getElementsByTagName("code")[0].firstChild.nodeValue;           
		if ( codeTemp == code)
		{
			if(msgTemp != null && msgTemp.length > 0)
				PubCheckMsg = PubCheckMsg + tag + msgTemp;
		}
	}
			
	return true;
}
function JYXML2JSON(xml){
	var a = new ActiveXObject("Msxml2.DOMDocument");
	a.async=false;
	a.resolveExternals=true;  
	a.loadXML(xml);
	var elements = a.getElementsByTagName("REC_CHK");
	PubCheckMsg = "[";
	for (var i = 0; i < elements.length; i++) {
		var msgTemp = "";
		var tmpNode1 = elements[i].getElementsByTagName("msg")[0].firstChild;
		if(tmpNode1 != null){
			msgTemp = tmpNode1.nodeValue;   
			msgTemp = StrRepacleALL(msgTemp,'"','“'); 
			msgTemp = StrRepacleALL(msgTemp,'|','｜'); 
			msgTemp = StrRepacleALL(msgTemp,',','，'); 
		}
		var codeTemp = elements[i].getElementsByTagName("code")[0].firstChild.nodeValue;           
		var checkId = "";
		var B5_A2 = "";
		var B5_B2 = "";
		var B5_D2 = "";
		var B5_C2 = "";
		var B5_E2 = "";
		var B5_F2 = "";
		var remarkTemp = "";
		var inputId = "";
		
		if(codeTemp == "03"){
			var tmpNode = elements[i].getElementsByTagName("checkId")[0].firstChild;
			if(tmpNode != null)
				checkId = tmpNode.nodeValue;
			tmpNode = elements[i].getElementsByTagName("remark")[0].firstChild;
			if(tmpNode != null)
				remarkTemp = tmpNode.nodeValue;     
			tmpNode = elements[i].getElementsByTagName("B5_A2")[0].firstChild;
			if(tmpNode != null)
				B5_A2 = tmpNode.nodeValue;     
			tmpNode = elements[i].getElementsByTagName("B5_B2")[0].firstChild;
			if(tmpNode != null)
				B5_B2 = tmpNode.nodeValue;     
			tmpNode = elements[i].getElementsByTagName("B5_D2")[0].firstChild;
			if(tmpNode != null){
				B5_D2 = tmpNode.nodeValue;  
				B5_D2 = StrRepacleALL(B5_D2,'"','“'); 
				B5_D2 = StrRepacleALL(B5_D2,'|','｜'); 
				B5_D2 = StrRepacleALL(B5_D2,',','，'); 
			}
			tmpNode = elements[i].getElementsByTagName("B5_C2")[0].firstChild;
			if(tmpNode != null)
				B5_C2 = tmpNode.nodeValue;    
			tmpNode = elements[i].getElementsByTagName("B5_E2")[0].firstChild;
			if(tmpNode != null)
			{
				B5_E2 = tmpNode.nodeValue;    
				B5_E2 = StrRepacleALL(B5_E2,'"','“'); 
				B5_E2 = StrRepacleALL(B5_E2,'|','｜'); 
				B5_E2 = StrRepacleALL(B5_E2,',','，'); 
			}
			tmpNode = elements[i].getElementsByTagName("B5_F2")[0].firstChild;
			if(tmpNode != null)
			{
				B5_F2 = tmpNode.nodeValue;
				B5_F2 = StrRepacleALL(B5_F2,'"','“'); 
				B5_F2 = StrRepacleALL(B5_F2,'|','｜'); 
				B5_F2 = StrRepacleALL(B5_F2,',','，'); 
				if(msgTemp=="")
					msgTemp = B5_F2;
			}     
		}
		tmpNode = elements[i].getElementsByTagName("input");
		if(tmpNode.length > 0){
			inputId = tmpNode[0].firstChild.nodeValue.replace(/\s+/g, "");
		}
		
		if(msgTemp != null && msgTemp.length > 0)
			PubCheckMsg = PubCheckMsg + '{"checkId":"'+checkId+'","code":"'+codeTemp+'","B5_A2":"'+B5_A2+'","B5_B2":"'+B5_B2+'","B5_D2":"'+B5_D2+'","B5_C2":"'+B5_C2+'","B5_E2":"'+B5_E2+'","B5_F2":"'+B5_F2+'","msg":"'+msgTemp+'","remark":"'+remarkTemp+'","inputId":"'+inputId+'"},';
	}
	if(PubCheckMsg!="[")
		PubCheckMsg = PubCheckMsg.substring(0,PubCheckMsg.length-1);
	PubCheckMsg = PubCheckMsg + "]";
	return true;
}
//**************************************************************************************************************************
