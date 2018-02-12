/**
 * Created by sam on 2017/5/12.
 */

$(function () {
    var $loginBox = $('.login')
    var $registerBox = $('.register')
    var $userInfo = $('.userInfo')
    var $my_right = $('.my_right')
    // var $dian_login = $('#dianji_login');
    // var $dian_login2 = $('#dianji_login2');

    // $dian_login.on('click',function(){
    //     $my_right.show();
    // });
    // $dian_login2.on('click',function(){
    //     $my_right.show();
    // });
    //无账号，切换到注册
    $('.loginToggle').find('a').on('click', function () {
        $registerBox.show()
        $loginBox.hide()
    })

    //有账号，切换到登录
    $('.registerToggle').find('a').on('click', function () {
        $loginBox.show()
        $registerBox.hide()
    })

    //注册
    $registerBox.find('button').on('click', function () {
        //通过ajax注册
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $('#userNameReg').val(),
                password: $('#inputPasswordReg').val(),
                againpassword: $('#AgainPasswordReg').val()
            },
            dataType:'json',
            success:function (result) {
                $registerBox.find('.colwarning').html(result.message)

                if (!result.code){
                    setTimeout(function () {
                        $loginBox.show();
                        $registerBox.hide();


                    },1000)
                }
            }
        })
    })

    //登录
    $loginBox.find('button').on('click', function () {
        //通过ajax来提交请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username: $('#userNameLog').val(),
                password: $('#passwordLog').val()
            },
            dataType:'json',
            success:function (result) {
                location.href = "/admin";
            }
        })
    })

    $('.logout').on('click', function () {
        $.ajax({
            url:'/api/user/logout',
            success:function (result) {
                if (!result.code){
                    window.location.reload()
                }
            }
        })
    })




})
