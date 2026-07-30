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

//====================================
// MULTI SELECT
//====================================

let selectedTeknisi = [];
let selectedZone = [];
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

        loadFilter();

        applyFilter();

    }catch(error){

        console.error(error);

        alert("Gagal mengambil data : " + error.message);

    }

}
//=========================================
// LOAD FILTER
//=========================================

function loadFilter(){

    buildTeknisiFilter();

    buildZoneFilter();

}

    //==========================
    // TEKNISI
    //==========================

    const listTeknisi=[
        ...new Set(
            monitoringData.map(x=>x.teknisi)
        )
    ].sort();

    listTeknisi.forEach(n=>{

        teknisi.innerHTML+=`
        <option value="${n}">
            ${n}
        </option>
        `;

    });

    //==========================
    // WORK ZONE
    //==========================

    const listZone=[
        ...new Set(
            monitoringData.map(x=>x.workzone)
        )
    ].sort();

    listZone.forEach(z=>{

        workzone.innerHTML+=`
        <option value="${z}">
            ${z}
        </option>
        `;

    });

}
//=========================================
// APPLY FILTER
//=========================================

function applyFilter(){

    const tanggal=document.getElementById("filterTanggal").value;

    const teknisi=document.getElementById("filterTeknisi").value;

    const zone=document.getElementById("filterWorkZone").value;

		const keyword = (
		document.getElementById("searchWO")?.value || ""
		).toUpperCase();

    filteredData=monitoringData.filter(row=>{

        let ok=true;

        //------------------------
        // Tanggal
        //------------------------

        if(tanggal){

            const t=new Date(row.tanggal);

            const f=new Date(tanggal);

            if(
                t.toDateString()!=
                f.toDateString()
            ){

                ok=false;

            }

        }

        //------------------------
        // Teknisi
        //------------------------

        if(teknisi){

            if(row.teknisi!=teknisi){

                ok=false;

            }

        }

        //------------------------
        // Work Zone
        //------------------------

        if(zone){

            if(row.workzone!=zone){

                ok=false;

            }

        }

        //------------------------
        // Search
        //------------------------

        if(keyword){

            const txt=`

${row.wo}

${row.sc}

${row.odp}

${row.teknisi}

`

            .toUpperCase();

            if(!txt.includes(keyword)){

                ok=false;

            }

        }

        return ok;

    });

    console.log(filteredData);
	dashboardSummary();

	buildWOList();

	drawMarkers();

	document.getElementById("detailWO").innerHTML=
	"Pilih marker atau WO.";
}
//================================
// EVENT FILTER
//================================

window.addEventListener("DOMContentLoaded",()=>{

    document
    .getElementById("filterTanggal")
    .addEventListener("change",applyFilter);

    document
    .getElementById("filterWorkZone")
    .addEventListener("change",applyFilter);

    document
    .getElementById("filterTeknisi")
    .addEventListener("change",applyFilter);

    document
    .getElementById("searchWO")
    .addEventListener("keyup",applyFilter);

});
//====================================
// TEKNISI FILTER
//====================================

function buildTeknisiFilter(){

    const list = document.getElementById("listTeknisi");

    list.innerHTML="";

    const teknisi=[
        ...new Set(
            monitoringData.map(x=>x.teknisi)
        )
    ].sort();

    teknisi.forEach(n=>{

        list.innerHTML+=`

        <div class="multi-item">

            <input
                type="checkbox"
                value="${n}"
                class="chkTeknisi">

            <label>${n}</label>

        </div>

        `;

    });

}
//====================================
// WORKZONE FILTER
//====================================

function buildZoneFilter(){

    const list=document.getElementById("listZone");

    list.innerHTML="";

    const zone=[
        ...new Set(
            monitoringData.map(x=>x.workzone)
        )
    ].sort();

    zone.forEach(z=>{

        list.innerHTML+=`

        <div class="multi-item">

            <input
                type="checkbox"
                value="${z}"
                class="chkZone">

            <label>${z}</label>

        </div>

        `;

    });

}
//====================================
// OPEN CLOSE
//====================================

document.addEventListener("click",(e)=>{

    if(e.target.closest("#btnTeknisi")){

        document
        .getElementById("dropdownTeknisi")
        .classList.toggle("show");

    }

    else if(e.target.closest("#btnZone")){

        document
        .getElementById("dropdownZone")
        .classList.toggle("show");

    }

    else{

        document
        .getElementById("dropdownTeknisi")
        .classList.remove("show");

        document
        .getElementById("dropdownZone")
        .classList.remove("show");

    }

});

document
.getElementById("searchTeknisi")
.addEventListener("keyup",function(){

    const key=this.value.toUpperCase();

    document
    .querySelectorAll(".chkTeknisi")
    .forEach(chk=>{

        chk.parentElement.style.display=

            chk.value.toUpperCase().includes(key)

            ? ""

            : "none";

    });

});
document
.getElementById("searchZone")
.addEventListener("keyup",function(){

    const key=this.value.toUpperCase();

    document
    .querySelectorAll(".chkZone")
    .forEach(chk=>{

        chk.parentElement.style.display=

            chk.value.toUpperCase().includes(key)

            ? ""

            : "none";

    });

});
