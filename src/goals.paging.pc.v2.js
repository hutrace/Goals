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
		merge(opt, 'pageNumber', 9);
		merge(opt, 'changeSize', true);
		merge(opt, 'sizeOptions', [20, 50, 100]);
		
		if(opt.sizeOptions.indexOf(opt.pageSize) == -1) {
			opt.sizeOptions.push(opt.pageSize);
		}
		opt.sizeOptions.sort(function(a, b) {return a - b;});
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
		settings.pageElem.classList.add('paging-infos');
		var self = this;
		
		var selector = $(settings.pageElem);
		if(settings.changeSize) {
			selector.on('focus', '.paging-select', function() {
                var selectops = $(this).children('.paging-selectopts');
                selectops.css({display: 'block'});
                selectops.height(selectops.attr('data-h'));
            });
            selector.on('blur', '.paging-select', function() {
                var selectops = $(this).children('.paging-selectopts');
                selectops.height(0);
                setTimeout(function() {
                    selectops.css({display: 'none'});
                }, 200);
            });
           selector.on('click', '.paging-selectopt', function() {
                var $this = $(this);
                if(!$this.hasClass('paging-selectopt-selected')) {
                    var currentnum = self.pageStart / self.pageSize;
                    var count = parseInt($this.parent().attr('data-count'));
                    self.pageSize = parseInt($this.text().trim());
                    self.pageStart = currentnum * self.pageSize;
                    if(self.pageStart >= count) {
                        var yu = count % self.pageSize;
                        if(yu == 0) {
                            self.pageStart = count - self.pageSize;
                        }else {
                            self.pageStart = Math.floor(count / self.pageSize) * self.pageSize;
                        }
                    }
                    self.buffer = {};
                    self.start();
                }
            });
		}
		selector.on('input', '.paging-input', function() {
            var btn = selector.children('.paging-btn-sure');
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
        selector.on('click', '.paging-primary', function() {
            var pagenum = parseInt(this.getAttribute('pagenum'));
            self.pageStart = (pagenum - 1) * self.pageSize;
            self.start();
        });
		
		
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
		this.pageStart = 0;
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
		var count = this.count = eval("data." + opt.pageCountKey);
        var html = '';
        var size = this.pageSize;
        var start = this.pageStart;
        var maxnum = opt.pageNumber;
        // 总页数
        var totalnum = Math.ceil(count / size);
        // 当前处理第几页
        var currentnum = count == 0 ? 0 : start / size + 1;
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
        if(opt.changeSize) {
            html += '<div class="paging-item paging-text">每页显示：</div>';
            var sizeopts = opt.sizeOptions;
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
        opt.pageElem.classList.add('paging-infos');
        opt.pageElem.innerHTML = html;
		
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
	
	function setpaging(count, self) {
		console.log(this);
		var property = this.property;
        var html = '';
        var size = opt.pageSize;
        var start = opt.pageStart;
        var maxnum = opt.pageNumber;
        // 总页数
        var totalnum = Math.ceil(count / size);
        // 当前处理第几页
        var currentnum = count == 0 ? 0 : start / size + 1;
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
        if(opt.changeSize) {
            html += '<div class="paging-item paging-text">每页显示：</div>';
            var sizeopts = opt.sizeOptions;
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
        opt.pagingDom.innerHTML = html;
	}
	
	Goals.paging = GoalsPaging;
}());
