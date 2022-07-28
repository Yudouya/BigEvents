// 在调用 get,post,ajax请求之前，都会调用这个函数
$.ajaxPrefilter(function (options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);
})