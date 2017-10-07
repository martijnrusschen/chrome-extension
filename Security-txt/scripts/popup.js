document.getElementById("defaultOpen").addEventListener("click", function(event){openTab(event, "securitytxt-content")})
document.getElementById("History").addEventListener("click", function(event){openTab(event, "Historytab")})
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

function LoadFromStorage(){
    chrome.storage.local.get(function(callback){
        storage = callback;
        query = { active: true, currentWindow: true };
        chrome.tabs.query(query, function(result){
            domain = result[0].url.split('/')[2];
            if(storage.hasSecuritytxt.indexOf(domain) > -1){
                xhr = new XMLHttpRequest; xhr.onreadystatechange = function(){
                    //It shouldn't be possible to XSS this but just in case.
                    contents = $('<div/>').text(xhr.responseText).html();
                    document.getElementById("securitytxt-pre").innerHTML = contents;
                };

                if(storage.location[storage.hasSecuritytxt.indexOf(domain)] == '/'){
                    xhr.open("GET", result[0].url.split('/')[0]+'//'+domain+'/security.txt');
                }else{
                    xhr.open("GET", result[0].url.split('/')[0]+'//'+domain+'/.well-known/security.txt');
                };

                xhr.send();
            }
        });
    })
}

LoadFromStorage();