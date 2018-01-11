if (window.process) {
	window.nodeRequire = require;
	window.nw = {
		require: require,
		Buffer: window.Buffer,
	};
	if (!require.nodeRequire)
		require.nodeRequire = window.nodeRequire;
}


