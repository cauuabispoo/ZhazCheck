

//SELECT

$(".custom-select").each(function() {
  var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");
  
  var template = '<div class="' + classes + '">';
  template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + "</span>";
  template += '<div class="custom-options">';
  
  $(this).find("option").each(function() {
      template += '<span class="custom-option" data-value="' + $(this).attr("value") + '">' + $(this).html() + "</span>";
  });
  
  template += "</div></div>";

  $(this).wrap('<div class="custom-select-wrapper"></div>');
  $(this).hide();
  $(this).after(template);
});

$(".custom-select-trigger").on("click", function(event) {
  $("html").one("click", function() {
      $(".custom-select").removeClass("opened");
  });
  $(this).parents(".custom-select").toggleClass("opened");
  event.stopPropagation();
});

$(".custom-option").on("click", function() {
  $(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
  $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
  $(this).addClass("selection");
  $(this).parents(".custom-select").removeClass("opened");
  $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
});

// Armazenar o valor selecionado e redirecionar
document.getElementById("proceed").addEventListener("click", function() {
  const select = document.getElementById("potencial");
  const alertBox = document.getElementById("alertBox");

  if (select.value === "") {
    // Exibe o alerta
    alertBox.classList.remove("hidden");
    alertBox.style.display = "block";

    // Oculta o alerta após 3 segundos
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 3000);
  } else {
    // Armazena a opção no localStorage e redireciona
    localStorage.setItem("selectedOption", select.value);
    window.location.href = "garantia.html";
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