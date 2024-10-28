// Dados locais: cada item pode ter múltiplos tipos de equipamentos associados
const dados = [
    { id: 1, nome: 'Substituição de componente', equipamentos: ['coletor', 'leitor', 'impressora', 'celular'], valor: '1' },
    { id: 10, nome: 'Instalação de componente', equipamentos: ['coletor', 'leitor', 'impressora', 'celular'], valor: '10' },
    { id: 2, nome: 'Recuperação de placa', equipamentos: ['coletor', 'leitor', 'impressora', 'celular'], valor: '2' },
    { id: 3, nome: 'Recuperação de carcaça', equipamentos: ['coletor', 'leitor', 'impressora', 'celular'], valor: '3' },
    { id: 4, nome: 'Recuperação de bateria Skorpio', equipamentos: ['coletor'], valor: '4' },
    { id: 5, nome: 'Atualização do sistema Android', equipamentos: ['coletor', 'celular'], valor: '5' },
    { id: 6, nome: 'Restauração da mémoria', equipamentos: ['coletor', 'celular'], valor: '6' },
    { id: 7, nome: 'Upgrade de Firmware', equipamentos: ['coletor', 'impressora', 'celular'], valor: '7' },
    { id: 8, nome: 'Downgrade de Firmware', equipamentos: ['coletor', 'impressora', 'celular'], valor: '8' },
    { id: 9, nome: 'Acessórios', equipamentos: ['coletor', 'impressora', 'celular'], valor: '9' },
];


// Função para carregar opções no select com base no localStorage
async function carregarOpcoes() {
    const tipoEquipamento = localStorage.getItem('selectedOption'); // Valor do localStorage
    const modeloEquipamento = localStorage.getItem('modeloEquipamento');
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

    const select2 = $("#peca1");
    select2.empty(); // Limpa o select
    select2.append('<option value="" disabled selected></option>'); // Placeholder

    const select3 = $("#peca2");
    select3.empty(); // Limpa o select
    select3.append('<option value="" disabled selected></option>'); // Placeholder

    const select4 = $("#peca3");
    select4.empty(); // Limpa o select
    select4.append('<option value="" disabled selected></option>'); // Placeholder

    const select5 = $("#peca4");
    select4.empty(); // Limpa o select
    select4.append('<option value="" disabled selected></option>'); // Placeholder

    try {
        const resposta = await fetch('../csv/CadastroItens(CadastroItens).csv'); // Carrega o CSV
        // const resposta = await fetch('../csv/CadastroItens(CadastroItens).csv');
        const textoCSV = await resposta.text();
        

        // Converte o CSV em uma lista de objetos
        const linhas = textoCSV.trim().split('\n').slice(1); // Ignora o cabeçalho
        const dados = linhas.map(linha => {
            const [id, nome] = linha.split(',');
            return { id, nome}; 
        });
        
        

        // Filtra e adiciona as opções ao select
        dados.forEach(item => {
            if (item.nome.toLowerCase().includes(modeloEquipamento.toLowerCase())) { // Verifica se o nome contém o valor do localStorage
                select1.append(`<option value="${item.id}">${item.nome}</option>`);
                select2.append(`<option value="${item.id}">${item.nome}</option>`);
                select3.append(`<option value="${item.id}">${item.nome}</option>`);
                select5.append(`<option value="${item.id}">${item.nome}</option>`);
            }
            select4.append(`<option value="${item.id}">${item.nome}</option>`);
        });

    } catch (erro) {
        console.error('Erro ao carregar o CSV:', erro);
    }

    inicializarSelectCustomizado(); // Atualiza o select customizado
    
}





let valorSelecionadoGlobal = ''; // Variável global para armazenar o valor selecionado
let pecaSelecionadoGlobal = '';
let peca1SelecionadoGlobal = '';
let peca2SelecionadoGlobal = '';
let peca3SelecionadoGlobal = '';
let peca4SelecionadoGlobal = '';
let nivelSelecionadoGlobal = '';
let causaDefeitoSelecionadoGlobal = '';
let obsDefeitoSelecionadoGlobal = '';
let opcSelecionadoGlobal = '';


function inicializarSelectCustomizado() {
    $(".custom-select").each(function () {
        const select = $(this);
        const selectId = select.attr("id");

        // Renderiza o campo de pesquisa apenas para os selects desejados
        const isSelectComPesquisa = ['peca', 'peca1', 'peca2', 'peca3', 'peca4'].includes(selectId);

        const template = `
<div class="${select.attr("class")}">
  <span class="custom-select-trigger">${select.attr("placeholder") || 'Selecione uma opção'}</span>
  <div class="custom-options">
    ${isSelectComPesquisa ? '<input type="text" class="search-input" placeholder="Pesquisar..." />' : ''}
    ${select.find("option").map(function () {
            return `<span class="custom-option" data-value="${$(this).val()}">${$(this).text()}</span>`;
        }).get().join("")}
  </div>
</div>`;

        select.wrap('<div class="custom-select-wrapper"></div>').hide().after(template);
    });

    // Eventos para abrir e fechar o select customizado
    $(".custom-select-trigger").on("click", function (event) {
        const select = $(this).parents(".custom-select");

        // Fecha todos os selects abertos, exceto o que foi clicado
        $(".custom-select").not(select).removeClass("opened");
        select.toggleClass("opened");
        $("html").one("click", () => select.removeClass("opened"));
        event.stopPropagation();
    });

    // Evento para selecionar uma opção
    $(".custom-option").on("click", function () {
        const value = $(this).data("value");
        const select = $(this).parents(".custom-select-wrapper").find("select");

        select.val(value);
        $(this).siblings().removeClass("selection");
        $(this).addClass("selection");

        $(this).parents(".custom-select").removeClass("opened")
            .find(".custom-select-trigger").text($(this).text());

        // Atualiza variáveis globais
        atualizarVariavelGlobal(select.attr('id'), value);

        // Exibe elementos e ajusta CSS
        exibirElementosPorValor(valorSelecionadoGlobal);
        alterarTopDoSelect(valorSelecionadoGlobal);
    });

    // Evento de pesquisa, aplicado apenas aos selects com pesquisa
    $(".search-input").on("input", function () {
        const termo = $(this).val().toLowerCase();
        const options = $(this).siblings(".custom-option");

        options.each(function () {
            const texto = $(this).text().toLowerCase();
            $(this).toggle(texto.includes(termo)); // Mostra ou esconde a opção
        });
    });

    $(".search-input").on("click", function (event) {
        event.stopPropagation(); // Impede o clique de fechar o select
      });
}

// Função para atualizar variáveis globais com base no select selecionado
function atualizarVariavelGlobal(selectId, value) {
    switch (selectId) {
        case 'response':
            valorSelecionadoGlobal = value;
            break;
        case 'peca':
            pecaSelecionadoGlobal = value;
            break;
        case 'peca1':
            peca1SelecionadoGlobal = value;
            break;
        case 'peca2':
            peca2SelecionadoGlobal = value;
            break;
        case 'peca3':
            peca3SelecionadoGlobal = value;
            break;
        case 'peca4':
            peca4SelecionadoGlobal = value;
            break;
        case 'nivel':
            nivelSelecionadoGlobal = value;
            break;
        case 'causaDefeito':
            causaDefeitoSelecionadoGlobal = value;
            break;
        case 'opc':
            opcSelecionadoGlobal = value;
            break;
    }
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
    const topValue = valor ? '102px' : '0px'; // Se tiver valor, '30px', caso contrário '0px'
    $(".servico").css('top', topValue);
    const rightValue = valor ? '300px' : '0px'; // Se tiver valor, '30px', caso contrário '0px'
    $(".servico").css('right', rightValue);
}













// Carregar as opções ao abrir a página
$(document).ready(() => {
    const verficaEquipamento = localStorage.getItem('selectedOption');
    const verficaCheck = localStorage.getItem('check');

    if (!verficaEquipamento || !verficaCheck) {
        window.location.href = "../index.html";
        localStorage.clear();
    } else {
        carregarOpcoes();

        const opcaoSalva = localStorage.getItem('opcaoSelecionada');
        if (opcaoSalva) {
            $("#response").val(opcaoSalva); // Define o valor apenas se houver um valor no localStorage
        } else {
            $("#response").val(''); // Se não houver, define como vazio
        }
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

    if (valorSelecionadoGlobal === 1) {

        obsDefeitoSelecionadoGlobal = document.getElementById("obsDefeito").value.trim().toUpperCase();
        const chave = 'observacoes'; // A chave para o localStorage
        const novoItem = { valorSelecionadoGlobal, pecaSelecionadoGlobal, causaDefeitoSelecionadoGlobal, obsDefeitoSelecionadoGlobal, opcSelecionadoGlobal };

        // console.log("Serviço Selecionado:", valorSelecionadoGlobal);
        // console.log("Peça Selecionada:", pecaSelecionadoGlobal);
        // console.log("Causa Selecionada:", causaDefeitoSelecionadoGlobal);
        // console.log("Observação Selecionado:", obsDefeitoSelecionadoGlobal);
        // console.log("Opcional Selecionado:", opcSelecionadoGlobal);

        if (pecaSelecionadoGlobal && causaDefeitoSelecionadoGlobal && opcSelecionadoGlobal) {
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

    } else if (valorSelecionadoGlobal === 2) {
        obsDefeitoSelecionadoGlobal = document.getElementById("obsDefeito1").value.trim().toUpperCase();
        const chave = 'observacoes'; // A chave para o localStorage
        const novoItem = { valorSelecionadoGlobal, nivelSelecionadoGlobal, peca1SelecionadoGlobal, causaDefeitoSelecionadoGlobal, obsDefeitoSelecionadoGlobal, opcSelecionadoGlobal };

        // console.log("Serviço Selecionado:", valorSelecionadoGlobal);
        // console.log("Peça Selecionada:", pecaSelecionadoGlobal);
        // console.log("Causa Selecionada:", causaDefeitoSelecionadoGlobal);
        // console.log("Observação Selecionado:", obsDefeitoSelecionadoGlobal);
        // console.log("Opcional Selecionado:", opcSelecionadoGlobal);

        if (nivelSelecionadoGlobal && peca1SelecionadoGlobal && causaDefeitoSelecionadoGlobal && opcSelecionadoGlobal) {
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

    } else if (valorSelecionadoGlobal === 3) {
        obsDefeitoSelecionadoGlobal = document.getElementById("obsDefeito2").value.trim().toUpperCase();
        const chave = 'observacoes'; // A chave para o localStorage
        const novoItem = { valorSelecionadoGlobal, peca2SelecionadoGlobal, causaDefeitoSelecionadoGlobal, obsDefeitoSelecionadoGlobal, opcSelecionadoGlobal };

        // console.log("Serviço Selecionado:", valorSelecionadoGlobal);
        // console.log("Peça Selecionada:", pecaSelecionadoGlobal);
        // console.log("Causa Selecionada:", causaDefeitoSelecionadoGlobal);
        // console.log("Observação Selecionado:", obsDefeitoSelecionadoGlobal);
        // console.log("Opcional Selecionado:", opcSelecionadoGlobal);

        if (peca2SelecionadoGlobal && causaDefeitoSelecionadoGlobal && opcSelecionadoGlobal) {
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

    } else if (valorSelecionadoGlobal === 4) {
        obsDefeitoSelecionadoGlobal = document.getElementById("obsDefeito3").value.trim().toUpperCase();
        const chave = 'observacoes'; // A chave para o localStorage
        const novoItem = { valorSelecionadoGlobal, causaDefeitoSelecionadoGlobal, obsDefeitoSelecionadoGlobal, opcSelecionadoGlobal };

        // console.log("Serviço Selecionado:", valorSelecionadoGlobal);
        // console.log("Peça Selecionada:", pecaSelecionadoGlobal);
        // console.log("Causa Selecionada:", causaDefeitoSelecionadoGlobal);
        // console.log("Observação Selecionado:", obsDefeitoSelecionadoGlobal);
        // console.log("Opcional Selecionado:", opcSelecionadoGlobal);

        if (causaDefeitoSelecionadoGlobal && opcSelecionadoGlobal) {
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

    } else if (valorSelecionadoGlobal === 5) {
        obsDefeitoSelecionadoGlobal = document.getElementById("obsDefeito4").value.trim().toUpperCase();
        const chave = 'observacoes'; // A chave para o localStorage
        const novoItem = { valorSelecionadoGlobal, obsDefeitoSelecionadoGlobal, opcSelecionadoGlobal };

        // console.log("Serviço Selecionado:", valorSelecionadoGlobal);
        // console.log("Peça Selecionada:", pecaSelecionadoGlobal);
        // console.log("Causa Selecionada:", causaDefeitoSelecionadoGlobal);
        // console.log("Observação Selecionado:", obsDefeitoSelecionadoGlobal);
        // console.log("Opcional Selecionado:", opcSelecionadoGlobal);

        if (opcSelecionadoGlobal) {
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

    } else if (valorSelecionadoGlobal === 6) {
        obsDefeitoSelecionadoGlobal = document.getElementById("obsDefeito5").value.trim().toUpperCase();
        const chave = 'observacoes'; // A chave para o localStorage
        const novoItem = { valorSelecionadoGlobal, obsDefeitoSelecionadoGlobal, opcSelecionadoGlobal };

        // console.log("Serviço Selecionado:", valorSelecionadoGlobal);
        // console.log("Peça Selecionada:", pecaSelecionadoGlobal);
        // console.log("Causa Selecionada:", causaDefeitoSelecionadoGlobal);
        // console.log("Observação Selecionado:", obsDefeitoSelecionadoGlobal);
        // console.log("Opcional Selecionado:", opcSelecionadoGlobal);

        if (opcSelecionadoGlobal) {
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

    } else if (valorSelecionadoGlobal === 7) {
        obsDefeitoSelecionadoGlobal = document.getElementById("obsDefeito6").value.trim().toUpperCase();
        const chave = 'observacoes'; // A chave para o localStorage
        const novoItem = { valorSelecionadoGlobal, obsDefeitoSelecionadoGlobal, opcSelecionadoGlobal };

        // console.log("Serviço Selecionado:", valorSelecionadoGlobal);
        // console.log("Peça Selecionada:", pecaSelecionadoGlobal);
        // console.log("Causa Selecionada:", causaDefeitoSelecionadoGlobal);
        // console.log("Observação Selecionado:", obsDefeitoSelecionadoGlobal);
        // console.log("Opcional Selecionado:", opcSelecionadoGlobal);

        if (opcSelecionadoGlobal) {
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

    } else if (valorSelecionadoGlobal === 8) {
        obsDefeitoSelecionadoGlobal = document.getElementById("obsDefeito7").value.trim().toUpperCase();
        const chave = 'observacoes'; // A chave para o localStorage
        const novoItem = { valorSelecionadoGlobal, obsDefeitoSelecionadoGlobal, opcSelecionadoGlobal };

        // console.log("Serviço Selecionado:", valorSelecionadoGlobal);
        // console.log("Peça Selecionada:", pecaSelecionadoGlobal);
        // console.log("Causa Selecionada:", causaDefeitoSelecionadoGlobal);
        // console.log("Observação Selecionado:", obsDefeitoSelecionadoGlobal);
        // console.log("Opcional Selecionado:", opcSelecionadoGlobal);

        if (opcSelecionadoGlobal) {
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

    } else if (valorSelecionadoGlobal === 9) {
        obsDefeitoSelecionadoGlobal = document.getElementById("obsDefeito8").value.trim().toUpperCase();
        const chave = 'observacoes'; // A chave para o localStorage
        const novoItem = { valorSelecionadoGlobal, peca3SelecionadoGlobal, obsDefeitoSelecionadoGlobal, opcSelecionadoGlobal };

        // console.log("Serviço Selecionado:", valorSelecionadoGlobal);
        // console.log("Peça Selecionada:", pecaSelecionadoGlobal);
        // console.log("Causa Selecionada:", causaDefeitoSelecionadoGlobal);
        // console.log("Observação Selecionado:", obsDefeitoSelecionadoGlobal);
        // console.log("Opcional Selecionado:", opcSelecionadoGlobal);

        if (peca3SelecionadoGlobal && opcSelecionadoGlobal) {
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
    } else if (valorSelecionadoGlobal === 10) {
        obsDefeitoSelecionadoGlobal = document.getElementById("obsDefeito9").value.trim().toUpperCase();
        const chave = 'observacoes'; // A chave para o localStorage
        const novoItem = { valorSelecionadoGlobal, peca4SelecionadoGlobal, causaDefeitoSelecionadoGlobal, obsDefeitoSelecionadoGlobal, opcSelecionadoGlobal };

        // console.log("Serviço Selecionado:", valorSelecionadoGlobal);
        // console.log("Peça Selecionada:", pecaSelecionadoGlobal);
        // console.log("Causa Selecionada:", causaDefeitoSelecionadoGlobal);
        // console.log("Observação Selecionado:", obsDefeitoSelecionadoGlobal);
        // console.log("Opcional Selecionado:", opcSelecionadoGlobal);

        if (peca4SelecionadoGlobal && causaDefeitoSelecionadoGlobal && opcSelecionadoGlobal) {
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
    }


});




document.getElementById("goBack").addEventListener("click", function () {
    const checkValue = localStorage.getItem('check');
    const lacreValue = localStorage.getItem('lacre');
    localStorage.removeItem("observacoes");
    if (checkValue === 'nao' && lacreValue === 'nao') {
        localStorage.removeItem("lacre");
        localStorage.removeItem("check");
        window.location.href = "garantia.html";
    } else if (checkValue === 'sim') {
        localStorage.removeItem("mac");
        localStorage.removeItem("serial");
        localStorage.removeItem("imei");
        localStorage.removeItem("resultadoChecklist");
        window.location.href = "checklist.html";
    } else if (checkValue === 'nao' && lacreValue === 'sim') {
        localStorage.removeItem("osAnterior");
        localStorage.removeItem("dataManutencao");
        localStorage.removeItem("obsUltimoServico");
        window.location.href = "lacre.html";
    }
});


// Seleciona elementos do DOM
const botaoConfirmar = document.getElementById('confirmarAcao');
const modal = document.getElementById('confirmModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');

document.getElementById("submitButton").addEventListener("click", function () {
    modal.classList.remove('hidden');
});



// Ação de confirmação
confirmBtn.addEventListener('click', () => {
    window.location.href = "laudoPronto.html"
    modal.classList.add('hidden'); // Fecha o modal
  });
  
  // Ação de cancelamento
  cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden'); // Fecha o modal
  });