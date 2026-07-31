/*************************************************
 * APP ENGINE
 *************************************************/

window.onload = function(){

    initMap();

    loadMonitoring();
    // Tombol Refresh
    document
        .getElementById("btnRefresh")
        .addEventListener("click", refreshMonitoring);
};
