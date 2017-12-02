$(function () {

  //需要发送ajax请求，获取用户的数据
  var currentPage = 1; //记录当前页码
  var pageSize = 5; //记录每页的数量

  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (data) {
        //3. 准备数据
        console.log(data);

        //4. 模板与数据进行绑定
        //第一个参数：模版id
        //第二个参数：对象,模版与对象绑定之后，模版可以直接使用对象中的属性。
        var html = template("tpl", data);
        $("tbody").html(html);


        //5. 渲染分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: currentPage, //显示当前页
          totalPages: Math.ceil(data.total / data.size), //计算总页数
          numberOfPages: 5,
          onPageClicked: function (a, b, c, page) {
            //修改当前页码
            currentPage = page;
            //重新渲染
            render();
          }

        });


      }
    });
  }
  //页面加载就调用一次
  render();



  //启用禁用功能（委托事件）
  $("tbody").on("click", ".btn", function () {
    //显示模态框
    $("#userModal").modal("show");

    //获取到id
    var id = $(this).parent().data("id");
    //获取isDelete
    var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    //console.log(id);
    //console.log(isDelete);



    $(".btn_confirm").off().on("click", function () {
      //发送ajax请求，禁用用户
      $.ajax({
        type:"post",
        url:"/user/updateUser",
        data:{
          id:id,
          isDelete:isDelete
        },
        success:function (data) {
          if(data.success){
            //关闭模态框
            $("#userModal").modal("hide");
            //重新渲染页面
            render();
          }
        }
      });


    });
  });

});