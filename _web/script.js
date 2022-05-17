function MoveWebsite(Page_location){
    var MainFrame = document.getElementById("Main_Body_iFrame");
    MainFrame.src = Page_location;
}

function LoginUser_or_Register(isRegister = false){
    var UserName = document.getElementById("Username").value;
    var Password = document.getElementById("Password").value;
    var Response;
    if (isRegister){
        var Password_Ver = document.getElementById("Password_Ver").value;

        Send_Post_Info("Register_User.html","Username="+UserName+"&Password="+Password+"&Password_Ver="+Password_Ver,"Response_Tag").then((resp)=> {
            if (resp == "User account has been succesfully created!"){
                setTimeout(() => {
                window.location.href = 'Login.html';
                }, 1000);
            }
        });

    }else{
        Send_Post_Info("Login_User.html","Username="+UserName+"&Password="+Password,"Response_Tag").then((resp)=>{
            if (resp == "Logged in!"){
                setTimeout(() => {
                    window.location.href = 'Home.html';
                }, 1000);
            }
        });
    }
    
}


function Send_Post_Info(file,value,responseID){
    return new Promise((resolve,reject)=> {
        var xttp = new XMLHttpRequest();
        xttp.onreadystatechange = function(){
            if(xttp.readyState == 4 && xttp.status == 200){
                var response = this.responseText;
                document.getElementById(responseID).innerText = response;
                resolve(response);
            }
        }
        xttp.open("POST",file,true);
        xttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xttp.send(value); 
    });
}