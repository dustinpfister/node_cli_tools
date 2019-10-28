// setup quill
//Quill.register('/themes/core');
var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: {
        container:'#toolbar'
      }
    }
  });


document.getElementById('button_save').addEventListener('click', function(){
   
    console.log( quill.getText() );
    
});
