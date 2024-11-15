const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const {v4 : uuidv4} = require("uuid"); 
const methodOverride = require('method-override');
const mysql = require('mysql2');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname,"public")));

app.listen(port,()=>{
    console.log(`Listening at port ${port}`);
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'postyweb',
    password: 'targetinternship'
});

// let q=`SHOW TABLES;`;
// connection.query(q,(err, results) => {
//       console.log(results);
//     }
// );






















app.get("/posts",(req,res)=>{
    let q=`SELECT * FROM posts`;
    try{
        connection.query(q,(err, posts) => {
            if(err) throw err;
            res.render("index.ejs",{ posts });
        });
    }catch(err){
        res.send("ERROR");
    }
});

app.get("/posts/new",(req,res)=>{
    res.render("new.ejs");
});

app.post("/posts",(req,res)=>{
    let {username, content}=req.body;

    if(username!=="" && content!==""){
        let data=[uuidv4(),username,content];
        let q=`INSERT INTO posts 
                (id,username,content)
                VALUES
                (?,?,?)`;
        try{
            connection.query(q,data,(err, posts) => {
                if(err) throw err;
                res.render("index.ejs",{ posts });
            });
        }catch(err){
            res.send("ERROR");
        }
    }
    res.redirect("http://localhost:8080/posts");
});

app.get("/posts/update/:id",(req,res)=>{
    let { id }=req.params;
    let q=`SELECT * FROM posts WHERE id="${id}";`;
    
    try{
        connection.query(q,(err, result) => {
            if(err) throw err;
            res.render("update.ejs",{ currPost: result[0] });
        });
    }catch(err){
        res.send("ERROR");
    }   
});

app.patch("/posts/:id",(req,res)=>{
    let { id }=req.params;
    console.log(req.body.content);
    let q=`UPDATE posts SET content = "${req.body.content}" WHERE id="${id}";`;
    
    try{
        connection.query(q,(err, result) => {
            if(err) throw err;
            res.redirect("http://localhost:8080/posts");
        });
    }catch(err){
        res.send("ERROR");
    }   
});

app.get("/posts/view/:id",(req,res)=>{
    let { id }=req.params;
    let q=`SELECT * FROM posts WHERE id="${id}";`;
    
    try{
        connection.query(q,(err, result) => {
            if(err) throw err;
            res.render("view.ejs",{ currPost: result[0] });
        });
    }catch(err){
        res.send("ERROR");
    }
});

app.get("/posts/delete/:id",(req,res)=>{
    let { id }=req.params;
    let q=`DELETE FROM posts WHERE id="${id}";`;

    try{
        connection.query(q,(err, result) => {
            if(err) throw err;

            res.redirect("http://localhost:8080/posts");
        });
    }catch(err){
        res.send("ERROR");
    }
});