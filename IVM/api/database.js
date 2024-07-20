const db = require('better-sqlite3')('./data/database.db');

class Query {
  static addItem = db.prepare(
    'INSERT INTO inventory (itemname, class, price, quantity) VALUES (?, ?, ?, ?)'
  );

  static editItem = db.prepare(
    'UPDATE inventory SET itemname = ?, class = ?, price = ?, quantity = ? WHERE itemname = ?'
  );

  static deleteItem = db.prepare('DELETE FROM inventory WHERE itemname = ?');
  static readItems = db.prepare('SELECT * FROM inventory');

  static addQty = db.prepare(
    'UPDATE inventory SET quantity = quantity + ? WHERE itemname = ?'
  );

  static subQty = db.prepare(
    'UPDATE inventory SET quantity = quantity - ? WHERE itemname = ?'
  );

  static saveTransactions = db.prepare(
    'INSERT INTO transactions (buydate, itemname, class, price, quantity) VALUES (?, ?, ?, ?, ?)'
  );

  static getTransactions = db.prepare(
    'SELECT * FROM transactions WHERE DATETIME(buydate) BETWEEN DATETIME(?) AND DATETIME(?)'
  );

  static ErrorHandler(err, sqlCommand) {
    console.error(
      `\nERROR : [${sqlCommand}]
        message : ${err.message},
        code    : ${err.code}\n`
    );
  }

  static CreateInventoryTable = function(db) {
    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS inventory (
          itemname TEXT PRIMARY KEY NOT NULL,
          class TEXT NOT NULL,
          price REAL NOT NULL,
          quantity INTEGER NOT NULL
        )
      `);
      console.log('Inventory table created successfully');
    } catch (err) {
      this.ErrorHandler(err, 'CreateInventoryTable');
    }
  };

  static CreateTransactionTable = function(db) {
    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS transactions (
          buydate DATETIME NOT NULL,
          itemname TEXT NOT NULL,
          class TEXT NOT NULL,
          price REAL NOT NULL,
          quantity INTEGER NOT NULL
        )
      `);
      console.log('Transactions table created successfully');
    } catch (err) {
      this.ErrorHandler(err, 'CreateTransactionTable');
    }
  };
}

Query.CreateInventoryTable(db);
Query.CreateTransactionTable(db);

module.exports = Query;
