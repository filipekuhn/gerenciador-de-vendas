import SQLite from "react-native-sqlite-storage";
import Database from './Database';

const database = new Database();

export default class SellingWay {

  addSellingWay(s) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO sellingway (name) VALUES (?)', 
          [
            s.name            
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

  deleteSellingWayById(id) {
    return new Promise((resolve) =>{
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM sellingway WHERE _id = ?', [id]).then(([tx, results]) => {
            console.log("SellingWay deleted!");
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

  findSellingWayById(id) {
    return new Promise((resolve) => {
      const sellingway = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM sellingway WHERE _id = ?', [id]).then(([tx, results]) => {
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

  listSellingWay() {
    return new Promise((resolve) => {
      const sellingways = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM sellingway ', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`ID SellingWay: ${row._id}, SellingWay Name: ${row.name}`);
              const { _id, name } = row;
              sellingways.push({
                _id,
                name,                
              });
            }
            console.log(sellingways);
            resolve(sellingways);
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