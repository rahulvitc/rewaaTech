var mysql = require('mysql');
var express = require('express');
//var session = require('express-session');
var bodyParser = require('body-parser');
//var path = require('path');
 
var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3308',
    user     : 'root',
    password : 'root',
    database : 'nodeapi'
});

connection.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

 
var app = express();
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({    
extended: true
}));

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
})

 
app.post('/auth', function(req, response) {
    var username = req.body.username;
    var password = req.body.password;
      if (username && password) {
    connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
     if (results.length > 0) {
                        response.end(JSON.stringify(results));
                        } else {
                                response.end(JSON.stringify(results));
                        }                                             
                            response.end();
                    });
                } else {
                        response.send('Please enter the username and password');
                        response.end();
                }
});

 
app.get('/products', function(req, response) {
        connection.query('SELECT * FROM products', function(error, results, fields) {
                response.end(JSON.stringify(results));
        });
});

app.get('/products/:id', function (req, res) {
   console.log(req);
   connection.query('select * from `products` where `id`=?', [req.params.id], function (error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    });
});


app.post('/products', function (req, res) {
   var postData  = req.body;
   connection.query('INSERT INTO products SET ?', postData, function (error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    });
});

app.put('/products', function (req, res) {
   connection.query('UPDATE `products` SET `productname`=?,`productdetails`=? where `id`=?', [req.body.productname,req.body.productdetails, req.body.id], function (error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    });
});

 

app.delete('/products/:id', function (req, res) {
   console.log(req.params.id);
   connection.query('DELETE FROM `products` WHERE `id`=?', [req.params.id], function (error, results, fields) {
      if (error) throw error;
       res.end(JSON.stringify(results));
    });
});


console.log('listening at port number 3000');

app.listen(3000);