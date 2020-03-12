const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const server = require('http').Server(app);
const port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


const mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'ei7veeChu4bLK',
    database: 'EmployeeDbB'
})

mysqlConnection.connect((error) => {
        if(!error) {
            console.log('DB connected')
        }else {
            console.log(error)
        }
})

server.listen(port, () => {
    console.log('Server starting - ' + `http://localhost:${port}/`);
});


app.get('', (req, res)=>{
    mysqlConnection.query('SELECT * FROM employee', (errror, rows, fields)=>{
        if(!errror){
            res.send(rows)
        } else{
            console.log(errror)
        }
    })
})

app.get('/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.delete('/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id : '+element[0].EmpID);
            });
        else
            console.log(err);
    })
});