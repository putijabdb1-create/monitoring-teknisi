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
