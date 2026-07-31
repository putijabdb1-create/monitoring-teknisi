/*************************************************
 * LOGIN ENGINE
 *************************************************/

document.getElementById("btnLogin").onclick=function(){

    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;

    if(username=="putija" && password=="putija123"){

        sessionStorage.setItem("login","true");
        sessionStorage.setItem("username",username);
        sessionStorage.setItem("role","ADMIN");
        sessionStorage.setItem("loginTime",Date.now());
        sessionStorage.setItem("lastActivity",Date.now());

        location.href="index.html";

    }else{

        alert("Username atau Password salah.");

    }

}
