/*
var xml = new XMLHttpRequest();

xml.open('get', '/file-list');

xml.onreadystatechange = function(res){
    
    if(xml.readyState === 4 && xml.status === 200){
        
        console.log(JSON.parse(xml.response));
        
    }
    
    
}

xml.send();
*/

var xml = new XMLHttpRequest();

xml.open('post', '/file-open');

xml.onreadystatechange = function(res){
    
    if(xml.readyState === 4 && xml.status === 200){
        
        console.log(JSON.parse(xml.response));
        
    }
    
    
}
xml.setRequestHeader("Content-Type", "application/json");
xml.send(JSON.stringify({fileName:'first-post.md'}));
