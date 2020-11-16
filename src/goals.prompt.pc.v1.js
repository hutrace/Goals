;(function(doc) {
    /** @type {GoalsPrompt} */
    var prompt = {};
    var loading = null;
    
    function create_loading() {
        var parent = doc.createElement('div');
        var content = doc.createElement('div');
        var img = doc.createElement('i');
        var text = doc.createElement('div');
        parent.className = 'v1-prompt-loading-parent';
        content.className = 'v1-prompt-loading-content';
        img.className = 'fa fa-circle-o-notch fa-spin fa-fw';
        doc.body.appendChild(parent);
        parent.appendChild(content);
        content.appendChild(img);
        content.appendChild(text);
        loading = {
            parent: parent,
            text: text
        };
    }
    prompt.showLoading = function(msg) {
        if(loading === null) {
            create_loading();
        }
        loading.parent.style.display = 'block';
        loading.text.innerText = msg;
    };
    prompt.hideLoading = function() {
        if(loading) {
            loading.parent.style.display = 'none';
        }
    };
    function create_alert(icon, style, msg, callback) {
        var parent = doc.createElement('div');
        var content = doc.createElement('div');
        var text = doc.createElement('div');
        var sure = doc.createElement('div');
        var img = doc.createElement('div');
        parent.className = 'v1-prompt-alert-parent';
        content.className = 'v1-prompt-alert-content';
        text.className = 'v1-prompt-alert-text ' + style;
        sure.className = 'v1-prompt-alert-btn goals-btn ' + style + '-btn';
        img.className = 'v1-prompt-alert-icon ' + style;
        text.innerHTML = msg;
        img.innerHTML = icon;
        sure.innerText = '确定';
        doc.body.appendChild(parent);
        parent.appendChild(content);
        content.appendChild(img);
        content.appendChild(text);
        content.appendChild(sure);
        setTimeout(function() {
            content.style.top = '200px';
        }, 16);
        sure.addEventListener('click', function() {
            content.style.top = '-160px';
            setTimeout(function() {
                doc.body.removeChild(parent);
                callback && callback();
            }, 200);
        });
    }
    prompt.info = function(msg, callback) {
        create_alert('<i class="fa fa-info-circle"></i>', 'prompt-info', msg, callback);
    }
    prompt.success = function(msg, callback) {
        create_alert('<i class="fa fa-info-circle"></i>', 'prompt-success', msg, callback);
    }
    prompt.warn = function(msg, callback) {
        create_alert('<i class="fa fa-warning"></i>', 'prompt-warn', msg, callback);
    }
    prompt.error = function(msg, callback) {
        create_alert('<i class="fa fa-warning"></i>', 'prompt-error', msg, callback);
    }
    var toast_type = {
        success: '<i class="fa fa-info-circle"></i>',
        error: '<i class="fa fa-warning"></i>',
        info: '<i class="fa fa-info-circle"></i>',
        warn: '<i class="fa fa-warning"></i>'
    };
    function create_toast(icon, style, msg, callback) {
        var parent = doc.createElement('div');
        var content = doc.createElement('div');
        var text = doc.createElement('div');
        var img = doc.createElement('div');
        parent.className = 'v1-prompt-toast-parent';
        content.className = 'v1-prompt-alert-content content-' + style;
        text.className = 'v1-prompt-toast-text ' + style;
        img.className = 'v1-prompt-toast-icon ' + style;
        text.innerHTML = msg;
        img.innerHTML = icon;
        doc.body.appendChild(parent);
        parent.appendChild(content);
        content.appendChild(img);
        content.appendChild(text);
        setTimeout(function() {
            content.style.opacity = '1';
        }, 16);
        setTimeout(function() {
            content.style.opacity = '0';
            setTimeout(function() {
                doc.body.removeChild(parent);
                callback && callback();
            }, 200);
        }, 2000);
    }
    prompt.toast = function(type, msg, callback) {
        create_toast(toast_type[type], 'prompt-' + type, msg, callback);
    }
    prompt.confirm = function(msg, okFn, cancelFn, height) {
        height = height || 160;
        var parent = doc.createElement('div');
        var content = doc.createElement('div');
        var title = doc.createElement('div');
        var text = doc.createElement('div');
        var sure = doc.createElement('div');
        var cancel = doc.createElement('div');
        var img = doc.createElement('div');
        parent.className = 'v1-prompt-confirm-parent';
        content.className = 'v1-prompt-confirm-content';
        title.className = 'v1-prompt-confirm-title';
        text.className = 'v1-prompt-confirm-text';
        sure.className = 'v1-prompt-confirm-btn goals-btn confirm-sure';
        cancel.className = 'v1-prompt-confirm-btn goals-btn confirm-cancel';
        img.className = 'v1-prompt-confirm-icon';
        title.innerHTML = '继续操作提示';
        text.innerHTML = msg;
        img.innerHTML = '<i class="fa fa-warning"></i>';
        sure.innerText = '确定';
        cancel.innerText = '取消';
        doc.body.appendChild(parent);
        parent.appendChild(content);
        content.appendChild(title);
        content.appendChild(img);
        content.appendChild(text);
        content.appendChild(sure);
        content.appendChild(cancel);
        content.style.height = height + 'px';
        setTimeout(function() {
            content.style.top = '200px';
        }, 16);
        sure.addEventListener('click', function() {
            content.style.top = -height + 'px';
            okFn && okFn();
            setTimeout(function() {
                doc.body.removeChild(parent);
            }, 200);
        });
        cancel.addEventListener('click', function() {
            content.style.top = -height + 'px';
            cancelFn && cancelFn();
            setTimeout(function() {
                doc.body.removeChild(parent);
            }, 200);
        });
    }
    Goals.prompt = prompt;
}(document));