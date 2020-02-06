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
