(function() {
	console.warn('Debugging ::');

	function getAPIURL() {
		return `${window.location.hostname}:8081`
	}
	
	function checkAPIStatus() {
		const req = new XMLHttpRequest();
		try {
			const url = `http://${getAPIURL()}/ping?ip=${window.location.hostname}`
			req.open('GET', url, true);
			req.onload = function (e) {
				if (req.readyState === 4) {
					if (req.status === 200) {
						console.log('The api seems to be running')
					} else {
						console.error(req.statusText);
					}
				}
			};
			req.onerror = function (e) {
				console.error(xhr.statusText);
			};
			req.send(null);
		}
		catch (e) {
			console.error(e)
			console.log('API Error');
		}
	}
	checkAPIStatus()
	const interval = setInterval(checkAPIStatus, 10000);
	const form = document.querySelector('form')
	form.action = `http://${getAPIURL()}/auth`;
	
})();