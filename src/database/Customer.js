import SQLite from "react-native-sqlite-storage";
import Database from './Database';

const database = new Database();

export default class Customer {

  addCustomer(c) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO customer (name, email, phone, idfileformat, idcity, idsellingway, comments, registrationdate) VALUES (?, ?, ?, ?, ?, ? ,?, ?)', 
          [
            c.name, 
            c.email,
            c.phone,
            c.idfileformat,
            c.idcity,
            c.idsellingway,
            c.comments,
            c.registrationdate
          ]).then(([tx, results]) => {
            resolve(true);
          });
        }).then((result) => {
          database.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
          resolve(false)
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  editCustomer(c) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE customer SET name = ?, email = ?, phone = ?, idfileformat = ?, idcity = ?, idsellingway = ?, comments = ? WHERE _id = ?', 
          [
            c.name, 
            c.email,
            c.phone,
            c.idfileformat,
            c.idcity,
            c.idsellingway,  
            c.comments,          
            c._id
          ]).then(([tx, results]) => {
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

  deleteCustomerById(id) {
    return new Promise((resolve) =>{
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM customer WHERE _id = ?', [id]).then(([tx, results]) => {
            console.log("Customer deleted!");
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

  findCustomerById(id) {
    return new Promise((resolve) => {
      const customer = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM customer WHERE _id = ?', [id]).then(([tx, results]) => {
            console.log(results);
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }                          
          });
        }).then(result => {
          database.closeDatabase(db)
        }).catch(err => {
          console.log(err);
        });
      }).catch(err => {
        console.log(err);
      });
    });
  }

  listCustomer() {
    return new Promise((resolve) => {
      const customers = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM customer ', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`ID Customer: ${row._id}, Customer Name: ${row.name}, Customer Email: ${row.email}, Customer Telefone: ${row.phone}, Registro: ${row.registrationdate}`)
              const { _id, name, email, phone, idfileformat, idsellingway, idcity, comments, registrationdate } = row;
              customers.push({
                _id,
                name,
                email,
                phone,
                idfileformat,
                idsellingway,
                idcity,
                comments,
                registrationdate                               
              });
            }
            console.log(customers);
            resolve(customers);
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

  listCustomerItems() {
    return new Promise((resolve) => {
      const customers = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT _id, name FROM customer ORDER BY name ASC', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(results);
              const { _id, name } = row;
              customers.push({
                id: _id,
                item: name
              });
            }
            console.log(customers);
            resolve(customers);
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

  deleteAllCustomer() {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM customer', []).then(([tx, results]) => {
            resolve(results);
            console.log(results.rowsAffected);
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

  dropTableCustomer() {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DROP TABLE customer', []).then(([tx, results]) => {
            resolve(results);
            console.log(results.rowsAffected);
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