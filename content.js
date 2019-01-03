console.log("Content running!");

async function Load(url) {
    let response;
    response = await fetch(chrome.runtime.getURL(url));
    const text = await response.text();
    arr=text.split('\n');
    for(i=0;i<arr.length;i++){
        arr[i]=arr[i].trim().toLowerCase();
    }
    //console.log(arr.length);
    arr = new Set(arr);
    //console.log(arr.size);
    bw = Array.from(arr);
    //console.log(bw);
    filter = new Filter({ list: bw });
    //console.log(filter.list);
    console.log('filter ready!');
    walk(document.body);
}

Load("Words/bw.txt");
    
function walk(node)  
{       
    var child, next;    
    switch ( node.nodeType )  
    {
        case 1: 
        case 9:  
        case 11: 
            child = node.firstChild;
            while ( child ) 
            {
                next = child.nextSibling; 
                walk(child);
                child = next;
            }
            break;    
        case 3: 
            handleText(node);
            break;
    }
}

function handleText(textNode) 
{
    console.log(filter.isProfane("fuck off"));
    textNode.nodeValue = filter.clean(textNode.nodeValue.toLowerCase());
}

/*
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    
}
*/
