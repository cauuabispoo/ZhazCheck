const tipoServico = localStorage.getItem('tipoServico');

$(document).ready(() => {
    const verficaEquipamento = localStorage.getItem('selectedOption');
    const verificatipoServico = localStorage.getItem('tipoServico');


    if (!verficaEquipamento || !verificatipoServico) {
        window.location.href = "../index.html";
        localStorage.clear();
    } else {
        gerarChecklist();
        showAdditionalContent();
    }
});


document.getElementById("goBack").addEventListener("click", function () {
    const lacreValue = localStorage.getItem('lacre');
    localStorage.removeItem("resultadoChecklist");
    localStorage.removeItem("observacoes");

    if (tipoServico === 'laudo'){
        if (lacreValue === 'sim') {
            localStorage.removeItem("mac");
            localStorage.removeItem("serial");
            localStorage.removeItem("imei");
            localStorage.removeItem("osAnterior");
            localStorage.removeItem("dataManutencao");
            localStorage.removeItem("obsUltimoServico");
            window.location.href = "lacre.html";
        } else {
            localStorage.removeItem("mac");
            localStorage.removeItem("serial");
            localStorage.removeItem("imei");
            localStorage.removeItem('lacre');
            localStorage.removeItem('tipoLacre');
            window.location.href = "garantia.html";
        }
    } else{
        window.location.href = "equipamento.html";
        localStorage.removeItem("mac");
        localStorage.removeItem("serial");
        localStorage.removeItem("imei");
    }
});





// Função para buscar o tipo de equipamento do localStorage
function buscarTipoEquipamento() {
    return localStorage.getItem('selectedOption'); // Ajuste conforme o nome da chave salva
}


// Função para salvar a seleção atual dos itens
function salvarSelecaoInicial() {
    const selecoes = {};
    document.querySelectorAll('.checklist-item input[type="radio"]:checked').forEach(radio => {
        const itemNome = radio.name;
        selecoes[itemNome] = radio.value;
    });
    return selecoes;
}

let selecaoAnterior = salvarSelecaoInicial(); // Salva o estado inicial


// Função para criar os itens do checklist
function criarChecklistItem(nomeItem) {
    return `
    <div class="checklist-item" data-nome="${nomeItem}">
    <span class="radio-a__text">${nomeItem}</span>
        <div class="radio-input">
            <div class="radio-b">
                <input type="radio" id="${nomeItem}-aprovado" name="${nomeItem}" class="radio-b__input"
                    value="aprovado" />
                <label class="radio-b__label" for="${nomeItem}-aprovado">
                    <div class="radio-b__custom">
                        <span class="radio-b__custom-fill"></span>
                    </div>
                    <span class="radio-b__text">Aprovado</span>
                </label>
            </div>
            <div class="radio-b">
                <input type="radio" id="${nomeItem}-reprovado" name="${nomeItem}" class="radio-b__input"
                    value="reprovado" value="reprovado" />
                <label class="radio-b__label" for="${nomeItem}-reprovado">
                    <div class="radio-b__custom">
                        <span class="radio-b__custom-fill"></span>
                    </div>
                    <span class="radio-b__text">Reprovado</span>
                </label>
            </div>
            <div class="radio-b">
                <input type="radio" id="${nomeItem}-nao-possui" name="${nomeItem}" class="radio-b__input" value="X (NÃO POSSUI)" />
                <label class="radio-b__label" for="${nomeItem}-nao-possui">
                    <div class="radio-b__custom">
                        <span class="radio-b__custom-fill"></span>
                    </div>
                    <span class="radio-b__text">Não possui</span>
                </label>
            </div>
        </div>
    </div>
    `;
}

// Função para gerar o checklist com base no tipo de equipamento
function gerarChecklist() {
    const tipoEquipamento = buscarTipoEquipamento();
    const checklistContainer = document.getElementById('checklist-container');
    checklistContainer.innerHTML = ''; // Limpa qualquer checklist anterior
    document.getElementById('modal').style.display = 'none';

    let itens;

    // Definindo os itens do checklist para cada tipo de equipamento
    switch (tipoEquipamento) {
        case 'coletor':
            itens = ['CARCAÇAS', 'LENTE', 'PARAFUSOS', 'PLACA PRINCIPAL', 'PLACA POWERBOARD', 'MODELO/NÚMERO DE SÉRIE', 'ACESSÓRIOS', 'TOUCH', 'LCD',
                'WI-FI', 'MÓDULO LASER', 'ALTO-FALANTE', 'CÂMERA', 'TECLADO', 'GATILHO/BOTÕES LAT.', 'BATERIA',
                'TRAVAS DA BATERIA/TAMPA', 'CARREGAMENTO/COMUNICAÇÃO - (SYNC/CHARGER)', 'SISTEMA OPERACIONAL', 'CONFIGURAÇÕES DO CLIENTE'];
            break;
        case 'leitor':
            itens = ['CARCAÇAS', 'LENTE', 'GATILHO', 'PLACA PRINCIPAL', 'MODELO/NÚMERO DE SÉRIE', 'ALTO-FALANTE',
                'MÓDULO LASER', 'CABO DE COMUNICAÇÃO', 'FONTE DE ALIMENTAÇÃO', 'CONFIGURAÇÃO', 'BATERIA', 'TAMPA DA BATERIA', 'BASE DE COMUNICAÇÃO BLUETOOTH', 'CARREGAMENTO/COMUNICAÇÃO'];
            break;
        case 'busca':
            itens = ['CARCAÇAS', 'LENTE', 'PLACA PRINCIPAL', 'MODELO/NÚMERO DE SÉRIE', 'ALTO-FALANTE',
                'MÓDULO LASER', 'FONTE DE ALIMENTAÇÃO', 'COMUNICAÇÃO', 'LCD', 'TOUCH', 'WI-FI', 'SISTEMA OPERACIONAL', 'CONFIGURAÇÕES DO CLIENTE'];
            break;
        case 'impressora':
            itens = ['CARCAÇAS', 'PLACA PRINCIPAL', 'MODELO/NÚMERO DE SÉRIE', 'PAINEL', 'PARAFUSOS', 'ACESSÓRIOS', 'CABO DE COMUNICAÇÃO', 'FONTE DE ALIMENTAÇÃO',
                'ROLETE DE BORRACHA', 'CABEÇA DE IMPRESSÃO', 'CORREIAS/ENGRENAGENS', 'LCD', 'TOUCH', 'MÓDULO LASER', 'SENSORES DE ETIQUETA', 'SENSOR DO RIBBON',
                'ALIMENTADOR', 'TRACIONADOR', 'CORTADOR', 'BOTÕES', 'GUIA DE ETIQUETA', 'TRAVAS', 'SERIAL', 'PARALELA', 'ETHERNET', 'USB', 'BLUETOOTH', 'WI-FI', 'BATERIA', 'CONFIGURAÇÃO', 'SISTEMA OPERACIONAL'];
            break;
        case 'celular':
            itens = ['CARCAÇAS', 'TAMPA DA BATERIA', 'PLACA PRINCIPAL', 'PLACA SECUNDÁRIA', 'MODELO/NÚMERO DE SÉRIE', 'ACESSÓRIOS', 'TOUCH', 'LCD',
                'CÂMERA(S) TRASEIRA', 'CÂMERA FRONTAL', 'WI-FI/BLUETOOTH', 'ALTO-FALANTE AURICULAR', 'ALTO-FALANTE PRINCIPAL', 'MICROFONE',
                'CONECTOR DE ENTRADA P2', 'BATERIA', 'CARREGAMENTO/COMUNICAÇÃO - (SYNC/CHARGER)', 'BOTÕES LATERAIS', 'CONEXÃO NAS REDES GSM(CARTÃO SIM)',
                'COMPARTIMENTO DO CARTÃO SD', 'SENSOR BIOMÉTRICO', 'SISTEMA OPERACIONAL'];
            break;
        default:
            checklistContainer.innerHTML = `<p>Nenhum checklist disponível para este tipo de equipamento.</p>`;
            return;
    }

    // Gerar e adicionar os itens do checklist
    const checklistHTML = itens.map(item => criarChecklistItem(item)).join('');
    checklistContainer.innerHTML = checklistHTML;

    // Preencher os radio buttons com os resultados salvos
    const resultadoChecklist = JSON.parse(localStorage.getItem('resultadoChecklist')) || [];
    resultadoChecklist.forEach(resultado => {
        const itemDiv = checklistContainer.querySelector(`[data-nome="${resultado.item}"]`);
        if (itemDiv) {
            const radioSelecionado = itemDiv.querySelector(`input[value="${resultado.status}"]`);
            if (radioSelecionado) {
                radioSelecionado.checked = true; // Marca o radio button correspondente
            }
        }
    });


    if (tipoServico === 'laudo'){
        atualizarChecklist()
        // Adiciona o evento de alteração aos radio buttons
        document.querySelectorAll('.checklist-item input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function () {
                const itemNome = this.name;
                const novaSelecao = this.value;
                const selecaoAnteriorItem = selecaoAnterior[itemNome];
                let observacoes = JSON.parse(localStorage.getItem('observacoes')) || [];
    
                // Criar objeto com os valores preenchidos
                const pelicula = {
                    pecaReprovada: itemNome,
                    valorSelecionadoGlobal: 9,
                    pecaSelecionadoGlobal: 'PROTHIDRO23',
                    nivelSelecionadoGlobal: '',
                    causaDefeitoSelecionadoGlobal: '',
                    obsDefeitoSelecionadoGlobal: '',
                    opcSelecionadoGlobal: ''
                };
                let peliculaConfirm = observacoes.some(observacao => observacao.pecaSelecionadoGlobal === 'PROTHIDRO23')
                    ? 'PROTHIDRO23'
                    : null;
    
                // Só abre o modal se a mudança for de 'reprovado' para 'aprovado' ou 'não possui'
                if (selecaoAnteriorItem === 'reprovado' && (novaSelecao === 'aprovado' || novaSelecao === 'X (NÃO POSSUI)')) {
                    abrirModalConfirmacao(
                        "O serviço escolhido será deletado. Deseja continuar?",
                        () => {
                            if (itemNome === 'TOUCH' && peliculaConfirm === 'PROTHIDRO23') {
                                abrirModalConfirmacao(
                                    "Deseja remover a película de hidrogel?",
                                    () => {
                                        // Confirmação: Atualiza o localStorage e salva a nova seleção
                                        observacoes = observacoes.filter(observacao => observacao.pecaReprovada !== itemNome);
                                        localStorage.setItem('observacoes', JSON.stringify(observacoes));
                                        selecaoAnterior[itemNome] = novaSelecao;
                                    },
                                    () => {
                                        observacoes = observacoes.filter(observacao => observacao.pecaReprovada !== itemNome);
                                        observacoes.push(pelicula);
                                        localStorage.setItem('observacoes', JSON.stringify(observacoes));
                                        selecaoAnterior[itemNome] = novaSelecao;
                                    }
                                );
                            } else {
                                observacoes = observacoes.filter(observacao => observacao.pecaReprovada !== itemNome);
                                localStorage.setItem('observacoes', JSON.stringify(observacoes));
                                selecaoAnterior[itemNome] = novaSelecao;
                            }
                        },
                        () => {
                            // Cancelamento: Reverte para 'reprovado'
                            document.querySelector(`input[name="${itemNome}"][value="reprovado"]`).checked = true;
                        }
                    );
                } else {
                    observacoes = observacoes.filter(observacao => observacao.pecaReprovada !== itemNome);
                    localStorage.setItem('observacoes', JSON.stringify(observacoes));
                    if (itemNome === 'TOUCH' && novaSelecao === 'aprovado') {
                        abrirModalConfirmacao(
                            "Deseja adicionar a película de hidrogel?",
                            () => {
                                observacoes.push(pelicula);
                                localStorage.setItem('observacoes', JSON.stringify(observacoes));
                                selecaoAnterior[itemNome] = novaSelecao;
                            },
                            () => {
                                selecaoAnterior[itemNome] = novaSelecao;
                            }
                        );
                    } else {
                        // Se a mudança não requer confirmação, atualiza o valor anterior
                        selecaoAnterior[itemNome] = novaSelecao;
                    }
                }
            });
        });
    }
}



// Seleciona elementos do DOM
const modal = document.getElementById('confirmModal');
const modalText = document.getElementById('modalText');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Função para abrir o modal com diferentes mensagens e ações para os botões
function abrirModalConfirmacao(texto, confirmCallback, cancelCallback) {
    modalText.textContent = texto; // Define o texto do modal
    modal.classList.remove('hidden'); // Exibe o modal

    // Define a função de confirmação
    confirmBtn.onclick = () => {
        modal.classList.add('hidden'); // Fecha o modal
        confirmCallback(); // Executa a ação de confirmação
    };

    // Define a função de cancelamento
    cancelBtn.onclick = () => {
        modal.classList.add('hidden'); // Fecha o modal
        cancelCallback(); // Executa a ação de cancelamento
    };
}




// Exemplo de uso para outra ação (por exemplo, botão de envio do formulário)
document.getElementById("submitButton").addEventListener("click", function () {
    if (tipoServico === 'laudo'){
    abrirModalConfirmacao(
        "Deseja realmente enviar o laudo?",
        () => {
            salvarChecklist()
        },
        () => {
        }
    );
} else {
    abrirModalConfirmacao(
        "Deseja finalizar a manutenção?",
        () => {
            salvarChecklist()
        },
        () => {
        }
    );
}
});


let itemReprovado = '';

// Função para manipular a seleção dos radio buttons e remover o item do localStorage se necessário
function atualizarChecklist() {
    const checklistContainer = document.getElementById('checklist-container');

    checklistContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const item = this.closest('.checklist-item').dataset.nome;
            const valorSelecionado = this.value;

            // Abrir o modal se a opção "reprovado" for selecionada
            if (valorSelecionado === 'reprovado') {
                abrirModal(item);
                itemReprovado = item;
            }
        });
    });
}

// Função para mostrar ou esconder o alertBox
function exibirAlerta() {
    alertBox.classList.remove("hidden");
    alertBox.style.display = "block";

    // Oculta o alerta após 3 segundos
    setTimeout(() => {
        alertBox.style.display = "none";
    }, 3000);
}

// Função para salvar o checklist no localStorage com validação
function salvarChecklist() {
    const tipoEquipamento = buscarTipoEquipamento();
    const checklistItems = document.querySelectorAll('.checklist-item');
    const resultadoChecklist = [];
    let todosPreenchidos = true; // Flag para verificar preenchimento

    const serialValue = document.getElementById("serialInput") ? document.getElementById("serialInput").value.trim().toUpperCase() : ""; // Verifica se existe
    const isChecked = document.getElementById("ch1") ? document.getElementById("ch1").checked : false; // Verifica se existe

    checklistItems.forEach(item => {
        const nome = item.getAttribute('data-nome');
        const radioSelecionado = item.querySelector('input[type="radio"]:checked');

        if (!radioSelecionado) {
            todosPreenchidos = false; // Se um item não estiver preenchido, marca como falso
            item.classList.add('blink'); // Adiciona classe para piscar

            // Remove a classe 'blink' após 3 segundos
            setTimeout(() => {
                item.classList.remove('blink');
            }, 3000);
        } else {
            item.classList.remove('blink'); // Remove a classe se preenchido
            const status = radioSelecionado.value;
            resultadoChecklist.push({ item: nome, status });
        }
    });

    if (!todosPreenchidos) {
        exibirAlerta();
        return; // Impede o salvamento se algum campo não estiver preenchido
    }

    localStorage.setItem('resultadoChecklist', JSON.stringify(resultadoChecklist));
    if (tipoEquipamento === "coletor") {
        const macValue = document.getElementById("macInput").value.trim().toUpperCase(); // Armazenar em maiúsculas

        if (isChecked) {
            localStorage.setItem("mac", "/");
            localStorage.setItem("serial", "/");
            localStorage.setItem("imei", "/");
            window.location.href = "laudoPronto.html";
        } else {
            // Verificar se os campos estão preenchidos
            if (!macValue || !serialValue) {
                exibirAlerta();
            } else {
                // Salvar os valores no localStorage
                localStorage.setItem("mac", macValue); // Salva em maiúsculas
                localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                localStorage.setItem("imei", "/");
                window.location.href = "laudoPronto.html";
            }
        }
    } else if (tipoEquipamento === "busca") {
        const macValue = document.getElementById("macInput").value.trim().toUpperCase(); // Armazenar em maiúsculas

        if (isChecked) {
            localStorage.setItem("mac", "/");
            localStorage.setItem("serial", "/");
            localStorage.setItem("imei", "/");
            window.location.href = "laudoPronto.html";
        } else {
            if (!serialValue) {
                exibirAlerta();
            } else {
                // Salvar os valores no localStorage
                localStorage.setItem("mac", macValue); // Salva em maiúsculas
                localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                localStorage.setItem("imei", "/");
                window.location.href = "laudoPronto.html";
            }
        }
    } else if (tipoEquipamento === "leitor") {

        if (isChecked) {
            localStorage.setItem("mac", "/");
            localStorage.setItem("serial", "/");
            localStorage.setItem("imei", "/");
            window.location.href = "laudoPronto.html";
        } else {
            if (!serialValue) {
                exibirAlerta();
            } else {
                // Salvar os valores no localStorage
                localStorage.setItem("mac", "/"); // Salva em maiúsculas
                localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                localStorage.setItem("imei", "/");
                window.location.href = "laudoPronto.html";
            }
        }
    } else if (tipoEquipamento === "impressora") {
        const macValue = document.getElementById("macInput").value.trim().toUpperCase(); // Armazenar em maiúsculas

        if (isChecked) {
            localStorage.setItem("mac", "/");
            localStorage.setItem("serial", "/");
            localStorage.setItem("imei", "/");
            window.location.href = "laudoPronto.html";
        } else {
            // Verificar se os campos estão preenchidos
            if (!serialValue) {
                exibirAlerta();
            } else {
                if (macValue) {
                    localStorage.setItem("mac", macValue);
                } else {
                    localStorage.setItem("mac", "/");
                }
                localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                localStorage.setItem("imei", "/");
                window.location.href = "laudoPronto.html";
            }
        }
    } else if (tipoEquipamento === "celular") {
        const macValue = document.getElementById("macInput").value.trim().toUpperCase(); // Armazenar em maiúsculas
        const imeiValue = document.getElementById("imeiInput").value.trim().toUpperCase(); // Armazenar em maiúsculas

        if (isChecked) {
            localStorage.setItem("mac", "/");
            localStorage.setItem("serial", "/");
            localStorage.setItem("imei", "/");
            window.location.href = "laudoPronto.html";
        } else {
            // Verificar se os campos estão preenchidos
            if (!macValue || !serialValue || !imeiValue) {
                exibirAlerta();
            } else {
                // Salvar os valores no localStorage
                localStorage.setItem("mac", macValue); // Salva em maiúsculas
                localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                localStorage.setItem("imei", imeiValue);
                window.location.href = "laudoPronto.html";
            }
        }

    }
}

function showAdditionalContent() {
    var selectedOption = localStorage.getItem("selectedOption");
    var resultDiv = document.getElementById("additionalContent");

    const macTemp = localStorage.getItem("mac");
    const serialTemp = localStorage.getItem("serial");
    const imeiTemp = localStorage.getItem("imei");

    if (selectedOption) {
        // Insere o conteúdo dinamicamente baseado na seleção
        if (selectedOption === "coletor") {
            resultDiv.innerHTML = `
                <div class='height'>
                    <div class="secInput">
                    <label for='Height'>MAC:<sup>*</sup></label>
                    <input id='macInput' type='text' autocomplete='off' name='mac' class='input' maxlength='17' />
                    </div>
                    <div class="secInput">
                    <label for='SerialNumber'>S/N:<sup>*</sup></label>
                    <input id='serialInput' type='text' autocomplete='off' name='serial' class='input' />
                    </div>
                    <div class="secInput">
                    <div class='content'>
                        <label class='checkBox'>
                            <input type='checkbox' id='ch1'>
                            <div class='transition'></div>
                        </label>
                    </div>
                    <label for='ch1'>Não possui</label>
                    </div>
                </div>
                `;
            document.getElementById("macInput").value = macTemp === "/" ? "" : macTemp; // Preenche se existir
            document.getElementById("serialInput").value = serialTemp === "/" ? "" : serialTemp; // Preenche se existir
            const checkbox = resultDiv.querySelector('#ch1');
            if (macTemp === "/" || serialTemp === "/") {
                checkbox.checked = true; // Marca o checkbox
            }

        } else if (selectedOption === "busca") {
            resultDiv.innerHTML = `
                <div class='height'>
                    <div class="secInput">
                    <label for='Height'>MAC:<sup>*</sup></label>
                    <input id='macInput' type='text' autocomplete='off' name='mac' class='input' maxlength='17' />
                    </div>
                    <div class="secInput">
                    <label for='SerialNumber'>S/N:<sup>*</sup></label>
                    <input id='serialInput' type='text' autocomplete='off' name='serial' class='input' />
                    </div>
                    <div class="secInput">
                    <div class='content'>
                        <label class='checkBox'>
                            <input type='checkbox' id='ch1'>
                            <div class='transition'></div>
                        </label>
                    </div>
                    <label for='ch1'>Não possui</label>
                    </div>
                </div>
                `;
            document.getElementById("macInput").value = macTemp === "/" ? "" : macTemp; // Preenche se existir
            document.getElementById("serialInput").value = serialTemp === "/" ? "" : serialTemp; // Preenche se existir
            const checkbox = resultDiv.querySelector('#ch1');
            if (macTemp === "/" || serialTemp === "/") {
                checkbox.checked = true; // Marca o checkbox
            }

        } else if (selectedOption === "leitor") {
            resultDiv.innerHTML = `
                <div class='height'>
                    <div class="secInput">
                        <label for='SerialNumber'>S/N:<sup>*</sup></label>
                        <input id='serialInput' type='text' autocomplete='off' name='serial' class='input' />
                    </div>
                    <div class="secInput">
                        <div class='content'>
                            <label class='checkBox'>
                                <input type='checkbox' id='ch1'>
                                <div class='transition'></div>
                            </label>
                        </div>
                        <label for='ch1'>Não possui</label>
                    </div>                    
                </div>`;
            document.getElementById("serialInput").value = serialTemp === "/" ? "" : serialTemp; // Preenche se existir
            const checkbox = resultDiv.querySelector('#ch1');
            if (serialTemp === "/") {
                checkbox.checked = true; // Marca o checkbox
            }

        } else if (selectedOption === "impressora") {
            resultDiv.innerHTML = `
                <div class='height'>
                    <div class="secInput">
                        <label for='Height'>MAC:</label>
                        <input id='macInput' type='text' autocomplete='off' name='mac' class='input' maxlength='17' />
                    </div>
                    <div class="secInput">                    
                        <label for='SerialNumber'>S/N:<sup>*</sup></label>
                        <input id='serialInput' type='text' autocomplete='off' name='serial' class='input' />
                    </div>
                    <div class="secInput">
                        <div class='content'>
                            <label class='checkBox'>
                                <input type='checkbox' id='ch1'>
                                <div class='transition'></div>
                            </label>
                        </div>
                        <label for='ch1'>Não possui</label>
                    </div>
                </div>`;
            document.getElementById("macInput").value = macTemp === "/" ? "" : macTemp; // Preenche se existir
            document.getElementById("serialInput").value = serialTemp === "/" ? "" : serialTemp; // Preenche se existir
            const checkbox = resultDiv.querySelector('#ch1');
            if (macTemp === "/" || serialTemp === "/") {
                checkbox.checked = true; // Marca o checkbox
            }
        } else if (selectedOption === "celular") {
            resultDiv.innerHTML = `
                <div class='height'>
                    <div class="secInput">
                        <label for='Height'>MAC:<sup>*</sup></label>
                        <input id='macInput' type='text' autocomplete='off' name='mac' class='input' maxlength='17' />
                    </div>
                    <div class="secInput">
                        <label for='SerialNumber'>S/N:<sup>*</sup></label>
                        <input id='serialInput' type='text' autocomplete='off' name='serial' class='input' />
                    </div>
                    <div class="secInput">
                        <label for='Imei'>IMEI:<sup>*</sup></label>
                        <input id='imeiInput' type='text' autocomplete='off' name='imei' class='input' maxlength='15' />
                    </div>
                    <div class="secInput">
                        <div class='content'>
                            <label class='checkBox'>
                                <input type='checkbox' id='ch1'>
                                <div class='transition'></div>
                            </label>
                        </div>
                        <label for='ch1'>Não possui</label>
                    </div>
                </div>`;
            document.getElementById("macInput").value = macTemp === "/" ? "" : macTemp; // Preenche se existir
            document.getElementById("serialInput").value = serialTemp === "/" ? "" : serialTemp; // Preenche se existir
            document.getElementById("imeiInput").value = imeiTemp === "/" ? "" : imeiTemp; // Preenche se existir
            const checkbox = resultDiv.querySelector('#ch1');
            if (macTemp === "/" || serialTemp === "/" || imeiTemp === "/") {
                checkbox.checked = true; // Marca o checkbox
            }
        }

        // Adiciona os eventos aos inputs após inserir o conteúdo
        const inputs = resultDiv.querySelectorAll('input[type="text"]');
        const checkbox = resultDiv.querySelector('#ch1');


        // Adiciona evento para desmarcar o checkbox ao digitar
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (checkbox.checked) {
                    checkbox.checked = false;
                }
            });
        });

        // Adiciona evento para limpar os inputs ao selecionar o checkbox
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                inputs.forEach(input => input.value = '');
            }
        });
    }
}









// Mapeamento das seções a serem exibidas baseado no valor do serviço selecionado
const combinacoesMap = {
    '1': ['pecaSection', 'causaSection', 'obsSection', 'opcSection'], // Substituição de componente
    '10': ['pecaSection', 'causaSection', 'obsSection', 'opcSection'], // Instalação de componente
    '2': ['pecaSection', 'causaSection', 'obsSection', 'opcSection', 'nivelSection'], // Recuperação de placa
    '3': ['obsCarcacaSection', 'causaSection', 'obsSection', 'opcSection'], // Recuperação de carcaça
    '4': ['causaSection', 'obsSection', 'opcSection'], // Recuperação de bateria Skorpio
    '5': ['obsSection', 'opcSection'], // Atualização do sistema Android
    '6': ['obsSection', 'opcSection'], // Restauração da mémoria
    '7': ['obsSection', 'opcSection'], // Upgrade de Firmware
    '8': ['obsSection', 'opcSection'], // Downgrade de Firmware
    '9': ['pecaSection', 'obsSection'], // Acessórios
    '12': ['obsSection', 'opcSection'], // Configuração do leitor
    '13': ['obsSection', 'opcSection'], // Recuperação do cabo de comunicação
    '14': ['obsSection', 'opcSection'], // Intalação da configuração do cliente
    '15': ['obsSection'], // Observação
    '16': ['causaSection', 'obsSection', 'opcSection'], //Recuperação do Cutter
};

// Dados locais: cada item pode ter múltiplos tipos de equipamentos associados
const dados = [
    {
        id: 1, nome: 'Substituição de componente', equipamentos: ['TOUCH', 'CARCAÇAS', 'LENTE', 'PARAFUSOS',
            'LCD', 'PLACA PRINCIPAL', 'PLACA POWERBOARD', 'WI-FI', 'MÓDULO LASER', 'ALTO-FALANTE', 'CÂMERA', 'TECLADO', 'GATILHO/BOTÕES LAT.', 'BATERIA',
            'TRAVAS DA BATERIA/TAMPA', 'CARREGAMENTO/COMUNICAÇÃO - (SYNC/CHARGER)', 'GATILHO', 'BASE DE COMUNICAÇÃO BLUETOOTH', 'CARREGAMENTO/COMUNICAÇÃO',
            'ROLETE DE BORRACHA', 'CABEÇA DE IMPRESSÃO', 'CORREIAS/ENGRENAGENS', 'SENSORES DE ETIQUETA', 'SENSOR DO RIBBON', 'ALIMENTADOR', 'TRACIONADOR', 'BOTÕES',
            'GUIA DE ETIQUETA', 'TRAVAS', 'SERIAL', 'PARALELA', 'ETHERNET', 'USB', 'BLUETOOTH', 'PLACA SECUNDÁRIA', 'SENSOR BIOMÉTRICO', 'CORTADOR', 'TAMPA DA BATERIA', 'PAINEL', 'FONTE DE ALIMENTAÇÃO', 'CABO DE COMUNICAÇÃO',
            'CONEXÃO NAS REDES GSM(CARTÃO SIM)', 'COMPARTIMENTO DO CARTÃO SD'], valor: '1'
    },

    {
        id: 10, nome: 'Instalação de componente', equipamentos: ['TOUCH', 'CARCAÇAS', 'LENTE', 'PARAFUSOS',
            'LCD', 'PLACA PRINCIPAL', 'PLACA POWERBOARD', 'WI-FI', 'MÓDULO LASER', 'ALTO-FALANTE', 'CÂMERA', 'TECLADO', 'GATILHO/BOTÕES LAT.', 'BATERIA',
            'TRAVAS DA BATERIA/TAMPA', 'CARREGAMENTO/COMUNICAÇÃO - (SYNC/CHARGER)', 'GATILHO', 'BASE DE COMUNICAÇÃO BLUETOOTH', 'ROLETE DE BORRACHA',
            'CABEÇA DE IMPRESSÃO', 'CORREIAS/ENGRENAGENS', 'SENSORES DE ETIQUETA', 'SENSOR DO RIBBON', 'ALIMENTADOR', 'TRACIONADOR', 'BOTÕES', 'GUIA DE ETIQUETA',
            'TRAVAS', 'PLACA SECUNDÁRIA', 'SENSOR BIOMÉTRICO', 'CORTADOR', 'TAMPA DA BATERIA', 'PAINEL', 'CONEXÃO NAS REDES GSM(CARTÃO SIM)', 'COMPARTIMENTO DO CARTÃO SD'], valor: '10'
    },

    {
        id: 2, nome: 'Recuperação de placa', equipamentos: ['PLACA PRINCIPAL', 'PLACA POWERBOARD', 'WI-FI', 'MÓDULO LASER', 'CÂMERA', 'TECLADO', 'GATILHO/BOTÕES LAT.',
            'CARREGAMENTO/COMUNICAÇÃO - (SYNC/CHARGER)', 'ALTO-FALANTE', 'BASE DE COMUNICAÇÃO BLUETOOTH', 'CARREGAMENTO/COMUNICAÇÃO', 'SENSORES DE ETIQUETA',
            'SENSOR DO RIBBON', 'ALIMENTADOR', 'TRACIONADOR', 'BOTÕES', 'SERIAL', 'PARALELA', 'ETHERNET', 'USB', 'BLUETOOTH', 'PLACA SECUNDÁRIA', 'SENSOR BIOMÉTRICO', 'CORTADOR', 'PAINEL', 'FONTE DE ALIMENTAÇÃO',
            'CONEXÃO NAS REDES GSM(CARTÃO SIM)', 'COMPARTIMENTO DO CARTÃO SD'], valor: '2'
    },

    { id: 3, nome: 'Recuperação de carcaça', equipamentos: ['CARCAÇAS', 'TRAVAS DA BATERIA/TAMPA', 'GATILHO', 'BASE DE COMUNICAÇÃO BLUETOOTH', 'TRAVAS', 'CORTADOR', 'TAMPA DA BATERIA', 'PAINEL'], valor: '3' },

    { id: 4, nome: 'Recuperação de bateria Skorpio', equipamentos: ['BATERIA'], valor: '4' },

    { id: 5, nome: 'Atualização do sistema Android', equipamentos: ['SISTEMA OPERACIONAL'], valor: '5' },

    { id: 6, nome: 'Restauração da mémoria', equipamentos: ['SISTEMA OPERACIONAL', 'WI-FI', 'CARREGAMENTO/COMUNICAÇÃO - (SYNC/CHARGER)'], valor: '6' },

    { id: 7, nome: 'Upgrade de Firmware', equipamentos: ['SISTEMA OPERACIONAL'], valor: '7' },

    { id: 8, nome: 'Downgrade de Firmware', equipamentos: ['SISTEMA OPERACIONAL'], valor: '8' },

    { id: 9, nome: 'Acessórios', equipamentos: ['ACESSÓRIOS', 'CABO DE COMUNICAÇÃO', 'FONTE DE ALIMENTAÇÃO'], valor: '9' },

    { id: 11, nome: 'Regulagem do módulo laser', equipamentos: ['MÓDULO LASER'], valor: '11' },

    { id: 12, nome: 'Configuração do leitor', equipamentos: ['CONFIGURAÇÃO'], valor: '12' },

    { id: 13, nome: 'Recuperação do cabo de comunicação', equipamentos: ['CABO DE COMUNICAÇÃO'], valor: '13' },

    { id: 14, nome: 'Instalação da configuração do cliente', equipamentos: ['CONFIGURAÇÕES DO CLIENTE'], valor: '14' },

    {
        id: 15, nome: 'Observação', equipamentos: ['TOUCH', 'CARCAÇAS', 'LENTE', 'PARAFUSOS', 'observacoes', 'MODELO/NÚMERO DE SÉRIE',
            'LCD', 'PLACA PRINCIPAL', 'PLACA POWERBOARD', 'WI-FI', 'MÓDULO LASER', 'ALTO-FALANTE', 'CÂMERA', 'TECLADO', 'GATILHO/BOTÕES LAT.', 'BATERIA',
            'TRAVAS DA BATERIA/TAMPA', 'CARREGAMENTO/COMUNICAÇÃO - (SYNC/CHARGER)', 'SISTEMA OPERACIONAL', 'CONFIGURAÇÕES DO CLIENTE', 'GATILHO', 'CABO DE COMUNICAÇÃO',
            'FONTE DE ALIMENTAÇÃO', 'CONFIGURAÇÃO', 'BASE DE COMUNICAÇÃO BLUETOOTH', 'CARREGAMENTO/COMUNICAÇÃO', 'ROLETE DE BORRACHA',
            'CABEÇA DE IMPRESSÃO', 'CORREIAS/ENGRENAGENS', 'SENSORES DE ETIQUETA', 'SENSOR DO RIBBON', 'ALIMENTADOR', 'TRACIONADOR', 'BOTÕES', 'GUIA DE ETIQUETA', 'TRAVAS',
            'SERIAL', 'PARALELA', 'ETHERNET', 'USB', 'BLUETOOTH', 'PLACA SECUNDÁRIA', 'SENSOR BIOMÉTRICO', 'CORTADOR', 'TAMPA DA BATERIA', 'PAINEL', 'CONEXÃO NAS REDES GSM(CARTÃO SIM)', 'COMPARTIMENTO DO CARTÃO SD'], valor: '15'
    },
    { id: 16, nome: 'Recuperação de cutter', equipamentos: ['CORTADOR'], valor: '16'},
];


const filtro = {
    'TOUCH': ['touch'],
    'PAINEL': ['PAINEL'],
    'ACESSÓRIOS': ['capa', 'hidrogel', 'pelicula', 'capinha', 'manopla', 'gatilho', 'pistola', 'ALCA', 'PEEL OFF', 'fonte'],
    'CABO DE COMUNICAÇÃO': ['cabo'],
    'FONTE DE ALIMENTAÇÃO': ['FONTE', 'PLACA FONTE'],
    'PLACA PRINCIPAL': ['PLACA PRINCIPAL'],
    'CARCAÇAS': ['CARCACA', 'PE DE APOIO', 'EIXO INFERIOR DE ROTACAO', 'CAPA DO SCANNER DE ROTACAO', 'GABINETE', 'VEDACAO', 'TAMPA DO TEAR OFF', 'TAMPA SUPERIOR CINZA', 'TAMPA DE PROTECAO'],
    'LENTE': ['LENTE'],
    'PARAFUSOS': ['PARAFUSO'],
    'LCD': ['LCD'],
    'PLACA POWERBOARD': ['PLACA POWERBOARD', 'POWERBOARD', 'KEY'],
    'PLACA SECUNDÁRIA': ['PLACA SECUNDARIA', 'PLACA SUB', 'SUBPLACA', 'SUB-PLACA', 'SUB PLACA'],
    'SENSOR BIOMÉTRICO': ['SENSOR BIOMETRICO', 'BIOMETRIA'],
    'WI-FI': ['WIFI', 'WI-FI'],
    'MÓDULO LASER': ['MODULO', 'DIODO', 'LASER', 'MOTOR'],
    'ALTO-FALANTE': ['ALTO-FALANTE', 'ALTOFALANTE', 'ALTO FALANTE', 'PLACA'],
    'CÂMERA': ['CAMERA'],
    'TECLADO': ['TECLADO'],
    'GATILHO/BOTÕES LAT.': ['GATILHO', 'BOTOES', 'BOTAO'],
    'BATERIA': ['BATERIA'],
    'TRAVAS DA BATERIA/TAMPA': ['TRAVA', 'TRAVAS', 'TAMPA'],
    'CARREGAMENTO/COMUNICAÇÃO - (SYNC/CHARGER)': ['SYNC', 'PLACA'],
    'GATILHO': ['GATILHO'],
    'BASE DE COMUNICAÇÃO BLUETOOTH': ['BERCO', 'BASE', 'PLACA', 'CARCACA'],
    'CARREGAMENTO/COMUNICAÇÃO': ['PLACA'],
    'ROLETE DE BORRACHA': ['ROLETE'],
    'CABEÇA DE IMPRESSÃO': ['CABECA', 'TOGGLE'],
    'CORREIAS/ENGRENAGENS': ['CORREIA', 'ENGRENAGEM', 'ENGRENAGENS'],
    'SENSORES DE ETIQUETA': ['SENSOR'],
    'SENSOR DO RIBBON': ['SENSOR'],
    'ALIMENTADOR': [''],
    'TRACIONADOR': [''],
    'BOTÕES': ['BOTOES', 'BOTAO', 'PLACA'],
    'GUIA DE ETIQUETA': ['GUIA'],
    'TRAVAS': ['TRAVA', 'TRAVAS'],
    'SERIAL': ['PLACA'],
    'PARALELA': ['PLACA'],
    'ETHERNET': ['PLACA'],
    'USB': ['PLACA'],
    'BLUETOOTH': ['PLACA'],
    'CORTADOR': ['CUTTER', 'CORTADOR'],
    'TAMPA DA BATERIA': ['TAMPA'],
    'COMPARTIMENTO DO CARTÃO SD': ['PLACA', 'GAVETA'],
    'CONEXÃO NAS REDES GSM(CARTÃO SIM)': ['PLACA', 'GAVETA'],
};

function abrirModal(item) {
    const dynamicSectionsDiv = document.getElementById('dynamicSections');
    dynamicSectionsDiv.innerHTML = ''; // Limpa as seções anteriores

    // Adiciona o select de serviço
    dynamicSectionsDiv.innerHTML += `
        <section1 class="servico">
            <h2 class="title">Qual o serviço?<sup>*</sup></h2>
            <select name="response" id="response" class="custom-select sources" placeholder="Selecione uma opção">
            </select>
        </section1>
        <section1 id="pecaSection" class="hidden">
            <h2 class="title">Peça:<sup>*</sup></h2>
            <select name="peca" id="peca" class="custom-select" placeholder="Selecione"></select>
        </section1>
        <section1 id="nivelSection" class="hidden">
            <h2 class="title">Nível:<sup>*</sup></h2>
            <select name="nivel" id="nivel" class="custom-select sources" placeholder="Selecione">
                <option value="n1">1</option>
                <option value="n2">2</option>
                <option value="n3">3</option>
            </select>
        </section1>
        <section1 id="causaSection" class="hidden">
            <h2 class="title">Causa do defeito:<sup>*</sup></h2>
            <select name="causa" id="causa" class="custom-select" placeholder="Selecione">
                <option value="mau">Uso indevido</option>
                <option value="dgn">Desgaste de uso</option>
                <option value="df">Defeito</option>
            </select>
        </section1>
        <section1 id="obsCarcacaSection" class="hidden">
            <h2 class="title">Peça<sup>*</sup></h2>
            <div class="height">
                <input id="obsCarcaca" type="text" autocomplete="off" name="obsCarcacaDefeito" class="input" />
            </div>
        </section1>
        <section1 id="obsSection" class="hidden">
            <h2 class="title">Obs. do defeito:<sup>*</sup></h2>
            <div class="height">
                <input id="obs" type="text" autocomplete="off" name="obsDefeito" class="input" />
            </div>
        </section1>
        <section1 id="opcSection" class="hidden">
            <h2 class="title">Opcional:<sup>*</sup></h2>
            <select name="opc" id="opc" class="custom-select" placeholder="Selecione">
                <option value="s">Sim</option>
                <option value="n">Não</option>
            </select>
        </section1>
    `;

    // Carrega opções no select de serviço
    carregarOpcoes(item);

    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    // Fechar modal ao clicar fora do conteúdo
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}




// Fechar o modal
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});


document.getElementById('add').addEventListener('click', () => {
    abrirModal('observacoes')
});














// Função para carregar opções no select com base no localStorage
async function carregarOpcoes(repro) {
    const sectionsToShow = filtro[repro] || [];
    const modeloEquipamento = localStorage.getItem('modeloEquipamento');
    const select = $("#response");
    select.empty(); // Limpa o select

    // Adiciona opções compatíveis com o equipamento selecionado
    dados.forEach(item => {
        if (item.equipamentos.includes(repro)) {
            select.append(`<option value="${item.valor}">${item.nome}</option>`);
        }
    });

    const select1 = $("#peca");
    select1.empty(); // Limpa o select
    select1.append('<option value="" disabled selected></option>'); // Placeholder

    try {
        const resposta = await fetch('../csv/CadastroItens(CadastroItens).csv'); // Carrega o CSV
        // const resposta = await fetch('../csv/CadastroItens(CadastroItens).csv');
        const textoCSV = await resposta.text();


        // Converte o CSV em uma lista de objetos
        const linhas = textoCSV.trim().split('\n').slice(1); // Ignora o cabeçalho
        const dados = linhas.map(linha => {
            const [id, nome] = linha.split(',');
            return { id, nome };
        });



        // Filtra e adiciona as opções ao select
        if (repro === 'ACESSÓRIOS' || repro === 'CABO DE COMUNICAÇÃO' || repro === 'FONTE DE ALIMENTAÇÃO') {
            dados.forEach(item => {
                if (
                    sectionsToShow.some(section => item.nome.toLowerCase().includes(section.toLowerCase()))
                ) {
                    select1.append(`<option value="${item.id}">${item.nome}</option>`);
                }
            });
        } else {
            dados.forEach(item => {
                if (
                    item.nome.toLowerCase().includes(modeloEquipamento.toLowerCase()) &&
                    sectionsToShow.some(section => item.nome.toLowerCase().includes(section.toLowerCase()))
                ) {
                    select1.append(`<option value="${item.id}">${item.nome}</option>`);
                }
            });
        }

    } catch (erro) {
        console.error('Erro ao carregar o CSV:', erro);
    }

    inicializarSelectCustomizado(); // Atualiza o select customizado

}





let valorSelecionadoGlobal = ''; // Variável global para armazenar o valor selecionado
let pecaSelecionadoGlobal = '';
let nivelSelecionadoGlobal = '';
let causaDefeitoSelecionadoGlobal = '';
let obsDefeitoSelecionadoGlobal = '';
let opcSelecionadoGlobal = '';


function inicializarSelectCustomizado() {
    $(".custom-select").each(function () {
        const select = $(this);
        const selectId = select.attr("id");

        // Renderiza o campo de pesquisa apenas para os selects desejados
        const isSelectComPesquisa = ['peca'].includes(selectId);

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

    document.getElementById('modal').style.display = 'block';
}

// Função para atualizar variáveis globais com base no select selecionado
function atualizarVariavelGlobal(selectId, value) {
    switch (selectId) {
        case 'response':
            valorSelecionadoGlobal = value;

            document.querySelectorAll('section1').forEach(section => {
                // Não adicionar 'hidden' à seção que contém o select de serviço
                if (!section.querySelector('#response')) {
                    section.classList.add('hidden');
                }
            });

            // Mostra apenas as seções correspondentes à seleção
            const sectionsToShow = combinacoesMap[valorSelecionadoGlobal] || [];
            sectionsToShow.forEach(sectionId => {
                document.getElementById(sectionId).classList.remove('hidden');
            });
            break;
        case 'peca':
            pecaSelecionadoGlobal = value;
            break;
        case 'nivel':
            nivelSelecionadoGlobal = value;
            break;
        case 'causa':
            causaDefeitoSelecionadoGlobal = value;
            break;
        case 'opc':
            opcSelecionadoGlobal = value;
            break;
    }
}




document.getElementById('adicionar').addEventListener('click', () => {
    salvarObservacao();

});

// Função para salvar os dados do modal em um array no localStorage
function salvarObservacao() {
    // Obter valores dos inputs que estão visíveis
    const valorSelecionado = valorSelecionadoGlobal;
    const pecaSelecionado = pecaSelecionadoGlobal;
    const nivelSelecionado = nivelSelecionadoGlobal;
    const causaDefeitoSelecionado = causaDefeitoSelecionadoGlobal;
    const obsDefeito = document.getElementById('obs') ? document.getElementById('obs').value : '';
    const obsCarcacaDefeito = document.getElementById('obsCarcaca') ? document.getElementById('obsCarcaca').value : '';
    const opcSelecionado = opcSelecionadoGlobal;

    // Verificar se o 'response' foi selecionado
    if (!valorSelecionado) {
        exibirAlerta();
        return;
    }

    // Checar se os campos visíveis estão preenchidos
    const camposObrigatorios = {
        response: valorSelecionado,
        peca: pecaSelecionado,
        obsCarcaca: obsCarcacaDefeito,
        nivel: nivelSelecionado,
        causa: causaDefeitoSelecionado,
        obs: obsDefeito,
        opc: opcSelecionado
    };

    const sectionsToShow = combinacoesMap[valorSelecionado] || [];

    // Verificar se todos os campos visíveis estão preenchidos
    let todosPreenchidos = true;

    // Iterar sobre as seções visíveis e verificar os campos
    sectionsToShow.forEach(sectionId => {
        const section = document.getElementById(sectionId);

        if (section && !section.classList.contains('hidden')) { // Se a seção não estiver oculta
            // Mapeia a chave corretamente com base no ID da seção
            const chaveCampo = sectionId.replace('Section', ''); // Substitui 'Section' por chave correta
            const campo = camposObrigatorios[chaveCampo];  // Acessa a chave correta do campo

            // Verifica se o campo é vazio ou undefined
            if (campo === undefined || campo === '') {
                todosPreenchidos = false; // Se algum campo visível não estiver preenchido
            }
        }
    });

    if (!todosPreenchidos) {
        exibirAlerta(); // Chama a função de alerta se algum campo obrigatório não estiver preenchido
        return;
    }

    // Criar objeto com os valores preenchidos
    const observacao = {
        pecaReprovada: itemReprovado,
        valorSelecionadoGlobal: valorSelecionado,
        pecaSelecionadoGlobal: pecaSelecionado,
        obsCarcacaDefeitoSelecionadoGlobal: obsCarcacaDefeito.toUpperCase(),
        nivelSelecionadoGlobal: nivelSelecionado,
        causaDefeitoSelecionadoGlobal: causaDefeitoSelecionado,
        obsDefeitoSelecionadoGlobal: obsDefeito.toUpperCase(),
        opcSelecionadoGlobal: opcSelecionado
    };

    // Criar objeto com os valores preenchidos
    const pelicula = {
        pecaReprovada: itemReprovado,
        valorSelecionadoGlobal: 9,
        pecaSelecionadoGlobal: 'PROTHIDRO23',
        nivelSelecionadoGlobal: '',
        causaDefeitoSelecionadoGlobal: '',
        obsDefeitoSelecionadoGlobal: '',
        opcSelecionadoGlobal: ''
    };

    const observacoes = JSON.parse(localStorage.getItem('observacoes')) || [];

    if (itemReprovado === 'TOUCH') {
        observacoes.push(observacao); // Adicionar a nova observação
        abrirModalConfirmacao(
            "Deseja adicionar a película de hidrogel?",
            () => {
                observacoes.push(pelicula);
                localStorage.setItem('observacoes', JSON.stringify(observacoes));
                document.getElementById('modal').style.display = 'none';
                abrirModalConfirmacao(
                    "Deseja adicionar mais alguma peça?",
                    () => {
                        abrirModal(itemReprovado);
                    },
                    () => {
                    }
                );
            },
            () => {
                localStorage.setItem('observacoes', JSON.stringify(observacoes));
                document.getElementById('modal').style.display = 'none';
                abrirModalConfirmacao(
                    "Deseja adicionar mais alguma peça?",
                    () => {
                        abrirModal(itemReprovado);
                    },
                    () => {
                    }
                );
            }
        );
    } else {
        observacoes.push(observacao); // Adicionar a nova observação

        // Salvar o array atualizado no localStorage
        localStorage.setItem('observacoes', JSON.stringify(observacoes));

        // Fechar o modal após salvar
        document.getElementById('modal').style.display = 'none';
        abrirModalConfirmacao(
            "Deseja adicionar mais alguma peça?",
            () => {
                abrirModal(itemReprovado);
            },
            () => {
            }
        );
    }
}
