const eventosFixos = [
  {
    nome: "Meetup",
    data: "2025-05-29T18:00",
    local: "R. Alfândega, 35, Recife/PE (No Cais da Alfândega, Recife Antigo)",
    descricao: "Descrição: Evento de tecnologia. O que os dados precisam entender sobre o usuário, e o que o frontend precisa entender sobre os dados? (Com Certificado)"
  },
  {
    nome: "Aplicação de IA na detecção de fake news (LIGIA)",
    data: "2025-06-04T16:00",
    local: "UFPE (Várzea)",
    descricao: "Descrição: Professor George Darmiton, coordenador do curso de Inteligência Artificial da UFPE, apresenta pesquisas do grupo CoDes sobre uso de IA na detecção de fake news."
  },
  {
    nome: "Startup Way Health",
    data: "2025-06-06T09:00",
    local: "Av. Mal. Mascarenhas de Morais, 4861 - Imbiribeira, Recife - PE",
    descricao: "Descrição: Aprenda a criar soluções inovadoras para a área da saúde usando Big Idea, Design Thinking, Lean Canvas e Pitch. (Com Certificado)"
  },
  {
    nome: "Semana Carreira Tech (FIAP + ALURA)",
    data: "2025-06-09T19:00",
    local: "Online",
    descricao: "Descrição: Como hackers protegem e dominam o mundo virtual. Evento online com palestras e conteúdos voltados à carreira em tecnologia. (Com Certificado)"
  },
  {
    nome: "Fórum Brasileiro de Deep Techs",
    data: "2025-07-02T09:00",
    local: "Porto Digital, Recife/PE (Recife antigo)",
    descricao: "Descrição: O papel da ciência na solução de grandes desafios sociais e ambientais, com foco em deep techs."
  }
];

// Eventos do usuário salvos localmente
let eventosUsuario = JSON.parse(localStorage.getItem("eventosUsuario")) || [];

// Eventos concluídos
let concluidos = JSON.parse(localStorage.getItem("eventosConcluidos")) || [];

const eventList = document.getElementById("event-list");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalLocal = document.getElementById("modal-local");
const modalDescricao = document.getElementById("modal-descricao");
const googleCalendarLink = document.getElementById("google-calendar-link");
const modalClose = document.querySelector("#modal .close");
const fuiButton = document.getElementById("fui-button");
const userEventControls = document.getElementById("user-event-controls");
const editEventBtn = document.getElementById("edit-event-btn");
const deleteEventBtn = document.getElementById("delete-event-btn");

const btnAddEvent = document.getElementById("btn-add-event");
const modalForm = document.getElementById("modal-form");
const formClose = document.getElementById("form-close");
const formTitle = document.getElementById("form-title");
const eventForm = document.getElementById("event-form");
const eventNameInput = document.getElementById("event-name");
const eventDateInput = document.getElementById("event-date");
const eventLocalInput = document.getElementById("event-local");
const eventDescricaoInput = document.getElementById("event-descricao");
const saveEventBtn = document.getElementById("save-event-btn");

let eventoAtualIndex = null; // Para edição

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR") + " às " + new Date(data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function gerarLinkGoogleCalendar(evento) {
  const start = new Date(evento.data);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evento.nome)}&dates=${start.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${end.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(evento.descricao)}&location=${encodeURIComponent(evento.local)}&sf=true&output=xml`;
}

// Atualiza lista unindo fixos + usuário
function atualizarListaEventos() {
  eventList.innerHTML = "";

  // Combina fixos + usuário
  const todosEventos = [...eventosFixos.map(e => ({...e, tipo: "fixo"})),
                       ...eventosUsuario.map((e, i) => ({...e, tipo: "usuario", indexUsuario: i}))];

  // Ordena por data
  todosEventos.sort((a, b) => new Date(a.data) - new Date(b.data));

  todosEventos.forEach((evento, i) => {
    const li = document.createElement("li");
    if (i === 0) li.classList.add("highlight");

    const concluido = concluidos.includes(evento.nome);

    li.innerHTML = `
      <div>
        <strong>${evento.nome} ${concluido ? "✅" : ""}</strong><br>
        🗓️ ${formatarData(evento.data)}<br>
        📍 ${evento.local}<br>
        <button class="btn-detalhes" data-tipo="${evento.tipo}" data-index="${evento.tipo === "usuario" ? evento.indexUsuario : i}">Detalhes</button>
      </div>
    `;

    eventList.appendChild(li);
  });

  // Adiciona eventos nos botões detalhes
  document.querySelectorAll(".btn-detalhes").forEach(btn => {
    btn.addEventListener("click", () => {
      const tipo = btn.getAttribute("data-tipo");
      const idx = parseInt(btn.getAttribute("data-index"));
      abrirModalEvento(tipo, idx);
    });
  });
}

// Abre modal com detalhes
function abrirModalEvento(tipo, idx) {
  let evento;
  if (tipo === "fixo") {
    evento = eventosFixos[idx];
    userEventControls.style.display = "none";
  } else {
    evento = eventosUsuario[idx];
    userEventControls.style.display = "block";
  }

  modalTitle.textContent = evento.nome;
  modalDate.textContent = `🗓️ ${formatarData(evento.data)}`;
  modalLocal.textContent = `📍 ${evento.local}`;
  modalDescricao.textContent = evento.descricao;
  googleCalendarLink.href = gerarLinkGoogleCalendar(evento);
  modal.style.display = "block";

  // Atualiza texto do botão "Eu fui ao evento" baseado no estado
  if (concluidos.includes(evento.nome)) {
    fuiButton.textContent = "Desmarcar: Eu fui ao evento";
  } else {
    fuiButton.textContent = "Eu fui ao evento";
  }

  // Toggle marcar/desmarcar como ido
  fuiButton.onclick = () => {
    const pos = concluidos.indexOf(evento.nome);
    if (pos === -1) {
      concluidos.push(evento.nome);
      alert("Parabéns por ter ido ao evento!");
    } else {
      concluidos.splice(pos, 1);
      alert("Evento desmarcado como ido.");
    }
    localStorage.setItem("eventosConcluidos", JSON.stringify(concluidos));
    atualizarListaEventos();
    modal.style.display = "none";
  };

  // Editar evento do usuário
  editEventBtn.onclick = () => {
    abrirModalFormulario("editar", idx);
  };

  // Excluir evento do usuário
  deleteEventBtn.onclick = () => {
    if (confirm(`Deseja realmente excluir o evento "${evento.nome}"?`)) {
      eventosUsuario.splice(idx, 1);
      localStorage.setItem("eventosUsuario", JSON.stringify(eventosUsuario));
      modal.style.display = "none";
      atualizarListaEventos();
    }
  };
}

// Abre modal formulário para adicionar ou editar evento
function abrirModalFormulario(acao, idx = null) {
  modalForm.style.display = "block";
  if (acao === "editar") {
    formTitle.textContent = "Editar Evento";
    eventoAtualIndex = idx;
    const ev = eventosUsuario[idx];
    eventNameInput.value = ev.nome;
    eventDateInput.value = ev.data;
    eventLocalInput.value = ev.local;
    eventDescricaoInput.value = ev.descricao;
  } else {
    formTitle.textContent = "Adicionar Evento";
    eventoAtualIndex = null;
    eventForm.reset();
  }
  modal.style.display = "none"; // fecha detalhes se abrir formulário
}

// Fecha modais
modalClose.onclick = () => { modal.style.display = "none"; };
formClose.onclick = () => { modalForm.style.display = "none"; };

// Fecha modais clicando fora do conteúdo
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
  if (e.target === modalForm) modalForm.style.display = "none";
};

btnAddEvent.onclick = () => {
  abrirModalFormulario("adicionar");
};

// Salvar evento no formulário
eventForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const novoEvento = {
    nome: eventNameInput.value.trim(),
    data: eventDateInput.value,
    local: eventLocalInput.value.trim(),
    descricao: eventDescricaoInput.value.trim()
  };

  if (eventoAtualIndex !== null) {
    // Editar evento existente
    eventosUsuario[eventoAtualIndex] = novoEvento;
  } else {
    // Adicionar novo evento
    eventosUsuario.push(novoEvento);
  }

  localStorage.setItem("eventosUsuario", JSON.stringify(eventosUsuario));
  modalForm.style.display = "none";
  atualizarListaEventos();
});

// Inicializa lista
atualizarListaEventos();
