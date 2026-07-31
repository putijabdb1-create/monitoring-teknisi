/*************************************************
 * PT PUTRA TIMUR JAYA
 * UI ENGINE V2
 *************************************************/
//=======================================
// HITUNG DASHBOARD
//=======================================

function dashboardSummary(){

    document.getElementById("totalWO").innerHTML = filteredData.length;

    let completed=0;
    let config=0;
    let ogp=0;
    let kendala=0;

    const teknisi=new Set();

    filteredData.forEach(row=>{

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

    document.getElementById("completed").innerHTML = completed;
    document.getElementById("config").innerHTML = config;
    document.getElementById("ogp").innerHTML = ogp;
    document.getElementById("kendala").innerHTML = kendala;
    document.getElementById("teknisiAktif").innerHTML = teknisi.size;

}

//=======================================
// LIST TEKNISI (GROUP BY TEKNISI)
//=======================================

function buildWOList(){

    const list = document.getElementById("woList");

    let teknisiGroup = {};

    filteredData.forEach((row,index)=>{

        if(!teknisiGroup[row.teknisi]){

            teknisiGroup[row.teknisi]=[];

        }

        row.index = monitoringData.indexOf(row);

        teknisiGroup[row.teknisi].push(row);

    });

    let html="";

    Object.keys(teknisiGroup).forEach((namaTeknisi,i)=>{

        const dataWO=teknisiGroup[namaTeknisi];

        html+=`

        <div class="wo-card">

            <div
                style="
                cursor:pointer;
                display:flex;
                justify-content:space-between;
                align-items:center;
                "
                onclick="toggleGroup(${i})">

                <div>

                    <div class="wo-title">

                        👷 ${namaTeknisi}

                    </div>

                    <small>

                        ${dataWO.length} WO

                    </small>

                </div>

                <div>

                    ▼

                </div>

            </div>

            <div id="group${i}" style="margin-top:10px;">

        `;

        dataWO.forEach((row)=>{

            html+=`

            <div
                style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin:6px 0;
                ">

                <label>

                    <input
					type="checkbox"
					${row.visible !== false ? "checked" : ""}
					onchange="toggleWO(${row.index},this.checked)">

                    ${row.wo}

                </label>

                ${statusBadge(row.status)}

            </div>

            `;

        });

        html+=`

            </div>

        </div>

        `;

    });

    list.innerHTML=html;

}

//=======================================
// WARNA STATUS
//=======================================

function statusBadge(status){

	status=(status || "").toUpperCase();

	let color="#111827"; // Hitam = belum ada status

	if(status.includes("COMPLETED")) color="#16a34a";
	else if(status.includes("ACTCOMP")) color="#16a34a";
	else if(status.includes("CONFIG")) color="#2563eb";
	else if(status.includes("OGP")) color="#facc15";
	else if(status!="") color="#dc2626"; // Status lain = merah (kendala)
	
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

    monitoringData[index].visible = checked;

    applyFilter();

}
//=======================================
// EXPAND / COLLAPSE
//=======================================

function toggleGroup(id){

    const div=document.getElementById("group"+id);

    if(div.style.display==="none"){

        div.style.display="block";

    }else{

        div.style.display="none";

    }

}
