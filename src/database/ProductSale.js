import Database from './Database';

const database = new Database();

export default class ProductSale {

  addProductSale(p) {    
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {          
          tx.executeSql('INSERT INTO productsale (idsale, idproductsellingway, productprice, netprice) VALUES (?, ?, ?, ?)', 
          [
            p.idSale,
            p.idProductSellingWay,            
            p.productPrice,            
            p.netPrice            
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

  editProductSale(p) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE productsale SET productprice = ?, netprice = ? WHERE _id = ?', 
          [            
            p.productPrice,             
            p.netPrice,
            p.id
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

  deleteProductSale(id) {
    return new Promise((resolve) =>{
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM productsale WHERE _id = ?', [id]).then(([tx, results]) => {
            console.log(results);
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

  findProductSale(id) {
    return new Promise((resolve) => {
      const productSale = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
        tx.executeSql('SELECT ps._id AS _id, ps.productprice, ps.netprice, ' +
                      's._id AS idsale, ' +
                      'p._id AS idproduct, ' +
                      'p.code, p.name AS productname, p.measures, sw._id AS idsellingway, sw.name ' +
                      'FROM productsale AS ps JOIN productsellingway AS psw ON ps.idproductsellingway = psw._id ' +
                      'JOIN product AS p ON psw.idproduct = p._id ' +
                      'JOIN sellingway AS sw ON psw.idsellingway = sw._id ' +
                      'JOIN sale AS s ON ps.idsale = s._id WHERE ps._id = ? ', [id]).then(([tx,results]) => {
            console.log("Query completed", results.rows.length);
            // var len = results.rows.length;
            // for (let i = 0; i < len; i++) {
            //   let row = results.rows.item(i);              
            //   console.log("ESSE", results.rows.item(0));
            //   const { _id, productprice, idsale, idproduct, productname, idsellingway, netprice, code, measures, name } = row;
            //   productSale.push({
            //     _id,
            //     sale: {
            //       idsale: idsale,
            //     },
            //     product: {
            //       idproduct: idproduct,
            //       name: productname,
            //       code: code,
            //       measures: measures
            //     },
            //     sellingWay: {
            //       idsellingway: idsellingway,
            //       name: name
            //     },                
            //     productprice, 
            //     netprice
            //   });
            // }
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }
            //console.log(productSale);
            //resolve(productSale);                        
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

  listProductSale(id) {
    return new Promise((resolve) => {
      const productSale = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
        tx.executeSql('SELECT ps._id AS _id, ps.productprice, ps.netprice, ' +
                      's._id AS idsale, ' +
                      'p._id AS idproduct, ' +
                      'p.code, p.name AS productname, p.measures, sw._id AS idsellingway, sw.name ' +
                      'FROM productsale AS ps JOIN productsellingway AS psw ON ps.idproductsellingway = psw._id ' +
                      'JOIN product AS p ON psw.idproduct = p._id ' +
                      'JOIN sellingway AS sw ON psw.idsellingway = sw._id ' +
                      'JOIN sale AS s ON ps.idsale = s._id WHERE ps.idsale = ? ', [id]).then(([tx,results]) => {
            console.log("Query completed", results.rows.length);
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);              
              console.log("ESSE", results.rows.item(0));
              const { _id, productprice, idsale, idproduct, productname, idsellingway, netprice, code, measures, name } = row;
              productSale.push({
                _id,
                sale: {
                  idsale: idsale,
                },
                product: {
                  idproduct: idproduct,
                  name: productname,
                  code: code,
                  measures: measures
                },
                sellingWay: {
                  idsellingway: idsellingway,
                  name: name
                },                
                productprice, 
                netprice
              });
            }
            console.log(productSale);
            resolve(productSale);
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