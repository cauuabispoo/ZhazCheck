$(document).ready(() => {
    const verficaEquipamento = localStorage.getItem('selectedOption');
    const verficaCheck = localStorage.getItem('check');

    if (!verficaEquipamento || !verficaCheck) {
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
        localStorage.removeItem('check');
        localStorage.removeItem('lacre');
        window.location.href = "garantia.html";
    }
});





// Função para buscar o tipo de equipamento do localStorage
function buscarTipoEquipamento() {
    return localStorage.getItem('selectedOption'); // Ajuste conforme o nome da chave salva
}

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
                <input type="radio" id="${nomeItem}-nao-possui" name="${nomeItem}" class="radio-b__input" value="X" />
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

    let itens;

    // Definindo os itens do checklist para cada tipo de equipamento
    switch (tipoEquipamento) {
        case 'coletor':
            itens = ['CARCAÇAS', 'LENTE', 'PARAFUSOS', 'MODELO/NÚMERO DE SÉRIE', 'ACESSÓRIOS', 'TOUCH', 'LCD', 'WIFI', 'MÓDULO LASER', 'ALTO-FALANTE', 'CÂMERA', 'TECLADO', 'GATILHO/BOTÕES LAT.', 'BATERIA', 'TRAVAS DA BATERIA/TAMPA', 'CARREGAMENTO/COMUNICAÇÃO - (SYNC/CHARGER)', 'SISTEMA OPERACIONAL'];
            break;
        case 'leitor':
            itens = ['Calibrar sensor', 'Testar conectividade', 'Atualizar firmware'];
            break;
        case 'impressora':
            itens = ['Substituir bateria', 'Verificar painel', 'Testar comunicação de rede'];
            break;
        case 'celular':
            itens = ['CARCAÇAS', 'TAMPA DA BATERIA', 'MODELO/NÚMERO DE SÉRIE', 'ACESSÓRIOS', 'TOUCH', 'LCD', 'CÂMERA(S) TRASEIRA', 'CÂMERA FRONTAL', 'WIFI/BLUETOOTH', 'ALTO-FALANTE AURICULAR', 'ALTO-FALANTE PRINCIPAL', 'MICROFONE', 'CONECTOR DE ENTRADA P2', 'BATERIA', 'CARREGAMENTO/COMUNICAÇÃO - (SYNC/CHARGER)', 'BOTÕES LATERAIS', 'CONEXÃO NAS REDES GSM(CARTÃO SIM)', 'COMPARTIMENTO DO CARTÃO SD', 'SENSOR BIOMÉTRICO','SISTEMA OPERACIONAL'];
            break;
        default:
            checklistContainer.innerHTML = `<p>Nenhum checklist disponível para este tipo de equipamento.</p>`;
            return;
    }

    // Gerar e adicionar os itens do checklist
    const checklistHTML = itens.map(item => criarChecklistItem(item)).join('');
    checklistContainer.innerHTML = checklistHTML;
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

    const serialValue = document.getElementById("serialInput").value.trim().toUpperCase(); // Armazenar em maiúsculas
    const isChecked = document.getElementById("ch1").checked;

    checklistItems.forEach(item => {
        const nome = item.getAttribute('data-nome');
        const radioSelecionado = item.querySelector('input[type="radio"]:checked');

        if (!radioSelecionado) {
            todosPreenchidos = false; // Se um item não estiver preenchido, marca como falso
        } else {
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
            window.location.href = "obsTecnicas.html";
        } else {
            // Verificar se os campos estão preenchidos
            if (!macValue || !serialValue) {
                exibirAlerta();
            } else {
                // Salvar os valores no localStorage
                localStorage.setItem("mac", macValue); // Salva em maiúsculas
                localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                localStorage.setItem("imei", "/");
                window.location.href = "obsTecnicas.html";
            }
        }
    } else if (tipoEquipamento === "leitor") {

        if (isChecked) {
            localStorage.setItem("mac", "/");
            localStorage.setItem("serial", "/");
            localStorage.setItem("imei", "/");
            window.location.href = "obsTecnicas.html";
        } else {
            if (!serialValue) {
                exibirAlerta();
            } else {
                // Salvar os valores no localStorage
                localStorage.setItem("mac", "/"); // Salva em maiúsculas
                localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                localStorage.setItem("imei", "/");
                window.location.href = "obsTecnicas.html";
            }
        }
    } else if (tipoEquipamento === "impressora") {
        const macValue = document.getElementById("macInput").value.trim().toUpperCase(); // Armazenar em maiúsculas

        if (isChecked) {
            localStorage.setItem("mac", "/");
            localStorage.setItem("serial", "/");
            localStorage.setItem("imei", "/");
            window.location.href = "obsTecnicas.html";
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
                window.location.href = "obsTecnicas.html";
            }
        }
    } else if (tipoEquipamento === "celular") {
        const macValue = document.getElementById("macInput").value.trim().toUpperCase(); // Armazenar em maiúsculas
        const imeiValue = document.getElementById("imeiInput").value.trim().toUpperCase(); // Armazenar em maiúsculas

        if (isChecked) {
            localStorage.setItem("mac", "/");
            localStorage.setItem("serial", "/");
            localStorage.setItem("imei", "/");
            window.location.href = "obsTecnicas.html";
        } else {
            // Verificar se os campos estão preenchidos
            if (!macValue || !serialValue || !imeiValue) {
                exibirAlerta();
            } else {
                // Salvar os valores no localStorage
                localStorage.setItem("mac", macValue); // Salva em maiúsculas
                localStorage.setItem("serial", serialValue); // Salva em maiúsculas
                localStorage.setItem("imei", imeiValue);
                window.location.href = "obsTecnicas.html";
            }
        }

    }
}

document.getElementById('submitButton').addEventListener('click', salvarChecklist);

function showAdditionalContent() {
    var selectedOption = localStorage.getItem("selectedOption");
    var resultDiv = document.getElementById("additionalContent");

    if (selectedOption) {
        // Insere o conteúdo dinamicamente baseado na seleção
        if (selectedOption === "coletor") {
            resultDiv.innerHTML = `
                <div class='height'>
                    <label for='Height'>MAC:<sup>*</sup></label>
                    <input id='macInput' type='text' autocomplete='off' name='mac' class='input' maxlength='17' />
                    <label for='SerialNumber'>S/N:<sup>*</sup></label>
                    <input id='serialInput' type='text' autocomplete='off' name='serial' class='input' />
                    <div class='content'>
                        <label class='checkBox'>
                            <input type='checkbox' id='ch1'>
                            <div class='transition'></div>
                        </label>
                    </div>
                    <label for='ch1'>Não possui</label>
                </div>`;
        } else if (selectedOption === "leitor") {
            resultDiv.innerHTML = `
                <div class='height'>
                    <label for='SerialNumber'>S/N:<sup>*</sup></label>
                    <input id='serialInput' type='text' autocomplete='off' name='serial' class='input' />
                    <div class='content'>
                        <label class='checkBox'>
                            <input type='checkbox' id='ch1'>
                            <div class='transition'></div>
                        </label>
                    </div>
                    <label for='ch1'>Não possui</label>
                </div>`;
        } else if (selectedOption === "impressora") {
            resultDiv.innerHTML = `
                <div class='height'>
                    <label for='Height'>MAC:</label>
                    <input id='macInput' type='text' autocomplete='off' name='mac' class='input' maxlength='17' />
                    <label for='SerialNumber'>S/N:<sup>*</sup></label>
                    <input id='serialInput' type='text' autocomplete='off' name='serial' class='input' />
                    <div class='content'>
                        <label class='checkBox'>
                            <input type='checkbox' id='ch1'>
                            <div class='transition'></div>
                        </label>
                    </div>
                    <label for='ch1'>Não possui</label>
                </div>`;
        } else if (selectedOption === "celular") {
            resultDiv.innerHTML = `
                <div class='height'>
                    <label for='Height'>MAC:<sup>*</sup></label>
                    <input id='macInput' type='text' autocomplete='off' name='mac' class='input' maxlength='17' />
                    <label for='SerialNumber'>S/N:<sup>*</sup></label>
                    <input id='serialInput' type='text' autocomplete='off' name='serial' class='input' />
                    <label for='Imei'>IMEI:<sup>*</sup></label>
                    <input id='imeiInput' type='text' autocomplete='off' name='imei' class='input' maxlength='15' />
                    <div class='content'>
                        <label class='checkBox'>
                            <input type='checkbox' id='ch1'>
                            <div class='transition'></div>
                        </label>
                    </div>
                    <label for='ch1'>Não possui</label>
                </div>`;
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

