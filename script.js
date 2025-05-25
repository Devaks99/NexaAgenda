const eventos = [
  {
    nome: "Visita técnica na Neurotech",
    data: "2025-05-27T08:00",
    local: "R. de São Jorge, 240 - Recife, PE (Recife Antigo)",
    descricao: "Descrição: A Neurotech é uma marca do grupo B3, 100% brasileira, pioneira na criação de soluções avançadas de Inteligência Artificial, Machine Learning e Big Data."
  },
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

const eventList = document.getElementById("event-list");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalLocal = document.getElementById("modal-local");
const modalClose = document.querySelector(".close");
const googleCalendarLink = document.getElementById("google-calendar-link");

// Campo para descrição
const modalDescricao = document.createElement("p");
modalDescricao.id = "modal-descricao";
document.querySelector(".modal-content").insertBefore(modalDescricao, googleCalendarLink);

// Botão "Fui ao evento"
const fuiButton = document.createElement("button");
fuiButton.textContent = "✅ Fui ao evento";
fuiButton.id = "fui-button";
fuiButton.style.marginTop = "1rem";
document.querySelector(".modal-content").appendChild(fuiButton);

// Armazena eventos concluídos
let concluidos = JSON.parse(localStorage.getItem("eventosConcluidos")) || [];

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR") + " às " + new Date(data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function gerarLinkGoogleCalendar(evento) {
  const start = new Date(evento.data);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evento.nome)}&dates=${start.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${end.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(evento.descricao)}&location=${encodeURIComponent(evento.local)}&sf=true&output=xml`;
}

function atualizarListaEventos() {
  eventList.innerHTML = "";
  eventos
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .forEach((evento, i) => {
      const li = document.createElement("li");
      if (i === 0) li.classList.add("highlight");

      const concluido = concluidos.includes(evento.nome);
      li.innerHTML = `
        <div>
          <strong>${evento.nome} ${concluido ? "✅" : ""}</strong><br>
          🗓️ ${formatarData(evento.data)}
        </div>
        <button onclick="verDetalhes(${i})">Ver detalhes</button>
      `;
      eventList.appendChild(li);
    });
}

window.verDetalhes = function(index) {
  const evento = eventos[index];
  modalTitle.textContent = evento.nome;
  modalDate.textContent = "🗓️ " + formatarData(evento.data);
  modalLocal.textContent = "📍 " + evento.local;
  modalDescricao.textContent = "📄 " + evento.descricao;
  googleCalendarLink.href = gerarLinkGoogleCalendar(evento);

  const agora = new Date();
  const dataEvento = new Date(evento.data);

  if (dataEvento <= agora && !concluidos.includes(evento.nome)) {
    fuiButton.style.display = "inline-block";
    fuiButton.onclick = () => {
      concluidos.push(evento.nome);
      localStorage.setItem("eventosConcluidos", JSON.stringify(concluidos));
      modal.classList.add("hidden");
      atualizarListaEventos();
    };
  } else {
    fuiButton.style.display = "none";
  }

  modal.classList.remove("hidden");
};

modalClose.onclick = () => modal.classList.add("hidden");
window.onclick = e => {
  if (e.target == modal) modal.classList.add("hidden");
};

atualizarListaEventos();
