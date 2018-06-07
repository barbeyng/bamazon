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

function showMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Hello, Manager. What would you like to do today?',
            choices: ['View products for sale', 'View low inventory', 'Add to inventory', 'Add new product'],
            name: 'menu',
        }
    ]).then(function (answer) {
        switch (answer.menu) {
            case 'View products for sale':
                displayAll();
                break;
            case 'View low inventory':
                lowInventory();
                break;
            case 'Add to inventory':
                addInventory();
                break;
            case 'Add new product':
                newProduct();
                break;
            default:
                console.log('Something went wrong. Please try again.');
        }
    });
}

function returnMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Return to main menu?',
            choices: ['Yes', 'No'],
            name: 'back',
        }
    ]).then(function (answer) {
        if (answer.back === 'Yes') {
            showMenu();
        } else {
            console.log('Goodbye.');
        }
    });
}

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
        returnMenu();
    });
}

function lowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('The following items have less than 5 units in stock.');
            console.log('Product ID: ' + res[i].item_id + '\n' +
                'Product : ' + res[i].product_name + '\n' +
                'Department: ' + res[i].department_name + '\n' +
                'Price: ' + res[i].price + '\n' +
                'Stock: ' + res[i].stock_quantity + '\n' +
                '===================================================');
        }
        returnMenu();
    });
}

function addInventory() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter the product ID of the item you wish to restock.',
                name: 'item'
            },
            {
                type: 'input',
                message: 'How many units would you like to add?',
                name: 'stock'
            }
        ]).then(function (answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id == answer.item) {
                    // console.log(res[i]);
                    item = res[i];
                    newInventory = parseInt(item.stock_quantity) + parseInt(answer.stock);
                    // console.log(newInventory);
                }
            }
            connection.query('UPDATE products SET ? WHERE ?',
                [{
                    stock_quantity: newInventory
                },
                {
                    item_id: answer.item
                }
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log('Stock quantity for ' + item.product_name + ' has been updated to ' + newInventory);
                    returnMenu();
                });
        });
    });
}

function newProduct() {
    connection.query('SELECT * FROM products', function (err, res) {
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter the product name.',
                name: 'product'
            },
            {
                type: 'input',
                message: 'Enter the department name of your product.',
                name: 'department'
            },
            {
                type: 'input',
                message: 'Set the price of one unit.',
                name: 'price'
            },
            {
                type: 'input',
                message: 'Set the stock quantity of your product.',
                name: 'stock'
            }
        ]).then(function (answer) {
            connection.query('INSERT INTO products SET ?',
                {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(answer.product + ' has been added to ' + answer.department + ' at ' + answer.price + ' per unit with ' + answer.stock + ' units in stock.');
                    returnMenu();
                });
        });
    });

}