// open a file
let express = require('express'),
fs = require('fs'),
path = require('path');

module.exports = (conf) => {

    let router = express.Router();

    router.use(require('body-parser').json());

    router.post('/', (req, res) => {

        fs.readFile(path.join(conf.target, req.body.fileName), 'utf8', (e, text) => {

            if (text) {
                res.json({

                    mess: 'looks like we have some text',
                    text: text,
                    fileName: req.body.fileName

                });

            } else {

                res.json({

                    mess: e.message,
                    text: '',
                    fileName: req.body.fileName

                });

            }

        });

    });

    return router;

};
