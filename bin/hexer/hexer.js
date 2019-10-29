
let hexer = {
    
    // patterns
    pat_returns: /\n|\r\n/g,
    
    // just split text by windows (cr lf) and/or posix ( lf ) style retruns 
    splitByReturns : (text) => {
        return text.split(hexer.pat_returns);
    },
    
    // text to raw style hex format where each line is convered to
    // hex and retrunChars are placed between each line
    toRawStyle : (text, returnChar) => {
        
        returnChar = returnChar === undefined ? '\n' : returnChar;
        
        return hexer.splitByReturns(text).map((line)=>{
            
            return Buffer.from(line, 'utf8').toString('hex');
            
        }).join(returnChar);
        
    },
    
    // convert rawStyle format hex back to text
    fromRawStyle : (hex, returnChar) => {
        
        returnChar = returnChar === undefined ? '\n' : returnChar;
        
        return hexer.splitByReturns(hex).map((line)=>{
            
            return Buffer.from(line, 'hex').toString('utf8');
            
        }).join(returnChar);
        
    }
    
};

module.exports = hexer;
