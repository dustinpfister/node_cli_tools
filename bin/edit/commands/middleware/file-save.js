// save a file
let express = require('express'),
fs = require('fs'),
path = require('path');

module.exports = (conf) => {

    let router = express.Router();

    router.use(require('body-parser').json());

    router.post('/', (req, res) => {
		
		console.log('yes this is file-save');
		console.log(req.body);

        fs.writeFile(path.join(conf.target, req.body.fileName), req.body.text, 'utf8', (e) => {

            if (e) {

                res.json({
                    mess: e.message,
                    fail: true,
                    fileName: req.body.fileName
                });

            } else {

                res.json({
                    mess: 'save is good',
                    fail: false,
                    fileName: req.body.fileName
                });

            }

        });

    });

    return router;

};
