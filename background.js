/*var fileURL = chrome.extension.getURL("Links/blacklistedsites.txt"); 
var xmlreq = new XMLHttpRequest()
xmlreq.open("GET", fileURL, false) //false makes it syncronous, we'll just wait till it's done
xmlreq.send()
//The file should be in xmlreq.responseText array
lineArray = xmlreq.responseText.split("\n") //standard splitting by linebreaks
console.log(lineArray);
*/
function request(url) {
    var xhr = new XMLHttpRequest();
    try {
        xhr.onreadystatechange = function(){
            if (xhr.readyState != 4){
                console.log("Not ready yet");
                return;
            }

            if (xhr.responseText) {
                console.debug(xhr.responseText);
            }
        }

        xhr.onerror = function(error) {
            console.debug(error);
        }

        xhr.open("GET", url, true);
        xhr.send(null);
    } catch(e) {
        console.error(e);
    }
}

function init() {
    request("Links/blacklistedsites.txt");
}