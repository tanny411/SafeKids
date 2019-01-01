async function Load(url) {
    let response;
    response = await fetch(chrome.runtime.getURL(url));
    const text = await response.text();
    arr=text.split('\n');
    for(i=0;i<arr.length;i++){
        arr[i]=arr[i].trim().toLowerCase();
    }
}

Load("Links/blacklistedsites.txt");

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain 
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    host=extractHostname(tab.url).toLowerCase();
    root=extractRootDomain(tab.url).toLowerCase();
    if(arr.includes(root) || arr.includes(host)){
        chrome.tabs.update(tabId, {"url" : "redirect.html"}, 
        function () {});
    }
});

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    url=message.url;
    if(message.txt=="block"){

        if(arr.includes(url)){
            obj={
                txt:"block",
                msg:"Site is already in blocklist!"
            };
        }
        else{
            obj={
                txt:"block",
                msg:"Site Blocked!"
            };
        }
    }
    else if(message.txt=="ignore"){

        if(arr.includes(url)){
            obj={
                txt:"ignore",
                msg:"Site Ignored!"
            };
        }
        else{
            obj={
                txt:"ignore",
                msg:"Site not in block list!"
            };
        }
    }
    chrome.runtime.sendMessage(obj);
}