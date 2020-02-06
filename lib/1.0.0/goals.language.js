;(function() {
	var Goals = window.Goals = (window.Goals ? (typeof window.Goals === 'function' ? new window.Goals() : window.Goals) : {});
	if(!Goals.language) {
		Goals.language = {};
	}
	if(!Goals.storage) {
		throw new Error("You must import the 'goals.storage' package");
	}
	var storage = Goals.storage;
	function storage_key() {
		return Goals.common.PROJECT_SERVER_NAME + '_language';
	}
	Goals.language.current = function() {
		return storage.get(storage_key()) || navigator.language || navigator.userLanguage;
	}
	Goals.language.set = function(language) {
		storage.add(storage_key(), language);
	}
}());