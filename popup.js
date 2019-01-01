window.onload = function(){

    q=document.getElementById('userMsg');
    q.addEventListener('input',sendMsg);

    function sendMsg(){

        msg=q.value;
        console.log("the message is : " + msg);
        
        let paragraphs = document.getElementsByTagName('p');
        for (elt of paragraphs) {
            elt.innerHTML = msg;
        }

        let params = {
            active: true,
            currentWindow: true
        }
        chrome.tabs.query(params, gotTabs);

        function gotTabs(tabs) {
            //will be displayed in inspect of the popup
            console.log("got tabs");
            console.log(tabs);
            // send a message to the content script
            let obj = {
                txt: msg
            };
            chrome.tabs.sendMessage(tabs[0].id, obj);
        }
    }
}