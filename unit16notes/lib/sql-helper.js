/* 
    Simple helper class for running queries
    NOTE: this uses promises!
*/

var sql = require("mssql");

var connectionString = process.env.MS_TableConnectionString;

exports.query = function(sqlString){
  
  return sql.connect(connectionString).then(function () {

        return new sql.Request().query(sqlString);

    });
    
};