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
