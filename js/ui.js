/*************************************************
 * PT PUTRA TIMUR JAYA
 * UI ENGINE V4
 * Group By Teknisi
 *************************************************/

let groupedData = {};
let selectedTechnician = null;

//=====================================
// DASHBOARD
//=====================================

function dashboardSummary(){

    document.getElementById("totalWO").innerHTML = monitoringData.length;

    let completed = 0;
    let config = 0;
    let ogp = 0;
    let kendala = 0;

    const teknisi = new Set();

    monitoringData.forEach(row=>{

        teknisi.add(row.teknisi);

        const status=(row.status||"").toUpperCase();

        if(status.includes("COMPLETED") || status.includes("ACTCOMP")){

            completed++;

        }else if(status.includes("CONFIG")){

            config++;

        }else if(status.includes("OGP")){

            ogp++;

        }else{

            kendala++;

        }

    });

    document.getElementById("completed").innerHTML = completed;
    document.getElementById("config").innerHTML = config;
    document.getElementById("ogp").innerHTML = ogp;
    document.getElementById("kendala").innerHTML = kendala;
    document.getElementById("teknisiAktif").innerHTML = teknisi.size;

}
//=====================================
// GROUP TEKNISI
//=====================================

function groupTechnicians(){

    groupedData={};

    monitoringData.forEach((row,index)=>{

        if(!groupedData[row.teknisi]){

            groupedData[row.teknisi]={

                nama:row.teknisi,

                wo:[],

                visible:true

            };

        }

        row.index=index;

        groupedData[row.teknisi].wo.push(row);

    });

}
//=====================================
// BUILD LIST TEKNISI
//=====================================

function buildWOList(){

    groupTechnicians();

    const list=document.getElementById("woList");

    let html="";

    Object.values(groupedData).forEach(tech=>{

        html+=buildTechnicianCard(tech);

    });

    list.innerHTML=html;

}
//=====================================
// CARD TEKNISI
//=====================================

function buildTechnicianCard(tech){

    let html = "";

    html += `

    <div class="tech-card">

        <div class="tech-header"
             onclick="toggleTechnician('${tech.nama}')">

            <div>

                <div class="tech-name">

                    👷 ${tech.nama}

                </div>

                <div class="tech-count">

                    ${tech.wo.length} WO

                </div>

            </div>

            <div>

                ▼

            </div>

        </div>

        <div
            id="tech-${slugify(tech.nama)}"
            class="tech-body">

    `;

    tech.wo.forEach((wo)=>{

        html += `

        <div
            class="wo-row"
            onclick="zoomToWO(${wo.index})">

            <input
                type="checkbox"
                checked
                onclick="event.stopPropagation();toggleWO(${wo.index},this.checked)">

            <span>

                ${wo.wo}

            </span>

            ${statusBadge(wo.status)}

        </div>

        `;

    });

    html += `

        </div>

    </div>

    `;

    return html;

}
//=====================================
// OPEN CLOSE
//=====================================

function toggleTechnician(nama){

    const id = "tech-"+slugify(nama);

    const div=document.getElementById(id);

    if(div.style.display=="none"){

        div.style.display="block";

    }else{

        div.style.display="none";

    }

}
//=====================================
// SLUG
//=====================================

function slugify(text){

    return text

        .replace(/\s+/g,"-")

        .replace(/&/g,"")

        .replace(/\//g,"")

        .toLowerCase();

}
