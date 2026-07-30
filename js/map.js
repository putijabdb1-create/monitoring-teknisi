/******************************************************
 * PT PUTRA TIMUR JAYA
 * MONITORING TEKNISI
 * MAP ENGINE V2
 ******************************************************/

let map;

// Default Bandung
const DEFAULT_CENTER = [-6.917464, 107.619123];
const DEFAULT_ZOOM = 12;

// Menyimpan semua marker
let markers = [];

// ===============================
// INIT MAP
// ===============================
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

}

// ===============================
// HAPUS SEMUA MARKER
// ===============================
function clearMarkers(){

    markers.forEach(marker=>{

        map.removeLayer(marker);

    });

    markers=[];

}

// ===============================
// ICON WARNA
// ===============================
function getColor(status){

    if(!status) return "#FFFFFF";

    status=status.toUpperCase();

    if(status.includes("COMPLETED")) return "#16a34a";

    if(status.includes("ACTCOMP")) return "#16a34a";

    if(status.includes("CONFIG")) return "#2563eb";

    if(status.includes("OGP")) return "#facc15";

    if(status=="") return "#ffffff";

    return "#dc2626";

}

// ===============================
// ICON MARKER
// ===============================
function createMarker(lat,lng,data){

    const color=getColor(data.status);

    const icon=L.divIcon({

        className:"",

        html:`

        <div style="

            width:22px;

            height:22px;

            border-radius:50%;

            background:${color};

            border:3px solid white;

            box-shadow:0 0 8px rgba(0,0,0,.5);

        "></div>

        `,

        iconSize:[22,22]

    });

    const marker=L.marker([lat,lng],{

        icon

    }).addTo(map);

    marker.bindPopup(`

        <b>${data.wo}</b>

        <hr>

        Teknisi :

        <b>${data.teknisi}</b>

        <br>

        Status :

        ${data.status}

        <br>

        ODP :

        ${data.odp}

        <br>

        SC :

        ${data.sc}

        <br>

        Keterangan :

        ${data.keterangan}

    `);

    marker.on("click",()=>{

        document.getElementById("detailWO").innerHTML=`

            <h5>${data.wo}</h5>

            <table class="table">

            <tr>

            <th>Teknisi</th>

            <td>${data.teknisi}</td>

            </tr>

            <tr>

            <th>Status</th>

            <td>${data.status}</td>

            </tr>

            <tr>

            <th>SC</th>

            <td>${data.sc}</td>

            </tr>

            <tr>

            <th>ODP</th>

            <td>${data.odp}</td>

            </tr>

            <tr>

            <th>Keterangan</th>

            <td>${data.keterangan}</td>

            </tr>

            </table>

        `;

    });

    markers.push(marker);

}

// ===============================
// TEST MARKER
// ===============================
function demoMarker(){

    createMarker(

        -6.865221,

        107.542118,

        {

            wo:"WO60305739",

            teknisi:"PTJ ABDUL",

            status:"COMPLETED",

            odp:"ODP BTI FDV/091",

            sc:"SC1002497379",

            keterangan:"Tarik DC"

        }

    );

}

// ===============================

window.onload=()=>{

    initMap();

    demoMarker();

}
