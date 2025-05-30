$(document).ready(() => {
  const verificatipoServico = localStorage.getItem('tipoServico');

  if (!verificatipoServico) {
      window.location.href = "../index.html";
      localStorage.clear();
  }
});



let tipoEquipamento = "";
let modeloEquipamento = "";
const tipoServico = localStorage.getItem('tipoServico');


$(document).ready(function () {
  let dataFromCSV = []; // Variável para armazenar os dados do CSV

  // Carregar o CSV
  function loadCSV() {
    $.ajax({
      url: "../csv/equipamentos.csv", // Caminho para o CSV
      dataType: "text",
      success: function (data) {
        dataFromCSV = parseCSV(data);
        //console.log("CSV carregado com sucesso:", dataFromCSV); // Debug
      },
      error: function () {
        alert("Erro ao carregar o CSV.");
      }
    });
  }

  // Função para processar o CSV em um array de objetos
  function parseCSV(data) {
    const rows = data.trim().split("\n");
    return rows.map(row => {
      const [id, modelo, equipamento] = row.split(",");
      return { id: id.trim().toLowerCase(), modelo: modelo.trim(), equipamento: equipamento.trim().toLowerCase() };
    });
  }

  // Função para atualizar o segundo select customizado
  function updateSecondSelect(selectedEquipamento) {
    const filteredOptions = dataFromCSV.filter(item => item.equipamento === selectedEquipamento);
    //console.log("Opções filtradas:", filteredOptions); // Debug

    const $modelSelect = $("#model");
    const $customOptions = $modelSelect
      .closest(".custom-select-wrapper")
      .find(".custom-options");

    // Limpa as opções anteriores
    $customOptions.empty();
    $modelSelect.val(""); // Reseta o valor selecionado

    /// Reseta o texto do trigger para o placeholder
    const $customSelect = $modelSelect.parents(".custom-select");
    $customSelect.find(".custom-select-trigger").text("Selecione");

    // Adiciona campo de pesquisa
    const searchInputHtml = `<input type="text" class="search-input" placeholder="Pesquisar...">`;
    $customOptions.append(searchInputHtml);

    if (filteredOptions.length === 0) {
      $customOptions.append('<span class="custom-option" data-value="">Nenhum modelo disponível</span>');
    } else {
      filteredOptions.forEach(item => {
        const optionHtml = `<span class="custom-option" data-value="${item.id}">${item.modelo}</span>`;
        $customOptions.append(optionHtml);
      });
    }

    // Evento de clique nas opções do primeiro select
    $(".custom-option").on("click", function () {
      var selectedValue = $(this).data("value");
      var $selectWrapper = $(this).parents(".custom-select-wrapper");
      var $select = $selectWrapper.find("select");

      modeloEquipamento = selectedValue;

      // Atualiza o valor do select escondido
      $select.val(selectedValue);
      $selectWrapper.find(".custom-option").removeClass("selection");
      $(this).addClass("selection");
      $(this).parents(".custom-select").removeClass("opened");
      $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());

    });

    // Exibe o segundo select
    $modelSelect.parents("section").show();
    // Adiciona evento de pesquisa
    $customOptions.find(".search-input").on("input", function () {
      const searchTerm = $(this).val().toLowerCase();
      $customOptions.find(".custom-option").each(function () {
        const optionText = $(this).text().toLowerCase();
        if (optionText.includes(searchTerm)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
     // Impedir o fechamento do select ao clicar no campo de busca
     $(".search-input").on("click", function (event) {
      event.stopPropagation(); // Impede o clique de fechar o select
    });
  }


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
      if (tipoServico === 'laudo'){
        updateSecondSelect(value);
      }
      tipoEquipamento = value;
    }
  });

  // Esconde o segundo select inicialmente
  $("#model").parents("section").hide();

  // Carregar o CSV ao iniciar
  loadCSV();
});


document.getElementById("goBack").addEventListener("click", function () {
  localStorage.removeItem('modeloEquipamento');
  localStorage.removeItem('selectedOption');
  localStorage.removeItem('tipoServico');
  window.location.href = "tipoServico.html";
});


// Armazenar o valor selecionado e redirecionar
document.getElementById("proceed").addEventListener("click", function () {
  const alertBox = document.getElementById("alertBox");

  if (tipoServico === 'laudo'){
    if (tipoEquipamento === "" || modeloEquipamento === "") {
      // Exibe o alerta
      alertBox.classList.remove("hidden");
      alertBox.style.display = "block";
  
      // Oculta o alerta após 3 segundos
      setTimeout(() => {
        alertBox.style.display = "none";
      }, 3000);
    } else {
      // Armazena a opção no localStorage e redireciona
      localStorage.setItem("selectedOption", tipoEquipamento);
      localStorage.setItem("modeloEquipamento", modeloEquipamento);
  
      window.location.href = "garantia.html";
    }
  } else {
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
      localStorage.setItem("selectedOption", tipoEquipamento);
      localStorage.setItem("modeloEquipamento", modeloEquipamento);
  
      window.location.href = "checklist.html";
    }
  }
});

const customSelect = document.querySelector('.custom-select');
const customOptions = document.querySelector('.custom-options');

customSelect.addEventListener('click', function () {
  this.classList.toggle('opened');

  // Calcule o espaço disponível abaixo do select
  const rect = this.getBoundingClientRect();
  const optionsHeight = customOptions.offsetHeight;
  const spaceBelow = window.innerHeight - rect.bottom;

  if (spaceBelow < optionsHeight) {
    // Se não houver espaço suficiente, abre para cima
    customOptions.style.top = 'auto';
    customOptions.style.bottom = '100%';
  } else {
    // Caso contrário, abre para baixo
    customOptions.style.top = '100%';
    customOptions.style.bottom = 'auto';
  }
});