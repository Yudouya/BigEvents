$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 初始化富文本编辑器
    initArtCate();
    initEditor()


    function initArtCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('初始化文章分类失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 一定要调用 form.render()重新渲染
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)


    $('#chooseImg').on('click', function () {
        $('#coverFile').click();
    })

    //监听文件域的change事件
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        if (files.length < 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 确定state状态的值
    var state = '已发布';
    $('#savecg').on('click', function () {
        state = '草稿'
    })

    // 基于Form构造FormData数据格式
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', state)
        // 将裁剪后的图片，输出为文件
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(function (blob) { // 将Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，追加到fd中
            fd.append('cover_img', blob);
            // 发起ajax请求发布文章
            publishArtcile(fd);
        })
    })

    // 定义发布文章的方法
    function publishArtcile(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 提交的formdata属性 一定要加两个属性
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('发表文章失败！')
                }
                layer.msg(res.message);
                location.href = '/article/art_list.html'
            }
        })
    }

})