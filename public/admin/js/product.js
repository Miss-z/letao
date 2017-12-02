$(function(){
    //分页渲染
    var page =1;
    var pagesize =5;
    var imgs =[];
    var render = function(){
        //发送ajax请求，获取数据
        $.ajax({
            type:"get",
            url:"/product/queryProductDetailList",
            data:{
                page:page,
                pageSize:pagesize
            },
            success:function(data){
                console.log(data);
                //渲染到页面中
                $("tbody").html(template("tpl",data));


                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:page,
                    totalPages: Math.ceil(data.total / data.size),
                    itemTexts:function (type,page,current){
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页"; 
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";    
                            default:
                                return page;  
                        }
                    }, 
                     
                    tooltipTitles:function (type,page,current){
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页"; 
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";    
                            default:
                                return "跳转到"+page;  
                        }
                    },

                    userBootstrapTooltip: true,
                    onPageClicked :function (a,b,c,p){
                        page=p,
                        render();
                    }
                });
            }

        });
    }
    render();

    //显示模态框
    $(".btn_add").on("click",function(){
        $("#productModal").modal("show");

        //发送ajax请求,查询二级分类
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            success:function(data){
                console.log(data);
                $(".dropdown-menu").html(template("tpl2",data));
            }
        });

    });

    //点击品牌的时候，需要修改按钮的内容，还需要修改隐藏域brandId的值
    $(".dropdown-menu").on("click","a",function(){
        //1.需要修改按钮的内容
        $(".dropdown-text").text($(this).text());
        //2.修改隐藏域
        $("[name='brandId']").val($(this).data("id"));

        //3. 选择了品牌，需要手动校验成功
        $form.data("bootstrapValidator").updateStatus("brandId","VALID");
    });


    //表单校验功能
    var $form = $("form");
    $form.bootstrapValidator({
        excluded:[],
        //字体图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },

          //校验规则
          fields: {
            brandId: {
                validators: {
                  notEmpty: {
                    message: "请选择品牌"
                  }
                }
              },
              proName: {
                validators: {
                  notEmpty: {
                    message: "请输入商品名称"
                  }
                }
              },
              proDesc: {
                validators: {
                  notEmpty: {
                    message: "请输入商品描述"
                  }
                }
              },
              num: {
                validators: {
                  //库存必须是0以上的数字
                  notEmpty: {
                    message: "请输入商品库存"
                  },
                  regexp: {
                    //必须1-9开头，后面可以是0个或者多个数字
                    regexp: /^[1-9]\d*$/,
                    message: "请输入一个不是0开头的库存"
                  }
                }
              },
              num: {
                validators: {
                  //库存必须是0以上的数字
                  notEmpty: {
                    message: "请输入商品库存"
                  },
                  regexp: {
                    //必须1-9开头，后面可以是0个或者多个数字
                    regexp: /^[1-9]\d*$/,
                    message: "请输入一个不是0开头的库存"
                  }
                }
              },
              size: {
                validators: {
                  //库存必须是0以上的数字
                  notEmpty:{
                    message:"请输入商品尺码"
                  },
                  regexp: {
                    //必须1-9开头，后面可以是0个或者多个数字
                    regexp:/^\d{2}-\d{2}$/,
                    message:"请输入正确的尺码，例如(32-46)"
                  }
                }
              },
              oldPrice: {
                validators: {
                  notEmpty: {
                    message: "请输入商品原价"
                  }
                }
              },
              price: {
                validators: {
                  notEmpty: {
                    message: "请输入商品价格"
                  }
                }
              },
              productLogo:{
                validators: {
                  notEmpty: {
                    message: "请上传3张图片"
                  }
                }
              },
          }
    });
    

    //图片上传
    $("#fileupload").fileupload({
        dataType:"json",
        done: function (e, data) {
    
          if(imgs.length >= 3){
            return false;
          }
    
          console.log(data.result);
          //动态的往img_box添加一张图片
          $(".img_box").append('<img src="'+data.result.picAddr+'" width="100" height="100" alt="">');
        
          //把这个返回的结果存储起来。
          imgs.push(data.result);
    
          console.log(imgs);
          
          //判断imgs的长度，如果imgs的长度等于3，说明上传了3张，把productLogo改成校验成功
          if(imgs.length === 3){
            $form.data("bootstrapValidator").updateStatus("productLogo", "VALID");
          }else {
            $form.data("bootstrapValidator").updateStatus("productLogo", "INVALID");
          }
    
        }
      });


      //给表单注册校验成功事件
  $form.on("success.form.bv", function(e) {
    e.preventDefault();
    //发送ajax请求
    var param = $form.serialize();
    param += "&picName1="+imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    param += "&picName2="+imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    param += "&picName3="+imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;

    console.log(param);
    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data: param,
      success:function (data) {
        if(data.success) {
          //1. 关闭模态框
          $("#productModal").modal("hide");
          //2. 重新渲染
          page = 1;
          render();


          //3. 重置样式
          $form.data("bootstrapValidator").resetForm();
          $form[0].reset();
          $("[type='hidden']").val('');
          $(".dropdown-text").text("请选择品牌");
          $(".img_box img").remove();
          //清空数组
          imgs = [];

        }
      }
    });

  })

});