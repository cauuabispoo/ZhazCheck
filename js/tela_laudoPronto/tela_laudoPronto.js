// Função para carregar o CSV e buscar o nome da opção salva
async function buscarOpcaoSelecionada() {
    const idSelecionado = localStorage.getItem('opcaoSelecionada');
    if (!idSelecionado) {
      alert('Nenhuma opção salva no localStorage!');
      return;
    }
  
    try {
      const resposta = await fetch('opcoes.csv'); // Carrega o CSV
      const textoCSV = await resposta.text();
  
      // Converte o CSV em uma lista de objetos
      const linhas = textoCSV.trim().split('\n').slice(1); // Ignora o cabeçalho
      const dados = linhas.map(linha => {
        const [id, nome] = linha.split(','); // Ignoramos 'equipamentos' aqui
        return { id, nome };
      });
  
      // Busca o nome correspondente ao ID salvo
      const opcao = dados.find(item => item.id === idSelecionado);
      if (opcao) {
        alert(`Opção selecionada: ${opcao.nome}`);
      } else {
        alert('Opção não encontrada!');
      }
    } catch (erro) {
      console.error('Erro ao carregar o CSV:', erro);
    }
  }
  
  // Carregar a opção selecionada ao inicializar a página
  $(document).ready(() => {
    buscarOpcaoSelecionada();
  });