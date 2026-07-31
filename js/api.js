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
let multiSelectLoaded = false;
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

	if(!multiSelectLoaded){

    initMultiSelect();

    multiSelectLoaded = true;

	}

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

//=========================================
// APPLY FILTER
//=========================================

function applyFilter(){
getSelectedFilter();
    const tanggal=document.getElementById("filterTanggal").value;

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

if(selectedTeknisi.length){

    if(!selectedTeknisi.includes(row.teknisi)){

        ok = false;

    }

}

//------------------------
// Work Zone
//------------------------

if(selectedZone.length){

    if(!selectedZone.includes(row.workzone)){

        ok = false;

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

//====================================
// AMBIL DATA CHECKBOX
//====================================

function getSelectedFilter(){

    selectedTeknisi = [];

    document
    .querySelectorAll(".chkTeknisi:checked")
    .forEach(chk=>{

        selectedTeknisi.push(chk.value);

    });

    selectedZone = [];

    document
    .querySelectorAll(".chkZone:checked")
    .forEach(chk=>{

        selectedZone.push(chk.value);

    });

    document.getElementById("btnTeknisi").innerHTML =

        selectedTeknisi.length

        ? `👷 ${selectedTeknisi.length} Teknisi Dipilih <i class="bi bi-chevron-down"></i>`

        : `👷 Semua Teknisi <i class="bi bi-chevron-down"></i>`;

    document.getElementById("btnZone").innerHTML =

        selectedZone.length

        ? `📍 ${selectedZone.length} Zone Dipilih <i class="bi bi-chevron-down"></i>`

        : `📍 Semua Work Zone <i class="bi bi-chevron-down"></i>`;
		renderFilterChip();
}
//====================================
// EVENT MULTI SELECT
//====================================

function initMultiSelect(){

    // Event checkbox
    document.addEventListener("change",(e)=>{

        if(e.target.matches(".chkTeknisi,.chkZone")){

            applyFilter();

        }

    });

    // Pilih semua Teknisi
    document.getElementById("checkAllTeknisi").onclick = function(){

        document
        .querySelectorAll(".chkTeknisi")
        .forEach(chk => chk.checked = true);

        applyFilter();

    };

    // Hapus semua Teknisi
    document.getElementById("clearTeknisi").onclick = function(){

        document
        .querySelectorAll(".chkTeknisi")
        .forEach(chk => chk.checked = false);

        applyFilter();

    };

    // Pilih semua Work Zone
    document.getElementById("checkAllZone").onclick = function(){

        document
        .querySelectorAll(".chkZone")
        .forEach(chk => chk.checked = true);

        applyFilter();

    };

    // Hapus semua Work Zone
    document.getElementById("clearZone").onclick = function(){

        document
        .querySelectorAll(".chkZone")
        .forEach(chk => chk.checked = false);

        applyFilter();

    };
	
	//====================================
// SEARCH TEKNISI
//====================================

document.getElementById("searchTeknisi").addEventListener("keyup",function(){

    const key=this.value.toUpperCase();

    document.querySelectorAll(".chkTeknisi").forEach(chk=>{

        chk.parentElement.style.display=

            chk.value.toUpperCase().includes(key)

            ? ""

            : "none";

    });

});

//====================================
// SEARCH WORKZONE
//====================================

document.getElementById("searchZone").addEventListener("keyup",function(){

    const key=this.value.toUpperCase();

    document.querySelectorAll(".chkZone").forEach(chk=>{

        chk.parentElement.style.display=

            chk.value.toUpperCase().includes(key)

            ? ""

            : "none";

    });

});

}
function renderFilterChip(){

    const div=document.getElementById("activeFilter");

    div.innerHTML="";

    selectedTeknisi.forEach(n=>{

        div.innerHTML+=`

        <div class="filter-chip">

            👷 ${n}

            <span onclick="removeTeknisi('${n}')">

                ×

            </span>

        </div>

        `;

    });

    selectedZone.forEach(z=>{

        div.innerHTML+=`

        <div class="filter-chip">

            📍 ${z}

            <span onclick="removeZone('${z}')">

                ×

            </span>

        </div>

        `;

    });

}
function removeTeknisi(nama){

    document
    .querySelectorAll(".chkTeknisi")
    .forEach(chk=>{

        if(chk.value==nama){

            chk.checked=false;

        }

    });

    applyFilter();

}
function removeZone(zone){

    document
    .querySelectorAll(".chkZone")
    .forEach(chk=>{

        if(chk.value==zone){

            chk.checked=false;

        }

    });

    applyFilter();

}

//====================================
// REFRESH DATA TANPA RESET FILTER
//====================================

async function refreshMonitoring(){

    try{

        const response = await fetch(
            API_URL + "?action=getData",
            {
                method:"GET",
                cache:"no-cache"
            }
        );

        if(!response.ok){

            throw new Error("HTTP " + response.status);

        }

        // Update data saja
        monitoringData = await response.json();

        // Langsung gunakan filter yang sedang aktif
        applyFilter();

    }catch(err){

        console.error(err);

        alert("Refresh gagal.");

    }

}
