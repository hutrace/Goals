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