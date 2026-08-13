/*************************************************
 * LOGIN ENGINE - STABLE
 *************************************************/

const API_URL =
"https://script.google.com/macros/s/AKfycbzp1pGPPjLr26534rC7LAy1WgDIAONBXUm5Wdysz8Ddqtu2GhcBbi0C0PLnyWJUQ20x/exec";

const btnLogin = document.getElementById("btnLogin");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginInfo = document.getElementById("loginInfo");


//==================================================
// BUTTON LOGIN
//==================================================

btnLogin.onclick = login;


//==================================================
// ENTER PASSWORD
//==================================================

passwordInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        login();

    }

});


//==================================================
// LOGIN
//==================================================

async function login(){

    const startTime = performance.now();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    console.log("LOGIN START");
    console.log("Username =", username);

    //==============================================
    // VALIDASI
    //==============================================

    if(username === "" || password === ""){

        loginInfo.innerHTML =
            "Username dan Password wajib diisi.";

        return;

    }


    //==============================================
    // LOCK BUTTON
    //==============================================

    btnLogin.disabled = true;

    btnLogin.innerHTML = `
        <i class="bi bi-arrow-repeat spin"></i>
        Memeriksa...
    `;

    loginInfo.innerHTML =
        "Menghubungkan ke server...";


    try{

        //==========================================
        // URL LOGIN
        //==========================================

        const url =
            API_URL +
            "?action=login" +
            "&username=" + encodeURIComponent(username) +
            "&password=" + encodeURIComponent(password) +
            "&_=" + Date.now();


        console.log("LOGIN URL READY");


        //==========================================
        // REQUEST PERTAMA
        //==========================================

        let response;

        try{

            response = await fetch(

                url,

                {
                    method:"GET",
                    cache:"no-store"
                }

            );

        }catch(error){

            console.warn(
                "Request pertama gagal. Mencoba kembali..."
            );

            loginInfo.innerHTML =
                "Server sedang merespons, mencoba kembali...";


            //======================================
            // RETRY
            //======================================

            await new Promise(resolve =>
                setTimeout(resolve,1500)
            );


            response = await fetch(

                url + "&retry=1",

                {
                    method:"GET",
                    cache:"no-store"
                }

            );

        }


        //==========================================
        // CEK RESPONSE
        //==========================================

        if(!response.ok){

            throw new Error(
                "HTTP " + response.status
            );

        }


        //==========================================
        // JSON
        //==========================================

        const data = await response.json();


        console.log(
            "Login selesai dalam",
            ((performance.now() - startTime) / 1000)
                .toFixed(2),
            "detik"
        );

        console.log(
            "Login response =",
            data
        );


        //==========================================
        // LOGIN BERHASIL
        //==========================================

        if(data.success){

            sessionStorage.setItem(
                "login",
                "true"
            );

            sessionStorage.setItem(
                "username",
                username
            );

            sessionStorage.setItem(
                "nama",
                data.nama || ""
            );

            sessionStorage.setItem(
                "role",
                data.role || ""
            );

            sessionStorage.setItem(
                "workzone",
                data.workzone || ""
            );

            sessionStorage.setItem(
                "loginTime",
                Date.now()
            );

            sessionStorage.setItem(
                "lastActivity",
                Date.now()
            );


            loginInfo.innerHTML =
                "Login berhasil. Membuka monitoring...";


            //======================================
            // MASUK DASHBOARD
            //======================================

            setTimeout(function(){

                location.href = "index.html";

            },300);

            return;

        }


        //==========================================
        // LOGIN DITOLAK
        //==========================================

        loginInfo.innerHTML =
            data.message ||
            "Username atau Password salah.";

    }


    //==============================================
    // ERROR
    //==============================================

    catch(error){

        console.error(
            "LOGIN ERROR:",
            error
        );

        loginInfo.innerHTML =
            "Server tidak dapat dihubungi.";


        console.error(
            "Detail:",
            error.message
        );

    }


    //==============================================
    // UNLOCK BUTTON
    //==============================================

    finally{

        btnLogin.disabled = false;

        btnLogin.innerHTML = `
            <i class="bi bi-box-arrow-in-right"></i>
            LOGIN
        `;

    }

}


//==================================================
// SHOW / HIDE PASSWORD
//==================================================

document.getElementById("showPass").onclick =
function(){

    const p =
        document.getElementById("password");

    const icon =
        this.querySelector("i");


    if(p.type === "password"){

        p.type = "text";

        icon.className =
            "bi bi-eye-slash";

    }else{

        p.type = "password";

        icon.className =
            "bi bi-eye";

    }

};
