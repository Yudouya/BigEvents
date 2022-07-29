$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6)
                return '昵称必须在1-6个字符之间';
        }
    })

    initUserInfo();


    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);
                form.val('FormUserInfo', res.data)
            }
        })
    }

    // 重置按钮的功能
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            // {
            //     id: $('input[type="hidden"]').val(),
            //     nickname: $('#nickname').val(),
            //     email: $('#email').val()
            // },
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('修改信息成功！')
                // 同时更新头像和昵称 调用父类中的方法
                window.parent.getUserInfo();
            }
        })
    })
})