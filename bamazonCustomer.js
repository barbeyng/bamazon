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
        promptCustomer();
    });
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
        }
    ]).then(function (answer) {
        connection.query('SELECT * FROM products WHERE ?',
            {
                item_id: answer.product
            }, function (err, res) {
                if (err) throw err;
                // console.log(res[0]);
                var selectedProduct = res[0];
                if (answer.quantity <= selectedProduct.stock_quantity) {
                    connection.query(
                        'UPDATE products SET ? WHERE ?',
                        [{
                            stock_quantity: selectedProduct.stock_quantity - answer.quantity
                        },
                        {
                            item_id: answer.product
                        }],
                        function (err, res) {
                            if (err) throw err;
                            console.log('===================================================\n' +
                            'You are purchasing ' + answer.quantity + ' of ' + selectedProduct.product_name + '.\n' +
                            'Your order has been placed! Your total is $' + selectedProduct.price * answer.quantity + '\n' +
                            '===================================================');
                            promptCustomer();
                        });
                } else {
                    console.log('===================================================\n' +
                    'Sorry, there is insufficient stock.\n' +
                    'Only ' + selectedProduct.stock_quantity + ' units remain for ' + selectedProduct.product_name + '.\n' +
                    'Please try again.\n' +
                    '===================================================');
                    promptCustomer();
                }
            });
    });
}