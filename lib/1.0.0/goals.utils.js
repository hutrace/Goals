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
			try{
				date = new Date(date);
			}catch(e){
				date = new Date(date.replace(/-/g, '/'));
			}
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
					if(target.classList.contains(bubbling)) {
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
				height: 0,
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
			if(settings.height) {
				pulldown_result.style.height = settings.height + 'px';
			}else {
				pulldown_result.style.maxHeight = settings.maxHeight + 'px';
			}
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
