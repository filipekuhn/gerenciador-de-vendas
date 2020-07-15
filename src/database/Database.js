import SQLite from "react-native-sqlite-storage";
import Cities from '../utils/cities.json';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "gerenciadordevendas.db";
const database_version = "1.0";
const database_displayname = "Banco de Dados Gerenciador de Vendas";
const database_size = 200000;
const cities = Cities.cities

export default class Database {

  initDB() {
    let db;
    return new Promise((resolve) => {
      console.log("Plugin integrity check ...");
      SQLite.echoTest()
        .then(() => {
          console.log("Integrity check passed ...");
          console.log("Opening database ...");
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size
          )
            .then(DB => {
              db = DB;
              console.log("Database OPEN");
              db.executeSql('SELECT 1 FROM city LIMIT 1').then(() => {
                  console.log("Database is ready ... executing query ...");
              }).catch((error) =>{
                  console.log("Received error: ", error);
                  console.log("Database not yet ready ... populating data");
                  db.transaction((tx) => {
                      tx.executeSql('CREATE TABLE IF NOT EXISTS product (_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, code TEXT, measures TEXT);');
                      tx.executeSql('CREATE TABLE IF NOT EXISTS sellingway (_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);');
                      tx.executeSql('CREATE TABLE IF NOT EXISTS productsellingway (_id INTEGER PRIMARY KEY AUTOINCREMENT, idproduct INTEGER NOT NULL, idsellingway INTEGER NOT NULL, siteinclusiondate TEXT, saleprice DOUBLE, sitecommission DOUBLE, netprice DOUBLE, FOREIGN KEY (idproduct) REFERENCES product(_id) ON DELETE CASCADE, FOREIGN KEY(idsellingway) REFERENCES sellingway(_id) ON DELETE CASCADE);');
                      tx.executeSql('CREATE TABLE IF NOT EXISTS city (_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, uf VARCHAR(2) NOT NULL);');
                      tx.executeSql('CREATE TABLE IF NOT EXISTS fileformat (_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);');
                      tx.executeSql('CREATE TABLE IF NOT EXISTS customer (_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT, phone TEXT, idfileformat INTEGER, idcity INTEGER, idsellingway INTEGER, comments TEXT, registrationdate TEXT NOT NULL, FOREIGN KEY(idfileformat) REFERENCES fileformat(_id), FOREIGN KEY(idcity) REFERENCES city(_id), FOREIGN KEY(idsellingway) REFERENCES sellingway(_id));');
                      tx.executeSql('CREATE TABLE IF NOT EXISTS payment (_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, bank TEXT, agency TEXT, account TEXT);');
                      tx.executeSql('CREATE TABLE IF NOT EXISTS sale (_id INTEGER PRIMARY KEY AUTOINCREMENT, idproductsale INTEGER, idcustomer INTEGER, idsellingway INTEGER, observations TEXT, saleprice DOUBLE, finalprice DOUBLE, pendingpayment BOOLEAN NOT NULL, idpayment INTEGER, FOREIGN KEY(idproductsale) REFERENCES productsale(_id), FOREIGN KEY (idcustomer) REFERENCES customer (_id), FOREIGN KEY (idsellingway) REFERENCES sellingway (_id), FOREIGN KEY (idpayment) REFERENCES payment (_id));');
                      tx.executeSql('CREATE TABLE IF NOT EXISTS productsale (_id INTEGER PRIMARY KEY AUTOINCREMENT, idproduct INTEGER, idsale INTEGER, idproductsellingway INTEGER, productprice DOUBLE, netprice DOUBLE, FOREIGN KEY (idproduct) REFERENCES product (_id), FOREIGN KEY (idsale) REFERENCES sale (_id), FOREIGN KEY (idproductsellingway) REFERENCES productsellingway (_id));');
                  }).then(() => {
                      console.log("Tables created successfully");                      
                  }).catch(error => {
                      console.log(error);
                  });
              });
              db.executeSql('SELECT 1 FROM city LIMIT 1').then(() => {                
                console.log("Table City already filled");              
              }).catch((error) => {
                console.log("Receive error from table CITY: ", error);
                db.transaction((tx) => {
                  cities.forEach(element => {
                    tx.executeSql('INSERT INTO city (_id, name, uf) VALUES (?, ?, ?)', [
                      element.id,
                      element.name,
                      element.uf
                    ]);
                  });
                });
              });
              resolve(db);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log("echoTest failed - plugin not functional");
        });
      });
  };

  closeDatabase(db) {
    if (db) {
      console.log("Closing DB");
      db.close()
        .then(status => {
          console.log("Database CLOSED");
        })
        .catch(error => {
          //this.errorCB(error);
          console.log(error);
        });
    } else {
      console.log("Database was not OPENED");
    }
  };

  dropTableCities() {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DROP TABLE city', []).then(([tx, results]) => {
            resolve(results);
            console.log(results.rowsAffected);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });
  }

/*  productById(id) {
    console.log(id);
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Product WHERE prodId = ?', [id]).then(([tx,results]) => {
            console.log(results);
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }*/




}