$(function () {

  //分页渲染
  var page = 1;
  var pageSize = 4;
  var render = function () {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (data) {
        console.log(data);

        $("tbody").html(template("tpl", data));

        //渲染分页
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




  //点击添加按钮，显示模态框
  $(".btn_add").on("click", function () {
    $("#secondModal").modal("show");

    //需要发送ajax请求，获取到所有的一级分类，渲染到下拉菜单中
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (data) {
        console.log(data);

        $(".dropdown-menu").html(template("tpl2", data));

      }
    });

  })


  //需要给下拉框中所有的a标签注册点击事件
  $(".dropdown-menu").on("click", "a", function () {
    //获取到当前a标签的文本，设置给按钮的文本
    $(".dropdown-text").text($(this).text());

    //获取到id值，设置给categoryId
    $("[name='categoryId']").val($(this).data("id"));

    //让categoryId校验成功
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });


  //图片上传
  $("#fileupload").fileupload({
    dataType: "json", //指定响应的数据格式
    //图片上传完成后，会执行的一个函数,通过data.result可以获取到结果
    done: function (e, data) {
      //console.log(data.result.picAddr);
      $(".img_box img").attr("src", data.result.picAddr);

      //把上传的图片的地址赋值给 brandLogo
      $("[name='brandLogo']").val(data.result.picAddr);

      $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");

    }
  });




  //表单校验
  var $form = $("form");
  $form.bootstrapValidator({
    //对所有的类型都做校验
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //校验规则
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类的名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  });


  //给表单注册校验成功事件
  $form.on("success.form.bv", function (e) {
    e.preventDefault();

    //发送ajax
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $form.serialize(),
      success:function (data) {
        if(data.success) {

          //1. 关闭模态框
          $("#secondModal").modal("hide");

          //2. 重新渲染第一页
          page = 1;
          render();


          //3. 重置样式和表单的值
          $form.data("bootstrapValidator").resetForm();
          $form[0].reset();

          $(".dropdown-text").text("请选择一级分类");
          $(".img_box img").attr("src", "images/none.png");
          $("[type='hidden']").val('');


        }
      }
    });
  })


});