/*************************************************
 * PT PUTRA TIMUR JAYA
 * Monitoring Teknisi
 * API ENGINE V2
 *************************************************/

// ===============================
// GANTI DENGAN URL WEB APP ANDA
// ===============================

const API_URL =
"https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec";


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

        const response = await fetch(
            API_URL + "?action=getData"
        );

        monitoringData = await response.json();

        console.log(monitoringData);

        dashboardSummary();

        buildWOList();

        drawMarkers();

    }

    catch (err) {

        console.error(err);

        alert("Gagal mengambil data dari Apps Script");

    }

}
