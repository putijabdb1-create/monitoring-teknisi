/*************************************************
 * SESSION CHECK
 *************************************************/

if(sessionStorage.getItem("login")!="true"){

    location.replace("login.html");

}

/*************************************************
 * APP ENGINE
 *************************************************/

window.onload = function(){

    initMap();

    loadMonitoring();
    // Tombol Refresh
    document
        .getElementById("btnRefresh")
        .addEventListener("click", refreshMonitoring);
};
/*************************************************
 * UPDATE LAST ACTIVITY
 *************************************************/

function updateActivity(){

    sessionStorage.setItem(

        "lastActivity",

        Date.now()

    );

}

document.addEventListener("click",updateActivity);

document.addEventListener("keydown",updateActivity);

document.addEventListener("mousemove",updateActivity);

document.addEventListener("scroll",updateActivity);

document.addEventListener("touchstart",updateActivity);

/*************************************************
 * AUTO LOGOUT 1 JAM
 *************************************************/

setInterval(function(){

    const last = Number(

        sessionStorage.getItem("lastActivity")

    );

    if(!last) return;

    const idle = Date.now()-last;

    if(idle > 60*60*1000){

        alert(

            "Session berakhir karena tidak ada aktivitas selama 1 jam."

        );

        sessionStorage.clear();

        location.replace("login.html");

    }

},60000);
