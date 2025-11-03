import express from 'express';
import mysql from 'mysql2';

const app = express();
const port = 3000;

app.use(express.json());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "new_schema",
    password: ""
});

connection.connect((err) => {
    if (err) {
        console.err("Error connecting to mySQL", err);
        return;
    }
    console.log("Connected to MySQL Successfully");
})

/*app.post('/api/insert', (req, res) => {
    const { userName, display_Name, command, atdate } = req.body;

    const query = "INSERT INTO new_table(userName, display_Name, command, atdate) VALUES(?,?,?,?)"
    connection.query(query,[userName, display_Name, command, atdate],(err,results)=>{
        if (err){
            console.error("Error inserting data: ",err);
            res.status(500).json({error: "Internal Server Error"});
        }

        res.json({
            msg: "Data inserted Successfully"//,
            //insertedId: results.insertId
        })
    })
})*/
const userName = test444; 
const displayName = test4;
const commandName = weather;
const atdate = 2025-8-25;
const atTime = 0;

connection.query("INSERT INTO `new_table`(userName,display_Name,command,atDate,atTime) VALUES (?,?,?,?,?)", [userName, displayName, commandName, atdate, atTime], (err, res) => {
    if (err) {
        console.log("Error exicuting query", err); //db
        return;
    }
    return console.log(res);
})

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
})
