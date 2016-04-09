// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova']).run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			// Don't remove this line unless you know what you are doing. It stops the viewport
			// from snapping when text inputs are focused. Ionic handles this internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
	});
})
document.addEventListener("deviceready", init, false);

function init() {
	document.querySelector("#takeVideo").addEventListener("touchend", function() {
		console.log("Take video");
		navigator.device.capture.captureVideo(captureSuccess, captureError, {
			limit: 1,
			saveToPhotoAlbum: true
		});
	}, false);

	function getPhoto() {
		// Retrieve image file location from specified source
		navigator.camera.getPicture(onPhotoURISuccess, onFail, {
			quality: 100,
			destinationType: destinationType.FILE_URI,
			sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
			mediaType: navigator.camera.MediaType.VIDEO
		});
	}
}

function onFail(e) {
	console.log("capture error: " + JSON.stringify(e));
	alert("Error: No files returned." + error.code);
}

function onPhotoURISuccess(mediaFile) {
	var i, len;
	len = mediaFile.length;
	//alert(len);
	if (len > 0) {
		for (i = 0, len; i < len; i += 1) {
			uploadFile(mediaFile[i]);
		}
	} else {
		alert("Error: No files returned." + error.code)
	}
}

function captureError(e) {
	console.log("capture error: " + JSON.stringify(e));
	alert("Error: No files returned." + error.code);
}

function captureSuccess(mediaFile) {
		var i, len;
		len = mediaFile.length;
		//alert(len);
		if (len > 0) {
			for (i = 0, len; i < len; i += 1) {
				uploadFile(mediaFile[i]);
			}
		} else {
			alert("Error: No files returned." + error.code)
		}
	}

//Upload files to server
function uploadFile(mediaFile) {
	function win(r) {
		console.log("Code = " + r.responseCode);
		console.log("Response = " + r.response);
		console.log("Sent = " + r.bytesSent);
		alert('Enue Upload Successful!');
	}

	function fail(error) {
		alert("An error has occurred: Code = " + error.code);
		console.log("upload error source " + error.source);
		console.log("upload error target " + error.target);
	}
	var uri = encodeURI("https://enueserver.serveftp.org/upload.php");
	var options = new FileUploadOptions(),
		name = mediaFile.name;
	options.fileKey = "mediaFile";
	options.fileName = name;
	options.mimeType = "video/mpeg";
	var headers = {
		'headerParam': 'headerValue'
	};
	options.headers = headers;
	var ft = new FileTransfer(),
		path = mediaFile.fullPath;
	var statusDom = document.querySelector('#status');
	ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			if (perc < 100) {
				statusDom.innerHTML = perc + "% Uploading...";
			} else {
				statusDom.innerHTML = "";
			}
		}
	};
	ft.upload(path, uri, win, fail, options);
}
