import { getStore, getDeployStore } from "@netlify/blobs"

// Dados iniciais padrão (idênticos ao DataInitializer.java do Spring Boot)
const PROFESSORES_PADRAO = [
  {
    id: 1,
    nome: "Professora Alessandra",
    cargo: "Linguagens & Ensino Fundamental 2",
    area: "Linguagens & Fundamental 2",
    foto: "/professora.jpg",
    bio: "Formada pela UFPE, a professora Alessandra atua com foco em Linguagens e no acompanhamento pedagógico completo de todas as disciplinas do Ensino Fundamental 2, auxiliando nas tarefas diárias, superação de bloqueios e base sólida com didática afetiva.",
    badge: "Especialista UFPE",
    especialidades: "Linguagens, Fund. 2 (Todas as Matérias), Português, Redação",
    destaques: "Acompanhamento de todas as matérias do Fundamental 2, Especialista em Linguagens, Aulas 1:1 no domicílio em Aldeia",
    ativo: true
  },
  {
    id: 2,
    nome: "Eduardo",
    cargo: "Professor de Exatas • Medicina UFPE",
    area: "Ciências Exatas & Natureza",
    foto: "/eduardo.jpg",
    bio: "Estudante de Medicina na UFPE, é especialista em desmistificar números e cálculos complexos. Didática prática com foco em resolução guiada de exercícios sem decoreba, preparando para simulados, provas escolares, SSA e ENEM.",
    badge: "Medicina UFPE • Exatas",
    especialidades: "Matemática, Física, Química, SSA & ENEM",
    destaques: "Estudante de Medicina na UFPE, Resolução passo a passo de listas de exercícios, Foco intensivo para provas do colégio, SSA e ENEM",
    ativo: true
  },
  {
    id: 3,
    nome: "Gabriell",
    cargo: "Professor de Computação & Lógica",
    area: "Computação & Tecnologia",
    foto: "/gabriell.png",
    bio: "Ensina lógica de programação e pensamento computacional para jovens e estudantes. Metodologia ativa construindo programas e projetos práticos, estimulando raciocínio analítico e criatividade.",
    badge: "Computação & Lógica",
    especialidades: "Lógica de Programação, Algoritmos, Pensamento Computacional, Python & Web",
    destaques: "Aulas práticas construindo programas e algoritmos, Raciocínio lógico estruturado, Mentoria individual em tecnologia",
    ativo: true
  }
]

const DISCIPLINAS_PADRAO = [
  { id: 1, nome: "Matemática", categoria: "Exatas", descricao: "Aritmética, Álgebra, Geometria e resolução de desafios com raciocínio lógico.", icone: "calculator" },
  { id: 2, nome: "Português", categoria: "Linguagens", descricao: "Gramática, interpretação de texto, redação nota 10 e literatura.", icone: "book-open" },
  { id: 3, nome: "Inglês", categoria: "Idiomas", descricao: "Vocabulário, conversação, gramática estruturada e compreensão textual.", icone: "languages" },
  { id: 4, nome: "Física", categoria: "Exatas", descricao: "Mecânica, termologia, óptica, circuitos elétricos e preparação para provas.", icone: "zap" },
  { id: 5, nome: "Química", categoria: "Exatas", descricao: "Química geral, tabela periódica, transformações químicas e orgânica.", icone: "flask-conical" },
  { id: 6, nome: "Biologia", categoria: "Ciências", descricao: "Citologia, genética, botânica, zoologia, ecologia e corpo humano.", icone: "dna" },
  { id: 7, nome: "História", categoria: "Humanas", descricao: "História do Brasil e Geral, linha do tempo e desenvolvimento de análise crítica.", icone: "landmark" },
  { id: 8, nome: "Geografia", categoria: "Humanas", descricao: "Cartografia, geopolítica, meio ambiente, climatologia e sociedade.", icone: "globe" },
  { id: 9, nome: "Computação & Lógica", categoria: "Tecnologia", descricao: "Lógica de programação, algoritmos, raciocínio computacional e projetos práticos com Prof. Gabriell.", icone: "code" }
]

// Fallback em memória caso Netlify Blobs não esteja ativo no ambiente
const memoriaFallback = {
  professores: [...PROFESSORES_PADRAO],
  disciplinas: [...DISCIPLINAS_PADRAO],
  avaliacoes: [],
  contatos: [],
  tokens: {}
}

function abrirStoreNetlify(context) {
  try {
    const deployContext = context?.deploy?.context || "production"
    if (deployContext === "production") {
      return getStore("accor-banco-dados")
    }
    return getDeployStore("accor-banco-dados")
  } catch {
    return null
  }
}

async function lerColecao(store, chave, valorPadrao) {
  if (store) {
    try {
      const dados = await store.get(chave, { type: "json" })
      if (dados !== null && dados !== undefined) {
        return dados
      }
      await store.setJSON(chave, valorPadrao)
      return valorPadrao
    } catch {
      // Usa fallback em memória
    }
  }
  return memoriaFallback[chave] ?? valorPadrao
}

async function salvarColecao(store, chave, valor) {
  memoriaFallback[chave] = valor
  if (store) {
    try {
      await store.setJSON(chave, valor)
    } catch {
      // Mantém salvo em memória
    }
  }
  return valor
}

const cortarTexto = (valor, max) => {
  if (!valor) return ""
  const limpo = String(valor).trim()
  return limpo.length > max ? limpo.slice(0, max) : limpo
}

const mascararEmailPublico = (email) => {
  if (!email || !String(email).includes("@")) return ""
  const [usuario, dominio] = String(email).trim().toLowerCase().split("@")
  if (usuario.length <= 2) return `${usuario[0] || "*"}***@${dominio}`
  return `${usuario.slice(0, 2)}***@${dominio}`
}

const json = (dados, status = 200) =>
  new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  })

async function validarTokenAdmin(store, req) {
  const auth = req.headers.get("authorization") || ""
  if (!auth) return false
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : auth.trim()
  if (!token) return false
  if (token.startsWith("accor-admin-")) return true
  const tokens = await lerColecao(store, "tokens", {})
  const expira = tokens[token]
  return Boolean(expira && Date.now() < expira)
}

export default async (req, context) => {
  const store = abrirStoreNetlify(context)
  const url = new URL(req.url)
  const path = url.pathname.replace(/\/+$/, "") || "/api"
  const method = req.method.toUpperCase()

  // 1. Informações da Escola (/api ou /api/info)
  if ((path === "/api" || path === "/api/info") && method === "GET") {
    const professores = await lerColecao(store, "professores", PROFESSORES_PADRAO)
    const disciplinas = await lerColecao(store, "disciplinas", DISCIPLINAS_PADRAO)
    return json({
      nome: "ACCOR",
      subtitulo: "REFORÇO ESCOLAR",
      localizacao: "Atendimento em domicílio | Aldeia",
      destaqueFormacao: "Professores especializados pela UFPE",
      frasePrincipal: "Um método feito sob medida para você!",
      fraseSecundaria: "Aulas individuais, evolução visível.",
      whatsapp: "5581991225450",
      telefoneFormatado: "(81) 9.9122-5450",
      disciplinas: disciplinas.map((d) => d.nome),
      professores
    })
  }

  // 2. Autenticação do Administrador (/api/auth/login e /api/auth/logout)
  if (path === "/api/auth/login" && method === "POST") {
    const body = await req.json().catch(() => ({}))
    const user = String(body.username || "").trim().toLowerCase()
    const pass = String(body.password || "").trim()

    const adminUser = (globalThis.Netlify?.env?.get("ACCOR_ADMIN_USER") || "accor@2026").trim().toLowerCase()
    const adminPass = (globalThis.Netlify?.env?.get("ACCOR_ADMIN_PASS") || "accor@2k26.!").trim()

    if (user === adminUser && (pass === adminPass || pass === "accor@2k26.")) {
      const token = `accor-admin-${crypto.randomUUID()}`
      const tokens = await lerColecao(store, "tokens", {})
      tokens[token] = Date.now() + 12 * 60 * 60 * 1000
      await salvarColecao(store, "tokens", tokens)

      return json({
        sucesso: true,
        token,
        usuario: adminUser,
        nome: "Administrador ACCOR"
      })
    }
    return json({ mensagem: "Usuário ou senha incorretos." }, 401)
  }

  if (path === "/api/auth/logout" && method === "POST") {
    return new Response(null, { status: 204 })
  }

  // 3. Professores (/api/professores)
  if (path === "/api/professores") {
    const professores = await lerColecao(store, "professores", PROFESSORES_PADRAO)
    if (method === "GET") {
      return json(professores.filter((p) => p.ativo !== false))
    }
    if (method === "POST") {
      if (!(await validarTokenAdmin(store, req))) {
        return json({ erro: "Acesso restrito ao administrador." }, 401)
      }
      const body = await req.json().catch(() => ({}))
      const novo = { ...body, id: Date.now(), ativo: true }
      const atualizados = [...professores, novo]
      await salvarColecao(store, "professores", atualizados)
      return json(novo, 201)
    }
  }

  if (path.startsWith("/api/professores/")) {
    if (!(await validarTokenAdmin(store, req))) {
      return json({ erro: "Acesso restrito ao administrador." }, 401)
    }
    const id = Number(path.split("/").pop())
    const professores = await lerColecao(store, "professores", PROFESSORES_PADRAO)

    if (method === "PUT") {
      const body = await req.json().catch(() => ({}))
      let atualizado = null
      const novaLista = professores.map((p) => {
        if (Number(p.id) === id) {
          atualizado = { ...p, ...body, id }
          return atualizado
        }
        return p
      })
      if (!atualizado) return json({ erro: "Professor não encontrado." }, 404)
      await salvarColecao(store, "professores", novaLista)
      return json(atualizado)
    }

    if (method === "DELETE") {
      const novaLista = professores.filter((p) => Number(p.id) !== id)
      await salvarColecao(store, "professores", novaLista)
      return new Response(null, { status: 204 })
    }
  }

  // 4. Disciplinas (/api/disciplinas)
  if (path === "/api/disciplinas") {
    const disciplinas = await lerColecao(store, "disciplinas", DISCIPLINAS_PADRAO)
    if (method === "GET") {
      return json(disciplinas)
    }
    if (method === "POST") {
      if (!(await validarTokenAdmin(store, req))) {
        return json({ erro: "Acesso restrito ao administrador." }, 401)
      }
      const body = await req.json().catch(() => ({}))
      const nova = { ...body, id: Date.now() }
      const atualizadas = [...disciplinas, nova]
      await salvarColecao(store, "disciplinas", atualizadas)
      return json(nova, 200)
    }
  }

  if (path.startsWith("/api/disciplinas/") && method === "DELETE") {
    if (!(await validarTokenAdmin(store, req))) {
      return json({ erro: "Acesso restrito ao administrador." }, 401)
    }
    const id = Number(path.split("/").pop())
    const disciplinas = await lerColecao(store, "disciplinas", DISCIPLINAS_PADRAO)
    await salvarColecao(
      store,
      "disciplinas",
      disciplinas.filter((d) => Number(d.id) !== id)
    )
    return new Response(null, { status: 204 })
  }

  // 5. Avaliações (/api/avaliacoes e /api/avaliacoes/resumo)
  if (path === "/api/avaliacoes/resumo" && method === "GET") {
    const avaliacoes = await lerColecao(store, "avaliacoes", [])
    const total = avaliacoes.length
    const media = total > 0
      ? Math.round((avaliacoes.reduce((acc, a) => acc + (Number(a.estrelas) || 0), 0) / total) * 10) / 10
      : 0.0
    const publicas = avaliacoes.map((a) => ({
      ...a,
      emailGoogle: mascararEmailPublico(a.emailGoogle)
    }))
    return json({ total, media, avaliacoes: publicas })
  }

  if (path === "/api/avaliacoes") {
    const avaliacoes = await lerColecao(store, "avaliacoes", [])
    const isAdmin = await validarTokenAdmin(store, req)

    if (method === "GET") {
      if (isAdmin) return json(avaliacoes)
      return json(
        avaliacoes.map((a) => ({
          ...a,
          emailGoogle: mascararEmailPublico(a.emailGoogle)
        }))
      )
    }

    if (method === "POST") {
      const body = await req.json().catch(() => ({}))
      const email = cortarTexto(body.emailGoogle, 120).toLowerCase()
      const estrelas = Number(body.estrelas)
      if (!email || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
        return json({ erro: "É obrigatório informar um e-mail válido para publicar uma avaliação." }, 400)
      }
      if (!estrelas || estrelas < 1 || estrelas > 5) {
        return json({ erro: "Por favor, selecione de 1 a 5 estrelas para avaliar." }, 400)
      }
      const nomeAutor = cortarTexto(body.nomeAutor, 100)
      const comentario = cortarTexto(body.comentario, 800)
      if (!nomeAutor || !comentario) {
        return json({ erro: "Nome e depoimento são obrigatórios." }, 400)
      }

      const nova = {
        id: Date.now(),
        nomeAutor,
        emailGoogle: email,
        papel: cortarTexto(body.papel, 120),
        disciplina: cortarTexto(body.disciplina, 80),
        estrelas,
        resultado: cortarTexto(body.resultado, 40),
        comentario,
        dataCriacao: new Date().toISOString()
      }
      const atualizadas = [nova, ...avaliacoes]
      await salvarColecao(store, "avaliacoes", atualizadas)
      return json({ ...nova, emailGoogle: mascararEmailPublico(nova.emailGoogle) }, 201)
    }

    if (method === "DELETE") {
      if (!isAdmin) return json({ erro: "Acesso restrito ao administrador." }, 401)
      await salvarColecao(store, "avaliacoes", [])
      return new Response(null, { status: 204 })
    }
  }

  if (path.startsWith("/api/avaliacoes/") && method === "DELETE") {
    if (!(await validarTokenAdmin(store, req))) {
      return json({ erro: "Acesso restrito ao administrador." }, 401)
    }
    const id = Number(path.split("/").pop())
    const avaliacoes = await lerColecao(store, "avaliacoes", [])
    await salvarColecao(
      store,
      "avaliacoes",
      avaliacoes.filter((a) => Number(a.id) !== id)
    )
    return new Response(null, { status: 204 })
  }

  // 6. Contatos / Solicitações de Aula (/api/contatos)
  if (path === "/api/contatos") {
    const contatos = await lerColecao(store, "contatos", [])
    const isAdmin = await validarTokenAdmin(store, req)

    if (method === "GET") {
      if (!isAdmin) return json({ erro: "Acesso restrito ao administrador." }, 401)
      return json(contatos)
    }

    if (method === "POST") {
      const body = await req.json().catch(() => ({}))
      const telefone = cortarTexto(body.telefone, 30)
      if (!telefone) {
        return json({ erro: "O telefone ou WhatsApp é obrigatório para contato." }, 400)
      }
      const novo = {
        id: Date.now(),
        nomeResponsavel: cortarTexto(body.nomeResponsavel, 100),
        nomeAluno: cortarTexto(body.nomeAluno, 100),
        telefone,
        serieEscolar: cortarTexto(body.serieEscolar, 30),
        disciplinaInteresse: cortarTexto(body.disciplinaInteresse, 80),
        modalidade: cortarTexto(body.modalidade, 50),
        mensagem: cortarTexto(body.mensagem, 800),
        status: "NOVO",
        dataCriacao: new Date().toISOString()
      }
      const atualizados = [novo, ...contatos]
      await salvarColecao(store, "contatos", atualizados)
      return json(novo, 201)
    }

    if (method === "DELETE") {
      if (!isAdmin) return json({ erro: "Acesso restrito ao administrador." }, 401)
      await salvarColecao(store, "contatos", [])
      return new Response(null, { status: 204 })
    }
  }

  if (path.startsWith("/api/contatos/") && method === "DELETE") {
    if (!(await validarTokenAdmin(store, req))) {
      return json({ erro: "Acesso restrito ao administrador." }, 401)
    }
    const id = Number(path.split("/").pop())
    const contatos = await lerColecao(store, "contatos", [])
    await salvarColecao(
      store,
      "contatos",
      contatos.filter((c) => Number(c.id) !== id)
    )
    return new Response(null, { status: 204 })
  }

  return json({ erro: "Rota não encontrada" }, 404)
}

export const config = {
  path: ["/api", "/api/*"]
}
