import SQLite from "react-native-sqlite-storage";
import Database from './Database';

const database = new Database();

export default class City {

  addCity(c) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO city (name, uf) VALUES (?, ?)', 
          [
            c.name,
            c.uf
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

  editCity(c) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE city SET name = ?, uf = ? WHERE _id = ?', 
          [
            c.name,
            c.uf,
            c._id
          ]).then((result) => {
            console.log(result);
            database.closeDatabase(db);
            resolve(true);
          }).catch((err) => {
            console.log(err);
            resolve(false);
          });
        }).catch((err) => {
          console.log(err);
          resolve(false);
        })
      }); 
    });
  }

  deleteCity(id) {
    return new Promise((resolve) =>{
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM city WHERE _id = ?', [id]).then(([tx, results]) => {
            console.log(results);                   
          });
        }).then((result) => {
          database.closeDatabase(db);                
          resolve(true);     
        }).catch((err) => {
          console.log(err);
          resolve(false);          
        });        
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  listCities() {
    return new Promise((resolve) => {
      const cities = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM city ORDER BY uf, name', []).then(([tx,results]) => {
            console.log("Query completed on table city");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              //console.log(`ID City: ${row._id}, City Name: ${row.name}, City UF: ${row.uf}`);
              const { _id, name, uf } = row;
              cities.push({
                id: _id,
                item: name + " - " + uf,                
              });
            }
            //console.log(cities);
            resolve(cities);
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

  findCityById(id) {
    return new Promise((resolve) => {
      const city = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM city WHERE _id = ?', [id]).then(([tx, results]) => {
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

}