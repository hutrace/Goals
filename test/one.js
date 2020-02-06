GoalsPage({
    data: {
        hello: 'Hello World'
    },
    notImportDefaultCss: true,
    onready: function() {
    	var that = this;
        setTimeout(function() {
            that.data.hello = '莫西莫西';
        }, 2000);
    }
});