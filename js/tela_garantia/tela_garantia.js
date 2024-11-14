$(document).ready(() => {
    const verficaEquipamento = localStorage.getItem('selectedOption');
    const verificatipoServico = localStorage.getItem('tipoServico');

    if (!verficaEquipamento || !verificatipoServico) {
        window.location.href = "../index.html";
        localStorage.clear();
    }
});




let lacreGlobal = "";
let tipoLacreGlobal = "";

$(document).ready(function () {
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
    const select = $(this).parents(".custom-select-wrapper").find("select");

    select.val(value);
    // Define o valor no select oculto
    $(this).parents(".custom-select-wrapper").find("select").val(value);
    $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".custom-select").removeClass("opened");
    $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
    atualizarVariavelGlobal(select.attr('id'), value);
  });

  // Esconde o segundo select inicialmente
  $("#tipoLacre").parents("section").hide();

});

function atualizarVariavelGlobal(selectId, value) {
    switch (selectId) {
        case 'lacre':
            lacreGlobal = value;
            if (value === 'sim') {
                $("#tipoLacre").parents("section").show();
            } else{
                $("#tipoLacre").parents("section").hide();
            }
            break;
        case 'tipoLacre':
            tipoLacreGlobal = value;
            break;
    }
}


document.getElementById("goBack").addEventListener("click", function () {
    localStorage.removeItem('modeloEquipamento');
    localStorage.removeItem('selectedOption');
    window.location.href = "equipamento.html";
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

document.getElementById("submitButton").addEventListener("click", function () {
    if (lacreGlobal === 'nao') {
        localStorage.setItem('lacre', lacreGlobal);
        window.location.href = "checklist.html";
    } else if (lacreGlobal === 'sim') {
        if(tipoLacreGlobal){
            localStorage.setItem('lacre', lacreGlobal);
            localStorage.setItem('tipoLacre', tipoLacreGlobal);
            window.location.href = "lacre.html";
        }else{
            exibirAlerta();
        }
    } else {
        exibirAlerta();
    }
});