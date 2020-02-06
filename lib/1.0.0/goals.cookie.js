;(function() {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	if(!Goals.chaotic) {
		throw new Error("You must import the 'goals.chaotic' package");
	}
	if(!Goals.cookie) {
		Goals.cookie = {};
	}
	Goals.cookie.add = function(name, value, expires) {
		var cookie_expires = "";
		if(expires) {
			var exp = new Date();
			exp.setTime(exp.getTime() + (expires * 1000));
			cookie_expires = ";expires=" + exp.toUTCString();
		}
		document.cookie = name + "=" + Goals.chaotic.encode(value) + cookie_expires;
	};
	Goals.cookie.get = function(name) {
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		if(arr != null) {
			return Goals.chaotic.decode(decodeURIComponent(arr[2]));
		}
		return null;
	};
	Goals.cookie.remove = function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		document.cookie = name + "=" +";expires=" + exp.toUTCString();
	};
}());