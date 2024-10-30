document.getElementById("goBack").addEventListener("click", function () {
    localStorage.removeItem('lacre');
    localStorage.removeItem('tipoLacre');
    localStorage.removeItem("osAnterior");
    localStorage.removeItem("dataManutencao");
    localStorage.removeItem("obsUltimoServico");

    window.location.href = "garantia.html";
});

document.getElementById("submitButton").addEventListener("click", function () {
    const osValue = document.getElementById("OSAnterior").value.trim();
    const dateManutencaoValue = document.getElementById("dateManutencao").value.trim();
    const ServiceValue = document.getElementById("Service").value.trim().toUpperCase();

    if (!osValue || !dateManutencaoValue || !ServiceValue) {
        exibirAlerta()
    } else {
        localStorage.setItem("osAnterior", osValue);
        localStorage.setItem("dataManutencao", dateManutencaoValue);
        localStorage.setItem("obsUltimoServico", ServiceValue);
        window.location.href = "checklist.html";
    }
});


// Função para mostrar ou esconder o alertBox
function exibirAlerta() {
    alertBox.classList.remove("hidden");
    alertBox.style.display = "block";

    // Oculta o alerta após 3 segundos
    setTimeout(() => {
        alertBox.style.display = "none";
    }, 3000);
}

//MAXIMO DE CARACTERES NO INPUT NUMBER
$(document).ready(function () {
    const verficaEquipamento = localStorage.getItem('selectedOption');
    const verficaLacre = localStorage.getItem('lacre');

    if (!verficaEquipamento || !verficaLacre) {
        window.location.href = "../index.html";
        localStorage.clear();
    } else {
        $("#OSAnterior").keyup(function () {
            $("#OSAnterior").val(this.value.match(/[0-9]*/));
        });
    }
});