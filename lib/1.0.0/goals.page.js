var GoalsView = function(jsonp, hash_info, elem, url) {
	this[0] = elem;
	this.javascript = [];
	this.css = [];
	this.receive = null;
	this.onload = function() {};
	this.onready = function() {};
	this.onunload = function() {};
	this.onshow = function() {};
	this.onhide = function() {};
	for(var k in jsonp) {
		this[k] = jsonp[k];
	}
	this.url = url;
	this.hash = hash_info.hash;
	this.receive = hash_info.params;
	this.notUseLanguage = jsonp.notUseLanguage === true ? true : false;
};
(function(doc, locat) {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : (function() {
		var __Goals = function() {
			this.prototype = new Object();
		}
		return new __Goals();
	})());
	if(!Goals.request) {
		throw new Error('You must import the \'goals.request\' package');
	}
	var pages = [];// 页面对象集合
	var scripts_name = [];// 页面所引用的script
	var assert = (Goals.utils && Goals.utils.assert)? Goals.utils.assert : function(judge, msg) {if(judge !== 0 && !judge) {throw new Error(msg);}};
	var common = Goals.common = (Goals.common || {});
	var req = Goals.request;
	var EXTRACT_VAR_REG = /[a-z_]\w*[\[\w*\]]*[.]{0,1}\w*(?!\w*\s*(\(|\"|\'))/ig;
	var EXTRACT_EXP_REG = /\${(.+?)}/g;// 表达式
	var EXTRACT_EXP_START_LENGTH = 2;// 表达式的开始标识符长度,此处是'${'
	var EXTRACT_EXP_END_LENGTH = 1;// 表达式的结束标识符长度,此处是'}'
	var REPLACE_STRING_REG = /(\").+?(\")|(\').+?(\')/g;
	var BUFFER_EXPS = '(exps{i})';// 在缓存中的表达式表示值,通过它可以快速的替换表达式的内容
	var ELEMS_TEXT_ATTR = 'GoalsText';// 在缓存中的元素文本内容的缓存键(key),此值为属性关键字,也就是就在html中,如果使用了表达式的元素属性,键不能为此值,否则抛出异常
	var BUFFER_DATA = 'data';// 使用eval取data值的时候,需要命名的变量名
	var ELEMS_ATTR_GOALS_ID = 'goals-id';
	var HASH_CHANGE_CUSTOM_LISTEN_DELAY = 16;// 没有hashchange监听的浏览器自己使用定时器的定时器间隔时间
	var HASH_CHANGE_PAUSE_DELAY = 17;// 暂停本次hashchange事件后,重新绑定的延迟时间
	
	/**
	 * 创建页面容器
	 */
	function create_page_elems() {
		var div = doc.createElement('div');
		div.className = 'goals-page';
		common.CONTAINER.appendChild(div);
		return div;
	}
	
	/**
	 * 解析hash中的地址和参数
	 * @return {Object} 返回对象,保护hash和params
	 */
	function parse_hash() {
		var hash = locat.hash;
		var index = hash.indexOf(common.HASH_DELIMITER);
		assert(index !== -1, "Incorrect 'hash' page path");
		hash = hash.substring(index + 1);
		var n_hash;
		if(common.HASH_ENCRYPT) {
			assert(Goals.chaotic, 'You must import the \'goals.chaotic\' package');
			n_hash = Goals.chaotic.decode(hash);
		}else {
			n_hash = hash;
		}
		var params_index = n_hash.indexOf('=');
		var url, params;
		if(params_index > -1) {
			url = n_hash.substring(0, params_index);
			params = n_hash.substring(params_index + 1);
		}else {
			url = n_hash;
		}
		if(params) {
			var type = 's';
			if(params.length > 2) {
				var _type = params.substring(0, 2);
				if(_type[1] === ':') {
					type = _type[0];
					params = params.substring(2);
				}
			}
			assert(type === 's' || type === 'o', 'No corresponding parameter resolution type was found [' + _type + '] in [' + params + ']');
			if(type === 'o') {
				params = JSON.parse(params);
			}
		}
		return {hash: hash, params: params};
	}
	
	/**
	 * 修改浏览器hash值
	 * @param {String} url 页面url
	 * @param {Object} params 参数
	 */
	function change_hash(url, params) {
		var hash = url;
		if(params) {
			if(typeof params === 'object') {
				hash = url + common.HASH_PARAMS_DELIMITER + 'o:' + encodeURIComponent(JSON.stringify(params));
			}else {
				hash = url + common.HASH_PARAMS_DELIMITER + 's:' + params;
			}
		}
		if(common.HASH_ENCRYPT) {
			assert(Goals.chaotic, 'You must import the \'goals.chaotic\' package');
			hash = Goals.chaotic.encode(hash);
		}
		hash = common.HASH_DELIMITER + hash;
		if(locat.hash !== ('#' + hash)) {
			locat.hash = hash;
		}
	}
	
	GoalsView.prototype.showExecutor = function() {
		this[0].style.display = 'block';
	}
	
	GoalsView.prototype.hideExecutor = function() {
		this[0].style.display = 'none';
	}
	
	/**
	 * 向GoalsView中写入部分不可变的方法
	 * @param {Object} _public GoalsView对象
	 */
	function set_goals_page_readonly_fn(_public) {
		set_readonly(_public, 'find', GoalsView_find);
		set_readonly(_public, 'show', GoalsView_show);
		set_readonly(_public, 'hide', GoalsView_hide);
		set_readonly(_public, 'reload', GoalsView_reload);
		set_readonly(_public, 'unload', GoalsView_unload);
		set_readonly(_public, 'getViewByUrl', GoalsView_getViewByUrl);
	}
	
	/**
	 * 查找页面上的dom,支持Goals选择器,id选择器,class选择器等,它内部是由querySelector实现的<br/>
	 * Goals选择器,是Goals自定义的一种选择器,在使用中建议使用Goals选择器,因为它是不存在耗时问题的.<br/>
	 * Goals选择器的元素在初始化后就已经存在,就想dom元素一样,它存在对象在,查找就相当于直接取值.<br/>
	 * @param {String} selector
	 */
	function GoalsView_find(selector) {
		if(selector.startsWith('g:')) {
			try{
				return get_private_by_public(this).goalsIds[selector.substring(2)].elem;
			}catch(e){
				return null;
			}
		}else if(selector.startsWith('#')) {
			return this[0].querySelector(selector);
		}else if(selector.startsWith('.')) {
			return this[0].querySelectorAll(selector);
		}
	}
	
	/**
	 * 显示当前页面
	 */
	function GoalsView_show() {
		var index = get_page_index_by_public(this);
		var page = pages[index];
		pages.splice(index, 1);
		pages.push(page);
		change_hash(page._public.hash);
		load_page_css(page._public, page._private);
		show_current_page(page);
	}
	
	/**
	 * 隐藏当前页面
	 */
	function GoalsView_hide() {
		this.onhide && this.onhide();
		this.hideExecutor();
	}
	
	/**
	 * 卸载当前页面
	 */
	function GoalsView_unload() {
		this.onunload && this.onunload();
		var index = get_page_index_by_public(this);
		var page = pages[index];
		pages.splice(index, 1);
		common.CONTAINER.removeChild(page._public[0]);
		page._public = null;
		page._private = null;
		pause_current_hash_change();
		pages[pages.length - 1]._public.show();
	}
	
	/**
	 * 重新加载当前页面的实现方法
	 */
	function GoalsView_reload() {
		this[0].innerHTML = '';
		var page = pages[get_page_index_by_public(this)];
		var _private = page._private;
		_private.space = {};
		_private.goalsIds = {};
		_private.data = Goals.combine(_private.cacheData);
		this.data = {};
		create_elems(_private.nodes, this, _private);
		load_page_css(this, _private);
		show_current_page(page);
		setTimeout(function() {
			page._public.onready();
		}, 500);
	}
	
	/**
	 * 根据url查找页面<br/>
	 * 如果找到了则返回页面对象,否则返回null
	 * @param {String} url
	 */
	function GoalsView_getViewByUrl(url) {
		var index = get_page_index_by_url(url);
		if(index > -1) {
			return pages[index]._public;
		}
		return null;
	}
	
	/**
	 * 根据页面url获取pages的index
	 * @param {String} url
	 * @return {Number} index
	 */
	function get_page_index_by_url(url) {
		for(var i = 0; i < pages.length; i ++) {
			if(url === pages[i]._public.url) {
				return i;
			}
		}
		return -1;
	}
	
	/**
	 * 根据页面公共对象获取pages的index
	 * @param {Object} _public
	 * @return {Number} index
	 */
	function get_page_index_by_public(_public) {
		for(var i = 0; i < pages.length; i ++) {
			if(_public === pages[i]._public) {
				return i;
			}
		}
	}
	
	/**
	 * 根据页面公共对象回去私有对象
	 * @param {Object} _public
	 * @return {Object} _private
	 */
	function get_private_by_public(_public) {
		try{
			return pages[get_page_index_by_public(_public)]._private;
		}catch(e){
			throw new Error('The invoked page has been unloaded');
		}
	}
	
	/**
	 * 获取页面js的内容
	 * @param {String} url 页面地址
	 * @param {Function} cb 回调方法
	 */
	function page_jsonp(url, hash_info, cb) {
		var index = get_page_index_by_url(url);
		// index不等于-1则页面已存在,直接reload即可
		if(index > -1) {
			var page = pages[index];
			pages.splice(index, 1);
			pages.push(page);
			page._public.reload();
		}else {
			// index等于-1则首次生成
			req.jsonp(parse_url(url), common.PAGE_CALLBACK_NAME, function(data) {
				data = new GoalsView(data, hash_info, create_page_elems(), url);
				set_goals_page_readonly_fn(data);
				data.onload();
				view_nodes(url, data.view, data.notUseLanguage, function(nodes, language) {
					cb(nodes, data, url, language);
				});
			});
		}
	}
	
	// 解析请求页面url
	function parse_url(url) {
		url += '.js';
		if(url.charAt(0) === '/') {
			return common.PROJECT_NAME + url;
		}else {
			return url;
		}
	}
	
	// 获取view所有节点
	function view_nodes(url, view, notUseLanguage, cb) {
		if(view) {
			if(view.startsWith('//')) {
				var url = window.location.href;
				if(url[4] === 's') {
					view_network_html("https:" + view, notUseLanguage, cb);
				}else {
					view_network_html("http:" + view, notUseLanguage, cb);
				}
			}else if(view.charAt(0) === '/') {
				view_network_html(common.PROJECT_NAME + view + '.html', notUseLanguage, cb);
			}else if(view.startsWith('http')) {
				view_network_html(view, notUseLanguage, cb);
			}else if(view.startsWith('../')) {
				view_network_html(view + '.html', notUseLanguage, cb);
			}else {
				if(!Goals.xml) {
					throw new Error("You must import the 'goals.xml' package");
				}
				cb(Goals.xml.parse(view));
			}
		}else {
			view_network_html(url + '.html', notUseLanguage, cb);
		}
	}
	
	// 获取网络view以及是语言包
	function view_network_html(url, notUseLanguage, cb) {
		var nodes, json, call_num = 0, load_num = 1;
		function call() {
			call_num ++;
			if(call_num === load_num) {
				cb(nodes, json);
			}
		}
		if(common.USE_LANGUAGE && !notUseLanguage) {
			assert(Goals.language, "You must import the 'goals.language' package");
			load_num = 2;
			req.ajax({
				url: url.substring(0, url.lastIndexOf('.')) + '.' + Goals.language.current() + '.json',
				resultType: 'json',
				success: function(res) {
					json = res;
					call();
				},
				error: function() {
					call();
				}
			});
		}
		req.ajax({
			url: url,
			resultType: 'xml',
			success: function(res) {
				nodes = res;
				call();
			}
		});
	}
	
	// 开始解析data和view
	function parse_all(nodes, jsonp, url, language) {
		var page = init_page(nodes, jsonp);
		page._public.language = language;
		create_elems(page._private.nodes, page._public, page._private);
		show_current_page(page);
		load_scripts(page._public, page._private);
	}
	
	/**
	 * 加载页面中需要的scripts,并对加载后做已加载标识
	 * @param {Object} _public
	 * @param {Object} _privete
	 */
	function load_scripts(_public, _privete) {
		var readynum = 0;
		function onready() {
			if(++readynum === 2) {
				_public.onready();
			}
		}
		export_script(_public, _privete, onready);
		onready();
	}
	
	function load_page_css(_public, _private) {
		if(_private.cssTags.length === 0) {
			_public.css.forEach(function(r) {
				var css = Goals.exportCss(r);
				_private.cssTags.push(css);
			});
		}
	}
	
	/**
	 * 显示当前页面,并将上一个页面隐藏
	 * @param {Object} page
	 */
	function show_current_page(page) {
		page._public.onshow && page._public.onshow();
		page._public.showExecutor();
		var length = pages.length;
		if(length > 1) {
			var previous_page = pages[length - 2];
			previous_page._public.onhide && previous_page._public.onhide();
			previous_page._private.clearCSS();
			previous_page._public.hideExecutor();
		}
	}
	
	/**
	 * 初始化页面栈
	 * @param {Object} data 页面的数据
	 */
	function init_page(nodes, jsonp) {
		var _private = {
			space: {},
			data: jsonp.data,
			goalsIds: {},
			cacheData: Goals.combine(jsonp.data),
			nodes: nodes,
			cssTags: [],
			clearCSS: function() {
				this.cssTags.forEach(function(r) {
					doc.head.removeChild(r);
				});
				this.cssTags = [];
			}
		};
		jsonp.data = {};
		var page = {_private: _private, _public: jsonp};
		pages.push(page);
		return page;
	}
	
	/**
	 * 导入页面的所有script
	 * @param {Object} _public GoalsView页面
	 * @param {Object} _private
	 * @param {Function} cb 完成导入后的回调
	 */
	function export_script(_public, _private, cb) {
		var scripts = _public.script;
		if(!_public.notImportDefaultCss) {
			var src = _public.url + '.css';
			_public.css.push(src);
			var css = Goals.exportCss(src);
			_private.cssTags.push(css);
		}
		if(scripts && scripts.forEach) {
			var js_all_num = 0, export_num = 0;
			function src_callback(script) {
				if(script) {
					doc.body.removeChild(script);
				}
				export_num ++;
				if(export_num === js_all_num) {
					cb();
				}
			}
			function export_js(src) {
				js_all_num ++;
				_public.javascript.push(src);
				if(scripts_name.indexOf(src) > -1) {
					src_callback();
				}else {
					scripts_name.push(src);
					if(src.startsWith('//')) {
						var url = window.location.href;
						if(url[4] === 's') {
							Goals.exportJs("https:" + src, src_callback);
						}else {
							Goals.exportJs("http:" + src, src_callback);
						}
					}else if(src.charAt(0) === '/') {
						Goals.exportJs(common.PROJECT_NAME + src, src_callback);
//					}else if(src.startsWith('http')) {
//						Goals.exportJs(src, src_callback);
//					}else if(src.startsWith('../')) {
//						Goals.exportJs(src, src_callback);
					}else {
						Goals.exportJs(src, src_callback);
					}
				}
			}
			function export_css(src) {
				if(src.startsWith('//')) {
					var url = window.location.href;
					if(url[4] === 's') {
						src = "https:" + src;
					}else {
						src = "http:" + src;
					}
				}else if(src.charAt(0) === '/') {
					src = common.PROJECT_NAME + src;
				}
				var css = Goals.exportCss(src);
				_public.css.push(src);
				_private.cssTags.push(css);
			}
			scripts.forEach(function(r) {
				if(r) {
					if(r.endsWith('.css')) {
						export_css(r);
					}else {
						export_js(r);
					}
				}
			});
			if(js_all_num === 0) {
				cb();
			}
		}else {
			cb();
		}
	}
	
	/**
	 * 创建元素并开始对数据进行绑定
	 * @param {Object} nodes 解析出的xml节点集合
	 * @param {Object} page 当前页面栈
	 */
	function create_elems(nodes, _public, _private) {
		
		/**
		 * 表达式全部替换
		 * @param {String} str 被替换的字符串
		 * @param {String} arg0 被替换的内容
		 * @param {String} arg1 替换的内容
		 * @param {Number} index 从第几个字符开始替换
		 */
		function replace_expression_default(str, arg0, arg1, index) {
			var _index = str.indexOf(arg0, index);
			if(_index > -1) {
				str = str.substring(0, _index) + arg1 + str.substring(_index + arg0.length);
//				str = str.replace(arg0, arg1);
				return replace_expression_default(str, arg0, arg1, _index + arg1.length);
			}else {
				return str;
			}
		}
		
		/**
		 * 表达式全部替换
		 * @param {String} str 被替换的字符串
		 * @param {String} arg0 被替换的内容
		 * @param {String} arg1 替换的内容
		 */
		function replace_expression(str, arg0, arg1) {
			return replace_expression_default(str, arg0, arg1, 0);
		}
		
		/**
		 * 创建元素
		 * @param {Object} r nodes中的某个节点
		 * @param {Object} parent 父级元素
		 */
		function create_elem(r, parent) {
			init_elem(r, _private.space);
			parent.appendChild(r.elem);
		}
		
		/**
		 * 初始化元素,对没有表达式的元素先进行设置属性与内容<br/>
		 * 再对元素中含有表达式的属性与内容进行绑定
		 * @param {Object} r nodes中的某个节点
		 * @param {Object} space 页面栈中的表达式执行空间,储存了所有表达式/变量的绑定
		 */
		function init_elem(r, space) {
			var elem = r.elem = doc.createElement(r.tag);
			var attr = r.attr;
			if(attr) {
				for(var k in attr) {
					assert(!k.match(EXTRACT_EXP_REG), "The wrong 'key' [" + k + "]");
					if(bind_attr_data(k, attr[k], r, space)) {
						elem.setAttribute(k, attr[k]);
					}
				}
			}
			if(r.text && !r.single) {
				if(bind_text_data(r.text, r, space)) {
					elem.innerHTML = r.text;
				}
			}
		}
		
		/**
		 * 绑定元素的属性
		 * @param {String} attr 属性键
		 * @param {String} val 属性值表达式
		 * @param {Object} r nodes中的某个节点
		 * @param {Object} space 页面栈中的表达式执行空间,储存了所有表达式/变量的绑定
		 */
		function bind_attr_data(attr, val, r, space) {
			var ms = val.match(EXTRACT_EXP_REG);
			if(ms) {
				assert(attr !== ELEMS_TEXT_ATTR, 'The [' + attr + '] is the attribute keyword, You cannot include expressions with it');
				assert(attr !== ELEMS_ATTR_GOALS_ID, 'The [' + attr + '] is the attribute keyword, You cannot include expressions with it');
				ms.forEach(function(e, i) {
					val = replace_expression(val, e, BUFFER_EXPS.replace('{i}', i));
					parse_exps_key(r, attr, e.substring(EXTRACT_EXP_START_LENGTH, e.length - EXTRACT_EXP_END_LENGTH), space);
				});
				if(!r.attrExps) {
					r.attrExps = {};
				}
				r.attrExps[attr] = val;
				return false;
			}
			if(attr === ELEMS_ATTR_GOALS_ID) {
				_private.goalsIds[val] = r;
			}
			return true;
		}
		
		/**
		 * 绑定元素的内容
		 * @param {String} text 内容表达式
		 * @param {Object} r nodes中的某个节点
		 * @param {Object} space 页面栈中的表达式执行空间,储存了所有表达式/变量的绑定
		 */
		function bind_text_data(text, r, space) {
			var ms = text.match(EXTRACT_EXP_REG);
			if(ms) {
				ms.forEach(function(e, i) {
					text = replace_expression(text, e, BUFFER_EXPS.replace('{i}', i));
					parse_exps_key(r, ELEMS_TEXT_ATTR, e.substring(EXTRACT_EXP_START_LENGTH, e.length - EXTRACT_EXP_END_LENGTH), space);
				});
				r.textExps = text;
				return false;
			}
			return true;
		}
		
		/**
		 * 解析表达式中的变量,并对变量与元素的属性或内容进行绑定
		 * @param {Object} r nodes中的某个节点
		 * @param {String} attr 元素的属性,本架构中元素的内容(text)也把它当成了一个属性,具体值为ELEMS_TEXT_ATTR
		 * @param {String} exps 表达式内容,此处的值应该是具体的表达式了,如:flag ? 'a' : b
		 * @param {Object} space 页面栈中的表达式执行空间,储存了所有表达式/变量的绑定
		 */
		function parse_exps_key(r, attr, exps, space) {
			var ckey = exps.replace(REPLACE_STRING_REG, '');
			var vars = ckey.match(EXTRACT_VAR_REG);
			var varsObj = {};
			// for循环中做了重复处理
			for(var i = 0; i < vars.length; i ++) {
				if(!varsObj[vars[i]]) {
					exps = replace_expression(exps, vars[i], BUFFER_DATA + '.' + vars[i]);
					varsObj[vars[i]] = 1;
					bind_exps_key(r, vars[i], attr, space);
				}
			}
			varsObj = null;
			// 最新的表达式,替换了原始的表达式
			if(!r.exps) {
				r.exps = {};
			}
			if(!r.exps[attr]) {
				r.exps[attr] = [];
			}
			r.exps[attr].push(exps);
		}
		
		/**
		 * 绑定表达式中data的键(key)的执行方法
		 * @param {Object} r nodes中的某个节点
		 * @param {String} key 页面中data的键(key)
		 * @param {Object} attr 元素的属性,本架构中元素的内容(text)也把它当成了一个属性,具体值为ELEMS_TEXT_ATTR
		 * @param {Object} space 页面栈中的表达式执行空间,储存了所有表达式/变量的绑定
		 */
		function bind_exps_key(r, key, attr, space) {
			if(!space[key]) {
				space[key] = [];
			}
			var obj = {r: r, attr: attr};
			if(attr === ELEMS_TEXT_ATTR) {
				obj.text_fn = text_fn;
			}else {
				obj.attr_fn = attr_fn;
			}
			space[key].push(obj);
		}
		
		/**
		 * 元素绑定属性的方法<br/>
		 * 执行此方法即可替换某个页面data键(key)对应元素对应的属性内容
		 * @param {String} key 页面data的键
		 * @param {Object} data 页面data
		 */
		function attr_fn(key, data) {
			var r = this.r, elem = r.elem, attr = this.attr, attrExps = r.attrExps, exps = r.exps;
			var thisExps = exps[attr];
			var values = attrExps[attr];
			var val;
			for(var i = 0; i < thisExps.length; i++) {
				eval('var ' + BUFFER_DATA + ' = data;val=(' + thisExps[i] + ')');
				// TODO 此处暂时去掉空验证.改为空字符
//				assert(val !== undefined, "The '" + thisExps[i] + "' not found");
				if(val === undefined || val === null) {
					val = '';
				}
				values = replace_expression(values, BUFFER_EXPS.replace('{i}', i), val);
			}
			if(attr === 'value') {
				elem.value = values;
			}else {
				elem.setAttribute(attr, values);
			}
		}
		
		/**
		 * 元素绑定内容(文本)的方法<br/>
		 * 执行此方法即可替换某个页面data键(key)对应元素对应的内容(文本)
		 * @param {String} key 页面data的键
		 * @param {Object} data 页面data
		 */
		function text_fn(key, data) {
			var r = this.r, elem = r.elem, attr = this.attr, exps = r.exps;
			var thisExps = exps[attr];
			var values = r.textExps;
			var val;
			for(var i = 0; i < thisExps.length; i++) {
				eval('var ' + BUFFER_DATA + ' = data;val=(' + thisExps[i] + ')');
				// TODO 此处暂时去掉空验证.改为空字符
//				assert(val !== undefined, "The '" + thisExps[i] + "' not found");
				if(val === undefined || val === null) {
					val = '';
				}
				values = replace_expression(values, BUFFER_EXPS.replace('{i}', i), val);
			}
			elem.innerHTML = values;
		}
		
		/**
		 * 执行绑定的方法
		 * @param {Object} space 页面栈中的表达式执行空间,储存了所有表达式/变量的绑定
		 * @param {Object} key 页面data的某个键(key)
		 * @param {Object} data 页面data
		 */
		function run_fn(space, key, data) {
			space[key] && space[key].forEach(function(r) {
				r.attr_fn && r.attr_fn(key, data);
				r.text_fn && r.text_fn(key, data);
			});
		}
		
		/**
		 * 初始化执行所有数据绑定的方法,初始化数据
		 * @param {Object} space 页面栈中的表达式执行空间,储存了所有表达式/变量的绑定
		 * @param {Object} data 页面data
		 */
		function init_run(space, data) {
			for(var k in space) {
				run_fn(space, k, data);
			}
		}
		
		/**
		 * 循环创建所有元素,此方法是初始创建方法
		 * @param {Object} arr 所有节点
		 * @param {Object} parent 父元素
		 */
		function each_create_elem(arr, parent) {
			arr.forEach(function(r) {
				if(r.tag === "for") {
					// TODO
//					bind_for_fn(r, parent);
				}else {
					create_elem(r, parent);
					if(r.children) {
						each_create_elem(r.children, r.elem);
					}
				}
			});
		}
		
		/**
		 * 初始化绑定页面data修改data值时直接触发页面的修改
		 * @param {Object} space 页面栈中的表达式执行空间,储存了所有表达式/变量的绑定
		 * @param {Object} buffer 页面栈page中的缓存值
		 * @param {Object} data 页面data值
		 */
		function bind_data(space, buffer, data) {
			function bind(k) {
				Object.defineProperty(data, k, {
					set: function(val) {
						set_data_run(k, val, buffer);
					},
					get: function() {
						var res = buffer[k];
						if(typeof res === 'object') {
							return JSON.parse(JSON.stringify(res));
						}
						return res;
					}
				});
			}
			for(var k in buffer) {
				bind(k);
			}
		}
		
		/**
		 * 调用页面data设置值时候触发的方法,它会自动去判断应该修改什么东西
		 * @param {String} key 修改的键
		 * @param {Object} val 修改的内容
		 * @param {Object} buffer 页面栈page中的缓存值,用于做匹配判断,如果没有进行修改的值,不进行修改
		 */
		function set_data_run(key, val, buffer) {
			if(Object.prototype.toString.call(val) === '[object Object]') {
				set_object_run(key, val, get_object(buffer, key));
			}else if(Object.prototype.toString.call(val) === '[object Array]') {
				set_array_run(key, val, get_array(buffer, key));
			}else {
				if(buffer[key] !== val) {
					buffer[key] = val;
					run_fn(_private.space, key, buffer);
				}
			}
		}
		
		/**
		 * 设置对象值,支持多层对象与数组,调用页面data设置值时候触发的方法,它会自动去判断应该修改什么东西
		 * @param {String} key 修改的键
		 * @param {Object} val 修改的内容
		 * @param {Object} bufval 页面栈page中的缓存值,用于做匹配判断,如果没有进行修改的值,不进行修改
		 */
		function set_object_run(key, val, bufval) {
			var r;
			for(var k in val) {
				r = val[k];
				if(Object.prototype.toString.call(r) === '[object Object]') {
					set_object_run(key + '.' + k, r, get_object(bufval, k));
				}else if(Object.prototype.toString.call(r) === '[object Array]') {
					set_array_run(key + '.' + k, r, get_array(bufval, k));
				}else {
					if(bufval[k] !== r) {
						bufval[k] = r;
						run_fn(_private.space, key + '.' + k, _private.data);
					}
				}
			}
		}
		
		/**
		 * 设置数组值,支持多层对象与数组,调用页面data设置值时候触发的方法,它会自动去判断应该修改什么东西
		 * @param {String} key 修改的键
		 * @param {Object} val 修改的内容
		 * @param {Object} bufval 页面栈page中的缓存值,用于做匹配判断,如果没有进行修改的值,不进行修改
		 */
		function set_array_run(key, val, bufval) {
			for(var i = 0, r; i < val.length; i ++) {
				r = val[i];
				if(Object.prototype.toString.call(r) === '[object Object]') {
					set_object_run(key + '[' + i + ']', r, get_object(bufval, i));
				}else if(Object.prototype.toString.call(r) === '[object Array]') {
					set_array_run(key + '[' + i + ']', r, get_array(bufval, i));
				}else {
					if(bufval[i] !== r) {
						bufval[i] = r;
						run_fn(_private.space, key + '[' + i + ']', _private.data);
					}
				}
			}
		}
		
		/**
		 * 获取Object,如果为空则会创建
		 * @param {Object} buffer 对象
		 * @param {String} key 键
		 */
		function get_object(buffer, key) {
			if(!buffer[key]) {
				buffer[key] = {};
			}
			return buffer[key];
		}
		
		/**
		 * 获取Array,如果为空则会创建
		 * @param {Array} buffer 数组
		 * @param {String} key 下标
		 */
		function get_array(buffer, i) {
			if(!buffer[i]) {
				buffer[i] = [];
			}
			return buffer[i];
		}
		/**
		 * 绑定页面的setData方法实现
		 * @param {Object} jsthis 页面js对象
		 * @param {Object} buffer 页面栈page中的缓存值
		 */
		function bind_set_data(jsthis, buffer) {
			/**
			 * 将两个对象的属性合并,没有的属性值为空字符串
			 * @param {Object} val 被合并的对象
			 * @param {Object} buf 包含有属性的对象
			 */
			function set_object_undefined_val(val, buf) {
				for(var k in buf) {
					if(Object.prototype.toString.call(buf[k]) === '[object Object]') {
						set_object_undefined_val(get_object(val, k), buf[k]);
					}else if(Object.prototype.toString.call(buf[k]) === '[object Array]') {
						set_array_undefined_val(get_array(val, k), buf[k]);
					}else {
						if(val[k] === undefined) {
							val[k] = '';
						}
					}
				}
			}
			/**
			 * 将两个数组的属性合并,没有的属性值为空字符串
			 * @param {Object} val 被合并的数组
			 * @param {Object} buf 包含有属性的数组
			 */
			function set_array_undefined_val(val, buf) {
				for(var i = 0; i < buf.length; i ++) {
					if(Object.prototype.toString.call(buf[i]) === '[object Object]') {
						set_object_undefined_val(get_object(val, i), buf[i]);
					}else if(Object.prototype.toString.call(buf[i]) === '[object Array]') {
						set_array_undefined_val(get_array(val, i), buf[i]);
					}else {
						if(val[i] === undefined) {
							val[i] = '';
						}
					}
				}
			}
			/**
			 * 页面setData方法的实现
			 * @param {Object} obj 传入的对象
			 */
			jsthis.setData = function(obj) {
				var val, buf;
				for(var key in obj) {
					val = obj[key];
					buf = buffer[key];
					if(Object.prototype.toString.call(buf) === '[object Object]') {
//						assert(Object.prototype.toString.call(val) === '[object Object]',
//							'[' + key + '] value you write is of a different type than the original value');
						set_object_undefined_val(val, buf);
					}else if(Object.prototype.toString.call(buf) === '[object Array]') {
//						assert(Object.prototype.toString.call(val) === '[object Array]',
//							'[' + key + '] value you write is of a different type than the original value');
						set_array_undefined_val(val, buf);
					}
					set_data_run(key, val, buffer);
				}
			}
		}
		// 开始创建页面element
		each_create_elem(nodes, _public[0]);
		// 开始初始化所有表达式数据
		init_run(_private.space, _private.data);
		// 绑定页面js中直接this.data.属性直接赋值的触发
		bind_data(_private.space, _private.data, _public.data);
		// 绑定页面js的setData方法实现
		bind_set_data(_public, _private.data);
	}
	/**
	 * 向对象写入只读属性
	 * @param {Object} obj 对象
	 * @param {String} key 对象的属性名
	 * @param {Object} val 对象的属性值
	 */
	function set_readonly(obj, key, val) {
		if(val != undefined) {
			Object.defineProperty(obj, key, {
				writable: false,
				configurable: false,
				enumerable: false,
				value: val
			});
		}
	}
	/**
	 * 浏览器的hashchange监听
	 * @param {String} hash 传入的hash值
	 */
	function hash_change(hash) {
		var index = hash.indexOf(common.HASH_DELIMITER);
		assert(index !== -1, 'Invalid request address [' + hash + ']');
		hash = hash.substring(index + 1);
		if(common.HASH_ENCRYPT) {
			hash = Goals.chaotic.decode(hash);
		}
		index = hash.indexOf(common.HASH_PARAMS_DELIMITER);
		if(index > -1) {
			var type = hash.substring(index + 1, index + 3);
			if(type === 's:' || type === 'o:') {
				hash = hash.substring(0, index + 1) + hash.substring(index + 3);
			}
		}
		Goals.open(hash);
	}
	/**
	 * 清除浏览器的hashchange监听
	 */
	function clear_hash_change() {
		Goals.onhashchange = null;
	}
	/**
	 * 绑定浏览器的hashchange监听
	 */
	function bind_hash_change() {
		Goals.onhashchange = hash_change;
	}
	/**
	 * 暂停本次hashchange的监听<br/>
	 * 一般用于显示页面时,不需要重新打开页面.
	 */
	function pause_current_hash_change() {
		clear_hash_change();
		setTimeout(bind_hash_change, HASH_CHANGE_PAUSE_DELAY);
	}
	;(function() {
		var CURRENT_URL;
		function on_hash_change() {
			Goals.onhashchange && Goals.onhashchange(locat.hash);
		}
		function run_listen_hash_change() {
			if(('onhashchange' in window) && (typeof doc.documentMode === 'undefined' || doc.documentMode == 8)) {
				window.onhashchange = on_hash_change;
			}else {
				var hash = '';
				setInterval(function() {
					if(hash !== locat.hash) {
						hash = locat.hash;
						on_hash_change();
					}
				}, HASH_CHANGE_CUSTOM_LISTEN_DELAY);
			}
			bind_hash_change();
		}
		function params_check(par) {
			assert(par.page, 'Please pass in the parameter [obj.page]');
		}
		function params_merge(par) {
			var default_params = {
				container: doc.body,
				pageCallbackName: 'GoalsPage',
				debug: false,
				hashDelimiter: '!',
				hashParamsDelimiter: '=',
				hashEncrypt: false,
				useLanguage: false
			};
			for(var k in par) {
				default_params[k] = par[k];
			}
			return default_params;
		}
		function common_set(opt) {
			set_readonly(common, 'PROJECT_NAME', opt.project || '');
			set_readonly(common, 'PROJECT_SERVER_NAME', opt.server || '');
			set_readonly(common, 'PAGE_CALLBACK_NAME', opt.pageCallbackName);
			set_readonly(common, 'CONTAINER', opt.container);
			set_readonly(common, 'DEBUG', opt.debug);
			set_readonly(common, 'HASH_DELIMITER', opt.hashDelimiter);
			set_readonly(common, 'HASH_PARAMS_DELIMITER', opt.hashParamsDelimiter);
			set_readonly(common, 'HASH_ENCRYPT', opt.hashEncrypt);
			set_readonly(common, 'USE_LANGUAGE', opt.useLanguage);
		}
		function open_page(page) {
			var hash = locat.hash;
			if(hash) {
				var index = hash.indexOf(common.HASH_DELIMITER);
				if(index > -1) {
					page = hash.substring(index + 1);
					if(common.HASH_ENCRYPT) {
						page = Goals.chaotic.decode(page);
					}
					index = page.indexOf(common.HASH_PARAMS_DELIMITER);
					if(index > -1) {
						var type = page.substring(index + 1, index + 3);
						if(type === 's:' || type === 'o:') {
							page = page.substring(0, index + 1) + page.substring(index + 3);
						}
					}
				}
			}
			Goals.open(page);
		}
		Goals.combine = function(source, target) {
			if(!source) return;
			if(!target) {
				if(Object.prototype.toString.call(source) === '[object Object]') {
					target = {};
				}else {
					target = [];
				}
			}
			for(let r in source) {
				if(typeof source[r] == "object") {
					target[r] = Goals.combine(source[r], target[r]);
				}else {
					target[r] = source[r];
				}
			};
			return target;
		}
		Goals.exportJs = function(src, callback) {
			if(!src) {
				throw new Error("the 'src' is undefined");
			}
			let script = doc.createElement("script");
			script.type = "text/javascript";
			if(script.readyState) {
				script.onreadystatechange = function() {
					if(script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						callback && callback(script);
					}
				};
			}else {
				script.onload = function() {
					callback && callback(script);
				}
			}
			script.src = src;
			doc.body.appendChild(script);
			return script;
		}
		Goals.exportCss = function(src) {
			var link = doc.createElement("link");
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("type", "text/css");
			link.setAttribute("href", src);
			doc.head.appendChild(link);
			return link;
		}
		Goals.open = function(url, params) {
			var index = url.indexOf('=');
			if(index > -1) {
				params = url.substring(index + 1);
				url = url.substring(0, index);
			}
			CURRENT_URL = url;
			pause_current_hash_change();
			change_hash(url, params);
			var hash_info = parse_hash();
			page_jsonp(url, hash_info, parse_all);
		}
		Goals.currentUrl = function() {
			return CURRENT_URL;
		}
		Goals.init = function(opt) {
			params_check(opt);
			opt = params_merge(opt);
			common_set(opt);
			open_page(opt.page);
		}
		run_listen_hash_change();
	}());
}(document, window.location));
