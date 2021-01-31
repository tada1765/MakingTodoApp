var expressParser = require('express');
var urlencodedParser = expressParser.urlencoded({extended: false});
const jsonfile = require('jsonfile'); //refer: https://attacomsian.com/blog/nodejs-read-write-json-files
const fs = require('fs');

// var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: "coding"}]; // temporary data 

module.exports = function(app){

    // get data from database and pass it to view.
    app.get("/todo", function(req, res){
        jsonfile.readFile('database/databases.json', (err, databases) => {
            if (err) {
                console.log(`Error reading file from disk: ${err}`);
            } else {
                res.render('todo', {todos: databases});
            }
        });
        // res.render('todo', {todos: data});
    });

    // get data from the view and add it to database.
    app.post("/todo", urlencodedParser, function(req, res){
        fs.readFile('database/databases.json', 'utf8', (err, data) => {
            if (err) {
                console.log(`Error reading file from disk: ${err}`);
            } else {
                // parse JSON string to JSON object
                const databases = JSON.parse(data);
                // add a new record
                databases.push({
                    item: req.body.item
                });
                // write new data back to the file
                fs.writeFile('database/databases.json', JSON.stringify(databases, null, 4), (err) => {
                    if (err) {
                        console.log(`Error writing file: ${err}`);
                    }else{
                        res.json(databases);
                    }
                });
            }
        });
        // data.push(req.body); // add new item into the array
        // console.log(req.body); //  { item: 'apple' }
        // // res.json(data); // return back as json (error)
        // res.json({todos: data}); // use this
    });

    // delete the requested item from databases.json.
    app.delete("/todo/:item", function(req, res){
        fs.readFile('database/databases.json', 'utf8', (err, data) => {
            if (err) {
                console.log(`Error reading file from disk: ${err}`);
            } else {
                // parse JSON string to JSON object
                const databases = JSON.parse(data);
                // delete a record item (https://stackoverflow.com/questions/5310304/remove-json-element)
                for (let [i, todo] of databases.entries()) {
                    if (todo.item == req.params.item.replace(/\-/g, " ")) {
                        databases.splice(i, 1);
                    }
                }
                // write new data back to the file
                fs.writeFile('database/databases.json', JSON.stringify(databases, null, 4), (err) => {
                    if (err) {
                        console.log(`Error writing file: ${err}`);
                    }else{
                        res.json(databases);
                    }
                });
            }
        });
        // data = data.filter(function(todo){
        //     // console.log(todo.item.replace(/ /g, '-')); // replace SPACE with hyphen.
        //     // console.log(req.params.item);
        //     return todo.item.replace(/ /g, '-') !== req.params.item;
        // });
        // res.json({todos: data});
    });

};