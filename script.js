const API_BASE = "http://localhost:8080/api";

    function createCard(title, body, extraClass="",/*onClick = ""*/) {
      return `
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm card-clickable ${extraClass}" ${onClick}>
             <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text">${body}</p>
            </div>
          </div>
        </div>
        `;
    }

    async function fetchAndRender(endpoint, containerId, transformFn, extraClass = "", onClick = "") {
      try {
        const res = await fetch(`${API_BASE}/${endpoint}`);
        const data = await res.json();
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        data.forEach(item => {
          container.innerHTML += createCard(...transformFn(item),extraClass,onClick);
        });
      } catch (error) {
        console.error(`Erro ao buscar ${endpoint}:`, error);
      }
    }

    // Funções para formatar os dados recebidos
    const formatCategoria = cat => [cat.nome, ``]//`ID: ${cat.id}`];
/*
    const formatSubcategoria = sub => [
      sub.nomeSubcategoria,
      `Categoria: ${sub.categoria?.nome || "Sem categoria"}`
    ];
*/
const formatSubcategoria = sub => [
    sub.nomeSubcategoria,
    `Categoria: ${sub.categoria?.nome || "Sem categoria"}`,
    "",
    `onclick="buscarInstituicoesPorSubcategoria(${sub.id})"`
  ];

    const formatInstituicao = inst => {
      const endereco = `${inst.logradouro}, ${inst.numero}, ${inst.bairro} - ${inst.localidade}/${inst.estado}`;
      return [
        inst.nome,
        `Subcategoria: ${inst.subcategoria?.nomeSubcategoria || "Não informada"}<br>
         Telefone: ${inst.telefone}<br>
         Email: ${inst.email}<br>
         Endereço: ${endereco}<br>
         CEP: ${inst.cep}`
      ];
    };

    const formatTelefone = tel => [tel.nome, `Número: ${tel.numero}`];

    // Chamada para cada entidade
    fetchAndRender("categorias", "categorias-container", formatCategoria);
    fetchAndRender("subcategorias", "subcategorias-container", formatSubcategoria,"card-clickable", 'onClick="buscarInstituicoesPorSubcategoria(id)"');  
    fetchAndRender("telefones", "telefones-container", formatTelefone);

    fetchAndRender("instituicoes", "instituicoes-container", inst => {
        const [title, body] = formatInstituicao(inst);
        return [title, body, "card-instituicao"];
      });

      function buscarInstituicoesPorSubcategoria(id) {
        // Limpa container atual
        const container = document.getElementById("instituicoes-container");
        container.innerHTML = "<p>Carregando instituições...</p>";
      
        fetch(`${API_BASE}/subcategorias/${id}`)
          .then(res => res.json())
          .then(data => {
            container.innerHTML = "";
            const [title, body] = formatInstituicao(data); // Corrigido: desestruturação dos dados
             container.innerHTML += createCard(title, body, "card-instituicao");
          })
        
          .catch(error => {
            console.error("Erro ao buscar instituições:", error);
            container.innerHTML = "<p>Erro ao carregar instituições.</p>";
          });
      }


    
   /*    
         
     data.forEach(inst => {
           container.innerHTML += createCard(...formatInstituicao(inst), "card-instituicao");
      });   

  */

