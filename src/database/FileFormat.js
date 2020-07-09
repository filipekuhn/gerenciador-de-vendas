import Database from './Database';

const database = new Database();

export default class FileFormat {

  addFileFormat(f) {
    return new Promise((resolve) => {
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO fileformat (name) VALUES (?)', 
          [
            f.name            
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

  deleteFileFormatById(id) {
    return new Promise((resolve) =>{
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM fileformat WHERE _id = ?', [id]).then(([tx, results]) => {
            console.log("File Format deleted!");
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

  findFileFormatById(id) {
    return new Promise((resolve) => {
      const sellingway = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM fileformat WHERE _id = ?', [id]).then(([tx, results]) => {
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

  listFileFormatsItems() {
    return new Promise((resolve) => {
      const fileformats = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM fileformat ', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`ID File Format: ${row._id}, File Format Name: ${row.name}`);
              const { _id, name } = row;
              fileformats.push({
                id: _id,
                item: name,                
              });
            }
            console.log(fileformats);
            resolve(fileformats);
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

  listFileFormat() {
    return new Promise((resolve) => {
      const fileformats = [];
      database.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM fileformat ', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`ID File Format: ${row._id}, File Format Name: ${row.name}`);
              const { _id, name } = row;
              fileformats.push({
                _id,
                name,                
              });
            }
            console.log(fileformats);
            resolve(fileformats);
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