$(function () {
    // 点击去注册  跳转 注册页面
    $('#link_reg').on('click', function () {
        $('.loginbox').hide();
        $('.regbox').show();
    })
    // 点击去登录  跳转 登录页面
    $('#link_login').on('click', function () {
        $('.loginbox').show();
        $('.regbox').hide();
    })

    // 从layui中获取from对象、layer对象
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repassword: function (value) {
            // value是确认密码框的值
            // 拿到密码框的值
            var pwd = $('.regbox [name=password]').val();
            // 比较是否一致
            if (pwd !== value) return '两次输入密码不一样啊！'
        }
    })

    // 表单提交，发起ajax请求 注册用户
    $('#form_reg').on('submit', function (e) {
        e.preventDefault(); //阻止默认的提交行为

        let uname = $('.regbox [name="username"]').val();
        let pwd = $('.regbox [name="password"]').val();
        $.post('/api/reguser', {
            username: uname,
            password: pwd
        }, function (res) {
            //注册失败
            if (res.status !== 0) return layer.msg(res.message, { icon: 5 });
            //注册成功
            layer.msg('注册成功啦！', { icon: 1 });
            $('#link_login').click();
            $('#form_reg')[0].reset(); // 注册成功清空表单的值
        })
    })

    // 表单登录 功能
    $('#form_login').submit(function (e) {
        e.preventDefault();
        let data = $(this).serialize();
        $.post('/api/login', data, function (res) {
            // 登录失败！
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            // 登录成功  拿到token 存到localStorage中
            localStorage.setItem('token', res.token);
            layer.msg('登录成功！');
            location.href = '/index.html'
        })
    })



})