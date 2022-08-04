// 在调用 get,post,ajax请求之前，都会调用这个函数
$.ajaxPrefilter(function (options) {

    // options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    options.url = 'http://127.0.0.1:3007' + options.url;
    if (options.url.includes('/my')) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // ajax无论成功失败 都会调用complete函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清空token并跳转登录页面
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})