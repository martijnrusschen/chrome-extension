document.getElementById("defaultOpen").addEventListener("click", function(event) {
    openTab(event, "securitytxt-content")
})
document.getElementById("History").addEventListener("click", function(event) {
    openTab(event, "Historytab")
})
document.getElementById("defaultOpen").click();

function openTab(evt, tabid) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabid).style.display = "block";
    evt.currentTarget.className += " active";
}

function LoadFromStorage() {
    chrome.storage.local.get(function(callback) {
        storage = callback;
        query = {
            active: true,
            currentWindow: true
        };
        chrome.tabs.query(query, function(result) {
            domain = result[0].url.split("/")[2]; protocol = result[0].url.split("//")[0]
            chrome.runtime.sendMessage({
                "securityTxt": {"root": protocol+"//"+domain, "popup": true}
            })
        });
    })
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.content != undefined) {
        content = $('<div>').text(message.content).html()
        document.getElementById("securitytxt-pre").innerHTML = content
    }
})

LoadFromStorage();