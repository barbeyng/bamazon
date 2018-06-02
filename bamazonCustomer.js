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
    displayAll();
});

function displayAll() {
    connection.query('SELECT * FROM products', function (error, response) {
        if (error) throw error;
        for (var i = 0; i < response.length; i++) {
            console.log('Product ID: ' + response[i].item_id + '\n' +
                'Product : ' + response[i].product_name + '\n' +
                'Department: ' + response[i].department_name + '\n' +
                'Price: ' + response[i].price + '\n' +
                'Stock: ' + response[i].stock_quantity + '\n' +
                '===================================================');
        }
        promptCustomer();
        connection.end();
    })
}

function promptCustomer() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Welcome to bamazon! Enter the product ID of the item you wish to purchase.',
            name: 'product',
            // validate: function (input) {
            //     if (input > 0 && input < 11) {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // }
        },
        {
            type: 'input',
            message: 'Enter the quantity you wish to purchase.',
            name: 'quantity',
            // validate: function (input) {
            //     if (input != isNan) {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // }
        }
    ]).then(function (answer) {

    })
}