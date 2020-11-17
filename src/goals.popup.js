;(function() {
    /*
     * shade - 渐变
     * left-right - 从左到右
     * right-left - 从右到左
     * lateral-spread - 横向扩张
     * vertical-spread - 纵向扩张
     */
    var DEFAULT_SHOW_ANIMATE = 'shade';
    
    var animates = ['shade', 'left-right', 'right-left', 'lateral-spread', 'vertical-spread'];
    animates.indexOf = function(str) {
        for(var i = 0; i < this.length; i ++) {
            if(this[i] === str) {
                return i;
            }
        }
        return -1;
    }
    
    var animate_fn = (function() {
        var fn = {
            'shade': {},
            'left-right': {},
            'right-left': {},
            'lateral-spread': {},
            'vertical-spread': {}
        };
        function get_left(width) {
            if(width.indexOf('%') > -1) {
                return ((100 - Number(width.replace('%', ''))) / 2) + '%';
            }else {
                return 'calc(50% - ' + (Number(width.replace('px', '')) / 2) + 'px)';
            }
        }
        function get_top(height) {
            if(height.indexOf('%') > -1) {
                return ((100 - Number(height.replace('%', ''))) / 2) + '%';
            }else {
                return 'calc(50% - ' + (Number(height.replace('px', '')) / 2) + 'px)';
            }
        }
        (function() {
            var animate_style = '-webkit-transition:opacity 0.3s ease-in-out;-moz-transition:opacity 0.3s ease-in-out;' +
                '-o-transition:opacity 0.3s ease-in-out;transition:opacity 0.3s ease-in-out;opacity:0;display:block;';
            fn['shade'].show = function(elem) {
                var left = get_left(elem.style.width);
                var top = get_top(elem.style.height);
                var style = elem.style_bak;
                var dynamic_style = 'left:' + left + ';top:' + top + ';';
                elem.setAttribute('style', style + animate_style + dynamic_style);
                setTimeout(function() {
                    elem.style.opacity = 1;
                }, 16);
            }
            fn['shade'].hide = function(elem) {
                elem.style.opacity = 0;
                setTimeout(function() {
                    elem.setAttribute('style', elem.style_bak);
                }, 300);
            }
        }());
        (function() {
            var animate_style = '-webkit-transition:left 0.3s ease-in-out;-moz-transition:left 0.3s ease-in-out;' +
                '-o-transition:left 0.3s ease-in-out;transition:left 0.3s ease-in-out;' +
                'display:block;';
            fn['left-right'].show = function(elem) {
                var left = get_left(elem.style.width);
                var top = get_top(elem.style.height);
                var style = elem.style_bak;
                var dynamic_style = 'left:-' + elem.style.width + ';top:' + top + ';';
                elem.setAttribute('style', style + animate_style + dynamic_style);
                setTimeout(function() {
                    elem.style.left = left;
                }, 16);
            }
            fn['left-right'].hide = function(elem) {
                elem.style.left = '-' + elem.style.width;
                setTimeout(function() {
                    elem.setAttribute('style', elem.style_bak);
                }, 300);
            }
        }());
        (function() {
            var animate_style = '-webkit-transition:left 0.3s ease-in-out;-moz-transition:left 0.3s ease-in-out;' +
                '-o-transition:left 0.3s ease-in-out;transition:left 0.3s ease-in-out;' +
                'display:block;left:100%;';
            fn['right-left'].show = function(elem) {
                var left = get_left(elem.style.width);
                var top = get_top(elem.style.height);
                var style = elem.style_bak;
                var dynamic_style = 'top:' + top + ';';
                elem.setAttribute('style', style + animate_style + dynamic_style);
                setTimeout(function() {
                    elem.style.left = left;
                }, 16);
            }
            fn['right-left'].hide = function(elem) {
                elem.style.left = '100%';
                setTimeout(function() {
                    elem.setAttribute('style', elem.style_bak);
                }, 300);
            }
        }());
        (function() {
            var animate_style = '-webkit-transition:all 0.3s ease-in-out;-moz-transition:all 0.3s ease-in-out;' +
                '-o-transition:all 0.3s ease-in-out;transition:all 0.3s ease-in-out;width:0;display:block;';
            fn['lateral-spread'].show = function(elem) {
                var width = elem.style.width;
                var left = get_left(width);
                var top = get_top(elem.style.height);
                var style = elem.style_bak;
                var dynamic_style = 'top:' + top + ';left: 50%;';
                elem.setAttribute('style', style + animate_style + dynamic_style);
                setTimeout(function() {
                    elem.style.width = width;
                    elem.style.left = left;
                }, 16);
            }
            fn['lateral-spread'].hide = function(elem) {
                elem.style.width = 0;
                elem.style.left = '50%';
                setTimeout(function() {
                    elem.setAttribute('style', elem.style_bak);
                }, 300);
            }
        }());
        (function() {
            var animate_style = '-webkit-transition:all 0.3s ease-in-out;-moz-transition:all 0.3s ease-in-out;' +
                '-o-transition:all 0.3s ease-in-out;transition:all 0.3s ease-in-out;height:0;display:block;';
            fn['vertical-spread'].show = function(elem) {
                var height = elem.style.height;
                var left = get_left(elem.style.width);
                var top = get_top(height);
                var style = elem.style_bak;
                var dynamic_style = 'left:' + left + ';top: 50%;';
                elem.setAttribute('style', style + animate_style + dynamic_style);
                setTimeout(function() {
                    elem.style.height = height;
                    elem.style.top = top;
                }, 16);
            }
            fn['vertical-spread'].hide = function(elem) {
                elem.style.height = 0;
                elem.style.top = '50%';
                setTimeout(function() {
                    elem.setAttribute('style', elem.style_bak);
                }, 300);
            }
        }());
        return fn;
    }());
    
    function get_style(elem) {
        var style = elem.getAttribute('style');
        if(style) {
            style = style.trim();
            if(style[style.length - 1] !== ';') {
                style += ';';
            }
        }else {
            style = '';
        }
        return style;
    }
    
    function get_animate(args) {
        if(animates.indexOf(args[0]) === -1) {
            return DEFAULT_SHOW_ANIMATE;
        }else {
            var arg = args[0];
            args.splice(0, 1);
            return arg;
        }
    }
    function create_popup(r, key, self) {
        /** @type {Element} */
        var elem = r.elem;
        var okbtns = elem.querySelectorAll('.popup-ok-btn');
        var cancelbtns = elem.querySelectorAll('.popup-cancel-btn');
        elem['style_bak'] = r.style = get_style(elem);
        r.animate = r.animate || DEFAULT_SHOW_ANIMATE;
        r.args = [];
        r.hide = function(animate) {
            self.onhide && self.onhide(key);
            animate_fn[animate || r.animate].hide(r.elem);
        }
        r.show = function(animate) {
            self.onshow && self.onshow(key);
            r.onshow && r.onshow.apply(null, r.args);
            animate_fn[animate || r.animate].show(r.elem);
        }
        for(var i = 0, e; e = okbtns[i++];) {
            e.addEventListener('click', function() {
                r.okFn ? r.okFn.apply(null, r.args) : r.hide();
            })
        }
        for(var i = 0, e; e = cancelbtns[i++];) {
            e.addEventListener('click', function() {
                r.cancelFn ? r.cancelFn.apply(null, r.args) : r.hide();
            })
        }
        return function() {
            r.args = Array.prototype.slice.call(arguments);
            r.animate = get_animate(r.args);
            r.args.splice(0, 0, r.hide);
            r.show(r.animate);
        }
    }
    var GoalsPopup = function(arr) {
        var self = this;
        self.buffer = {};
        var popup;
        arr.forEach(function(r) {
            Goals.assert(r.elem, 'Please pass in the "elem" parameter');
            popup = r.elem.getAttribute('popup');
            Goals.assert(popup, 'Missing "popup" attribute');
            self[popup] = create_popup(r, popup, self);
            self.buffer[popup] = r;
        });
    };
    GoalsPopup.prototype.onshow = function(key) {};
    GoalsPopup.prototype.onhide = function(key) {};
    Goals.popup = GoalsPopup;
}());
