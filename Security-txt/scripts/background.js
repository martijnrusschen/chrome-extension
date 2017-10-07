function changeIcon(tabid, exists){
	if(exists){
		chrome.browserAction.setIcon({
			path: "icons/icon1.png",
			tabId: tabid
		})
	}else{
		chrome.browserAction.setIcon({
			path: "icons/icon2.png",
			tabId: tabid
		})
	}
}

function getSecuritytxt(domain, protocol, wk, tabid){
	xhr = new XMLHttpRequest; xhr.open("GET", protocol+domain+wk+'security.txt'); console.log(protocol+domain+wk+'security.txt'); xhr.onreadystatechange = function(){
		if(xhr.status != 404 && xhr.getResponseHeader('content-type').startsWith('text/plain') && xhr.responseText.indexOf('Contact:')){
			UpdateStorage('hasSecuritytxt', 'set', domain+':'+wk);
			changeIcon(tabid, true);
		}else{
			changeIcon(tabid, false);
			return false
		}
	}; xhr.send();
}

function UpdateStorage(path, action, value){
	chrome.storage.local.get(function(callback){
		storage = callback;
		if(Object.keys(storage).length == 0){
			chrome.storage.local.set({"hasSecuritytxt":[], "location":[]})
		};
		if(path == 'hasSecuritytxt'){
			if(action == 'set' && storage.hasSecuritytxt.indexOf(value.split(':')[0]) < 0){
				storage.hasSecuritytxt.push(value.split(':')[0]);
				storage.location.push(value.split(':')[1])
			}
		}; chrome.storage.local.set(storage);
	})
}

chrome.runtime.onMessage.addListener(function(message, sender, response){
	if(message.securityTxt != undefined && message.securityTxt){
		if(getSecuritytxt(message.securityTxt[0].domain, message.securityTxt[0].protocol, "/", sender.tab.id) == false){
			getSecuritytxt(message.securityTxt[0].domain, message.securityTxt[0].protocol, "/.well-known/", sender.tab.id)
		}
	}
})

chrome.storage.onChanged.addListener(function(){UpdateStorage()}); UpdateStorage();