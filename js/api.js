/*************************************************
 * PT PUTRA TIMUR JAYA
 * Monitoring Teknisi
 * API ENGINE V2
 *************************************************/

// ===============================
// GANTI DENGAN URL WEB APP ANDA
// ===============================

const API_URL =
"https://script.google.com/macros/s/AKfycbzp1pGPPjLr26534rC7LAy1WgDIAONBXUm5Wdysz8Ddqtu2GhcBbi0C0PLnyWJUQ20x/exec";


// ===============================
// DATA GLOBAL
// ===============================

let monitoringData = [];


// ===============================
// LOAD DATA
// ===============================

async function loadMonitoring() {

    try {

        document.getElementById("detailWO").innerHTML =
        "Mengambil data dari Google Sheet...";

async function loadMonitoring(){

    try{

        const response = await fetch(

            API_URL + "?action=getData",

            {
                method:"GET",
                mode:"cors",
                cache:"no-cache"
            }

        );

        if(!response.ok){

            throw new Error(
                "HTTP "+response.status
            );

        }

        monitoringData = await response.json();

        console.log(monitoringData);

        dashboardSummary();

        buildWOList();

        drawMarkers();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
