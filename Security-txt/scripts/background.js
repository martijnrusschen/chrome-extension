function changeIcon(tabid, exists) {
    if (exists) {
        chrome.browserAction.setIcon({
            path: "icons/icon1.png",
            tabId: tabid
        })
    } else {
        chrome.browserAction.setIcon({
            path: "icons/icon2.png",
            tabId: tabid
        })
    }
}

function getSecuritytxt(url, domain, tabid, i, messaged) {
    const consume = responseReader => {
    return responseReader.read().then(result => {
        if (result.done || chunks > 1) { return; }
        const chunk = result.value;
        chunks++

        if (new TextDecoder("utf-8").decode(chunk).indexOf("Contact:") > -1) {
        	response_string = new TextDecoder("utf-8").decode(chunk)
        }

        if (typeof messaged == "undefined"){
            if (typeof response_string != "undefined") {
                changeIcon(tabid, true)
                obj = new Object; obj[domain] = locations[i]
                UpdateStorage("hasSecuritytxt", "set", obj)
            } else if(i == locations.length - 1) {
                changeIcon(tabid, false)
            }
        }else{
            chrome.runtime.sendMessage({"content": response_string})
        }

        return consume(responseReader);
    	});
	}
	fetch(url).then(response => {
		chunks = 0
		if (response.status == 200 && response.headers.get("content-type").indexOf("text/plain") > -1 && response.redirected == false) {
			setTimeout(function(){return consume(response.body.getReader())}, 200)
		} else {
            changeIcon(tabid, false)
        }
	})
}

function UpdateStorage(path, action, value) {
    chrome.storage.local.get(function(callback) {
        storage = callback;
        if (Object.keys(storage).length == 0) {
            chrome.storage.local.set({
                "hasSecuritytxt": {}
            })
        };
        if (path == "hasSecuritytxt") {
            if(action == "set") {
                storage.hasSecuritytxt[Object.keys(value)[0]] = value[Object.keys(value)[0]]
            }
        }
        chrome.storage.local.set(storage);
    })
}

chrome.runtime.onMessage.addListener(function(message, sender, response) {
	locations = ["/security.txt", "/.well-known/security.txt"]
    if (message.securityTxt != undefined && message.securityTxt.popup == undefined) {
        for(i = 0; i < locations.length; i++) {
        	getSecuritytxt(message.securityTxt.root.concat(locations[i]), message.securityTxt.root.split('/')[2], sender.tab.id, i)
        }
    }else if (message.securityTxt != undefined && message.securityTxt.popup) {
        for(i = 0; i < locations.length; i++) {
            getSecuritytxt(message.securityTxt.root.concat(locations[i]), message.securityTxt.root.split('/')[2], null, i, true)
        }
    }
})

chrome.storage.onChanged.addListener(function() {
    UpdateStorage()
});

UpdateStorage();
