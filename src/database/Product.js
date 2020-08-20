import Database from './Database';

const database = new Database();

export default class Product {

  addProduct(p) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO product (name, code, measures) VALUES (?, ?, ?)', 
          [
            p.name,
            p.code,
            p.measures,            
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

  editProduct(p) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE product SET name = ?, code = ?, measures = ? WHERE _id = ?', 
          [
            p.name,
            p.code,
            p.measures,             
            p._id
          ]).then(([tx, results]) => {
            resolve(true);
          });
        }).then((result) => {
          database.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  deleteProductById(id) {
    return new Promise((resolve) =>{
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM product WHERE _id = ?', [id]).then(([tx, results]) => {
            console.log("Product deleted!");
            resolve(results);            
          });
        }).then((result) => {
          database.closeDatabase(db);                
        }).catch((err) => {
          console.log(err);
          resolve(false);          
        });        
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  findProductById(id) {
    return new Promise((resolve) => {
      const product = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM product WHERE _id = ?', [id]).then(([tx, results]) => {
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

  listProductsItems() {
    return new Promise((resolve) => {
      const products = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM product ', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`ID Product: ${row._id}, Product Name: ${row.name}`);
              const { _id, name } = row;
              products.push({
                id: _id,
                item: name,                
              });
            }
            console.log(products);
            resolve(products);
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

  listProducts() {
    return new Promise((resolve) => {
      const products = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM product ', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`ID Product: ${row._id}, Product Name: ${row.name}`);
              const { _id, name, code, measures } = row;
              products.push({
                _id,
                name,
                code,
                measures                
              });
            }
            console.log(products);
            resolve(products);
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