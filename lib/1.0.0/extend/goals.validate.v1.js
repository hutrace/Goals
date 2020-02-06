;(function(doc) {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	var assert = (Goals.utils && Goals.utils.assert)? Goals.utils.assert : function(judge, msg) {if(judge !== 0 && !judge) {throw new Error(msg);}};
	
	function validate_fn(data, _this) {
		var val = _this.value.trim();
		var name = _this.getAttribute('name');
		data[name].val = val;
		if(_this.getAttribute('required') === 'required') {
			var reg = _this.getAttribute('reg');
			if(reg) {
				if(!(new RegExp(reg).test(val))) {
					_this.classList.add('goals-validate-error');
					data[name].pass = false;
				}else {
					_this.classList.remove('goals-validate-error');
					data[name].pass = true;
				}
			}else {
				if(val === '') {
					_this.classList.add('goals-validate-error');
					data[name].pass = false;
				}else {
					_this.classList.remove('goals-validate-error');
					data[name].pass = true;
				}
			}
		}
	}
	
	function init_fn(data, _this) {
		var val = _this.value.trim();
		var name = _this.getAttribute('name');
		data[name].val = val;
		if(_this.getAttribute('required') === 'required') {
			var reg = _this.getAttribute('reg');
			if(reg) {
				if(!(new RegExp(reg).test(val))) {
					data[name].pass = false;
				}else {
					data[name].pass = true;
				}
			}else {
				if(val === '') {
					data[name].pass = false;
				}else {
					data[name].pass = true;
				}
			}
		}
	}
	
	function validate_bind(ev, elems, data) {
		var name;
		[].forEach.call(elems, function(r) {
			name = r.getAttribute('name');
			assert(name, "The 'name' attribute is missing\r\n" + r.outerHTML);
			var _data = {verify: r.getAttribute('required') === 'required',val: ''};
			if(_data.verify) {
				_data.elem = r;
			}
			data[name] = _data;
			init_fn(data, r);
			if(ev === 'blur') {
				function blur_fn() {
					validate_fn(data, this);
				}
				function focus_fn() {
					this.classList.remove('goals-validate-error');
				}
				r.removeEventListener('blur', blur_fn);
				r.removeEventListener('focus', focus_fn);
				r.addEventListener('blur', blur_fn);
				r.addEventListener('focus', focus_fn);
			}else if(ev === 'change') {
				function change_fn() {
					validate_fn(data, this);
				}
				r.removeEventListener('change', change_fn);
				r.addEventListener('change', change_fn);
			}
		});
	}
	function clear_fn(elems) {
		[].forEach.call(elems, function(r) {
			r.value = '';
		});
	}
	function clear_select_fn(elems) {
		[].forEach.call(elems, function(r) {
			r.options[0].selected = true;
		});
	}
	var GoalsValidate = function(elem) {
		this.elem = elem;
		this.rebind();
	};
	GoalsValidate.prototype.rebind = function() {
		var elem = this.elem;
		var inputs = elem.querySelectorAll('input');
		var textareas = elem.querySelectorAll('textarea');
		var selects = elem.querySelectorAll('select');
		var data = {};
		validate_bind('blur', inputs, data);
		validate_bind('blur', textareas, data);
		validate_bind('change', selects, data);
		this.data = data;
	};
	GoalsValidate.prototype.clear = function() {
		var elem = this.elem;
		var inputs = elem.querySelectorAll('input');
		var textareas = elem.querySelectorAll('textarea');
		var selects = elem.querySelectorAll('select');
		clear_fn(inputs);
		clear_fn(textareas);
		clear_select_fn(selects);
	};
	GoalsValidate.prototype.verify = function() {
		var data = this.data;
		var d;
		var res = {};
		for(var k in data) {
			d = data[k];
			if(d.verify) {
				if(!d.pass) {
					res = null;
					d.elem.focus();
					return null;
				}
			}
			res[k] = d.val;
		}
		return res;
	};
	Goals.validate = GoalsValidate;
}());

