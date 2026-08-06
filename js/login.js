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
	const t0 = performance.now();
    const username=document.getElementById("username").value.trim();
    const password=document.getElementById("password").value.trim();
	
	console.log("Username =", "[" + username + "]");
	console.log("Password =", "[" + password + "]");

    const info=document.getElementById("loginInfo");
	if(username === "" || password === ""){

    info.innerHTML = "Username dan Password wajib diisi.";

    return;

	}
    const btn = document.getElementById("btnLogin");

	btn.disabled = true;

	btn.innerHTML = `
	<i class="bi bi-arrow-repeat spin"></i>
	Memeriksa...
	`;
info.innerHTML = "Menghubungkan ke server...";

    try{
const controller = new AbortController();

const timer = setTimeout(() => {

    controller.abort();

},30000);

const response = await fetch(

    API_URL +
    "?action=login" +
    "&username=" + encodeURIComponent(username) +
    "&password=" + encodeURIComponent(password) +
    "&_=" + Date.now(),

    {

        cache:"no-store",

        signal:controller.signal

    }

);

clearTimeout(timer);

if(!response.ok){

    throw new Error("HTTP "+response.status);

}
        const data=await response.json();
	console.log(
  	  "Login selesai dalam",
  	  ((performance.now() - t0) / 1000).toFixed(2),
 	   "detik"
	);
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

    console.error(err);

    info.innerHTML =

    "Tidak dapat terhubung ke server.";

	}
	finally{

    btn.disabled = false;

    btn.innerHTML = `

        <i class="bi bi-box-arrow-in-right"></i>

        LOGIN

    `;

	}

}
document.getElementById("showPass").onclick=function(){

    const p=document.getElementById("password");

    p.type=p.type=="password"?"text":"password";

}
