//验证是否为空
	jQuery.validator.addMethod("reqs", function(value, element){
        var result = false;        
            if(""==value){
                result=false;
            }else{
                result=true;
            }      
        return result;
    }, "不能为空");
// 字符验证       
 jQuery.validator.addMethod("stringCheck", function(value, element) {       
     return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);       
 }, "只能包括中文字、英文字母、数字和下划线");   
 
//姓名验证       
 jQuery.validator.addMethod("nameCheck", function(value, element) {     
     return this.optional(element) || /^[A-Za-z.\u4e00-\u9fa5]{0,}$/.test(value);       
 }, "只能包括中文字、英文字母");
   
 // 中文字两个字节       
jQuery.validator.addMethod("byteRangeLength", function(value, element, param) {       
    var length = value.length;       
    for(var i = 0; i < value.length; i++){       
        if(value.charCodeAt(i) > 127){       
        length++;       
        }       
    }       
    return this.optional(element) || ( length >= param[0] && length <= param[1] );       
}, "请确保输入的值在3-15个字符之间(一个中文字算2个字符)");   
  
// 身份证号码验证       
 jQuery.validator.addMethod("isIdCardNo", function(value, element) { 
	 //var isIdCardNo= /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
	 var isIdCardNo= /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    return this.optional(element) || isIdCardNo.test(value);       
}, "请正确输入您的身份证号码");
     
// 手机号码验证       
jQuery.validator.addMethod("isMobile", function(value, element) {       
    var length = value.length;   
    var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(18[0-9]{1}))+\d{8})$/;   
    return this.optional(element) || (length == 11 && mobile.test(value));       
}, "请正确填写您的手机号码");       
     
// 电话号码验证       
jQuery.validator.addMethod("isTel", function(value, element) {       
    var tel = /^\d{3,4}-?\d{7,9}$/;    //电话号码格式010-12345678   
    return this.optional(element) || (tel.test(value));       
}, "请正确填写您的电话号码");   
 
// 联系电话(手机/电话皆可)验证   
jQuery.validator.addMethod("isPhone", function(value,element) {   
    var length = value.length;   
    var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;   
    var tel = /^\d{3,4}-?\d{7,9}$/;   
    return this.optional(element) || (tel.test(value) || mobile.test(value));   
}, "请正确填写您的联系电话");   
     
// 邮政编码验证       
jQuery.validator.addMethod("isZipCode", function(value, element) {       
    var tel = /^[0-9]{6}$/;       
    return this.optional(element) || (tel.test(value));       
 }, "请正确填写您的邮政编码");  
//邮箱验证
jQuery.validator.addMethod("email", function(value, element) {       
    var email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;       
    return this.optional(element) || (email.test(value));       
 }, "请正确填写您的邮箱");  
 //QQ验证
jQuery.validator.addMethod("QQ", function(value, element) {       
    var QQ = /[1-9][0-9]{4,}/;       
    return this.optional(element) || (QQ.test(value));       
}, "请正确填写QQ号码"); 
//身份证号码的验证规则
function isIdCardNo(num){ 
　//　 if (isNaN(num)) {alert("输入的不是数字！"); return false;} 
　　 var len = num.length, re; 
　　 if (len == 15) 
　　 re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/); 
　　 else if (len == 18) 
　　 re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/); 
　　 else {
        //alert("输入的数字位数不对！"); 
        return false;} 
　　 var a = num.match(re); 
　　 if (a != null) 
　　 { 
　　 if (len==15) 
　　 { 
　　 var D = new Date("19"+a[3]+"/"+a[4]+"/"+a[5]); 
　　 var B = D.getYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5]; 
　　 } 
　　 else 
　　 { 
　　 var D = new Date(a[3]+"/"+a[4]+"/"+a[5]); 
　　 var B = D.getFullYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5]; 
　　 } 
　　 if (!B) {//alert("输入的身份证号 "+ a[0] +" 里出生日期不对！"); 
             return false;} 
　　 } 
　　 if(!re.test(num)){
    //alert("身份证最后一位只能是数字和字母!");
      return false;}
　　  
　　 return true; 
} 

//验证金额 小数点前10位，小数点保留后2位
jQuery.validator.addMethod("numberCheck", function(value, element) {
	var num = /^([1-9][\d]{0,10}|0)(\.[\d]{1,2})?$/;   
    return this.optional(element) || (num.test(value));
}, "请正确填写金额");