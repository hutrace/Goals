;(function(doc) {
    /** @type {GoalsPrompt} */
    var prompt = {};
    /** @type {HTMLDivElement} */
    var loading = null;
    
    
    function alert(msg, callback) {
        var backgrd = doc.createElement('div');
        var content = doc.createElement('div');
        var msgelem = doc.createElement('div');
        var buttons = doc.createElement('div');
        var surebtn = doc.createElement('div');
        backgrd.className = 'mobile-prompt-alert';
        content.className = 'alert-content';
        msgelem.className = 'alert-msg';
        buttons.className = 'alert-button';
        surebtn.className = 'alert-sure-button';

        msgelem.innerText = msg;
        surebtn.innerText = '确定';
        
        buttons.appendChild(surebtn);
        content.appendChild(msgelem);
        content.appendChild(buttons);
        backgrd.appendChild(content);
        doc.body.appendChild(backgrd);
        setTimeout(function() {
            backgrd.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            content.style.opacity = '1';
        }, 30);
        surebtn.addEventListener('click', function() {
            backgrd.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            content.style.opacity = '0';
            setTimeout(function() {
                doc.body.removeChild(backgrd);
                callback && callback();
            }, 200);
        });
        return backgrd;
    }

    prompt.info = alert;
    prompt.warn = alert;
    prompt.error = alert;
    prompt.success = alert;

    prompt.toast = function(type, msg, callback) {
        let toast_content = doc.createElement("div");
        toast_content.classList.add("mobile-prompt-toast-content");
        doc.body.appendChild(toast_content);
        toast_content.innerHTML = "<div>" + msg + "</div>";
        setTimeout(function() {
            doc.body.removeChild(toast_content);
            callback && callback();
        }, 2500);
    }

    prompt.showLoading = function(msg) {
        if(loading == null) {
            loading = doc.createElement('div');
            var content = doc.createElement('div');
            var iconelem = doc.createElement('div');
            var msgelem = doc.createElement('div');
            loading.className = 'mobile-prompt-loading';
            content.className = 'loading-content';
            iconelem.className = 'loading-icon';
            msgelem.className = 'loading-msg';
            iconelem.innerHTML = '<span></span><span></span><span></span><span></span><span></span>';
            msgelem.innerText = msg;
            loading.appendChild(content);
            content.appendChild(iconelem);
            content.appendChild(msgelem);
            doc.body.appendChild(loading);
        }else {
            loading.querySelector('.loading-msg').innerText = msg;
        }
    }
    prompt.hideLoading = function() {
        if(loading != null) {
            doc.body.removeChild(loading);
            loading = null;
        }
    }
    prompt.confirm = function(msg, okFn, cancelFn, height) {}
    Goals.prompt = prompt;
}(document));