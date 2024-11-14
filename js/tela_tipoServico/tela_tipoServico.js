let tipoEquipamento = "";

// Inicializa os selects customizados
$(".custom-select").each(function () {
    var classes = $(this).attr("class"),
        id = $(this).attr("id"),
        name = $(this).attr("name");

    var template = '<div class="' + classes + '">';
    template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + "</span>";
    template += '<div class="custom-options">';

    $(this).find("option").each(function () {
        template += '<span class="custom-option" data-value="' + $(this).attr("value") + '">' + $(this).html() + "</span>";
    });

    template += "</div></div>";

    $(this).wrap('<div class="custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
});

$(".custom-select-trigger").on("click", function (event) {
    const select = $(this).parents(".custom-select");
    const customOptions = select.find(".custom-options");
    $(".custom-select").not(select).removeClass("opened");
    select.toggleClass("opened");

    // Calcule o espaço disponível abaixo do select
    const rect = select[0].getBoundingClientRect();
    const optionsHeight = customOptions.outerHeight();
    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceBelow < optionsHeight) {
        // Se não houver espaço suficiente, abre para cima
        customOptions.css({
            top: 'auto',
            bottom: '70%'
        });
    } else {
        // Caso contrário, abre para baixo
        customOptions.css({
            top: '100%',
            bottom: 'auto'
        });
    }

    $("html").one("click", function () {
        select.removeClass("opened");
    });

    event.stopPropagation();
});

// Evento de clique nas opções do primeiro select
$(".custom-option").on("click", function () {
    const value = $(this).data("value");

    // Define o valor no select oculto
    $(this).parents(".custom-select-wrapper").find("select").val(value);
    $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".custom-select").removeClass("opened");
    $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());

    // Atualiza o segundo select com base no valor selecionado
    if (value) {
        tipoEquipamento = value;
    }
});




// Armazenar o valor selecionado e redirecionar
document.getElementById("proceed").addEventListener("click", function () {
    const alertBox = document.getElementById("alertBox");
    if (tipoEquipamento === "") {
        // Exibe o alerta
        alertBox.classList.remove("hidden");
        alertBox.style.display = "block";

        // Oculta o alerta após 3 segundos
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 3000);
    } else {
        // Armazena a opção no localStorage e redireciona
        localStorage.setItem("tipoServico", tipoEquipamento);
        window.location.href = "equipamento.html";
    }
});







//TIMEOUT

let timeoutId; // Armazena o ID do timeout
const tempoInatividade = 60000; // 5000ms = 5 segundos

// Função para iniciar o timeout de redirecionamento
function iniciarTimeout() {
  timeoutId = setTimeout(() => {
    window.location.href = "../index.html"; // Página de destino
  }, tempoInatividade);
}

// Função para resetar o timeout sempre que houver interação
function resetarTimeout() {
  clearTimeout(timeoutId); // Cancela o timeout anterior
  iniciarTimeout(); // Reinicia o timeout
}

// Adiciona os eventos de interação na página
function monitorarInteracao() {
  document.addEventListener("click", resetarTimeout);
  document.addEventListener("mousemove", resetarTimeout);
  document.addEventListener("keydown", resetarTimeout);
  document.addEventListener("touchstart", resetarTimeout); // Para dispositivos móveis
}

// Inicia o monitoramento ao carregar a página
window.onload = function () {
  monitorarInteracao();
  iniciarTimeout(); // Começa o timeout logo no início
};