var edit = document.getElementById('edit');

var lineCount = 10,
line,
lineIndex = 0;

while(lineIndex < lineCount){
    
    line = document.createElement('div');
    line.id = 'line-' + lineIndex;
    line.className = 'line_container';
    line.innerText = lineIndex;
    
    edit.appendChild(line);
    
    lineIndex += 1;
}
