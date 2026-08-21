/*************************************************
 * PT PUTRA TIMUR JAYA
 * MONITORING TEKNISI V4 STABLE
 * API ENGINE
 *************************************************/

const API_URL =
"https://script.google.com/macros/s/AKfycbzp1pGPPjLr26534rC7LAy1WgDIAONBXUm5Wdysz8Ddqtu2GhcBbi0C0PLnyWJUQ20x/exec";

//======================================
// GLOBAL
//======================================

let monitoringData = [];

let filteredData = [];

let selectedTeknisi = [];

let selectedZone = [];

let multiSelectLoaded = false;

let loading = false;

let refreshRunning = false;
//======================================
// CACHE
//======================================

let visibleMap = {};

let currentDataHash = "";

let lastRefresh = null;

const FETCH_TIMEOUT = 15000;
const FETCH_TIMEOUT = 30000;

async function loadMonitoring(){ 

@@ -76,10 +76,10 @@

        filteredData=[...monitoringData];

        loadFilter();

	if(!multiSelectLoaded){

    loadFilter();

    initMultiSelect();

    multiSelectLoaded = true;
@@ -95,7 +95,9 @@
    }

    catch(err){
		updateServerStatus("offline");
		console.warn("Refresh gagal, menggunakan data terakhir.");
		updateServerStatus("warning");
		
        console.error(err);

        document.getElementById("detailWO").innerHTML=`
@@ -144,802 +146,815 @@

    try{
		updateServerStatus("loading");
        const response = await fetchRetry(
	const response = await fetchRetry(

            API_URL + "?action=getData"
    API_URL + "?action=getData"

        );
		if(!response.ok){
	);

	const data = await response.json();

	if(!Array.isArray(data)){

    throw new Error("Data dari server tidak valid.");
	}

		throw new Error("HTTP "+response.status);
	monitoringData = data;

		}
	console.log(monitoringData);

        const data = await response.json();
	filteredData = [...monitoringData];

     //-------------------------------------------------
	// Simpan status checkbox WO
	//-------------------------------------------------

saveVisibleState();

const newHash = makeHash(data);

// Jika data sama, tidak perlu render ulang berlebihan
if(newHash === currentDataHash){

	if(newHash === currentDataHash){
    console.log("Tidak ada perubahan data.");

    updateServerStatus("online");
    return;
	}

	// Update data terbaru
	monitoringData = data;

	// Kembalikan status checkbox WO
	restoreVisibleState();

	// Simpan hash terbaru
	currentDataHash = newHash;

	lastRefresh = new Date();

	// Render ulang sesuai filter yang sedang aktif
	applyFilter();
	updateServerStatus("online");
	console.log(

		"Refresh sukses :",

		monitoringData.length,

		"WO"

	);

	console.log(
    "Last Refresh :",
    lastRefresh
	);

    }

    catch(err){
		updateServerStatus("offline");
		console.warn("Menggunakan data terakhir.");

		applyFilter();

		document.getElementById("detailWO").innerHTML = `
		<div style="color:#f59e0b">
		⚠ Tidak dapat mengambil data terbaru.
		<br>
		Menampilkan data terakhir.
		</div>
		`;
        console.error(err);

        document.getElementById("detailWO").innerHTML=

        `

        <div style="color:#dc2626">

        ⚠ Tidak dapat mengambil data terbaru.

        <br>

        Menampilkan data terakhir.

        </div>

        `;

    }

    finally{

        refreshRunning = false;

        btn.disabled = false;

        btn.innerHTML = oldHTML;

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

	console.log(

	"Filtered :",

	filteredData.length

	);

requestAnimationFrame(()=>{

    dashboardSummary();

    buildWOList();

    drawMarkers();

    document.getElementById("detailWO").innerHTML =
    "Pilih marker atau WO.";

    renderFilterChip();

});
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
	document
	.getElementById("btnRefresh")
	.addEventListener("click",refreshMonitoring);
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

//======================================
// STATUS SERVER
//======================================

function updateServerStatus(status){

    const live = document.querySelector(".live");

    if(!live) return;

    switch(status){

        case "loading":

            live.innerHTML = `
                <span class="badge bg-warning">
                    SYNC...
                </span>
                <span id="jam"></span>
            `;

        break;

        case "online":

            live.innerHTML = `
                <span class="badge bg-success">
                    LIVE
                </span>
                <span id="jam"></span>
            `;

        break;

        case "offline":

            live.innerHTML = `
                <span class="badge bg-danger">
                    OFFLINE
                </span>
                <span id="jam"></span>
            `;

        break;

    }

}
//======================================
// FETCH ENGINE
//======================================

async function fetchRetry(url,retry=3){
async function fetchRetry(url,retry=5){

    for(let i=1;i<=retry;i++){

        let timer;

        try{

            const controller=new AbortController();
            const controller = new AbortController();

            const timer=setTimeout(()=>{
            timer = setTimeout(()=>{

                controller.abort();

            },FETCH_TIMEOUT);

            const response=await fetch(
            const response = await fetch(

                url+(url.includes("?")?"&":"?")+"_="+Date.now(),

                {

                    method:"GET",

                    cache:"no-store",

                    signal:controller.signal

                }

            );

            clearTimeout(timer);

            if(response.ok){

                return response;

            }

            console.warn(

                "Retry",

                i,

                response.status

            );
            throw new Error("HTTP "+response.status);

        }

        catch(err){

            console.warn(

                "Retry",

                i,

                err.message

            );

        }

        await new Promise(r=>setTimeout(r,1000));
        finally{

            clearTimeout(timer);

        }

        await new Promise(r=>setTimeout(r,i*2000));

    }

    throw new Error("Server Google tidak merespon.");

}
//======================================
// SIMPAN CHECKBOX WO
//======================================

function saveVisibleState(){

    visibleMap = {};

    monitoringData.forEach(row=>{

        visibleMap[row.wo] =

        row.visible !== false;

    });

}
//======================================
// KEMBALIKAN CHECKBOX WO
//======================================

function restoreVisibleState(){

    monitoringData.forEach(row=>{

        if(

            visibleMap.hasOwnProperty(row.wo)

        ){

            row.visible =

            visibleMap[row.wo];

        }

        else{

            row.visible = true;

        }

    });

}
//======================================
// HASH DATA
//======================================

function makeHash(data){

    return JSON.stringify(

        data.map(x=>

            x.wo +

            x.status +

            x.teknisi +

            x.keterangan

        )

    );

}
//======================================
// AUTO REFRESH
//======================================

setInterval(()=>{

    if(document.hidden) return;

    if(loading) return;

    if(refreshRunning) return;

    refreshMonitoring();
},300000);
console.log(

"%cMonitoring Teknisi V4 Stable",

"color:#2563eb;font-size:18px;font-weight:bold"

);

console.log(

"PT Putra Timur Jaya"

);
