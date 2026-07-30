/*************************************************
 * PT PUTRA TIMUR JAYA
 * UI ENGINE V2
 *************************************************/


//=======================================
// HITUNG DASHBOARD
//=======================================

function dashboardSummary(){

    document.getElementById("totalWO").innerHTML = monitoringData.length;

    let completed=0;
    let config=0;
    let ogp=0;
    let kendala=0;

    const teknisi=new Set();

    monitoringData.forEach(row=>{

        teknisi.add(row.teknisi);

        let status=(row.status || "").toUpperCase();

        if(status.includes("COMPLETED") || status.includes("ACTCOMP"))
            completed++;

        else if(status.includes("CONFIG"))
            config++;

        else if(status.includes("OGP"))
            ogp++;

        else
            kendala++;

    });

    document.getElementById("completed").innerHTML=completed;
    document.getElementById("config").innerHTML=config;
    document.getElementById("ogp").innerHTML=ogp;
    document.getElementById("kendala").innerHTML=kendala;
    document.getElementById("teknisiAktif").innerHTML=teknisi.size;

}



//=======================================
// LIST WO
//=======================================

function buildWOList(){

    let html="";

    monitoringData.forEach((row,index)=>{

        html+=`

        <div class="wo-item">

            <label>

            <input
                type="checkbox"
                checked
                onchange="toggleWO(${index},this.checked)">

            <b>${row.wo}</b>

            </label>

            <div class="wo-teknisi">

                ${row.teknisi}

            </div>

            <div class="wo-status">

                ${statusBadge(row.status)}

            </div>

        </div>

        `;

    });

    document.getElementById("detailWO").innerHTML=html;

}



//=======================================
// WARNA STATUS
//=======================================

function statusBadge(status){

    status=(status || "").toUpperCase();

    let color="#dc2626";

    if(status.includes("COMPLETED")) color="#16a34a";

    if(status.includes("ACTCOMP")) color="#16a34a";

    if(status.includes("CONFIG")) color="#2563eb";

    if(status.includes("OGP")) color="#facc15";

    return `

    <span
    style="
    color:white;
    background:${color};
    padding:4px 10px;
    border-radius:8px;
    font-size:12px;
    ">

    ${status}

    </span>

    `;

}



//=======================================
// CHECKLIST
//=======================================

function toggleWO(index,checked){

    monitoringData[index].visible=checked;

    drawMarkers();

}
