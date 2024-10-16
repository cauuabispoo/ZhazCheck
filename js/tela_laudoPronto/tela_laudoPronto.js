// // Função para carregar o CSV e buscar o nome da opção salva
// async function buscarOpcaoSelecionada() {
//     const idSelecionado = localStorage.getItem('opcaoSelecionada');
//     if (!idSelecionado) {
//       alert('Nenhuma opção salva no localStorage!');
//       return;
//     }
  
//     try {
//       const resposta = await fetch('opcoes.csv'); // Carrega o CSV
//       const textoCSV = await resposta.text();
  
//       // Converte o CSV em uma lista de objetos
//       const linhas = textoCSV.trim().split('\n').slice(1); // Ignora o cabeçalho
//       const dados = linhas.map(linha => {
//         const [id, nome] = linha.split(','); // Ignoramos 'equipamentos' aqui
//         return { id, nome };
//       });
  
//       // Busca o nome correspondente ao ID salvo
//       const opcao = dados.find(item => item.id === idSelecionado);
//       if (opcao) {
//         alert(`Opção selecionada: ${opcao.nome}`);
//       } else {
//         alert('Opção não encontrada!');
//       }
//     } catch (erro) {
//       console.error('Erro ao carregar o CSV:', erro);
//     }
//   }
  
//   // Carregar a opção selecionada ao inicializar a página
//   $(document).ready(() => {
//     buscarOpcaoSelecionada();
//   });
















// Função para ler o CSV e armazenar as peças em um mapa
async function carregarPecas() {
  const response = await fetch("../../csv/pecas.csv");
  const csv = await response.text();
  const linhas = csv.split("\n").slice(1); // Ignora o cabeçalho

  const mapaPecas = {};
  linhas.forEach((linha) => {
    const [id, nome] = linha.split(",");
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

  // Informações básicas
  let infoBasica = "";
  if (lacre === "sim") {
    infoBasica = `OS ANTERIOR: ${osAnterior} - DATA DA MANUTENÇÃO: ${dataManutencao} - OBS: ${obsUltimoServico}\n`;
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
  let instalacaoOpcional = "";

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
        }
        break;

      case 2: // Recuperação de placa
        const peca2 = pecas[obs.peca1SelecionadoGlobal] || "PEÇA DESCONHECIDA";
        const nivel = obs.nivelSelecionadoGlobal === "n1" ? "N1" : obs.nivelSelecionadoGlobal === "n2" ? "N2" : "N3";
        diagnostico += `  - ${peca2} -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          substituicaoNecessaria += `NECESSÁRIO A RECUPERAÇÃO DO(S) ITEM(S):\n  - ${peca2} -> ${nivel}\n`;
        }
        break;

      case 3: // Recuperação de carcaça
        const peca3 = pecas[obs.peca2SelecionadoGlobal] || "PEÇA DESCONHECIDA";
        diagnostico += `  - ${peca3} -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          substituicaoNecessaria += `NECESSÁRIO A RECUPERAÇÃO DO(S) ITEM(S):\n  - ${peca3}\n`;
        }
        break;

      case 4: // Recuperação de bateria
        diagnostico += `  - CARCAÇA DA BATERIA QUEBRADA -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          substituicaoNecessaria += `NECESSÁRIO A RECUPERAÇÃO DA BATERIA -> (SV0080)\n`;
        }
        break;

      case 5: // Atualização do sistema Android
        diagnostico += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          substituicaoNecessaria += `NECESSÁRIO A ATUALIZAÇÃO DO SISTEMA ANDROID -> (SV0035)\n`;
        }
        break;

      case 6: // Restauração da memória
        diagnostico += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          substituicaoNecessaria += `NECESSÁRIO A RESTAURAÇÃO DA MEMÓRIA FLASH ROM -> (SV0064)\n`;
        }
        break;

      case 7: // Upgrade de Firmware
        diagnostico += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          substituicaoNecessaria += `NECESSÁRIO O UPGRADE DA FIRMWARE -> (SV0075)\n`;
        }
        break;

      case 8: // Downgrade de Firmware
        diagnostico += `  - ${obs.obsDefeitoSelecionadoGlobal}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          substituicaoNecessaria += `NECESSÁRIO O DOWNGRADE DA FIRMWARE -> (SV0076)\n`;
        }
        break;

      case 9: // Acessórios
        const pecaAcessorio = pecas[obs.peca3SelecionadoGlobal] || "PEÇA DESCONHECIDA";
        diagnostico += `  - ${pecaAcessorio} -> ${causa}\n`;
        if (obs.opcSelecionadoGlobal === "n") {
          substituicaoOpcional += `  - ${pecaAcessorio}\n`;
        }
        break;

      default:
        break;
    }
  }

  // Monta o laudo com os blocos dinâmicos
  let laudo = `${infoBasica}${identificadores}\nCONFORME O DIAGNÓSTICO TÉCNICO, FOI OBSERVADO:\n${diagnostico}\n`;

  laudo += "SOLUÇÃO:\n";
  if (substituicaoNecessaria) {
    laudo += `${substituicaoNecessaria}\n`;
  }
  
  if (substituicaoOpcional) {
    laudo += `SUBSTITUIÇÃO OPCIONAL DO(S) SEGUINTE(S) ITEM(S):\n${substituicaoOpcional}\n`;
  }

  if (instalacaoOpcional) {
    laudo += `INSTALAÇÃO OPCIONAL DO(S) SEGUINTE(S) ITEM(S):\n${instalacaoOpcional}\n`;
  }

  laudo += "REVISÃO E LIMPEZA - (MÃO DE OBRA)";

  // Exibe o laudo na caixa de texto
  laudoTextarea.value = laudo.trim().toUpperCase(); // Garante que tudo esteja em maiúsculas
}

// Chama a função ao carregar a página
window.onload = gerarLaudo;