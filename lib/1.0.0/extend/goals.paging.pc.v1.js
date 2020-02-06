;(function() {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	var assert = (Goals.utils && Goals.utils.assert)? Goals.utils.assert : function(judge, msg) {if(judge !== 0 && !judge) {throw new Error(msg);}};
	if(!Goals.security && !Goals.request) {
		throw new Error("You must import the 'goals.security' or 'goals.request' package");
	}
	assert(Goals.prompt, "You must import the 'goals.prompt' package");
	assert(Goals.utils, "You must import the 'goals.utils' package");
	if(!Goals.paging) {
		Goals.paging = {};
	}
	var ajax;
	if(Goals.security && Goals.security.ajax) {
		ajax = Goals.security.ajax;
	}else {
		ajax = Goals.request.ajax;
	}
	function checkAndMerge(opt) {
		assert(opt.url, "You need to pass in the 'url' parameter");
		assert(opt.dataElem, "You need to pass in the 'dataElem' parameter");
		assert(opt.pageElem, "You need to pass in the 'pageElem' parameter");
		merge(opt, 'pageStart', 0);
		merge(opt, 'pageSize', 10);
		merge(opt, 'data', {});
		merge(opt, 'type', 'get');
		merge(opt, 'pageListKey', 'list');
		merge(opt, 'pageCountKey', 'count');
	}
	function merge(opt, key, val) {
		if(!opt[key]) {
			opt[key] = val;
		}
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
	var GoalsPaging = function(settings) {
		this.prototype = new Object();
		checkAndMerge(settings);
		this.option = settings;
		this.pageStart = settings.pageStart;
		this.pageSize = settings.pageSize;
		this.buffer = {};
		this.isFirstTime = true;
		settings.pageElem.classList.add('pro-paging');
		var _this = this;
		Goals.utils.on(settings.pageElem, ".can-click", "click", function(e) {
			_this.run(e);
		});
	};
	GoalsPaging.prototype.run = function(e) {
		var start;
		if(Goals.utils.isNumber(e)) {
			start = e;
		}else {
			start = parseInt(e.getAttribute("page"));
		}
		if(start < 0 || start >= this.count) {
			return;
		}
		this.pageStart = start;
		this.start();
	};
	GoalsPaging.prototype.template = function() {return '';};
	GoalsPaging.prototype.callback = function(data) {};
	GoalsPaging.prototype.setData = function(data) {
		this.option.data = data;
		this.start();
	};
	GoalsPaging.prototype.load = function(data) {
		var opt = this.option;
		var list = eval('data.' + opt.pageListKey);
		if(!list) {
			list = [];
		}
		if(list.length === 0 && list.pageStart > 0) {
			this.pageStart = opt.pageStart - opt.pageSize;
			this.start();
			return;
		}
		opt.dataElem.innerHTML = this.template(list);
		this.count = eval("data." + opt.pageCountKey);
		var last = this.pageStart - this.pageSize;
		var next = this.pageStart + this.pageSize;
		var allPaging = Math.ceil(this.count/this.pageSize);
		var isFirst = !this.pageStart;
		var isEnd = next >= this.count;
		var _go_paging = "";
		var isCanClick;
		if(allPaging > opt.pageNumber) {
			var _show_paging = parseInt(opt.pageNumber/2);
			var _current_paging = (this.pageStart/this.pageSize) + 1;
			var _start = 1, _end = allPaging;
			if(_current_paging - _show_paging > 0) {
				_start = _current_paging - _show_paging;
				_end = _current_paging + _show_paging;
			}else {
				_end = opt.pageNumber;
			}
			if(allPaging - _current_paging < _show_paging) {
				_end = allPaging;
				_start = allPaging - opt.pageNumber + 1;
			}
			for(var i = _start; i <= _end; i ++) {
				isCanClick = i == _current_paging ? " current-htn": " can-click";
				_go_paging += `
					<a href="javascript:;" class="pading-btn${isCanClick}" page="${(i-1)*this.pageSize}">${i}</a>
				`;
			}
		}else {
			for(var i = 0, p = 1; i < this.count; i += this.pageSize, p ++) {
				isCanClick = i == this.pageStart ? " current-htn": " can-click";
				_go_paging += `
					<a href="javascript:;" class="pading-btn${isCanClick}" page="${i}">${p}</a>
				`;
			}
		}
		var _paging = `
			<a href="javascript:;" class="pading-other-btn${isFirst ? "" : " can-click"}" page="0">首页</a>
			<a href="javascript:;" class="pading-other-btn${isFirst ? "" : " can-click"}" page="${last}">上一页</a>
			${_go_paging}
			<a href="javascript:;" class="pading-other-btn${isEnd ? "" : " can-click"}" page="${next}">下一页</a>
			<a href="javascript:;" class="pading-other-btn${isEnd ? "" : " can-click"}" page="${(allPaging-1)*this.pageSize}">尾页</a>
			<a href="javascript:;" class="pading-other-btn">共 ${allPaging} 页</a>
		`;
		opt.pageElem.innerHTML = _paging;
		this.isFirstTime = false;
		this.callback(data);
	};
	GoalsPaging.prototype.start = function() {
		var _this = this;
		var opt = _this.option;
		var buffer = _this.buffer[opt.pageStart];
		if(buffer) {
			_this.load(buffer);
		}else {
			opt.data.pageStart = _this.pageStart;
			opt.data.pageSize = _this.pageSize;
			opt.data.isFirstTime = _this.isFirstTime;
			ajax({
				url: opt.url,
				data: opt.data,
				type: opt.type,
				success: function(res) {
					if(res.code === 0) {
						_this.load(res.data);
					}else {
						Goals.prompt.warn(res.msg);
					}
				},
				error: function(err) {
					Goals.prompt.error('[' + err.status + '] ' + err.statusText);
				}
			});
		}
	};
	GoalsPaging.prototype.clearBuffer = function() {
		this.buffer = {};
	};
	GoalsPaging.prototype.reload = function() {
		delete this.buffer[this.pageStart];
		this.start();
	};
	Goals.paging = GoalsPaging;
}());
