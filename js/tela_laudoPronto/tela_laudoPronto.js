$(document).ready(() => {
  const verficaEquipamento = localStorage.getItem('selectedOption');
  const verficaLacre = localStorage.getItem('lacre');
  const verificaCheck = localStorage.getItem("resultadoChecklist");
  const verificatipoServico = localStorage.getItem('tipoServico');


  if (!verficaEquipamento || !verificaCheck || !verificatipoServico) {
    window.location.href = "../index.html";
    localStorage.clear();
  }
});

















// Lista de palavras que devem ser ignoradas pelo corretor
const excecoes = ["POWERBOARD", "SYNC", "WI-FI", "WIFI", "RIBBON", "SUBSTITUIÇÃO", "TOGGLE", "SCAN", "GMS", "KIOSKI"];

// Função para corrigir texto com exceções
async function corrigirTextoComExcecoes(texto) {
  const apiUrl = "https://api.languagetool.org/v2/check"; // Endpoint da API
  const linguagem = "pt-br"; // Idioma: português

  // Função para verificar se uma palavra é uma exceção
  function palavraEhExcecao(palavra) {
    // Verifica se o texto e a palavra são válidos
    if (!palavra || typeof palavra !== "string") return false;

    // Retorna true se a palavra estiver na lista de exceções
    return excecoes.some(excecao => palavra.includes(excecao));
  }

  // Se o texto for nulo ou não for uma string, retorna o texto original
  if (!texto || typeof texto !== "string") {
    return texto; // Retorna o texto original
  }

  // Ignorar correção se o texto contiver apenas palavras que são exceções
  if (palavraEhExcecao(texto)) {
    return texto; // Retorna o texto original
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `text=${encodeURIComponent(texto)}&language=${linguagem}`,
    });

    const data = await response.json();
    let textoCorrigido = texto;

    if (data.matches) {
      data.matches.forEach(match => {
        const erro = match.context.text.slice(match.offset, match.offset + match.length);
        const correcao = match.replacements[0]?.value; // Usa a primeira sugestão de correção

        // Não corrige se o erro está na lista de exceções
        if (palavraEhExcecao(erro)) {
          return; // Ignora a correção para essa palavra
        }

        // Substitui o erro pela correção
        if (correcao) {
          const regex = new RegExp(erro, "g");
          textoCorrigido = textoCorrigido.replace(regex, correcao);
        }
      });
    }

    return textoCorrigido;
  } catch (error) {
    console.error("Erro ao corrigir o texto:", error);
    return texto; // Retorna o texto original em caso de erro
  }
}



// Função para gerar o laudo completo
async function gerarLaudo() {
  const laudoTextarea = document.getElementById("laudo");
  const container1 = document.querySelector(".container2"); // Seleciona o contêiner

  // Dados do localStorage
  const modeloEquipamento = localStorage.getItem('modeloEquipamento');
  const lacre = localStorage.getItem("lacre");
  const tipoLacre = localStorage.getItem("tipoLacre");
  const osAnterior = localStorage.getItem("osAnterior");
  const dataManutencao = localStorage.getItem("dataManutencao");
  const obsUltimoServico = localStorage.getItem("obsUltimoServico");
  const obsUltimoServicoCorrigido = await corrigirTextoComExcecoes(obsUltimoServico);
  const mac = localStorage.getItem("mac");
  const serial = localStorage.getItem("serial");
  const imei = localStorage.getItem("imei");
  const observacoes = JSON.parse(localStorage.getItem("observacoes")) || [];


  const textarea = document.getElementById('checklistTextArea');
  const checklistSalvo = localStorage.getItem('resultadoChecklist');
  let checklistLaudo = "";



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
      `OBS: ${obsUltimoServicoCorrigido} - ` +
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

  if (checklistSalvo) {
    container1.classList.remove('hidden'); // Remove hidden do contêiner
    textarea.classList.remove('hidden'); // Remove hidden do textarea
    const resultadoArray = JSON.parse(checklistSalvo);
    const textoFormatado = resultadoArray
      .map(item => `  - ${item.item} -> ${item.status}`) // Formatação desejada
      .join('\n'); // Quebra de linha entre itens

    if(identificadores){
      textarea.value += `  ${identificadores}`;
    }
    textarea.value += textoFormatado.toUpperCase();
    checklistLaudo += textoFormatado;
  } else {
    textarea.value = '';
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

  // Pré-busca todas as correções de texto em paralelo (em vez de uma chamada
  // sequencial por observação), reduzindo bastante o tempo total de geração
  // do laudo quando há várias peças/observações.
  const correcoes = await Promise.all(
    observacoes.map(async (obs) => {
      const peca = obs.pecaSelecionadoGlobal || "";
      const [pecaCorrigida, obsDefeitoCorrigido, obsCarcacaDefeitoCorrigido] = await Promise.all([
        corrigirTextoComExcecoes(peca),
        corrigirTextoComExcecoes(obs.obsDefeitoSelecionadoGlobal),
        corrigirTextoComExcecoes(obs.obsCarcacaDefeitoSelecionadoGlobal),
      ]);
      return { peca, pecaCorrigida, obsDefeitoCorrigido, obsCarcacaDefeitoCorrigido };
    })
  );

  // Processa as observações e distribui conforme o tipo
  for (let i = 0; i < observacoes.length; i++) {
    const obs = observacoes[i];
    const { peca, pecaCorrigida, obsDefeitoCorrigido, obsCarcacaDefeitoCorrigido } = correcoes[i];
    const causa = {
      mau: "USO INDEVIDO",
      dgn: "DESGASTE DE USO",
      df: "DEFEITO"
    }[obs.causaDefeitoSelecionadoGlobal] || "CAUSA DESCONHECIDA";
    var nivel;

    switch (obs.valorSelecionadoGlobal) {
      case 1: // Substituição de componente
        diagnostico += `  - ${pecaCorrigida} (OBS: ${obsDefeitoCorrigido}) -> ${causa}\n`;
        if (peca === "MÓDULO LASER") {
          if (obs.opcSelecionadoGlobal === "n") {
            recuperacaoNecessaria += `  - ${pecaCorrigida} -> (SV0064) -> (PARA SUBSTITUIÇÃO DO COMPONENTE É NECESSÁRIO A RECUPERAÇÃO)\n`;
          } else {
            recuperacaoOpcional += `  - ${pecaCorrigida} -> (SV0064) -> (PARA SUBSTITUIÇÃO DO COMPONENTE É NECESSÁRIO A RECUPERAÇÃO)\n`;
          }
        } else {
          if (obs.opcSelecionadoGlobal === "n") {
            substituicaoNecessaria += `  - ${pecaCorrigida}\n`;
          } else {
            substituicaoOpcional += `  - ${pecaCorrigida} -> (A CRITÉRIO DO CLIENTE)\n`;
          }
        }
        break;

      case 2: // Recuperação de placa
        nivel = obs.nivelSelecionadoGlobal === "n1" ? "N1 (SV0036)" : obs.nivelSelecionadoGlobal === "n2" ? "N2 (SV0074)" : "N3 (SV0075)";
        diagnostico += `  - ${pecaCorrigida} (OBS: ${obsDefeitoCorrigido}) -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          recuperacaoNecessaria += `  - ${pecaCorrigida} -> ${nivel}\n`;
        } else {
          recuperacaoOpcional += `  - ${pecaCorrigida} -> ${nivel} -> (A CRITÉRIO DO CLIENTE)\n`;
        }
        break;

      case 3: // Recuperação de carcaça
        const peca1 = obsCarcacaDefeitoCorrigido;
        diagnostico += `  - ${peca1} (OBS: ${obsDefeitoCorrigido}) -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          recuperacaoNecessaria += `  - ${peca1}\n`;
        } else {
          recuperacaoOpcional += `  - ${peca1} -> (A CRITÉRIO DO CLIENTE)\n`;
        }
        break;

      case 4: // Recuperação de bateria
        diagnostico += `  - CARCAÇA DA BATERIA DANIFICADA (OBS: ${obsDefeitoCorrigido}) -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A RECUPERAÇÃO DA BATERIA -> (SV0071)\n\n`;
        } else {
          sistema += `RECUPERAÇÃO OPCIONAL DA BATERIA -> (SV0071) -> (A CRITÉRIO DO CLIENTE)\n\n`;
        }
        break;

      case 5: // Atualização do sistema Android
        diagnostico += `  - ${obsDefeitoCorrigido}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A ATUALIZAÇÃO DO SISTEMA ANDROID -> (SV0042)\n\n`;
        } else {
          sistema += `ATUALIZAÇÃO OPCIONAL DO SISTEMA ANDROID -> (SV0042) -> (A CRITÉRIO DO CLIENTE)\n\n`;
        }
        break;

      case 6: // Restauração da memória
        diagnostico += `  - SISTEMA OPERACIONAL (OBS: ${obsDefeitoCorrigido}) -> DEFEITO\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A RESTAURAÇÃO DA MEMÓRIA FLASH ROM -> (SV0040)\n\n`;
        } else {
          sistema += `RESTAURAÇÃO OPCIONAL DA MEMÓRIA FLASH ROM -> (SV0040) -> (A CRITÉRIO DO CLIENTE)\n\n`;
        }
        break;

      case 7: // Upgrade de Firmware
        diagnostico += `  - ${obsDefeitoCorrigido}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO O UPGRADE DA FIRMWARE -> (SV0046)\n\n`;
        } else {
          sistema += `UPGRADE OPCIONAL DA FIRMWARE -> (SV0046) -> (A CRITÉRIO DO CLIENTE)\n\n`;
        }
        break;

      case 8: // Downgrade de Firmware
        diagnostico += `  - ${obsDefeitoCorrigido}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO O DOWNGRADE DA FIRMWARE -> (SV0047)\n\n`;
        } else {
          sistema += `DOWNGRADE OPCIONAL DA FIRMWARE -> (SV0047) -> (A CRITÉRIO DO CLIENTE)\n\n`;
        }
        break;

      case 9: // Acessórios
        if (peca === "PROTHIDRO23") {
          acessorioOpcional += `  - PELÍCULA DE HIDROGEL -> (PARA AUMENTAR A VIDA ÚTIL E PROTEÇÃO CONTRA PANCADAS NA TELA DE TOQUE)\n`;
          instalacaoOpcional += `  - PELÍCULA DE HIDROGEL -> (PARA AUMENTAR A VIDA ÚTIL E PROTEÇÃO CONTRA PANCADAS NA TELA DE TOQUE)\n`;
        } else {
          acessorioOpcional += `  - ${pecaCorrigida} - ${obsDefeitoCorrigido} -> (A CRITÉRIO DO CLIENTE)\n`;
          instalacaoOpcional += `  - ${pecaCorrigida} - ${obsDefeitoCorrigido} -> (A CRITÉRIO DO CLIENTE)\n`;
        }
        break;

      case 10: // Instalação de componente
        diagnostico += `  - ${pecaCorrigida} (OBS: ${obsDefeitoCorrigido}) -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          instalacaoNecessaria += `  - ${pecaCorrigida}\n`;
        } else {
          instalacaoOpcional += `  - ${pecaCorrigida} -> (A CRITÉRIO DO CLIENTE)\n`;
        }
        break;

      case 11: // Regulagem do módulo laser
        diagnostico += `  - MÓDULO LASER DESREGULADO\n`;
        sistema += `NECESSÁRIO A REGULAGEM DO MÓDULO LASER -> (SV0053)\n\n`;
        break;

      case 12: // Configuração do leitor
        diagnostico += `  - LEITOR DESCONFIGURADO (OBS: ${obsDefeitoCorrigido})\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A CONFIGURAÇÃO DO LEITOR -> (SV0052)\n\n`;
        } else {
          sistema += `CONFIGURAÇÃO OPCIONAL DO LEITOR -> (SV0052) -> (A CRITÉRIO DO CLIENTE)\n\n`;
        }
        break;

      case 13: // Recuperação do cabo de comunicação
        diagnostico += `  - CABO DE COMUNICAÇÃO DANIFICADO (OBS: ${obsDefeitoCorrigido})\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A RECUPERAÇÃO DO CABO -> (SV0037)\n\n`;
        } else {
          sistema += `RECUPERAÇÃO OPCIONAL DO CABO -> (SV0037) -> (A CRITÉRIO DO CLIENTE)\n\n`;
        }
        break;

      case 14: // Intalação da configuração do cliente
        diagnostico += `  - INSTALAÇÃO DA CONFIGURAÇÃO DO CLIENTE (OBS: ${obsDefeitoCorrigido})\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A INSTALAÇÃO DA CONFIGURAÇÃO DO CLIENTE -> (SV0044)\n\n`;
        } else {
          sistema += `INSTALAÇÃO OPCIONAL DA CONFIGURAÇÃO DO CLIENTE -> (SV0044)\n\n`;
        }
        break;

      case 15: // Observação
        observacao += `  - ${obsDefeitoCorrigido}\n`;
        break;

      default:
        break;

      case 16: // Recuperação de cutter
        diagnostico += `  - CUTTER DANIFICADO (OBS: ${obsDefeitoCorrigido}) -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A RECUPERAÇÃO DO CUTTER -> (SV0066)\n\n`;
        } else {
          sistema += `RECUPERAÇÃO OPCIONAL DO CUTTER -> (SV0066) -> (A CRITÉRIO DO CLIENTE)\n\n`;
        }
        break;
    }
  }
  // Monta o laudo com os blocos dinâmicos
  let laudo = `${infoBasica}${identificadores}CONFORME O DIAGNÓSTICO TÉCNICO, FOI OBSERVADO:\n`;

  if (diagnostico) {
    if (observacao) {
      laudo += `${diagnostico}\n  OBSERVAÇÕES:\n${observacao}\n`;
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
    }

    if (recuperacaoOpcional) {
      laudo += `RECUPERAÇÃO OPCIONAL DO(S) SEGUINTE(S) ITEM(S):\n${recuperacaoOpcional}\n`;
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
      laudo += `${checklistLaudo}\n\n  OBSERVAÇÕES:${observacao}`;
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

  const tipoServico = localStorage.getItem('tipoServico');
  if (tipoServico === 'laudo') {
    // Exibe o laudo na caixa de texto
    laudoTextarea.value = laudo.trim().toUpperCase(); // Garante que tudo esteja em maiúsculas
  }
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


document.getElementById("proceed").addEventListener("click", function () {
  localStorage.clear()
  window.location.href = "../index.html";
});
