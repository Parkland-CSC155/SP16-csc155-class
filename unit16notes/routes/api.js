var express = require("express");
var router = express.Router();
var sql = require("mssql");

// an example helper you can use!
var sqlHelper = require('../lib/sql-helper');

// api/search/{searchText}?page=3
router.get("/search/:searchText", function (req, res, next) {

    var page = req.query.page || 1
    var searchText = req.params.searchText;

    var skip = (page - 1) * 25;

    var sql = `
SELECT  *
FROM    NutritionData
WHERE   Shrt_Desc LIKE '${searchText}%'
ORDER BY Shrt_Desc
OFFSET  ${skip} ROWS
FETCH NEXT 25 ROWS ONLY    
    `;

    // do the query 
    sqlHelper.query(sql)
        .then(function (records) {

            // send back JSON
            res.json(records);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get("/:id", function (req, res, next) {

    var id = req.params.id || "0";

    var connectionString = process.env.MS_TableConnectionString;
    sql.connect(connectionString).then(function () {

        var qry = `
SELECT  TOP 1 *
FROM    NutritionData
WHERE   NDB_No = '${id}'
`;

        return new sql.Request().query(qry).then(function(recordset) {
            console.log(recordset);
            
            var record = recordset[0];
            
            res.json(record);
        });

    })
    .catch(function(err){
      console.log(err);
      next(err);  
    });

});

module.exports = router;