$(function () {
    getUserInfo();

    // 点击按钮 实现退出功能
    $('#btnlogout').on('click', function () {
        layer.confirm('确认退出登录吗？', { icon: 3, title: '提示' }, function (index) {
            // 清空token值 并跳转至登录页
            localStorage.removeItem('token');
            location.href = '/login.html'
            layer.close(index);
        });
    })
})

//获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',

        success: function (res) {
            if (res.status !== 0) return layui.layer.msg(res.message)
            // 拿到接口数据  然后渲染
            // console.log(res);
            renderAvatar(res.data)
        }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    var username = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + username);
    if (user.user_pic) {
        // 用户有图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文字头像
        var firstChapter = username.toUpperCase().substr(0, 1);
        $('.text-avatar').html(firstChapter).show();
        $('.layui-nav-img').hide()
    }
}