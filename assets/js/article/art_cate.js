$(function () {
    var layer = layui.layer;
    var form = layui.form;
    getArtCateList();


    // 获取文章分类列表
    function getArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return '获取文章分类列表失败！'
                }

                var htmlStr = template('tpl-artlist', res)
                $('.layui-table tbody').html(htmlStr).show();
            }
        })
    }


    // 点击添加类别按钮 添加文章类别, 显示弹出层
    var closeIndex = null;
    $('#add_cate').on('click', function () {
        closeIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: ['添加文章分类', 'font-size:16px;background-color:skyblue'],
            content: $('#layopen-add').html()
        });
    })


    // 表单点击后动态生产的，直接绑定不行，通过代理的方式来绑定
    // 监听表单提交事件，完成文章分类的添加的功能
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败！')
                }
                getArtCateList();
                // 成功获取文章分类列表
                layer.msg(res.message);
                layer.close(closeIndex);  // 自动关闭新增面板
            }
        })
    })


    // 通过代理的形式 给修改按钮 代理点击事件
    var editIndex = null;
    $('tbody').on('click', '#btnEdiptus', function () {
        // 弹出一个修改文章分类的弹出层
        editIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: ['修改文章分类', 'font-size:16px;background-color:orange'],
            content: $('#layopen-edit').html()
        });
        // //【自己的写法】
        // let obj = {
        //     'alias': $(this).parent().prev().html(),
        //     'name': $(this).parent().prev().prev().html()
        // }
        // form.val('form-edit', obj)
        // // 【自己的写法】
        let id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改数据失败！')
                }
                form.val('form-edit', res.data)
            }
        })
    })


    //点击确认修改 提交表单内容 修改文章类别信息
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $('#form-edit').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败！')
                }
                getArtCateList();
                layer.msg(res.message);
                layer.close(editIndex);
            }
        })
    })


    //为每个删除按钮添加事件
    $('tbody').on('click', '#btnDel', function () {
        let id = $(this).attr('data-id');
        //显示弹出层
        layer.confirm('确认删除😒?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg(res.message);
                    getArtCateList();
                }
            })
            layer.close(index);
        });
    })


})