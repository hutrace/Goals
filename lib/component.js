// 这里创建一个名字叫做component1的组件
GoalsComponent('component1', {
    // 这里的view支持html代码，html文件绝对路径、相对路径以及网络路径，详情见API文档
    view: '<div>Hello Goals component !!!</div>'
});
// 这里创建一个名字叫做component2的组件
GoalsComponent('component2', {
    view: '<div>${hello}</div>',
    onshow: function() {
        setTimeout(this.setData, 2000, {hello: '你好，世界！'});
    }
});
// 这里创建一个名字叫做component3的组件
GoalsComponent('component3', {
    data: {hello: 'Hello World'},
    view: '<div>${hello}</div>',
    onshow: function() {
        setTimeout(this.setData, 2000, {hello: '你好，世界！'});
    }
});