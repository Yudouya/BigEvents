$(function () {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samepwd: function (value) {
            if (value === $('#oldpwd').val()) {
                return '新密码不能与旧密码相同！！'
            }
        },
        repassword: function (value) {
            // value是确认密码框的值
            // 拿到密码框的值
            var pwd = $('#pwdForm [name=newpwd]').val();
            // 比较是否一致
            if (pwd !== value) return '两次输入密码不一样啊！'
        }
    })


    //
    $('#pwdForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: {
                oldPwd: $('#oldpwd').val(),
                newPwd: $('#newpwd').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改失败！')
                }
                layer.msg(res.message);
                $('#pwdForm')[0].reset();
            }
        })
    })


})