/*************************************************
 * PT PUTRA TIMUR JAYA
 * MONITORING TEKNISI V3
 * API ENGINE
 *************************************************/

const API_URL =
"https://script.google.com/macros/s/AKfycbzp1pGPPjLr26534rC7LAy1WgDIAONBXUm5Wdysz8Ddqtu2GhcBbi0C0PLnyWJUQ20x/exec";

// Data Global
let monitoringData = [];

// ===============================
// LOAD DATA
// ===============================

async function loadMonitoring(){

    try{

        document.getElementById("detailWO").innerHTML =
        "Mengambil data dari Google Sheet...";

        const response = await fetch(
            API_URL + "?action=getData",
            {
                method:"GET",
                mode:"cors",
                cache:"no-cache"
            }
        );

        if(!response.ok){
            throw new Error("HTTP " + response.status);
        }

        monitoringData = await response.json();

        console.log("Monitoring Data :", monitoringData);

        dashboardSummary();

        buildWOList();

        drawMarkers();

    }
    catch(error){

        console.error(error);

        alert("Gagal mengambil data : " + error.message);

    }

}
