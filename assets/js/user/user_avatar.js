$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 获取登录用户的信息 拿到头像 设置它的src属性
    // $.ajax({
    //     method: 'GET',
    //     url: '/my/userinfo',
    //     success: function (res) {
    //         if (res.status !== 0) return layui.layer.msg(res.message)
    //         // 拿到接口数据  然后渲染

    //         $('#image').attr('src', res.data.user_pic)
    //     }
    // })

    $('#UpChooseImg').on('click', function () {
        $('#file').click();
    })

    // 监听file的change事件 改变图片
    $('#file').on('change', function (e) {
        var filelist = e.target.files;

        if (filelist.length === 0) {
            return layui.layer.msg('请选择头像！')
        }

        var file = e.target.files[0]  // 拿到用户选择的文件
        var newImgURL = URL.createObjectURL(file)  // 将文件转换为路径
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    //上传按钮事件
    $('#btnUpload').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新头像失败！')
                }
                layui.layer.msg('更新头像成功！')
                window.parent.getUserInfo();
            }
        })
    })



})