
var xml = new XMLHttpRequest();

xml.open('get', '/file-list');

xml.onreadystatechange = function(res){
    
    if(xml.readyState === 4 && xml.status === 200){
        
        console.log(JSON.parse(xml.response));
        
    }
    
    
}

xml.send();
