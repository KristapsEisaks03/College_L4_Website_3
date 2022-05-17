const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const fs = require('fs'), readline = require("readline"); // file reader


// to use my own functions


// SESSION AND COOCKIE CONTROL
const oneDay = 1000 * 60 * 60 * 24;
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

//
var sanitizer_string = require("string-sanitizer");


// session middleware
app.use(sessions({
    secret: "thisismysecrctekeyaadsdsvewgv5qresdf@ASdf;dg",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(express.static(__dirname+'/_web'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));



function Check_Login(Users,Password){
    return new Promise((resolve,reject)=> {

        // This is to check whether they have inserted symbols or no
        if(sanitizer_string.sanitize(Users) == Users && sanitizer_string.sanitize(Password)==Password){
            // get sanitized results
            Users = sanitizer_string.sanitize(Users);
            Password = sanitizer_string.sanitize(Password);

            var userFound = false;

            const readInterface = readline.createInterface({
                input: fs.createReadStream(__dirname+'/_users/Users.txt')
            });

            readInterface.on('line', function(chunk) {
                //console.log(chunk);
                if(chunk.split('|')[0] == Users && chunk.split('|')[1] == Password){
                    //console.log("Found user");
                    userFound = true;
                    readInterface.close(); // to stop the reader from continuing to save peformance
                    readInterface.removeAllListeners()
                }
            });

            readInterface.on('end',function() {
                if (userFound){
                    resolve("true");
                }else{
                    resolve("false");
                }
            });

            readInterface.on('close',function() {
                if (userFound){
                    resolve("true");
                }else{
                    resolve("false");
                }
            });

            readInterface.on('error', function (error) {
                console.log(`error: ${error.message}`);
            });

            
        }
        else{
            resolve("Please make sure you have not inserted any symbols");
        }
    });

}

app.post('/Login_User.html',(req,res)=>{
    try {
        if(req.body.Username == "" || req.body.Password == ""){
            //console.log(req.body.Name +"|"+req.body.Pass);
            res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
        }else{

            var UserName = req.body.Username;
            var Pass = req.body.Password;
            //console.log(req.body.Name +"|"+req.body.Pass);

            // var returnVal = Check_Login(UserName,Pass);
            Check_Login(UserName,Pass).then((resp)=> {
                

                if(resp == "true"){
                    session=req.session;
                    session.userid=UserName;
                    // console.log(req.session);

                    res.send("Logged in!");
                }else if (resp == "false"){
                    res.send('Invalid username or password');
                }else{
                    res.send("Unkown error has occured");
                }
            });

        }

    } catch (error) {
        console.log(error);
        res.send("Unknown error has occured...");
    }
});

function UserName_Found(Users){
    return new Promise((resolve,reject)=> {

        var userFound = false;

        const readInterface = readline.createInterface({
            input: fs.createReadStream(__dirname+'/_users/Users.txt'),
            output: process.stdout,
            console: false
        });

        readInterface.on('line', function(chunk) {
            //data += chunk;
            // check whether password and username is matching
            //console.log("Username|"+Users+"|password|"+Password);
            if(chunk.split('|')[0] == Users){
                //console.log("Found user");
                userFound = true;
                readInterface.close(); // to stop the reader from continuing to save peformance
                readInterface.removeAllListeners();
            }
        });
        
        readInterface.on('end',function() {
            if (userFound){
                resolve("true");
            }else{
                resolve("false");
            }
        });

        readInterface.on('close',function() {
            if (userFound){
                resolve("true");
            }else{
                resolve("false");
            }
        });

        readInterface.on('error', function (error) {
            console.log(`error: ${error.message}`);
        });


    });
}

function Register_User(Users,Password, Password_Ver){
    return new Promise((resolve,reject)=> {

        // This is to check whether they have inserted symbols or no
        if(sanitizer_string.sanitize(Users) == Users && sanitizer_string.sanitize(Password)==Password &&  sanitizer_string.sanitize(Password_Ver)==Password_Ver){
            // get sanitized results
            Users = sanitizer_string.sanitize(Users);
            Password = sanitizer_string.sanitize(Password);

            // check whether the user exists already
            UserName_Found(Users).then((resp)=> {
                // console.log(resp);
                if(resp == "true"){
                    resolve('found');
                }else if (resp == "false"){
                    fs.appendFile(__dirname+'/_users/Users.txt',"\n"+Users+"|"+Password, function(err){
                        if (err) {
                            console.log(err);
                          }
                    });
                    resolve("true");
                }else{
                    resolve("error");
                }
            });
        }
        else{
            resolve("Please make sure you have not inserted any symbols");
        }
    });

}


app.post('/Register_User.html',(req,res)=>{
    try {
        if(req.body.Username == "" || req.body.Password == "" || req.body.Password_Ver==""){
            //console.log(req.body.Name +"|"+req.body.Pass);
            res.send("Each information must be filled!");
        }else{

            var UserName = req.body.Username;
            var Pass = req.body.Password;
            var Pass_Ver = req.body.Password_Ver;


            if (Pass != Pass_Ver){
                res.send("Ensure that both password and verification password are equal!");
            }else{
                Register_User(UserName,Pass,Pass_Ver).then((resp)=> {
                
                    if(resp == "true"){
                        res.send("User account has been succesfully created!");
                    }else if (resp == "found"){
                        res.send('User with this name already exists!');
                    }else{
                        res.send("Unkown error has occured");
                    }
                });
            }
        }

    } catch (error) {
        console.log(error);
        res.send("Unknown error has occured...");
    }
});






app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/_web/index.html");
});


app.get('/CheckUserLoggedIn',(req,res)=>{
    if(req.session.userid){
        res.send("true|"+req.session.userid);
    }else{

        res.send("false");
    }
});

app.listen(3000,function(){
    console.log("Oi MANNNNNNNN server is running on port 3000");
});

