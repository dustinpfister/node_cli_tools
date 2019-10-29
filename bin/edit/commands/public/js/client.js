
var vue = new Vue({

        // attaching to editor hard coded html element
        el: '#editor',

        // temaple for the vue
        template: '<div>' +
        '<input type=\"text\" v-bind:value=\"fileName\"> ' +
        '<input type=\"button\" value=\"open\" v-on:click=\"open\"> ' +
        '<input type=\"button\" value=\"save\" v-on:click=\"save\"> <br><br>' +
        '<textarea cols=\"80\" rows=\"20\" v-bind:value=\"text\"></textarea>' +
        '</div>',

        // state
        data: {
            fileName: 'untitled.md',
            text: ''
        },

        // methods
        methods: {
            save: function () {
                console.log('save');
            },
            open: function () {
                console.log('open');

                this.$http.post('/file-open', {
                    fileName: this.$data.fileName
                })
                .then(function (res) {

                    console.log(res);
					if(res.body.data){
						
						this.$data.text = data;
						
					}

                })

            }
        }
    });
