import Database from './Database';

const database = new Database();

export default class Payment {

  addPayment(p) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO payment (name, bank, agency, account) VALUES (?, ?, ?, ?)', 
          [
            p.name,
            p.bank,
            p.agency,
            p.account            
          ]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          database.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  deletePaymentById(id) {
    return new Promise((resolve) =>{
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM payment WHERE _id = ?', [id]).then(([tx, results]) => {
            console.log("Payment deleted!");
            resolve(results);            
          });
        }).then((result) => {
          database.closeDatabase(db);                
        }).catch((err) => {
          console.log(err);
          resolve(err);          
        });        
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  findPaymentById(id) {
    return new Promise((resolve) => {
      const payment = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM payment WHERE _id = ?', [id]).then(([tx, results]) => {
            console.log(results);
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }                          
          });
        }).then(result => {
          database.closeDatabase(db)
          console.log(result);
        }).catch(err => {
          console.log(err);
        });
      }).catch(err => {
        console.log(err);
      });
    });
  }

  listPaymentsItems() {
    return new Promise((resolve) => {
      const payments = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM payment ', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`ID Payment: ${row._id}, Payment Name: ${row.name}`);
              const { _id, name } = row;
              payments.push({
                id: _id,
                item: name,                
              });
            }
            console.log(payments);
            resolve(payments);
          });
        }).then((result) => {
          database.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  listPayments() {
    return new Promise((resolve) => {
      const payments = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM payment ', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`ID Payment: ${row._id}, Payment Name: ${row.name}`);
              const { _id, name } = row;
              payments.push({
                _id,
                name,                
              });
            }
            console.log(payments);
            resolve(payments);
          });
        }).then((result) => {
          database.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }
}