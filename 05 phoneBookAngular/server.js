/**
 * Created by emanuel on 4/19/2016.
 */
(function() {
    "use strict";
   
    //requires//
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var fs = require('fs');
    var readlineSync = require('readline-sync');

    //static dir name//
    app.use(express.static(__dirname + '/public'));

    //helpers//
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    //get phone book request//
    app.get('/getPhoneBook', function (req, res) {
        // load data from file if file is not valid continue without loading data from file//
        var data = loadData();
        res.json(data);
    });
    
    //listening to port 3000//
    app.listen(3000, function () {
        console.log('app listening on port 3000!');
    });
    
    //post request for saving the phone book//
    app.post('/setPhoneBook', function (req, res) {
        var data = req.body.data;
        
        //write to file//
        fs.writeFileSync('myFile.txt', JSON.stringify(data));
    });

    //handle loading file from the file//
    function loadData() {
        var phoneBookObj = {};

        //try read file//
        try {
            var content = fs.readFileSync('myFile.txt', 'utf8');
        }

        //error with reading file//
        catch(err) {
            content = "";
            return content;
        }
        
        //file is exist//
        if(content) {
            try {
                phoneBookObj = JSON.parse(content);
            }

            catch (err) {
                content = 'error data';
                return content;
            }
        }
        
        //file is empty//
        else {
            return "empty";
        }

        //evrything ok//
        if(phoneBookObj) {
            return phoneBookObj;
        }
    }
})();