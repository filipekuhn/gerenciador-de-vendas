import Database from './Database';

const database = new Database();

export default class Sale {

  addSale(s) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO sale (date, idcustomer, ' +
          'idsellingway, observations, saleprice, finalprice, pendingpayment) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?)', 
          [
            s.date,            
            s.idcustomer,
            s.idsellingway,
            s.observations,
            s.saleprice,
            s.finalprice,
            s.pendingpayment,                       
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

  editSale(p) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE sale SET name = ?, code = ?, measures = ? WHERE _id = ?', 
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

  deleteSaleById(id) {
    return new Promise((resolve) =>{
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM sale WHERE _id = ?', [id]).then(([tx, results]) => {
            console.log("Sale deleted!");
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

  findSaleById(id) {
    return new Promise((resolve) => {
      const sale = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM sale WHERE _id = ?', [id]).then(([tx, results]) => {
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

  listSalesItems() {
    return new Promise((resolve) => {
      const sales = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM sale ', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`ID Sale: ${row._id}, Sale Name: ${row.name}`);
              const { _id, name } = row;
              sales.push({
                id: _id,
                item: name,                
              });
            }
            console.log(sales);
            resolve(sales);
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

  listSales() {
    return new Promise((resolve) => {
      const sales = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT s.*, c._id, c.name AS customername, sw._id, sw.name AS sellingwayname FROM sale AS s ' +
            'JOIN customer AS c ON s.idcustomer = c._id JOIN sellingway AS sw ON s.idsellingway = sw._id ' +
            'ORDER BY "date" DESC;', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(row);
              const { 
                _id, 
                date,                                  
                observations, 
                saleprice, 
                finalprice, 
                pendingpayment,
                idcustomer, 
                customername, 
                idsellingway, 
                sellingwayname ,
              } = row;
              sales.push({
                _id, 
                date,                  
                observations, 
                saleprice, 
                finalprice, 
                pendingpayment,
                customer: { _id: idcustomer, name: customername},
                sellingway: { _id: idsellingway, name: sellingwayname }                 
              });
            }
            console.log(sales);
            resolve(sales);
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