/*************************************************
 * LOGIN ENGINE
 *************************************************/

const API_URL =
"https://script.google.com/macros/s/AKfycbzp1pGPPjLr26534rC7LAy1WgDIAONBXUm5Wdysz8Ddqtu2GhcBbi0C0PLnyWJUQ20x/exec";

document.getElementById("btnLogin").onclick = login;

document.getElementById("password").addEventListener("keypress",function(e){

    if(e.key=="Enter"){

        login();

    }

});

async function login(){

    const username=document.getElementById("username").value.trim();
    const password=document.getElementById("password").value.trim();
	
	console.log("Username =", "[" + username + "]");
	console.log("Password =", "[" + password + "]");

    const info=document.getElementById("loginInfo");

	if(username !== "putija"){
    info.innerHTML = "Username salah";
    return;
	}

	if(password !== "putija123"){
    info.innerHTML = "Password salah";
    return;
	}

    info.innerHTML="Memeriksa Login...";

    try{

        const response=await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"login",

                username:username,

                password:password

            })

        });

        const data=await response.json();

        if(data.success){

            sessionStorage.setItem("login","true");

            sessionStorage.setItem("username",username);

            sessionStorage.setItem("nama",data.nama);

            sessionStorage.setItem("role",data.role);

            sessionStorage.setItem("workzone",data.workzone);

            sessionStorage.setItem("loginTime",Date.now());

            sessionStorage.setItem("lastActivity",Date.now());

            location.href="index.html";

        }else{

            info.innerHTML=data.message;

        }

    }catch(err){

        console.log(err);

        info.innerHTML="Tidak dapat terhubung ke server.";

    }

}
document.getElementById("showPass").onclick=function(){

    const p=document.getElementById("password");

    p.type=p.type=="password"?"text":"password";

}
