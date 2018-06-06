var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

connection.connect(function (err) {
    if (err) throw err;
    showMenu();
});

function displayAll() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('Product ID: ' + res[i].item_id + '\n' +
                'Product : ' + res[i].product_name + '\n' +
                'Department: ' + res[i].department_name + '\n' +
                'Price: ' + res[i].price + '\n' +
                'Stock: ' + res[i].stock_quantity + '\n' +
                '===================================================');
        }
    });
}

function showMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Hello, Manager. What would you like to do today?',
            choices: ['View products for sale', 'View low inventory', 'Add to inventory', 'Add new product'],
            name: 'menu',
        }
    ]).then(function (answer) {
        if (answer.menu === 'View products for sale') {
            displayAll();
        }
    });
}