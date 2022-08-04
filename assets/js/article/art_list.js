$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义一个查询参数q, 将来请求服务器数据时，需要将请求参数提交到服务器
    var q = {
        pagenum: 1, // 当前显示的页数  默认显示第一页
        pagesize: 2,  // 每页显示几条  默认每页显示2条数据
        // cate_id,
        // state,
    }
    initTableContent();
    initCateId()

    // 定义美化时间的过滤器
    template.defaults.imports.dateFrom = function (date) {
        const dt = new Date(date);
        const y = dt.getFullYear();
        const m = ParZero(dt.getMonth() + 1);
        const d = ParZero(dt.getDate());

        const hh = ParZero(dt.getHours());
        const mm = ParZero(dt.getMinutes());
        const ss = ParZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function ParZero(n) {
        return n < 9 ? '0' + n : n
    }

    // 初始化表格 文章列表
    function initTableContent() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                let htmlStr = template('tpl-artlist', res);
                // console.log(htmlStr);
                $('tbody').html(htmlStr);
                console.log(res);
                renderPage(res.total);
            }
        })
    }

    // 初始化所有分类的数据
    function initCateId() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取分类数据失败！')
                let htmlStr1 = template('tpl-cateid', res)
                $('#cate_id').html(htmlStr1);
                form.render();
            }
        })
    }

    // 筛选按钮的功能
    $('#form_search').on('submit', function (e) {
        e.preventDefault();
        // console.log(1);
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        q.cate_id = cate_id, q.state = state; //重新更新一下请求参数q 
        initTableContent();
    })

    // 渲染分页数据的功能
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            theme: '#45caff',
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // jump触发的2种方式； 1 手动点击页码 2 触发laypage.render的时候
            jump: function (obj, first) {
                q.pagenum = obj.curr; //obj.curr是当前选中的页码值
                q.pagesize = obj.limit;
                // first为true 是方式2触发  false是方式1触发
                if (!first) {
                    initTableContent();
                }
            }
        })
    }


    //通过代理的方式给删除按钮 绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        let btnlength = $('.btn-delete').length;
        let deleteid = $(this).attr('data-id');
        layer.confirm('确认删除🤨?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + deleteid,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // 当数据删除后，应该判断这页是否还有剩余数据，如果没有了，页码值-1后在重新渲染
                    if (btnlength == 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }
                    initTableContent();

                }
            })
            layer.close(index);
        });
    })
})