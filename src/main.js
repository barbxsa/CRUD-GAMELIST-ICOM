 const API_URL = "http://localhost:3000/api/jogo";

    function carregarJogos() {
      $.get(API_URL, function(data) {
        renderJogos(data);

        $("#filtroNome, #filtroIdade, #filtroAno").off("input").on("input", function() {
          const nomeFiltro = $("#filtroNome").val().toLowerCase();
          const idadeFiltro = $("#filtroIdade").val();
          const anoFiltro = $("#filtroAno").val();

          const filtrados = data.filter(jogo => {
            const matchNome = jogo.nome.toLowerCase().includes(nomeFiltro);
            const matchIdade = idadeFiltro === "" || jogo.idadeMinima == idadeFiltro;
            const matchAno = anoFiltro === "" || jogo.ano == anoFiltro;
            return matchNome && matchIdade && matchAno;
          });

          renderJogos(filtrados);
        });
      });
  }

  function renderJogos(lista) {
      const tbody = $("#tabela-jogos tbody");
      tbody.empty();

      if (lista.length === 0) {
        tbody.append(`<tr><td colspan="7" class="text-center">Nenhum jogo encontrado</td></tr>`);
        return;
      }

      lista.forEach(jogo => {
        const limiteDescricao = 15; 
        let descricao = jogo.descricao;
        if (descricao.length > limiteDescricao) {
          descricao = descricao.substring(0, limiteDescricao) + '...';
        }

        tbody.append(`
          <tr>
            <td>${jogo.id}</td>
            <td>${jogo.nome}</td>
            <td>${jogo.produtora}</td>
            <td>${descricao}</td>
            <td>${jogo.ano}</td>
            <td>${jogo.idadeMinima}</td>
            <td>
              <button class="btn btn-sm btn-edit editar" data-id="${jogo.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-wrong excluir" data-id="${jogo.id}">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `);
      });
    }

      $(document).ready(function() {
        carregarJogos();
        carregarLogs();

        $("#form-jogo").validate({
          submitHandler: function(form) {
            const dados = $(form).serializeArray().reduce((obj, item) => {
              obj[item.name] = item.value;
              return obj;
            }, {});

            dados.ano = parseInt(dados.ano);
            dados.idadeMinima = parseInt(dados.idadeMinima);

            $.post({
              url: API_URL,
              data: JSON.stringify(dados),
              contentType: "application/json",
                success: function(response) {
                alert("Jogo cadastrado com sucesso!");
                form.reset();
                carregarJogos();
              },
              error: function(err) {
                alert("Erro ao cadastrar jogo.");
              }
            });
          }
        });

      $(document).on("click", ".excluir", function() {
        const id = $(this).data("id");
        if (confirm("Tem certeza que deseja excluir este jogo?")) {
          $.ajax({
            url: `${API_URL}/${id}`,
            type: "DELETE",
            success: function() {
              alert("Jogo excluído com sucesso!");
              carregarJogos();
            },
            error: function() {
              alert("Erro ao excluir jogo.");
            }
          });
        }
      });
    });

const LOGS_URL  = `http://localhost:3000/api/logs`;

function carregarLogs() {
  $.get(LOGS_URL, renderLogs);
  $("#filtroAcao, #filtroData").off("change input").on("change input", function () {
    const acao = $("#filtroAcao").val();
    const dia  = $("#filtroData").val(); 

    const params = $.param({ acao, dia }); 
    const query = [];
    if (acao) query.push(`acao=${encodeURIComponent(acao)}`);
    if (dia)  query.push(`dia=${encodeURIComponent(dia)}`);

    $.get(`${LOGS_URL}${query.length ? "?" + query.join("&") : ""}`, renderLogs);
  });
}

function renderLogs(data) {
  const tbody = $("#tabela-logs tbody");
  tbody.empty();

  if (!data || !data.length) {
    tbody.append(`<tr><td colspan="4" class="text-center">Nenhum log encontrado</td></tr>`);
    return;
  }

  data.forEach(log => {
    const dataFmt = new Date(log.data).toLocaleString("pt-BR");
    tbody.append(`
      <tr>
        <td>${log.id}</td>
        <td>${log.idjogo ?? "-"}</td>
        <td>${log.acao}</td>
        <td>${dataFmt}</td>
      </tr>
    `);
  });
}

$(document).ready(function(){
    $('.faixa-etaria a').click(function(e){
        e.preventDefault();
        $('.faixa-etaria a').removeClass('active');
        $(this).addClass('active');
        let texto = $(this).find('span').text().trim();

        let idade = 0;
        if (texto === 'L') {
            idade = 0;
        } else if (texto === 'E10 +' || texto === 'E10+') {
            idade = 10;
        } else if (texto === 'E12 +' || texto === 'E12+') {
            idade = 12;
        } else {
            idade = parseInt(texto); 
        }

        $('#idadeMinima').val(idade);
    });
});

$(document).ready(function(){
    function updateSlider($el) {
        let $menu = $('.menu-list.toggle-menu');
        let $slider = $menu.find('.slider');
        let offset = $el.position().left;
        let width = $el.outerWidth();

        $slider.css({
            left: offset,
            width: width
        });
    }

    let $initial = $('.menu-link.active');
    updateSlider($initial.parent());
    $('.menu-link').on('click', function(e){
        e.preventDefault();
        $('.menu-link').removeClass('active');
        $(this).addClass('active');
        updateSlider($(this).parent());
    });
});


 document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    if (localStorage.getItem('theme') === 'dark') {
      body.classList.add('dark-mode');
    }

    toggleButton.addEventListener('click', function (e) {
      e.preventDefault();

      body.classList.toggle('dark-mode');
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  });

$(document).ready(function() {

  // Abrir modal e preencher dados
  $(document).on("click", ".editar", function() {
    const id = $(this).data("id");

    $.get(`${API_URL}/${id}`, function(jogo) {
      $("#form-editar-jogo [name='id']").val(jogo.id);
      $("#form-editar-jogo [name='nome']").val(jogo.nome);
      $("#form-editar-jogo [name='ano']").val(jogo.ano);
      $("#form-editar-jogo [name='produtora']").val(jogo.produtora);
      $("#form-editar-jogo [name='idadeMinima']").val(jogo.idadeMinima);
      $("#form-editar-jogo [name='descricao']").val(jogo.descricao);

      $('#modal-editar').modal('show');
    }).fail(function() {
      alert("Erro ao carregar os dados do jogo.");
    });
  });

  // Submissão do formulário
  $("#form-editar-jogo").on('submit', function(event) {
    event.preventDefault(); 
    const dados = $(this).serializeArray().reduce((obj, item) => {
      obj[item.name] = item.value;
      return obj;
    }, {});

    dados.ano = parseInt(dados.ano);
    dados.idadeMinima = parseInt(dados.idadeMinima);
    dados.id = parseInt(dados.id);

    console.log("Dados enviados via Ajax:", dados); 

    $.ajax({
      url: API_URL,
      method: 'PUT',
      data: JSON.stringify(dados),
      contentType: "application/json",
      success: function(res) {
        alert("Jogo atualizado com sucesso!");
        $('#modal-editar').modal('hide');
        carregarJogos();
      },
      error: function(xhr, status, error) {
        console.error(xhr, status, error);
        alert("Erro ao atualizar o jogo.");
      }
    });
  });

});


// Ação Front-end

$(document).on("click", ".menu-link", function (e) {
    e.preventDefault();
    let target = $(this).data("target");

    $(".conteudo").addClass("d-none"); 
    $("#" + target).removeClass("d-none"); 
    carregarLogs(); 

    $(".menu-link").removeClass("active");
    $(this).addClass("active");

});

$(document).on("click", "#btnAdicionarJogo", function (e) {
    e.preventDefault();
    let target = $(this).data("target");

    $(".conteudo").addClass("d-none");
    $("#" + target).removeClass("d-none");
      
});

$("#menu-toggle").on("click", function () {
    $("#sidebar").toggleClass("active");
    $("#content").toggleClass("shift");
});