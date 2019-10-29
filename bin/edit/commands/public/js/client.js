
var vue = new Vue({

        // attaching to editor hard coded html element
        el: '#editor',

        // temaple for the vue
        template: '<div>' +
        '<input type=\"text\" v-model=\"fileName\"> ' +
        '<input type=\"button\" value=\"open\" v-on:click=\"open\"> ' +
        '<input type=\"button\" value=\"save\" v-on:click=\"save\"> <br><br>' +
        '<textarea cols=\"80\" rows=\"20\" v-model=\"text\"></textarea>' +
        '</div>',

        // state
        data: {
            fileName: 'untitled.md',
            text: ''
        },

        // methods
        methods: {
            // save a file from text area to target folder
            save: function () {

                console.log('save' + this.$data.fileName);

                this.$http.post('/file-save', {
                    fileName: this.$data.fileName,
                    text: this.$data.text
                })
                .then(function (res) {
                    console.log(res);
                });

            },
            // open a file from target folder of the current fileName
            open: function () {

                console.log('open: ' + this.$data.fileName);

                this.$http.post('/file-open', {
                    fileName: this.$data.fileName
                })
                .then(function (res) {

                    console.log(res);
                    if (res.body.text) {

                        this.$data.text = res.body.text;

                    }

                })

            }
        }
    });
