/*************************************************
 * LOGIN ENGINE
 *************************************************/

document.getElementById("btnLogin").onclick = function(){

    // sementara login tanpa API
    // nanti diganti validasi Google Sheet

    sessionStorage.setItem("login","true");

    sessionStorage.setItem("loginTime",Date.now());

    sessionStorage.setItem("lastActivity",Date.now());

    location.href="index.html";

};
