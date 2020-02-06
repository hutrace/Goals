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
