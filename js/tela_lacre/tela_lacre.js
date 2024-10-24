document.getElementById("goBack").addEventListener("click", function () {
    localStorage.removeItem("mac");
    localStorage.removeItem("serial");
    localStorage.removeItem("imei");
    localStorage.removeItem('check');
    localStorage.removeItem('lacre');
    localStorage.removeItem("osAnterior");
    localStorage.removeItem("dataManutencao");
    localStorage.removeItem("obsUltimoServico");

    window.location.href = "garantia.html";
});

document.getElementById("submitButton").addEventListener("click", function () {
    const osValue = document.getElementById("OSAnterior").value.trim();
    const dateManutencaoValue = document.getElementById("dateManutencao").value.trim();
    const ServiceValue = document.getElementById("Service").value.trim().toUpperCase();
    const checkValue = localStorage.getItem('check');
    const alertBox = document.getElementById("alertBox");

    if (!osValue || !dateManutencaoValue || !ServiceValue) {
        alertBox.classList.remove("hidden");
        alertBox.style.display = "block";

        // Oculta o alerta após 3 segundos
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 3000);
    } else {
        if (checkValue === "nao") {
            localStorage.setItem("osAnterior", osValue);
            localStorage.setItem("dataManutencao", dateManutencaoValue);
            localStorage.setItem("obsUltimoServico", ServiceValue);
            window.location.href = "obsTecnicas.html";
        } else {
            localStorage.setItem("osAnterior", osValue);
            localStorage.setItem("dataManutencao", dateManutencaoValue);
            localStorage.setItem("obsUltimoServico", ServiceValue);
            window.location.href = "checklist.html";
        }
    }
});


//MAXIMO DE CARACTERES NO INPUT NUMBER
$(document).ready(function () {
    const verficaEquipamento = localStorage.getItem('selectedOption');
    const verficaCheck = localStorage.getItem('check');

    if (!verficaEquipamento || !verficaCheck) {
        window.location.href = "equipamento.html";
        localStorage.clear();
    } else {
        $("#OSAnterior").keyup(function () {
            $("#OSAnterior").val(this.value.match(/[0-9]*/));
        });
    }
});