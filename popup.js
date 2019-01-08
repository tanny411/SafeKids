window.onload = function(){

    blkbtn=document.getElementById('blkbtn');
    blk=document.getElementById('blk');
    blkhead=document.getElementById('blkhead');

    ignbtn=document.getElementById('ignbtn');
    ign=document.getElementById('ign');
    ignhead=document.getElementById('ignhead');

    oldpass=document.getElementById('oldpass');
    newpass=document.getElementById('newpass');
    inpass=document.getElementById('inpass');
    passhead=document.getElementById('passhead');

    blkbtn.addEventListener('click',block);
    ignbtn.addEventListener('click',ignore);
    cngpass.addEventListener("click",changePass);

    pass=null;
    chrome.storage.sync.get("pass", function(data){
        pass=data["pass"];
    });
    
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
        if(pass!=inpass.value){
            ignhead.innerHTML="Wrong Password!";
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

    function changePass()
    {
        if(pass!=oldpass.value){
            passhead.innerHTML="Old password does not match!";
        }
        else{
            chrome.storage.sync.set({"pass":newpass.value});
            pass=newpass.value;
            passhead.innerHTML='Password Changed!';
        }
    }
}