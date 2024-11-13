$(document).ready(() => {
  const verficaEquipamento = localStorage.getItem('selectedOption');
  const verficaLacre = localStorage.getItem('lacre');
  const verificaCheck = localStorage.getItem("resultadoChecklist");

  if (!verficaEquipamento || !verficaLacre || !verificaCheck) {
    window.location.href = "../index.html";
    localStorage.clear();
  }
});
















// Função para ler o arquivo TXT com palavras-chave
async function carregarPalavrasChave() {
  try {
    const response = await fetch("../txt/palavrasChave.txt");
    if (!response.ok) throw new Error('Erro ao carregar palavras-chave');
    const texto = await response.text();
    return texto.split('\n').map(p => p.trim()).filter(Boolean);
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar palavras-chave. Verifique os arquivos.');
    return [];
  }
}

// Função para ler o CSV e armazenar as peças em um mapa
async function carregarPecas() {
  const response = await fetch("../csv/CadastroItens(CadastroItens).csv");
  const csv = await response.text();
  const linhas = csv.trim().split('\n').slice(1); // Ignora o cabeçalho

  // Cria um objeto onde cada ID é uma chave e o nome da peça é o valor
  const mapaPecas = {};
  for (const linha of linhas) {
    const [id, nome] = linha.split(',').map(campo => campo.trim());
    mapaPecas[id.toUpperCase()] = nome; // Armazena no objeto com ID em maiúsculas
  }

  return mapaPecas;
}


// Função para ler o CSV e armazenar as peças em um mapa
async function carregarEquipamentos() {
  const response = await fetch("../csv/equipamentos.csv");
  const csv = await response.text();
  const linhas = csv.trim().split('\n').slice(1); // Ignora o cabeçalho

  // Cria um objeto onde cada ID é uma chave e o nome da peça é o valor
  const mapaPecas = {};
  for (const linha of linhas) {
    const [id, modelo, equipamento, servico] = linha.split(',').map(campo => campo.trim());
    mapaPecas[id] = servico; // Armazena no objeto com ID em maiúsculas
  }

  return mapaPecas;
}


// Função para encontrar a palavra-chave dentro de uma peça
function filtrarPalavraChave(nomePeca, palavrasChave) {
  for (const palavra of palavrasChave) {
    if (nomePeca.toLowerCase().includes(palavra.toLowerCase())) {
      return palavra.toUpperCase(); // Retorna a palavra-chave encontrada em maiúsculas
    }
  }
  return "PALAVRA NÃO ENCONTRADA"; // Caso nenhuma palavra seja encontrada
}




// Função para gerar o laudo completo
async function gerarLaudo() {
  const pecas = await carregarPecas();
  const equipamentos = await carregarEquipamentos();
  const laudoTextarea = document.getElementById("laudo");
  const palavrasChave = await carregarPalavrasChave(); // Carregar palavras-chave do arquivo TXT
  const container1 = document.querySelector(".container2"); // Seleciona o contêiner

  // Dados do localStorage
  const modeloEquipamento = localStorage.getItem('modeloEquipamento');
  const lacre = localStorage.getItem("lacre");
  const tipoLacre = localStorage.getItem("tipoLacre");
  const osAnterior = localStorage.getItem("osAnterior");
  const dataManutencao = localStorage.getItem("dataManutencao");
  const obsUltimoServico = localStorage.getItem("obsUltimoServico");
  const mac = localStorage.getItem("mac");
  const serial = localStorage.getItem("serial");
  const imei = localStorage.getItem("imei");
  const observacoes = JSON.parse(localStorage.getItem("observacoes")) || [];


  const textarea = document.getElementById('checklistTextArea');
  const checklistSalvo = localStorage.getItem('resultadoChecklist');
  let checklistLaudo = '';


  if (checklistSalvo) {
    container1.classList.remove('hidden'); // Remove hidden do contêiner
    textarea.classList.remove('hidden'); // Remove hidden do textarea
    const resultadoArray = JSON.parse(checklistSalvo);
    const textoFormatado = resultadoArray
      .map(item => `  - ${item.item} -> ${item.status}`) // Formatação desejada
      .join('\n'); // Quebra de linha entre itens

    textarea.value = textoFormatado.toUpperCase();
    checklistLaudo = textoFormatado;
  } else {
    textarea.value = '';
  }

  const dataGarantia = tipoLacre === "manutencao" ? 90 : tipoLacre === "venda" ? 365 : 0; // Agora é número
  const textomanu = tipoLacre === "manutencao" ? "MANUTENÇÃO" : tipoLacre === "venda" ? "REVISÃO" : "";
  const textoOS = tipoLacre === "manutencao" ? "OS ANTERIOR" : tipoLacre === "venda" ? "PV" : "";

  // Função para verificar se está em garantia
  function estaEmGarantia(dataManutencao) {
    const partes = dataManutencao.split('-'); // Divide a string
    const ano = parseInt(partes[0], 10); // Ano
    const mes = parseInt(partes[1], 10) - 1; // Mês (0-11)
    const dia = parseInt(partes[2], 10); // Dia

    const dataManut = new Date(ano, mes, dia); // Criar o objeto Date

    // Verifica se a data é válida
    if (isNaN(dataManut.getTime())) throw new Error("Data de manutenção inválida!");

    const hoje = new Date(); // Data atual
    const diferencaDias = Math.floor((hoje - dataManut) / (1000 * 60 * 60 * 24)); // Diferença em dias

    return diferencaDias <= dataGarantia; // Verifica se está em garantia
  }


  // Função para calcular a data de término da garantia
  // Função para calcular a data de término da garantia
  function calcularDataFimGarantia(dataManutencao) {
    const partes = dataManutencao.split('-'); // Divide a string
    const ano = parseInt(partes[0], 10); // Ano
    const mes = parseInt(partes[1], 10) - 1; // Mês (0-11)
    const dia = parseInt(partes[2], 10); // Dia

    const dataManut = new Date(ano, mes, dia); // Criar o objeto Date

    dataManut.setDate(dataManut.getDate() + dataGarantia); // Adiciona os dias de garantia corretamente

    // Formatar a data no padrão brasileiro (dd/mm/aaaa)
    const diaFormatado = String(dataManut.getDate()).padStart(2, '0'); // Dia
    const mesFormatado = String(dataManut.getMonth() + 1).padStart(2, '0'); // Mês
    const anoFormatado = dataManut.getFullYear(); // Ano

    return `${diaFormatado}/${mesFormatado}/${anoFormatado}`; // Retorna a data formatada
  }


  // Função para formatar a data no padrão brasileiro (dd/mm/aaaa)
  function formatarData(data) {
    const partes = data.split('-'); // Divide a string
    const ano = parseInt(partes[0], 10); // Ano
    const mes = parseInt(partes[1], 10); // Mês (1-12)
    const dia = parseInt(partes[2], 10); // Dia

    // Formata dia e mês para ter sempre dois dígitos
    const diaFormatado = String(dia).padStart(2, '0');
    const mesFormatado = String(mes).padStart(2, '0');

    return `${diaFormatado}/${mesFormatado}/${ano}`; // Retorna a data formatada
  }


  // Informações básicas
  let infoBasica = "";
  if (lacre === "sim") {
    const garantiaStatus = estaEmGarantia(dataManutencao) ? "EM GARANTIA" : "FORA DE GARANTIA";
    const dataFimGarantia = calcularDataFimGarantia(dataManutencao); // Data do fim da garantia

    // Construção da string com dados formatados
    infoBasica =
      `${textoOS}: ${osAnterior} - ` +
      `DATA DA ${textomanu}: ${formatarData(dataManutencao)} - ` +
      `OBS: ${obsUltimoServico} - ` +
      `${garantiaStatus} (GARANTIA ATÉ: ${dataFimGarantia} - ${dataGarantia} DIAS)\n` +
      `\nOS ATUAL:\n`;
  }



  // Informações do MAC, Serial e IMEI (sem hifens desnecessários)
  let identificadores = [mac !== "/" ? `MAC: ${mac}` : "",
  serial !== "/" ? `SERIAL: ${serial}` : "",
  imei !== "/" ? `IMEI: ${imei}` : ""]
    .filter(Boolean) // Remove entradas vazias
    .join(" - "); // Junta com hifens apenas se houver mais de um valor

  if (identificadores) {
    identificadores = `- ${identificadores}\n`; // Adiciona o identificador com quebra de linha
  }

  // Variáveis para armazenar diagnósticos e tipos de substituição
  let diagnostico = "";
  let observacao = "";
  let substituicaoNecessaria = "";
  let substituicaoOpcional = "";
  let instalacaoNecessaria = "";
  let instalacaoOpcional = "";
  let acessorioOpcional = "";
  let recuperacaoNecessaria = "";
  let recuperacaoOpcional = "";
  let sistema = "";
  let peca0 = [];
  let niveisRecuperacao = [];

  const servico = equipamentos[modeloEquipamento.toUpperCase()];
  peca0.push(servico);
  // Processa as observações e distribui conforme o tipo
  for (const obs of observacoes) {
    const causa = {
      mau: "USO INDEVIDO",
      dgn: "DESGASTE DE USO",
      df: "DEFEITO"
    }[obs.causaDefeitoSelecionadoGlobal] || "CAUSA DESCONHECIDA";

    const peca = filtrarPalavraChave(pecas[obs.pecaSelecionadoGlobal], palavrasChave) || "PEÇA DESCONHECIDA";

    var verificaCarcaca;
    var nivel;
    switch (obs.valorSelecionadoGlobal) {
      case 1: // Substituição de componente
        peca0.push(obs.pecaSelecionadoGlobal);
        diagnostico += `  - ${peca} (OBS:${obs.obsDefeitoSelecionadoGlobal}) -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          substituicaoNecessaria += `  - ${peca}\n`;
        } else {
          substituicaoOpcional += `  - ${peca} -> (A CRITÉRIO DO CLIENTE)\n`;
        }
        break;

      case 2: // Recuperação de placa
        nivel = obs.nivelSelecionadoGlobal === "n1" ? "N1 (SV0036)" : obs.nivelSelecionadoGlobal === "n2" ? "N2 (SV0074)" : "N3 (SV0075)";
        diagnostico += `  - ${peca} (OBS:${obs.obsDefeitoSelecionadoGlobal}) -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          recuperacaoNecessaria += `  - ${peca} -> ${nivel}\n`;
          if (nivel === 'N1 (SV0036)') {
            niveisRecuperacao.push(1); // N1 é representado pelo valor 1
          } else if (nivel === 'N2 (SV0074)') {
            niveisRecuperacao.push(2); // N2 é representado pelo valor 2
          } else if (nivel === 'N3 (SV0075)') {
            niveisRecuperacao.push(3); // N3 é representado pelo valor 3
          };
        } else {
          recuperacaoOpcional += `  - ${peca} -> ${nivel} -> (A CRITÉRIO DO CLIENTE)\n`;
          if (nivel === 'N1 (SV0036)') {
            niveisRecuperacao.push(1); // N1 é representado pelo valor 1
          } else if (nivel === 'N2 (SV0074)') {
            niveisRecuperacao.push(2); // N2 é representado pelo valor 2
          } else if (nivel === 'N3 (SV0075)') {
            niveisRecuperacao.push(3); // N3 é representado pelo valor 3
          }
        }
        break;

      case 3: // Recuperação de carcaça
        const peca1 = obs.obsCarcacaDefeitoSelecionadoGlobal;
        diagnostico += `  - ${peca1} (OBS:${obs.obsDefeitoSelecionadoGlobal}) -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          recuperacaoNecessaria += `  - ${peca1}\n`;
          verificaCarcaca = '1';
        } else {
          recuperacaoOpcional += `  - ${peca1} -> (A CRITÉRIO DO CLIENTE)\n`;
          verificaCarcaca = '1';
        }
        break;

      case 4: // Recuperação de bateria
        diagnostico += `  - CARCAÇA DA BATERIA DANIFICADA (OBS:${obs.obsDefeitoSelecionadoGlobal}) -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A RECUPERAÇÃO DA BATERIA -> (SV0071)\n\n`;
          peca0.push('SV0071');
        } else {
          sistema += `RECUPERAÇÃO OPCIONAL DA BATERIA -> (SV0071) -> (A CRITÉRIO DO CLIENTE)\n\n`;
          peca0.push('SV0071');
        }
        break;

      case 5: // Atualização do sistema Android
        diagnostico += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A ATUALIZAÇÃO DO SISTEMA ANDROID -> (SV0042)\n\n`;
          peca0.push('SV0042');
        } else {
          sistema += `ATUALIZAÇÃO OPCIONAL DO SISTEMA ANDROID -> (SV0042) -> (A CRITÉRIO DO CLIENTE)\n\n`;
          peca0.push('SV0042');
        }
        break;

      case 6: // Restauração da memória
        diagnostico += `  - SISTEMA OPERACIONAL (OBS:${obs.obsDefeitoSelecionadoGlobal}) -> DEFEITO\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A RESTAURAÇÃO DA MEMÓRIA FLASH ROM -> (SV0040)\n\n`;
          peca0.push('SV0040');
        } else {
          sistema += `RESTAURAÇÃO OPCIONAL DA MEMÓRIA FLASH ROM -> (SV0040) -> (A CRITÉRIO DO CLIENTE)\n\n`;
          peca0.push('SV0040');
        }
        break;

      case 7: // Upgrade de Firmware
        diagnostico += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO O UPGRADE DA FIRMWARE -> (SV0046)\n\n`;
          peca0.push('SV0046');
        } else {
          sistema += `UPGRADE OPCIONAL DA FIRMWARE -> (SV0046) -> (A CRITÉRIO DO CLIENTE)\n\n`;
          peca0.push('SV0046');
        }
        break;

      case 8: // Downgrade de Firmware
        diagnostico += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO O DOWNGRADE DA FIRMWARE -> (SV0047)\n\n`;
          peca0.push('SV0047');
        } else {
          sistema += `DOWNGRADE OPCIONAL DA FIRMWARE -> (SV0047) -> (A CRITÉRIO DO CLIENTE)\n\n`;
          peca0.push('SV0047');
        }
        break;

      case 9: // Acessórios
        peca0.push(obs.pecaSelecionadoGlobal);
        if (peca === "PELICULA PROTETORA HIDROGEL") {
          acessorioOpcional += `  - PELÍCULA DE HIDROGEL -> (PARA AUMENTAR A VIDA ÚTIL E PROTEÇÃO CONTRA PANCADAS NA TELA DE TOQUE)\n`;
          instalacaoOpcional += `  - PELÍCULA DE HIDROGEL -> (PARA AUMENTAR A VIDA ÚTIL E PROTEÇÃO CONTRA PANCADAS NA TELA DE TOQUE)\n`;
        } else {
          acessorioOpcional += `  - ${peca} - ${obs.obsDefeitoSelecionadoGlobal} -> (A CRITÉRIO DO CLIENTE)\n`;
          instalacaoOpcional += `  - ${peca} - ${obs.obsDefeitoSelecionadoGlobal} -> (A CRITÉRIO DO CLIENTE)\n`;
        }
        break;

      case 10: // Instalação de componente
        peca0.push(obs.pecaSelecionadoGlobal);
        diagnostico += `  - ${peca} (OBS:${obs.obsDefeitoSelecionadoGlobal}) -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          instalacaoNecessaria += `  - ${peca}\n`;
        } else {
          instalacaoOpcional += `  - ${peca} -> (A CRITÉRIO DO CLIENTE)\n`;
        }
        break;

      case 11: // Regulagem do módulo laser
        diagnostico += `  - MÓDULO LASER DESREGULADO\n`;
        sistema += `NECESSÁRIO A REGULAGEM DO MÓDULO LASER -> (SV0053)\n\n`;
        peca0.push('SV0053');
        break;

      case 12: // Configuração do leitor
        diagnostico += `  - LEITOR DESCONFIGURADO (OBS:${obs.obsDefeitoSelecionadoGlobal})\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A CONFIGURAÇÃO DO LEITOR -> (SV0052)\n\n`;
          peca0.push('SV0052');
        } else {
          sistema += `CONFIGURAÇÃO OPCIONAL DO LEITOR -> (SV0052) -> (A CRITÉRIO DO CLIENTE)\n\n`;
          peca0.push('SV0052');
        }
        break;

      case 13: // Recuperação do cabo de comunicação
        diagnostico += `  - CABO DE COMUNICAÇÃO DANIFICADO (OBS:${obs.obsDefeitoSelecionadoGlobal})\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A RECUPERAÇÃO DO CABO -> (SV0037)\n\n`;
          peca0.push('SV0037');
        } else {
          sistema += `RECUPERAÇÃO OPCIONAL DO CABO -> (SV0037) -> (A CRITÉRIO DO CLIENTE)\n\n`;
          peca0.push('SV0037');
        }
        break;

      case 14: // Intalação da configuração do cliente
        diagnostico += `  - INSTALAÇÃO DA CONFIGURAÇÃO DO CLIENTE (OBS:${obs.obsDefeitoSelecionadoGlobal})\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A INSTALAÇÃO DA CONFIGURAÇÃO DO CLIENTE -> (SV0044)\n\n`;
          peca0.push('SV0044');
        } else {
          sistema += `INSTALAÇÃO OPCIONAL DA CONFIGURAÇÃO DO CLIENTE -> (SV0044)\n\n`;
          peca0.push('SV0044');
        }
        break;

      case 15: // Observação
        observacao += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        break;

      default:
        break;
    }
  }

  // Monta o laudo com os blocos dinâmicos
  let laudo = `${infoBasica}${identificadores}CONFORME O DIAGNÓSTICO TÉCNICO, FOI OBSERVADO:\n`;

  if (diagnostico) {
    if (observacao) {
      laudo += `${diagnostico}\n\n  OBSERVAÇÕES:\n${observacao}\n`;
    } else {
      laudo += `${diagnostico}\n`;
    }


    laudo += "SOLUÇÃO:\n";
    if (sistema) {
      laudo += `${sistema}`;
    }

    if (substituicaoNecessaria) {
      laudo += `NECESSÁRIO A SUBSTITUIÇÃO DO(S) SEGUINTE(S) ITEM(S):\n${substituicaoNecessaria}\n`;
    }

    if (substituicaoOpcional) {
      laudo += `SUBSTITUIÇÃO OPCIONAL DO(S) SEGUINTE(S) ITEM(S):\n${substituicaoOpcional}\n`;
    }

    if (recuperacaoNecessaria) {
      laudo += `NECESSÁRIO A RECUPERAÇÃO DO(S) SEGUINTE(S) ITEM(S):\n${recuperacaoNecessaria}\n`;
      if (verificaCarcaca) {
        peca0.push('SV0038');
      }
      // Encontra o maior nível no array
      const maiorNivel = Math.max(...niveisRecuperacao);

      // Adiciona a peça correspondente ao maior nível
      if (maiorNivel === 1) {
        peca0.push('SV0036');
      } else if (maiorNivel === 2) {
        peca0.push('SV0074');
      } else if (maiorNivel === 3) {
        peca0.push('SV0075');
      }
    }

    if (recuperacaoOpcional) {
      laudo += `RECUPERAÇÃO OPCIONAL DO(S) SEGUINTE(S) ITEM(S):\n${recuperacaoOpcional}\n`;
      if (verificaCarcaca) {
        peca0.push('SV0038');
      }
      // Encontra o maior nível no array
      const maiorNivel = Math.max(...niveisRecuperacao);

      // Adiciona a peça correspondente ao maior nível
      if (maiorNivel === 1) {
        peca0.push('SV0036');
      } else if (maiorNivel === 2) {
        peca0.push('SV0074');
      } else if (maiorNivel === 3) {
        peca0.push('SV0075');
      }
    }

    if (instalacaoNecessaria) {
      laudo += `NECESSÁRIO A INSTALAÇÃO DO(S) SEGUINTE(S) ITEM(S):\n${instalacaoNecessaria}\n`;
    }

    if (instalacaoOpcional) {
      laudo += `INSTALAÇÃO OPCIONAL DO(S) SEGUINTE(S) ITEM(S):\n${instalacaoOpcional}\n`;
    }

  } else if (!diagnostico && acessorioOpcional || observacao) {
    laudo += `  - FORAM REALIZADOS TODOS OS TESTES E O EQUIPAMENTO NÃO APRESENTOU NENHUM DEFEITO\n`;

    if (observacao) {
      laudo += `${checklistLaudo}\n\n  OBSERVAÇÕES:\n${observacao}\n`;
    } else {
      laudo += `${checklistLaudo}\n`;
    }
    
    laudo += "\nSOLUÇÃO:\n";
    if (acessorioOpcional) {
      laudo += `INSTALAÇÃO OPCIONAL DO(S) SEGUINTE(S) ITEM(S):\n${acessorioOpcional}\n`;
    }
  } else {
    laudo += `  - FORAM REALIZADOS TODOS OS TESTES E O EQUIPAMENTO NÃO APRESENTOU NENHUM DEFEITO\n`;
    if (checklistLaudo) {
      laudo += `${checklistLaudo}\n`;
    }
    laudo += "\nSOLUÇÃO:\n\n";
  }

  laudo += "REVISÃO E LIMPEZA - (MÃO DE OBRA)";

  // Exibe o laudo na caixa de texto
  laudoTextarea.value = laudo.trim().toUpperCase(); // Garante que tudo esteja em maiúsculas

  const container = document.getElementById('pecas-container');

  // Adiciona os checkboxes para cada peça
  peca0.forEach(peca => {
    const checkboxHtml = `
        <label class="container1">
        <span>${peca}</span>
                <input type="checkbox" onclick="copiarPeca('${peca}')" />
                <svg viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="clipboard">
                    <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path>
                </svg>
                <svg viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="clipboard-check">
                    <path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM305 273L177 401c-9.4 9.4-24.6 9.4-33.9 0L79 337c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L271 239c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path>
                </svg>
            </label>
        `;
    container.insertAdjacentHTML('beforeend', checkboxHtml);
  });
}

// Chama a função ao carregar a página
window.onload = gerarLaudo;


// Função genérica para copiar o conteúdo do textarea correspondente
function copyToClipboard(textarea) {
  const text = textarea.value; // Obtém o conteúdo do textarea
  navigator.clipboard.writeText(text)
    .catch(err => console.error('Falha ao copiar: ', err));
}

// Função para configurar o evento de checkbox
function configurarCheckbox(checkbox, textarea) {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      copyToClipboard(textarea); // Copia o conteúdo do textarea

      // Após 3 segundos, desmarca o checkbox
      setTimeout(() => {
        checkbox.checked = false;
      }, 1000);
    }
  });
}

// Seleciona os elementos de cada textarea e checkbox
const checkboxLaudo = document.querySelector('.card.blue .container input');
const textareaLaudo = document.getElementById('laudo');

const checkboxChecklist = document.querySelector('.card.red .container2 input');
const textareaChecklist = document.getElementById('checklistTextArea');

// Configura os eventos de cada checkbox
configurarCheckbox(checkboxLaudo, textareaLaudo);
configurarCheckbox(checkboxChecklist, textareaChecklist);


function copiarPeca(peca) {
  navigator.clipboard.writeText(peca).catch(err => {
    console.error('Erro ao copiar: ', err);
  });

  // Desmarcar o checkbox após 3 segundos
  const checkboxes = document.querySelectorAll('.container1 input');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      setTimeout(() => {
        checkbox.checked = false; // Desmarca o checkbox
      }, 1000);
    }
  });
}


document.getElementById("proceed").addEventListener("click", function () {
  localStorage.clear()
  window.location.href = "../index.html";
});
