// body is the body of the post request in JSON format
// Returns a promise
function remoteServicePostJson(body, url) {
	return new Promise((resolve, reject) => {
		let xhttp = new XMLHttpRequest();
		let params = JSON.stringify(body);
		xhttp.open("POST", url, true);

		//Send the proper header information along with the request
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.onload = () => {
			resolve(xhttp.responseText);
		}, (error) => {
			reject(error);
		};
		xhttp.send(params);
	});
}

function remoteServiceGet(url) {
	return new Promise((resolve, reject) => {
		let xhttp = new XMLHttpRequest();
		xhttp.open("GET", url);
		xhttp.onload = () => {
			resolve(xhttp.responseText);
		}, (error) => {
			reject(error);
		};
		xhttp.send();
	});
}