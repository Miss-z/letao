//关闭进度环
NProgress.configure({
    showSpinner: false
})
$(document).ajaxStart(function(){
    //开始进度条
    NProgress.start();

});

$(document).ajaxStop(function(){
    
    //结束进度条
    setTimeout(function(){
        NProgress.done();
    },500);
   
});


//发送一个ajax请求，询问用户是否登录了，如果登陆了，就继续，如果没登录，需要跳转到登录页
if(location.href.indexOf("login.html")==-1){
    $.ajax({
       type:"get",
       url:"/employee/checkRootLogin",
       success:function (data){
           if(data.error ===400){
                //说明用户没有登录，跳转到登录页
                location.href = "login.html";
           }
       }
    })
}


// 进度条模块结束 
//二级菜单显示和隐藏效果
$(".child").prev().on("click",function(){
    $(this).next().slideToggle();
});

//侧边栏显示与隐藏效果
$(".icon_menu").on("click",function(){
    $(".lt_aside").toggleClass("now");
    $(".lt_main").toggleClass("now");
});

// 退出功能
$(".icon_logout").on("click",function(){
    $("#logoutModal").modal("show");

    //jquery注册事件不会覆盖
    //.off解绑所有事件

    //注册退出 发送ajax请求  回到登录页
    $(".btn_logout").off().on("click",function(){
        //发送ajax请求 告诉服务器退出
        $.ajax({
            type:"get",
            url:"/employee/employeeLogout",
            success:function(data){
                if(data.success){
                //退出成功，才跳转到登录页面
                location.href = "login.html";
              }
            }
        });
      
    });
});

