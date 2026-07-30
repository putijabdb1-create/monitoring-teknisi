/*************************************************
 * PT PUTRA TIMUR JAYA
 * MAP ENGINE V3
 *************************************************/

let map;
let markerGroup = L.layerGroup();

const DEFAULT_CENTER = [-6.917464, 107.619123];
const DEFAULT_ZOOM = 11;

// =========================
// INIT MAP
// =========================

function initMap() {

    map = L.map("map", {
        zoomControl: true
    }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap",
            maxZoom: 20
        }
    ).addTo(map);

    markerGroup.addTo(map);

}

// =========================
// HAPUS MARKER
// =========================

function clearMarkers(){

    markerGroup.clearLayers();

}

// =========================
// WARNA STATUS
// =========================

function getMarkerColor(status){

    status=(status || "").toUpperCase();

    if(status.includes("COMPLETED")) return "#22C55E";

    if(status.includes("ACTCOMP")) return "#22C55E";

    if(status.includes("CONFIG")) return "#2563EB";

    if(status.includes("OGP")) return "#FACC15";

    if(status=="") return "#FFFFFF";

    return "#EF4444";

}

// =========================
// DRAW MARKER
// =========================

function drawMarkers(){

    clearMarkers();

    monitoringData.forEach((row,index)=>{

        if(row.visible===false) return;

        if(!row.lat || !row.lng) return;

       const icon=L.divIcon({

        className:"",

html:`

<div class="tech-marker">

    <i class="bi bi-person-workspace helmet"></i>

    <span
        class="name"
        style="color:${statusColor(row.status)}">

        ${shortName(row.teknisi)}

    </span>

</div>

`,

		iconSize:[70,20],

		iconAnchor:[10,10]
    });

 const marker = L.marker(
    [row.lat,row.lng],
    {
        icon:icon
    }
);

marker.addTo(markerGroup);

marker.on("click", function () {

    showDetail(index);

});

    });   // <-- penutup forEach

}         // <-- penutup drawMarkers

// =========================
// DETAIL WO
// =========================

function showDetail(index){

    const row=monitoringData[index];

    document.getElementById("detailWO").innerHTML=`

        <table class="table">

        <tr>

        <th>WO</th>

        <td>${row.wo}</td>

        </tr>

        <tr>

        <th>Teknisi</th>

        <td>${row.teknisi}</td>

        </tr>

        <tr>

        <th>Status</th>

        <td>${row.status}</td>

        </tr>

        <tr>

        <th>SC</th>

        <td>${row.sc}</td>

        </tr>

        <tr>

        <th>ODP</th>

        <td>${row.odp}</td>

        </tr>

        <tr>

        <th>Tanggal</th>

        <td>${row.tanggal}</td>

        </tr>

        <tr>

        <th>Keterangan</th>

        <td>${row.keterangan}</td>

        </tr>

        <tr>

        <th>Tikor</th>

        <td>${row.lat}, ${row.lng}</td>

        </tr>

        </table>

    `;

    map.flyTo(

        [row.lat,row.lng],

        17,

        {

            animate:true,

            duration:1

        }

    );

}

// =========================
// ZOOM KE WO
// =========================

function zoomToWO(index){

    const row=monitoringData[index];

    map.flyTo(

        [row.lat,row.lng],

        17

    );

    showDetail(index);

}
function markerColor(status){

    status=(status||"").toUpperCase();

    if(status.includes("ACTCOMP")) return "green";

    if(status.includes("COMPLETED")) return "green";

    if(status.includes("CONFIG")) return "blue";

    if(status.includes("OGP")) return "yellow";

    return "red";

}

function shortName(nama){

    nama=nama.replace("PTJ ","");

    nama=nama.split("&")[0];

    nama=nama.trim();

    return nama.split(" ")[0];

}
function statusColor(status){

    status=(status||"").toUpperCase();

    if(status.includes("ACTCOMP")) return "#16a34a";

    if(status.includes("COMPLETED")) return "#16a34a";

    if(status.includes("CONFIG")) return "#2563eb";

    if(status.includes("OGP")) return "#f59e0b";

    return "#dc2626";

}
