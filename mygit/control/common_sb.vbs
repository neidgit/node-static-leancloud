Dim eventCol,eventRow	'选择单元格时记录下的行列号
Dim PubChangeFlag   '当报表内容改变时的标志,主要用来离开时校验是否编辑,初始值为0 ,在Cell_SetCellData函数里变为1  (0表示cell没有发生变化，在函数的末尾当赋值成功时设为 1，在保存成功后设为0，满足保存之后离开时不提示)
Dim PubSheetArray
Dim CellWeb1
Dim CellWeb_print
Dim PubScale'当前显示比例
Dim PubNSRSBH '纳税人识别号
Dim PubErrMsg '错误信息
Dim PubCheckMsg '校验错误信息
Dim PubStrA1 'A1区内容
Dim AStartRow,AEndRow '用于记录可复制的明细表当前的起始和终止行，删除多行时使用
Dim PubTableCount 'CELL表中数据表的个数
Dim PubTableArray() '1维为0,1,2,3,4,5,6(0-A1区数据表名,
						'1-表名代码,2-属性,3-数据表含CELL中的变量总数,
						'4-起始行坐标[不需要复制行的为0]，
						'5-终止行坐标[不需要复制行的为0],
						'6-插入行标所在sheet号)
						'7-明细表的当前行
					'2维为值,有多少个表就有多少个值
					'16 A2区内容  17 A3区内容
Dim PubTableArrayCount  'PubTableArray的一维最大数，现在为8
Dim PubCellVarArray() '数据表含CELL中的变量,1维为数据表索引，2维为本表含变量索引

Dim Pub_sb_saveFlag
Dim Pub_SBPath
Dim Pub_sb_cell_savepath
Dim Pub_KeyCode '校验单元格时使用,按键
Dim Pub_ErrLocalMsg
Dim Pub_LocalFileFlag

Pub_LocalFileFlag=true

Pub_ErrLocalMsg="浏览器不支持本地文件操作，参看帮助,在internet选项中把加入安全站点!"+Chr(13)+"并确保你系统中没有安装雅虎助手,3721,中文上网,瑞星卡卡等软件,如果已经安装,请到控制面板里卸载这些软件"+Chr(13)+"你可以继续操作,但是你将无法保存报表到本地,以后也将不能在本地查看"

Pub_sb_saveFlag=0		'标志现在是提交，不需要保存临时文件
Pub_sb_cell_savepath="AISINO_NSSB"
Pub_SBPath = "C:\AISINO_NSSB"


PubTableArrayCount=17
PubChangeFlag=0

Dim PubCellListCount '有下拉框的变量总数
Dim PubCellListVarArray() '有下拉框的变量名称,二维数组，第2维为下拉框索引号，
				'第1维值为0、1、2、3、4　
				'0：下拉框变量名；
				'1：对应的字典数据表名；
				'2：字典表中代码字段名；
				'3：字典表中名称字段名；
				'4：代码个数
Dim PubCellListDataArray() '每个下拉框中的代码及值，三维数组，
				'第1维为下拉框索引号，
				'第2维为：0、1；0：代码；1：代码对应的名称；
				'第3维是代码及名称全部值，有多少值就维数级数就有多少。
Pub_FilePassword = "AISINO"


'**************************************************************初始化操作*****************************************************************
'-------------------------------------------------------------------
' 注册CELL-航天信息公司
'-------------------------------------------------------------------
Public Function Cell_Login()
	Dim bRtn
	bRtn = True
	if CellWeb1.Login("AERO-INFO","","13040377","4720-1262-0162-1004") = 0 Then  '注册失败
		bRtn = False
	End If
	if CellWeb_print.Login("AERO-INFO","","13040377","4720-1262-0162-1004") = 0 Then  '注册失败
		bRtn = False
	End If
	Cell_Login = bRtn
End Function

'-------------------------------------------------------------------
' 打开CELL
'-------------------------------------------------------------------
Public Function Cell_OpenFile(CellWeb,CellFilename)
	Dim iRt,bRtn
	Dim errmsg
	bRtn = False

  iRt = CellWeb.OpenFile(CellFilename, Pub_FilePassword)

	Select Case iRt
    	Case -1:  errmsg = "文件不存在 !"
    	Case -2:  errmsg = "文件操作错误 !"
    	Case -3:  errmsg = "文件格式错误!" 
    	Case -4:  errmsg = "密码错误!"
    	Case -5:  errmsg = "不能打开高版本文件!"
    	Case -6:  errmsg = "不能打开特定版本文件!"  
    	Case -99:  errmsg = "不能下载文件!"  
    	Case Else errmsg = "无法打开报表文件，未知错误!"    
  	End Select

  	If iRt = 1 Then
  		bRtn = True
  	Else
  		PubErrMsg = errmsg
  	End If 
  	Cell_OpenFile = bRtn
End Function

'-------------------------------------------------------------------
'初始化CELL的下拉框
'-------------------------------------------------------------------
Public Function Cell_SetListData()
	Dim iLoop1,iLoop2,iLoop3,iTableIndex
	Dim strCellVarName,strTemp
	Dim curCol,curRow,curSheet
	Dim strListData '下拉框数据
	Dim iBeginRow,iEndRow,iListCol '需要填下拉框数据的起始行，终止行坐标,列
  Dim xlk_Option 
	For iLoop1 = 0 to PubCellListCount - 1
	  iBeginRow = 0 
	 	strCellVarName = PubCellListVarArray(0,iLoop1)
	 	PubErrMsg = ""
     xlk_Option = 0
	  'If (iLoop1+1-1 = 0) Then '成品油的下拉框可以输入新值
		'  xlk_Option = 2
	  'End If 		  
	 	if (CellWeb1.GetCellVar(strCellVarName,curCol,curRow,curSheet)) = True Then
	 		iBeginRow = curRow 
	 		iEndRow = CurRow 
	 		iListCol = curCol
	 		PubErrMsg = ""
	 		strListData = ""
	 		For iLoop2 = 0 to PubCellListVarArray(4,iLoop1)
	   		    strListData = strListData + PubCellListDataArray(iLoop1,1,iLoop2)+ Chr(10)
	 		Next
		  If (Mid(strCellVarName,InStr(strCellVarName,"_")-7,1) <>"0") then'明细表需要填每一行字典
	 			For iLoop2 = 0 to PubTableCount - 1
    	  			If PubTableArray(1,iLoop2) = Left(strCellVarName,InStr(strCellVarName,"_")-8) Then
    	  			    If Mid(strCellVarName,InStr(strCellVarName,"_")-7,1)="1" Then 
    	  			        iBeginRow = iBeginRow 
    	  			        iEndRow = PubTableArray(5,iLoop2)-1
    	  			    ElseIf  Mid(strCellVarName,InStr(strCellVarName,"_")-7,1)="2" Then 
    	    			    iBeginRow = iBeginRow + 1
    	    			    iEndRow = PubTableArray(5,iLoop2)
    	    			  ElseIf  Mid(strCellVarName,InStr(strCellVarName,"_")-7,1)="3" Then 
    	    			    iBeginRow = iBeginRow + 1
    	    			    iEndRow = PubTableArray(5,iLoop2)
    	    				End If 
    	    			Exit For
    	  			End If 	
    	   		Next
		  End If 	
		'设置下拉框时，如果该行有初始数据，则判断初始数据是否数据下拉框代码，若属于，则赋值成值
		  For iLoop2 = iBeginRow to iEndRow
 			  CellWeb1.SetDroplistCell iListCol,iLoop2,curSheet,strListData,xlk_Option 
 			  strValueTemp =  CellWeb1.GetCellString(iListCol,iLoop2,curSheet)
 			  If strValueTemp <> "" And Len(strValueTemp)>0 Then 
	 			  For iLoop3 = 0 To PubCellListVarArray(4,iLoop1)
		   		    If strValueTemp = PubCellListDataArray(iLoop1,0,iLoop3) Then 
		   		    	CellWeb1.SetCellString iListCol,iLoop2,curSheet,PubCellListDataArray(iLoop1,1,iLoop3)
		   		    	Exit For
		   		  	End If 
		 			Next 
		 		End If 
		  Next   
	  End If
	Next
	Cell_SetListData = True
End Function



'-------------------------------------------------------------------
'读CELL写XML字符串,返回XML字符串
'Flag 0 全部数据生成  1 提出A2区生成  2 剔除A3区生成，即校验xml
'-------------------------------------------------------------------
Public Function Cell_WriteXmlStr(Flag)
	Dim strRt ,iRt,strTemp
	Dim iLoop1,iLoop2,iLoop3,iRecordCount
	Dim curCol,curRow,curSheet,msgRow
	Dim objFSO, objTextFile
	Dim objXML, strFile, strRoot
	Dim strNodeName1,strNodeName2,strNodeVal,StrNodeAttrName1,StrNodeAttrVal1,StrNodeAttrName2,iNode1Level'节点名称、值，属性名称、属性值，一级节点索引
	Dim iNodeAttrVal2,iEndRow,iBeginRow
	Dim strCellVarName,strCellVarVal,strMsg
	
	Cell_WriteXmlStr = ""
	strRoot = "Root"
	iRecordCount = 0 '总共记录数
	Cell_WriteXmlStr = ""
	strRt = "<?xml version=""1.0"" encoding=""UTF-8"" ?>"'不能用GB2312，否则ASCII>128的字符出现乱码
	strRt = strRt +  "<" + strRoot + ">"
	strNodeName1 = "RecID"
	StrNodeAttrName1 = "TableName"
	StrNodeAttrName2 = "Row"
	iNodeAttrVal2 = 0
	On Error Resume Next  
	CellWeb1.SaveEdit
	For iLoop1 =0 to PubTableCount -  1 '以数据表循环，明细表再逐个取数据
'msg_ok(CStr(iLoop1)&":"&PubTableArray(0,iLoop1)&","&PubTableArray(1,iLoop1)&","&PubTableArray(16,iLoop1))      
	  If Flag = 1 And  ((Len(Trim(PubTableArray(16,iLoop1)))> 0) and  (PubTableArray(16,iLoop1) = PubTableArray(1,iLoop1))) Then '有的TABLE是不需要生成上传XML文件的
'      msg_ok(PubTableArray(1,iLoop1))
    ElseIf Flag = 2 And  ((Len(Trim(PubTableArray(17,iLoop1)))> 0) and  (PubTableArray(17,iLoop1) = PubTableArray(1,iLoop1))) Then '有的TABLE是不需要生成校验XML文件的
'      msg_ok(PubTableArray(1,iLoop1))  
    Else 
		  StrNodeAttrVal1 = PubTableArray(0,iLoop1)
		  '--------- 取起始、终止点行号 -----
		  If PubTableArray(2,iLoop1) ="0" Then '非明细表
		  	iBeginRow = 0
	      iEndRow = 0
	      icurRow = 0
	    ElseIf PubTableArray(2,iLoop1) ="1" Then '不复制明细表
	    	iBeginRow = 1
	     	iEndRow = PubTableArray(5,iLoop1) - PubTableArray(4,iLoop1)
	     	icurRow = PubTableArray(4,iLoop1)
		  ElseIf (PubTableArray(2,iLoop1) ="2") or (PubTableArray(2,iLoop1) ="3") Then '复制明细表,复制明细表的第一行不写入
	    	iBeginRow = 1	
	     	iEndRow = PubTableArray(5,iLoop1) - PubTableArray(4,iLoop1)-1
	     	icurRow = PubTableArray(4,iLoop1)+1
	    End If
      
      
	    For iLoop3 = iBeginRow to iEndRow  '按行取值
	     	iNodeAttrVal2 = iLoop3
	     	strRt = strRt + "<" + strNodeName1 + " " + StrNodeAttrName1 + "=" +"""" + StrNodeAttrVal1 +"""" + " " + StrNodeAttrName2 + "="  +"""" & CStr(iNodeAttrVal2) +"""" +  ">"
	    	For iLoop2 = 0 to PubTableArray(3,iLoop1) - 1 '以变量为循环写二级节点
	      	strCellVarName = PubCellVarArray(iLoop1,iLoop2) 
		  		'strNodeName2 = Right(strCellVarName,Len(strCellVarName)-9)
	      	strNodeName2 = strCellVarName
	      	PubErrMsg = ""
      
	      	If (CellWeb1.GetCellVar(strCellVarName,curCol,curRow,curSheet)) = True Then
		  			'MsgBox(CStr(curCol)+"__"+CStr(curRow)+"__"+CStr(curSheet))
	        	strCellVarVal = Cell_GetCellData(strCellVarName,icurRow)
      
	        	PubErrMsg = ""
	        	iRt = 0
	        	msgRow = icurRow
	        	If icurRow = 0 Then
	          	msgRow=curRow
	         	End If
		  			sheetname=CellWeb1.GetSheetLabel(curSheet)
	         	If (CellWeb1.GetCellInput(curcol,msgRow,cursheet)<>5) then  '置读区不校验
	         	  If (CellWeb1.GetCellType(curCol,msgRow,curSheet) <> 3) then  '下拉框不校验
	              iRt = CheckCellIn(strCellVarName,strCellVarVal,1,curCol,msgRow,curSheet)
	              If iRt <> 0 Then '校验输入数据错误
'                  strMsg= " 单元格内容(页,列,行):[" + sheetname + "," + CStr(chr(curCol + 64)) + "," + cStr(msgRow) + "]"	 + strCellVarName	+ "  ,value: " + strCellVarVal
	                Msg_Warning(PubErrMsg + strMsg)
	                CellWeb1.SetCurSheet curSheet	
              		CellWeb1.SetSelectMode curSheet,1 '可选择
	                CellWeb1.MoveToCell curCol,msgRow
	                Exit Function
	              End If 	
	       		  'Else
		  				'  '对于下拉框百分数类型的转化为小数 已自动读成小数，不需要转换      
		  			  '	glfhwz=InStr(strCellVarName,"_")
		  				'  If(Mid(strCellVarName,glfhwz-6,1)="N") Then
		  				'	  strCellVarVal=CDbl(Left(strCellVarVal,Len(strCellVarVal)-1))/100
		  				'  End If
		  				End If   
		  			End If
	        
	          'csj 121
	          
	    			If  Right(strNodeName2,5) = "CZMXL"  Or Right(strNodeName2,5) = "SBXML" Or Right(strNodeName2,7) = "CELLXML" Then  
			        strNodeVal = strCellVarVal
			      Else  
			      	strNodeVal = parseString(strCellVarVal)
			      End If  
      
		        If strNodeVal <> "" Then '空值不取
	            strRt = strRt + "<" + Right(strNodeName2,Len(strNodeName2)-InStr(strNodeName2,"_")) + ">" + strNodeVal + "</" + Right(strNodeName2,Len(strNodeName2)-InStr(strNodeName2,"_"))+  ">"    '二级节点 字段值
	         	End If  
		  		End If
		  	Next
	      strRt = strRt + "</" + strNodeName1 + ">"    
	      icurRow = icurRow + 1     
		  Next
		End If   
	Next
	strRt = strRt + "</" + strRoot + ">"
	Cell_WriteXmlStr = strRt
	'MsgBox(Cell_WriteXmlStr)
	If Err.Number <> 0 Then
		PubErrMsg = "从CELL读数据生成XML文件错误"
	  Msg_Warning(PubErrMsg + ":" + strCellVarName)	
'strMsg= "单元格内容(页,列,行):[" + cStr(curSheet) + "," + CStr(chr(curCol + 64)) + "," + cStr(curRow) + "]"	 + strCellVarName	+ "  ,value: " + strCellVarVal
	  Err.Clear    '清除错误
	  Exit Function      
	End If
End Function

'-------------------------------------------------------------------
'根据变量名从简单CELL表中读单元格中的数据
'strVarName:单元格变量名,iCurRow:读数值的行,如果是0则取变量的行，明细表时候需要用此值
'-------------------------------------------------------------------
Public Function Cell_GetCellData(strVarName,iCurRow)
	Dim iLoop1 ,iLoop2
	Dim strCellValue
	Dim curCol,curRow,curSheet
	Dim strTemp 
	Dim strNullFlag'是否必填项 Y可以为空
	Dim strVarType '类型
	Dim StrVarLength '长度
	Dim iVarIL,iVarDL,iDotPos '如果是数值型，整数和小数部分长度，小数点位置
	
	strCellValue = ""

	if (CellWeb1.GetCellVar(strVarName,curCol,curRow,curSheet)) = True Then
		If iCurRow <> 0  Then 
			curRow = iCurRow
		End If
		If CellWeb1.GetCellNumType(curCol,curRow,curSheet) = 5 then  '百分比
   		fCellValue = CellWeb1.GetCellDouble(curCol,curRow,curSheet)    	
			strCellValue = CStr(fCellValue) '取变量名对应的单元格中的百分数   
	      	'取出来的百分数,如果大于0小于1,前面的0给忽略掉了,要加上
	   	If (CDbl(strCellValue)>0 and CDbl(strCellValue)<1)  Then 
	  		strCellValue=cStr("0")+cStr(strCellValue)
	   	End If  
	  ElseIf CellWeb1.GetCellNumType(curCol,curRow,curSheet) = 3 Then '日期
	 		strCellValue=Cell_GetCellDate(CellWeb1,curCol,curRow,curSheet)
	 	Else
	   	If  (CellWeb1.GetCellType(curCol,curRow,curSheet)= 4) Then    '核选框用GetCellDouble()取0,1，用GetCellString()只取文字
        strTemp = CellWeb1.GetCellDouble(curCol,curRow,curSheet) 
        strCellValue = CDbl(strTemp) 
      Else		
	   		strCellValue = CellWeb1.GetCellString(curCol,curRow,curSheet) '取变量名对应的单元格中的内容
	 		End If 
	 	End If
	 	
	 	If CellWeb1.GetCellNumType(curCol,curRow,curSheet) = 1 Then '数值型 如果有千分位，去掉千分位
	    If  CellWeb1.GetCellSeparator(curCol,curRow,curSheet) = 2 Then 
	      strCellValue = Replace(strCellValue,",","")
	    ElseIf  CellWeb1.GetCellSeparator(curCol,curRow,curSheet) = 3 Then
	      strCellValue = Replace(strCellValue," ","")
	    End If 
	  End If 
	 	
		if (CellWeb1.GetCellType(curCol,curRow,curSheet) = 3) then  '下拉框,取代码
		  For iLoop1 = 0 to PubCellListCount - 1
		    If (strVarName) = PubCellListVarArray(0,iLoop1) Then
		   		For iLoop2 = 0 to PubCellListVarArray(4,iLoop1) - 1
		    		If strCellValue	= PubCellListDataArray(iLoop1,1,iLoop2) Then
		    			strCellValue = PubCellListDataArray(iLoop1,0,iLoop2)
		     		End if	
		    	Next  
		    End If	
			Next
		End If

  	strNullFlag = Mid(strVarName,InStr(strVarName,"_")-1,1)
	  strVarType = Mid(strVarName,InStr(strVarName,"_")-6,1)
	  StrVarLength = Mid(strVarName,InStr(strVarName,"_")-5,4)
	  iVarIL = CInt(Left(StrVarLength,2))
	  iVarDL = CInt(Right(StrVarLength,2))

	
    If Len(Trim(strCellValue)) = 0 Then
		  If strVarType = "N" Then '输入是数值，但0隐藏，按变量名设置小数取：0.00 or 0
			 	If CellWeb1.GetCellHideZero(curcol,currow,cursheet) = 1 Then '0隐藏
			 		strTemp = ""
			 		If iVarDL > 0 Then 
			 			xscd = CellWeb1.GetCellDigital(curCol,curRow,curSheet)
			 		  strTemp = "."
			 		  For iLoop1 = 1 to xscd 
  			 			strTemp = strTemp + "0"
            Next 
          End If 
 	  	  	strCellValue = "0" + strTemp
			  End If 
			End If 
    End If 

	'对置读区且值是"-",赋值为空
    If (CellWeb1.GetCellInput(curcol,currow,cursheet)=5)  Then  
  		If (Trim(strCellValue)="-" Or Trim(strCellValue)="*") Then '对于原表中是“-”数值型赋0值
	  		strCellValue=""
		  End If
    End If 
    
'If strVarName = "B2N1002N_JMSE" Then 
'	msg_ok(strVarType)
'	msg_ok(CellWeb1.GetCellHideZero(curcol,currow,cursheet))
'  msg_ok("A-" + strCellValue + "-A")
'End If 
		Cell_GetCellData = strCellValue
		'Msg_OK("单元格内容(页,列,行):[" + cStr(curSheet) + "," + CStr(chr(curCol + 64)) + "," + cStr(curRow) + "]=" + strCellValue)
	End If 
End Function
'-------------------------------------------------------------------
' 生成上传XML时做校验，返回0为成功，1为失败，不需要自动修改输入值，2为失败，可以自动修改值 然后显示错误信息   
' iCall：调用的地方，0为输入时候(单元格实时录入)调用，1为最后读取生成xml时候调用,0目前弃用
'-------------------------------------------------------------------
Public Function CheckCellIn(strVarName,strVarValue,iCall,curcol,currow,cursheet)
	Dim strNullFlag'是否必填项 Y可以为空
	Dim strVarType '类型
	Dim TempValue '转换值
	Dim StrVarLength '长度
	Dim iVarIL,iVarDL,iDotPos '如果是数值型，整数和小数部分长度，小数点位置
  Dim strMsg
	If Len(strVarName) < 8 Then'未定义变量不检查，因为有的报表中需要修改表头
		PubErrMsg = "变量定义错误:" + strVarName
		CheckCellIn = 0
		Exit Function      
	End If

	strNullFlag = Mid(strVarName,InStr(strVarName,"_")-1,1)
	strVarType = Mid(strVarName,InStr(strVarName,"_")-6,1)
	StrVarLength = Mid(strVarName,InStr(strVarName,"_")-5,4)
	iVarIL = CInt(Left(StrVarLength,2))
	iVarDL = CInt(Right(StrVarLength,2))
	
	strMsg = Cell_GetCellNote(strVarName) '单元格提示信息

	For iLoop1 = 1 to Len(StrVarLength) '长度数值校验
		If (Right(Left(StrVarLength,iLoop1),1) < "0") or (Right(Left(StrVarLength,iLoop1),1) > "9") Then
    	PubErrMsg = "变量定义长度错误，应该是数字，:" + strVarName
    	CheckCellIn = 1
    	Exit Function      
  	End If
	Next

	 If strVarValue = "-" Or strVarValue = "*" then	'如果单元格是－，且置读，则是允许的
      If (CellWeb1.GetCellInput(curcol,currow,cursheet)=5)  Then  
  	    CheckCellIn = 0
  	    Exit Function
  	  End If   
	  End If

	'生成xml时调用,则需要对不为空的进行校验
	If iCall = 1 Then
  	If Len(Trim(strVarValue)) = 0 Then
    	If strNullFlag = "N"  Then '不能为空
		  	If strVarType = "N" Then '输入是数值，但0隐藏
			  	If CellWeb1.GetCellHideZero(curcol,currow,cursheet) = 2 Then '0隐藏
  			  	CheckCellIn = 0
      			Exit Function      
				  End If 
			  End If 
				PubErrMsg = "当前位置不能为空" 
				CheckCellIn = 1
  			Exit Function      
			Else 
				CheckCellIn = 0
  			Exit Function      
			End If
		End If
   
	  If ((strVarType ="D")) Then '日期型可以用控件，也可以手工输入，手工输入的需要校验格式
      On Error Resume Next
        TempValue = CDate(strVarValue)
        If Err.Number <> 0 Then
          PubErrMsg = "值=" + strVarValue + " ，日期格式输入错误!" 
          Err.Clear    '清除错误
          CheckCellIn = 2
          Exit Function      
        End If  
	  End If
		Exit Function
	End If  

	'处理数字类型
	If (strVarType ="N") Then
		If (CellWeb1.GetCellType(curcol,currow,cursheet)=3) Then  '如果是下拉框
			CheckCellIn = 0
    	Exit Function  
		End If 		
		
    On Error Resume Next
    If strVarValue = "-" Or strVarValue = "*" then
      CheckCellIn = 0
      Exit Function      
    End If
    
    If strVarValue <> "." Then     
      TempValue = CDbl(strVarValue)
      If Err.Number <> 0 Then
        PubErrMsg = "值=" + strVarValue + " ，应该输入数字!" 
        Err.Clear    '清除错误
        CheckCellIn = 2
        Exit Function      
      End If  

      If Len(CStr(Int(strVarValue))) > iVarIL then  
        'PubErrMsg = "值=" + strVarValue + " ，整数部分长度>" + CStr(iVarIL)  
        PubErrMsg =  "整数部分长度不能大于" + CStr(iVarIL) 
        CheckCellIn = 2
        Exit Function      
      End If
    End If    

    iDotPos = Instr(strVarValue , ".") '小数点位置
    If iDotPos > 0 Then 
      If iVarDL = 0 Then  '无小数，不需要输入
        PubErrMsg = "值=" + strVarValue + " ，没有小数!"
        CheckCellIn = 2
        Exit Function      
      End If

      if Len(Right(strVarValue,Len(strVarValue) - iDotPos)) > iVarDL Then '小数部分长度
        'PubErrMsg = "小数位数：" + CStr(iVarDL)
        PubErrMsg = "本栏只能填写" + CStr(iVarDL) + "位小数。"
        CheckCellIn = 2
        Exit Function      
      End If  
    End If  
	End If
	
	'If ((strVarType ="V") or(strVarType ="C")) Then
	'   if Len(strVarValue) > CInt(StrVarLength) Then
	'		PubErrMsg = "值=" + strVarValue + " 输入错误，长度>" + CStr(CInt(StrVarLength))
	'		CheckCellIn = 2
	'		Exit Function      
	'	End If  
	'End If
	CheckCellIn = 0
End Function
'-------------------------------------------------------------------
'单元格输入实时校验
'-------------------------------------------------------------------
Public Sub CellWeb1_ChangeCell(ByVal col, ByVal row,Text)
  Dim iLoop1,iLoop2
  Dim iRt
  Dim curCol,curRow,curSheet
  Dim CellVarName '变量
  Dim CellVarValue '值
  Dim sTemp,strCellNote
  curCol = col
  curRow = row
  
  CellVarName = ""
'  CellVarValue = Trim(Text)
  CellVarValue = Text
  With CellWeb1
    curSheet = .GetCurSheet()
'Msg_Warning("[页,行,列]:[" + CStr(curSheet) + ","  + CStr(curRow) + ","  + CStr(chr(curCol + 64)) + "]"+CStr(Text) )	
    If Len(CellVarValue) = 0 Then
'      .SetCellString curCol,curRow,curSheet,"" '20080415 关闭此项，否则会影响插入行中日期的输入
  	  Exit Sub
    End If 	
    CellVarName = .FindCellVar(curCol,curRow,curSheet)
   
    If CellVarName = "" Then '取明细表复制行的变量名
'    	Exit Sub

      If .GetCellType(curCol,curRow,curSheet) = 4 Then
      	Exit Sub
      End If     	
    	If .IsFormulaCell(curCol,curRow,curSheet) > 0 Then'本单元格有公式
    		Exit Sub
    	End If 	  
      For iLoop1 = 0 to PubTableCount - 1
        If (curRow > PubTableArray(4,iLoop1)) and (curRow < PubTableArray(5,iLoop1) and(curSheet = PubTableArray(6,iLoop1))) Then
        	curRow = PubTableArray(4,iLoop1)
          CellVarName = .FindCellVar(curCol,curRow,curSheet)
    	    If CellVarName = "" Then
    	      Msg_Warning("系统错误,没有定义变量[页,行,列]:[" + CStr(curSheet) + ","  + CStr(curRow) + ","  + CStr(chr(curCol + 64)) + "]"+CStr(Text) )	
    	      Exit Sub
    	    Else
    	      Exit For  
    	    End If	
        End If
      Next  
    End If	
    PubErrMsg = ""
    'sTemp = Chr(13) + " 位置[页,行,列]:[" + CStr(curSheet) + ","  + CStr(Row) + ","  + CStr(chr(curCol + 66)) + "]"	
    sTemp = ""
    
    iRt = CheckCellIn(CellVarName,CellVarValue,0,curCol,curRow,curSheet )
    If iRt <> 0 Then '校验输入数据错误
      strCellNote = Cell_GetCellNote(CellVarName) '取单元格注释，获取错误提示内容
    End If
    If iRt = 1 Then '错误，不需要自动修改输入值
      Msg_Warning(PubErrMsg + sTemp)	
      Exit Sub
    End If 	
    If iRt = 2 Then '错误，需要自动修改输入值
      Msg_Warning(strCellNote + PubErrMsg + sTemp)	
      .SetCellString Col,Row,curSheet,Left(CellVarValue,Len(CellVarValue)-1)
      Exit Sub
    End If 	
  End With  
End Sub    
'-------------------------------------------------------------------
'读日期型单元格数据
'-------------------------------------------------------------------
Public Function Cell_GetCellDate(CellWeb,curCol,curRow,curSheet)
  Dim iTemp,strTemp
  Cell_GetCellDate = ""
  With CellWeb 
    strTemp = .GetCellString2 (curCol,curRow, curSheet)
  End With 
  If ((Len(strTemp) = 0) or (InStr(strTemp,"-")>0)) Then 
    Cell_GetCellDate = strTemp
  Else
    Cell_GetCellDate = CellChangeDate(strTemp)
  End If 
End Function   
'-------------------------------------------------------------------
'从CELL表中读日期型单元格数据，如果有汉字的年月日需要转换成yyyy-mm-dd
'Date_p:单元格数据
'-------------------------------------------------------------------
Function CellChangeDate(Date_p)
	Dim strDate,syear,smonth,sday,index,str,indexMonth,indexDay
	strDate = Trim(Date_p)
  If (Len(strDate) = 0) Then 
  	CellChangeDate = ""
  	Exit Function
  End If  	
  syear  = ""
  smonth = ""
  sday   = ""
  
	index=InStr(strDate,"年")
	If (index > 0) Then 
   	syear = Trim(left(strDate,index-1))
   	strDate = Right(strDate, Len(strDate) - index)
	End If 

	index=InStr(strDate,"月")
	If (index > 0) Then 
   	smonth = Trim(left(strDate,index-1))
   	strDate = Right(strDate, Len(strDate) - index)
   	If Len(smonth) = 1 Then
   		smonth = "0" + smonth
   	End If 
   	smonth = "-" + smonth
	End If 

	index=InStr(strDate,"日")
	If (index > 0) Then 
   	sday = Trim(left(strDate,index-1))
   	strDate = Right(strDate, Len(strDate) - index)
   	If Len(sday) = 1 Then
   		sday = "0" + sday
   	End If 
   	sday = "-" + sday
	End If 
	CellChangeDate = syear + smonth + sday
end Function

'-------------------------------------------------------------------
'根据变量名从CELL表中读单元格的注释，用于检验输入错误时提示应该输入的内容
'strVarName:单元格变量名
'-------------------------------------------------------------------
Public Function Cell_GetCellNote(strVarName)
  Dim strCellNote
  Dim curCol,curRow,curSheet
  
  strCellNote = ""
  if (CellWeb1.GetCellVar(strVarName,curCol,curRow,curSheet)) = True Then
    strCellNote = CellWeb1.GetCellNote(curCol,curRow,curSheet) '取变量名对应的单元格中的注释
  End If  
    Cell_GetCellNote = strCellNote
'    Msg_OK("单元格注释(页,列,行):[" + cStr(curSheet) + "," + CStr(chr(curCol + 64)) + "," + cStr(curRow) + "]=" + strCellNote)
End Function

'**************************************************************Cell 事件控制*****************************************************************
'不允许列宽度改变
Public Sub CellWeb_jsp_AllowSizeCol( ByVal col,  ByVal row,  byref approve)
	approve = 0
End Sub

'不允许行宽度改变
Public Sub CellWeb_jsp_AllowSizeRow(ByVal col, ByVal row, byref approve)
	approve = 0
End Sub

'不允许双击页签来改变页签名称
Public Sub CellWeb_jsp_AllowEditSheetLabel(ByVal sheet, byref approve)
	approve = 0
End Sub

'按键
Public Sub CellWeb_jsp_KeyDown(KeyCode,Shift)
	'MsgBox(KeyCode)
	Pub_KeyCode=KeyCode
End sub

'不允许通过del来删除一个表格
Public sub CellWeb_jsp_AllowDelCell(col,row,approve)
	approve=0
end Sub

'在单元格中按下“=”或准备输入公式时触发该事件(不触发)
Public sub CellWeb_jsp_AllowInputFormula(col,row,approve)
	approve=0
end Sub

'输入单元格结束时得到text（单元格值）
Public Sub CellWeb_jsp_EditFinish(text,approve) 
	sb_ChangeCell text,approve
End sub
'-------------------------------------------------------------------
'单元格输入实时校验
'-------------------------------------------------------------------
Public Sub CellWeb_jsp_ChangeCell(ByVal col, ByVal row,Text)
  CellWeb1_ChangeCell col, row ,Text
End Sub

'-------------------------------------------------------------------
'checkbox选择后的处理
'-------------------------------------------------------------------
Dim flag_sdsA_tb9000
Public Sub CellWeb_jsp_CheckCellChanged(ByVal col, ByVal row)
  CurSheet = CellWeb1.GetCurSheet()
  TotalSheet = CellWeb1.GetTotalSheets() 
	'If (TotalSheet = 1 Or TotalSheet >30) Then  'bddm存在B2区,总页签数大于等于3
		If (CellWeb1.GetCellVar("A0V0040Y_REPCODE",TempCol,TempRow,TempSheet)) = True Then
			CurBDDM=Cell_CtrlDataR(CellWeb1,"A0V0040Y_REPCODE", 0)
			Select Case UCase(CurBDDM)
			Case "SBCA714": 
				CheckCellChanged_SBCA714 col,row,CurSheet,strVarName,strVarValue 
			Case "SBCM714": 
				CheckCellChanged_SBCM714 col,row,CurSheet,strVarName,strVarValue 
			Case "SBCA717": 
				CheckCellChanged_SBCA717 col,row,CurSheet,strVarName,strVarValue 
			Case "SBCM717": 
				flag_sdsA_tb9000 = 0
				CheckCellChanged_SBCM717 col,row,CurSheet,strVarName,strVarValue 
			Case "SBCM815": 
				CheckCellChanged_SBCM815 col,row,CurSheet,strVarName,strVarValue
			Case "SBCN815": 
				CheckCellChanged_SBCN815 col,row,CurSheet,strVarName,strVarValue
			Case "QYCZ": 
				CheckCellChanged_QYCZ col,row,CurSheet,strVarName,strVarValue
			Case "SKWGQY": 
				CheckCellChanged_SKWGQY col,row,CurSheet,strVarName,strVarValue
			Case "SB00113": 
				CheckCellChanged_SB00113 col,row,CurSheet,strVarName,strVarValue
			Case "FJSF100": 
				CheckCellChanged_FJSF100 col,row,CurSheet,strVarName,strVarValue
			Case "ZDSY100": 
				CheckCellChanged_ZDSY100 col,row,CurSheet,strVarName,strVarValue
			Case "SB00916": 
				CheckCellChanged_SB00916 col,row,CurSheet,strVarName,strVarValue
			Case "GLGX_G112000": 
				CheckCellChanged_GLGX_G112000 col,row,CurSheet,strVarName,strVarValue
			End Select  
		End If 
  'End If 
End Sub


'-------------------------------------------------------------------
'改变页签时触发
'-------------------------------------------------------------------
Public sub CellWeb_jsp_SheetChanged(oldsheet,newsheet)
  Dim TotalSheet,CurSheet,CurZSXMDM
  CurSheet = CellWeb1.GetCurSheet()
  TotalSheet = CellWeb1.GetTotalSheets() 
	If CellWeb1.IsSheetProtect(newsheet) > 0 Then 
    CellWeb1.UnProtectSheet newsheet,Pub_FilePassword
  End If  
'	CellWeb1.MoveToCell 1,1	'改变页签后,鼠标挪到第一个单元格
	CellWeb1.MoveToCell 2,2	'改变页签后,鼠标挪到第一个单元格
End Sub

'在选择单元格时触发该事件,记录下行和列
Public sub CellWeb_jsp_SelChanged(col1,row1,col,row)
	eventCol=col
	eventRow=row
end Sub
'-------------------------------------------------------------------
'鼠标左键点击单元格时响应该事件
'-------------------------------------------------------------------
Public sub CellWeb_jsp_MouseLClick(col,row,updn)
	updn=1
	eventCol=col
	eventRow=row 
	if CellWeb1.GetCellInput(col,row,CellWeb1.GetCurSheet())=5 then
		CellWeb1.SetSelectMode CellWeb1.GetCurSheet(),0
	else
		CellWeb1.SetSelectMode CellWeb1.GetCurSheet(),1
		CellWeb1.MoveToCell col,row
	end if
	'if(bddm = "SB00916" And CellWeb1.GetCurSheet() = 15 And col = 11) then
		'MouseLClick_SB00916 col,row,CellWeb1.GetCurSheet()
	'end if
	
end Sub

'-------------------------------------------------------------------
'按钮事件,对于明细表的复制，删除行，在表中有+，++，-按钮，对其处理
'-------------------------------------------------------------------
Public Sub CellWeb_jsp_ButtonCellClicked(col,row,sheetindex)
	Dim strTemp,iLoop1,iLoop2,iLoop3,XLLB_D
	Dim OnABC '+,++,-
	Dim strTableName,strTableName1 
	strTemp = CellWeb1.FindCellVar(col,row,sheetindex)

	If strTemp = "" Then '点击的钮没有定义变量名，不处理
		Msg_Warning("加减行按钮应该定义一个变量名$(ABC)") 
		Exit Sub
    End If 		
	
	If Len(strTemp) < 3 Then '变量名至少3位长度
		Exit Sub
	End If 	
	
	'插入行按钮处理
	If Left(strTemp,1) ="$" Then '+,++,-需要特殊变量名 
	  strTableName = Right(Left(strTemp,3),1) '取表代码
    For iLoop1 = 0 to PubTableCount - 1
      If strTableName = PubTableArray(1,iLoop1) Then 
  		  OnABC = Right(Left(strTemp,2),1) '判断 +,++,-
  		  Select Case UCase(OnABC)
	  					 Case "A": 
	  					   If CellWeb_AddRows(CellWeb1,PubTableArray(5,iLoop1),1,PubTableArray(5,iLoop1),0,sheetindex) = True Then   '+
	  					     PubTableArray(5,iLoop1) = PubTableArray(5,iLoop1) + 1
	  					     '同一页中如有多个明细表。增加行时会影响到下部的明细表，需要把下部的明细表起始行和终止行也相应增加。
	  					     For iLoop2 = 0 to PubTableCount - 1
  					            If iLoop1<>iLoop2 And PubTableArray(6,iLoop1)=PubTableArray(6,iLoop2) And PubTableArray(4,iLoop1)<PubTableArray(4,iLoop2) Then 
  					                PubTableArray(4,iLoop2) = PubTableArray(4,iLoop2) + 1
  					                PubTableArray(5,iLoop2) = PubTableArray(5,iLoop2) + 1
  					            End If 
  					         Next 
	  					   End If 
								If (bddm="SB00112" And strTemp="$A>3") Then
									SetSelectList()
								End If 
							
							If bddm = "ZDSY100" Then 
			        	If strTemp = "$AD2" Then 
			        		XLLB_D = PubTableArray(5,iLoop1)-1
			        		'MsgBox("XLLB_D="&XLLB_D)
			        		strTableName1 = "E" '取表代码
			        		For iLoop3 = 0 To PubTableCount - 1
      							If strTableName1 = PubTableArray(1,iLoop3) Then 
      								If CellWeb_AddRows(CellWeb1,PubTableArray(5,iLoop3),1,PubTableArray(5,iLoop3),0,sheetindex) = True Then   '+
				  					     PubTableArray(5,iLoop3) = PubTableArray(5,iLoop3) + 1
				  					     '同一页中如有多个明细表。增加行时会影响到下部的明细表，需要把下部的明细表起始行和终止行也相应增加。
				  					     For iLoop2 = 0 to PubTableCount - 1
		  					            If iLoop3<>iLoop2 And PubTableArray(6,iLoop3)=PubTableArray(6,iLoop2) And PubTableArray(4,iLoop3)<PubTableArray(4,iLoop2) Then 
		  					                PubTableArray(4,iLoop2) = PubTableArray(4,iLoop2) + 1
		  					                PubTableArray(5,iLoop2) = PubTableArray(5,iLoop2) + 1
		  					            End If 
			  					       Next
			  					       '设置公式 
			  					       'MsgBox(CStr(PubTableArray(5,iLoop3)-PubTableArray(4,iLoop3)))
			  					       setInput "E2V0030Y_CPMC",PubTableArray(5,iLoop3)-PubTableArray(4,iLoop3)-1,"F"+CStr(XLLB_D),-1,5,5
			  					       setInput "E2V0030Y_JLDW",PubTableArray(5,iLoop3)-PubTableArray(4,iLoop3)-1,"K"+CStr(XLLB_D),-1,5,5
				  					   End If 
      							End If
      						Next  
			        	End If 
			        End If 
							
	  					 Case "B": 
							Dim iMaxRowCount ,iRowCount 
  						  	iMaxRowCount = 10
							sRowCount = InputBox( "请输入插入多少行：", "插入多行", "1" )
							If sRowCount = "" Then
								Exit Sub
							End If 

							On Error Resume Next
							iRowCount = CInt(sRowCount)
							If Err.Number <> 0 Then
								Msg_Warning("输入错误，请输入数字!") 
								Err.Clear    '清除错误
								Exit Sub      
							End If 
							If iRowCount <= 0 Then
								Msg_Warning("输入错误，请输入大于零的数字!") 
								Exit Sub      
							End If  
							If (iRowCount > iMaxRowCount) Then
								Msg_Warning("一次最多插入 " + CStr(iMaxRowCount) +  "　行!") 
								iRowCount = iMaxRowCount
								Exit Sub     
							End If   
							If CellWeb_AddRows(CellWeb1,PubTableArray(5,iLoop1),iRowCount,PubTableArray(5,iLoop1),0,sheetindex) = True Then  '++
							  PubTableArray(5,iLoop1) = PubTableArray(5,iLoop1) + iRowCount
							  '同一页中如有多个明细表。增加行时会影响到下部的明细表，需要把下部的明细表起始行和终止行也相应增加。
							  For iLoop2 = 0 to PubTableCount - 1
								If iLoop1<>iLoop2 And PubTableArray(6,iLoop1)=PubTableArray(6,iLoop2) And PubTableArray(4,iLoop1)<PubTableArray(4,iLoop2) Then 
									PubTableArray(4,iLoop2) = PubTableArray(4,iLoop2) + iRowCount
									PubTableArray(5,iLoop2) = PubTableArray(5,iLoop2) + iRowCount
								End If 
							  Next 
							End If 
	  					 Case "C":
' 	  					   Cell_DelCopyRow2 iLoop1  '-
 	  					    Cell_DelRow iLoop1  '-
									If (bddm="SB00112" And strTemp="$C>3") Then
										SetSelectList()
									End If 
						 Case "D":	'
							openCellWin -1,iLoop1,sheetindex 
						 Case "E":
							Dim itn,count
							itn=false
							'判断只能勾选一个
							For iLoop2 = (PubTableArray(5,iLoop1)-1) to PubTableArray(4,iLoop1) Step -1
								If (CellWeb1.GetCellDouble(5,iLoop2,sheetindex)=1) Then 'E列为勾选框列
									count = count + 1
								End If
							Next
							If (count>1) Then 'E列为勾选框列
								Msg_Warning("请勾选一条信息进行编辑！")
								Exit Sub  
							End If
							'调用勾选方法
							For iLoop2 = (PubTableArray(5,iLoop1)-1) to PubTableArray(4,iLoop1) Step -1
								If (CellWeb1.GetCellDouble(5,iLoop2,sheetindex)=1) Then 'E列为勾选框列
									itn = true
									openCellWin iLoop2-PubTableArray(4,iLoop1),iLoop1,sheetindex
									Exit For
								End If
							Next
							If itn=False Then 
								Msg_Warning("需要选中条目进行编辑！")
							End If 
						Case "M": '消费税归并
							xfsgb()
        End Select  
        
        
        'lpp 增值税减免明细表，点加行的时候，不自动计算
       If (bddm="SB00112" And sheetindex=8) Then
        	'CellWeb1.CalculateSheet sheetindex        
        	'Cell_CalculateSheet CellWeb1,strTemp  '对某些特殊变量名对应的按钮，应该重新计算某些页
        else
        	CellWeb1.CalculateSheet sheetindex        
        	Cell_CalculateSheet CellWeb1,strTemp  '对某些特殊变量名对应的按钮，应该重新计算某些页
        End If 
        Exit Sub          
      End If 
    Next
  End If 
	
	'lpp 20170511 税收调查表，按钮弹框
	If (bddm="SSDC100" And sheetindex=0) Then
		If (strTemp = "A0V0005Y_YYSYHBTN" Or strTemp = "A0V0005Y_ZZSYHBTN") Then
			openFxkSelectMx iLoop2-PubTableArray(4,iLoop1),iLoop1,sheetindex,strTemp
    	End If
    End If 
End Sub

'-------------------------------------------------------------------
'某些表页需要重新计算,对于明细表，有时插入行后以ROW（）计算的总行数不会自动计算需要重新计算
'-------------------------------------------------------------------
Public Sub Cell_CalculateSheet(CellWeb,strVarName)
  With CellWeb
    If ((strVarName = "$AK2") OR (strVarName = "$BK2") OR (strVarName = "$CK2")) Then '增值税附表三
      .CalculateSheet 2
    End If  
    If ((strVarName = "$AH2") OR (strVarName = "$BH2") OR (strVarName = "$CH2")) Then '增值税附表五
      .CalculateSheet 2
    End If  
    If ((strVarName = "$AC2") OR (strVarName = "$BC2") OR (strVarName = "$CC2")) Then '增值税附表六
      .CalculateSheet 2
    End If  
    If ((strVarName = "$AJ2") OR (strVarName = "$BJ2") OR (strVarName = "$CJ2")) Then '增值税附表七
      .CalculateSheet 2
    End If  
    If ((strVarName = "$AL2") OR (strVarName = "$BL2") OR (strVarName = "$CL2")) Then '增值税附表八
      .CalculateSheet 2
    End If  
    If ((strVarName = "$AO2") OR (strVarName = "$BO2") OR (strVarName = "$CO2")) Then '增值税附表四
      .CalculateSheet 1
    End If  

  End With 
End Sub 	

'-------------------------------------------------------------------
'点击页面按钮，以名字判断切换到对应的页签，False没有找到对应的页签
'-------------------------------------------------------------------
Function SelectSheetBySheetName(SheetName)
  Dim iLoop1,rtn
 SelectSheet = False
  iLoop1 = 0
  For iLoop1 = 0 to CellWeb1.GetTotalSheets - 1
    If Trim(SheetName) = Trim(CellWeb1.GetSheetLabel(iLoop1)) Then
    CellWeb1.SetCurSheet(iLoop1)
    SelectSheet = True
    Exit Function
    End If  
  Next
End Function

'-------------------------------------------------------------------
'点击页面按钮，以cellsheet判断切换到对应的页签，False没有找到对应的页签
'-------------------------------------------------------------------
Function SelectSheetByCellSheet(cellSheet)
 Dim totalsheets
 totalsheets = CellWeb1.GetTotalSheets
 If CInt(cellSheet) >= 0 And CInt(cellSheet) <= CInt(totalsheets) Then 
	 CellWeb1.SetCurSheet(CInt(cellSheet))
	End If 
End Function

'****************************************公用方法***********************************************

'-------------------------------------------------------------------
'功　能：根据变量名，设置单元格背景色
'参　数：strVarName:变量名；Flag：5-置读/1-可写,iCurRow:明细表1需要指定对X位移量
'返回值：0失败，1成功
'-------------------------------------------------------------------
Function Cell_SetBkColor(CellWeb,strVarName,Flag,iCurRow)
	Dim curCol,curRow,curSheet,iTableIndex
	Dim btn 
  Dim Color_old,Color_new,Color_Rdoly,Color_Edit

	btn = 1
	PubErrMsg = ""
	
  iTableIndex = getTableIndexFromVar(strVarName)
  If iTableIndex = -1 Then '找不到表索引
  	PubErrMsg = "设置单元格背景色失败，,找不到变量所在的表索引: "+ strVarName
  	btn = 0
  	Cell_SetBkColor = btn
  	Exit Function
  End If 
	
  With CellWeb
	  If (.GetCellVar(strVarName,curCol,curRow,curSheet)) = True Then '取坐标位置
    	If PubTableArray(4,iTableIndex) > 0 Then '明细表
        curRow = PubTableArray(4,iTableIndex) + iCurRow
      End If     
      Color_old   = .GetCellBackColor(curCol,curRow,curSheet)  '单元格的原背景颜色
      Color_Rdoly = .RdOnlyCellColor() '取置读区背景色
   
      If Flag = 5 Then 
        .SetCellBackColor curCol,curRow,curSheet,-1 '设置单元格的背景颜色为默认色
      Else 	
        Color_Edit  = .FindColorIndex(RGB(255,252,221),1)'默认设置可写区背景颜色
        For iLoop1 = 4 to .GetCols(curSheet) - 4
          For iLoop2 = 4 to .GetRows(curSheet) - 4
            If .GetCellInput(iLoop1,iLoop2,curSheet) <> 5 Then 
              Color_Edit  = .GetCellBackColor(iLoop1,iLoop2,curSheet)  '取可写区背景颜色
              Exit For 
            End If 
          Next
        Next
        .SetCellBackColor curCol,curRow,curSheet,Color_Edit  '设置本区单元格背景颜色
      End If   
	  Else 
      btn = 0	  	
      PubErrMsg = "设置单元格背景色失败，找不到变量名: " + strVarName
		End If
	End With 
	Cell_SetBkColor = btn
End Function 
'-------------------------------------------------------------------
'功　能：根据变量名，设置单元格公式
'参　数：strVarName:变量名；Formula：公式,iCurRow:明细表1需要指定对X位移量
'返回值：0失败，1成功
'-------------------------------------------------------------------
Function Cell_SetFormula(CellWeb,strVarName,Formula,iCurRow)
	Dim curCol,curRow,curSheet,iTableIndex
  Dim iLoop1,oldInput 
	Dim btn 
	btn = 1
	PubErrMsg = ""
	
  iTableIndex = getTableIndexFromVar(strVarName)
  If iTableIndex = -1 Then '找不到表索引
  	PubErrMsg = "设置公式失败，,找不到变量所在的表索引: "+ strVarName
  	btn = 0
  	Cell_SetFormula = btn
  	Exit Function
  End If 

  With CellWeb
	  If (.GetCellVar(strVarName,curCol,curRow,curSheet)) = True Then '取坐标位置
    	If PubTableArray(4,iTableIndex) > 0 Then '明细表
        curRow = PubTableArray(4,iTableIndex) + iCurRow
      End If   
      oldFormula=.GetFormula(curCol,curRow,curSheet)
      if oldFormula<>Formula then 
	  	  oldInput = .GetCellInput(curCol,curRow,curSheet)  '取原控制方式
	  	  .SetCellInput curCol,curRow,curSheet,1  '取消控制方式
		  	btn = .SetFormula(curCol,curRow,curSheet,Formula) '设置公式
	  	  .SetCellInput curCol,curRow,curSheet,oldInput  '复原控制方式
	      If btn = 0 Then 
	      	PubErrMsg = "设置公式失败，变量名: " + strVarName
	      End If 
      end if 
	  Else 
      btn = 0	  	
      PubErrMsg = "设置公式失败，找不到变量名: " + strVarName
		End If
	End With 
	Cell_SetFormula = btn
End Function 
'-------------------------------------------------------------------
'功　能：根据变量名，设置单元格置读或者可写，对明细表1也可以设置
'参　数：strVarName:变量名；iCurRow:明细表1需要指定对X位移量
'       bz：置读或者可写(0 缺省(与1同),1 无控制 ,2 数值 ,3 整数 ,4 电话号码 ,5 只读 )
'返回值：0失败，1成功
'-------------------------------------------------------------------
Public Function Cell_SetWR(CellWeb,strVarName,iCurRow,bz)
	Dim curCol,curRow,curSheet,iTableIndex
  Dim iLoop1
	PubErrMsg = ""

  Cell_SetWR = 1
  iTableIndex = getTableIndexFromVar(strVarName)
  If iTableIndex = -1 Then '找不到表索引
  	PubErrMsg = "设置可写置读失败,找不到变量所在的表索引: "+ strVarName
  	Msg_Warning(PubErrMsg)
    Cell_SetWR = 0
  	Exit Function
  End If 
	
  With CellWeb
    If (.GetCellVar(strVarName,curCol,curRow,curSheet)) = True Then '取坐标位置
    	If PubTableArray(4,iTableIndex) > 0 Then '明细表
        curRow = PubTableArray(4,iTableIndex) + iCurRow
      End If     
  	  .SetCellInput curCol,curRow,curSheet,bz  '设置设置指定单元格的输入控制方式
  	Else 
      PubErrMsg = "设置可写置读失败,找不到变量名: " + strVarName
    	Msg_Warning(PubErrMsg)
      Cell_SetWR = 0
    	Exit Function
	  End If     	
	End With 
End Function 
'-------------------------------------------------------------------
'功　能：根据变量名，写单元格内容，对明细表1也可以设置
'参　数：strVarName:变量名；iCurRow:明细表1需要指定对X位移量
'       strValue:设置内容
'返回值：0失败，1成功
'-------------------------------------------------------------------
Public Function Cell_CtrlDataW(CellWeb,strVarName,iCurRow,strValue)
	Dim curCol,curRow,curSheet,iTableIndex,strVarType
  Dim iLoop1,oldInput
	PubErrMsg = ""

 	Cell_CtrlDataW = 1
  iTableIndex = getTableIndexFromVar(strVarName)
  If iTableIndex = -1 Then '找不到表索引
  	PubErrMsg = "写单元格内容失败,找不到变量所在的表索引: "+ strVarName
  	Msg_Warning(PubErrMsg)
  	Cell_CtrlDataW = 0
  	Exit Function
  End If 
	strVarType = ""
	strVarType = Mid(strVarName,InStr(strVarName,"_")-6,1)'取变量属性：数值，日期，字符
  With CellWeb
    If (.GetCellVar(strVarName,curCol,curRow,curSheet)) = True Then '取坐标位置
    	If PubTableArray(4,iTableIndex) > 0 Then '明细表
        curRow = PubTableArray(4,iTableIndex) + iCurRow
      End If     
    	  oldInput = .GetCellInput(curCol,curRow,curSheet)  '取原控制方式
    	  .SetCellInput curCol,curRow,curSheet,1  '取消控制方式
	      If (strVarType="N") Then		'设置设置指定单元格的内容
       		CellWeb1.SetCellDouble curCol,curRow,curSheet,strValue 
	      ElseIf (strVarType="D") Then	'日期 
 	      	CellWeb1.SetCellDateTime curCol,curRow,curSheet,strValue             
	      Else
      		CellWeb1.SetCellString curCol,curRow,curSheet,strValue
	      End If
    	  .SetCellInput curCol,curRow,curSheet,oldInput  '复原控制方式
  	Else 
      PubErrMsg = "写单元格内容失败,找不到变量名: " + strVarName
    	Msg_Warning(PubErrMsg)
    	Cell_CtrlDataW = 0
    	Exit Function
	  End If     	
	End With 
End Function 
'-------------------------------------------------------------------
'功　能：根据变量名，读单元格内容，对明细表1也可以设置
'参　数：strVarName:变量名；iCurRow:明细表1需要指定对X位移量
'返回值：单元格内容
'-------------------------------------------------------------------
Public Function Cell_CtrlDataR(CellWeb,strVarName,iCurRow)
	Dim curCol,curRow,curSheet,iTableIndex
  Dim iLoop1,strCellValue,strVarType,strTemp,iVarDL,StrVarLength
	PubErrMsg = ""

  strCellValue = ""
 	Cell_CtrlDataR = ""
  iTableIndex = getTableIndexFromVar(strVarName)
  If iTableIndex = -1 Then '找不到表索引
  	PubErrMsg = "读单元格内容失败,找不到变量所在的表索引: "+ strVarName
  	Msg_Warning(PubErrMsg)
  	Exit Function
  End If 
	
  With CellWeb
    If (.GetCellVar(strVarName,curCol,curRow,curSheet)) = True Then '取坐标位置
    	If PubTableArray(4,iTableIndex) > 0 Then '明细表
        curRow = PubTableArray(4,iTableIndex) + iCurRow
      End If 
      If curRow=iCurRow Then 
      	curRow = 0
      End If 
      Cell_CtrlDataR = Cell_GetCellData(strVarName,curRow)
    Else 
      PubErrMsg = "读单元格内容失败,找不到变量名: " + strVarName
    	Msg_Warning(PubErrMsg)
    	Exit Function
	  End If  
	End With 	
		
End Function 


'-------------------------------------------------------------------
'根据变量名获取其表的index
'-------------------------------------------------------------------
Public Function getTableIndexFromVar(strCellVarName)
	Dim inpos,talias,tpro,iLoop2
	inpos=InStr(strCellVarName,"_")
	talias=left(strCellVarName,inpos-8)
	tpro=Mid(strCellVarName,inpos-7,1)
	For iLoop2 = 0  to PubTableCount - 1 
	    If talias = PubTableArray(1,iLoop2) And tpro=PubTableArray(2,iLoop2) Then
	    	getTableIndexFromVar=iLoop2
	    	Exit Function
	    End If 	
	Next
	getTableIndexFromVar= -1
End Function



'降序排列数组
Function getArray(parm)
	Dim arrNames
	arrNames=parm
	For i1 = (UBound(arrNames) - 1) to 0 Step -1
    	For j1= 0 to i1
        	If arrNames(j1) < arrNames(j1+1) Then
            	strHolder = arrNames(j1+1)
            	arrNames(j1+1) = arrNames(j1)
            	arrNames(j1) = strHolder
        	End If
    	Next
	Next 
	getArray=arrNames
End Function

'VBScript 中，消息框
Public Sub Msg_OK(sMsg) '显示提示消息图标
	If sMsg <> "" Then
		MsgBox sMsg, vbInformation
	End If  
End Sub

Public Sub Msg_Warning(sMsg) '显示警告消息图标
	If sMsg <> "" Then
		MsgBox sMsg, vbExclamation
	End If  
End Sub

Public Function Msg_YesNo(sMsg) '显示警告询问图标,点 是 返回Y,点 否 返回 N
	Dim iRt
	If sMsg <> "" Then
    	iRt = MsgBox(sMsg, vbYesNo + vbQuestion)
	End If  
	If iRt = vbYes Then
    	Msg_YesNo = "Y"
	End If  
	If iRt = vbNo Then  
    	Msg_YesNo = "N"
	End If  
End Function

'转换XML数据中的<>
Function parseString(param) 
	param = Replace(param,"&","&amp;")
	param = Replace(param,"<","&lt;")
	param = Replace(param,">","&gt;")
	parseString = param
End Function


Function SortArr(ary)
	Dim KeepChecking,I,FirstValue,SecondValue
	KeepChecking = TRUE 
	Do Until KeepChecking = FALSE 
		KeepChecking = FALSE 
		For I = 0 to UBound(ary) 
			If I = UBound(ary) Then Exit For 
			If CInt(ary(I)) < CInt(ary(I+1)) Then 
				FirstValue = ary(I) 
				SecondValue = ary(I+1) 
				ary(I) = SecondValue 
				ary(I+1) = FirstValue 
				KeepChecking = TRUE 
			End If 
		Next 
	Loop 
	SortArr = ary 
End Function


'========================== new add glj 08.03.28 明细表25行打印 ================================

'-------------------------------------------------------------------
' 补行明细表打印
'   算法：页面中再放一打印CELL(CellWeb_print)，将当前打印页复制到 CellWeb_print ，
'         按CellWeb1中定义的变量计算复制行并对CellWeb_print操作(补行，设首尾等)，CellWeb_print不显示，每次打印前都重复这种工作。
'  CurTableIndex 当前页需要补行的TABLE代码
'-------------------------------------------------------------------
Public Function Cell_PrintMx()   
  Dim iLoop1,CurSheet,iCurTableIndex,btn,Flag
  CurSheet = CellWeb1.GetCurSheet 
  Flag = 0
  btn = False
  iCurTableIndex = -1
	For iLoop1 = 0 to PubTableCount - 1 '按表数循环，取当前页的表名索引值
		If CStr(curSheet)=CStr(PubTableArray(6,iLoop1)) Then 
			iCurTableIndex = iLoop1
			btn = True
			Exit For
		End If
  Next  
  If btn = True Then '明细表有XY变量的，会找到PubTableArray(6，
    If PubTableArray(2,iCurTableIndex) = 2 Then '明细表，需要补行 
      Flag = 1
    End If   
  End If 

  Cell_SheetCopy() '打印页复制到打印 CellWeb_print 中       
  Cell_SheetCopy_Edit(CellWeb_print) '修改边框宽度                 
  If Flag = 1 Then 
    Cell_SetRowPageBreak iCurTableIndex,25,1  '补行，设硬分页符，设表尾，表头
  Else
  '单色打印，A4横向纸，打印比例 等原CellWeb1中参数不能复制，需要逐个提取并对CellWeb_print重新设定
    CellWeb_print_Preview (Flag)
    CellWeb_print.CloseFile()
    CellWeb_print.ResetContent
    CellWeb_print.Clear 32
  End If 

End Function


'-------------------------------------------------------------------
' 将当前表页复制到另一个CELL控件中，便于打印操作(适合于需要补行的明细表，对于主表会出现公式错误，因为缺少其它表页)
'-------------------------------------------------------------------
Public Function Cell_SheetCopy() 
  Dim CellFilename,iCurSheet,iMaxSheet,iCurTableIndex
  Dim iSheet_Front,iSheet_Behind
  Dim i,j
  Cell_SheetCopy = False
  
  iCurSheet = CellWeb1.GetCurSheet()
  iMaxSheet = CellWeb1.GetTotalSheets() - 1

 	If (CellWeb1.IsModified = 1) Then  
    If cell_save(CellWeb1,nsrsbh,sssqq,sssqz,server_version,bddm,2) = False Then
    	PubErrMsg = "打印失败，无法保存报表文件"
  	  Exit Function 
    End If 
  End If 
  
  CellFilename = CellWeb1.GetFileName
  If Cell_OpenFile(CellWeb_print,CellFilename) = False Then
  	PubErrMsg = "打印失败，无法打开打印报表"
  	Exit Function
  End If
 
  iCurSheet = CellWeb1.GetCurSheet()
  CellWeb_print.SetCurSheet iCurSheet 
  MaxRow = CellWeb_print.GetRows(iCurSheet) - 1
  MaxCol = CellWeb_print.GetCols(iCurSheet) - 1
  
  For iLoop1 = 0 to PubTableCount - 1 '按表数循环，取当前页的表名索引值
		If CStr(iCurSheet)=CStr(PubTableArray(6,iLoop1)) Then 
			iCurTableIndex = iLoop1
			btn = True
			Exit For
		End If
  Next
  
  With CellWeb_Print 
    For j = 1 To MaxRow
      If ((.IsFormulaCell(6, j, iCurSheet)>0) ) Then
	  	  .SetCellInput 6, j, iCurSheet, 1
    	  .ClearArea 6,j,6,j,iCurSheet,2
      End If
	  Next
	  .Invalidate
   
	  YRow = PubTableArray(5,iCurTableIndex)
	  For i = 1 To MaxCol
      'If ((.GetCellInput( i, MaxRow - 5, iCurSheet) = 5) and (.IsFormulaCell(i, MaxRow - 5, iCurSheet)>0) ) Then
	 	  '  .SetCellInput i, MaxRow - 5, iCurSheet, 1
    	'  .ClearArea i,MaxRow - 5,i,MaxRow - 5,iCurSheet,2
      'End If
      If ((.GetCellInput( i, YRow + 1, iCurSheet) = 5) and (.IsFormulaCell(i, YRow + 1, iCurSheet)>0) ) Then
	 	    .SetCellInput i, YRow + 1, iCurSheet, 1
    	  .ClearArea i,YRow + 1,i,YRow + 1,iCurSheet,2
      End If
    Next
    .Invalidate
  End With

  
  iMaxSheet = CellWeb1.GetTotalSheets() - 1
  CellWeb_print.DeleteSheet iCurSheet + 1, iMaxSheet - iCurSheet
  CellWeb_print.DeleteSheet 0, iCurSheet

'  Cell_FileSave CellWeb_Print,"" 
  
  Cell_SheetCopy = True
End Function 


Public Sub Cell_SheetCopy1()   
  Dim CurSheet,curSheetLable,MaxCol,MaxRow
  Dim startCol,startRow, endCol,endRow  
  Dim iTemp
time1=Now()  
  CurSheet = CellWeb1.GetCurSheet 
  iTemp = CellWeb1.IsSheetProtect(CurSheet) '判断有无页保护　
  If iTemp > 0 Then 
    CellWeb1.UnProtectSheet CurSheet,Pub_FilePassword '页面先解锁
  End If   
  curSheetLable = CellWeb1.GetSheetLabel(CurSheet)

  MaxCol = CellWeb1.GetCols(CurSheet)
  MaxRow = CellWeb1.GetRows(CurSheet)
time2=Now()  
  CellWeb1.CopyRange 1,1,MaxCol - 1,MaxRow - 1 
  If iTemp > 0 Then 
    CellWeb1.ProtectSheet CurSheet,Pub_FilePassword '恢复页面加锁
  End If   
time4=Now()  
  CellWeb_print.ResetContent
  CellWeb_print.Clear 32
  CellWeb_print.SetSheetLabel 0,curSheetLable
  CellWeb_print.SetCols MaxCol,0
  CellWeb_print.SetRows MaxRow,0

  CellWeb_print.Paste 1,1,2,1,0 '先粘贴文字和数值
  CellWeb_print.Paste 1,1,3,1,0 '再粘贴格式
'	CellWeb1.ClearSelection
'	CellWeb1.Invalidate
'time5=Now()  
'msg_ok("time1:"&cstr(time1)&Chr(13)&"time2:"&cstr(time2)&Chr(13)&"time3:"&cstr(time3)&Chr(13)&"time4:"&cstr(time4)&Chr(13)&"time5:"&cstr(time5))
'  CellWeb_print.Paste 1,1,0,1,0 
End Sub
'-------------------------------------------------------------------
'修改粘贴后的报表，将边框宽度(外4行，列)置0，便于打印
'-------------------------------------------------------------------
Public Sub Cell_SheetCopy_Edit(CellWeb)   
  Dim iCurSheet,MaxCol,MaxRow
  Dim iLoop2,iLoop3,iLoopEnd,iHeight,iColor1
  Dim colTemp,rowTemp,sheetTemp
  iLoopEnd = 4
  iHeight  = 0 
  With CellWeb
    iCurSheet = .GetCurSheet()
    MaxRow = .GetRows(iCurSheet) - 1 
    MaxCol = .GetCols(iCurSheet) - 1
    .SetRowHidden 1,iLoopEnd
    .SetRowHidden MaxRow - 3,MaxRow
    .SetColHidden 1,iLoopEnd
    If .GetSheetLabel(iCurSheet) = "附表四" And .GetCellVar("O2V0040N_SB_FLZL4_MXXX_SX",colTemp,rowTemp,sheetTemp)=True then 
      .SetColHidden MaxCol - 4,MaxCol
    Else 
      .SetColHidden MaxCol - 3,MaxCol
    End If 
    
    '--1.设置单元格背景色:默认值，设置边框线色-- 
'    iColor1 = .FindColorIndex(RGB(0,0,0),1) '边框线颜色
'    For iLoop2 = 1 to MaxCol  '逐列
'      For iLoop3 = 1 to MaxRow    '逐行
'        .SetCellBackColor iLoop2,iLoop3,curCellSheet,-1         '设置全部单元格的背景颜色为默认色
'        .SetCellBorderClr iLoop2,iLoop3,curCellSheet,0,iColor1  '设置指定单元格的边框线颜色
'        .SetCellBorderClr iLoop2,iLoop3,curCellSheet,1,iColor1  '设置指定单元格的边框线颜色
'        .SetCellBorderClr iLoop2,iLoop3,curCellSheet,2,iColor1  '设置指定单元格的边框线颜色
'        .SetCellBorderClr iLoop2,iLoop3,curCellSheet,3,iColor1  '设置指定单元格的边框线颜色
'      Next  
'    Next
  End With 
End Sub

'-------------------------------------------------------------------
'按每页打印的行数，设置硬分页符，最后一页，不足满页的根据Flag设置是否进行补充
'参数说明：MaxLine(数值):打印每页的最大明细行(模板中调试好不应超过默认打印的最大行)
'         Flag=1:需要补足行至满页,0否
'         CurTableIndex 当前页需要补行的TABLE代码
'-------------------------------------------------------------------
Public Sub Cell_SetRowPageBreak(CurTableIndex,MaxLine,Flag)   
  Dim iCurTableIndex,MaxCol,StartRow,EndRow,MaxRow,XRow,YRow
  iCurTableIndex = CurTableIndex
  Dim iCurSheet 'CellWeb_print当前页号
  Dim iOldLine,iAddLine,iCntSheet,iLoop1,iLoop2
  Dim strTemp,iTemp 

  iCurSheet = CellWeb_Print.GetCurSheet() 
  
  '读X，Y明细表的起始终止位置值,
  XRow = PubTableArray(4,iCurTableIndex)
  YRow = PubTableArray(5,iCurTableIndex)


  '按照每页最大明细行数，计算补足最末页行数
  iOldLine = (PubTableArray(5,iCurTableIndex) - PubTableArray(4,iCurTableIndex) - 1)
  If iOldLine = 0 Then 
    iCntSheet =  1 '只有1页
    iAddLine = 25
  End If   
  
  If iOldLine > 0 Then 
    iCntSheet = Int(iOldLine/MaxLine)
    iTemp = (iOldLine - (MaxLine * Int(iOldLine/MaxLine)))
    If iTemp > 0 Then 
      iAddLine = MaxLine - iTemp
      iCntSheet = iCntSheet + 1 '计算共几页
    Else 
      iAddLine = 0
    End If 
  End If   


  EndRow   = PubTableArray(5,iCurTableIndex) + iAddLine
  If iAddLine > 0 Then
    StartRow = YRow

    CellWeb_AddRows CellWeb_print,StartRow,iAddLine,YRow,0,iCurSheet  '补行
    
  	With CellWeb_print '全部补行可写
  	  StartCol =  1
  	  StartRow = YRow
  	  EndCol   = CellWeb_print.GetCols(iCurSheet) - 1
  	  EndRow   = EndRow
		  CurCol = .GetCurrentCol
	    CurRow = .GetCurrentRow
			For iLoop1 = StartCol To EndCol
				For iLoop2 = StartRow To EndRow
			    .SetCellInput iLoop1, iLoop2, iCurSheet, 1
				Next
			Next
  		.Invalidate
    End With
    CellWeb_print.ClearArea StartCol, StartRow, EndCol, EndRow,iCurSheet,1'将新补行清除掉全部内容，完全是空行
  End If 
	 
  MaxRow = CellWeb_print.GetRows(iCurSheet) - 1 
  MaxCol = CellWeb_print.GetCols(iCurSheet) - 1
  
'  CellWeb_print.CalculateSheet iCurSheet '重新计算公式
  CellWeb_print.CopyRange 1,EndRow + 1 ,MaxCol,EndRow + 1 '复制总计行

  dim str_tmp
  str_tmp = PubTableArray(4,iCurTableIndex) - 1
  cell_setxj CellWeb_print,iCntSheet,XRow,MaxLine,MaxCol,iCurSheet,EndRow,MaxRow,str_tmp,1

End Sub

'-------------------------------------------------------------------
'在表首或表尾下加入一行
'flag: 0 在表首加；1 在表尾加
'返回值：相对于X行的相对行位移
'-------------------------------------------------------------------
Public Function CellWeb_AddOneRowXorY(flag, iTableIndex, iSheet)
	Dim iRow
	If flag = 1 Then
		iRow = PubTableArray(5,iTableIndex)
	Else
		iRow = PubTableArray(4,iTableIndex)+1
	End If 
	If CellWeb_AddRows(CellWeb1,iRow,1,iRow,0,iSheet) = True Then 
		PubTableArray(5,iTableIndex) = PubTableArray(5,iTableIndex) + 1
		'同一页中如有多个明细表。增加行时会影响到下部的明细表，需要把下部的明细表起始行和终止行也相应增加。
		For iLoop2 = 0 to PubTableCount - 1
		If iTableIndex<>iLoop2 And PubTableArray(6,iTableIndex)=PubTableArray(6,iLoop2) And PubTableArray(4,iTableIndex)<PubTableArray(4,iLoop2) Then 
			PubTableArray(4,iLoop2) = PubTableArray(4,iLoop2) + 1
			PubTableArray(5,iLoop2) = PubTableArray(5,iLoop2) + 1
		End If 
		Next 
	    CellWeb_AddOneRowXorY = iRow - PubTableArray(4,iTableIndex)
	Else
		CellWeb_AddOneRowXorY = -1
	End If 
End Function 
'-------------------------------------------------------------------
'表行复制，用于追加明细表，且要求X、Y定义在总计之上表头之下
'复制时，会以Y行所在行为模板行，进行复制，行高默认为18
'CellWeb 为页面上的CELL插件名,CopyN插入行数量, 在YRow行之上复制
'XRow　X行,下载时取X行，正常录入插入行时取Y行
'YRow 明细行定义末坐标,其中YRow当为下载复制行时，为第一个有核选框的行数，而非真正的YRow坐标行
'Flag : 0录入时插入行，以Y行为模板；1下载时插入行，以X为模板
'CurSheetIndex 插入行的表页索引号
'-------------------------------------------------------------------
Public Function CellWeb_AddRows(CellWeb,YRow,CopyN,XRow,Flag,CurSheetIndex)
  Dim btn
  Dim StartRow,EndRow,iCurSheet
  Dim MaxCol
  Dim iLoop1,iLoop2,iLoop3
  Dim Line_Y,Line_N '已设置行，剩余设置行
  btn = False
'  iCurSheet = CellWeb.GetCurSheet()
  iCurSheet = CurSheetIndex
  StartRow = YRow '复制起始行
  EndRow   = StartRow + CopyN - 1 '复制结束行
'  CellWeb.MoveToCell 1,StartRow '移到复制行
  CellWeb.InsertRow StartRow,CopyN,iCurSheet
  CellWeb.SetCurSheet iCurSheet
  Line_N = CopyN
  Line_Y = 0

  MaxCol = CellWeb.GetCols(iCurSheet)
  For iLoop1 = 1 To MaxCol - 1 '全部复制行先可写
    For iLoop2 = StartRow To EndRow
      CellWeb.SetCellInput iLoop1, iLoop2, iCurSheet, 1 '可写
 	  Next
  Next
  If Flag = 1 Then
    CellWeb.CopyRange 1,XRow,MaxCol - 1,XRow '复制模板
  Else 
    CellWeb.CopyRange 1,EndRow + 1,MaxCol - 1,EndRow + 1 '复制模板行
  End If 

  CellWeb.Paste 1,StartRow,0,True,False  '将模板行复制到第一个新增行
  CellWeb.SetRowHeight 1,18,StartRow,iCurSheet '设置行高 
  Line_Y = 1
  Line_N = Line_N - 1
  Do While Line_N > 0 
    Line_Copy = Line_Y    	
    If Line_N < Line_Y Then
      Line_Copy = Line_N    	
    End If 
'msg_ok("Line_Y:"&CStr(Line_Y)&Chr(13)&"Line_N:"&CStr(Line_N)&Chr(13)&"Line_Copy:"&CStr(Line_Copy)&Chr(13)&"StartRow:"&CStr(StartRow))    
    CellWeb.CopyRange 1,StartRow,MaxCol - 1,StartRow + Line_Copy - 1 '复制模板
    CellWeb.Paste 1,StartRow + Line_Y,0,True,False  '将模板行复制到第一个新增行
    Line_Y = Line_Y + Line_Copy
    Line_N = Line_N - Line_Copy
  Loop 
 
'msg_ok("插入行数量："&CopyN&Chr(13)&"time1:"&cstr(time1)&Chr(13)&"time2:"&cstr(time2)&Chr(13)&"time3:"&cstr(time3)&Chr(13)&"time4:"&cstr(time4))
  btn = True
  CellWeb_AddRows = btn
End Function 

'-------------------------------------------------------------------
'功能：准备一些空表行
'参数：表名sTableName，总行数iCountInsRow
'返回值：1：成功,0：失败
'明细表，可以手工插入行进行录入，也可以下载一部分明细数据，下载的在上部以X坐标起向下，手工插入的在下部以Y坐标起向上。
'此功能事先在明细表中准备好需要的空表行，再正常调用Cell_DispXml()从X行开始向下逐行写数据
'E列为核选框，全行各单元格属性取决于模板X行设置。
'X坐标变量名-1行位置保存已经有的下载行距X位置偏移量(保存在X位置会复制)，反复下载需要从X坐标到偏移量计算插入行数量
'X行是下载数据的模板行
'Flag:是否插入空白行标志。　0：只删除旧数据行不插入新行，1：先删除旧数据行再插入新行。
'-------------------------------------------------------------------
Function cell_InsRow_Down(sTableName,iCountInsRow,Flag)
  Dim curCol,curRow,curSheet
  Dim iLoop1,iLoop2,iTableIndex,iStartRow,iEndRow,iCountOldRow
  Dim strTemp,iTemp
  iTableIndex = -1
  For iLoop1 = 0  to PubTableCount - 1 '第二层循环,table循环
	  If (sTableName) = PubTableArray(0,iLoop1) Then	'找到该TableName对应的在PubTableArray的索引号
	    iTableIndex = iLoop1
	  	Exit For
	 	End If 	
	Next
  If iTableIndex = -1 Then 
		PubErrMsg = "下载数据出错，没有在报表中找到TableName：" + sTableName
	 	cell_InsRow_Down = 0
	 	Exit Function
  End If 
'	strTemp = "$X" + PubTableArray(1,iTableIndex) + "2" 
	strTemp = "$X" + PubTableArray(1,iTableIndex) + PubTableArray(2,iTableIndex) 
	if((CellWeb1.GetCellVar(strTemp,curCol,curRow,curSheet)) <> True) Then '通过读X变量对应的坐标,获取当前页号
		PubErrMsg = "下载数据出错，没有在报表中定义X坐标：" + sTableName
	 	cell_InsRow_Down = 0
	 	Exit Function
	End If
	curRow = curRow - 1
	CellWeb1.SetCurSheet(curSheet) '装入当前页
	CellWeb1.MoveToCell curCol,curRow
  strTemp = CellWeb1.GetCellString(curCol,curRow,curSheet) '取X变量名对应的单元格中的内容
  If Len(Trim(strTemp)) > 0 Then 
  	iTemp = 0
    On Error Resume Next
      iTemp = CInt(strTemp)
      If Err.Number <> 0 Then
        Err.Clear    '清除错误
      End If  
  End If 
  iStartRow = PubTableArray(4,iTableIndex) 'X	坐标
  iEndRow   = PubTableArray(5,iTableIndex) 'Y 坐标 	
  
  iCountOldRow = iTemp  '原有下载行数
  If iCountOldRow > 0 Then '删除原有的下载行 
  	CellWeb1.DeleteRow iStartRow + 1,iCountOldRow,curSheet
	  PubTableArray(5,iTableIndex)=PubTableArray(5,iTableIndex) - iCountOldRow
	  iEndRow = iEndRow - iCountOldRow
  End If 
  If Flag =1 Then 
  	CellWeb_AddRows CellWeb1,iStartRow + 1,iCountInsRow,iStartRow,1,curSheet
    'CellWeb1.InsertRow iStartRow + 1,iCountInsRow,curSheet
    PubTableArray(5,iTableIndex) = PubTableArray(5,iTableIndex) + iCountInsRow
    CellWeb1.S curCol,curRow,curSheet,iCountInsRow 
    CellWeb1.CalculateSheet CurSheet '重新计算公式
  End If   
	cell_InsRow_Down = 1

End Function

'-------------------------------------------------------------------
'删除表中所有的行
'tablename:表名
'-------------------------------------------------------------------
Public Function Cell_DelALLRow(tablename)

Dim iLoop1,tablename_1,sheet,XG3,YG3,xrow,yrow
  XG3 = "$X"&tablename
  YG3 = "$Y"&tablename
  tablename_1 = Left(tablename,1)
	For iLoop1 = 0 to PubTableCount - 1
    If tablename_1 = PubTableArray(1,iLoop1) Then 
    	If (CellWeb1.GetCellVar(XG3,col,xrow,sheet)=true and CellWeb1.GetCellVar(YG3,col,yrow,sheet)=true) Then
	   		iCountOldRow = yrow-xrow-1 
			  CellWeb1.DeleteRow xrow + 1,yrow-xrow-1,sheet
			  PubTableArray(5,iLoop1)=PubTableArray(5,iLoop1) - iCountOldRow
			End  If  
			Exit Function          
    End If 
  Next
End Function

'-------------------------------------------------------------------
'删除选中的表行，需要用鼠标勾选删除的表行,可以删除的一定应该在E列有勾选框 
'tindex:表索引号
'-------------------------------------------------------------------
Public Sub Cell_DelRow(tindex)

	Dim iLoop2,curCol,curRow,curSheet,temp,strTemp,strTableName1
	Dim itn
	Dim haveMsg
	Dim iX,iAX 'x坐标单元格数值，为下载行数
	curSheet = CellWeb1.GetCurSheet()
	curRow = CellWeb1.GetCurrentRow() '获得当前删除的行号
	haveMsg=false
	itn=false
  
  
	iX = PubTableArray(4,tindex)
'	strTemp = "$X" + PubTableArray(1,tindex) + "2" 
	strTemp = "$X" + PubTableArray(1,tindex) + PubTableArray(2,tindex) 
	
	if((CellWeb1.GetCellVar(strTemp,curCol,curRow,curSheet)) <> True) Then '通过读X变量对应的坐标,获取当前页号
		PubErrMsg = "删除数据出错，没有在报表中定义X坐标：" + sTableName
	 	Exit Sub
	End If
	curRow = curRow - 1
  strTemp = CellWeb1.GetCellString(curCol,curRow,curSheet) '取X变量名对应的单元格中的内容
  If Len(Trim(strTemp)) > 0 Then 
  	iAX = 0
    On Error Resume Next
      iAX = CInt(strTemp)
      If Err.Number <> 0 Then
        Err.Clear    '清除错误
      End If  
  End If 
  
	For iLoop2 = (PubTableArray(5,tindex)-1) to PubTableArray(4,tindex) Step -1
		If (CellWeb1.GetCellDouble(5,iLoop2,curSheet)=1) Then 'E列为勾选框列
			itn=True
			If haveMsg = False Then 
				If(confirm("确实要删除选中行吗?")) Then
					haveMsg = True
				Else 
					Exit Sub		
				End If  
			End If   
			If haveMsg = True Then 
				CellWeb1.DeleteRow iLoop2,1,curSheet
				PubTableArray(5,tindex)=PubTableArray(5,tindex)-1
				'同一页中如有多个明细表。删除行时会影响到下部的明细表，需要把下部的明细表起始行和终止行也相应减行。
				For tindex2 = 0 to PubTableCount - 1
					If tindex<>tindex2 And PubTableArray(6,tindex)=PubTableArray(6,tindex2) And PubTableArray(4,tindex)<PubTableArray(4,tindex2) Then 
						 PubTableArray(4,tindex2) = PubTableArray(4,tindex2) -1
						PubTableArray(5,tindex2) = PubTableArray(5,tindex2) -1
					End If 
				Next 
				If ((iLoop2 > iX) and (iLoop2<=iX + iAX)) Then 
					iAX = iAX - 1
					CellWeb1.S curCol,curRow,curSheet,iAX 
				End If
				
				If bddm = "ZDSY100" Then 
        	If PubTableArray(1,tindex) = "D" Then 
        		XLLB_D = iLoop2- PubTableArray(4,tindex)
        		strTableName1 = "E" '取表代码
        		For iLoop3 = 0 To PubTableCount - 1
							If strTableName1 = PubTableArray(1,iLoop3) Then 
								PubTableArray(5,iLoop3)=PubTableArray(5,iLoop3)-1
								CellWeb1.DeleteRow PubTableArray(4,iLoop3)+XLLB_D,1,curSheet
							End If 
						Next 
        	End If 
        End If  	
			End If
		End If
	Next
	CellWeb1.CalculateAll()

	If(itn=false)Then
		Msg_Warning("需要选中条目进行删除！")
	Else
'		Cell_GetCopyRowVar(CellWeb1)'重新获取CELL表中明细需要复制行的起始、终止点行坐标   
	End if
End Sub

'-------------------------------------------------------------------
'删除表中的第iRow行，
'iSheet：页签号
'tIndex:表索引号
'-------------------------------------------------------------------
Public Sub Cell_DelOneRow(iRow, iSheet, tIndex)
	CellWeb1.DeleteRow iRow,1,iSheet
	PubTableArray(5,tIndex)=PubTableArray(5,tIndex)-1
	'同一页中如有多个明细表。删除行时会影响到下部的明细表，需要把下部的明细表起始行和终止行也相应减行。
	For tindex2 = 0 to PubTableCount - 1
		If tIndex<>tindex2 And PubTableArray(6,tIndex)=PubTableArray(6,tindex2) And PubTableArray(4,tIndex)<PubTableArray(4,tindex2) Then 
			 PubTableArray(4,tindex2) = PubTableArray(4,tindex2) -1
			PubTableArray(5,tindex2) = PubTableArray(5,tindex2) -1
		End If 
	Next 
	'If ((iLoop2 > iX) and (iLoop2<=iX + iAX)) Then 
		'iAX = iAX - 1
		'CellWeb1.S curCol,curRow,curSheet,iAX 
	'End If 	
End Sub 
'-------------------------------------------------------------------
'打印当前Sheet，用于有特殊需求的明细表的打印，如：宁波要求每页25行明细，每页有页小计和总计行
'Flag:0-主表，无补行，不需要出现页脚；1-有补行，需要页脚
'-------------------------------------------------------------------
Public Sub CellWeb_print_Preview(Flag)   
  Dim iCurSheet '当前页号
  Dim iCtPage '总页数
  Dim bj_Top,bj_Left,bj_Bottom,bj_Right '边距
  bj_Top    = CellWeb1.PrintGetMargin(1)  '上边距
  bj_Left   = CellWeb1.PrintGetMargin(0)  '左边距
  bj_Bottom = CellWeb1.PrintGetMargin(3)  '下边距
  bj_Right  = CellWeb1.PrintGetMargin(2)  '右边距

  CellWeb_print.PrintSetMargin bj_Top,bj_Left,bj_Bottom,bj_Right  '边距
  If Flag = 1 Then 
    CellWeb_print.PrintSetFoot "","共&S页 第&P页",""   '页脚
  End If     
  CellWeb_print.PrintSetScale CellWeb1.PrintGetScale              '打印比例
  CellWeb_print. PrintSetOrient CellWeb1.PrintGetOrient           '进纸方向  
  CellWeb_print.PrintPara 1,1,0,0                                 '打印参数(打印表格线，单色打印等)
  CellWeb_print.PrintPara1 0,iCurSheet                            '不打印背景图 
  CellWeb_print.PrintSetAlign CellWeb1.PrintGetHAlign(iCurSheet),CellWeb1.PrintGetVAlign (iCurSheet) '水平，垂直对齐方式 

  Cell_Printsheet CellWeb_print 
'  iCurSheet = CellWeb_print.GetCurSheet 
'  iCtPage = "1-"&CellWeb_print.PrintGetPages(iCurSheet)
'  CellWeb_print.PrintSetPrintRange 3,iCtPage  '打印第1页
'  CellWeb_print.PrintPreviewEx 2,iCurSheet,False '打印当前页，模板中已经设置好打印参数，不需客户自己设置
End Sub

'-------------------------------------------------------------------
'打印当前Sheet
'参数说明：MaxLine(数值):打印每页的最大明细行(模板中调试好不应超过默认打印的最大行)
'         Flag(True,False):是否需要补足行至满页
'-------------------------------------------------------------------
Public Sub Cell_Printsheet(CellWeb)   
  Dim iCurSheet 
  iCurSheet = CellWeb.GetCurSheet 
  CellWeb.PrintSetPrintRange 1,0 '打印当前页
  CellWeb.PrintSheet 1,iCurSheet  
End Sub
'-------------------------------------------------------------------
'控制CELL表的显示属性,形参LabelVisible=0 隐藏行、列标 LabelSheet=0隐藏页签，=1则显示
'-------------------------------------------------------------------
Public Sub Cell_Ctrl(CellWeb,LabelVisible,LabelSheet)
	Dim iSheet 
	With CellWeb  
	  For iSheet = 0 To  .GetTotalSheets() - 1 ' 显示行标列标表格线
  	  .ShowSideLabel LabelVisible, iSheet'设置是否显示行标
   	  .ShowTopLabel LabelVisible, iSheet'设置是否显示列标
   	  .ShowSheetLabel LabelSheet, iSheet'设置是否显示页签
		  '.ShowGridLine LabelVisible, iSheet'设置是否显示表格线
		  .ShowGridLine 0, iSheet
	  Next  
	  .CalcManaually =False'是否手工计算公式单元格中的公式
	  .AllowDbClickSideLabel = False'是否允许用鼠标双击列标来改变行高
	  .AllowDbClickTopLabel = False'是否允许用鼠标双击行标来改变列宽
	  .AllowCut = False'是否允许Cut操作
	  .AllowCopy = False'是否允许Copy操作
	  .AllowPaste = False'是否允许Paste操作
	  .AllowDragdrop = False'是否能通过鼠标对选中的单元格区域进行拖放
	  .AllowExtend = False '不允许用鼠标拖动选中单元格的右下角进行扩展操作
	  .ShowPageBreak 0 '去除分页钱(蓝色线条)
	  .ExtendPaste=2  '不允许扩展区域粘贴
	  .EnableUndo(true)'是否禁止Undo操作
	  .Mergecell = true
	  .border = 0	'边框的值
	  .CurCellMoveDir=4'按下 ENTER 键后，当前单元格的移动方向
	  .ProtectFormula=false	'可在公式单元格中录入数据,需要设置AllowInputFormula事件先
	  .HideFormulaErrorInfo =false '如果公式错误,,则显示error,如果为true,则不显示
    .RdOnlyCellColor = (RGB(255,255,255)) '设置读色为白色
    .WndBkColor      = (RGB(201,201,201)) '设CELL背景色为深灰色
'	  .SetCurSheet 0  '装入第1页
	  .MoveToCell 2,2
	End With   
	PubScale = 1.00 '初始化显示比例为正常显示
End Sub

'-------------------------------------------------------------------
'申报初始化方法	
'path:要打开cell的路径
'fileName要打开的文件(不含.cll)
'server_versiondate:cell模板版本日期号
'sheetStr:cell页签设置
'initData:cell初始化数据
'-------------------------------------------------------------------
function init(webcellpath,nsrsbh,sssqq,sssqz,bddm,server_version,initData,cellName)
	Dim judgeflag,CellFile,FileName,Rtn,strTemp 
	Dim folderspec '本地保存路径
  Dim strPath
	If (Cell_Login()=false)then'查看是否已经注册CELL
		PubErrMsg = "报表插件未注册，请与技术人员联系:Cell_Login()"
		init=false
		Exit function
	End If
  If (nsrsbh="" and sssqq="" and sssqz="") Then '下载页面直接从服务器取模板
  	Rtn = 0
  Else 
	  FileName = bddm + "_" + nsrsbh+"_"+sssqq+"_"+sssqz+"_pre"
    strTemp =  FileName + ".cll"
    Rtn = JudgeWsbwj(nsrsbh,bddm,strTemp,server_version) '找本地文件 
  End If  
  If Rtn = 1 Then '判断本地有保存的文件
    strPath = Pub_SBPath + "\" + CStr(bddm)
    CellFile = strPath + "\" + fileName + ".cll" '取到本地文件路径及名
  Else 
		If(webcellpath="") Then
			CellFile = bddm + ".cll"
		Else
			CellFile =webcellpath+"/templet/"+cellName
		End If
  End If   
	PubErrMsg = ""	
	If (Cell_OpenFile(CellWeb1,CellFile) = False) Then '打开CELL
		PubErrMsg = "打开报表文件： " +CellFile +  "　出错," + +Chr(13) + PubErrMsg
		init=false
		Exit Function
  End If 		
	PubErrMsg = ""
	If (Cell_GetA1(CellWeb1) = false) Then '初始化A1区变量
		PubErrMsg = "获取A1区变量时出错: " + PubErrMsg
		init=false
		Exit function
	End If
	Cell_GetVar()  '初始化CELL变量
	
	PubErrMsg = ""
	If Cell_GetCopyRowVar(CellWeb1) = False Then '取CELL表中明细需要复制行的起始、终止点行坐标
		PubErrMsg = "获取A1区变量时出错: " + PubErrMsg
		init=false
		Exit function
	End If

  If Rtn <> 1 Then '判断本地有保存的文件，不需要加载初始化数据
	  If Len(initData) > 0 Then 
    	If (Cell_DispXml(initData,true) = false) Then '初始化CELL数据
	  		PubErrMsg = "初始化数据出错！"
		  	init = false
			  Exit function
		  End If
    	CellWeb1.SetCurSheet 0 '装入首页
	  End If  	
	End If   

	init=true

End function


'-------------------------------------------------------------------
'申报初始化方法	
'path:要打开cell的路径
'fileName要打开的文件(不含.cll)
'server_versiondate:cell模板版本日期号
'sheetStr:cell页签设置
'initData:cell初始化数据
'calflag : 是否全表计算  true false
'-------------------------------------------------------------------
function Cell_OpenByXML(webcellpath,cellname,initData,calflag)
	Dim CellFile 
	If (Cell_Login()=false)then'查看是否已经注册CELL
		PubErrMsg = "报表插件未注册，请与技术人员联系:Cell_Login()"
		Cell_OpenByXML=false
		Exit function
	End If
	If(webcellpath="") Then
		CellFile = cellname + ".cll"
	Else
		CellFile =webcellpath+"/templet/"+cellname+".cll"
	End If
	PubErrMsg = ""	
	If (Cell_OpenFile(CellWeb1,CellFile) = False) Then '打开CELL
		PubErrMsg = "打开报表文件： " +CellFile +  "　出错," + +Chr(13) + PubErrMsg
		Cell_OpenByXML=false
		Exit Function
  End If 		

	PubErrMsg = ""
	If (Cell_GetA1(CellWeb1) = false) Then '初始化A1区变量
		PubErrMsg = "获取A1区变量时出错: " + PubErrMsg
		Cell_OpenByXML=false
		Exit function
	End If
	Cell_GetVar()  '初始化CELL变量
	
	PubErrMsg = ""
	If Cell_GetCopyRowVar(CellWeb1) = False Then '取CELL表中明细需要复制行的起始、终止点行坐标
		PubErrMsg = "获取A1区变量时出错: " + PubErrMsg
		Cell_OpenByXML=false
		Exit function
	End If
	
	If calflag = False    Then 
		With CellWeb1
			totalsheetNum = .GetTotalSheets
			For iLoop1 = 0 to totalsheetNum - 1
     		curCellSheet = iLoop1
     		.SetCurSheet curCellSheet
		    MaxCol =  .GetCols(curCellSheet) - 1 '最大列号
		    MaxRow =  .GetRows(curCellSheet) - 1 '最大行号
		    For iLoop2 = 1 to MaxCol    '逐列
		      For iLoop3 = 1 to MaxRow    '逐行
		        curCol = iLoop2
		        curRow = iLoop3
		      	 .SelectRange curCol,curRow,curCol,curRow
		        if .GetCellInput(curCol,curRow,curCellSheet) = 5 Then   '置读区设成非只读的才能清除公式
		            .SetCellInput curCol,curRow,curCellSheet,1   
		        End If 
		        .ClearArea curCol,curRow,curCol,curRow,curCellSheet,2
		      Next 
		    Next 
  		Next	    
	  End With 
	End If 

  If Rtn <> 1 Then '判断本地有保存的文件，不需要加载初始化数据
	  If Len(initData) > 0 Then 
    	If (Cell_DispXml(initData,calflag) = false) Then '初始化CELL数据
	  		PubErrMsg = "初始化数据出错！"
		  	Cell_OpenByXML = false
			  Exit function
		  End If
    	CellWeb1.SetCurSheet 0 '装入首页
	  End If  	
	End If   

	Cell_OpenByXML=true

End Function

'-------------------------------------------------------------------
' 判断目录下是否有上次操作时未申报的文件
' server_versiondate代表改服务器CELL模板的版本号日期，如果更新了模板，则不加载保存的模板
'sbfs: client or web
' rtn = 0 :代表没有本地保存,1:本地有保存，2：本地保存的版本与服务器的不同
'-------------------------------------------------------------------
Function JudgeWsbwj(nsrsbh,bddm,CellFile,server_version)
  Dim savecell_versiondate
  Dim Rtn,strPath
  Rtn = 0
'  folderspec = CellFile
  strPath = Pub_SBPath + "\" + CStr(bddm)
  Rtn = nbtaxsearchReport(strPath,CellFile)  '判断本地是否存有当前文件 1为Y
'msg_ok(strPath + "--" + CellFile)  
  If Rtn = 0 Then '没有本地文件
  	JudgeWsbwj = Rtn
  	Exit Function
  End If 
  savecell_version = nbtaxcellVersion(Pub_SBPath,nsrsbh,bddm) '本地保存的zsxm CELL表文件的版本
'msg_ok(savecell_versiondate)  
  If savecell_version = "" Then '没有保存
  	Rtn = 0
    JudgeWsbwj = Rtn
  	Exit Function 
  End If  
'msg_ok(server_versiondate)  
	If CStr(server_version) <> CStr(savecell_version) Then '服务器CELL模板没有变动，且本地保存有相应文件
    msg_ok("报表模板已升级，请重新填写报表！")  
    Rtn = 2
  Else 
    Rtn = 1    
  End If 
  JudgeWsbwj = Rtn

End Function


'-------------------------------------------------------------------
'打开已经申报成功的报表，在申报历史报表查询中使用
'-------------------------------------------------------------------
Public Function Cell_OpenHis(CellWeb,FileName)
  '重新初始化固定大小数组的元素，并释放动态数组的存储空间
  Erase PubTableArray
  Erase PubCellVarArray
  
  If (Cell_Login()=false)then'查看是否已经注册CELL
		PubErrMsg = "报表插件未注册，请与技术人员联系:Cell_Login()"
		Cell_OpenHis=false
		Exit function
	End If

  Cell_OpenHis = True
	PubErrMsg = ""	
	If (Cell_OpenFile(CellWeb,FileName) = False) Then '打开CELL
		PubErrMsg = "打开报表文件： " +FileName +  "　出错," + +Chr(13) + PubErrMsg
		Cell_OpenHis = false
		Exit Function
  End If 		
'  Cell_ProtectSheet CellWeb1,1 '加页保护   
	PubErrMsg = ""
	If (Cell_GetA1(CellWeb) = false) Then '初始化A1区变量
		PubErrMsg = "获取A1区变量时出错: " + PubErrMsg
		Cell_OpenHis = false
		Exit function
	End If
	Cell_GetVar()  '初始化CELL变量
	
	PubErrMsg = ""
	If Cell_GetCopyRowVar(CellWeb) = False Then '取CELL表中明细需要复制行的起始、终止点行坐标
		PubErrMsg = "获取A1区变量时出错: " + PubErrMsg
		Cell_OpenHis = false
		Exit function
	End If
	CellWeb.style.display=""	'显示CELL
	Cell_Ctrl CellWeb,0,1 '控制CELL表的显示属性
	CellWeb.WorkbookReadonly=false 
End Function 
'-------------------------------------------------------------------
'历史报表（申报成功的报表），打开后加页保护，不允许修改
'Flag : 1加锁，0解锁
'-------------------------------------------------------------------
Public Sub Cell_ProtectSheet(CellWeb,Flag)
  Dim iLoop1
  iLoop1 = 0
  For iLoop1 = 0 to CellWeb.GetTotalSheets - 1
    If Flag = 1 Then 
      CellWeb.ProtectSheet iLoop1,strTemp
    Else   
      CellWeb.UnProtectSheet iLoop1,strTemp
    End If   
  Next
End Sub

'-------------------------------------------------------------------
'从A1区读出内容,A1区内容中^分隔
'-------------------------------------------------------------------
Public Function Cell_GetA1(CellWeb) 
	Dim strA1,strLeft,strA2
	Dim intPos,iLoop1,sepPos,iLoop2,iLoop3,iLoop4
	Dim strTemp1,strTemp2,strTemp3

	PubStrA1 = ""
	PubTableCount = 0

	strA1 = ""
	intPos = 0
	iLoop1 = 0
	
	CellWeb.SetCurSheet(0)
	strA1 = CellWeb.GetCellString(1,1,0) '读A1区内容
	If Len(strA1) = 0 Then 
		PubErrMsg = "A1区没有定义内容！"
		Cell_GetA1 = False
		Exit Function
	End If 
	PubStrA1 = strA1  
	'对A1区内容进行循环处理,每个table信息置入PubTableArray,table数量置入PubTableCount
	Do While Len(strA1) > 0
		iLoop1 = iLoop1 + 1 
		PubTableCount  = iLoop1 
		intPos = 0
		intPos = Instr(strA1 , "^") 
		If(intPos>0) then 
			strLeft = Left(strA1,intPos - 1)			'获取一个table定义
    	strA1 = Right(strA1,len(strA1) - intPos )	'删除刚刚读取出来的那个table定义
		else 
	    	strLeft = strA1
	    	strA1 = ""
		End if
		redim Preserve PubTableArray(PubTableArrayCount,iLoop1)
		sepPos=Instr(strLeft , ":")'找到:所在的位置,strLeft 如如AA0:HEAD
		PubTableArray(0,iLoop1-1) = Right(strLeft,len(strLeft)-sepPos)	'表名称
		PubTableArray(1,iLoop1-1) = Left(strLeft,sepPos-2)				'表名称代码  
		PubTableArray(2,iLoop1-1) = Mid(strLeft,sepPos-1,1)				'属性
		'MsgBox(PubTableArray(0,iLoop1-1)+"__"+PubTableArray(1,iLoop1-1)+"__"+PubTableArray(2,iLoop1-1))
		if( PubTableArray(2,iLoop1 - 1)<>0)then	'如果是明细行(1或者2)
	    	PubTableArray(7,iLoop1 - 1) =-1	'明细表的当前行
		end if
	Loop
	
	strA1 = CellWeb.GetCellString(1,2,0) '读A2区内容,不需要生成上传xml文件的TABLE记载在A2区，读入PubTableArray(16，indexTable）
	Do While Len(strA1) > 0
		intPos = 0
		intPos = Instr(strA1 , "^") 
		If(intPos>0) then 
			strLeft = Left(strA1,intPos - 1)			'获取一个table定义
	    	strA1 = Right(strA1,len(strA1) - intPos )	'删除刚刚读取出来的那个table定义
		else 
	    	strLeft = strA1
	    	strA1 = ""
		End if
		sepPos=Instr(strLeft , ":")'找到:所在的位置,strLeft 如如AA0:HEAD
		strTemp1 = Right(strLeft,len(strLeft)-sepPos)	'表名称
		strTemp2 = Left(strLeft,sepPos-2)				'表名称代码  
		For iLoop2 = 1 to PubTableCount 
	  	If (PubTableArray(1,iLoop2 - 1)=strTemp2) Then
	      PubTableArray(16,iLoop2 - 1) = strTemp2
	      Exit For
		  End If 
		Next   
	Loop
'	For iLoop1 = 0 to PubTableCount - 1
'    msg_ok(CStr(iLoop1)&":"&PubTableArray(0,iLoop1)&","&PubTableArray(1,iLoop1)&","&PubTableArray(16,iLoop1))      
'	Next 

	strA1 = CellWeb.GetCellString(1,3,0) '读A3区内容,不需要生成校验xml文件的TABLE记载在A3区，读入PubTableArray(17，indexTable）
	Do While Len(strA1) > 0
		intPos = 0
		intPos = Instr(strA1 , "^") 
		If(intPos>0) then 
			strLeft = Left(strA1,intPos - 1)			'获取一个table定义
	    	strA1 = Right(strA1,len(strA1) - intPos )	'删除刚刚读取出来的那个table定义
		else 
	    	strLeft = strA1
	    	strA1 = ""
		End if
		sepPos=Instr(strLeft , ":")'找到:所在的位置,strLeft 如如AA0:HEAD
		strTemp1 = Right(strLeft,len(strLeft)-sepPos)	'表名称
		strTemp2 = Left(strLeft,sepPos-2)				'表名称代码  
		For iLoop2 = 1 to PubTableCount 
	  	If (PubTableArray(1,iLoop2 - 1)=strTemp2) Then
	      PubTableArray(17,iLoop2 - 1) = strTemp2
	      Exit For
		  End If 
		Next   
	Loop
	
	Cell_GetA1 = True
End Function

'-------------------------------------------------------------------
'取CELL表中对应table的变量名,并置入PubCellVarArray
'-------------------------------------------------------------------
Public Sub Cell_GetVar() 
	Dim iLoop1,iLoop2
	Dim strVar,VarType
	Dim iCount,iMaxVarC
	iMaxVarC = 0
	for iLoop1 = 0 to PubTableCount - 1 '第一层循环，按表数循环
		iCount = 0
	  For iLoop2 = 0 to CellWeb1.GetVarCount() - 1	'第二循环，按变量总数循环
			if CellWeb1.EnumVar(iLoop2,strVar,VarType)  then	'读取变量的变量名和变量类型
				If(Len(strVar)>9) Then
    			if (Left(strVar,Instr(strVar , "_")-8)) = (PubTableArray(1,iLoop1)) then	'判断所读变量是否本表变量
	    			iCount = iCount + 1		'本表变量总数
	     			PubTableArray(3,iLoop1) = iCount '保存本表变量总数
	     			if iCount > iMaxVarC then 
	    				iMaxVarC = iCount 
	     				redim Preserve PubCellVarArray(PubTableCount,iMaxVarC) 
	    			end if
	     			PubCellVarArray(iLoop1,iCount-1) = strVar '保存本表变量
	   			end If
	   		End If
	  	end if
	  Next
	next
End Sub

'-------------------------------------------------------------------
'取CELL表中明细需要复制行的起始、终止点行坐标  变量保存在数组PubTableArray中
'在复制行的时候，需要带TABLEINDEX参数，告知复制哪个表
'-------------------------------------------------------------------
Public Function Cell_GetCopyRowVar(CellWeb) 
	Dim iLoop1,iLoop2
	Dim curCol,curRow,curSheet
	Dim strVar
	Dim VarType 

  Cell_GetCopyRowVar = False
	for iLoop1 = 0 to CellWeb1.GetVarCount() - 1	'第一循环，按变量总数循环
		If CellWeb.EnumVar(iLoop1,strVar,VarType)  then '如果读取变量不出错
	    	If (UCase(Left(strVar,1)) = "$") Then	'如果变量名以X或Y开头
	      		For iLoop2 = 0 to PubTableCount - 1		 '第二层循环，按表数循环
	        		If Mid(strVar,3,Len(strVar)-3) = PubTableArray(1,iLoop2) Then	'如果table名相同
	          			If (CellWeb1.GetCellVar(strVar,curCol,curRow,curSheet)) = True Then	'从变量名称获得对应的单元格
	            			PubTableArray(6,iLoop2) = curSheet	'PubTableArray(6 记录sheet
	            			If (UCase(Left(strVar,2)) = "$X") Then'判断所读变量是否起始变量
	              				PubTableArray(4,iLoop2) = curRow	'PubTableArray(4 记录row
	              				if(PubTableArray(7,iLoop2)=-1) then
	                				PubTableArray(7,iLoop2) = curRow	'明细表的当前行
	              				end if
	            			End If
	            			If (UCase(Left(strVar,2)) = "$Y") Then'判断所读变量是否终止变量
	              				PubTableArray(5,iLoop2) = curRow	'PubTableArray(5 记录row
	            			End If
										If (UCase(Left(strVar,2)) = "$A") Then
	            				PubTableArray(8,iLoop2) = curCol
											PubTableArray(9,iLoop2) = curRow
	            			End If
										If (UCase(Left(strVar,2)) = "$B") Then
	              			PubTableArray(10,iLoop2) = curCol
											PubTableArray(11,iLoop2) = curRow
	            			End If 
										If (UCase(Left(strVar,2)) = "$C") Then
	             				PubTableArray(12,iLoop2) = curCol
											PubTableArray(13,iLoop2) = curRow
	            			End If 
	    	    			Else
	            			PubErrMsg = "读复制行变量坐标错误: Cell_GetCopyRowVar()"
	            			Exit Function
	    	    			End If
	        		End If 	  
	      		Next
	    	End If  
		Else
	    	PubErrMsg =  "取复制行位置，读Cell表变量名错误:Cell_GetCopyRowVar()"
	    	Exit Function
		End If
	Next  
  Cell_GetCopyRowVar = True	 
End Function



'-------------------------------------------------------------------
'把XML初始化入CELL
'ServerXml:要初始化的xml
'calflag:是否计算
'-------------------------------------------------------------------
Public Function Cell_DispXml(initXml,calflag)
	Dim oXml
	Dim sTableName,sNodeName,sNodeText,strCellVarName
	Dim iCountData,iTableIndex,iRow,iCountField
	Dim iLoop1,iLoop2,iLoop3,iLoop4

	Dim strTemp
	Dim temCol,temRol,temSheet

	iCountData = 0
	iCountField = 0

	Cell_DispXml = False

	On Error Resume Next
	Set oXml = CreateObject("Microsoft.XMLDOM")
	oXml.async = false
	oXml.LoadXML initXml	'载入xml
	sNodeName = oXml.documentElement.TagName
	If UCase(sNodeName) <>"ROOT" Then	'判断xml根节点对不对
		  PubErrMsg =  "Cell_DispXml()-XML文件根节点错误:" + sNodeName 
	  	Exit Function
	End If 	

	iCountData = oXml.documentElement.selectNodes("RecID").Length	'xml中的所有RecID节点的个数
time1 = Now()
	For iLoop1 = 0 to iCountData - 1	'第一层循环,RecID循环
'If iLoop1 > 50 Then
'	Cell_DispXml = True
'	Exit Function
'End If 	
	  sTableName = oXml.documentElement.childNodes(iLoop1).GetAttribute("TableName")	'RecID节点的TableName
	  iRow = CInt((oXml.documentElement.childNodes(iLoop1).GetAttribute("Row")))		'RecID节点的Row,明细表的row从1开始,非明细行的都是0
	  iTableIndex = -1
	  For iLoop2 = 0  to PubTableCount - 1 '第二层循环,table循环
	    If (sTableName) = PubTableArray(0,iLoop2) Then	'找到该RecID中的TableName对应的在PubTableArray的索引号
	      iTableIndex = iLoop2
	    	Exit For
	   	End If 	
		Next

		If(iTableIndex <> -1) Then	'RecID中的TableName存在于PubTableArray中
	  		iCountField = oXml.documentElement.childNodes(iLoop1).childNodes.length	'每一个RecID的子节点个数

	  		For iLoop3 = 0 to iCountField - 1
	    		sNodeName = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop3).TagName	'子节点的标签名,如nsrsbh,sssqq
	    		If sNodeName= "CZMXL" or sNodeName = "SBXML" or sNodeName = "CELLXML" Then 
		    		sNodeText = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop3).Xml		'子节点的值  csj
		    		sNodeText = Mid(sNodeText,len(sNodeName)+3,len(sNodeText)-len(sNodeName)*2-5)
		    	Else
		    		sNodeText = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop3).Text   '子节点的值 原
		    	End If 
	    		strCellVarName = "" '这一步是找该节点对应的在cell中的变量名
	    		For iLoop4 = 0  to PubTableArray(3,iTableIndex) - 1  'PubTableArray(3 是该table的变量总数
	      			strTemp = PubCellVarArray(iTableIndex,iLoop4)		'循环取该table的变量名
	      			If sNodeName = Right(strTemp,Len(strTemp)-InStr(strTemp,"_")) Then '找对应的CELL中变量
	      				strCellVarName = strTemp
	        			Exit For
	      			End If	
	    		Next
				If(Len(strCellVarName) > 0 and sNodeText<>"") Then	'如果变量名存在且xml中对应该节点的值不为空,则把该值设置进去
	      	If(Cell_SetCellData(strCellVarName,sNodeText,iTableIndex,iRow,"N") <> 0) Then
					  PubErrMsg =  "Cell_DispXml()-初始化数据时出错" 
	      		'Exit Function    出错继续执行，以免影响后续有效的单元格数据。csj
	     	 	End If 	  	
	   		End If
			Next 
		End If	
    'If (iLoop1 mod 10 = 0) Then
    '	time1 = Now()
    '	msg_ok("数量："&CStr(iLoop1)&Chr(13)&"time1:"&CStr(time1)&Chr(13)&"time2:"&CStr(time2))
    '	time2 = Now()		
    'End If 
    'If iLoop1 = 30 Then 
    '	Cell_DispXml = True
    '	Exit Function
    'End If 
	
	Next  

	if calflag then
		CellWeb1.CalculateAll  '重新计算公式
	end if

'	CellWeb1.SetCurSheet 0 '装入首页
	Cell_DispXml = True
	
	If Err.Number <> 0 Then
	  	PubErrMsg =  "Cell_DispXml()-初始化数据时出错"
	  	Err.Clear    '清除错误
	  	Exit Function      
	End If  
'If iLoop1 mod 500 =0 Then 	
  time2 = Now()
'  msg_ok("数量："&CStr(iLoop1)&"-"&CStr(time1)&","&CStr(time2))
'End If 

End Function

'-------------------------------------------------------------------
'根据inistSetData设置cell初始化单元格
'-------------------------------------------------------------------
Public Function initSetByXml(bddm,initSetXML)
  Dim oXml
	Dim iCountData,iCount,iCountCell
	Dim iLoop1,iLoop2,iLoop3
	Dim sRootName,sNodeName1,sNodeName2,sstrVarName,srow,sgongshi,sdata,sinput,scolr,svalue,valueTemp
	Dim flag
	
	iCountData = 0
	iCountField = 0
	
	initSetByXml = False
	On Error Resume Next
	Set oXml = CreateObject("Microsoft.XMLDOM")
	oXml.async = false
	'oXml.LoadXML initXml	'载入xml
	oXml.Load initSetXML	'载入xml
	
	If oXml.parseError.errorCode <> 0 Then
		MsgBox "XML文件格式不对，原因是：" & Chr(13) & xmlDoc.parseError.reason
		Exit Function
	End If

	sRootName = oXml.documentElement.TagName

	If UCase(sRootName) <>"ROOT" Then	'判断xml根节点对不对
		  PubErrMsg =  "initSetByXml()-XML文件根节点错误:" + sNodeName 
	  	Exit Function
	End If 
	
	iCount = oXml.documentElement.selectNodes("glgx").Length	'xml中的所有glgx节点的个数
	For iLoop1 = 0 to iCount - 1		
	 iCountData = oXml.documentElement.childNodes(iLoop1).childNodes.length	   
	 flag = False
	 For iLoop2 = 0 To iCountData - 1
	    sNodeName1 = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).TagName
	 		If sNodeName1 = "if" Then 
	 			iCountCell = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes.length	 
	 			For iLoop3 = 0 to iCountData - 1
				    sNodeName2 = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes(iLoop3).TagName
				    sstrVarName = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes(iLoop3).GetAttribute("strVarName")
				    srow = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes(iLoop3).GetAttribute("row")
				    svalue = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes(iLoop3).GetAttribute("value")
						valueTemp = Cell_CtrlDataR(CellWeb1,sstrVarName,srow)
						If sNodeName2 = "cellDouble" Then 							
							If CDbl(valueTemp) = CDbl(svalue) Then 
								flag = True
							End If 
						End If 
						If sNodeName2 = "cellString" Then 							
							If valueTemp = svalue Then 
								flag = True
							End If 
						End If 
				Next 
	 		End If 	 
		Next 
		
		If flag = True Then			
			For iLoop2 = 0 To iCountData - 1
		    sNodeName1 = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).TagName
		 		If sNodeName1 = "then" Then 
		 			iCountCell = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes.length			 			
		 			For iLoop3 = 0 To iCountData - 1
		 					sNodeName2 = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes(iLoop3).TagName
					    sstrVarName = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes(iLoop3).GetAttribute("strVarName")
					    srow = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes(iLoop3).GetAttribute("row")
					    sgongshi = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes(iLoop3).GetAttribute("gongshi")
					    sdata = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes(iLoop3).GetAttribute("data")
					    sinput = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes(iLoop3).GetAttribute("input")
					    scolr = oXml.documentElement.childNodes(iLoop1).childNodes(iLoop2).childNodes(iLoop3).GetAttribute("colr")
					    If sNodeName2 = "setinput" Then  
					    	setInput sstrVarName,srow,sgongshi,CDbl(sdata),sinput,scolr					    
					    End If 	
					    If sNodeName2 = "setinputS" Then  
					    	setinputS sstrVarName,srow,sgongshi,sdata,sinput,scolr					    
					    End If 				    
					Next 
		 		End If 	 
			Next
		End If 
	Next
End Function

'-------------------------------------------------------------------
'根据变量名向CELL写数据,
'strCellVarName：变量名；
'strCellVarValue：值；
'iTableIndex：table表中的索引号,为-1时只需要按变量显示，不需要按表索引做其它判断；
'iRow：复制行号,非明细的为0
'flagCal：赋值完成后是否需要进行计算,Y,N
'返回值=1,失败，0：成功
'-------------------------------------------------------------------
Public Function Cell_SetCellData(strCellVarName,strCellVarValue,iTableIndex,iRow,flagCal)
	Dim iLoop1,iLoop2
	Dim curCol,curRow,curSheet
	Dim strCellValue,strCellType
	Dim flagReadonly
  Dim bzmx '是否明细表标志
	strCellValue = strCellVarValue

	if((CellWeb1.GetCellVar(strCellVarName,curCol,curRow,curSheet)) <> True) Then '读变量对应的坐标,'如果找不到该变量,就不会赋值,直接退出
	 	Cell_SetCellData = 0
	 	Exit Function
	End If

	'检查curRow,如果是明细行,curRow会递增,该if结束时,获取到绝对的curRow
	If (iTableIndex <> -1) Then	'iTableIndex是table表中的索引号,-1时只需要按变量显示，不需要按表索引做其它判断
	 	If PubTableArray(2,iTableIndex) = 1 Then 'PubTableArray(2 是属性,如果是明细table(1 row从1开始,从第一行开始填充
	 	  curRow = PubTableArray(7,iTableIndex) + iRow-1	'获取该明细行的绝对row,即明细表的当前行+iRow,iRow是从1开始的
	 	  If curRow >= PubTableArray(5,iTableIndex) Then	'如果操作行大于明细表的终止行,则需要需要复制行
	 	  	curRow = PubTableArray(5,iTableIndex)
  	    If CellWeb_AddRows(CellWeb1,PubTableArray(5,iTableIndex),1,PubTableArray(5,iTableIndex),0,curSheet) = True Then   '插入表行
	    	  PubTableArray(5,iTableIndex) = PubTableArray(5,iTableIndex) + 1
	    	  For iLoop2 = 0 to PubTableCount - 1
            If iTableIndex<>iLoop2 And PubTableArray(6,iTableIndex)=PubTableArray(6,iLoop2) And PubTableArray(4,iTableIndex)<PubTableArray(4,iLoop2) Then 
              PubTableArray(4,iLoop2) = PubTableArray(4,iLoop2) + 1
              PubTableArray(5,iLoop2) = PubTableArray(5,iLoop2) + 1
            End If 
	        Next 
	    	End If 
	    End If	
		ElseIf (PubTableArray(2,iTableIndex) = 2) or (PubTableArray(2,iTableIndex) = 3) Then
      bzmx = True 
			curRow = PubTableArray(4,iTableIndex) + iRow	'iRow是从1开始的,要求iRow必须是顺序不间断的
	   	If curRow >= PubTableArray(5,iTableIndex) Then	'如果操作行大于明细表的终止行,则需要需要复制行
	    	curRow = PubTableArray(5,iTableIndex)
  		  If CellWeb_AddRows(CellWeb1,PubTableArray(5,iTableIndex),1,PubTableArray(5,iTableIndex),0,curSheet) = True Then   '插入表行
	  		  PubTableArray(5,iTableIndex) = PubTableArray(5,iTableIndex) + 1
	  		  For iLoop2 = 0 to PubTableCount - 1
            If iTableIndex<>iLoop2 And PubTableArray(6,iTableIndex)=PubTableArray(6,iLoop2) And PubTableArray(4,iTableIndex)<PubTableArray(4,iLoop2) Then 
              PubTableArray(4,iLoop2) = PubTableArray(4,iLoop2) + 1
              PubTableArray(5,iLoop2) = PubTableArray(5,iLoop2) + 1
            End If 
	        Next 
	  	  End If 
	    End If	
		End If 
	End If

	flagReadonly = false	'检查单元格有无锁定
	If CellWeb1.GetCellInput(curCol,curRow,curSheet)= 5 then  'ENABLED=FALSE的解除
		flagReadonly = true
	  CellWeb1.SetCellInput curCol,curRow,curSheet,1  'enabled=true
	End If
 
'  If (bzmx = True) Then
'   	CellWeb1.MoveToCell 1,PubTableArray(5,iTableIndex)
'  End If 

	strCellType=Mid(strCellVarName,InStr(strCellVarName,"_")-6,1)

	If ((strCellType="D") and (bzmx = False)) Then	'主表日期数据转换成显示格式
    strCellValue = getDate2(strCellValue)
  End If 
  
  If (CellWeb1.GetCellType(curCol,curRow,curSheet) = 3) then  '下拉框,取代码
	  For iLoop1 = 0 to PubCellListCount - 1
	    If (strCellVarName) = PubCellListVarArray(0,iLoop1) Then
	   		For iLoop2 = 0 to PubCellListVarArray(4,iLoop1) - 1
	    		If strCellValue	= PubCellListDataArray(iLoop1,0,iLoop2) Then
	    			strCellValue = PubCellListDataArray(iLoop1,1,iLoop2)
	     		End if	
	    	Next  
	    End If	
		Next
	End If

	If (strCellType="N") Then		'数值
		If  flagReadonly = false  Or  (CellWeb1.GetCellString(curcol,currow,cursheet)<>"*" And CellWeb1.GetCellString(curcol,currow,cursheet)<>"-") Then 
			If(flagCal="N") Then
		  	CellWeb1.D curCol,curRow,curSheet,strCellValue	'D方法非常快速,但是执行完后要重新计算一遍
			Else 
				CellWeb1.SetCellDouble curCol,curRow,curSheet,strCellValue 
			End If
		End If 
'	ElseIf ((strCellType="D") and (bzmx = False)) Then	'日期 
'    CellWeb1.SetCurSheet curSheet
' 		CellWeb1.SetCellDateTime curCol,curRow,curSheet,strCellValue             
	Else
		If(flagCal="N") Then
	 		CellWeb1.S curCol,curRow,curSheet,strCellValue
		Else
			CellWeb1.SetCellString curCol,curRow,curSheet,strCellValue
		End If
	End If

	If (flagReadonly = true) Then	'如果原来锁定,则还将其锁定
	  	CellWeb1.SetCellInput curCol,curRow,curSheet,5
	End If
  
	'CellWeb1.SaveEdit	'如果Cell组件在编辑状态，让其内容保存并退出编辑状态
	PubChangeFlag=1		'设置全局变量,即设置cell已经发生变化
	Cell_SetCellData = 0
End Function

'-------------------------------------------------------------------
'将日期数据转换成显示格式的字符串，以便用S填写。因为SetCellDateTime慢
'-------------------------------------------------------------------
Function getDate2(date1)
	Dim tem
	If (Len(date1)=7) Then 
  		tem=mid(date1,1,4)+"年"+mid(date1,6,2)+"月"
	ElseIf (Len(date1)=10) Then 
      	tem=mid(date1,1,4)+"年"+mid(date1,6,2)+"月"+mid(date1,9,2)+"日"
    ElseIf (Len(date1)=6) Then 
  		tem=mid(date1,1,4)+"年"+mid(date1,5,2)+"月"
	ElseIf (Len(date1)=8) Then 
      	tem=mid(date1,1,4)+"年"+mid(date1,5,2)+"月"+mid(date1,7,2)+"日"
    Else 
       	tem = date1	
	End If 
	getDate2=tem
	
End Function 

'-------------------------------------------------------------------
'关闭页面时触发该事件
'-------------------------------------------------------------------
Function cell_leave(nsrsbh,sssqq,sssqz,server_version,bddm)
 	If (CellWeb1.IsModified = 1) Then  'cll修改了就可以在切换页签时保存
    If ( Trim(bddm)<>"" and Trim(nsrsbh)<>"" and Trim(sssqq)<>"" and Trim(sssqz) <> "" and Trim(server_version)<>"") Then 
      If cell_save(CellWeb1,nsrsbh,sssqq,sssqz,server_version,bddm,2) = False Then
  	    Msg_Warning(PubErrMsg)
      End If  	
    End If 
  End If     
  CellWeb1.CloseFile()
'  CellWeb1.ResetContent
  
End Function

'-------------------------------------------------------------------
'保存CELL
'Flag : 3: 先校验报表再保存 2：自动临时保存文件；1：申报成功文件,0:点击保存按钮，并出现保存成功提示
'-------------------------------------------------------------------
Function cell_save(CellWeb,nsrsbh,sssqq,sssqz,server_versiondate,bddm,Flag)
	Dim cellName,strPath,xfscellArray
	
	if Flag = 3 then 
    If checkCellData()=1  Then 
        cell_save = False
  	    Exit Function
  	end if 
	End If 
	
	cell_save = True
	strPath = Pub_SBPath & "\" & CStr(bddm) 
	nbtaxcell_path(strPath) '建本地保存路径
  If Flag = 1 Then 
		cellName = bddm + "_" + nsrsbh+"_"+sssqq+"_"+sssqz+"_OK"
  Else 
    cellName = bddm + "_" + nsrsbh+"_"+sssqq+"_"+sssqz+"_pre"
  End If     

  cellName = strPath + "\" + cellName+".cll"
  'cellName=getFolder(zsxmdm)+"\"+cellName+".cll"  
  If Cell_FileSave(CellWeb,cellName) = True Then 
    nbtaxsavecellVersion Pub_SBPath,nsrsbh,bddm,server_versiondate '保存本地文件的版本
    If Flag = 0 or Flag = 3 Then  '点击页面保存按钮时出现成功提示框
      Msg_ok("　报表保存成功　")
      'top.newAlert "提示","　报表保存成功","OK",top.Ext.emptyFn
    End If   
  Else
    cell_save = False
    If Flag = 0 or Flag = 3 Then  '点击页面保存按钮时出现成功提示框
      Msg_Warning("　报表保存失败　")
      'top.newAlert "提示","　报表保存失败","OK",top.Ext.emptyFn
    End If   
    Exit Function
  End If  
End Function

'-------------------------------------------------------------------
'获取保存cell的根路径
'-------------------------------------------------------------------
Function getRoot()
	Dim fs, fRoot,fSb,path   
	On Error Resume Next 
	Set fs = CreateObject("Scripting.FileSystemObject")    
	Set fRoot=fs.GetSpecialFolder(0) 
	getRoot=fRoot.path+"\"+Pub_sb_cell_savepath
	if Err.Number<>0 then
		getRoot=""
		msgbox(Pub_ErrLocalMsg)
	end if
	Set fs = Nothing
End Function

'-------------------------------------------------------------------
'获取保存cell的全路径,filename为相对路径
'-------------------------------------------------------------------
Function getFolder(filename)
    Dim fs, fRoot,fSb,path   
    On Error Resume Next 
    Set fs = CreateObject("Scripting.FileSystemObject")    
    Set fRoot=fs.GetSpecialFolder(0)
	if(fs.FolderExists(fRoot.path+"\"+Pub_sb_cell_savepath)=false) then       
		fs.CreateFolder(fRoot.path+"\"+Pub_sb_cell_savepath)       
    end if  
    if(fs.FolderExists(fRoot.path+"\\"+Pub_sb_cell_savepath+"\\"+filename)=false) then
		set fSb=fs.CreateFolder(fRoot.path+"\\"+Pub_sb_cell_savepath+"\\"+filename)
		'msgbox(fSb.path)
		path=fSb.path
    else
		path=fRoot.path+"\\"+Pub_sb_cell_savepath+"\\"+filename   
    end if      
    getFolder=path
    if Err.Number<>0 then
		getFolder=""
		msgbox(Pub_ErrLocalMsg)
    end if
    Set fs = Nothing
End Function

'-------------------------------------------------------------------
'保存，形参为文件名，如果为空则弹出保存文件框
'-------------------------------------------------------------------
Public Function Cell_FileSave(CellWeb,CellFileName) 
  Dim iRt
  Cell_FileSave = True
  If CellFileName = "" Then
    iRt = CellWeb.SaveFile()
  Else 	
    CellWeb.SetFilePassword Pub_FilePassword 
    iRt = CellWeb.SaveAsFile(CellFileName,0)
  End If  
  sTemp = "无法保存报表文件,错误代码：" + CStr(iRt)
  PubErrMsg = sTemp 	
  
'  Select Case iRt
'   Case  0 :   PubErrMsg = sTemp + "，文件保存失败!"
'   Case -1 :   PubErrMsg = sTemp + "，文件名后不合法(不是.CLL)!"
'   Case -2 :   PubErrMsg = sTemp + "，文件名不合法(长度大于40或小于0)!"
'    Case Else  PubErrMsg = sTemp + "，未知错误!"    
'  End Select
  If iRt <> 1 Then
    Cell_FileSave = False
  End If  
End Function
'-------------------------------------------------------------------
'保存当前Sheet
'-------------------------------------------------------------------
Public Function Cell_SheetSave(CellWeb) 
  Dim iRt
  Cell_SheetSave = 1
  iRt = CellWeb.SaveSheet(CellWeb.GetCurSheet())
  sTemp = "无法保存当前报表文件,错误代码：" + CStr(iRt)
  PubErrMsg = sTemp 	
  If iRt <> 1 Then
    Cell_SheetSave = False
  End If  
End Function
'-------------------------------------------------------------------
'输出Excel文件
'-------------------------------------------------------------------
Public Sub Cell_FileExportExcel()
  CellWeb1.ExportExcelDlg
End Sub

'-------------------------------------------------------------------
'鼠标右键时，会触发该事件
'-------------------------------------------------------------------
Public Sub CellWeb_jsp_MenuStart( ByVal col, ByVal row, ByVal section)
	CellWeb1_MenuStart col, row, section
End Sub

Public Sub CellWeb_jsp_MenuCommand(ByVal col, ByVal row, ByVal itemid)
	CellWeb1_MenuCommand col, row, itemid
End Sub


'-------------------------------------------------------------------
'      表格中的右键菜单
'-------------------------------------------------------------------
'设置右键菜单
Public Sub CellWeb1_MenuStart( ByVal col, ByVal row, ByVal section)
  With CellWeb1
    If (section = 1) or (section = 2) Then '鼠标在表格区内 or 鼠标在行标上
    	
'      .AddPopMenu 1001, "重置报表", 0
      .AddPopMenu 1013, "保存Excel文件", 0
'      .AddPopMenu 1017, "保存Cll文件", 0
'      .AddPopMenu 1018, "页签显示", 0
'      .AddPopMenu 1012, "查找", 0
      .AddPopMenu 1019, "报表底色", 0
'      .AddPopMenu 2000, "", 0'调整报表显示
      .AddPopMenu 2001, "放大", 0
      .AddPopMenu 2002, "正常", 0
      .AddPopMenu 2003, "缩小", 0
    End If  
  End With
End Sub
'-------------------------------------------------------------------
'右键菜单命令
'-------------------------------------------------------------------
Public Sub CellWeb1_MenuCommand(ByVal col, ByVal row, ByVal itemid)
  Dim CurSheet ,bSheetVisible
'  CurSheet = CellWeb1.GetCurSheet()
'  bSheetVisible = Not(CellWeb1.IsSheetVisible(CurSheet))
  With CellWeb1
    Select Case itemid
'      Case 1001 Cell_ClearEdit(CellWeb1)		'将当前页面可写区置空
'      Case 1012 Cell_Find(CellWeb1)  '查找当前页表格中内容
      Case 1013 Cell_FileExportExcel()		'保存Excel文件
'      Case 1017 Cell_FileSave CellWeb1,""  '保存报表,弹出文件选择框
'      Case 1018 SheetCtrl("")  '显示页签
      
      Case 1019 CtrlCellBColor()  '显示可写区底色
      Case 2001 CtrlDisp CellWeb1,1  '放大显示比例 5%
      Case 2002 CtrlDisp CellWeb1,0  '正常显示
      Case 2003 CtrlDisp CellWeb1,2  '缩小显示比例 5%

    End Select
  End With
End Sub  
'-------------------------------------------------------------------
'查找当前页表格中内容
'SearchText_p:查找内容；SearchDir_p:0-向上找,1-向下找
'-------------------------------------------------------------------
Public Sub Cell_Find(CellWeb,SearchText_p,SearchDir_p)
	Dim sText ,sDir 
	Dim Rtn
  sText = SearchText_p
  sDir  = SearchDir_p
	If sText = "" Then
	 	Exit Sub
	End If 

  With CellWeb
 		.SetSelectMode .GetCurSheet(),1
		Rtn = .Find (sText,sDir,0,0,0)

		If Rtn <> 1 Then
			Msg_Warning("找不到："&CStr(sText))
'      .MoveToCell 2,2
    End If 
  End With 
End Sub  
'-------------------------------------------------------------------
'将当前页面可写区置空
'-------------------------------------------------------------------
Public Sub Cell_ClearEdit(CellWeb)
  Dim iLoop1,iLoop2,iLoop3 
  Dim curCol,curRow,curCellSheet 
  Dim iTemp,MaxCol,MaxRow  
  With CellWeb
    curCellSheet = .GetCurSheet()
    MaxCol =  .GetCols(curCellSheet) - 1 '最大列号
    MaxRow =  .GetRows(curCellSheet) - 1 '最大行号
    For iLoop2 = 1 to MaxCol    '逐列
      For iLoop3 = 1 to MaxRow    '逐行
        curCol = iLoop2
        curRow = iLoop3
      	 .SelectRange curCol,curRow,curCol,curRow
        if .GetCellInput(curCol,curRow,curCellSheet) <> 5 Then   '非置读区
           .ClearArea curCol,curRow,curCol,curRow,curCellSheet,1
        End If 
      Next 
    Next 
    .CalculateSheet curCellSheet '本页需要重新计算公式，因为公式区有的是可编辑区，不被清除
  End With 
End Sub 
'-------------------------------------------------------------------
'调整显示比例，按5%进行调整,Flag:0－100%，1－＋5%，2－-5%
'-------------------------------------------------------------------
Public Sub CtrlDisp(CellWeb,Flag)
  Dim CurSheet,CurScale,bz 
  bz = Trim(CStr(Flag))
  With CellWeb
    CurSheet = .GetCurSheet()
'    CurScale = PubScale '公用变量
    Select Case bz
      Case "1" CurScale = PubScale + 0.05 
      Case "2" CurScale = PubScale - 0.05 
      Case Else  CurScale = 1.00
    End Select
    .SetScreenScale CurSheet,CurScale
    PubScale = CurScale 
  End With 
End Sub
'-------------------------------------------------------------------
'页签显示、隐藏
'-------------------------------------------------------------------
Public Sub SheetCtrl(bVisible)
  Dim iLoop1,bSheetVisible
  If bVisible = "" Then  
  	bSheetVisible = Abs(CellWeb1.GetSheetLabelState(iLoop1)-1)
  Else 
    bSheetVisible = bVisible
  End If  	
  For iLoop1 = 0 to CellWeb1.GetTotalSheets() - 1
    CellWeb1.ShowSheetLabel bSheetVisible , iLoop1
  Next
End Sub

'-------------------------------------------------------------------
'可写区单元格底色显示
'-------------------------------------------------------------------
Public Sub CtrlCellBColor()
  Dim iLoop1,iLoop2
  Dim iColor1,iColor2
  Dim CurSheet
  CurSheet = CellWeb1.GetCurSheet()
  iColor1 = CellWeb1.FindColorIndex (RGB(221,248,255),1)
  iColor2 = CellWeb1.FindColorIndex (RGB(255,252,221),1)
  For iLoop1 = 1 to CellWeb1.GetCols(CurSheet) - 1
    For iLoop2 = 1 to CellWeb1.GetRows(CurSheet) - 1
      If CellWeb1.GetCellInput(iLoop1,iLoop2,CurSheet) <> 5 Then '置读
        If CellWeb1.GetCellBackColor(iLoop1,iLoop2,CurSheet) = iColor1 Then 
          CellWeb1.SetCellBackColor iLoop1,iLoop2,CurSheet,iColor2  '设置指定单元格的背景颜色
        Else 
          CellWeb1.SetCellBackColor iLoop1,iLoop2,CurSheet,iColor1  '设置指定单元格的背景颜色
        End If   
      End If 
    Next 
  Next 

End Sub

'-------------------------------------------------------------------
'设置单元格公式、数值等
'-------------------------------------------------------------------
Sub setInput(strVarName,iCurRow,gongshi,shuzhi,inputflag,colrfalg)
    If colrfalg<>-1 Then 
        Cell_SetBkColor CellWeb1,strVarName,colrfalg,iCurRow     '设置背景色
    End If 
    If shuzhi<>-1 Then 
        Cell_CtrlDataW CellWeb1,strVarName,iCurRow,shuzhi    '设置数值
    End If 
	If gongshi<>"-1" Then 
	    Cell_SetWR CellWeb1,strVarName,iCurRow,0
	    Cell_SetFormula CellWeb1,strVarName,gongshi,iCurRow 
	End If 
    If inputflag<>-1 Then   
        Cell_SetWR CellWeb1,strVarName,iCurRow,inputflag    '设置单元格是否只读
    End If 
End Sub

'-------------------------------------------------------------------
'设置单元格公式、值等
'-------------------------------------------------------------------
Sub setInputS(strVarName,iCurRow,gongshi,zifu,inputflag,colrfalg)
    If colrfalg<>-1 Then 
        Cell_SetBkColor CellWeb1,strVarName,colrfalg,iCurRow     '设置背景色
    End If 
    If zifu<>"-1" Then 
        Cell_CtrlDataW CellWeb1,strVarName,iCurRow,zifu    '设置数值
    End If 
	If gongshi<>"-1" Then 
	    Cell_SetWR CellWeb1,strVarName,iCurRow,0
	    Cell_SetFormula CellWeb1,strVarName,gongshi,iCurRow 
	End If 
    If inputflag<>-1 Then   
        Cell_SetWR CellWeb1,strVarName,iCurRow,inputflag    '设置单元格是否只读
    End If 
End Sub

'-------------------------------------------------------------------
'弹出缴款书信息,所有报表缴款书Table名统一为"00:JNSK"
'-------------------------------------------------------------------
Function ShowJNSK(dateTemp)
    Dim strTemp
    JNSK_szdm=Cell_GetCellData("00V0010Y_ZSXMDM",0)  
    If JNSK_szdm="01" Then 
        JNSK_sz="增值税"
    ElseIf JNSK_szdm="03" Then 
        JNSK_sz="消费税"
    ElseIf JNSK_szdm="04" Then 
        JNSK_sz="所得税"
    ElseIf JNSK_szdm="77" Then 
        JNSK_sz="废旧电器电子产品处理"
	ElseIf JNSK_szdm="65" Then 
        JNSK_sz="文化事业建设费"
    End If 
    'dateTemp=year(date())&"-"&fix(month(date())/10)&(month(date())-fix(month(date())/10)*10)&"-"&fix(day(date())/10)&(day(date())-fix(day(date())/10)*10)
    Cell_SetCellData "00D0000Y_JKRQ",dateTemp,-1,0,"N"     
    'CellWeb1.SetCellDouble 2,12,1,dateTemp
    JNSK_BDDM=Cell_GetCellData("00V0020Y_BDDM",0)
    JNSK_SSRQS=Cell_GetCellData("00D0000Y_SSRQS",0)   
    JNSK_SSRQZ=Cell_GetCellData("00D0000Y_SSRQZ",0)   
    JNSK_YHZLDM=Cell_GetCellData("00V0010Y_YHZLDM",0)  
    JNSK_YHDM=Cell_GetCellData("00V0015Y_YHDM",0)    
    JNSK_YHMC=Cell_GetCellData("00V0080Y_YHMC",0)
    JNSK_YHZH=Cell_GetCellData("00V0030Y_YHZH",0)    
    JNSK_YZE=Cell_GetCellData("00N1302Y_YZE",0)     
    JNSK_SZE=Cell_GetCellData("00N1302Y_SZE",0)     
    JNSK_YZE_JZJT=Cell_GetCellData("00N1302Y_YZE_JZJT",0)
    JNSK_SZE_JZJT=Cell_GetCellData("00N1302Y_SZE_JZJT",0)
    JNSK_JKRQ=Cell_GetCellData("00D0000Y_JKRQ",0)
    
    'If(CDbl(JNSK_SZE)<0) Then 
    '   JNSK_SZE="0.00"
    'End If 
    'If(CDbl(JNSK_SZE_JZJT)<0) Then 
    '    JNSK_SZE_JZJT="0.00"
    'End If  

    strTemp=""
    If JNSK_BDDM="SB00100" Then 
    	    JNSK_YZE = CDbl(JNSK_YZE) + CDbl(JNSK_YZE_JZJT)
    	    JNSK_SZE = CDbl(JNSK_SZE) + CDbl(JNSK_SZE_JZJT)
		    QMLD_BYS=Cell_CtrlDataR(CellWeb1,"Z1N1302N_NSSBB_YBBYS",19)
			QMLD_BNLJ=Cell_CtrlDataR(CellWeb1,"Z1N1302N_NSSBB_YBBNLJ",19)
    	    If(CDbl(JNSK_SZE)<0) Then 
				JNSK_SZE="0.00"
	        End If  
        strTemp=strTemp&"征收项目名称"&"#:"&JNSK_sz&"@:"&"缴款日期"&"#:"&JNSK_JKRQ&"@:"
        strTemp=strTemp&"所属时期起"&"#:"&JNSK_SSRQS&"@:"&"所属日期止"&"#:"&JNSK_SSRQZ&"@:"
        strTemp=strTemp&"扣款银行名称"&"#:"&JNSK_YHMC&"@:"&""&"#:"&""&"@:"
        strTemp=strTemp&"扣款银行账号"&"#:"&JNSK_YHZH&"@:"&""&"#:"&""&"@:"
		strTemp=strTemp&"期末留抵本月数"&"#:"&QMLD_BYS&"@:"&"期末留抵本年累计"&"#:"&QMLD_BNLJ&"@:"
        strTemp=strTemp&"<readOnly><id>JNSK_YZE</id>本次应征额"&"#:"&JNSK_YZE&"@:"&"<JEfun/><id>JNSK_SZE</id>本次实际缴款额"&"#:"&JNSK_SZE
        'strTemp=strTemp&"一般货物及劳务  应征额"&"#:"&JNSK_YZE&"@:"&"<id>JNSK_SZE</id>本次实际缴款额"&"#:"&JNSK_SZE&"@:"
        'strTemp=strTemp&"即征即退  应征额"&"#:"&JNSK_YZE_JZJT&"@:"&"<id>JNSK_SZE_JZJT</id>本次实际缴款额"&"#:"&JNSK_SZE_JZJT
	ElseIf JNSK_BDDM="FJDQ100" Then 
		strTemp=strTemp&"征收项目名称"&"#:"&JNSK_sz&"@:"&"缴款日期"&"#:"&JNSK_JKRQ&"@:"
        strTemp=strTemp&"所属时期起"&"#:"&JNSK_SSRQS&"@:"&"所属日期止"&"#:"&JNSK_SSRQZ&"@:"
        strTemp=strTemp&"扣款银行名称"&"#:"&JNSK_YHMC&"@:"&""&"#:"&""&"@:"
        strTemp=strTemp&"扣款银行账号"&"#:"&JNSK_YHZH&"@:"&""&"#:"&""&"@:"
        strTemp=strTemp&"<readOnly><id>JNSK_YZE</id>本期应补基金额"&"#:"&JNSK_YZE&"@:"&"<JEfun/><id>JNSK_SZE</id>本期结转下期基金额"&"#:"&JNSK_SZE
	ElseIf JNSK_BDDM="WHSY100" Then 
		strTemp=strTemp&"征收项目名称"&"#:"&JNSK_sz&"@:"&"缴款日期"&"#:"&JNSK_JKRQ&"@:"
        strTemp=strTemp&"所属时期起"&"#:"&JNSK_SSRQS&"@:"&"所属日期止"&"#:"&JNSK_SSRQZ&"@:"
        strTemp=strTemp&"扣款银行名称"&"#:"&JNSK_YHMC&"@:"&""&"#:"&""&"@:"
        strTemp=strTemp&"扣款银行账号"&"#:"&JNSK_YHZH&"@:"&""&"#:"&""&"@:"
        strTemp=strTemp&"<readOnly><id>JNSK_YZE</id>本期应补退费额"&"#:"&JNSK_YZE&"@:"&"<JEfun/><id>JNSK_SZE</id>本期实际补退费额"&"#:"&JNSK_SZE
    Else 
	    If(CDbl(JNSK_SZE)<0) Then 
			JNSK_SZE="0.00"
	    End If 
        strTemp=strTemp&"征收项目名称"&"#:"&JNSK_sz&"@:"&"缴款日期"&"#:"&JNSK_JKRQ&"@:"
        strTemp=strTemp&"所属时期起"&"#:"&JNSK_SSRQS&"@:"&"所属日期止"&"#:"&JNSK_SSRQZ&"@:"
        strTemp=strTemp&"扣款银行名称"&"#:"&JNSK_YHMC&"@:"&""&"#:"&""&"@:"
        strTemp=strTemp&"扣款银行账号"&"#:"&JNSK_YHZH&"@:"&""&"#:"&""&"@:"
        strTemp=strTemp&"<readOnly><id>JNSK_YZE</id>本次应征额"&"#:"&JNSK_YZE&"@:"&"<JEfun/><id>JNSK_SZE</id>本次实际缴款额"&"#:"&JNSK_SZE
    End If 
    ShowJNSK=strTemp
End Function

'-------------------------------------------------------------------
'计算字符串真实长度
'-------------------------------------------------------------------
Function StrLen(str)
  lenstr=0
  l = len(str)
  for i = 1 to l step 1
    c = mid(str,i,1)
    s = asc(c)
    if s<0 or s>255 then
      lenstr=lenstr+2
    Else
      lenstr=lenstr+1
    end if
  next
  strlen=lenstr
End Function 

'-------------------------------------------------------------------
'设置某个明细表的行高
'-------------------------------------------------------------------
Function SetRowHeight(tablename,height)

  Dim col,sheet,XG3,YG3,xrow,yrow
  XG3 = "$X"&tablename
  YG3 = "$Y"&tablename
	If (CellWeb1.GetCellVar(XG3,col,xrow,sheet)=true and CellWeb1.GetCellVar(YG3,col,yrow,sheet)=true)then
   		For  i=(xrow+1) To  (yrow-1)
   			'MsgBox i&"="&height&"="&sheet
    		CellWeb1.SetRowHeight 1,height,i,sheet '设置行高
		  Next   
	End  If   
	
End Function 

'-------------------------------------------------------------------
'设置行高度 csj
'blTemp 与原高度的比例
'-------------------------------------------------------------------
Function SetDX(blTemp)
	Dim iLoop1,iLoop2,iLoop3,numT
  For iLoop3 = 0 to CellWeb1.GetTotalSheets - 1
	  CellWeb1.SetCurSheet(iLoop3)
    For iLoop2 = 5 to CellWeb1.GetRows(iLoop3) - 4
    	numT = 0
    	For iLoop1 = 5 to CellWeb1.GetCols(CurSheet) - 4
	      If CellWeb1.GetCellInput(iLoop1, iLoop2, iLoop3) <>5 Then 
	      	numT = 1
	      	Exit For 
	      End If 
	    Next
	    If  numT = 1 Then 
	    	height = CellWeb1.GetRowHeight(1,iLoop2,iLoop3)
	      height = height*blTemp
	      CellWeb1.SetRowHeight 1,height,iLoop2,iLoop3 '设置行高
	    End If 
	  Next 
	Next 
End Function 

'---------------------------------------------------------------------------
' 需要根据 A0V0200N_SWJGZ 的行列，计算出图章的坐标值，再移动
'---------------------------------------------------------------------------
Sub MoveSwjgZ()
  Dim  curCol, curRow, curSheet
  Dim cllx,clly 
  Dim iSumRowH, iSUMColW
  Dim iTemp1,ImageSwjgz
  If (CellWeb1.GetCellVar("A0V0200N_SWJGZ",curCol,curRow,curSheet)) = True Then 
  	For iTemp1=0 To curRow
		iSumRowH = iSumRowH + CellWeb1.GetRowHeight(1,iTemp1,curSheet)
	Next 
	For iTemp1=0 To curCol
		iSUMColW = iSUMColW + CellWeb1.GetColWidth(1,iTemp1,curSheet)
    Next 
    cllx = iSUMColW - 125
  	clly = iSumRowH - 118
  	For  iTemp1=0 To 2
		ImageSwjgz = CellWeb1.GetNextFloatImage(curSheet)
		If ImageSwjgz = "" Then
			Exit For 
		End If
		If ImageSwjgz = "pic 14" Then 
			CellWeb1.MoveFloatImage curSheet,ImageSwjgz,cllx,clly,-1,-1 '移动位置
		End If 
		CellWeb1.SetFloatImageAttribute curSheet,ImageSwjgz,1,true '显示
		CellWeb1.SetFloatImageAttribute curSheet,ImageSwjgz,2,true '/打印
		CellWeb1.SetFloatImageAttribute curSheet,ImageSwjgz,4,false '//是否能改变图片大小位置
	Next 
  End If 
  
End Sub 


'-------------------------------------------------------------------
'将部分公式清空
'-------------------------------------------------------------------
Public Function A6_DispXml()
	
		On Error Resume Next
		
		A6_DispXml = False 
		
		A6_REPCODE = Cell_GetCellData("A0V0040Y_REPCODE",0)
		If A6_REPCODE="SB00112" Then 
			For i=0 To 12
				Cell_SetFormula CellWeb1,"B1N1302N_FB1_ZZSZY_XSE","",i 
				Cell_SetFormula CellWeb1,"B1N1302N_FB1_ZZSZY_XXSE","",i 
				Cell_SetFormula CellWeb1,"B1N1302N_FB1_QT_XSE","",i 
				Cell_SetFormula CellWeb1,"B1N1302N_FB1_QT_XXSE","",i 
				Cell_SetFormula CellWeb1,"B1N1302N_FB1_WK_XSE","",i 
				Cell_SetFormula CellWeb1,"B1N1302N_FB1_WK_XXSE","",i 
				Cell_SetFormula CellWeb1,"B1N1302N_FB1_TZ_XSE","",i 
				Cell_SetFormula CellWeb1,"B1N1302N_FB1_TZ_XXSE","",i 
			Next 
			
			Cell_SetFormula CellWeb1,"B1N1302N_FB1_BQSJKCJE","",7 
			Cell_SetFormula CellWeb1,"B1N1302N_FB1_BQSJKCJE","",18 
			
			Cell_SetFormula CellWeb1,"Z1N1302N_NSSBB_YBBYS","",22 
			Cell_SetFormula CellWeb1,"Z1N1302N_NSSBB_YBBYS","",27 
			Cell_SetFormula CellWeb1,"Z1N1302N_NSSBB_JZJTBYS","",22 
			
			Cell_SetFormula CellWeb1,"C1N1300N_FB2_SBDKJXSE_FS","",5 
			Cell_SetFormula CellWeb1,"C1N1302N_FB2_SBDKJXSE_JE","",5 
			Cell_SetFormula CellWeb1,"C1N1302N_FB2_SBDKJXSE_SE","",5 
			
			Cell_SetFormula CellWeb1,"21N1300N_FB2_DDKJXSE_FS","",3 
			Cell_SetFormula CellWeb1,"21N1302N_FB2_DDKJXSE_JE","",3 
			Cell_SetFormula CellWeb1,"21N1302N_FB2_DDKJXSE_SE","",3 
		End If 
		If Err.Number <> 0 Then
		  	'PubErrMsg =  "A6_DispXml()-时出错"
		  	Err.Clear    '清除错误
		  	Exit Function      
		End If 

	A6_DispXml = True
End Function

Public Function openbd()
	openbd = bddm
End Function