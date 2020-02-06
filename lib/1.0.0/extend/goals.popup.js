;(function(doc) {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	var assert = (Goals.utils && Goals.utils.assert)? Goals.utils.assert : function(judge, msg) {if(judge !== 0 && !judge) {throw new Error(msg);}};
	/*
	 * shade - 渐变
	 * left-right - 从左到右
	 * right-left - 从右到左
	 * lateral-spread - 横向扩张
	 * vertical-spread - 纵向扩张
	 */
	var DEFAULT_SHOW_ANIMATE = 'shade';
	
	var animate_styles = {
		'shade': '-webkit-transition:opacity 0.3s ease-in-out;-moz-transition:opacity 0.3s ease-in-out;-o-transition:opacity 0.3s ease-in-out;transition:opacity 0.3s ease-in-out;opacity:0;display:block;',
		'left-right': ''
	};
	var animate_hide_styles = {
		'shade': 'opacity:0'
	};
	
	function show(elem, style, animate) {
		var animate_style = animate_styles[animate];
		assert(animate_style, "No animation corresponding to '" + animate + "' was found");
		elem.setAttribute('style', style + animate_style);
		setTimeout(function() {
			elem.style.opacity = 1;
		}, 16);
	}
	
	function hide(elem, style, animate) {
		var hide_styles = animate_hide_styles[animate];
		var styles = hide_styles.split(';');
		var style_kv;
		for(var i = 0; i < styles.length; i ++) {
			style_kv = styles[i].split(':');
			elem.style[style_kv[0]] = style_kv[1];
		}
		setTimeout(function() {
			elem.setAttribute('style', style);
		}, 300);
	}
	
	function create_popup(r, key) {
		var elem = r.elem;
		var okbtn = elem.querySelector('.popup-ok-btn');
		var cancelbtn = elem.querySelector('.popup-cancel-btn');
		r.style = elem.getAttribute('style');
		if(r.style) {
			r.style = r.style.trim();
			if(r.style[r.style.length - 1] !== ';') {
				r.style += ';';
			}
		}else {
			r.style = '';
		}
		if(!r.animate) {
			r.animate = DEFAULT_SHOW_ANIMATE;
		}
		if(okbtn) {
			okbtn.addEventListener('click', function() {
				r.okFn && r.okFn(function() {
					hide(r.elem, r.style, r.animate);
				});
			});
		}
		if(cancelbtn) {
			cancelbtn.addEventListener('click', function() {
				if(r.cancelFn) {
					r.cancelFn(function() {
						hide(r.elem, r.style, r.animate);
					});
				}else {
					hide(r.elem, r.style, r.animate);
				}
			});
		}
		return function(animate) {
			if(animate) {
				r.animate = animate;
			}
			this.onshow && this.onshow(key);
			show(r.elem, r.style, r.animate);
		}
	}
	var GoalsPopup = function(arr) {
		var _this = this;
		_this.buffer = {};
		var popup;
		arr.forEach(function(r) {
			assert(r.elem, "Please pass in the 'elem' parameter");
			popup = r.elem.getAttribute('popup');
			assert(popup, "Missing 'popup' attribute");
			_this[popup] = create_popup(r, popup);
			_this.buffer[popup] = r;
		});
	};
	GoalsPopup.prototype.onshow = function(key) {};
	Goals.popup = GoalsPopup;
}());
