GoalsPage({
    /** 页面的data属性 */
    data: {
        msg: 'this is msg',
        title: 'hei',
        show: true,
        list: [{
            name: '小梅',
            age: 19,
            gender: '女'
        }, {
            name: '小红',
            age: 18,
            gender: '女'
        }]
    },
    /** 如果你需要引用当前对应的css文件，就将此改为false或者删除掉 */
    notImportDefaultCss: true,
    /** 你可以在这里放置需要引用的js/css文件路径，支持网络路径、绝对路径、相对路径 */
    script: [],
    /** 页面显示的回调 */
    onshow: function() {
        var self = this;
        
    },
    /** 页面加载完成的回调 */
    onready: function() {
        var self = this;
        setTimeout(function() {
            self.setData({
                list: [{
                    name: '张三',
                    age: 19,
                    gender: '男'
                }, {
                    name: '李四',
                    age: 25,
                    gender: '男'
                }],
                show: false
            })
        }, 2000);
    }
})