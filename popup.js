window.onload = function(){

    blkbtn=document.getElementById('blkbtn');
    blk=document.getElementById('blk');
    ignbtn=document.getElementById('ignbtn');
    ign=document.getElementById('ign');
    ignhead=document.getElementById('ignhead');
    blkhead=document.getElementById('blkhead');

    blkbtn.addEventListener('click',block);
    ignbtn.addEventListener('click',ignore);

    function block(){
        txt=blk.value;
        if(txt.length<1) {
            blkhead.innerHTML="";
            return;
        }
        obj={
            txt:"block",
            url:txt
        };
        chrome.runtime.sendMessage(obj);
    }
    function ignore(){
        txt=ign.value;
        if(txt.length<1){
            ignhead.innerHTML="";
            return;
        }
        obj={
            txt:"ignore",
            url:txt
        };
        chrome.runtime.sendMessage(obj);
    }

    chrome.runtime.onMessage.addListener(gotMessage);

    function gotMessage(message, sender, sendResponse){
        if(message.txt=="block"){
            blkhead.innerHTML=message.msg;
        }
        else if(message.txt=="ignore"){
            ignhead.innerHTML=message.msg;
        }
    }

    function sendMsg(){
        //to content.js

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