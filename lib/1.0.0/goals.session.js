;(function() {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	if(!Goals.chaotic) {
		throw new Error("You must import the 'goals.chaotic' package");
	}
	if(!Goals.session) {
		Goals.session = {};
	}
	Goals.session.add = function(name, value) {
		if(value === null || value === undefined) {
			value = "null";
		}
		if(typeof value === "object") {
			value = "1" + JSON.stringify(value);
		}else {
			value = "0" + value;
		}
		value = Goals.chaotic.encode(value);
		sessionStorage.setItem(name, value);
	}
	Goals.session.get = function(name) {
		var value = sessionStorage.getItem(name);
		if(value === null || value === undefined || value === "null") {
			return null;
		}
		value = Goals.chaotic.decode(value);
		var isobject = parseInt(value.substring(0, 1));
		value = value.substring(1);
		if(isobject) {
			return JSON.parse(value);
		}else {
			return value;
		}
	}
	Goals.session.remove = function(name) {
		sessionStorage.removeItem(name);
	}
	Goals.session.clear = function() {
		sessionStorage.clear();
	}
}());