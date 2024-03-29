import Database from './Database';

const database = new Database();

export default class ProductSellingWay {

  addProductSellingWay(p) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO productsellingway (idproduct, idsellingway, siteinclusiondate, saleprice, sitecommission, netprice) VALUES (?, ?, ?, ?, ?, ?)', 
          [
            p.idProduct,
            p.idSellingWay,
            p.siteInclusionDate,
            p.salePrice,
            p.siteCommission,
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

  editProductSellingWay(p) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE productsellingway SET siteinclusiondate = ?, saleprice = ?, sitecommission = ?, netprice = ? WHERE _id = ?', 
          [
            p.siteInclusionDate,
            p.salePrice,
            p.siteCommission,   
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

  deleteProductSellingWay(id) {
    return new Promise((resolve) =>{
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM productsellingway WHERE _id = ?', [id]).then(([tx, results]) => {
            console.log(results);
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

  findProductSellingWay(id) {
    return new Promise((resolve) => {
      const product = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT psw._id, psw.netprice, psw.saleprice, psw.sitecommission, psw.siteinclusiondate, ' +
                        'p._id AS idproduct, p.name, sw._id AS idsellingway, sw.name AS sellingwayname ' +
                        'FROM productsellingway AS psw JOIN product AS p ON psw.idproduct = p._id ' +
                        'JOIN sellingway AS sw ON psw.idsellingway = sw._id WHERE psw._id = ?', [id]).then(([tx, results]) => {
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
          tx.executeSql('SELECT p._id AS idproduct, p.name, sw._id AS idsellingway, sw.name AS sellingwayname, psw._id, ' +
                        'psw.siteinclusiondate, psw.saleprice, psw.sitecommission, psw.netprice ' + 
                        'FROM productsellingway AS psw JOIN product AS p ON psw.idproduct = p._id ' + 
                        'JOIN sellingway AS sw ON psw.idsellingway = sw._id', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`ID Product: ${row._id}, Product Name: ${row.name}`);
              const { _id, name, idproduct, idsellingway, sellingwayname, siteinclusiondate, saleprice, sitecommission, netprice } = row;
              products.push({
                id: _id,
                item: name + " - " + sellingwayname,
                product: {
                  id: idproduct,
                  name: name
                },
                sellingWay: {
                  id: idsellingway,
                  name: sellingwayname
                },
                siteinclusiondate: siteinclusiondate,
                saleprice: saleprice,
                sitecommission: sitecommission,
                netprice: netprice
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

  listProductSellingWay(id) {
    return new Promise((resolve) => {
      const productSellingWay = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
        tx.executeSql('SELECT psw._id AS _id, psw.siteinclusiondate, psw.saleprice, psw.sitecommission, ' +
                      'psw.netprice, p._id AS idproduct, p.code, p.measures, sw._id AS idsellingway, ' +
                      'sw.name FROM productsellingway AS psw JOIN product AS p ON psw.idproduct = p._id JOIN sellingway AS sw ON psw.idsellingway = sw._id WHERE idproduct = ? ', [id]).then(([tx,results]) => {
            console.log("Query completed", results.rows.length);
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              //console.log(`ID ProductSellingWay: ${row._id}, ProductSellingWay SalePrice: ${row.saleprice}`);
              console.log("ESSE", results.rows.item(0));
              const { _id, idproduct, idsellingway, siteinclusiondate, saleprice, sitecommission, netprice, code, measures, name } = row;
              productSellingWay.push({
                _id,
                product: {
                  idproduct: idproduct,
                  code: code,
                  measures: measures
                },
                sellingWay: {
                  idsellingway: idsellingway,
                  name: name
                },
                siteinclusiondate, 
                saleprice, 
                sitecommission, 
                netprice
              });
            }
            console.log(productSellingWay);
            resolve(productSellingWay);
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