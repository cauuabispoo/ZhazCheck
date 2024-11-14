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
    const verificatipoServico = localStorage.getItem('tipoServico');


    if (!verficaEquipamento || !verficaLacre || !verificatipoServico) {
        window.location.href = "../index.html";
        localStorage.clear();
    } else {
        $("#OSAnterior").keyup(function () {
            $("#OSAnterior").val(this.value.match(/[0-9]*/));
        });
    }
});



// Função para atualizar os labels com base no valor do localStorage
function atualizarLabels() {
    // Obter o valor armazenado no localStorage (supondo que a chave seja 'tipoServico')
    const tipoServico = localStorage.getItem('tipoLacre'); // Pode ser 'venda' ou 'manutencao'

    // Verifica o valor e altera os labels
    if (tipoServico === 'venda') {
        document.querySelector('label[for="OSAnterior"]').innerHTML = 'PV:<sup>*</sup>';
        document.querySelector('label[for="dateManutencao"]').innerHTML = 'Data da Revisão:<sup>*</sup>';
    } else if (tipoServico === 'manutencao') {
        // Caso o valor seja 'manutencao', mantém os valores padrão
        document.querySelector('label[for="OSAnterior"]').innerHTML = 'OS anterior:<sup>*</sup>';
        document.querySelector('label[for="dateManutencao"]').innerHTML = 'Data da manutenção:<sup>*</sup>';
    }
}

// Chama a função quando a página carregar
document.addEventListener('DOMContentLoaded', atualizarLabels);