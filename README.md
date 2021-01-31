# MakingTodoApp
Node.js project trying a simple TODO App.

refer: https://www.youtube.com/watch?v=edOmvng5IQc&list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp&index=31&ab_channel=TheNetNinja

# 1. start project:

- npm init 
- install packages (nodemon, express, ejs, body-parser[optional] )
- create folder (views, public/assets, ...)
- app.js as main running file (host listen, require[express, ejs, ...])
- edit package.json ("devStart": "nodemon app.js") for nodemon

# 2. MVC concept:

- MODEL (DATA)
 - TODOS
 - USERS
- CONTROLLER (CONTROLS THE APP SECTIONS)
 - todoController
 - userController
- VIEW (TEMPLATE FILES (EJS))
 - todo.ejs
 - account.ejs

**NOTE: utilizes module export**
![ex](https://trello-attachments.s3.amazonaws.com/5cef6e87da0d0b7598cbc7a9/60121d583b28e013cbfceaf2/84ad1e75dfc704458504983e49965e28/image.png)

inside public/assets:
- any .png picture (70x36)
- styless.css:

```

body{
    background: #0d1521;
    font-family: tahoma;
    color: #989898;
}

#todo-table{
    position: relative;
    width: 95%;
    background: #090d13;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
}

#todo-table form:after{
    margin: 0;
    content: '';
    display: block;
    clear: both;
}

input[type="text"]{
    width: 70%;
    padding: 20px;
    background:#181c22;
    border: 0;
    float: left;
    font-size: 20px;
    color: #989898;
}

button{
    padding: 20px;
    width: 30%;
    float: left;
    background: #23282e;
    border: 0;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    font-size: 20px;
}

ul{
    list-style-type: none;
    padding: 0;
    margin: 0;
}

li{
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    font-family: arial;
    font-size: 20px;
    cursor: pointer;
    letter-spacing: 1px;
}

li:hover{
    text-decoration: line-through;
    background: rgba(0,0,0,0.2);
}

h1{
    background: url(/assets/logo.png) no-repeat center;
    margin-bottom: 0;
    text-indent: -10000px;
}

```

- todo-list.js

```

$(document).ready(function(){

    $('form').on('submit', function(){
  
        var item = $('form input');
        var todo = {item: item.val()};
  
        $.ajax({
          type: 'POST',
          url: '/todo',
          data: todo,
          success: function(data){
            //do something with the data via front-end framework
            location.reload();
          }
        });
  
        return false;
  
    });
  
    $('li').on('click', function(){
        var item = $(this).text().replace(/ /g, "-");
        $.ajax({
          type: 'DELETE',
          url: '/todo/' + item,
          success: function(data){
            //do something with the data via front-end framework
            location.reload();
          }
        });
    });
  
  });

```

# 3. render todo.ejs

- app.js:

```

var express = require("express");
var todoController = require("./controllers/todoController");

var app = express();

// set up template engine:
app.set("view engine", "ejs");

// static files:
app.use(express.static("./public"));
// ex.) localhost:3000/assets/styles.css

// fire controllers:
todoController(app);

//listen to port:
app.listen(3000);
console.log("You are listening to port 3000")

```

- views/todo.ejs:

```

<html>
    <head>
        <title>Todo List</title>
        <script src="https://code.jquery.com/jquery-1.12.3.min.js" integrity="sha256-aaODHAgvwQW1bFOGXMeX+pC4PZIPsvn2h1sArYOhgXQ=" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="/assets/styles.css" type="text/css">
    </head>
    <body>
        <h1>My logo</h1>
        <div id="todo-table">
            <form>
                <input type="text" name="item" placeholder="Add new item..." required />
                <button type="submit">Add Item</button>
            </form>
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
            </ul>
        </div>
    </body>
</html>

```

- controllers/todoController.js

```

module.exports = function(app){

    app.get("/todo", function(req, res){
        res.render('todo');
    });

    app.post("/todo", function(req, res){

    });

    app.delete("/todo", function(req, res){

    });

};

```
**result: http://127.0.0.1:3000/todo**
![should](https://trello-attachments.s3.amazonaws.com/5cef6e87da0d0b7598cbc7a9/60121d583b28e013cbfceaf2/8af7f0cd722a4d5f766fe985788f9b31/image.png)

# 4. add item & delete item

- views/todo.ejs:

```

<html>
    <head>
        <title>Todo List</title>
        <script src="https://code.jquery.com/jquery-1.12.3.min.js" integrity="sha256-aaODHAgvwQW1bFOGXMeX+pC4PZIPsvn2h1sArYOhgXQ=" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="/assets/styles.css" type="text/css">
        <script src="/assets/todo-list.js"></script> 
    </head>
    <body>
        <h1>My logo</h1>
        <div id="todo-table">
            <form>
                <input type="text" name="item" placeholder="Add new item..." required />
                <button type="submit">Add Item</button>
            </form>
            <ul>
                <% for(var i=0; i<todos.length; i++){ %>
                    <li><%= todos[i].item %></li>
                <% } %>
            </ul>
        </div>
    </body>
</html>

```

- cotrollers/todoController.js:

```

var expressParser = require('express');
var urlencodedParser = expressParser.urlencoded({extended: false});

var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: "coding"}]; // temporary data 

module.exports = function(app){

    app.get("/todo", function(req, res){
        res.render('todo', {todos: data});
    });

    app.post("/todo", urlencodedParser, function(req, res){
        data.push(req.body); // add new item into the array
        // res.json(data); // return back as json (error)
        res.json({todos: data}); // use this
    });

    app.delete("/todo/:item", function(req, res){
        data = data.filter(function(todo){
            // console.log(todo.item.replace(/ /g, '-')); // replace SPACE with hyphen.
            // console.log(req.params.item);
            return todo.item.replace(/ /g, '-') !== req.params.item;
        });
        res.json({todos: data});
    });

};

```

**resulr: just adding item fire by submit & delete item fire by clicking an item**

# 5. MY TRY setting a database (JSON) 

refer: https://attacomsian.com/blog/nodejs-read-write-json-files

install jsonfile package (optional):

```

npm install jsonfile --save

```

learn Json function (get, add, delete);
Note: for delete item WHY use **splice** instead of **delete** refer:(https://stackoverflow.com/questions/5310304/remove-json-element)
because, **delete** method will remain NULL object white **splice** is not.

- create a file "database/databases.json"

```

[
    {
        "item": "get milk"
    },
    {
        "item": "walk dog"
    },
    {
        "item": "coding"
    }
]

```

- cotrollers/todoController.js:

```

var expressParser = require('express');
var urlencodedParser = expressParser.urlencoded({extended: false});
const jsonfile = require('jsonfile'); 
const fs = require('fs');


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
    });

};

```
