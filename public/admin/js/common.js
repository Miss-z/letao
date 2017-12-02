//关闭进度环
NProgress.configure({
  showSpinner: false
});

$(document).ajaxStart(function () {
  //开始进度条
  NProgress.start();
});

$(document).ajaxStop(function () {
  //结束进度条
  setTimeout(function () {
    NProgress.done();
  }, 500);
});

//非登陆页，发送一个ajax请求，询问是否登录，如果没有登录，跳转到登录页面
if(location.href.indexOf("login.html") == -1){
  //等于-1 说明地址中不包含login.html，这个时候需要发送ajax请求
  $.ajax({
    type:"get",
    url:"/employee/checkRootLogin",
    success:function(data) {
      if(data.error === 400){
        location.href = "login.html";
      }
    }
  });
}





//二级菜单显示与隐藏效果
$(".child").prev().on("click", function () {
  $(this).next().slideToggle();
});


//侧边栏显示与隐藏效果
$(".icon_menu").on("click", function () {
  $(".lt_aside").toggleClass("now");
  $(".lt_main").toggleClass("now");
});


//退出功能
$(".icon_logout").on("click", function () {
  $("#logoutModal").modal("show");

  //因为jquery注册事件不会覆盖。
  //off()解绑所有的事件
  //off("click")
  $(".btn_logout").off().on("click", function () {
    
    //发送ajax请求，告诉服务器，需要退出
    $.ajax({
      type:"get",
      url:"/employee/employeeLogout",
      success:function(data) {
        if(data.success){
          //退出成功，才跳转到登录页面
          location.href = "login.html";
        }
      }
    });


  });
});