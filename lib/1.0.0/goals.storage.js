;(function() {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	if(!Goals.chaotic) {
		throw new Error("You must import the 'goals.chaotic' package");
	}
	if(!Goals.storage) {
		Goals.storage = {};
	}
	Goals.storage.add = function(name, value) {
		if(value === null || value === undefined) {
			value = "null";
		}
		if(typeof value === "object") {
			value = "1" + JSON.stringify(value);
		}else {
			value = "0" + value;
		}
		value = Goals.chaotic.encode(value);
		localStorage.setItem(name, value);
	}
	Goals.storage.get = function(name) {
		var value = localStorage.getItem(name);
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
	Goals.storage.remove = function(name) {
		localStorage.removeItem(name);
	}
	Goals.storage.clear = function() {
		localStorage.clear();
	}
}());