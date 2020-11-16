GoalsPage({
    data: {
        hello: 'Hello World'
    },
    notImportDefaultCss: true,
    onready: function() {
        setTimeout(this.setData, 5000, {hello: 'Hello World !!!'});
    }
})