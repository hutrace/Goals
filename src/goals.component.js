/**
 * list组件，该组件对表达式做了限制，不管有没有自定义表达式，list组件中使用表达式都必须是`${}`，list组件中不支持嵌套组件
 * 
 * 每次更新`list`组件的`data`属性对应的值时，组件都会重新生成`html`，包括组件中使用到的其它属性（`data`中的）
 * 
 * 为了防止组件中使用了很多其它`data`属性，而在页面`setData`时会执行多次的重新生成`html`，
 * 组件在执行时，使用`setTimeout`异步执行，并给定了延迟，如果在延迟时间内又进入执行的，则会清除之前的执行，
 * 重新生成异步延迟执行，默认延迟了`50ms`，可以通过在组件上定义`delay`属性来指定
 */
GoalsComponent('list', {
    /** 页面的data属性 */
    data: {},
    /** 引用的`html`文件或者`html`字符串 */
    view: '',
    /** 你可以在这里放置需要引用的js/css文件路径，支持网络路径、绝对路径、相对路径 */
    script: [],
    /** 页面显示的回调 */
    oncreate: function(util) {
        var self = this;
        // 校验属性，必须存在data属性，可存在item属性，item属性默认为item
        var attr = dispose_attr(self.node.attr);
        Goals.assert(attr && attr.data, 'The "list" component must have the "data" attribute');
        
        // 先获取当前组件下的html字符串
        var html = self.node.inner();
        // 再清空或删除node属性中的children属性
        self.node.children = [];
        // 获取页面的data
        var viewdata = get_view_object(self).__buffer__;

        var spacefn = [{textFunc: execfn}];
        var variables = get_self_global_variables(html);
        var varstext = get_vartext_and_add_space_all();

        var timeout;
        function execfn() {
            if(timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(timerfn, attr.delay);
        }
        function timerfn() {
            var __list = viewdata[attr.data];
            var __html = '', __html_item;
            for(var i = 0, r; r = __list[i++];) {
                eval(varstext + 'var ' + attr.item + '=r;__html_item=`' + html + '`');
                __html += __html_item;
            }
            self.document.innerHTML = __html;
        }
        function get_vartext_and_add_space_all() {
            var variablestext = '';
            for(var i = 0, k; k = variables[i++];) {
                variablestext += 'var ' + k + '=viewdata.' + k + ';'
                self.addSpace(k, spacefn);
                self.addUsespace(k);
            }
            self.addUsespace(attr.data);
            self.addSpace(attr.data, spacefn);
            return variablestext;
        }
        /**
         * @param {object} attr 
         * @returns {{data:string,item:string,delay:number}}
         */
        function dispose_attr(attr) {
            var newAttr = {};
            newAttr.data = attr.data;
            newAttr.item = 'item';
            newAttr.delay = 50;
            if(attr.item) {
                newAttr.item = attr.item;
                delete attr.item;
            }
            if(attr.delay) {
                newAttr.delay = parseInt(attr.delay);
                delete attr.delay;
            }
            delete attr.data;
            // 设置其他属性
            for(var name in attr) {
                util.set_element_attribute(self.document, name, attr[name]);
            }
            return newAttr;
        }
        /**
         * 获取当前组件下所有使用的过的`data`全局属性
         * @param {string} html 页面字符串
         */
        function get_self_global_variables(html) {
            var Common = Goals.common;
            var arr = html.match(Common.EXPRESSION_REG);
            var __obj = {}, once, variables = [];
            __obj[attr.item] = 1;
            for(var i = 0, r; r = arr[i++];) {
                r = util.elem_exps_remove_identify(r);
                once = util.elem_exps_extract_variable(r);
                for(var j = 0, e; e = once[j++];) {
                    if(!__obj[e]) {
                        __obj[e] = 1;
                        variables.push(e);
                    }
                }
            }
            return variables;
        }
        /**
         * 获取页面对象
         * @param {GoalsPage.GoalsComponent} component 
         */
        function get_view_object(component) {
            var parent = component.__parent__;
            if(parent instanceof GoalsView) {
                return parent;
            }else {
                return get_view_object(parent);
            }
        }
    }
});

GoalsComponent('paging', {
    data: {
        __list__: []
    },
    /**
     * 组件支持的属性
     * @type {GoalsComponentPaging.Attr}
     */
    property: {},
    /**
     * 组件的代码块内容，需要执行的代码
     * @type {string}
     */
    code: null,
    /**
     * 组件内部动态数据展示区域`Element`对象
     * @type {JQuery<Element>}
     */
    body: null,
    /**
     * 提示区域元素`Element`对象
     * @type {JQuery<Element>}
     */
    hint: null,
    /**
     * 按钮区域父级元素`Element`对象
     * @type {JQuery<Element>}
     */
    paging: null,
    /**
     * 当前内容的数组
     * @type {string[]}
     */
    contents: null,
    /**
     * @type {object}
     */
    bufferdata: null,
    /**
     * 绑定事件的对象，对象格式为
     * ```json
     * {
     *    "原生事件": {
     *        "事件名称加事件方法": "事件方法"
     *    }
     * }
     * ```
     * @type {object}
     */
    events: null,
    /**
     * 当前查询出的数据
     * @type {object}
     */
    pagingdata: null,
    customProperty: {
        /**
         * 默认请求服务端使用的`ajax`方法
         */
        ajax: 'Goals.request.ajax'
    },
    oncreate: function(util) {
        var self = this;
        var attr = self.node.attr;
        dispose_attr(self.property, attr);
        // 校验属性
        Goals.assert(self.property.url, 'The "list" component must have the "data" attribute');
        parse_text(self.node.text);
        parse_event();
        bind_event();
        bind_paging();
        /**
         * 处理属性
         * @param {GoalsComponentPaging.Attr} property 
         * @param {object} attr 
         */
        function dispose_attr(property, attr) {
            dispose('url', attr.url);
            dispose('method', 'get');
            dispose('orderby', null);
            dispose('sort', null);
            dispose('start', 0, 'int');
            dispose('size', 20, 'int');
            dispose('params', {}, 'qs');
            dispose('listkey', 'list');
            dispose('countkey', 'count');
            dispose('maxnum', 5, 'int');
            dispose('searchform', null);
            dispose('searchbtn', null);
            dispose('resetbtn', null);
            dispose('changesize', true, 'json');
            dispose('sizeoptions', [20, 50, 100], 'json');
            dispose('ajax', self.customProperty.ajax);
            if(property.sizeoptions.indexOf(property.size) == -1) {
                property.sizeoptions.push(property.size);
            }
            property.sizeoptions.sort(function(a, b) {return a - b;});
            // 设置其他属性
            for(var name in attr) {
                util.set_element_attribute(self.document, name, attr[name]);
            }
            function dispose(key, value, type) {
                if(attr[key]) {
                    if(type == 'qs') {
                        property[key] = parse_qs(attr[key]);
                    }else if(type == 'int') {
                        property[key] = parseInt(attr[key]);
                    }else if(type == 'json') {
                        property[key] = JSON.parse(attr[key]);
                    }else {
                        property[key] = attr[key];
                    }
                    delete attr[key];
                }else {
                    property[key] = value;
                }
            }
            /** @param {string} str */
            function parse_qs(str) {
                var arr = str.split('&');
                var obj = {}, once;
                for(var i = 0, r; r = arr[i++];) {
                    once = r.split('=');
                    obj[once[0]] = once[1];
                }
                return obj;
            }
        }
        /** @param {string} text */
        function parse_text(text) {
            text = text.replace(/&lt;/g, '<').trim();
            var code = '';
            if(text[0] === '{') {
                // 解析得到code
                var level = 0;
                for(var i = 1, r; r = text[i++];) {
                    if(r === '}') {
                        if(level === 0) {
                            text = text.substring(i).trim();
                            code = code.trim();
                            break;
                        }
                        level--;
                        code += r;
                    }else{
                        if(r === '{') {
                            level++;
                        }
                        code += r;
                    }
                }
            }
            parse_event(Goals.xml.parse(code));
            var lines = text.split('\n');
            var line;
            var items;
            var tdhtml = '';
            var colhtml = '';
            var contents = [];
            var width;
            for(var i = 0; i < lines.length; i++) {
                line = lines[i].trim();
                if(line === '') {
                    continue;
                }
                items = line.split(':');
                Goals.assert(items.length === 3, 'The content line of this component is format as "width:title:content",' +
                    ' split with a colon. If there are other colons in the "content", please write in the code block.\r\n' + line);
                tdhtml += '<td>' + items[1].trim() + '</td>';
                width = items[0].trim();
                if(width) {
                    colhtml += '<col style="width: ' + items[0].trim() + ';"/>';
                }
                contents.push('<td>' + items[2].trim() + '</td>');
            }
            var headhtml = '<div class="table-container table-container-head"><table>' + colhtml + '<thead><tr>' + tdhtml + '</tr></thead></table></div>';
            var bodyhtml = '<div class="table-container table-container-body"><table>' + colhtml + '<tbody></tbody></table><div class="paging-hint"></div></div>';
            var pagehtml = '<div class="paging-infos"></div>';
            self.document.innerHTML = headhtml + bodyhtml + pagehtml;
            self.code = code;
            self.body = $(self.document.querySelector('tbody'));
            self.hint = $(self.document.querySelector('.paging-hint'));
            self.paging = $(self.document.querySelector('.paging-infos'));
            self.contents = contents;
        }
        function parse_event(ns) {
            var node;
            var events = self.events || {};
            var attr, event, clazs;
            var flag;
            if(ns) {
                parse(ns);
            }else {
                self.contents.forEach(function(r, i) {
                    node = Goals.xml.parse(r)[0];
                    if(node.children && node.children.length > 0) {
                        flag = false;
                        parse(node.children);
                        if(flag) {
                            self.contents[i] = node.outer();
                        }
                    }
                });
            }
            self.events = events;
            /** @param {XMLNode[]} nodes */
            function parse(nodes) {
                for(var i = 0, r; r = nodes[i++];) {
                    attr = r.attr;
                    if(attr) {
                        for(var key in attr) {
                            if(key.substring(0, 6) == 'event-') {
                                event = key.substring(6);
                                clazs = key + '-' + attr[key].toLowerCase();
                                if(attr['class']) {
                                    attr['class'] += ' ' + clazs;
                                }else {
                                    attr['class'] = clazs;
                                }
                                attr['data-index'] = '${index}';
                                if(!events[event]) {
                                    events[event] = {};
                                }
                                events[event][clazs] = attr[key];
                                delete attr[key];
                                flag = true;
                            }
                        }
                    }
                    if(r.children && r.children.length > 0) {
                        parse(r.children);
                    }
                }
            }
        }
        function bind_event() {
            var obj;
            var view = self.getView(self);
            for(var event in self.events) {
                obj = self.events[event];
                for(var clazs in obj) {
                    bind(event, '.' + clazs, obj[clazs]);
                }
            }
            /**
             * @param {string} event 
             * @param {string} clazs 
             */
            function bind(event, clazs, fn) {
                Goals.assert(view[fn], 'The "' + fn + '" method was not found on the page');
                self.body.on(event, clazs, function() {
                    var index = parseInt(this.getAttribute('data-index'));
                    view[fn](this, self.pagingdata[index], index, self.pagingdata);
                });
            }
        }
        function bind_paging() {
            var property = self.property;
            if(property.changesize) {
                self.paging.on('focus', '.paging-select', function() {
                    var selectops = $(this).children('.paging-selectopts');
                    selectops.css({display: 'block'});
                    selectops.height(selectops.attr('data-h'));
                });
                self.paging.on('blur', '.paging-select', function() {
                    var selectops = $(this).children('.paging-selectopts');
                    selectops.height(0);
                    setTimeout(function() {
                        selectops.css({display: 'none'});
                    }, 200);
                });
                self.paging.on('click', '.paging-selectopt', function() {
                    var $this = $(this);
                    if(!$this.hasClass('paging-selectopt-selected')) {
                        var currentnum = property.start / property.size;
                        var count = parseInt($this.parent().attr('data-count'));
                        property.size = parseInt($this.text().trim());
                        property.start = currentnum * property.size;
                        if(property.start >= count) {
                            var yu = count % property.size;
                            if(yu == 0) {
                                property.start = count - property.size;
                            }else {
                                property.start = Math.floor(count / property.size) * property.size;
                            }
                        }
                        self.loading();
                        self.load(null);
                    }
                });
            }
            self.paging.on('input', '.paging-input', function() {
                var btn = self.paging.children('.paging-btn-sure');
                var val = parseInt(this.value);
                var max = parseInt(btn.attr('data-total'));
                if(val > max) {
                    val = max;
                    this.value = val;
                }else if(val < 1) {
                    val = 1;
                    this.value = val;
                }
                btn.attr('pagenum', val);
            });
            self.paging.on('click', '.paging-primary', function() {
                var pagenum = parseInt(this.getAttribute('pagenum'));
                property.start = (pagenum - 1) * property.size;
                self.loading();
                self.load(null);
            });
        }
    },
    loading: function() {
        this.hint.show();
        this.hint.html('加载数据中，请稍后...');
        this.body.html('');
    },
    onshow: function() {
        var self = this;
        var property = self.property;
        var view = self.getView(self);
        if(property.searchform && property.searchbtn) {
            view.find('g:' + property.searchbtn).addEventListener('click', function() {
                var data = get_form_data(view.find('g:' + property.searchform));
                self.exec(data);
            });
        }
        if(property.resetbtn) {
            view.find('g:' + property.resetbtn).addEventListener('click', function() {
                clear_form_data(view.find('g:' + property.searchform));
                self.exec({});
            });
        }

        clear_form_data(view.find('g:' + property.searchform));
        self.exec({});

        /**
         * @param {HTMLElement} form 
         */
        function clear_form_data(form) {
            var inputs = form.querySelectorAll('input');
            var selects = form.querySelectorAll('select');
            set_form(inputs, property.params);
            set_form(selects, property.params);
        }
        /**
         * @param {NodeListOf<HTMLInputElement|HTMLSelectElement>} elems 
         */
        function set_form(elems, data) {
            var name, value;
            for(var i = 0, r; r = elems[i++];) {
                name = r.getAttribute('name');
                if(name) {
                    value = data[name];
                    r.value = value == undefined ? '' : value;
                }
            }
        }
        /**
         * @param {HTMLElement} form 
         * @returns {object}
         */
        function get_form_data(form) {
            var inputs = form.querySelectorAll('input');
            var selects = form.querySelectorAll('select');
            var result = {};
            set_form_elems_data(inputs, result);
            set_form_elems_data(selects, result);
            return result;
        }
        /**
         * @param {NodeListOf<HTMLInputElement|HTMLSelectElement>} elems 
         */
        function set_form_elems_data(elems, data) {
            var name;
            if(elems.length > 0) {
                for(var i = 0, r; r = elems[i++];) {
                    name = r.getAttribute('name');
                    if(name) {
                        data[name] = r.value;
                    }
                }
            }
        }
    },
    /**
     * 获取页面对象
     * @param {GoalsPage.GoalsComponent} component 
     */
    getView: function(component) {
        if(!component) {
            component = this;
        }
        var parent = component.__parent__;
        if(parent instanceof GoalsView) {
            return parent;
        }else {
            this.getView(parent);
        }
    },
    exec: function(params) {
        this.loading();
        this.bufferdata = params;
        this.load(this.mergeData(params));
    },
    load: function(params) {
        var self = this;
        var property = self.property;
        var ajax = Goals.request.ajax;
        eval('ajax = ' + property.ajax);
        if(params == null) {
            params = self.mergeData(self.bufferdata);
        }
        ajax({
            url: property.url,
            type: property.method,
            data: params,
            success: function(res) {
                var list = eval('res.data.' + property.listkey);
                var count = eval('res.data.' + property.countkey);
                // 表示查询数据时，传入的pageStart大于等于了总条数，可能是删除了最后一页的最后一条数据而reload导致
                if(property.start != 0 && property.start >= count) {
                    var yu = count % property.size;
                    if(yu == 0) {
                        property.start = count - property.size;
                    }else {
                        property.start = Math.floor(count / property.size) * property.size;
                    }
                    self.load(null);
                }else {
                    self.setcontent(list);
                    self.setpaging(count);
                    setTimeout(function() {
                        self.hint.hide();
                    }, 100);
                }
            }
        });
    },
    mergeData: function(params) {
        var property = this.property;
        var data = {};
        if(property.orderby) {
            data.orderby = property.orderby;
        }
        if(property.sort) {
            data.sort = property.sort;
        }
        if(property.params) {
            for(var key in property.params) {
                data[key] = property.params[key];
            }
        }
        if(params) {
            for(var key in params) {
                data[key] = params[key];
            }
        }
        data.pageStart = property.start;
        data.pageSize = property.size;
        return data;
    },
    setcontent: function(arr) {
        var self = this;
        var __html__ = '';
        var item;
        for(var i = 0; i < arr.length; i++) {
            item = arr[i];
            eval('var index = ' + i + ';' + self.code + ';__html__+=`<tr>' + self.contents.join('') + '</tr>`');
        }
        self.body.html(__html__);
        self.pagingdata = arr;
    },
    setpaging: function(count) {
        var property = this.property;
        var html = '';
        var size = property.size;
        var maxnum = property.maxnum;
        // 总页数
        var totalnum = Math.ceil(count / size);
        // 当前处理第几页
        var currentnum = count == 0 ? 0 : property.start / size + 1;
        var forstart = 0;
        var forend = 0;
        if(totalnum > maxnum) {
            // 总页数大于需要显示的页数，需要给定去多少页的按钮与功能实现
            var centernum = Math.ceil(maxnum / 2);
            var othernum = Math.floor(maxnum / 2);
            if(centernum >= currentnum) {
                forstart = 1;
                forend = maxnum;
            }else {
                var endnum = currentnum + othernum;
                if(endnum > totalnum) {
                    forend = totalnum;
                    forstart = totalnum - maxnum + 1;
                }else {
                    forstart = currentnum - othernum;
                    forend = endnum;
                }
            }
        }else {
            forstart = 1;
            forend = totalnum;
        }
        if(currentnum == 1) {
            html += '<div class="paging-item paging-disabled"><i class="fa fa-angle-left"></i></div>';
        }else {
            html += '<div class="paging-item paging-primary" pagenum="' + (currentnum - 1) + '"><i class="fa fa-angle-left"></i></div>';
        }
        for( ; forstart <= forend; forstart++) {
            if(forstart == currentnum) {
                html += '<div class="paging-item paging-left-none paging-primary paging-selected" pagenum="' + forstart + '">' + forstart + '</div>';
            }else {
                html += '<div class="paging-item paging-left-none paging-primary" pagenum="' + forstart + '">' + forstart + '</div>';
            }
        }
        if(currentnum == totalnum) {
            html += '<div class="paging-item paging-left-none paging-disabled"><i class="fa fa-angle-right"></i></div>';
        }else {
            html += '<div class="paging-item paging-left-none paging-primary" pagenum="' + (currentnum + 1) + '"><i class="fa fa-angle-right"></i></div>';
        }
        if(property.changesize) {
            html += '<div class="paging-item paging-text">每页显示：</div>';
            var sizeopts = property.sizeoptions;
            var optshtml = '';
            var height = sizeopts.length * 28 + 2;
            for(var i = 0; i < sizeopts.length; i++) {
                if(sizeopts[i] == size) {
                    optshtml += '<div class="paging-selectopt paging-selectopt-selected">' + sizeopts[i] + '</div>';
                }else {
                    optshtml += '<div class="paging-selectopt">' + sizeopts[i] + '</div>';
                }
            }
            html += '<div class="paging-item paging-select" tabindex="0">' + size;
            html += '<div class="paging-selectopts" data-h="' + height + '" data-count="' + count + '">' + optshtml + '</div></div>';
        }
        html += '<div class="paging-item paging-text"><span class="paging-highlight">' + currentnum + '</span>/';
        html += '<span class="paging-highlight">' + totalnum + '</span>';
        html += '，共<span class="paging-highlight">' + count + '</span>条记录</div>';
        if(totalnum > maxnum) {
            html += '<div class="paging-item paging-text">去第</div>';
            html += '<input class="paging-item paging-input" type="number"/>';
            html += '<div class="paging-item paging-input-text">页</div>';
            html += '<div class="paging-item paging-primary paging-btn-sure" data-total="' + totalnum + '">确定</div>';
        }
        this.paging.html(html);
    }
});

/**
 * html组件事项，html组件不会生成多余元素
 * 需要注意，该组件会清空该组件父级元素下的所有内容，然后将value对应的data值赋予父级元素的innerHTML
 */
GoalsComponent('html', {
    data: {},
    oncreate: function() {
        var key = this.node.attr.value;
        var pelem = this.document.parentNode;
        var viewdata = get_view_object(this).__buffer__;
        this.addUsespace(key);
        this.addSpace(key, [{textFunc: function() {
            pelem.innerHTML = viewdata[key];
        }}]);
        function get_view_object(component) {
            var parent = component.__parent__;
            if(parent instanceof GoalsView) {
                return parent;
            }else {
                return get_view_object(parent);
            }
        }
    }
});
