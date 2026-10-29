# ✏️ ACCOR - Reforço Escolar

> Sistema completo de apresentação e captação de alunos para reforço escolar em Aldeia, desenvolvido com **React.js (Node)** no frontend, **Java com Spring Boot** no backend e banco de dados **SQLite**.
> 
> Desenvolvido por: **GabriellCode**

---

## 🎨 Sobre o Projeto

O projeto foi construído fielmente a partir da arte visual do **ACCOR Reforço Escolar**:

* **Público-alvo:** Pais e estudantes de Ensino Fundamental e Médio em busca de evolução acadêmica.
* **Localidade:** Atendimento personalizado em domicílio em **Aldeia**.
* **Diferencial Pedagógico:** Professores especializados com formação pela **UFPE**.
* **Slogan:** *"Um método feito sob medida para você! Aulas individuais, evolução visível."*
* **Contato Direto:** WhatsApp `(81) 9.9122-5450`.

### 📚 Disciplinas Atendidas
* **Exatas:** Matemática, Física, Química
* **Linguagens:** Português, Inglês
* **Ciências & Humanas:** Biologia, História, Geografia

---

## 🏗️ Arquitetura do Sistema

```
trabalho/
├── backend/                  # API REST com Spring Boot e persistência SQLite
│   ├── src/main/java/com/accor/reforcoescolar/
│   │   ├── config/           # CORS e inicialização de dados (DataInitializer)
│   │   ├── controller/       # Endpoints REST (/api/info, /api/disciplinas, /api/contatos)
│   │   ├── dto/              # Objetos de transferência de dados
│   │   ├── model/            # Entidades JPA (Disciplina, ContatoSolicitacao)
│   │   └── repository/       # Repositórios Spring Data JPA
│   ├── src/main/resources/
│   │   └── application.properties # Configuração da conexão SQLite (accor.db)
│   └── pom.xml               # Dependências Maven (Spring Boot 3.4.1, SQLite JDBC)
│
├── frontend/                 # Aplicação React desenvolvida com Vite
│   ├── public/
│   │   └── accor-poster.jpg  # Cartaz e identidade visual original
│   ├── src/
│   │   ├── App.jsx           # Componente principal responsivo com integração à API
│   │   ├── App.css           # Estilos personalizados (moldura de lápis, cores e cards)
│   │   └── index.css         # Tipografia Fredoka & Nunito e reset global
│   └── package.json
└── README.md
```

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
* **Java 21 ou superior**
* **Node.js (v18+)** e **npm**

---

### 1️⃣ Executando o Backend (Spring Boot + SQLite)

Abra um terminal na pasta `backend`:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

O servidor iniciará em `http://localhost:8080`.
O banco SQLite será criado automaticamente no arquivo `backend/accor.db` e populado com as disciplinas iniciais.

#### Principais Endpoints da API:
* `GET /api/info` - Informações gerais do reforço escolar (slogan, contato, localização).
* `GET /api/disciplinas` - Lista de disciplinas cadastradas no banco SQLite.
* `POST /api/contatos` - Envia uma nova solicitação de atendimento/agendamento.
* `GET /api/contatos` - Consulta os contatos recebidos para o painel de atendimento.

---

### 2️⃣ Executando o Frontend (React + Vite)

Abra outro terminal na pasta `frontend`:

```powershell
cd frontend
npm install
npm run dev
```

Acesse no navegador:
`http://localhost:5173`

---

## 📱 Recursos Inclusos na Interface
* **Design Fiel ao Cartaz:** Moldura temática com cores de lápis, cards pedagógicos e exibição da arte original.
* **Formulário com Gravação no SQLite:** Os pedidos de aula enviados pelos pais ficam salvos no banco de dados local.
* **Acesso Rápido ao WhatsApp:** Botão flutuante e botões de chamada com mensagem pré-formatada para o número `(81) 9.9122-5450`.
* **Painel de Solicitações:** Botão no cabeçalho (*Painel SQLite*) que abre um modal para conferir as mensagens e contatos recebidos em tempo real.

---

## 👨‍💻 Autor
Desenvolvido por **GabriellCode**.
Repositório organizado com commits semânticos e documentação completa.
