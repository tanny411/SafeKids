console.log("Content running!");
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    console.log("Got a Message: ");
    console.log(message.txt);
}
var filter = new Filter();
//console.log(filter.clean("Don't be an ash0le"));
//document.body.textContent =filter.clean(document.body.textContent);
//document.body.innerHTML.replace(/(ocurrance|occurrance|occurance)/g, "occurrence")
//document.body.innerHTML.replace(/oc[\w]+nce/g, "occurrence")