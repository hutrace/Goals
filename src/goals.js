// @ts-nocheck
function XMLNode() {
    /** @type {XMLNode} */
    var self = this;
    self.tag = '';
    self.text = '';
    self.single = false;
    self.attr = null;
    self.children = [];
    self.cache = null;
}
XMLNode.prototype.inner = function(useCache) {
    if(this.cache != null) {
        return this.cache;
    }
    var strbuf = [this.text];
    function __inner(arr) {
        for(var i = 0, r; r = arr[i++];) {
            strbuf.push('<');
            strbuf.push(r.tag);
            if(r.attr) {
                for(var key in r.attr) {
                    strbuf.push(' ');
                    strbuf.push(key);
                    strbuf.push('="');
                    strbuf.push(r.attr[key]);
                    strbuf.push('"');
                }
            }
            strbuf.push('>');
            strbuf.push(r.text);
            if(r.children.length > 0) {
                __inner(r.children);
            }
            strbuf.push('</');
            strbuf.push(r.tag);
            strbuf.push('>');
        }
    }
    __inner(this.children);
    if(useCache) {
        this.cache = strbuf.join('');
        return this.cache;
    }
    return strbuf.join('');
}
XMLNode.prototype.outer = function() {
    var str = '<' + this.tag + '>';
    if(this.attr) {
        for(var key in this.attr) {
            str += ' ' + key + '="' + this.attr[key] + '"';
        }
    }
    str += this.text;
    return str + this.inner(false) + '</' + this.tag + '>';
}
function GoalsView(opts) {
    /** @type {GoalsPage.InstanceView} */
    var self = this;
    var elem = document.createElement('div');
    elem.className = 'goals-page';
    Goals.common.CONTAINER.appendChild(elem);
    self[0] = elem;
    self.document = elem;
    self.notImportDefaultCss = false;
    self.syncload = false;
    self.repeatload = false;
    self.data = {};
    self.view = null;
    self.script = null;
    self.onshow = null;
    self.onready = null;
    self.onunload = null;
    self.onhide = null;
    Goals.combine(opts, self);
    self.url = null;
    self.hash = null;
    self.receive = null;
    self.css = [];
    self.javascript = [];
    self.components = [];
    if(!self.componentLibs) {
        self.componentLibs = [];
    }
};
/**
 * @param {GoalsPage.InstanceComponent} opts 
 * @param {XMLNode} node 
 * @param {boolean} createelem 是否初始创建`document`属性为新建的`Element`电源线
 */
function GoalsViewComponent(opts, node) {
    /** @type {GoalsPage.InstanceComponent} */
    var self = this;
    self.data = {};
    self.tag = 'div';
    self.view = null;
    self.script = null;
    self.syncload = false;
    self.repeatload = false;
    self.customProperty = null;
    self.onhide = null;
    self.onshow = null;
    self.onready = null;
    self.onunload = null;
    self.oncreate = null;
    Goals.combine(opts, self);
    var elem = document.createElement(self.tag);
    self[0] = elem;
    self.document = elem;
    self.url = null;
    self.css = [];
    self.javascript = [];
    self.components = [];
    self.node = node;
}
;(function(fn) {
    window.Goals = fn();
}(
function() {
    // GoalsCompatibility
    (function() {
        if(!String.prototype.trim) {
            String.prototype.trim = function() {
                return this.replace(/(^\s*)|(\s*$)/g, '');
            }
        }
        if(!String.prototype.startsWith) {
            String.prototype.startsWith = function(str) {
                return new RegExp('^' + str).test(this);
            }
        }
        if(!String.prototype.endsWith) {
            String.prototype.endsWith = function(str) {
                return new RegExp(str + '$').test(this);
            }
        }
        if(!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(val) {
                for(var i = 0; i < this.length; i++) {
                    if(this[i] == val) return i;
                }
                return -1;
            }
        }
        if(!Array.prototype.remove) {
            Array.prototype.remove = function(val) {
                var index = this.indexOf(val);
                if(index > -1) {
                    this.splice(index, 1);
                    return true;
                }
                return false;
            }
        }
        Array.prototype.removeByInex = function(index) {
            this.splice(index, 1);
        }
    }());
    var G = Goals = {};
    // var Goals = {};
    var Partial = {
        pause_once_hashchange_listener: function() {},
        hashchange: function(hash) {},
        modify_hash_and_parse_parameter: function(url, parameter) {},
        add_hashchange_listener: function(callback) {},
        build_page: function(url, parameter) {}
    };
    
    /** @type {GoalsCommon} */
    Goals.common = {};
    
    /**
     * 设置对象的固定（不可变）属性
     * @param {object} obj 需要设置属性的对象
     * @param {stirng} key 设置对象的键
     * @param {string|object} val 设置的值
     */
    function set_readonly(obj, key, val) {
        if(val !== undefined) {
            Object.defineProperty(obj, key, {
                writable: false,
                configurable: false,
                enumerable: false,
                value: val
            });
        }
    }
    
    Goals.setReadonly = set_readonly;

    Goals.assert = function(judge, msg) {
        if(judge == null || judge == undefined || judge == false) {
            throw new Error(msg);
        }
    }
    Goals.combine = function(source, target, filter) {
        if(!source) return source;
        filter = filter || [];
        if(Object.prototype.toString.call(source) === '[object Object]') {
            target = target || {};
            for(var key in source) {
                if(filter.indexOf(key) === -1) {
                    target[key] = Goals.combine(source[key], target[key]);
                }
            }
            return target;
        }else if(Object.prototype.toString.call(source) === '[object Array]') {
            target = target || [];
            for(var i = 0; i < source.length; i ++) {
                if(filter.indexOf(key) === -1) {
                    target[i] = Goals.combine(source[i], target[i]);
                }
            }
            return target;
        }else {
            return source;
        }
    }

    Goals.exportJs = function(src, callback) {
        Goals.assert(src, 'the "src" is undefined');
        var script = document.createElement('script');
        script.type = 'text/javascript';
        if(script.readyState) {
            script.onreadystatechange = function() {
                if(script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    callback && callback(script);
                }
            }
        }else {
            script.onload = function() {
                callback && callback(script);
            }
        }
        script.src = src;
        document.body.appendChild(script);
        return script;
    }
    
    Goals.exportCss = function(src) {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', src);
        document.head.appendChild(link);
        return link;
    }

    Goals.currentUrl = function() {
        var hash = window.location.hash;
        var last_index = hash.indexOf(Goals.common.HASH_PARAMS_DELIMITER);
        if(last_index === -1) {
            last_index = hash.length;
        }
        var hash = hash.substring(hash.indexOf(Goals.common.HASH_DELIMITER) + 1, last_index);
        return Goals.common.HASH_ENCRYPT ? Goals.chaotic.decode(hash) : hash;
    }

    Goals.init = function(setting) {
        /** 没有hashchange监听的浏览器自己使用定时器的定时器间隔时间 */
        var HASHCHANGE_CUSTOM_LISTEN_DELAY = 16;
        /** 暂停本次hashchange事件后，重新绑定的延迟时间 */
        var HASHCHANGE_PAUSE_DELAY = 17;
        /** `Goals`的事件管理对象 */
        var GOALS_EVENTS = {
            hashchange: []
        };
        /** 初始化参数 */
        function init_params(key, val) {
            if(setting[key] === undefined) {
                setting[key] = val;
            }
        }
        /** 打开初始化页面，判断当前浏览器`url`中是否存在页面地址，如果存在，则直接打开浏览器`url`中包含的页面，否则打开初始页面 */
        function open_init_page() {
            if(!setting.page) {
                return;
            }
            var page = setting.page;
            var hash = location.hash;
            var parameter;
            if(hash) {
                var index = hash.indexOf(Goals.common.HASH_DELIMITER);
                if(index > -1) {
                    hashchange(hash);
                    return;
                }
            }
            Goals.open(page, parameter);
        }
        /** 改变`hash`值后执行的方法，该方法用于监听浏览器`hash`值变化后打开对应的页面 */
        function hashchange(hash) {
            var index = hash.indexOf(Goals.common.HASH_DELIMITER);
            Goals.assert(index > -1, 'Invalid request address [' + hash + ']');
            var page = hash.substring(index + Goals.common.HASH_DELIMITER.length);
            if(Goals.common.HASH_ENCRYPT) {
                page = Goals.chaotic.decode(page);
            }
            index = page.indexOf(Goals.common.HASH_PARAMS_DELIMITER);
            var parameter;
            if(index > -1) {
                var type = page.substring(index + 1, index + 3);
                if(type === 's:') {
                    parameter = page.substring(index + 3);
                    page = page.substring(0, index);
                }else if(type === 'o:') {
                    parameter = JSON.parse(decodeURIComponent(page.substring(index + 3)));
                    page = page.substring(0, index);
                }
            }
            Goals.open(page, parameter);
        }
        /** `hashchange`的触发方法 */
        function onhashchange() {
            var events = GOALS_EVENTS.hashchange;
            if(events.canExec) {
                for(var i = 0, fn; fn = events[i++];) {
                    fn(location.hash);
                }
            }
        }
        /** 初始化`hashchange`的监听器 */
        function init_hashchange_listener() {
            GOALS_EVENTS.hashchange.push(hashchange);
            GOALS_EVENTS.hashchange.canExec = false;
            if(('onhashchange' in window) && (typeof document.documentMode === 'undefined' || document.documentMode == 8)) {
                window.onhashchange = onhashchange;
            }else {
                var hash = '';
                setInterval(function() {
                    if(hash !== location.hash) {
                        hash = location.hash;
                        onhashchange();
                    }
                }, HASHCHANGE_CUSTOM_LISTEN_DELAY);
            }
        }
        /**
         * 修改浏览器的`hash`值，并解析页面参数
         * @param {string} url 页面url
         * @param {string|object} parameter 页面参数
         * @returns 页面参数
         */
        function modify_hash_and_parse_parameter(url, parameter) {
            var hash = url;
            var result = parameter;
            if(parameter) {
                if(typeof parameter === 'object') {
                    hash = url + Goals.common.HASH_PARAMS_DELIMITER + 'o:' + encodeURIComponent(JSON.stringify(parameter));
                }else {
                    if((parameter.charAt(0) === 'o' || parameter.charAt(0) === 's') && parameter.charAt(1) === ':') {
                        if(parameter.charAt(0) === 'o') {
                            result = JSON.parse(parameter.substring(2));
                        }else {
                            result = parameter.substring(2);
                        }
                        hash = url + Goals.common.HASH_PARAMS_DELIMITER + parameter;
                    }else {
                        hash = url + Goals.common.HASH_PARAMS_DELIMITER + 's:' + parameter;
                    }
                }
            }
            if(Goals.common.HASH_ENCRYPT) {
                hash = Goals.chaotic.encode(hash);
            }
            hash = Goals.common.HASH_DELIMITER + hash;
            if(location.hash !== '#' + hash) {
                location.hash = hash;
            }
            return result;
        }
        /** 停止浏览器的hashchange监听 */
        function stop_hashchange_listener() {
            GOALS_EVENTS.hashchange.canExec = false;
        }
        /** 启动浏览器的hashchange监听 */
        function start_hashchange_listener() {
            GOALS_EVENTS.hashchange.canExec = true;
        }
        /** 暂停本次hashchange的监听，用于显示页面时，不需要重新打开页面。 */
        function pause_once_hashchange_listener() {
            stop_hashchange_listener();
            setTimeout(start_hashchange_listener, HASHCHANGE_PAUSE_DELAY);
        }
        init_params('project', '');
        init_params('server', '');
        init_params('container', document.body);
        init_params('viewCallbackName', 'GoalsPage');
        init_params('debug', false);
        init_params('hashDelimiter', '!');
        init_params('hashParamsDelimiter', '=');
        init_params('hashEncrypt', false);
        init_params('pageMaxinum', 10);
        init_params('expressionStart', '\\${');
        init_params('expressionEnd', '}');
        set_readonly(Goals.common, 'PROJECT_NAME', setting.project);
        set_readonly(Goals.common, 'SERVER_NAME', setting.server);
        set_readonly(Goals.common, 'VIEW_CALLBACK_NAME', setting.viewCallbackName);
        set_readonly(Goals.common, 'CONTAINER', setting.container);
        set_readonly(Goals.common, 'DEBUG', setting.debug);
        set_readonly(Goals.common, 'HASH_DELIMITER', setting.hashDelimiter);
        set_readonly(Goals.common, 'HASH_PARAMS_DELIMITER', setting.hashParamsDelimiter);
        set_readonly(Goals.common, 'HASH_ENCRYPT', setting.hashEncrypt);
        set_readonly(Goals.common, 'PAGE_MAXINUM', setting.pageMaxinum);
        set_readonly(Goals.common, 'EXPRESSION_REG', new RegExp(setting.expressionStart + '(.+?)' + setting.expressionEnd, 'g'));
        set_readonly(Goals.common, 'EXPRESSION_LENGTH_START', setting.expressionStart.replace(/\\/g, '').length);
        set_readonly(Goals.common, 'EXPRESSION_LENGTH_END', setting.expressionEnd.replace(/\\/g, '').length);
        Partial.hashchange = hashchange;
        Partial.modify_hash_and_parse_parameter = modify_hash_and_parse_parameter;
        Partial.pause_once_hashchange_listener = pause_once_hashchange_listener;
        open_init_page();
        init_hashchange_listener();
        Partial.add_hashchange_listener = function(callback) {
            GOALS_EVENTS.hashchange.push(callback);
        }
    }

    Goals.addListener = function(event, callback) {
        if(event === 'hashchange') {
            Partial.add_hashchange_listener(callback);
        }
    }

    Goals.open = function(url, parameter) {
        var index = url.indexOf(Goals.common.HASH_PARAMS_DELIMITER);
        if(index > -1) {
            parameter = url.substring(index + 1);
            url = url.substring(0, index);
        }
        Partial.pause_once_hashchange_listener();
        parameter = Partial.modify_hash_and_parse_parameter(url, parameter);
        Partial.build_page(url, parameter);
    }

    // GoalsXML
    Goals.xml = function() {
        /** @type {GoalsXML} */
        var xml = {};
        var xml_start = '<', xml_end = '>', xml_end_simgle = '/';
        var EXTRACT_ATTR_REG = /\s{1}[a-zA-Z]+[0-9]*-*[a-zA-Z]*[0-9]*=(".*?"|'.*?')/ig;
        function parse_text(text) {
            var nodes = [],
                level = 0,
                len = text.length,// text的长度
                i = 0,// 当前应该取的下标
                cur_char = '',// 当前下标的字符串
                str_buffer = '',
                _node = null,
                last_node = null,
                other_str_buffer = [],
                quotes = '',// 当前的引号,它的值为单引号或双引号
                quotes_err_debug = '';// 错误信息
            while(i < len) {
                cur_char = text[i];
                if(cur_char === xml_start) {
                    str_buffer = [xml_start];
                    cur_char = text[++i];
                    if(cur_char === "!" && text[i + 1] === "-" && text[i + 2] === "-") {
                        // 注释
                        i += 2;
                        while(true) {
                            cur_char = text[++ i];
                            if(cur_char === "-" && text[i + 1] === "-" && text[i + 2] === ">") {
                                i += 2;
                                break;
                            }
                        }
                    }else if(cur_char === xml_end_simgle) {
                        // 结束标签
                        while((cur_char = text[++i]) !== xml_end) {}
                        last_node.text = other_str_buffer.join("");
                        last_node = last_node.__parent;
                        other_str_buffer = [];
                        level --;
                    }else {
                        // 开始标签
                        str_buffer.push(cur_char);
                        quotes = null;
                        var previous_char;
                        while(true) {
                            cur_char = text[++i];
                            if(cur_char === undefined) {
                                throw new Error("Missing end marker...\nQuotation mark error: \n[" + (quotes_err_debug).join("") + "]");
                            }
                            if(/\s/g.test(cur_char)) {
                                cur_char = " ";
                                if(quotes === null && previous_char === " ") {
                                    continue;
                                }
                            }else if(cur_char === "/") {
                                if(quotes === null) {
                                    continue;
                                }
                            }else if(cur_char === "'") {
                                if(quotes === "'") {
                                    if(text[i - 1] === "\\") {
                                        throw new Error("Missing end marker...\nQuotation mark error: \n[" + (quotes_err_debug).join("") + "']");
                                    }
                                    quotes = null;
                                }else if(quotes === null) {
                                    if(text[i - 1] !== "=") {
                                        continue;
                                    }
                                    quotes = "'";
                                    quotes_err_debug = [];
                                }
                            }else if(cur_char === '"') {
                                if(quotes === '"') {
                                    if(text[i - 1] === "\\") {
                                        throw new Error("Missing end marker...\nQuotation mark error: \n[" + (quotes_err_debug).join("") + "\"]");
                                    }
                                    quotes = null;
                                }else if(quotes == null) {
                                    if(text[i - 1] !== "=") {
                                        continue;
                                    }
                                    quotes = '"';
                                    quotes_err_debug = [];
                                }
                            }else if(cur_char === xml_end) {
                                if(quotes === null) {
                                    if(previous_char === " ") {
                                        str_buffer.splice(str_buffer.length - 1, 1);
                                    }
                                    break;
                                }
                            }
                            str_buffer.push(cur_char);
                            if(quotes_err_debug) {
                                quotes_err_debug.push(cur_char);
                            }
                            previous_char = cur_char;
                        }
                        if(text[i - 1] === ' ') {
                            throw new Error("In strict mode, a character before the terminator '>' cannot be a space");
                        }
                        str_buffer.push(xml_end);
                        _node = new XMLNode();
                        _node.tag_text = str_buffer.join("");
                        var _tag_subi = _node.tag_text.indexOf(" ");
                        if(_tag_subi > -1) {
                            _node.tag = _node.tag_text.substring(1, _tag_subi);
                        }else {
                            _tag_subi = _node.tag_text.indexOf("/>");
                            if(_tag_subi > -1) {
                                _node.tag = _node.tag_text.substring(1, _tag_subi);
                            }else {
                                _tag_subi = _node.tag_text.indexOf(">");
                                _node.tag = _node.tag_text.substring(1, _tag_subi);
                            }
                        }
                        if(last_node) {
                            _node.__parent = last_node;
                        }
                        if(level === 0) {
                            nodes.push(_node);
                        }else {
                            if(!last_node.children) {
                                last_node.children = [];
                            }
                            last_node.children.push(_node);
                        }
                        if(text[i - 1] === '/') {
                            _node.single = true;
                        }else {
                            level ++;
                            last_node = _node;
                        }
                        other_str_buffer = [];
                    }
                }else {
                    other_str_buffer.push(cur_char);
                }
                i ++;
            }
            return nodes;
        }
        function text2attr(text) {
            var arr = text.match(EXTRACT_ATTR_REG);
            if(!arr) {
                return null;
            }
            var attr = {};
            var equal_index, val;
            for(var i = 0, r; i < arr.length; i ++) {
                r = arr[i];
                equal_index = r.indexOf('=');
                val = r.substring(equal_index + 2, r.length - 1);
                attr[r.substring(1, equal_index)] = val;
            }
            return attr;
        }
        function build_node_attr(node) {
            node.attr = text2attr(node.tag_text);
            delete node.tag_text;
            delete node.__parent;
        }
        function parse_attr(nodes) {
            function parse(ns) {
                ns.forEach(function(r) {
                    build_node_attr(r);
                    if(r.children) {
                        parse(r.children);
                    }
                });
            }
            parse(nodes);
        }
        xml.parse = function(text) {
            var nodes = parse_text(text);
            parse_attr(nodes);
            return nodes;
        }
        xml.elems = function(text) {
            if(window.DOMParser) {
                var parser = new DOMParser();
                return parser.parseFromString(text, 'text/xml');
            }else {
                var xmldoc = new ActiveXObject('Microsoft.XMLDOM');
                xmldoc.async = false;
                return xmldoc.loadXML(text);
            }
        }
        return xml;
    }();

    // GoalsRequest
    Goals.request = function() {
        /** @type {GoalsRequest} */
        var request = {};
        var jsonpLoadingList = {};
        var dataResolver = {
            'json': function(text) {
                return JSON.parse(text);
            },
            'xml': function(text) {
                Goals.assert(Goals.xml, 'You must import the "goals.xml" package');
                return Goals.xml.parse(text);
            },
            'elems': function(text) {
                if(window.DOMParser) {
                    var parser = new DOMParser();
                    return parser.parseFromString(text, 'text/xml');
                }else {
                    var xmldoc = new ActiveXObject('Microsoft.XMLDOM');
                    xmldoc.async = false;
                    xmldoc.loadXML(text);
                }
            }
        };
        function ajax_merge_params(opt) {
            var def_opt = {
                type: 'get',
                resultType: '',
                parseData: true,
                anysc: true,
                headers: {'Content-Type': 'application/json'},
                error: function(e) {
                    console.log(e);
                }
            };
            for(var k in opt) {
                def_opt[k] = opt[k];
            }
            opt = null;
            def_opt.type = def_opt.type.toUpperCase();
            return def_opt;
        }
        function object_2_qs(data) {
            if(!data) {
                return '';
            }
            if(typeof data === 'object') {
                var arr = [];
                for(var name in data) {
                    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                }
                arr.push(("v=" + Math.random()).replace(".", ""));
                return arr.join("&");
            }else if(typeof data === 'string') {
                return data;
            }else {
                throw new Error("输入的参数必须是对象");
            }
        }
        function parse_ajax_data(opt) {
            var reqData = null;
            if(opt.type === 'GET') {
                opt.uri = opt.url + (opt.url.indexOf('?') > -1 ? '&' : '?') + object_2_qs(opt.data);
            }else {
                if(opt.parseData) {
                    var content_type = opt.headers['Content-Type'];
                    if(content_type) {
                        if(content_type.indexOf('application/x-www-form-urlencoded') > -1) {
                            reqData = object_2_qs(opt.data);
                        }else if(content_type.indexOf('application/json') > -1) {
                                var data = typeof opt.data === 'object' ? JSON.stringify(opt.data) : opt.data;
                                reqData = data ? new Blob([data], {type: 'application/json'}) : null;
                        }else {
                            throw new Error("Instead of looking for a parameter resolver of the current '" + content_type + "' type, " +
                                "you can pass in 'parseData' with a value of 'false' and decompose your request parameters yourself.");
                        }
                    }
                }
            }
            return reqData;
        }
        request.ajax = function(opts) {
            opts = ajax_merge_params(opts);
            var xmlhr;
            if(window.XMLHttpRequest) {
                xmlhr = new XMLHttpRequest();
            }else {
                xmlhr = new ActiveXObject('Microsoft.XMLHTTP');
            }
            if(opts.timeout) {
                xmlhr.timeout = opts.timeout;
                xmlhr.ontimeout = opts.error;
            }
            xmlhr.onerror = opts.error;
            if(opts.progress) {
                xmlhr.upload.onprogress = opts.progress;
            }
            xmlhr.onreadystatechange = function() {
                if(xmlhr.readyState === 4) {
                    if(xmlhr.status === 200) {
                        var data;
                        if(opts.resultType) {
                            var resolver = dataResolver[opts.resultType];
                            if(!resolver) {
                                throw new Error("No response data parser of type '" + opts.resultType + "' was found");
                            }
                            data = resolver(xmlhr.responseText);
                        }else {
                            var content_type = xmlhr.getResponseHeader('Content-Type');
                            if(content_type.indexOf('application/x-www-form-urlencoded') > -1) {
                                data = dataResolver.qs(xmlhr.responseText);
                            }else if(content_type.indexOf('application/json') > -1) {
                                data = dataResolver.json(xmlhr.responseText);
                            }else {
                                var ct = content_type.split(';')[0];
                                if(dataResolver[ct]) {
                                    data = dataResolver[ct](xmlhr.responseText);
                                }else {
                                    data = xmlhr.responseText;
                                }
                            }
                        }
                        opts.success && opts.success(data, xmlhr);
                    }else {
                        opts.error(xmlhr);
                    }
                }
            }
            var reqData = parse_ajax_data(opts);
            xmlhr.open(opts.type, opts.uri || opts.url, opts.anysc);
            for(var k in opts.headers) {
                xmlhr.setRequestHeader(k, opts.headers[k]);
            }
            xmlhr.send(reqData == null ? opts.data : reqData);
        }
        request.jsonp = function(opts) {
            Goals.assert(!jsonpLoadingList[opts.url], 'Currently "url" is loading');
            jsonpLoadingList[opts.url] = true;
            var url = opts.url + (opts.url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + opts.callbackName;
            var script = document.createElement('script');
            document.body.appendChild(script);
            window[opts.callbackName] = function(json) {
                clear(script);
                opts.okFn && opts.okFn(json);
            };
            var timerFn;
            if(opts.timeout) {
                timerFn = setTimeout(function() {
                    clear(script);
                }, opts.timeout);
            }
            script.onerror = function(e) {
                clear(script);
                opts.errFn && opts.errFn(e);
            }
            function clear(scr) {
                if(timerFn) {
                    clearTimeout(timerFn);
                }
                delete window[opts.callbackName];
                delete jsonpLoadingList[opts.url];
                document.body.removeChild(scr);
            }
            script.src = url;
        }
        request.setAjaxDataResolver = function(contentType, parseFn) {
            dataResolver[contentType] = parseFn;
        }
        return request;
    }();

    // GoalsChaotic
    Goals.chaotic = function() {
        /** @type {GoalsChaotic} */
        var chaotic = {};
        var CHAR_TRANSITION = 'ZXCVBNMASDFGHJKLqwertyuiop012345',
            HEXADECIMAL = '0123456789abcdef',
            SPLIT = 'QWERTYUIOPasdfghjklzxcvbnm6789',
            REG_SPLIT = /Q|W|E|R|T|Y|U|I|O|P|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m|6|7|8|9/g,
            DEFAULT_COMPLEXITY = 0;
        /** 字符串Unicode编码 */
        function str_to_unicode(str) {
            var arr = [];
            var hexadecimal;
            for(var i = 0; i < str.length; i++) {
                hexadecimal = parseInt(str.charCodeAt(i), 10).toString(16);
                hexadecimal = transition_for_char(hexadecimal);
                arr.push(hexadecimal);
                arr.push(random_split());
            }
            return arr.join('');
        }
        /** 字符串Unicode解码 */
        function unicode_to_str(str) {
            var _str = str.replace(REG_SPLIT, ',');
            var arr = _str.split(',');
            var _char = '';
            var resp = [];
            for(var i = 0; i < arr.length; i ++) {
                if(arr[i] !== '') {
                    _char = restore_for_char(arr[i]);
                    resp.push(String.fromCharCode(parseInt(_char, 16).toString(10)));
                }
            }
            return resp.join('');
        }
        /** 根据`CHAR_TRANSITION`转换字符 */
        function transition_for_char(_char) {
            var index, random;
            var resp = '';
            for(var i = 0, r; r = _char[i++];) {
                index = HEXADECIMAL.indexOf(r);
                if(index > -1) {
                    random = Math.floor(Math.random() * 10 + 1) % 2;
                    resp += CHAR_TRANSITION[index + (random * 16)];
                }
            }
            return resp;
        }
        /** 根据`CHAR_TRANSITION`还原字符 */
        function restore_for_char(_char) {
            var _resp = '';
            for(var i = 0, r; r = _char.charAt(i++);) {
                _resp += HEXADECIMAL[CHAR_TRANSITION.indexOf(r) % 16]
            }
            return _resp;
        }
        /** 将分割符随机转换成`SPLIT` */
        function random_split() {
            return SPLIT[Math.floor(Math.random() * 30)];
        }
        /** 将字符串的奇数位于偶数位提取拼接 */
        function sort_str(str) {
            var odd = '';//基数位
            var even = '';//偶数位
            for(var i = str.length - 1, r; r = str[i--];) {
                if(i%2 == 0) {
                    even += r;
                }else {
                    odd += r;
                }
            }
            return odd + even;
        }
        /** 把被提取奇数位与偶数位拼接的字符串还原 */
        function restore_sort_str(str) {
            var splitIndex = str.length/2;
            var str1 = str.substring(0, splitIndex);
            var str2 = str.substring(splitIndex);
            var resp = [];
            for(var i = str1.length - 1, r, e; r = str1[i], e = str2[i]; i--) {
                resp.push(r);
                resp.push(e);
            }
            return resp.join('');
        }
        chaotic.encode = function(text) {
            var unicode = str_to_unicode(text);
            for(var i = 0; i < DEFAULT_COMPLEXITY; i ++) {
                unicode = sort_str(unicode);
            }
            return unicode;
        }
        chaotic.decode = function(text) {
            for(var i = 0; i < DEFAULT_COMPLEXITY; i ++) {
                text = restore_sort_str(text);
            }
            return unicode_to_str(text);
        }
        return chaotic;
    }();
    
    // GoalsStorage
    Goals.storage = function() {
        /** @type {GoalsStorage} */
        var storage = {};
        storage.add = function(name, value) {
            if(value === null || value === undefined) {
                value = 'null';
            }
            if(typeof value === 'object') {
                value = "1" + JSON.stringify(value);
            }else {
                value = '0' + value;
            }
            value = Goals.chaotic.encode(value);
            localStorage.setItem(name, value);
        }
        storage.get = function(name) {
            var value = localStorage.getItem(name);
            if(value === null || value === undefined || value === 'null') {
                return null;
            }
            value = Goals.chaotic.decode(value);
            var isobject = parseInt(value.charAt(0));
            value = value.substring(1);
            return isobject ? JSON.parse(value) : value;
        }
        storage.remove = function(name) {
            localStorage.removeItem(name);
        }
        storage.clear = function() {
            localStorage.clear();
        }
        return storage;
    }();
    
    // GoalsCookie
    Goals.cookie = function() {
        /** @type {GoalsCookie} */
        var cookie = {};
        cookie.add = function(name, value, expires) {
            var cookie_expires = '';
            if(expires) {
                var exp = new Date();
                exp.setTime(exp.getTime() + (expires * 1000));
                cookie_expires = ';expires=' + exp.toUTCString();
            }
            document.cookie = name + '=' + Goals.chaotic.encode(value) + cookie_expires;
        }
        cookie.get = function(name) {
            var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
            if(arr != null) {
                return Goals.chaotic.decode(decodeURIComponent(arr[2]));
            }
            return null;
        }
        cookie.remove = function(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            document.cookie = name + '=' + ';expires=' + exp.toUTCString();
        }
        return cookie;
    }();

    // GoalsSession
    Goals.session = function() {
        /** @type {GoalsSession} */
        var session = {};
        session.add = function(name, value) {
            if(value === null || value === undefined) {
                value = 'null';
            }
            if(typeof value === 'object') {
                value = '1' + JSON.stringify(value);
            }else {
                value = '0' + value;
            }
            value = Goals.chaotic.encode(value);
            sessionStorage.setItem(name, value);
        }
        session.get = function(name) {
            var value = sessionStorage.getItem(name);
            if(value === null || value === undefined || value === 'null') {
                return null;
            }
            value = Goals.chaotic.decode(value);
            var isobject = parseInt(value.substring(0, 1));
            value = value.substring(1);
            return isobject ? JSON.parse(value) : value;
        }
        session.remove = function(name) {
            sessionStorage.removeItem(name);
        }
        session.clear = function() {
            sessionStorage.clear();
        }
        return session;
    }();

    // GoalsView
    (function() {
        /** 需要大量使用到`GoalsCommon`类下的属性 */
        var Common = Goals.common;
        /**
         * 所有的页面栈对象
         * @type {GoalsPage.InstanceView[]}
         */
        var pages = [];
        /**
         * 已经导入过的额外组件
         * 
         * 此处做缓存，当出现已经导入过的就不再导入了
         * @type {string[]}
         */
        var loadedComponentLibs = [];
        /** 所有已经加载过的`js`包 */
        var javascripts = [];
        /** 不缓存页面的标识符 */
        var PAGE_NOT_CACHE = 0;
        /** 不限制页面缓存数量的标识符 */
        var PAGE_UNLIMITED = -1;
        /** 提取变量的正则表达式 */
        var EXTRACT_VAR_REG = /[a-z_]\w*[\[\w*\]]*[.]{0,1}\w*(?!\w*\s*(\(|\"|\'))/ig;
        /** 页面表达式的正则表达式 */
        /** 引号（包括单引号和双引号）正则表达式 */
        var REPLACE_STRING_REG = /(\").+?(\")|(\').+?(\')/g;
        /** 在缓存中的表达式表示值，通过它可以快速的替换表达式的内容 */
        var BUFFER_EXPS = '(exps{i})';
        /** 在缓存中的元素文本内容的缓存键（`key`），此值为属性关键字，也就是就在`html`中，如果使用了表达式的元素属性，键不能为此值，否则抛出异常 */
        var ELEMS_TEXT_ATTR = 'GoalsText';
        /** 使用`eval`方法取`data`值的时候，需要命名的变量名 */
        var BUFFER_DATA = 'data';
        /** `goals-id`选择器的属性名 */
        var ELEMS_ATTR_GOALS_ID = 'goals-id';
        /** 需要转义的`html`元素 */
        var HTML_ESCAPE_REG = /(<)|(>)/gi;
        /** 对应转成什么样子的对象 */
        var HTML_ESCAPE = {'<': '&lt;', '>': '&gt;'};
        /** js的关键字，在`html`表达式中对这些`key`不做处理 */
        var JS_KEYWORD = {'false': 1, 'true': 1, 'null': 1, 'undefined': 1, 'typeof': 1, 'instanceof': 1};
        /** 组件是否使用了当前`setData`这个属性的标识符，可根据此值来进行判断 */
        var HAS_USE_SPACE_ID = null;
        /**
         * 标签解析器，自定义标签解析器
         * @type {{[name:string]:GoalsPage.GoalsComponent}}
         */
        var loadcomponents = {};
        
        var COMPONENT_FUNCS = {};
        GoalsView.prototype.showExecutor = function() {
            this[0].style.opacity = 0;
            this[0].style.display = 'block';
            setTimeout(function(elem) {elem.style.opacity = 1;}, 200, this[0]);
        };
        GoalsView.prototype.hideExecutor = function() {this.document.style.display = 'none'};
        GoalsViewComponent.prototype.showExecutor = function() {this.document.style.display = 'block'};
        GoalsViewComponent.prototype.hideExecutor = function() {this.document.style.display = 'none'};
        GoalsViewComponent.prototype.addUsespace = function(key) {this.__usespace__[key] = HAS_USE_SPACE_ID};
        GoalsViewComponent.prototype.addSpace = function(key, value) {if(!this.__space__) {this.__space__ = {}}this.__space__[key] = value};

        window.GoalsComponent = function(name, opts) {
            loadcomponents[name] = opts;
        };
        Goals.initComponent = function(opts) {
            var componentPrototype, customProperty, settingProperty;
            for(var componentName in opts) {
                componentPrototype = loadcomponents[componentName];
                if(componentPrototype) {
                    settingProperty = opts[componentName];
                    customProperty = componentPrototype.customProperty;
                    if(customProperty != null) {
                        for(var propertyName in settingProperty) {
                            if(customProperty[propertyName]) {
                                customProperty[propertyName] = settingProperty[propertyName];
                            }
                        }
                    }
                }
            }
        }
        function clear_style() {
            /** @type {GoalsPage.InstanceView | GoalsPage.InstanceComponent} */
            var self = this;
            self.__csstags__ && self.__csstags__.forEach(function(r) {
                document.head.removeChild(r);
            });
            self.__csstags__.splice(0, self.__csstags__.length);
        }
        function findViewByUrl(url) {
            for(var i = 0, r; r = pages[i++];) {
                if(url === r.__public.url) {
                    return r.__public;
                }
            }
            return null;
        }
        function views() {
            var result = [];
            for(var i = 0, r; r = pages[i++];) {
                result.push(r);
            }
            return result;
        }
        function index_of_page_by_url(url) {
            for(var i = 0; i < pages.length; i ++) {
                if(url === pages[i].url) {
                    return i;
                }
            }
            return -1;
        }
        function index_of_page_by_view(view) {
            for(var i = 0; i < pages.length; i ++) {
                if(view === pages[i]) {
                    return i;
                }
            }
            return -1;
        }
        function push_page(page) {
            if(Common.PAGE_MAXINUM === PAGE_NOT_CACHE) {
                pages[0] && pages[0].unload();
                pages = [page];
            }else if(Common.PAGE_MAXINUM === PAGE_UNLIMITED) {
                pages.push(page);
            }else {
                if(Common.PAGE_MAXINUM === pages.length) {
                    pages[0].unload();
                }
                pages.push(page);
            }
        }
        function build_page(url, parameter) {
            var index = index_of_page_by_url(url);
            // 页面已经存在
            if(index > -1) {
                var view = pages[index];
                view.receive = parameter;
                view.reload();
            }else {
                create_page(url, parameter);
            }
        }
        function create_page(url, parameter) {
            var jsonp_url = (url.charAt(0) === '/' ? Common.PROJECT_NAME : '') + url + '.js';
            Goals.request.jsonp({url: jsonp_url, callbackName: Common.VIEW_CALLBACK_NAME,
                okFn: function(opts) {
                    var view = new GoalsView(opts);
                    import_component(view, function() {
                        view_set_proto(view, url, parameter);
                        create_xmlnode(view, function(nodes) {
                            view_elem_init(view, nodes, function() {
                                push_page(view);
                                show_current_page(view);
                                load_scripts(view);
                            });
                        });
                    });
                }
            });
        }
        /**
         * 导入额外组件
         * @param {GoalsPage.GoalsView} view 视图对象
         * @param {function():void} callback 回调函数
         */
        function import_component(view, callback) {
            var libs = view.componentLibs;
            if(libs && libs.length > 0) {
                var i = 0;
                function __import() {
                    var lib = libs[i++];
                    if(lib) {
                        if(loadedComponentLibs.indexOf(lib) == -1) {
                            Goals.exportJs(lib, __import);
                            loadedComponentLibs.push(lib);
                        }else {
                            __import();
                        }
                    }else {
                        callback();
                    }
                }
                __import();
            }else {
                callback();
            }
        }
        /**
         * 创建`html`的自定义`xml`节点
         * @param {GoalsPage.GoalsView} page 
         * @param {function(XMLNode[]):void} callback 
         */
        function create_xmlnode(page, callback) {
            var html_url;
            if(page.view) {
                page.view = page.view.trim();
                if(page.view.charAt(0) === '<') {
                    callback(Goals.xml.parse(page.view));
                    return;
                }else {
                    html_url = process_path(page.view, page.url);
                }
            }else {
                html_url = page.url + '.html';
            }
            Goals.request.ajax({url: html_url, resultType: 'xml', success: callback});
        }
        /** @param {GoalsPage.GoalsView} view */
        function view_set_proto(view, url, parameter) {
            set_readonly(view, 'find', GoalsView_find);
            set_readonly(view, 'show', GoalsView_show);
            set_readonly(view, 'hide', GoalsView_hide);
            set_readonly(view, 'unload', GoalsView_unload);
            set_readonly(view, 'back', GoalsView_back);
            set_readonly(view, 'reload', GoalsView_reload);
            set_readonly(view, 'findComponentById', GoalsView_findComponentById);
            set_readonly(view, 'url', url);
            // set_readonly(view, 'receive', parameter);
            set_readonly(view, 'hash', location.hash);
            set_readonly(view, '__clearstyle__', clear_style);
            view.receive = parameter;
        }
        /**
         * 加载页面的`css`
         * @param {GoalsPage.InstanceView} view 
         */
        function reload_page_css(view) {
            if(view.__csstags__.length === 0) {
                view.css.forEach(function(r) {
                    view.__csstags__.push(Goals.exportCss(r));
                });
            }
        }
        function process_path(path, url) {
            if(path.substring(0, 2) === '//') {
                return (window.location.href.charAt(4) === 's' ? 'https:' : 'http:') + path;
            }else if(path.charAt(0) === '/') {
                return Common.PROJECT_NAME + path;
            }else if(path.substring(0, 4) === 'http') {
                return path;
            }else {
                var index = url.lastIndexOf('/');
                if(index > -1) {
                    return url.substring(0, index + 1) + path;
                }else {
                    return path;
                }
            }
        }
        /**
         * 加载页面的`js`和`css`
         * @param {GoalsPage.InstanceView} view 
         */
        function load_scripts(view) {
            var readyed_num = 0, has_ready_num = 1;
            var start = Date.now();
            function __call() {
                if(++readyed_num === has_ready_num && view.onready) {
                    var time = Date.now() - start;
                    // 至少加载500ms
                    if(time >= 500) {
                        view.onready();
                    }else {
                        setTimeout(function() {view.onready();}, time);
                    }
                }
            }
            // 页面才加载默认css，组件暂时没有考虑加载默认的功能
            view instanceof GoalsView && !view.notImportDefaultCss && view.css.push(view.url + '.css');
            // 解析出js和css文件路径
            if(view.script && view.script.length > 0) {
                for(var i = 0, r; r = view.script[i++];) {
                    r = process_path(r, view.url);
                    if(r.substring(r.length - 4) === '.css') {
                        view.css.push(r);
                    }else {
                        view.javascript.push(r);
                    }
                }
            }
            // 优先引用css文件
            var csstags = [];
            view.css.forEach(function(src) {
                var css = Goals.exportCss(src);
                csstags.push(css);
            });
            set_readonly(view, '__csstags__', csstags);
            // 再加载js包
            if(view.javascript.length > 0) {
                var loaded_num = 0, has_load_num = view.javascript.length;
                function callback(script) {
                    script && document.body.removeChild(script);
                    ++loaded_num === has_load_num && __call();
                }
                if(view.syncload) {
                    // 同步加载js
                    function __export(src) {
                        if(!view.repeatload && javascripts.indexOf(src) > -1) {
                            callback();
                            loaded_num !== has_load_num && __export(view.javascript[loaded_num]);
                        }else {
                            javascripts.push(src);
                            Goals.exportJs(src, function(script) {
                                callback(script);
                                loaded_num !== has_load_num && __export(view.javascript[loaded_num]);
                            });
                        }
                    }
                    __export(view.javascript[loaded_num]);
                }else {
                    // 异步加载js
                    view.javascript.forEach(function(src) {
                        if(!view.repeatload && javascripts.indexOf(src) > -1) {
                            callback();
                        }else {
                            javascripts.push(src);
                            Goals.exportJs(src, callback);
                        }
                    });
                }
            }else {
                __call();
            }
        }
        /**
         * 显示当前页面，并将上一个页面隐藏
         * @param {GoalsPage.InstanceView} view 
         */
        function show_current_page(view) {
            view.onshow && view.onshow();
            view.showExecutor();
            if(pages.length > 1) {
                var prev_page = pages[pages.length - 2];
                prev_page.hide();
            }
        }
        function GoalsView_find(selector) {
            if(selector.substring(0, 2) === 'g:') {
                var gid = selector.substring(2);
                var obj = this.__goalsids__[gid];
                if(obj == null) {
                    return find_element_by_goalsid(this.components, gid);
                }else {
                    return obj.elem;
                }
            }else if(selector.charAt(0) === '#') {
                return this.document.querySelector(selector);
            }else {
                // class选择器和其它选择器一样
                return this.document.querySelectorAll(selector);
            }
        }
        /**
         * @param {GoalsPage.GoalsComponent[]} components 
         * @param {string} gid 
         */
        function find_element_by_goalsid(components, gid) {
            var obj;
            for(var i = 0, r; r = components[i++];) {
                obj = r.__goalsids__[gid];
                if(obj != null) {
                    return obj.elem;
                }
                if(r.components && r.components.length > 0) {
                    obj = find_element_by_goalsid(r.components, gid);
                    if(obj != null) {
                        return obj;
                    }
                }
            }
            return null;
        }
        function GoalsView_show() {
            var index = index_of_page_by_view(this);
            pages.splice(index, 1);
            pages.push(this);
            Partial.pause_once_hashchange_listener();
            Partial.modify_hash_and_parse_parameter(this.url, this.receive);
            this.__clearstyle__();
            reload_page_css(this);
            show_current_page(this);
        }
        function GoalsView_hide() {
            /** @type {GoalsPage.InstanceView} */
            var self = this;
            self.onhide && self.onhide();
            self.__clearstyle__();
            self.hideExecutor();
            hide_component(self)
        }
        /** @param {GoalsPage.InstanceView | GoalsPage.InstanceComponent} view */
        function hide_component(view) {
        	view.components && view.components.length > 0 && view.components.forEach(function(component) {
                component.hide();
                hide_component(component);
            });
        }
        function GoalsView_unload() {
            /** @type {GoalsPage.InstanceView} */
            var self = this;
            self.hide();
            self.onunload && self.onunload();
            var index = index_of_page_by_view(self);
            pages.splice(index, 1);
            setTimeout(function(elem) {
                Common.CONTAINER.removeChild(elem);
            }, 1000, self.document);
        }
        function GoalsView_back(delta) {
            this.unload();
            if(!delta) {
                delta = 1;
            }
            Partial.pause_once_hashchange_listener();
            window.history.back(-delta);
            if(pages.length > 0) {
                if(delta > pages.length) {
                    delta = pages.length;
                }
                var index = pages.length - delta;
                pages[index].show();
                for(var i = pages.length - 1; i > index; i --) {
                    pages[i].unload();
                }
            }
        }
        function GoalsView_reload() {
            /** @type {GoalsPage.InstanceView} */
            var self = this;
            var index = index_of_page_by_view(self);
            pages.splice(index, 1);
            Common.CONTAINER.removeChild(self.document);
            self.__clearstyle__();
            create_page(self.url, self.receive);
        }
        function GoalsView_findComponentById(id) {
            return find_component_by_id(id, this.components);
        }
        /**
         * 根据`id`递归查找组件
         * @param {string} id 
         * @param {GoalsPage.GoalsComponent[]} components 
         */
        function find_component_by_id(id, components) {
            for(var i = 0, r; r = components[i++];) {
                if(r.id === id) {
                    return r;
                }
                if(r.components && r.components.length > 0) {
                    var component = find_component_by_id(id, r.components);
                    if(component != null) {
                        return component;
                    }
                }
            }
            return null;
        }
        function component_create(node, parent, view, callback) {
            var opts = loadcomponents[node.tag];
            var component = new GoalsViewComponent(opts, node);
            parent.appendChild(component.document);
            component_set_proto(component, view);
            component.oncreate && component.oncreate(COMPONENT_FUNCS);
            function exec(nodes) {
                view_elem_init(component, nodes, function() {
                    load_scripts(component);
                    callback();
                });
            }
            if(component.node.children && component.node.children.length > 0) {
                exec(component.node.children);
            }else {
                if(component.view) {
                    create_xmlnode(component, exec);
                }else {
                    exec([]);
                }
            }
        }
        /**
         * @param {GoalsPage.GoalsComponent} component
         * @param {GoalsPage.GoalsView | GoalsPage.GoalsComponent} parent 
         */
        function component_set_proto(component, parent) {
            set_readonly(component, 'find', GoalsView_find);
            set_readonly(component, 'show', GoalsView_show);
            set_readonly(component, 'hide', GoalsView_hide);
            set_readonly(component, 'unload', GoalsView_unload);
            set_readonly(component, 'findComponentById', GoalsView_findComponentById);
            set_readonly(component, '__clearstyle__', clear_style);
            set_readonly(component, '__usespace__', {});
            set_readonly(component, '__parent__', parent);
            set_readonly(component, 'url', parent.url);
            var id, attr = component.node.attr;
            if(attr && attr.id) {
                id = attr.id;
                delete attr.id;
            }else {
                id = Goals.chaotic.encode('id' + Date.now());
            }
            set_readonly(component, 'id', id);
            parent.components.push(component);
        }

        /**
         * 初始化，建元素并开始对数据进行绑定
         * @param {GoalsPage.InstanceView} view 公开对象
         * @param {GoalsViewXMLNode} nodes 私有对象
         */
        function view_elem_init(view, nodes, callback) {
            // 此处为了配合`component.addSpace`方法
            var space = view.__space__ || {};
            var goalsIds = {};
            var buffer = view.data;
            view.data = {};
            if(view instanceof GoalsView) {
                Partial.cachedata = buffer;
            }
            set_readonly(view, '__nodes__', nodes);
            set_readonly(view, '__space__', space);
            set_readonly(view, '__buffer__', buffer);
            set_readonly(view, '__goalsids__', goalsIds);
            var has_component = false;// 是否加载过组件
            var execute_finish = false;// 是否加载所有标签已完成
            var execute_callback = false;// 是否已经执行过了回调方法
            // 先递归创建好Element元素并绑定表达式与页面元素的关系
            function elem_recursion_create_and_bind(nodes, parent) {
                for(var i = 0, node; node = nodes[i++];) {
                    // TODO 可以处理其他特殊标签
                    if(loadcomponents[node.tag]) {
                        has_component = true;
                        component_create(node, parent, view, component_leaded_callback);
                    }else {
                        elem_create_default(node, parent, goalsIds, space);
                        if(node.children) {
                            elem_recursion_create_and_bind(node.children, node.elem);
                        }
                    }
                }
            }
            elem_recursion_create_and_bind(nodes, view.document);
            execute_finish = true;
            function component_leaded_callback() {
                if(execute_callback) {
                    return;
                }
                if(!execute_finish) {
                    setTimeout(component_leaded_callback, 16);
                    return;
                }
                execute_callback = true;
                component_leaded_execute();
            }
            function component_leaded_execute() {
                if(view.components.length > 0) {
                    var child_space;
                    view.components.forEach(function(child) {
                        child_space = child.__space__;
                        // 将组件使用过的`data`属性且组件中没有的属性从上级中将值拷贝过去
                        for(var key in child_space) {
                            if(child.__buffer__[key] === undefined) {
                                child.__buffer__[key] = Goals.combine(Partial.cachedata[key]);
                                component_set_parent_usespace(child, key);
                            }
                        }
                        set_readonly(child, '__originaldata__', Goals.combine(child.__buffer__));
                        elem_bind_data(child);
                    });
                }
                
                // 如果是`GoalsView`（页面）对象，就直接初始化`data`相关操作了
                if(view instanceof GoalsView) {
                    set_readonly(view, '__originaldata__', Goals.combine(buffer));
                    // 再初始化一次所有表达式数据
                    for(var key in buffer) {
                        exec_replace_data(space[key], key, buffer, view.components);
                    }
                    elem_bind_data(view);
                    delete Partial.cachedata;
                    component_show(view.components);
                }else {
                    for(var key in buffer) {
                        exec_replace_data(space[key], key, buffer, null);
                    }
                }
                callback && callback();
            }
            if(!has_component) {
                component_leaded_callback();
            }
        }
        /**
         * @param {GoalsPage.InstanceComponent} component
         */
        function component_set_parent_usespace(component, key) {
            if(component instanceof GoalsViewComponent) {
                component.__usespace__[key] = HAS_USE_SPACE_ID;
                component_set_parent_usespace(component.__parent__, key);
            }
        }
        function component_show(components) {
            for(var i = 0, component; component = components[i++];) {
                component.onshow && component.onshow();
                component.showExecutor();
                if(component.components) {
                    component_show(component.components);
                }
            }
        }
        function elem_bind_data(view) {
            var buffer = view.__buffer__;
            var space = view.__space__;
            // 再绑定一下view的setData方法
            set_readonly(view, 'setData', function(data) {
                // 取得私有数据
                for(var key in data) {
                    buffer[key] = Goals.combine(data[key]);
                    exec_replace_data(space[key], key, buffer, view.components);
                }
            });
            // 最后再处理一下view的data的getter方法
            function data_getter(key) {
                Object.defineProperty(view.data, key, {
                    get: function() {
                        return Goals.combine(buffer[key]);
                    }
                });
            }
            for(var key in buffer) {
                data_getter(key);
            }
        }
        /**
         * 创建默认（标准`html`）元素
         * 
         * 对没有表达式的元素先进行设置属性与内容
         * 
         * 再对元素中含有表达式的属性与内容进行绑定
         * @param {GoalsViewXMLNode} node 当前的自定义`GoalsViewXMLNode`节点
         * @param {Element} parent 父级`Element`对象
         * @param {{string:GoalsViewXMLNode}} goalsIds `goals-id`表达式的存储空间
         * @param {GoalsViewSpace} space 表达式执行的存储空间
         */
        function elem_create_default(node, parent, goalsIds, space) {
            node.elem = document.createElement(node.tag);
            var attr = node.attr;
            if(attr) {
                for(var key in attr) {
                    Goals.assert(!key.match(Common.EXPRESSION_REG), 'The wrong "key" [' + key + ']');
                    if(!elem_bind_exps_attr(key, attr[key], node, goalsIds, space)) {
                        node.elem.setAttribute(key, attr[key]);
                    }
                }
            }
            if(node.text && !node.single) {
                // 对text转义，防止'XSS'攻击
//              node.text = node.text.replace(HTML_ESCAPE_REG, esc_fn);
                if(!elem_bind_exps_text(node.text, node, space)) {
                    node.elem.innerHTML =  node.text;
                }
            }
            parent.appendChild(node.elem);
        }
        /**
         * 绑定`GoalsViewXMLNode`的表达式属性，并返回是否有表达式存在标识
         * 
         * 如果该属性是关键词，则走对应的关键词处理，目前包含`goals-id`选择器处理
         * @param {string} attr 属性名，如`class`、`id`、`data-xxx`等...
         * @param {string} value 属性值
         * @param {GoalsViewXMLNode} node 自定义`GoalsViewXMLNode`节点
         * @param {{string:GoalsViewXMLNode}} goalsIds `goals-id`表达式的存储空间
         * @param {GoalsViewSpace} space 表达式执行的存储空间
         * @returns 如果属性中存在表达式，则返回`true`，如果没有表达式，则返回`false`
         */
        function elem_bind_exps_attr(attr, value, node, goalsIds, space) {
            var arr = value.match(Common.EXPRESSION_REG);
            if(arr && arr.length > 0) {
                Goals.assert(attr !== ELEMS_TEXT_ATTR, 'The [' + attr + '] is the attribute keyword, You cannot include expressions with it');
                Goals.assert(attr !== ELEMS_ATTR_GOALS_ID, 'The [' + attr + '] is the attribute keyword, You cannot include expressions with it');
                for(var i = 0; i < arr.length; i++) {
                    value = replace_expression(value, arr[i], BUFFER_EXPS.replace('{i}', i));
                    elem_parse_exps_and_bind_attr(attr, arr[i], node, space);
                }
                if(!node.attrExps) {
                    node.attrExps = {};
                }
                node.attrExps[attr] = value;
                return true;
            }
            if(attr === ELEMS_ATTR_GOALS_ID) {
                goalsIds[value] = node;
            }
            return false;
        }
        /**
         * 绑定`GoalsViewXMLNode`的表达式内容，并返回是否有表达式存在标识
         * @param {string} text 内容表达式
         * @param {GoalsViewXMLNode} node 自定义`GoalsViewXMLNode`节点
         * @param {GoalsViewSpace} space 表达式执行的存储空间
         * @returns 如果内容中存在表达式，则返回`true`，如果没有表达式，则返回`false`
         */
        function elem_bind_exps_text(text, node, space) {
            var arr = text.match(Common.EXPRESSION_REG);
            if(arr && arr.length > 0) {
                for(var i = 0; i < arr.length; i++) {
                    text = replace_expression(text, arr[i], BUFFER_EXPS.replace('{i}', i));
                    elem_parse_exps_and_bind_attr(ELEMS_TEXT_ATTR, arr[i], node, space);
                }
                node.textExps = text;
                return true;
            }
            return false;
        }
        /**
         * 解析表达式中的变量，并将变量与元素的属性或页面内容进行绑定
         * @param {string} attr 属性名，如`class`、`id`、`data-xxx`等...
         * @param {string} expression 表达式内容，具体的表达式，如：`data.name`、`hello`、`a == b ? c : b`等
         * @param {GoalsViewXMLNode} node 自定义`GoalsViewXMLNode`节点
         * @param {GoalsViewSpace} space 表达式执行的存储空间
         */
        function elem_parse_exps_and_bind_attr(attr, expression, node, space) {
            expression = elem_exps_remove_identify(expression);
            // 先提取表达式中的变量部分，去掉了所有的值，再将变量全部提取出来
            var __vars = elem_exps_extract_variable(expression, true);
            for(var i = 0, __var; __var = __vars[i++];) {
                // expression = replace_expression(expression, __var, BUFFER_DATA + '.' + __var);
            	__vars.archetype.forEach(function(r) {
            		if(r.indexOf(__var) > -1) {
                		expression = replace_expression(expression, r, BUFFER_DATA + '.' + r);
            		}
            	});
                // elem_change_array_access_to_variable_access(__var);
                elem_bind_exps_exec_func(attr, __var, node, space);
            }
            if(!node.exps) {
                node.exps = {};
            }
            if(!node.exps[attr]) {
                node.exps[attr] = [];
            }
            node.exps[attr].push(expression);
        }
        /**
         * 去除表达式的标识，比如表达式为`${aaa}`或者`${abc ? def : 'zi fu chuan'}`，去除后就是`aaa`或者`abc ? def : 'zi fu chuan'`
         * @param {string} expression 完整的表达式
         * @returns 去除标识后的表达式/变量
         */
        function elem_exps_remove_identify(expression) {
            return expression.substring(Common.EXPRESSION_LENGTH_START, expression.length - Common.EXPRESSION_LENGTH_END);
        }
        /**
         * 提取表达式中的变量部分，去掉了所有的值，将变量全部提取出来
         * @param {string} expression 表达式内容，具体的表达式，如：`data.name`、`hello`、`a == b ? c : b`等
         * @param {boolean} norepeat 是否去除重复变量
         * @returns {string[]} 表达式中包含的变量数组
         */
        function elem_exps_extract_variable(expression, norepeat) {
            var arr = expression.replace(REPLACE_STRING_REG, '').match(EXTRACT_VAR_REG);
            var archetype = [];
            for(var i = 0, r; r = arr[i++];) {
            	if(archetype.indexOf(r) == -1) {
            		archetype.push(r);
            	}
            }
            // split('.')[0]这一步时防止在表达式中直接写数组并做了其它操作，如arr[0] ? arr[0].key : ''或者obj ? obj.abc : ''，只保留arr[0]或者obj即可
            // 去除关键字
            if(norepeat) {
                var result = [];
                var __obj = {};
                for(var i = 0, r; r = arr[i++];) {
                    r = r.split('.')[0];
                    if(!JS_KEYWORD[r] && !__obj[r]) {
                        __obj[r] = 1;
                        result.push(r);
                    }
                }
                result.archetype = archetype;
                return result;
            }else {
                for(var i = arr.length - 1; i >= 0; i --) {
                    if(JS_KEYWORD[arr[i]]) {
                        arr.splice(i, 1);
                    }else {
                        arr[i] = arr[i].split('.')[0];
                    }
                }
                arr.archetype = archetype;
                return arr;
            }
        }
        /**
         * 绑定表达式中data的键（`key`）的执行方法
         * @param {string} attr 属性名，如`class`、`id`、`data-xxx`等...
         * @param {string} key 页面中使用表达式中的变量名，可以理解成页面`data`中的键（`key`）
         * @param {GoalsViewXMLNode} node 自定义`GoalsViewXMLNode`节点
         * @param {GoalsViewSpace} space 表达式执行的存储空间
         */
        function elem_bind_exps_exec_func(attr, key, node, space) {
            var index = key.indexOf('[');
            if(index > -1) {
                key = key.substring(0, index);
            }
            if(!space[key]) {
                space[key] = [];
            }
            var __obj = {node: node, attr: attr};
            if(attr === ELEMS_TEXT_ATTR) {
                __obj.textFunc = text_func;
            }else {
                __obj.attrFunc = attr_func;
            }
            space[key].push(__obj);
        }
        /**
         * 执行替换表达式
         * @param {GoalsViewSpace} onces 单个表达式的存储对象
         * @param {string} key 替换的键`key`
         * @param {object} data 完整的`data`
         * @param {GoalsPage.InstanceComponent[]?} components 标签对象数组
         */
        function exec_replace_data(onces, key, data, components) {
            if(onces && onces.length > 0) {
                for(var i = 0, r; r = onces[i++];) {
                    r.attrFunc && r.attrFunc(key, data);
                    r.textFunc && r.textFunc(key, data);
                }
            }
            if(components && components.length > 0) {
                for(var i = 0, r; r = components[i++];) {
                    if(r.__usespace__[key] === HAS_USE_SPACE_ID) {
                        var childdata = {};
                        childdata[key] = data[key];
                        r.setData(childdata);
                    }
                }
            }
        }
        function text_func(key, data) {
            // key暂时保留吧，注意，这里data是用上了的，在eval里面
            var node = this.node, exps = node.exps[this.attr], values = node.textExps;
            var __val;
            for(var i = 0; i < exps.length; i ++) {
                eval('var ' + BUFFER_DATA + ' = data;__val = (' + exps[i] + ');');
                // 这里是验证data中是否存在这个值，可以不需要，先暂时去掉吧
                // Goals.assert(__val !== undefined, 'The "' + exps[i] + '" not found');
                if(__val === undefined || __val === null) {
                    __val = '';
                }
                values = replace_expression(values, BUFFER_EXPS.replace('{i}', i), __val);
            }
            node.elem.innerText = values;
        }
        function attr_func(key, data) {
            // key暂时保留吧，注意，这里data是用上了的，在eval里面
            var node = this.node, attr = this.attr, exps = node.exps[attr], values = node.attrExps[attr];
            var __val;
            for(var i = 0; i < exps.length; i ++) {
                eval('var ' + BUFFER_DATA + ' = data;__val = (' + exps[i] + ')');
                // 这里是验证data中是否存在这个值，可以不需要，先暂时去掉吧
                // Goals.assert(__val !== undefined, 'The "' + exps[i] + '" not found');
                if(__val === undefined || __val === null) {
                    __val = '';
                }
                values = replace_expression(values, BUFFER_EXPS.replace('{i}', i), __val);
            }
            set_element_attribute(node.elem, attr, values);
        }
        /**
         * 设置`Element`对象的属性
         * @param {Element} elem 元素
         * @param {string} name 属性名
         * @param {string} value 属性值
         */
        function set_element_attribute(elem, name, value) {
            if(name === 'value') {
                elem.value = value;
            }else {
                elem.setAttribute(name, value);
            }
        }
        /** 递归替换所有字符 */
        function replace_expression_recursion(str, arg0, arg1, index) {
            var __index = str.indexOf(arg0, index);
            if(__index > -1) {
                if(str.substring(__index - 5, __index) == BUFFER_DATA + '.') {
                    return replace_expression_recursion(str, arg0, arg1, __index + arg1.length);
                }
                str = str.substring(0, __index) + arg1 + str.substring(__index + arg0.length);
                return replace_expression_recursion(str, arg0, arg1, __index + arg1.length);
            }
            return str;
        }
        /**
         * 替换字符串，替换所有符合规定的字符串，使用递归方式替换
         * @param {string} str 原始字符串
         * @param {string} arg0 被替换的内容
         * @param {string} arg1 替换成什么
         * @returns {string} 替换后的字符串 
         */
        function replace_expression(str, arg0, arg1) {
            return replace_expression_recursion(str, arg0, arg1, 0);
        }
        function esc_fn(key) {
            return HTML_ESCAPE[key];
        }

        COMPONENT_FUNCS.elem_exps_remove_identify = elem_exps_remove_identify;
        COMPONENT_FUNCS.elem_exps_extract_variable = elem_exps_extract_variable;
        COMPONENT_FUNCS.set_element_attribute = set_element_attribute;
        Partial.build_page = build_page;
        Goals.findViewByUrl = findViewByUrl;
        Goals.views = views;
    }());
    return Goals;
}));