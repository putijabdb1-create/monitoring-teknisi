/*************************************************
 * PT PUTRA TIMUR JAYA
 * MONITORING TEKNISI V3
 * API ENGINE
 *************************************************/

const API_URL =
"https://script.google.com/macros/s/AKfycbzp1pGPPjLr26534rC7LAy1WgDIAONBXUm5Wdysz8Ddqtu2GhcBbi0C0PLnyWJUQ20x/exec";

// Data Global
let monitoringData = [];   // Semua data dari Apps Script
let filteredData = [];     // Data hasil filter

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

		filteredData = [...monitoringData];

		// isi dropdown filter
		loadFilter();
		function loadFilter(){

  		  const teknisi = document.getElementById("filterTeknisi");
  		  const tanggal = document.getElementById("filterTanggal");
   			const workzone = document.getElementById("filterWorkZone");

 		   // reset
 		   teknisi.innerHTML='<option value="">Semua Teknisi</option>';

  		  if(workzone){
   		     workzone.innerHTML='<option value="">Semua Work Zone</option>';
  		  }

   		 const listTeknisi=[...new Set(
        monitoringData.map(x=>x.teknisi)
   		 )].sort();

  		  listTeknisi.forEach(n=>{

   		     teknisi.innerHTML+=
  		      `<option value="${n}">${n}</option>`;

  		  });

		}
		// jalankan filter pertama kali
		applyFilter();

    }
    catch(error){

        console.error(error);

        alert("Gagal mengambil data : " + error.message);

    }

}
