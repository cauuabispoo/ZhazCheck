// Dados locais: cada item pode ter múltiplos tipos de equipamentos associados
const dados = [
    { id: 1, nome: 'Substituição de componente', equipamentos: ['coletor', 'leitor', 'impressora', 'wifiImpressora', 'celular'], valor: '1' },
    { id: 2, nome: 'Recuperação de placa', equipamentos: ['coletor', 'leitor', 'impressora', 'wifiImpressora', 'celular'], valor: '2' },
    { id: 3, nome: 'Recuperação de carcaça', equipamentos: ['coletor', 'leitor', 'impressora', 'wifiImpressora', 'celular'], valor: '3' },
    { id: 4, nome: 'Recuperação de bateria Skorpio', equipamentos: ['coletor'], valor: '4' },
    { id: 5, nome: 'Atualização do sistema Android', equipamentos: ['coletor', 'celular'], valor: '5' },
    { id: 6, nome: 'Restauração da mémoria', equipamentos: ['coletor', 'celular'], valor: '6' },
    { id: 7, nome: 'Upgrade de Firmware', equipamentos: ['coletor', 'impressora', 'wifiImpressora', 'celular'], valor: '7' },
    { id: 8, nome: 'Downgrade de Firmware', equipamentos: ['coletor', 'impressora', 'wifiImpressora', 'celular'], valor: '8' },
];


// Função para carregar opções no select com base no localStorage
async function carregarOpcoes() {
    const tipoEquipamento = localStorage.getItem('selectedOption'); // Valor do localStorage
    const select = $("#response");
    select.empty(); // Limpa o select

    // Adiciona opções compatíveis com o equipamento selecionado
    dados.forEach(item => {
        if (item.equipamentos.includes(tipoEquipamento)) {
            select.append(`<option value="${item.valor}">${item.nome}</option>`);
        }
    });

    const select1 = $("#peca");
    select1.empty(); // Limpa o select
    select1.append('<option value="" disabled selected></option>'); // Placeholder

    var comparaSelectedOption = tipoEquipamento.toLowerCase(); // Converter para minúsculo
    if (comparaSelectedOption === 'wifiimpressora') {
        comparaSelectedOption = 'impressora';
    }

    try {
        const resposta = await fetch('../csv/pecas.csv'); // Carrega o CSV
        const textoCSV = await resposta.text();

        // Converte o CSV em uma lista de objetos
        const linhas = textoCSV.trim().split('\n').slice(1); // Ignora o cabeçalho
        const dados = linhas.map(linha => {
            const [id, nome, equipamentos] = linha.split(',');
            return { id, nome, equipamentos: equipamentos.toLowerCase() }; // Converter para minúsculo
        });

        // Filtra e adiciona as opções ao select
        dados.forEach(item => {
            if (item.equipamentos.includes(comparaSelectedOption)) {
                select1.append(`<option value="${item.id}">${item.nome}</option>`);
            }
        });

        if (select1.find('option').length === 1) {
            alert('Nenhuma opção disponível para este equipamento.');
        }
    } catch (erro) {
        console.error('Erro ao carregar o CSV:', erro);
    }

    const select2 = $("#peca1");
    select2.empty(); // Limpa o select
    select2.append('<option value="" disabled selected></option>'); // Placeholder

    var comparaSelectedOption = tipoEquipamento.toLowerCase(); // Converter para minúsculo
    if (comparaSelectedOption === 'wifiimpressora') {
        comparaSelectedOption = 'impressora';
    }

    try {
        const resposta = await fetch('../csv/pecas.csv'); // Carrega o CSV
        const textoCSV = await resposta.text();

        // Converte o CSV em uma lista de objetos
        const linhas = textoCSV.trim().split('\n').slice(1); // Ignora o cabeçalho
        const dados = linhas.map(linha => {
            const [id, nome, equipamentos] = linha.split(',');
            return { id, nome, equipamentos: equipamentos.toLowerCase() }; // Converter para minúsculo
        });

        // Filtra e adiciona as opções ao select
        dados.forEach(item => {
            if (item.equipamentos.includes(comparaSelectedOption)) {
                select2.append(`<option value="${item.id}">${item.nome}</option>`);
            }
        });

        if (select2.find('option').length === 1) {
            alert('Nenhuma opção disponível para este equipamento.');
        }
    } catch (erro) {
        console.error('Erro ao carregar o CSV:', erro);
    }


    const select3 = $("#peca2");
    select3.empty(); // Limpa o select
    select3.append('<option value="" disabled selected></option>'); // Placeholder

    var comparaSelectedOption = tipoEquipamento.toLowerCase(); // Converter para minúsculo
    if (comparaSelectedOption === 'wifiimpressora') {
        comparaSelectedOption = 'impressora';
    }

    try {
        const resposta = await fetch('../csv/pecas.csv'); // Carrega o CSV
        const textoCSV = await resposta.text();

        // Converte o CSV em uma lista de objetos
        const linhas = textoCSV.trim().split('\n').slice(1); // Ignora o cabeçalho
        const dados = linhas.map(linha => {
            const [id, nome, equipamentos] = linha.split(',');
            return { id, nome, equipamentos: equipamentos.toLowerCase() }; // Converter para minúsculo
        });

        // Filtra e adiciona as opções ao select
        dados.forEach(item => {
            if (item.equipamentos.includes(comparaSelectedOption)) {
                select3.append(`<option value="${item.id}">${item.nome}</option>`);
            }
        });

        if (select3.find('option').length === 1) {
            alert('Nenhuma opção disponível para este equipamento.');
        }
    } catch (erro) {
        console.error('Erro ao carregar o CSV:', erro);
    }


    const select4 = $("#peca3");
    select4.empty(); // Limpa o select
    select4.append('<option value="" disabled selected></option>'); // Placeholder

    var comparaSelectedOption = tipoEquipamento.toLowerCase(); // Converter para minúsculo
    if (comparaSelectedOption === 'wifiimpressora') {
        comparaSelectedOption = 'impressora';
    }

    try {
        const resposta = await fetch('../csv/pecas.csv'); // Carrega o CSV
        const textoCSV = await resposta.text();

        // Converte o CSV em uma lista de objetos
        const linhas = textoCSV.trim().split('\n').slice(1); // Ignora o cabeçalho
        const dados = linhas.map(linha => {
            const [id, nome, equipamentos] = linha.split(',');
            return { id, nome, equipamentos: equipamentos.toLowerCase() }; // Converter para minúsculo
        });

        // Filtra e adiciona as opções ao select
        dados.forEach(item => {
            if (item.equipamentos.includes(comparaSelectedOption)) {
                select4.append(`<option value="${item.id}">${item.nome}</option>`);
            }
        });

        if (select2.find('option').length === 1) {
            alert('Nenhuma opção disponível para este equipamento.');
        }
    } catch (erro) {
        console.error('Erro ao carregar o CSV:', erro);
    }

    inicializarSelectCustomizado(); // Atualiza o select customizado
}

// Função para inicializar ou atualizar o select customizado
function inicializarSelectCustomizado() {
    $(".custom-select").each(function () {
        const classes = $(this).attr("class");
        const template = `
<div class="${classes}">
  <span class="custom-select-trigger">${$(this).attr("placeholder") || 'Selecione uma opção'}</span>
  <div class="custom-options">
    ${$(this).find("option").map(function () {
            return `<span class="custom-option" data-value="${$(this).val()}">${$(this).text()}</span>`;
        }).get().join("")}
  </div>
</div>`;

        $(this).wrap('<div class="custom-select-wrapper"></div>').hide().after(template);
    });

    // Eventos para abrir e fechar o select customizado
    $(".custom-select-trigger").on("click", function (event) {
        const select = $(this).parents(".custom-select");

        // Fecha todos os selects abertos, exceto o que foi clicado
        $(".custom-select").not(select).removeClass("opened");

        // Alterna a classe 'opened' no select atual
        select.toggleClass("opened");

        $("html").one("click", function () {
            select.removeClass("opened");
        });

        event.stopPropagation();
    });

    let valorSelecionadoGlobal = ''; // Variável global para armazenar o valor selecionado

    // Evento para selecionar uma opção
    $(".custom-option").on("click", function () {
        const value = $(this).data("value");
        const select = $(this).parents(".custom-select-wrapper").find("select");

        select.val(value); // Define o valor selecionado no select
        $(this).siblings().removeClass("selection");
        $(this).addClass("selection");

        $(this).parents(".custom-select").removeClass("opened")
            .find(".custom-select-trigger").text($(this).text());

        // Atualiza a variável global quando uma opção é selecionada
        if (select.attr('id') === 'response') {
            valorSelecionadoGlobal = value; // Atualiza o valor selecionado global
        }

        // Exibe ou oculta elementos com base no valor selecionado
        exibirElementosPorValor(valorSelecionadoGlobal);

        // Altera dinamicamente o CSS do select
        alterarTopDoSelect(valorSelecionadoGlobal);
    });
}

function exibirElementosPorValor(valorSelecionado) {
    $(".elemento-controlado").each(function () {
        const elemento = $(this);
        if (elemento.hasClass(`elemento-${valorSelecionado}`)) {
            elemento.show(); // Exibe o elemento correspondente
        } else {
            elemento.hide(); // Esconde os outros
        }
    });
}

// Função para alterar dinamicamente o 'top' do select
function alterarTopDoSelect(valor) {
    const topValue = valor ? '100px' : '0px'; // Se tiver valor, '30px', caso contrário '0px'
    $(".servico").css('top', topValue);
}













// Carregar as opções ao abrir a página
$(document).ready(() => {
    carregarOpcoes();

    const opcaoSalva = localStorage.getItem('opcaoSelecionada');
    if (opcaoSalva) {
        $("#response").val(opcaoSalva); // Define o valor apenas se houver um valor no localStorage
    } else {
        $("#response").val(''); // Se não houver, define como vazio
    }
});



// Função para adicionar um item ao localStorage
function adicionarAoLocalStorage(chave, valor) {
    // Recupera o array existente ou inicializa um novo array se não existir
    const itensExistentes = JSON.parse(localStorage.getItem(chave)) || [];

    // Adiciona o novo item ao array
    itensExistentes.push(valor);

    // Salva o array atualizado no localStorage
    localStorage.setItem(chave, JSON.stringify(itensExistentes));
}


// Ação para confirmar e salvar a escolha no localStorage
$(document).on("click", ".Btn", function () {
    const alertBox = document.getElementById("alertBox");

    // Seleciona os valores do select mais próximo do botão clicado
    const $parent = $(this).closest("tr"); // Supondo que o botão está dentro de uma linha <tr>
    const valorSelecionado = $parent.find("#peca").val();
    const servicoSelecionado = $parent.find("#response").val();

    const chave = 'observacoes'; // A chave para o localStorage
    const novoItem = { valorSelecionado, servicoSelecionado };

    console.log("Valor Selecionado:", valorSelecionado);
    console.log("Serviço Selecionado:", servicoSelecionado);

    if (valorSelecionado && servicoSelecionado) {
        adicionarAoLocalStorage(chave, novoItem);
        location.replace(location.href); // Recarrega a página
    } else {
        alertBox.classList.remove("hidden");
        alertBox.style.display = "block";

        // Oculta o alerta após 3 segundos
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 3000);
    }
});




document.getElementById("goBack").addEventListener("click", function () {
    localStorage.removeItem("osAnterior");
    localStorage.removeItem("dataManutencao");
    localStorage.removeItem("obsUltimoServico");
    localStorage.removeItem("pecaSelecionada");
    localStorage.removeItem("servicoSelecionado");
    localStorage.removeItem("observacoes");
    const checkValue = localStorage.getItem('check');
    const lacreValue = localStorage.getItem('lacre');
    if (checkValue === 'nao' && lacreValue === 'nao') {
        window.location.href = "garantia.html";
    } else if (checkValue === 'sim') {
        window.location.href = "checklist.html";
    } else if (checkValue === 'nao' && lacreValue === 'sim') {
        window.location.href = "lacre.html";
    }
});

document.getElementById("submitButton").addEventListener("click", function () {

});