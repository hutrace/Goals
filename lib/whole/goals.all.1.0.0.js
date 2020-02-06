/**
 * V1.0.0
 * 
 * 此包中对Goals的所有基本包进行了整合，避免在使用时引用多个js导致效率过低的问题。
 * 整合仅包含基本包
 * |—— compatibility
 * |—— xml
 * |—— request
 * |—— chaotic
 * |—— utils
 * |—— page
 * |—— session
 * |—— storage
 * |—— language
 * |—— security
 */

// TODO GoalsCompatibility
;(function() {
	/**
	 * 去掉字符串前后的空格
	 */
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}
	/**
	 * 判断字符串是否已传入的参数字符串开头的
	 * @param {String} str参数字符串
	 */
	String.prototype.startsWith = function(str) {
		var reg = new RegExp("^" + str);
		return reg.test(this);
	}
	/**
	 * 判断字符串是否已传入的参数字符串结尾的
	 * @param {String} str参数字符串
	 */
	String.prototype.endsWith = function(str) {
		var reg = new RegExp(str + "$");
		return reg.test(this);
	}
	/**
	 * 数组的indexOf方法<br/>
	 * 此方法使用的匹配条件是"==",而非"==="<br/>
	 * 也就是说可以判断对象是否是同一个.
	 * @param {Object} val
	 */
	Array.prototype.indexOf = function(val) {
		for (let i = 0; i < this.length; i++) {
			if (this[i] == val) return i;
		}
		return -1;
	};
	/**
	 * 定义数组的删除方法
	 * @param {Object} val
	 */
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if(index > -1) {
			this.splice(index, 1);
			return true;
		}
		return false;
	};
	/**
	 * 根据数组下标删除数据.
	 * @param {Number} index
	 */
	Array.prototype.removeByInex = function(index) {
		this.splice(index, 1);
	};
}());
// TODO GoalsXml
;(function() {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	var xml = Goals.xml = (Goals.xml || {});
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
					_node = {tag_text: str_buffer.join(""), single: false};
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
		var start = new Date().getTime();
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
}());
// TODO GoalsRequest
;(function(doc) {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	var req = Goals.request = (Goals.request || {});
	var jsonpLoadingList = {};
	
	var dataResolver = {
		'json': function(text) {
			return JSON.parse(text);
		},
		'qs': function(text) {
			
		},
		'xml': function(text) {
			if(!Goals.xml) {
				throw new Error("You must import the 'goals.xml' package");
			}
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
		if(opt.type === 'GET') {
			opt.uri = opt.url + (opt.url.indexOf('?') > -1 ? '&' : '?') + object_2_qs(opt.data);
			opt.reqData = null;
		}else {
			if(opt.parseData) {
				var content_type = opt.headers['Content-Type'];
				if(content_type) {
					if(content_type.indexOf('application/x-www-form-urlencoded') > -1) {
						opt.reqData = object_2_qs(opt.data);
					}else if(content_type.indexOf('application/json') > -1) {
							var data = typeof opt.data === 'object' ? JSON.stringify(opt.data) : opt.data;
							opt.reqData = data ? new Blob([data], {type: 'application/json'}) : null;
					}else {
						throw new Error("Instead of looking for a parameter resolver of the current '" + content_type + "' type, " +
							"you can pass in 'parseData' with a value of 'false' and decompose your request parameters yourself.");
					}
				}
			}
		}
	}
	
	req.ajax = function(opt) {
		opt = ajax_merge_params(opt);
		var xmlhr;
		if(window.XMLHttpRequest) {
			xmlhr = new XMLHttpRequest();
		}else {
			xmlhr = new ActiveXObject('Microsoft.XMLHTTP');
		}
		if(opt.timeout) {
			xmlhr.timeout = opt.timeout;
			xmlhr.ontimeout = opt.error;
		}
		xmlhr.onerror = opt.error;
		xmlhr.onreadystatechange = function() {
			if(xmlhr.readyState === 4) {
				if(xmlhr.status === 200) {
					var data;
					if(opt.resultType) {
						var resolver = dataResolver[opt.resultType];
						if(!resolver) {
							throw new Error("No response data parser of type '" + opt.resultType + "' was found");
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
					opt.success && opt.success(data, xmlhr);
				}else {
					opt.error(xmlhr);
				}
			}
		}
		parse_ajax_data(opt);
		xmlhr.open(opt.type, opt.uri || opt.url, opt.anysc);
		for(var k in opt.headers) {
			xmlhr.setRequestHeader(k, opt.headers[k]);
		}
		xmlhr.send(opt.reqData !== undefined ? opt.reqData : opt.data);
	}
	
	req.jsonp = function(url, callbackName, okFn, errFn, timeout) {
		var _url = url;
		if(jsonpLoadingList[_url] !== undefined) {
			throw new Error("Currently 'rui' is loading");
		}
		jsonpLoadingList[_url] = '';
		url = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + callbackName;
		var script = document.createElement('script');
		doc.body.appendChild(script);
		window[callbackName] = function(json) {
			clear(script);
			okFn && okFn(json);
		};
		var timerFn;
		if(timeout) {
			timerFn = setTimeout(function() {
				clear(script);
			}, timeout);
		}
		script.onerror = function(e) {
			clear(script);
			errFn && errFn(e);
		}
		function clear(scr) {
			if(timerFn) {
				clearTimeout(timerFn);
			}
			delete window[callbackName];
			delete jsonpLoadingList[_url];
			doc.body.removeChild(scr);
		}
		script.src = url;
	}
	
	req.setAjaxDataResolver = function(contentType, fn) {
		dataResolver[contentType] = fn;
	}
}(document));
// TODO GoalsChaotic
(function() {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	var chaotic = Goals.chaotic = (Goals.chaotic || {});
	var CHAR_TRANSITION = "ZXCVBNMASDFGHJKLqwertyuiop012345",
		HEXADECIMAL = "0123456789abcdef",
		SPLIT = "QWERTYUIOPasdfghjklzxcvbnm6789",
		REG_SPLIT = /Q|W|E|R|T|Y|U|I|O|P|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m|6|7|8|9/g,
		DEFAULT_COMPLEXITY = 0;
	/**
	 * 字符串转Unicode
	 * @param {String} str - 字符串
	 */
	function str_to_unicode(str) {
		var arr = [];
		var hexadecimal;
		for(var i = 0; i < str.length; i++) {
			hexadecimal = parseInt(str.charCodeAt(i), 10).toString(16);
			hexadecimal = transition_for_char(hexadecimal);
			arr.push(hexadecimal);
			arr.push(random_split());
		}
		return arr.join("");
	}
	/**
	 * Unicode字符串转字符串
	 * @param {String} str - Unicode字符串
	 */
	var unicode_to_str = function(str) {
		var _str = str.replace(REG_SPLIT, ",");
		var arr = _str.split(",");
		var _char = "";
		var resp = [];
		var flag = false;
		for(var i = 0; i < arr.length; i ++) {
			if(arr[i] !== '') {
				_char = restore_for_char(arr[i]);
				resp.push(String.fromCharCode(parseInt(_char, 16).toString(10)));
			}
		}
		return resp.join("");
	}
	/**
	 * 根据CHAR_TRANSITION转换字符
	 * @param {String} _char
	 */
	var transition_for_char = function(_char) {
		var index, random;
		var resp = "";
		for(var i = 0, r; r = _char[i++];) {
			index = HEXADECIMAL.indexOf(r);
			if(index > -1) {
				random = Math.floor(Math.random() * 10 + 1) % 2;
				resp += CHAR_TRANSITION[index + (random * 16)];
			}
		}
		return resp;
	}
	/**
	 * 根据CHAR_TRANSITION还原字符
	 * @param {String} _char
	 */
	var restore_for_char = function(_char) {
		var _resp = "";
		for(var i = 0, r; r = _char.charAt(i++);) {
			_resp += HEXADECIMAL[CHAR_TRANSITION.indexOf(r) % 16]
		}
		return _resp;
	}
	/**
	 * 将分割符随机转换成SPLIT
	 */
	var random_split = function() {
		return SPLIT[Math.floor(Math.random() * 30)];
	}
	/**
	 * 将字符串的奇数位于偶数位提取拼接
	 * @param {String} str
	 */
	var sort_str = function(str) {
		var odd = "";//基数位
		var even = "";//偶数位
		for(var i = str.length - 1, r; r = str[i--];) {
			if(i%2 == 0) {
				even += r;
			}else {
				odd += r;
			}
		}
		return odd + even;
	}
	/**
	 * 把被提取奇数位与偶数位拼接的字符串还原
	 * @param {String} str
	 */
	var restore_sort_str = function(str) {
		var splitIndex = str.length/2;
		var str1 = str.substring(0, splitIndex);
		var str2 = str.substring(splitIndex);
		var resp = [];
		for(var i = str1.length - 1, r, e; r = str1[i], e = str2[i]; i--) {
			resp.push(r);
			resp.push(e);
		}
		return resp.join("");
	}
	chaotic.encode = function(str) {
		var unicode = str_to_unicode(str);
		for(var i = 0; i < DEFAULT_COMPLEXITY; i ++) {
			unicode = sort_str(unicode);
		}
		return unicode;
	}
	chaotic.decode = function(str) {
		for(var i = 0; i < DEFAULT_COMPLEXITY; i ++) {
			str = restore_sort_str(str);
		}
		return unicode_to_str(str);
	}
}());
// TODO GoalsUtils
;(function(doc) {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	if(!Goals.utils) {
		Goals.utils = {};
	}
	Goals.utils.assert = function(judge, msg) {
		if(judge !== 0 && !judge) {
			throw new Error(msg);
		}
	};
	Goals.utils.getURIParameter = function(name) {
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) {
			return unescape(r[2]);
		}
		return null;
	};
	Goals.utils.isNull = function(arg) {return Object.prototype.toString.call(arg) === '[object Null]'};
	Goals.utils.isUndefined = function(arg) {return Object.prototype.toString.call(arg) === '[object Undefined]'};
	Goals.utils.isString = function(arg) {return Object.prototype.toString.call(arg) === '[object String]'};
	Goals.utils.isNumber = function(arg) {return Object.prototype.toString.call(arg) === '[object Number]'};
	Goals.utils.isBoolean = function(arg) {return Object.prototype.toString.call(arg) === '[object Boolean]'};
	Goals.utils.isFunction = function(arg) {return Object.prototype.toString.call(arg) === '[object Function]'};
	Goals.utils.isDate = function(arg) {return Object.prototype.toString.call(arg) === '[object Date]'};
	Goals.utils.isArray = function(arg) {return Object.prototype.toString.call(arg) === '[object Array]'};
	Goals.utils.isObject = function(arg) {return Object.prototype.toString.call(arg) === '[object Object]'};
	Goals.utils.isRegExp = function(arg) {return Object.prototype.toString.call(arg) === '[object RegExp]'};

	Goals.utils.dateFormat = function(date, format) {
		if(!date) {
			return '';
		}
		if(this.isString(date)) {
			date = new Date(date.replace(/-/g, '/'));
		}else if(this.isNumber(date)) {
			date = new Date(date);
		}
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if(/(y+)/.test(format)){
			format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
	    return format;  
	};
	(function() {
		function get_dom_value(el, obj) {
			[].forEach.call(el, function(r) {
				var key = r.getAttribute('name');
				if(key) {
					obj[key] = r.value.trim();
				}
			});
		}
		function set_dom_value(el, obj) {
			[].forEach.call(el, function(r) {
				var key = r.getAttribute('name');
				if(key) {
					r.value = obj[key] || '';
				}
			});
		}
		Goals.utils.getTagNameData = function(el) {
			var result = {};
			var inputs = el.querySelectorAll('input');
			var selects = el.querySelectorAll('select');
			var textareas = el.querySelectorAll('textarea');
			get_dom_value(inputs, result);
			get_dom_value(selects, result);
			get_dom_value(textareas, result);
			return result;
		}
		Goals.utils.setTagNameData = function(el, data) {
			if(!data) {
				data = {};
			}
			var inputs = el.querySelectorAll('input');
			var selects = el.querySelectorAll('select');
			var textareas = el.querySelectorAll('textarea');
			set_dom_value(inputs, data);
			set_dom_value(selects, data);
			set_dom_value(textareas, data);
		}
	}());
	Goals.utils.event = function() {
		if(document.all) {
			return window.event;
		}
		var func = Goals.utils.event.caller;
		while(func != null){
			var arg0 = func.arguments[0];
			if(arg0) {
				if((arg0.constructor == Event || arg0.constructor == MouseEvent) 
					|| (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
					return arg0;
				}
			}
			func = func.caller;
		}
		return null;
	};
	Goals.utils.on = function(selector, bubbling, event, fn) {
		var type;
		if(bubbling[0] == ".") {
			bubbling = bubbling.substring(1);
			type = 1;
		}else if(bubbling[0] == "#") {
			bubbling = bubbling.substring(1);
			type = 2;
		}else {
			type = 3;
		}
		selector.addEventListener(event, function(e) {
			e = e || tool.event();
			var path = e.path;
			if(path) {
				var isEvent = false;
				var index = 0;
				for(var i = 0, item; item = path[i++];) {
					try {
						if(type === 1 && item.classList.contains(bubbling)) {
							isEvent = true;
							index = i - 1;
							break;
						}else if(type === 2 && item.id === bubbling) {
							isEvent = true;
							index = i - 1;
							break;
						}else if(type === 3&& item.tagName === bubbling) {
							isEvent = true;
							index = i - 1;
							break;
						}
					} catch (e) {}
				}
				if(isEvent) {
					fn(path[index]);
				}
			}else {
				var target = e.target || e.srcElement;
				while(target !== this){
					if([].indexOf.call(this.querySelectorAll(bubbling), target) !== -1){
						fn(target);
						break;
					}
					target = target.parentNode;
				}
			}
		});
	};
	Goals.utils.hover = function(selector, inFn, outFn) {
		var hover_flag = false;
		selector.addEventListener('mouseover', function(e) {
			if(!hover_flag) {
				hover_flag = true;
				inFn && inFn();
			}
		});
		selector.addEventListener('mouseleave', function(e) {
			hover_flag = false;
			outFn && outFn();
		});
	};
	Goals.utils.bindCheckbox = function(elem, pelem, clazs) {
		Goals.utils.assert($, "You must import the 'jQuery' package");
		var $elem = $(elem);
		var $pelem = $(pelem);
		var flag;
		$elem.unbind().click(function() {
			flag = $(this).is(':checked');
			if(flag) {
				$pelem.find(clazs).prop("checked", true);
			}else {
				$pelem.find(clazs).prop("checked", false);
			}
		});
		var length;
		$pelem.on("click", clazs, function() {
			var checkedLength = 0;
			var $clazs = $pelem.find(clazs);
			length = $clazs.length;
			for(var i = 0; i < length; i++) {
				if($($clazs[i]).is(':checked')) 
					checkedLength += 1;
			}
			if(checkedLength == length) {
				$elem.prop("checked", true);
			}else {
				$elem.prop("checked", false);
			}
		});
	};
	Goals.utils.getCheckedElems = function(pelem, clazs) {
		Goals.utils.assert($, "You must import the 'jQuery' package");
		var $selectors = $(pelem).find(clazs);
		var result = [];
		for(var i = 0; i < $selectors.length; i++) {
			if($($selectors[i]).is(':checked')) {
				result.push($selectors[i]);
			}
		}
		return result;
	};
	Goals.utils.getCheckedIndexs = function(pelem, clazs) {
		Goals.utils.assert($, "You must import the 'jQuery' package");
		var $selectors = $(pelem).find(clazs);
		var result = [];
		for(var i = 0; i < $selectors.length; i++) {
			if($($selectors[i]).is(':checked')) {
				result.push(i);
			}
		}
		return result;
	};
	(function() {
		var pulldown_buffer = [];
		function has(inputElems) {
			for(var i = 0, r; r = pulldown_buffer[i++];) {
				if(r.inputElems == inputElems) {
					return r;
				}
			}
			return null;
		}
		function pulldown_merge(inputElems, settings) {
			if(!settings) {
				settings = {};
			}
			var default_params = {
				top: inputElems.offsetTop + inputElems.offsetHeight,
				left: inputElems.offsetLeft,
				width: inputElems.offsetWidth,
				maxHeight: 300,
				nullValueShow: false,
				highlight: true,
				bottomHTML: null,
				/**
				 * 当查询多个字段时,显示的各个字段连接符
				 */
				joint: ' --> ',
				/**
				 * 光标移出的回调,可以接收data值,如果存在,则是选中,否则是直接移出.
				 */
				blurFn: function(data) {},
				focusFn: function() {},
				keyupFn: function(e) {}
			};
			for(var k in settings) {
				default_params[k] = settings[k];
			}
			return default_params;
		}
		function pulldown_create_content(result_elem, settings) {
			var content = doc.createElement('div');
			content.className = 'pulldown-result-content';
			result_elem.appendChild(content);
			return content;
		}
		function pulldown_create_bottom(result_elem, settings) {
			if(settings.bottomHTML) {
				
			}
		}
		function create_data(data, val, highlight) {
			if(highlight) {
				data = data.replace(new RegExp(val, 'gm'), '<span style="color:red">' + val + '</span>');
			}
			return '<span>' + data + '</span>';
		}
		function pulldown_search(val, result_elem, content_elem, dataArray, searchFields, settings) {
			if(settings.nullValueShow || val != '') {
				var items = [];
				var item;
				var flag;
				dataArray.forEach(function(r, i) {
					item = [];
					flag = false;
					searchFields.forEach(function(e) {
						if(r[e].indexOf(val) > -1) {
							item.push(create_data(r[e], val, settings.highlight));
							flag = true;
						}else {
							item.push(create_data(r[e], val, false));
						}
					});
					if(flag > 0) {
						items.push('<div class="pulldown-item" index="' + i + '">' + item.join(settings.joint) + '</div>');
					}
				});
				var html = items.join('');
				content_elem.innerHTML = html;
				result_elem.style.display = 'block';
			}else {
				content_elem.innerHTML = '';
				result_elem.style.display = 'none';
			}
		}
		function bind(inputElems, dataArray, searchFields, settings) {
			var obj = {
				inputElems: inputElems,
				dataArray: dataArray,
				searchFields: searchFields,
				settings: settings
			};
			pulldown_buffer.push(obj);
			settings = pulldown_merge(inputElems, settings);
			var pulldown = inputElems.parentNode;
			var pulldown_result = pulldown.querySelector('.pulldown-result');
			pulldown_result.style.left = settings.left + 'px';
			pulldown_result.style.top = settings.top + 'px';
			pulldown_result.style.width = settings.width + 'px';
			pulldown_result.style.maxHeight = settings.maxHeight + 'px';
			var content = pulldown_create_content(pulldown_result, settings);
			function search(val) {
				pulldown_search(val, pulldown_result, content, obj.dataArray, obj.searchFields, settings);
			}
			var $inputElems = $(inputElems);
			$inputElems.unbind();
			$inputElems.focus(function() {
				settings.focusFn();
				search(this.value);
			});
			$inputElems.keyup(function(e) {
				search(this.value);
				e = e || Goals.utils.event();
				settings.keyupFn(e);
			});
			var timer;
			$inputElems.blur(function() {
				timer = setTimeout(function() {
					settings.blurFn();
					pulldown_result.style.display = 'none';
				}, 300);
			});
			$(content).off().on('click', '.pulldown-item', function() {
				clearTimeout(timer);
				var index = parseInt(this.getAttribute('index'));
				settings.blurFn(obj.dataArray[index]);
				pulldown_result.style.display = 'none';
			});
		}
		Goals.utils.pulldown = function(inputElems, dataArray, searchFields, settings) {
			Goals.utils.assert($, "You must import the 'jQuery' package");
			var pulldown_obj = has(inputElems);
			if(pulldown_obj) {
				pulldown_obj.dataArray = dataArray;
				pulldown_obj.searchFields = searchFields;
			}else {
				bind(inputElems, dataArray, searchFields, settings);
			}
		};
	}());
}(document));
// TODO GoalsPage/GoalsView
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
// TODO session
;(function() {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	if(!Goals.chaotic) {
		throw new Error("You must import the 'goals.chaotic' package");
	}
	if(!Goals.session) {
		Goals.session = {};
	}
	Goals.session.add = function(name, value) {
		if(value === null || value === undefined) {
			value = "null";
		}
		if(typeof value === "object") {
			value = "1" + JSON.stringify(value);
		}else {
			value = "0" + value;
		}
		value = Goals.chaotic.encode(value);
		sessionStorage.setItem(name, value);
	}
	Goals.session.get = function(name) {
		var value = sessionStorage.getItem(name);
		if(value === null || value === undefined || value === "null") {
			return null;
		}
		value = Goals.chaotic.decode(value);
		var isobject = parseInt(value.substring(0, 1));
		value = value.substring(1);
		if(isobject) {
			return JSON.parse(value);
		}else {
			return value;
		}
	}
	Goals.session.remove = function(name) {
		sessionStorage.removeItem(name);
	}
	Goals.session.clear = function() {
		sessionStorage.clear();
	}
}());
// TODO storage 
;(function() {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	if(!Goals.chaotic) {
		throw new Error("You must import the 'goals.chaotic' package");
	}
	if(!Goals.storage) {
		Goals.storage = {};
	}
	Goals.storage.add = function(name, value) {
		if(value === null || value === undefined) {
			value = "null";
		}
		if(typeof value === "object") {
			value = "1" + JSON.stringify(value);
		}else {
			value = "0" + value;
		}
		value = Goals.chaotic.encode(value);
		localStorage.setItem(name, value);
	}
	Goals.storage.get = function(name) {
		var value = localStorage.getItem(name);
		if(value === null || value === undefined || value === "null") {
			return null;
		}
		value = Goals.chaotic.decode(value);
		var isobject = parseInt(value.substring(0, 1));
		value = value.substring(1);
		if(isobject) {
			return JSON.parse(value);
		}else {
			return value;
		}
	}
	Goals.storage.remove = function(name) {
		localStorage.removeItem(name);
	}
	Goals.storage.clear = function() {
		localStorage.clear();
	}
}());
// TODO language 
;(function() {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	if(!Goals.language) {
		Goals.language = {};
	}
	if(!Goals.storage) {
		throw new Error("You must import the 'goals.storage' package");
	}
	var storage = Goals.storage;
	function storage_key() {
		return Goals.common.PROJECT_SERVER_NAME + '_language';
	}
	Goals.language.current = function() {
		return storage.get(storage_key()) || navigator.language || navigator.userLanguage;
	}
	Goals.language.set = function(language) {
		storage.add(storage_key(), language);
	}
}());
// TODO GoalsSecurity
;(function() {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	if(!Goals.request) {
		throw new Error("You must import the 'goals.request' package");
	}
	if(!Goals.session) {
		throw new Error("You must import the 'goals.session' package");
	}
	if(!Goals.security) {
		Goals.security = {};
	}
}());
!function(t,n){"object"==typeof exports?module.exports=exports=n():"function"==typeof define&&define.amd?define([],n):t.CryptoJS=n()}(this,function(){var t=t||function(t,n){var i=Object.create||function(){function t(){}return function(n){var i;return t.prototype=n,i=new t,t.prototype=null,i}}(),e={},r=e.lib={},o=r.Base=function(){return{extend:function(t){var n=i(this);return t&&n.mixIn(t),n.hasOwnProperty("init")&&this.init!==n.init||(n.init=function(){n.$super.init.apply(this,arguments)}),n.init.prototype=n,n.$super=this,n},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var n in t)t.hasOwnProperty(n)&&(this[n]=t[n]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),s=r.WordArray=o.extend({init:function(t,i){t=this.words=t||[],i!=n?this.sigBytes=i:this.sigBytes=4*t.length},toString:function(t){return(t||c).stringify(this)},concat:function(t){var n=this.words,i=t.words,e=this.sigBytes,r=t.sigBytes;if(this.clamp(),e%4)for(var o=0;o<r;o++){var s=i[o>>>2]>>>24-o%4*8&255;n[e+o>>>2]|=s<<24-(e+o)%4*8}else for(var o=0;o<r;o+=4)n[e+o>>>2]=i[o>>>2];return this.sigBytes+=r,this},clamp:function(){var n=this.words,i=this.sigBytes;n[i>>>2]&=4294967295<<32-i%4*8,n.length=t.ceil(i/4)},clone:function(){var t=o.clone.call(this);return t.words=this.words.slice(0),t},random:function(n){for(var i,e=[],r=function(n){var n=n,i=987654321,e=4294967295;return function(){i=36969*(65535&i)+(i>>16)&e,n=18e3*(65535&n)+(n>>16)&e;var r=(i<<16)+n&e;return r/=4294967296,r+=.5,r*(t.random()>.5?1:-1)}},o=0;o<n;o+=4){var a=r(4294967296*(i||t.random()));i=987654071*a(),e.push(4294967296*a()|0)}return new s.init(e,n)}}),a=e.enc={},c=a.Hex={stringify:function(t){for(var n=t.words,i=t.sigBytes,e=[],r=0;r<i;r++){var o=n[r>>>2]>>>24-r%4*8&255;e.push((o>>>4).toString(16)),e.push((15&o).toString(16))}return e.join("")},parse:function(t){for(var n=t.length,i=[],e=0;e<n;e+=2)i[e>>>3]|=parseInt(t.substr(e,2),16)<<24-e%8*4;return new s.init(i,n/2)}},u=a.Latin1={stringify:function(t){for(var n=t.words,i=t.sigBytes,e=[],r=0;r<i;r++){var o=n[r>>>2]>>>24-r%4*8&255;e.push(String.fromCharCode(o))}return e.join("")},parse:function(t){for(var n=t.length,i=[],e=0;e<n;e++)i[e>>>2]|=(255&t.charCodeAt(e))<<24-e%4*8;return new s.init(i,n)}},f=a.Utf8={stringify:function(t){try{return decodeURIComponent(escape(u.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return u.parse(unescape(encodeURIComponent(t)))}},h=r.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=f.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(n){var i=this._data,e=i.words,r=i.sigBytes,o=this.blockSize,a=4*o,c=r/a;c=n?t.ceil(c):t.max((0|c)-this._minBufferSize,0);var u=c*o,f=t.min(4*u,r);if(u){for(var h=0;h<u;h+=o)this._doProcessBlock(e,h);var p=e.splice(0,u);i.sigBytes-=f}return new s.init(p,f)},clone:function(){var t=o.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),p=(r.Hasher=h.extend({cfg:o.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){h.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){t&&this._append(t);var n=this._doFinalize();return n},blockSize:16,_createHelper:function(t){return function(n,i){return new t.init(i).finalize(n)}},_createHmacHelper:function(t){return function(n,i){return new p.HMAC.init(t,i).finalize(n)}}}),e.algo={});return e}(Math);return t});
//# sourceMappingURL=core.min.js.map
!function(e,t,i){"object"==typeof exports?module.exports=exports=t(require("./core.min"),require("./sha1.min"),require("./hmac.min")):"function"==typeof define&&define.amd?define(["./core.min","./sha1.min","./hmac.min"],t):t(e.CryptoJS)}(this,function(e){return function(){var t=e,i=t.lib,r=i.Base,n=i.WordArray,o=t.algo,a=o.MD5,c=o.EvpKDF=r.extend({cfg:r.extend({keySize:4,hasher:a,iterations:1}),init:function(e){this.cfg=this.cfg.extend(e)},compute:function(e,t){for(var i=this.cfg,r=i.hasher.create(),o=n.create(),a=o.words,c=i.keySize,f=i.iterations;a.length<c;){s&&r.update(s);var s=r.update(e).finalize(t);r.reset();for(var u=1;u<f;u++)s=r.finalize(s),r.reset();o.concat(s)}return o.sigBytes=4*c,o}});t.EvpKDF=function(e,t,i){return c.create(i).compute(e,t)}}(),e.EvpKDF});
//# sourceMappingURL=evpkdf.min.js.map
!function(r,e){"object"==typeof exports?module.exports=exports=e(require("./core.min")):"function"==typeof define&&define.amd?define(["./core.min"],e):e(r.CryptoJS)}(this,function(r){return function(){function e(r,e,t){for(var n=[],i=0,o=0;o<e;o++)if(o%4){var f=t[r.charCodeAt(o-1)]<<o%4*2,c=t[r.charCodeAt(o)]>>>6-o%4*2;n[i>>>2]|=(f|c)<<24-i%4*8,i++}return a.create(n,i)}var t=r,n=t.lib,a=n.WordArray,i=t.enc;i.Base64={stringify:function(r){var e=r.words,t=r.sigBytes,n=this._map;r.clamp();for(var a=[],i=0;i<t;i+=3)for(var o=e[i>>>2]>>>24-i%4*8&255,f=e[i+1>>>2]>>>24-(i+1)%4*8&255,c=e[i+2>>>2]>>>24-(i+2)%4*8&255,s=o<<16|f<<8|c,h=0;h<4&&i+.75*h<t;h++)a.push(n.charAt(s>>>6*(3-h)&63));var p=n.charAt(64);if(p)for(;a.length%4;)a.push(p);return a.join("")},parse:function(r){var t=r.length,n=this._map,a=this._reverseMap;if(!a){a=this._reverseMap=[];for(var i=0;i<n.length;i++)a[n.charCodeAt(i)]=i}var o=n.charAt(64);if(o){var f=r.indexOf(o);f!==-1&&(t=f)}return e(r,t,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),r.enc.Base64});
//# sourceMappingURL=enc-base64.min.js.map
!function(e,t,r){"object"==typeof exports?module.exports=exports=t(require("./core.min"),require("./evpkdf.min")):"function"==typeof define&&define.amd?define(["./core.min","./evpkdf.min"],t):t(e.CryptoJS)}(this,function(e){e.lib.Cipher||function(t){var r=e,i=r.lib,n=i.Base,c=i.WordArray,o=i.BufferedBlockAlgorithm,s=r.enc,a=(s.Utf8,s.Base64),f=r.algo,p=f.EvpKDF,d=i.Cipher=o.extend({cfg:n.extend(),createEncryptor:function(e,t){return this.create(this._ENC_XFORM_MODE,e,t)},createDecryptor:function(e,t){return this.create(this._DEC_XFORM_MODE,e,t)},init:function(e,t,r){this.cfg=this.cfg.extend(r),this._xformMode=e,this._key=t,this.reset()},reset:function(){o.reset.call(this),this._doReset()},process:function(e){return this._append(e),this._process()},finalize:function(e){e&&this._append(e);var t=this._doFinalize();return t},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function e(e){return"string"==typeof e?B:x}return function(t){return{encrypt:function(r,i,n){return e(i).encrypt(t,r,i,n)},decrypt:function(r,i,n){return e(i).decrypt(t,r,i,n)}}}}()}),h=(i.StreamCipher=d.extend({_doFinalize:function(){var e=this._process(!0);return e},blockSize:1}),r.mode={}),u=i.BlockCipherMode=n.extend({createEncryptor:function(e,t){return this.Encryptor.create(e,t)},createDecryptor:function(e,t){return this.Decryptor.create(e,t)},init:function(e,t){this._cipher=e,this._iv=t}}),l=h.CBC=function(){function e(e,r,i){var n=this._iv;if(n){var c=n;this._iv=t}else var c=this._prevBlock;for(var o=0;o<i;o++)e[r+o]^=c[o]}var r=u.extend();return r.Encryptor=r.extend({processBlock:function(t,r){var i=this._cipher,n=i.blockSize;e.call(this,t,r,n),i.encryptBlock(t,r),this._prevBlock=t.slice(r,r+n)}}),r.Decryptor=r.extend({processBlock:function(t,r){var i=this._cipher,n=i.blockSize,c=t.slice(r,r+n);i.decryptBlock(t,r),e.call(this,t,r,n),this._prevBlock=c}}),r}(),_=r.pad={},v=_.Pkcs7={pad:function(e,t){for(var r=4*t,i=r-e.sigBytes%r,n=i<<24|i<<16|i<<8|i,o=[],s=0;s<i;s+=4)o.push(n);var a=c.create(o,i);e.concat(a)},unpad:function(e){var t=255&e.words[e.sigBytes-1>>>2];e.sigBytes-=t}},y=(i.BlockCipher=d.extend({cfg:d.cfg.extend({mode:l,padding:v}),reset:function(){d.reset.call(this);var e=this.cfg,t=e.iv,r=e.mode;if(this._xformMode==this._ENC_XFORM_MODE)var i=r.createEncryptor;else{var i=r.createDecryptor;this._minBufferSize=1}this._mode&&this._mode.__creator==i?this._mode.init(this,t&&t.words):(this._mode=i.call(r,this,t&&t.words),this._mode.__creator=i)},_doProcessBlock:function(e,t){this._mode.processBlock(e,t)},_doFinalize:function(){var e=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){e.pad(this._data,this.blockSize);var t=this._process(!0)}else{var t=this._process(!0);e.unpad(t)}return t},blockSize:4}),i.CipherParams=n.extend({init:function(e){this.mixIn(e)},toString:function(e){return(e||this.formatter).stringify(this)}})),m=r.format={},k=m.OpenSSL={stringify:function(e){var t=e.ciphertext,r=e.salt;if(r)var i=c.create([1398893684,1701076831]).concat(r).concat(t);else var i=t;return i.toString(a)},parse:function(e){var t=a.parse(e),r=t.words;if(1398893684==r[0]&&1701076831==r[1]){var i=c.create(r.slice(2,4));r.splice(0,4),t.sigBytes-=16}return y.create({ciphertext:t,salt:i})}},x=i.SerializableCipher=n.extend({cfg:n.extend({format:k}),encrypt:function(e,t,r,i){i=this.cfg.extend(i);var n=e.createEncryptor(r,i),c=n.finalize(t),o=n.cfg;return y.create({ciphertext:c,key:r,iv:o.iv,algorithm:e,mode:o.mode,padding:o.padding,blockSize:e.blockSize,formatter:i.format})},decrypt:function(e,t,r,i){i=this.cfg.extend(i),t=this._parse(t,i.format);var n=e.createDecryptor(r,i).finalize(t.ciphertext);return n},_parse:function(e,t){return"string"==typeof e?t.parse(e,this):e}}),g=r.kdf={},S=g.OpenSSL={execute:function(e,t,r,i){i||(i=c.random(8));var n=p.create({keySize:t+r}).compute(e,i),o=c.create(n.words.slice(t),4*r);return n.sigBytes=4*t,y.create({key:n,iv:o,salt:i})}},B=i.PasswordBasedCipher=x.extend({cfg:x.cfg.extend({kdf:S}),encrypt:function(e,t,r,i){i=this.cfg.extend(i);var n=i.kdf.execute(r,e.keySize,e.ivSize);i.iv=n.iv;var c=x.encrypt.call(this,e,t,n.key,i);return c.mixIn(n),c},decrypt:function(e,t,r,i){i=this.cfg.extend(i),t=this._parse(t,i.format);var n=i.kdf.execute(r,e.keySize,e.ivSize,t.salt);i.iv=n.iv;var c=x.decrypt.call(this,e,t,n.key,i);return c}})}()});
//# sourceMappingURL=cipher-core.min.js.map
!function(e,i){"object"==typeof exports?module.exports=exports=i(require("./core.min")):"function"==typeof define&&define.amd?define(["./core.min"],i):i(e.CryptoJS)}(this,function(e){!function(){var i=e,t=i.lib,n=t.Base,s=i.enc,r=s.Utf8,o=i.algo;o.HMAC=n.extend({init:function(e,i){e=this._hasher=new e.init,"string"==typeof i&&(i=r.parse(i));var t=e.blockSize,n=4*t;i.sigBytes>n&&(i=e.finalize(i)),i.clamp();for(var s=this._oKey=i.clone(),o=this._iKey=i.clone(),a=s.words,f=o.words,c=0;c<t;c++)a[c]^=1549556828,f[c]^=909522486;s.sigBytes=o.sigBytes=n,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var i=this._hasher,t=i.finalize(e);i.reset();var n=i.finalize(this._oKey.clone().concat(t));return n}})}()});
//# sourceMappingURL=hmac.min.js.map
!function(e,o,r){"object"==typeof exports?module.exports=exports=o(require("./core.min"),require("./cipher-core.min")):"function"==typeof define&&define.amd?define(["./core.min","./cipher-core.min"],o):o(e.CryptoJS)}(this,function(e){return e.mode.ECB=function(){var o=e.lib.BlockCipherMode.extend();return o.Encryptor=o.extend({processBlock:function(e,o){this._cipher.encryptBlock(e,o)}}),o.Decryptor=o.extend({processBlock:function(e,o){this._cipher.decryptBlock(e,o)}}),o}(),e.mode.ECB});
//# sourceMappingURL=mode-ecb.min.js.map
!function(e,r,i){"object"==typeof exports?module.exports=exports=r(require("./core.min"),require("./cipher-core.min")):"function"==typeof define&&define.amd?define(["./core.min","./cipher-core.min"],r):r(e.CryptoJS)}(this,function(e){return e.pad.Pkcs7});
//# sourceMappingURL=pad-pkcs7.min.js.map
!function(e,r,i){"object"==typeof exports?module.exports=exports=r(require("./core.min"),require("./enc-base64.min"),require("./md5.min"),require("./evpkdf.min"),require("./cipher-core.min")):"function"==typeof define&&define.amd?define(["./core.min","./enc-base64.min","./md5.min","./evpkdf.min","./cipher-core.min"],r):r(e.CryptoJS)}(this,function(e){return function(){var r=e,i=r.lib,n=i.BlockCipher,o=r.algo,t=[],c=[],s=[],f=[],a=[],d=[],u=[],v=[],h=[],y=[];!function(){for(var e=[],r=0;r<256;r++)r<128?e[r]=r<<1:e[r]=r<<1^283;for(var i=0,n=0,r=0;r<256;r++){var o=n^n<<1^n<<2^n<<3^n<<4;o=o>>>8^255&o^99,t[i]=o,c[o]=i;var p=e[i],l=e[p],_=e[l],k=257*e[o]^16843008*o;s[i]=k<<24|k>>>8,f[i]=k<<16|k>>>16,a[i]=k<<8|k>>>24,d[i]=k;var k=16843009*_^65537*l^257*p^16843008*i;u[o]=k<<24|k>>>8,v[o]=k<<16|k>>>16,h[o]=k<<8|k>>>24,y[o]=k,i?(i=p^e[e[e[_^p]]],n^=e[e[n]]):i=n=1}}();var p=[0,1,2,4,8,16,32,64,128,27,54],l=o.AES=n.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var e=this._keyPriorReset=this._key,r=e.words,i=e.sigBytes/4,n=this._nRounds=i+6,o=4*(n+1),c=this._keySchedule=[],s=0;s<o;s++)if(s<i)c[s]=r[s];else{var f=c[s-1];s%i?i>6&&s%i==4&&(f=t[f>>>24]<<24|t[f>>>16&255]<<16|t[f>>>8&255]<<8|t[255&f]):(f=f<<8|f>>>24,f=t[f>>>24]<<24|t[f>>>16&255]<<16|t[f>>>8&255]<<8|t[255&f],f^=p[s/i|0]<<24),c[s]=c[s-i]^f}for(var a=this._invKeySchedule=[],d=0;d<o;d++){var s=o-d;if(d%4)var f=c[s];else var f=c[s-4];d<4||s<=4?a[d]=f:a[d]=u[t[f>>>24]]^v[t[f>>>16&255]]^h[t[f>>>8&255]]^y[t[255&f]]}}},encryptBlock:function(e,r){this._doCryptBlock(e,r,this._keySchedule,s,f,a,d,t)},decryptBlock:function(e,r){var i=e[r+1];e[r+1]=e[r+3],e[r+3]=i,this._doCryptBlock(e,r,this._invKeySchedule,u,v,h,y,c);var i=e[r+1];e[r+1]=e[r+3],e[r+3]=i},_doCryptBlock:function(e,r,i,n,o,t,c,s){for(var f=this._nRounds,a=e[r]^i[0],d=e[r+1]^i[1],u=e[r+2]^i[2],v=e[r+3]^i[3],h=4,y=1;y<f;y++){var p=n[a>>>24]^o[d>>>16&255]^t[u>>>8&255]^c[255&v]^i[h++],l=n[d>>>24]^o[u>>>16&255]^t[v>>>8&255]^c[255&a]^i[h++],_=n[u>>>24]^o[v>>>16&255]^t[a>>>8&255]^c[255&d]^i[h++],k=n[v>>>24]^o[a>>>16&255]^t[d>>>8&255]^c[255&u]^i[h++];a=p,d=l,u=_,v=k}var p=(s[a>>>24]<<24|s[d>>>16&255]<<16|s[u>>>8&255]<<8|s[255&v])^i[h++],l=(s[d>>>24]<<24|s[u>>>16&255]<<16|s[v>>>8&255]<<8|s[255&a])^i[h++],_=(s[u>>>24]<<24|s[v>>>16&255]<<16|s[a>>>8&255]<<8|s[255&d])^i[h++],k=(s[v>>>24]<<24|s[a>>>16&255]<<16|s[d>>>8&255]<<8|s[255&u])^i[h++];e[r]=p,e[r+1]=l,e[r+2]=_,e[r+3]=k},keySize:8});r.AES=n._createHelper(l)}(),e.AES});
//# sourceMappingURL=aes.min.js.map
!function(e,n){"object"==typeof exports?module.exports=exports=n(require("./core.min")):"function"==typeof define&&define.amd?define(["./core.min"],n):n(e.CryptoJS)}(this,function(e){return e.enc.Utf8});
//# sourceMappingURL=enc-utf8.min.js.map
!function(a){function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(Goals.security);
//# sourceMappingURL=md5.min.js.map
;(function(Goals) {
	var security = Goals.security,
		doc = window.document,
		cookie = Goals.cookie,
		session = Goals.session,
		storage = Goals.storage,
		req = Goals.request,
		common = Goals.common;
	security.onTokenExpire = function(e) {};
	security.onSecurityError = null;
	security.onTokenError = null;
	security.onTokenNotFound = null;
	security.onBufferError = null;
	
	var ajax_error = function(err) {
		if(Goals.prompt) {
			Goals.prompt.hideLoading();
			Goals.prompt.error('[' + err.status + '] ' + err.statusText);
		}
	}
	var ajax_success = function(res, okFn, failFn) {
		if(res.code === 0) {
			okFn && okFn(res);
		}else {
			if(failFn) {
				failFn(res);
			}else if(Goals.prompt) {
				Goals.prompt.hideLoading();
				Goals.prompt.warn('[' + res.status + '] ' + res.msg);
			}else {
				okFn && okFn(res);
			}
		}
	}
	
	/**
	 * 缓存token及相关信息的key
	 */
	function sessionTokenKey() {
		return common.PROJECT_NAME + "_user";
	}
	/**
	 * 缓存sign签名字段的key
	 */
	function sessionSignKey() {
		return common.PROJECT_NAME + "_sign_key";
	}
	/**
	 * 混淆字符串
	 * 提起偶数位倒序拼接上基数位倒序
	 * @param {string} str 被混淆的字符串
	 */
	security.disrupt = function(str) {
		var arr = str.split("");
		var odd = "";//基数位
		var even = "";//偶数位
		for(var i = 0; i < arr.length; i++) {
			if(i%2 == 0) {
				odd += arr[i];
			}else {
				even += arr[i];
			}
		}
		return security.invert(even) + security.invert(odd);
	};
	/**
	 * 转换字符串,把字符串从末尾依次倒序整理
	 * @param {string} str
	 */
	security.invert = function(str) {
		var arr = str.split("");
		var strb = "";
		for(var i = arr.length - 1; i >= 0; i --) {
			strb += arr[i];
		}
		return strb;
	};
	/**
	 * 签名参数
	 * @param {Object} params
	 */
	security.sign = function(params, key) {
		var paramStr = "";
		if(typeof params == "string") {
			paramStr = params;
		}else if(typeof params == "object") {
			var arr = [];
			for(var i in params) {
				if(params.hasOwnProperty(i)) {
					if(typeof params[i] == "object") {
						arr.push(i + "=" + encodeURIComponent(JSON.stringify(params[i])));
					}else {
						arr.push(i + "=" + encodeURIComponent(params[i]));
					}
				}
			}
			arr.sort(function(a, b) {
				var _a = a.split("=")[0];
				var _b = b.split("=")[0];
				return _a.localeCompare(_b);
			});
			paramStr = arr.join(("&"));
		}
		if(key) {
			paramStr = security.disrupt(key) + "." + paramStr;
		}
		paramStr = paramStr.replace(/%20/gi, "+").replace(/(!)|(')|(\()|(\))|(\~)/gi, function(item) {
			return "%" + item.charCodeAt(0).toString(16).toLocaleUpperCase();
		});
		return security.md5(paramStr);
	};
	security.aesEncode = function(secret, str) {
		var key = CryptoJS.enc.Utf8.parse(secret);
		var srcs = CryptoJS.enc.Utf8.parse(str);
		var encrypted = CryptoJS.AES.encrypt(srcs, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();
	};
	security.aesDecode = function(secret, str) {
		var key = CryptoJS.enc.Utf8.parse(secret);
		var decrypt = CryptoJS.AES.decrypt(str, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return CryptoJS.enc.Utf8.stringify(decrypt).toString();
	};
	security.token = function(opt) {
		req.ajax({
			url: (common.PROJECT_SERVER_NAME + "/" + (opt.url || "/token/get")).replace("//", "/"),
			type: "post",
			data: opt.data,
			success: function(res) {
				if(res.code === 0) {
					session.add(sessionTokenKey(), res.data.tokenBean);
					session.add(sessionSignKey(), security.disrupt(res.data.tokenBean.scpsatSecretKey));
					opt.success && opt.success(res);
				}else {
					if(opt.error) {
						opt.error(res);
					}else {
						if(Goals.prompt) {
							Goals.prompt.hideLoading();
							Goals.prompt.warn(res.msg);
						}else {
							alert(res.msg);
						}
					}
				}
			}
		});
	}
	security.ajax = function(settings) {
		if(!settings.data) {
			settings.data = {};
		}
		settings.url = (common.PROJECT_SERVER_NAME + "/" + (settings.url || "")).replace("//", "/");
		settings.type = (settings.type || "GET").toUpperCase();
		var encrypt = !!settings.encrypt;
		settings.headers = settings.headers || {"Content-Type": "application/json"};
		if(Goals.language) {
			settings.headers['language'] = Goals.language.current();
		}
		var user = session.get(sessionTokenKey());
		if(encrypt) {
			if(!user || !user.scpsatSecretKey) {
				throw new Error("The current user is not logged in");
			}
			settings.headers["Content-Type"] = "application/scpsat-json";
			settings.data = security.aesEncode(user.scpsatSecretKey, JSON.stringify(settings.data));
		}
		if(user) {
			settings.url = settings.url + (settings.url.indexOf("?") > -1 ? "&" : "?") + "clientId=" + user.id;
			settings.headers["Scpsat-Token"] = user.token;
			settings.headers["Scpsat-Char"] = user.sessionChar;
		}
		if(settings.type !== "GET") {
			settings.headers["Scpsat-Sign"] = security.sign(settings.data, session.get(sessionSignKey()));
		}
		var okFn = settings.success;
		var failFn = settings.fail;
		settings.success = function(res) {
			ajax_success(res, okFn, failFn);
		}
		settings.error = ajax_error;
		req.ajax(settings);
	}
	req.setAjaxDataResolver("application/scpsat-json", function(text) {
		var user = session.get(sessionTokenKey());
		return JSON.parse(security.aesDecode(user.scpsatSecretKey, text));
	});
}(Goals));
