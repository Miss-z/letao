$(function () {

  //1. 列表渲染
  var page = 1;
  var pageSize = 5;
  var render = function () {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (data) {
        $("tbody").html(template("tpl", data));

        //2. 分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(data.total / data.size),
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });


      }
    });
  }
  render();



  //3. 点击添加分类按钮，显示模态框
  $(".btn_add").on("click", function () {
    $("#secondModal").modal("show");

    //4. 通过ajax获取一级分类的数据，渲染到下拉框
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 1000
      },
      success: function (data) {
        $(".dropdown-menu").html(template("tpl2", data));
      }
    });

  });

  //5. 给dropdown-menu下a注册委托事件
  $(".dropdown-menu").on("click", "a", function () {

    //5.1 获取当前a的内容，设置给dropdown-text
    $(".dropdown-text").text($(this).text());

    //5.2 获取到当前a的id，设置给 categoryId
    $("[name='categoryId']").val($(this).data("id"));

    //5.3 手动让categoryId校验成功
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");

  });


  //6. 文件上传功能
  $("#fileupload").fileupload({
    dataType: "json",
    done: function (e, data) {
      //结果就是data.result
      //console.log(data.result);
      //6.1 修改img_box下的img的src属性
      $(".img_box img").attr("src", data.result.picAddr);

      //6.2 把图片的地址赋值给brandLogo
      $("[name='brandLogo']").val(data.result.picAddr);

      //6.3 手动让brandLogo校验成功
      $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });


  //7. 添加表单校验
  var $form = $("form");
  $form.bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类"
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:"请输入品牌的名称"
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传一张品牌的图片"
          }
        }
      }
    }
  });


  //9. 校验成功时，阻止表单提交，使用ajax添加数据
  $form.on("success.form.bv", function(e) {
    e.preventDefault();

    //使用ajax
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data: $form.serialize(),
      success:function (data){
        if(data.success) {

          //10, 添加成功了，需要关闭模态框，重置样式，重置内容
          $("#secondModal").modal("hide");

          page = 1;
          render();

          $form.data("bootstrapValidator").resetForm();
          $form[0].reset();
          $("[type='hidden']").val('');


          $(".dropdown-text").text("请选择一级分类");
          $(".img_box img").attr("src", "images/none.png");

        }
      }
    });
  });

});