$(document).ready(() => {
  const verficaEquipamento = localStorage.getItem('selectedOption');
  const verficaCheck = localStorage.getItem('check');
  const verficaObservacoes = localStorage.getItem('observacoes');

  if(!verficaEquipamento || !verficaObservacoes || !verficaCheck){
      window.location.href = "equipamento.html";
      localStorage.clear();
  }
});
















// Função para ler o CSV e armazenar as peças em um mapa
async function carregarPecas() {
  const response = await fetch("../../csv/pecas.csv");
  const csv = await response.text();
  const linhas = csv.split("\n").slice(1); // Ignora o cabeçalho

  const mapaPecas = {};
  linhas.forEach((linha) => {
    const [id, nome, equipamento] = linha.split(",");
    mapaPecas[id.trim()] = nome.trim();
  });
  return mapaPecas;
}

// // Função para gerar o laudo completo
// async function gerarLaudo() {
//   const pecas = await carregarPecas();
//   const laudoTextarea = document.getElementById("laudo");

//   // Dados do localStorage
//   const lacre = localStorage.getItem("lacre");
//   const osAnterior = localStorage.getItem("osAnterior");
//   const dataManutencao = localStorage.getItem("dataManutencao");
//   const obsUltimoServico = localStorage.getItem("obsUltimoServico");
//   const mac = localStorage.getItem("mac");
//   const serial = localStorage.getItem("serial");
//   const imei = localStorage.getItem("imei");
//   const observacoes = JSON.parse(localStorage.getItem("observacoes")) || [];

//   // Informações básicas
//   let infoBasica = "";
//   if (lacre === "sim") {
//     infoBasica = `OS ANTERIOR: ${osAnterior} - DATA DA MANUTENÇÃO: ${dataManutencao} - OBS: ${obsUltimoServico}\n`;
//   }

//   // Informações do MAC, Serial e IMEI (sem hifens desnecessários)
//   let identificadores = [mac !== "/" ? `MAC: ${mac}` : "", 
//                          serial !== "/" ? `SERIAL: ${serial}` : "", 
//                          imei !== "/" ? `IMEI: ${imei}` : ""]
//                          .filter(Boolean) // Remove entradas vazias
//                          .join(" - "); // Junta com hifens apenas se houver mais de um valor

//   if (identificadores) {
//     identificadores = `\n- ${identificadores}\n`; // Adiciona o identificador com quebra de linha
//   }

//   // Variáveis para armazenar diagnósticos e tipos de substituição
//   let diagnostico = "";
//   let substituicaoNecessaria = "";
//   let substituicaoOpcional = "";
//   let instalacaoOpcional = "";

//   // Processa as observações e distribui conforme o tipo
//   for (const obs of observacoes) {
//     const peca = pecas[obs.pecaSelecionadoGlobal] || "Peça Desconhecida";
//     const causa = {
//       mau: "USO INDEVIDO",
//       dgn: "DESGASTE DE USO",
//       df: "DEFEITO"
//     }[obs.causaDefeitoSelecionadoGlobal] || "CAUSA DESCONHECIDA";

//     diagnostico += `  - ${peca} ${obs.obsDefeitoSelecionadoGlobal} -> ${causa}\n`;

//     if (obs.opcSelecionadoGlobal === "n") {
//       substituicaoNecessaria += `  - ${peca}\n`;
//     } else {
//       substituicaoOpcional += `  - ${peca}\n`;
//     }

//     if (obs.valorSelecionadoGlobal === 8) {
//       instalacaoOpcional += `  - ${peca}\n`;
//     }
//   }

//   // Monta o laudo com os blocos dinâmicos
//   let laudo = `${infoBasica}${identificadores}\nCONFORME O DIAGNÓSTICO TÉCNICO, FOI OBSERVADO:\n${diagnostico}\n`;

//   if (substituicaoNecessaria) {
//     laudo += `NECESSÁRIO A SUBSTITUIÇÃO DO(S) SEGUINTE(S) ITEM(S):\n${substituicaoNecessaria}\n`;
//   }

//   if (substituicaoOpcional) {
//     laudo += `SUBSTITUIÇÃO OPCIONAL DO(S) SEGUINTE(S) ITEM(S):\n${substituicaoOpcional}\n`;
//   }

//   if (instalacaoOpcional) {
//     laudo += `INSTALAÇÃO OPCIONAL DO(S) SEGUINTE(S) ITEM(S):\n${instalacaoOpcional}\n`;
//   }

//   laudo += "REVISÃO E LIMPEZA - (MÃO DE OBRA)";

//   // Exibe o laudo na caixa de texto
//   laudoTextarea.value = laudo.trim();
// }

// // Chama a função ao carregar a página
// window.onload = gerarLaudo;








// Função para gerar o laudo completo
async function gerarLaudo() {
  const pecas = await carregarPecas();
  const laudoTextarea = document.getElementById("laudo");

  // Dados do localStorage
  const lacre = localStorage.getItem("lacre");
  const osAnterior = localStorage.getItem("osAnterior");
  const dataManutencao = localStorage.getItem("dataManutencao");
  const obsUltimoServico = localStorage.getItem("obsUltimoServico");
  const mac = localStorage.getItem("mac");
  const serial = localStorage.getItem("serial");
  const imei = localStorage.getItem("imei");
  const observacoes = JSON.parse(localStorage.getItem("observacoes")) || [];


  // Função para verificar se está em garantia (3 meses = 90 dias)
  function estaEmGarantia(dataManutencao) {
    const dataManut = new Date(dataManutencao); // Converter para objeto Date
    const hoje = new Date(); // Data atual

    // Calcular a diferença em milissegundos e converter para dias
    const diferencaDias = Math.floor((hoje - dataManut) / (1000 * 60 * 60 * 24));

    // Verificar se a diferença é menor ou igual a 90 dias
    return diferencaDias <= 90;
  }

  // Informações básicas
  let infoBasica = "";
  if (lacre === "sim") {
    const garantiaStatus = estaEmGarantia(dataManutencao) ? "EM GARANTIA" : "FORA DE GARANTIA";

    infoBasica = `OS ANTERIOR: ${osAnterior} - DATA DA MANUTENÇÃO: ${dataManutencao} - OBS: ${obsUltimoServico} - ${garantiaStatus}\n`;
  }

  // Informações do MAC, Serial e IMEI (sem hifens desnecessários)
  let identificadores = [mac !== "/" ? `MAC: ${mac}` : "",
  serial !== "/" ? `SERIAL: ${serial}` : "",
  imei !== "/" ? `IMEI: ${imei}` : ""]
    .filter(Boolean) // Remove entradas vazias
    .join(" - "); // Junta com hifens apenas se houver mais de um valor

  if (identificadores) {
    identificadores = `\n- ${identificadores}\n`; // Adiciona o identificador com quebra de linha
  }

  // Variáveis para armazenar diagnósticos e tipos de substituição
  let diagnostico = "";
  let substituicaoNecessaria = "";
  let substituicaoOpcional = "";
  let instalacaoNecessaria = "";
  let instalacaoOpcional = "";
  let recuperacaoNecessaria = "";
  let recuperacaoOpcional = "";
  let sistema = "";

  // Processa as observações e distribui conforme o tipo
  for (const obs of observacoes) {
    const causa = {
      mau: "USO INDEVIDO",
      dgn: "DESGASTE DE USO",
      df: "DEFEITO"
    }[obs.causaDefeitoSelecionadoGlobal] || "CAUSA DESCONHECIDA";

    switch (obs.valorSelecionadoGlobal) {
      case 1: // Substituição de componente
        const peca1 = pecas[obs.pecaSelecionadoGlobal] || "PEÇA DESCONHECIDA";
        diagnostico += `  - ${peca1} ${obs.obsDefeitoSelecionadoGlobal} -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          substituicaoNecessaria += `  - ${peca1}\n`;
        } else {
          substituicaoOpcional += `  - ${peca1}\n`;
        }
        break;

      case 2: // Recuperação de placa
        const peca2 = pecas[obs.peca1SelecionadoGlobal] || "PEÇA DESCONHECIDA";
        const nivel = obs.nivelSelecionadoGlobal === "n1" ? "N1" : obs.nivelSelecionadoGlobal === "n2" ? "N2" : "N3";
        diagnostico += `  - ${peca2} ${obs.obsDefeitoSelecionadoGlobal} -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          recuperacaoNecessaria += `  - ${peca2} -> ${nivel}\n`;
        } else {
          recuperacaoOpcional += `  - ${peca2} -> ${nivel}\n`;
        }
        break;

      case 3: // Recuperação de carcaça
        const peca3 = pecas[obs.peca2SelecionadoGlobal] || "PEÇA DESCONHECIDA";
        diagnostico += `  - ${peca3} ${obs.obsDefeitoSelecionadoGlobal} -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          recuperacaoNecessaria += `  - ${peca3}\n`;
        } else {
          recuperacaoOpcional += `  - ${peca3}\n`;
        }
        break;

      case 4: // Recuperação de bateria
        diagnostico += `  - CARCAÇA DA BATERIA ${obs.obsDefeitoSelecionadoGlobal} -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A RECUPERAÇÃO DA BATERIA -> (SV0071)\n\n`;
        } else {
          sistema += `RECUPERAÇÃO OPCIONAL DA BATERIA -> (SV0071)\n\n`;
        }
        break;

      case 5: // Atualização do sistema Android
        diagnostico += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A ATUALIZAÇÃO DO SISTEMA ANDROID -> (SV0042)\n\n`;
        } else {
          sistema += `ATUALIZAÇÃO OPCIONAL DO SISTEMA ANDROID -> (SV0042)\n\n`;
        }
        break;

      case 6: // Restauração da memória
        diagnostico += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO A RESTAURAÇÃO DA MEMÓRIA FLASH ROM -> (SV0040)\n\n`;
        } else {
          sistema += `RESTAURAÇÃO OPCIONAL DA MEMÓRIA FLASH ROM -> (SV0040)\n\n`;
        }
        break;

      case 7: // Upgrade de Firmware
        diagnostico += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO O UPGRADE DA FIRMWARE -> (SV0046)\n\n`;
        } else {
          sistema += `UPGRADE OPCIONAL DA FIRMWARE -> (SV0046)\n\n`;
        }
        break;

      case 8: // Downgrade de Firmware
        diagnostico += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          sistema += `NECESSÁRIO O DOWNGRADE DA FIRMWARE -> (SV0047)\n\n`;
        } else {
          sistema += `DOWNGRADE OPCIONAL DA FIRMWARE -> (SV0047)\n\n`;
        }
        break;

      case 9: // Acessórios
        const pecaAcessorio = pecas[obs.peca3SelecionadoGlobal] || "PEÇA DESCONHECIDA";
        if (obs.opcSelecionadoGlobal === "n") {
          instalacaoNecessaria += `  - ${pecaAcessorio} - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        } else {
          instalacaoOpcional += `  - ${pecaAcessorio} - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        }
        break;

      default:
        break;
    }
  }

  // Monta o laudo com os blocos dinâmicos
  let laudo = `${infoBasica}${identificadores}CONFORME O DIAGNÓSTICO TÉCNICO, FOI OBSERVADO:\n`;

  if (diagnostico) {
    laudo += `${diagnostico}\n`;


    laudo += "SOLUÇÃO:\n";
    if (sistema) {
      laudo += `${sistema}\n`;
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
      laudo += `RECUPERAÇÃO OPCIONAL DO(S) SEGUINTE(S) ITEM(S):\n${substituicaoOpcional}\n`;
    }

    if (instalacaoNecessaria) {
      laudo += `NECESSÁRIO A INSTALAÇÃO DO(S) SEGUINTE(S) ITEM(S):\n${instalacaoOpcional}\n`;
    }

    if (instalacaoOpcional) {
      laudo += `INSTALAÇÃO OPCIONAL DO(S) SEGUINTE(S) ITEM(S):\n${instalacaoOpcional}\n`;
    }

  } else {
    laudo += `  - FORAM REALIZADOS TODOS OS TESTES E O EQUIPAMENTO NÃO APRESENTOU NENHUM DEFEITO\n\n`;
  }

  laudo += "REVISÃO E LIMPEZA - (MÃO DE OBRA)";

  // Exibe o laudo na caixa de texto
  laudoTextarea.value = laudo.trim().toUpperCase(); // Garante que tudo esteja em maiúsculas
}

// Chama a função ao carregar a página
window.onload = gerarLaudo;