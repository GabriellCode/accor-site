import { useState, useEffect, useRef } from 'react'
import { 
  BookOpen, 
  MapPin, 
  GraduationCap, 
  Phone, 
  MessageCircle, 
  Calculator, 
  Languages, 
  Zap, 
  FlaskConical, 
  Dna, 
  Landmark, 
  Globe, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Calendar, 
  User, 
  ShieldCheck,
  Database,
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Code,
  Lock,
  Edit,
  Trash2,
  Plus,
  LogOut,
  ArrowLeft,
  ArrowUp,
  X
} from 'lucide-react'
import './App.css'

// URL base da API: usa VITE_API_URL em produção (Hostinger) ou localhost:8080 em desenvolvimento local
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080/api'
    : '/api'
)

// Dados padrão de contingência caso o backend esteja iniciando
const DEFAULT_DISCIPLINAS = [
  { id: 1, nome: "Matemática", categoria: "Exatas", descricao: "Aritmética, Álgebra, Geometria e resolução de desafios com raciocínio lógico.", icone: "calculator", cor: "#2563EB" },
  { id: 2, nome: "Português", categoria: "Linguagens", descricao: "Gramática, interpretação de texto, redação nota 10 e literatura.", icone: "book-open", cor: "#DC2626" },
  { id: 3, nome: "Inglês", categoria: "Idiomas", descricao: "Vocabulário, conversação, gramática estruturada e compreensão textual.", icone: "languages", cor: "#9333EA" },
  { id: 4, nome: "Física", categoria: "Exatas", descricao: "Mecânica, termologia, óptica, circuitos elétricos e preparação para provas.", icone: "zap", cor: "#EA580C" },
  { id: 5, nome: "Química", categoria: "Exatas", descricao: "Química geral, tabela periódica, transformações químicas e orgânica.", icone: "flask-conical", cor: "#0D9488" },
  { id: 6, nome: "Biologia", categoria: "Ciências", descricao: "Citologia, genética, botânica, zoologia, ecologia e corpo humano.", icone: "dna", cor: "#16A34A" },
  { id: 7, nome: "História", categoria: "Humanas", descricao: "História do Brasil e Geral, linha do tempo e desenvolvimento de análise crítica.", icone: "landmark", cor: "#D97706" },
  { id: 8, nome: "Geografia", categoria: "Humanas", descricao: "Cartografia, geopolítica, meio ambiente, climatologia e sociedade.", icone: "globe", cor: "#0284C7" },
  { id: 9, nome: "Computação & Lógica", categoria: "Tecnologia", descricao: "Lógica de programação, algoritmos, raciocínio computacional e projetos práticos com Prof. Gabriell.", icone: "code", cor: "#0D9488" }
]

// Sem avaliações de exemplo: apenas avaliações reais enviadas por usuários com e-mail Google (@gmail.com)
const DEFAULT_AVALIACOES = []

// Professores padrão
const DEFAULT_PROFESSORES = [
  {
    id: 1,
    nome: "Professora Alessandra",
    cargo: "Linguagens & Ensino Fundamental 2",
    area: "Linguagens & Fundamental 2",
    foto: "/professora.jpg",
    bio: "Formada pela UFPE, a professora Alessandra atua com foco em Linguagens e no acompanhamento pedagógico completo de todas as disciplinas do Ensino Fundamental 2, auxiliando nas tarefas diárias, superação de bloqueios e base sólida com didática afetiva.",
    badge: "Especialista UFPE",
    especialidades: "Linguagens, Fund. 2 (Todas as Matérias), Português, Redação",
    destaques: "Acompanhamento de todas as matérias do Fundamental 2, Especialista em Linguagens, Aulas 1:1 no domicílio em Aldeia"
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
    destaques: "Estudante de Medicina na UFPE, Resolução passo a passo de listas de exercícios, Foco intensivo para provas do colégio, SSA e ENEM"
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
    destaques: "Aulas práticas construindo programas e algoritmos, Raciocínio lógico estruturado, Mentoria individual em tecnologia"
  }
]

function App() {
  // Controle de Navegação entre Site Público e Área de Admin
  const [telaAtual, setTelaAtual] = useState('site')
  const [adminAutenticado, setAdminAutenticado] = useState(() => {
    return localStorage.getItem('accor_admin_auth') === 'true' && Boolean(localStorage.getItem('accor_admin_token'))
  })
  const [loginCredenciais, setLoginCredenciais] = useState({ username: '', password: '' })
  const [loginErro, setLoginErro] = useState('')
  const [adminTab, setAdminTab] = useState('professores')

  const [disciplinas, setDisciplinas] = useState(() => {
    try {
      const salvas = localStorage.getItem('accor_disciplinas_local')
      return salvas ? JSON.parse(salvas) : DEFAULT_DISCIPLINAS
    } catch {
      return DEFAULT_DISCIPLINAS
    }
  })
  const [professores, setProfessores] = useState(() => {
    try {
      const salvos = localStorage.getItem('accor_professores_local')
      return salvos ? JSON.parse(salvos) : DEFAULT_PROFESSORES
    } catch {
      return DEFAULT_PROFESSORES
    }
  })
  const [filtroCategoria] = useState('TODAS')
  const [solicitacoes, setSolicitacoes] = useState(() => {
    try {
      const salvas = localStorage.getItem('accor_solicitacoes_local')
      return salvas ? JSON.parse(salvas) : []
    } catch {
      return []
    }
  })
  const [modalAdminAberto, setModalAdminAberto] = useState(false)
  const [carregandoAdmin, setCarregandoAdmin] = useState(false)

  // Modais de Criação/Edição no Admin
  const [modalProfAberto, setModalProfAberto] = useState(false)
  const [editandoProfId, setEditandoProfId] = useState(null)
  const [profForm, setProfForm] = useState({
    nome: '',
    cargo: '',
    area: '',
    foto: '',
    bio: '',
    badge: '',
    especialidades: '',
    destaques: ''
  })

  const [modalMateriaAberto, setModalMateriaAberto] = useState(false)
  const [materiaForm, setMateriaForm] = useState({
    nome: '',
    categoria: 'Exatas',
    descricao: '',
    icone: 'calculator'
  })

  // Estados das avaliações reais e do carrossel com Fade-In e Fade-Out
  const [avaliacoes, setAvaliacoes] = useState(() => {
    try {
      const salvas = localStorage.getItem('accor_avaliacoes_reais')
      return salvas ? JSON.parse(salvas) : DEFAULT_AVALIACOES
    } catch {
      return DEFAULT_AVALIACOES
    }
  })
  const [indiceAvaliacao, setIndiceAvaliacao] = useState(0)
  const [motionBlurClasse, setMotionBlurClasse] = useState('fade-in')
  const [modalAvaliacaoAberta, setModalAvaliacaoAberta] = useState(false)
  const [erroAvaliacao, setErroAvaliacao] = useState('')
  const [hoverEstrelas, setHoverEstrelas] = useState(0)

  // Sessão de Identificação de E-mail para avaliar
  const [usuarioGoogle, setUsuarioGoogle] = useState(() => {
    try {
      const salvo = localStorage.getItem('accor_google_user')
      return salvo ? JSON.parse(salvo) : null
    } catch {
      return null
    }
  })
  const [modalLoginGoogleAberto, setModalLoginGoogleAberto] = useState(false)
  const [erroLoginGoogle, setErroLoginGoogle] = useState('')
  const [dadosLoginGoogle, setDadosLoginGoogle] = useState({
    email: '',
    nome: '',
    senha: ''
  })

  const [formNovaAvaliacao, setFormNovaAvaliacao] = useState(() => {
    try {
      const salvo = localStorage.getItem('accor_google_user')
      const user = salvo ? JSON.parse(salvo) : null
      return {
        nomeAutor: user?.nome || '',
        emailGoogle: user?.email || '',
        papel: '',
        disciplina: 'Matemática',
        estrelas: 0,
        comentario: '',
        resultado: ''
      }
    } catch {
      return {
        nomeAutor: '',
        emailGoogle: '',
        papel: '',
        disciplina: 'Matemática',
        estrelas: 0,
        comentario: '',
        resultado: ''
      }
    }
  })

  const contentRef = useRef(null)
  const navRef = useRef(null)
  const btnTopoRef = useRef(null)

  const voltarAoTopo = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Controle do Navbar e botão Voltar ao Topo 100% direto no DOM (0 re-renderizações do React)
  useEffect(() => {
    let ultimoScrollY = window.scrollY
    let ticking = false

    const aoRolar = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollAtual = window.scrollY
          const navEl = navRef.current
          const btnTopoEl = btnTopoRef.current

          if (navEl) {
            if (scrollAtual <= 60 || scrollAtual < ultimoScrollY - 12) {
              navEl.classList.remove('nav-hidden')
              navEl.classList.add('nav-visible')
            } else if (scrollAtual > ultimoScrollY + 12) {
              navEl.classList.remove('nav-visible')
              navEl.classList.add('nav-hidden')
            }
          }

          if (btnTopoEl) {
            if (scrollAtual > 280) {
              btnTopoEl.classList.add('visible')
            } else {
              btnTopoEl.classList.remove('visible')
            }
          }

          ultimoScrollY = scrollAtual
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', aoRolar, { passive: true })
    aoRolar()
    return () => window.removeEventListener('scroll', aoRolar)
  }, [telaAtual])

  const mostrarNavbar = () => {
    if (navRef.current) {
      navRef.current.classList.remove('nav-hidden')
      navRef.current.classList.add('nav-visible')
    }
  }

  const ocultarNavbarSeRolado = () => {
    if (window.scrollY > 80 && navRef.current) {
      navRef.current.classList.remove('nav-visible')
      navRef.current.classList.add('nav-hidden')
    }
  }

  // Animação de Fade-in e Fade-out contínua nos componentes ao rolar a tela para cima e para baixo
  useEffect(() => {
    if (telaAtual !== 'site') return

    const elementosReveal = document.querySelectorAll('.reveal-on-scroll')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
          } else {
            entry.target.classList.remove('is-revealed')
          }
        })
      },
      { threshold: 0.12, rootMargin: '-20px 0px -30px 0px' }
    )

    elementosReveal.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [telaAtual, professores.length, disciplinas.length])

  // Estado do formulário de agendamento / contato
  const [formData, setFormData] = useState({
    nomeResponsavel: '',
    nomeAluno: '',
    telefone: '',
    serieEscolar: '',
    disciplinaInteresse: 'Matemática',
    modalidade: 'Domicílio (Aldeia)',
    mensagem: ''
  })

  const [formStatus, setFormStatus] = useState({ tipo: '', mensagem: '' })
  const [enviando, setEnviando] = useState(false)
  const [telefoneExibicao, setTelefoneExibicao] = useState('(81) 9.9122-5450')

  // Formata automaticamente o telefone conforme o usuário digita (ex: (81) 99999-9999) — aceita apenas números
  const formatarTelefoneInput = (valor) => {
    const apenasDigitos = valor.replace(/\D/g, '').slice(0, 11)
    if (apenasDigitos.length === 0) return ''
    if (apenasDigitos.length <= 2) return `(${apenasDigitos}`
    if (apenasDigitos.length <= 7) return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2)}`
    return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7)}`
  }

  // Permite digitar apenas números inteiros (0-9)
  const formatarApenasNumeros = (valor, maxDigitos = 2) => {
    return valor.replace(/\D/g, '').slice(0, maxDigitos)
  }

  // Permite digitar apenas nota numérica (0 a 10, com ponto ou vírgula opcional, ex: 9.5 ou 10)
  const formatarNotaNumerica = (valor) => {
    let limpo = valor.replace(/[^0-9.,]/g, '')
    const partes = limpo.split(/[.,]/)
    if (partes.length > 2) {
      limpo = `${partes[0]}.${partes.slice(1).join('')}`
    }
    if (limpo.length > 4) {
      limpo = limpo.slice(0, 4)
    }
    const num = parseFloat(limpo.replace(',', '.'))
    if (!isNaN(num) && num > 10) {
      return '10'
    }
    return limpo
  }

  // Remove números de campos que devem conter apenas nomes/letras
  const formatarApenasLetras = (valor) => {
    return valor.replace(/[0-9]/g, '')
  }

  // Verifica se a resposta HTTP veio realmente em JSON da API (evita erro quando SPA fallback retorna index.html)
  const ehRespostaJson = (res) => {
    const tipo = res?.headers?.get('content-type') || ''
    return Boolean(res?.ok && tipo.includes('application/json'))
  }

  // Gera hash SHA-256 no navegador para autenticação segura de contingência sem expor senha em texto puro
  const gerarSha256Hex = async (texto) => {
    const bytes = new TextEncoder().encode(texto)
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes)
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  // Envia dados também para o Netlify Forms (quando hospedado na Netlify)
  const enviarParaNetlifyForms = (nomeFormulario, campos) => {
    try {
      const params = new URLSearchParams({ 'form-name': nomeFormulario, ...campos })
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      }).catch(() => {})
    } catch {
      // Ignora em ambiente local
    }
  }

  // Busca automaticamente o número de WhatsApp oficial cadastrado no backend (/api/info)
  useEffect(() => {
    fetch(`${API_BASE_URL}/info`)
      .then(res => ehRespostaJson(res) ? res.json() : null)
      .then(info => {
        if (info?.telefoneFormatado) {
          setTelefoneExibicao(info.telefoneFormatado)
        }
      })
      .catch(() => {})
  }, [])

  // Cores da faixa de lápis decorativa (inspirada na arte do flyer)
  const pencilColors = [
    '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', 
    '#3B82F6', '#8B5CF6', '#EC4899', '#E11D48', '#84CC16',
    '#14B8A6', '#6366F1', '#A855F7', '#D97706', '#059669'
  ]

  // Carrega as disciplinas cadastradas no backend (Spring Boot ou Netlify Function)
  useEffect(() => {
    fetch(`${API_BASE_URL}/disciplinas`)
      .then(res => {
        if (!ehRespostaJson(res)) throw new Error("Usando disciplinas locais")
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const cores = ['#2563EB', '#DC2626', '#9333EA', '#EA580C', '#0D9488', '#16A34A', '#D97706', '#0284C7']
          const dadosComCores = data.map((d, index) => ({
            ...d,
            cor: d.cor || cores[index % cores.length]
          }))
          setDisciplinas(dadosComCores)
          localStorage.setItem('accor_disciplinas_local', JSON.stringify(dadosComCores))
        }
      })
      .catch(() => {})
  }, [])

  // Monta os cabeçalhos autenticados do Administrador com o token seguro da sessão
  const obterHeadersAdmin = (comJson = false) => {
    const headers = {}
    if (comJson) {
      headers['Content-Type'] = 'application/json'
    }
    const token = localStorage.getItem('accor_admin_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  // Função para carregar contatos salvos no banco (Spring Boot, Netlify Function ou armazenamento local)
  const carregarSolicitacoes = () => {
    setCarregandoAdmin(true)
    fetch(`${API_BASE_URL}/contatos`, { headers: obterHeadersAdmin() })
      .then(res => {
        if (res.status === 401) {
          handleLogout()
          throw new Error('Sessão expirada')
        }
        if (!ehRespostaJson(res)) throw new Error('Fallback local')
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setSolicitacoes(data)
          localStorage.setItem('accor_solicitacoes_local', JSON.stringify(data))
        }
        setCarregandoAdmin(false)
      })
      .catch(() => {
        try {
          const locais = JSON.parse(localStorage.getItem('accor_solicitacoes_local') || '[]')
          setSolicitacoes(Array.isArray(locais) ? locais : [])
        } catch {
          setSolicitacoes([])
        }
        setCarregandoAdmin(false)
      })
  }

  // Carrega os professores do backend (Spring Boot, Netlify Function ou armazenamento local)
  const carregarProfessores = () => {
    fetch(`${API_BASE_URL}/professores`)
      .then(res => {
        if (!ehRespostaJson(res)) throw new Error("Fallback local")
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProfessores(data)
          localStorage.setItem('accor_professores_local', JSON.stringify(data))
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    carregarProfessores()
  }, [])

  // Autenticação do Administrador (Spring Boot, Netlify Functions ou Hash SHA-256 em preview estático)
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginErro('')

    const u = loginCredenciais.username.trim().toLowerCase()
    const p = loginCredenciais.password.trim()

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      })

      if (ehRespostaJson(res)) {
        const data = await res.json()
        if (data?.token) {
          localStorage.setItem('accor_admin_token', data.token)
        }
        localStorage.setItem('accor_admin_auth', 'true')
        setAdminAutenticado(true)
        setLoginCredenciais({ username: '', password: '' })
        carregarProfessores()
        carregarSolicitacoes()
        carregarAvaliacoesDoBanco()
        return
      }

      if (res.status === 401) {
        setLoginErro('Usuário ou senha incorretos.')
        return
      }
    } catch {
      // Continua para validação criptográfica SHA-256 em preview estático da Netlify
    }

    // Validação criptográfica via SHA-256 quando em preview estático (sem expor a senha no código)
    const hashDigitado = await gerarSha256Hex(`${u}:${p}`)
    const hashesValidos = [
      '678e651c3ea6e638047227171ad9faced6a2666fca406fc354c554b4b19bc907',
      '1d419009a5251774b0a1874612162c70b23342f9917f84382338f7316a25da0e'
    ]

    if (hashesValidos.includes(hashDigitado)) {
      localStorage.setItem('accor_admin_token', `accor-admin-${hashDigitado.slice(0, 16)}`)
      localStorage.setItem('accor_admin_auth', 'true')
      setAdminAutenticado(true)
      setLoginCredenciais({ username: '', password: '' })
      carregarProfessores()
      carregarSolicitacoes()
      carregarAvaliacoesDoBanco()
    } else {
      setLoginErro('Usuário ou senha incorretos.')
    }
  }

  const handleLogout = () => {
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: obterHeadersAdmin()
    }).catch(() => {})
    localStorage.removeItem('accor_admin_token')
    localStorage.removeItem('accor_admin_auth')
    setAdminAutenticado(false)
    setTelaAtual('site')
  }

  // Gerenciamento de Professores no Admin
  const abrirModalNovoProf = () => {
    setEditandoProfId(null)
    setProfForm({
      nome: '',
      cargo: '',
      area: '',
      foto: '',
      bio: '',
      badge: '',
      especialidades: '',
      destaques: ''
    })
    setModalProfAberto(true)
  }

  const abrirModalEditarProf = (prof) => {
    setEditandoProfId(prof.id)
    setProfForm({
      nome: prof.nome || '',
      cargo: prof.cargo || '',
      area: prof.area || '',
      foto: prof.foto || '',
      bio: prof.bio || '',
      badge: prof.badge || '',
      especialidades: prof.especialidades || '',
      destaques: prof.destaques || ''
    })
    setModalProfAberto(true)
  }

  const salvarProfessor = async (e) => {
    e.preventDefault()
    let novaListaProfs = professores
    try {
      const url = editandoProfId 
        ? `${API_BASE_URL}/professores/${editandoProfId}` 
        : `${API_BASE_URL}/professores`
      const method = editandoProfId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: obterHeadersAdmin(true),
        body: JSON.stringify(profForm)
      })

      if (res.status === 401) {
        handleLogout()
        return
      }

      if (ehRespostaJson(res)) {
        const salvo = await res.json()
        novaListaProfs = editandoProfId
          ? professores.map(p => p.id === editandoProfId ? salvo : p)
          : [...professores, salvo]
      } else {
        throw new Error("Salvar localmente")
      }
    } catch {
      const idLocal = editandoProfId || (professores.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1)
      novaListaProfs = editandoProfId
        ? professores.map(p => p.id === editandoProfId ? { ...p, ...profForm } : p)
        : [...professores, { id: idLocal, ...profForm }]
    }
    setProfessores(novaListaProfs)
    localStorage.setItem('accor_professores_local', JSON.stringify(novaListaProfs))
    setModalProfAberto(false)
  }

  const excluirProfessor = async (id) => {
    if (!window.confirm("Deseja realmente excluir este professor?")) return
    try {
      const res = await fetch(`${API_BASE_URL}/professores/${id}`, {
        method: 'DELETE',
        headers: obterHeadersAdmin()
      })
      if (res.status === 401) {
        handleLogout()
        return
      }
    } catch (err) {
      console.log(err)
    }
    const atualizados = professores.filter(p => p.id !== id)
    setProfessores(atualizados)
    localStorage.setItem('accor_professores_local', JSON.stringify(atualizados))
  }

  // Gerenciamento de Disciplinas no Admin
  const salvarMateria = async (e) => {
    e.preventDefault()
    let novaListaDisc = disciplinas
    try {
      const res = await fetch(`${API_BASE_URL}/disciplinas`, {
        method: 'POST',
        headers: obterHeadersAdmin(true),
        body: JSON.stringify(materiaForm)
      })
      if (res.status === 401) {
        handleLogout()
        return
      }
      if (ehRespostaJson(res)) {
        const salva = await res.json()
        novaListaDisc = [...disciplinas, salva]
      } else {
        throw new Error("Salvar localmente")
      }
    } catch {
      const idLocal = disciplinas.reduce((m, d) => Math.max(m, Number(d.id) || 0), 0) + 1
      novaListaDisc = [...disciplinas, { id: idLocal, ...materiaForm }]
    }
    setDisciplinas(novaListaDisc)
    localStorage.setItem('accor_disciplinas_local', JSON.stringify(novaListaDisc))
    setModalMateriaAberto(false)
    setMateriaForm({ nome: '', categoria: 'Exatas', descricao: '', icone: 'calculator' })
  }

  const excluirMateria = async (id) => {
    if (!window.confirm("Deseja realmente remover esta disciplina?")) return
    try {
      const res = await fetch(`${API_BASE_URL}/disciplinas/${id}`, {
        method: 'DELETE',
        headers: obterHeadersAdmin()
      })
      if (res.status === 401) {
        handleLogout()
        return
      }
    } catch (err) {
      console.log(err)
    }
    const atualizadas = disciplinas.filter(d => d.id !== id)
    setDisciplinas(atualizadas)
    localStorage.setItem('accor_disciplinas_local', JSON.stringify(atualizadas))
  }

  // Exclui uma avaliação do banco SQLite e atualiza a lista e a média imediatamente
  const excluirAvaliacaoAdmin = async (avAlvo, idxAlvo) => {
    if (!window.confirm("Deseja realmente apagar esta avaliação?")) return
    const atualizadas = avaliacoes.filter((av, idx) =>
      avAlvo?.id ? av.id !== avAlvo.id : idx !== idxAlvo
    )
    setAvaliacoes(atualizadas)
    setIndiceAvaliacao(0)
    localStorage.setItem('accor_avaliacoes_reais', JSON.stringify(atualizadas))

    try {
      if (avAlvo?.id) {
        const res = await fetch(`${API_BASE_URL}/avaliacoes/${avAlvo.id}`, {
          method: 'DELETE',
          headers: obterHeadersAdmin()
        })
        if (res.status === 401) {
          handleLogout()
          return
        }
      }
      await carregarAvaliacoesDoBanco()
    } catch (err) {
      console.log(err)
    }
  }

  const excluirTodasAvaliacoesAdmin = async () => {
    if (!window.confirm("Deseja apagar TODAS as avaliações do banco de dados?")) return
    setAvaliacoes([])
    setIndiceAvaliacao(0)
    localStorage.setItem('accor_avaliacoes_reais', JSON.stringify([]))
    try {
      const res = await fetch(`${API_BASE_URL}/avaliacoes`, {
        method: 'DELETE',
        headers: obterHeadersAdmin()
      })
      if (res.status === 401) {
        handleLogout()
        return
      }
      await carregarAvaliacoesDoBanco()
    } catch (err) {
      console.log(err)
    }
  }

  const excluirSolicitacaoAdmin = async (id) => {
    if (!window.confirm("Deseja realmente apagar esta solicitação?")) return
    const atualizadas = solicitacoes.filter((item) => item.id !== id)
    setSolicitacoes(atualizadas)
    localStorage.setItem('accor_solicitacoes_local', JSON.stringify(atualizadas))
    try {
      if (id) {
        const res = await fetch(`${API_BASE_URL}/contatos/${id}`, {
          method: 'DELETE',
          headers: obterHeadersAdmin()
        })
        if (res.status === 401) {
          handleLogout()
          return
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const excluirTodasSolicitacoesAdmin = async () => {
    if (!window.confirm("Deseja apagar TODAS as solicitações do banco de dados?")) return
    setSolicitacoes([])
    localStorage.setItem('accor_solicitacoes_local', JSON.stringify([]))
    try {
      const res = await fetch(`${API_BASE_URL}/contatos`, {
        method: 'DELETE',
        headers: obterHeadersAdmin()
      })
      if (res.status === 401) {
        handleLogout()
        return
      }
    } catch (err) {
      console.log(err)
    }
  }

  // Valida se o e-mail informado possui formato válido
  const validarEmailGoogle = (email) => {
    if (!email) return false
    const limpo = email.trim().toLowerCase()
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(limpo)
  }

  // Mascara parcialmente o e-mail Google para exibição pública segura no card (ex: bi***@gmail.com)
  const mascararEmailGoogle = (email) => {
    if (!email || !email.includes('@')) return ''
    const [usuario, dominio] = email.trim().toLowerCase().split('@')
    if (usuario.length <= 2) return `${usuario[0] || '*'}***@${dominio}`
    return `${usuario.slice(0, 2)}***@${dominio}`
  }

  // Rótulos de estrelas no padrão Google Avaliações
  const obterRotuloEstrelasGoogle = (qtd) => {
    switch (Number(qtd)) {
      case 1: return '1 estrela — Ruim'
      case 2: return '2 estrelas — Regular'
      case 3: return '3 estrelas — Bom'
      case 4: return '4 estrelas — Muito bom'
      case 5: return '5 estrelas — Excelente!'
      default: return 'Passe o mouse e clique nas estrelas para dar sua nota (1 a 5)'
    }
  }

  // Renderiza 5 estrelas com preenchimento proporcional (estilo Google: ex. 4.5 preenche 4 inteiras e metade da 5ª)
  const renderizarEstrelasGoogle = (notaMedia, tamanho = 18) => {
    const nota = Math.max(0, Math.min(5, Number(notaMedia) || 0))
    return [1, 2, 3, 4, 5].map((estrelaNum) => {
      const percentual = Math.max(0, Math.min(1, nota - (estrelaNum - 1))) * 100
      return (
        <span
          key={estrelaNum}
          className="google-star-wrapper"
          style={{ width: `${tamanho}px`, height: `${tamanho}px` }}
        >
          <Star size={tamanho} fill="#E2E8F0" color="#CBD5E1" className="google-star-bg" />
          <span className="google-star-fill" style={{ width: `${percentual}%` }}>
            <Star size={tamanho} fill="#F59E0B" color="#F59E0B" />
          </span>
        </span>
      )
    })
  }

  // Busca todas as avaliações reais gravadas no banco (Spring Boot ou Netlify Blobs) e atualiza o estado
  const carregarAvaliacoesDoBanco = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/avaliacoes`, { headers: obterHeadersAdmin() })
      if (!ehRespostaJson(res)) throw new Error("Fallback local")
      const data = await res.json()
      if (Array.isArray(data)) {
        const apenasReais = data.filter(av => av.emailGoogle && av.emailGoogle.includes('@'))
        setAvaliacoes(apenasReais)
        localStorage.setItem('accor_avaliacoes_reais', JSON.stringify(apenasReais))
        return apenasReais
      }
    } catch {
      // Mantém as avaliações reais salvas localmente caso o backend esteja offline
    }
    return null
  }

  // Carrega apenas as avaliações reais salvas no backend Spring Boot + SQLite ao iniciar
  useEffect(() => {
    carregarAvaliacoesDoBanco()
  }, [])

  // Calcula a média exata de todas as avaliações cadastradas no banco
  const mediaAvaliacoesNumero = avaliacoes.length > 0
    ? avaliacoes.reduce((soma, item) => soma + (Number(item.estrelas) || 0), 0) / avaliacoes.length
    : 0

  // Função para transição de avaliação com Fade-Out da atual e Fade-In da próxima (ou índice específico)
  const mudarSlideAvaliacao = (direcao, indiceAlvo = null) => {
    if (avaliacoes.length <= 1) return
    setMotionBlurClasse('fade-out')

    setTimeout(() => {
      if (indiceAlvo !== null) {
        setIndiceAvaliacao(indiceAlvo)
      } else if (direcao === 'next') {
        setIndiceAvaliacao((prev) => (prev + 1) % avaliacoes.length)
      } else {
        setIndiceAvaliacao((prev) => (prev - 1 + avaliacoes.length) % avaliacoes.length)
      }
      setMotionBlurClasse('fade-in')
    }, 200)
  }

  // Abre o pop-up para informar o e-mail de identificação da avaliação
  const iniciarLoginGoogle = () => {
    setErroAvaliacao('')
    setErroLoginGoogle('')
    setDadosLoginGoogle({ email: usuarioGoogle?.email || formNovaAvaliacao.emailGoogle || '', nome: '', senha: '' })
    setModalLoginGoogleAberto(true)
  }

  // Confirma o e-mail informado no pop-up e vincula ao formulário de avaliação
  const avancarEtapaEmailGoogle = (e) => {
    e.preventDefault()
    setErroLoginGoogle('')
    const emailDigitado = dadosLoginGoogle.email.trim().toLowerCase()
    if (!validarEmailGoogle(emailDigitado)) {
      setErroLoginGoogle('Digite um endereço de e-mail válido (ex: seuemail@dominio.com).')
      return
    }
    const contaAutenticada = {
      nome: formNovaAvaliacao.nomeAutor.trim() || emailDigitado.split('@')[0],
      email: emailDigitado,
      foto: ''
    }
    setUsuarioGoogle(contaAutenticada)
    localStorage.setItem('accor_google_user', JSON.stringify(contaAutenticada))
    setFormNovaAvaliacao((prev) => ({
      ...prev,
      emailGoogle: contaAutenticada.email
    }))
    setModalLoginGoogleAberto(false)
  }

  const desconectarContaGoogle = () => {
    setUsuarioGoogle(null)
    localStorage.removeItem('accor_google_user')
    setFormNovaAvaliacao((prev) => ({ ...prev, emailGoogle: '' }))
  }

  // Envio de nova avaliação real de pais/alunos exigindo identificação por e-mail e nota em estrelas
  const handleNovaAvaliacaoSubmit = async (e) => {
    e.preventDefault()
    setErroAvaliacao('')

    const emailContaLogada = (usuarioGoogle?.email || formNovaAvaliacao.emailGoogle || '').trim().toLowerCase()
    if (!usuarioGoogle || !validarEmailGoogle(emailContaLogada)) {
      setErroAvaliacao('Por favor, informe um e-mail válido antes de publicar sua avaliação.')
      return
    }

    const estrelasEscolhidas = Number(formNovaAvaliacao.estrelas)
    if (!estrelasEscolhidas || estrelasEscolhidas < 1 || estrelasEscolhidas > 5) {
      setErroAvaliacao('Por favor, clique nas estrelas para selecionar uma nota de 1 a 5 estrelas.')
      return
    }

    const payloadAvaliacao = {
      ...formNovaAvaliacao,
      nomeAutor: formNovaAvaliacao.nomeAutor.trim() || usuarioGoogle.nome,
      estrelas: estrelasEscolhidas,
      emailGoogle: emailContaLogada
    }

    enviarParaNetlifyForms('avaliacao-reforco', payloadAvaliacao)

    let novaLista = []
    try {
      const res = await fetch(`${API_BASE_URL}/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadAvaliacao)
      })
      if (ehRespostaJson(res)) {
        const criada = await res.json()
        const listaDoBanco = await carregarAvaliacoesDoBanco()
        if (listaDoBanco) {
          novaLista = listaDoBanco
        } else {
          const avaliacaoSalva = { ...criada, emailGoogle: criada.emailGoogle || emailContaLogada }
          novaLista = [avaliacaoSalva, ...avaliacoes]
        }
      } else {
        const idLocal = avaliacoes.reduce((m, a) => Math.max(m, Number(a.id) || 0), 0) + 1
        novaLista = [{ id: idLocal, ...payloadAvaliacao }, ...avaliacoes]
      }
    } catch {
      const idLocal = avaliacoes.reduce((m, a) => Math.max(m, Number(a.id) || 0), 0) + 1
      novaLista = [{ id: idLocal, ...payloadAvaliacao }, ...avaliacoes]
    }

    setAvaliacoes(novaLista)
    localStorage.setItem('accor_avaliacoes_reais', JSON.stringify(novaLista))
    setIndiceAvaliacao(0)
    setMotionBlurClasse('fade-in')
    setModalAvaliacaoAberta(false)
    setHoverEstrelas(0)
    setFormNovaAvaliacao({
      nomeAutor: usuarioGoogle?.nome || '',
      emailGoogle: usuarioGoogle?.email || '',
      papel: '',
      disciplina: 'Matemática',
      estrelas: 0,
      comentario: '',
      resultado: ''
    })
  }

  // Mapeador de ícones para cada disciplina
  const renderIconeDisciplina = (nome) => {
    switch (nome?.toLowerCase()) {
      case 'matemática': return <Calculator size={26} />
      case 'português': return <BookOpen size={26} />
      case 'inglês': return <Languages size={26} />
      case 'física': return <Zap size={26} />
      case 'química': return <FlaskConical size={26} />
      case 'biologia': return <Dna size={26} />
      case 'história': return <Landmark size={26} />
      case 'geografia': return <Globe size={26} />
      case 'computação & lógica':
      case 'lógica de programação':
      case 'computação': return <Code size={26} />
      default: return <Sparkles size={26} />
    }
  }

  // Gera o link do WhatsApp enviando todas as solicitações para +55 81 99122-5450
  const gerarUrlWhatsApp = (dados) => {
    const numeroDestino = '5581991225450'
    const temDadosPreenchidos = dados.nomeResponsavel || dados.nomeAluno || dados.telefone || dados.serieEscolar || dados.mensagem

    if (!temDadosPreenchidos) {
      return `https://wa.me/${numeroDestino}?text=Ol%C3%A1!%20Vi%20a%20apresenta%C3%A7%C3%A3o%20do%20refor%C3%A7o%20escolar%20ACCOR%20e%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es.`
    }

    const linhas = [
      "Olá! Gostaria de solicitar informações sobre o *ACCOR Reforço Escolar*:",
      "",
      `👤 *Responsável:* ${dados.nomeResponsavel || 'Não informado'}`,
      `🎓 *Aluno(a):* ${dados.nomeAluno || 'Não informado'}`,
      `📱 *Telefone/WhatsApp:* ${dados.telefone || 'Não informado'}`,
      `📚 *Série/Ano:* ${dados.serieEscolar || 'Não informada'}`,
      `📖 *Disciplina de Interesse:* ${dados.disciplinaInteresse || 'Matemática'}`,
      `📍 *Modalidade:* ${dados.modalidade || 'Domicílio (Aldeia)'}`
    ]

    if (dados.mensagem && dados.mensagem.trim() !== '') {
      linhas.push(`💬 *Mensagem:* ${dados.mensagem.trim()}`)
    }

    return `https://wa.me/${numeroDestino}?text=${encodeURIComponent(linhas.join('\n'))}`
  }

  // Envio do formulário com persistência no SQLite via Spring Boot + Redirecionamento para +55 81 99122-5450
  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setFormStatus({ tipo: '', mensagem: '' })

    const urlWhatsAppComDados = gerarUrlWhatsApp(formData)

    // Abre o WhatsApp enviando a solicitação para +55 81 99122-5450
    window.open(urlWhatsAppComDados, '_blank', 'noopener,noreferrer')

    // Envia para o Netlify Forms (quando hospedado na Netlify)
    enviarParaNetlifyForms('solicitacao-reforco', formData)

    try {
      const response = await fetch(`${API_BASE_URL}/contatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (ehRespostaJson(response)) {
        const salvo = await response.json()
        const atualizadas = [salvo, ...solicitacoes]
        setSolicitacoes(atualizadas)
        localStorage.setItem('accor_solicitacoes_local', JSON.stringify(atualizadas))
        setFormStatus({
          tipo: 'success',
          mensagem: '✅ Solicitação enviada com sucesso! Os dados foram salvos e encaminhados para o WhatsApp +55 81 99122-5450.'
        })
      } else {
        throw new Error("Fallback local")
      }
    } catch {
      const idLocal = solicitacoes.reduce((m, s) => Math.max(m, Number(s.id) || 0), 0) + 1
      const novoLocal = { id: idLocal, status: 'NOVO', ...formData }
      const atualizadas = [novoLocal, ...solicitacoes]
      setSolicitacoes(atualizadas)
      localStorage.setItem('accor_solicitacoes_local', JSON.stringify(atualizadas))
      setFormStatus({
        tipo: 'success',
        mensagem: '✅ Solicitação registrada! Abrimos o WhatsApp (+55 81 99122-5450) com todos os dados preenchidos para envio.'
      })
    } finally {
      setFormData({
        nomeResponsavel: '',
        nomeAluno: '',
        telefone: '',
        serieEscolar: '',
        disciplinaInteresse: 'Matemática',
        modalidade: 'Domicílio (Aldeia)',
        mensagem: ''
      })
      setEnviando(false)
    }
  }

  const disciplinasFiltradas = filtroCategoria === 'TODAS' 
    ? disciplinas 
    : disciplinas.filter(d => d.categoria.toUpperCase().includes(filtroCategoria))

  const whatsappLink = "https://wa.me/5581991225450?text=Ol%C3%A1!%20Vi%20a%20apresenta%C3%A7%C3%A3o%20do%20refor%C3%A7o%20escolar%20ACCOR%20e%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es."
  const whatsappFormLink = gerarUrlWhatsApp(formData)

  // Se o usuário navegou para a Área do Administrador
  if (telaAtual === 'admin') {
    if (!adminAutenticado) {
      return (
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <div className="login-lock-icon-wrap">
              <Lock size={32} />
            </div>
            <h2 className="admin-login-title">Área do Administrador</h2>
            <p className="admin-login-subtitle">Acesso restrito para gestão do reforço escolar ACCOR</p>

            {loginErro && (
              <div className="form-status-alert error" style={{ marginBottom: '1rem', textAlign: 'left' }}>
                {loginErro}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label>Usuário</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Digite seu login" 
                  value={loginCredenciais.username}
                  onChange={(e) => setLoginCredenciais({ ...loginCredenciais, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left' }}>
                <label>Senha</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={loginCredenciais.password}
                  onChange={(e) => setLoginCredenciais({ ...loginCredenciais, password: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-submit-form" style={{ width: '100%', marginTop: '0.8rem' }}>
                <Lock size={16} /> Entrar no Painel Admin
              </button>
            </form>

            <button 
              type="button" 
              className="btn-voltar-login" 
              onClick={() => {
                setTelaAtual('site')
                setLoginErro('')
              }}
            >
              <ArrowLeft size={16} /> Voltar para o Site Público
            </button>
          </div>
        </div>
      )
    }

    // Tela do Dashboard Admin Completo
    return (
      <div className="admin-screen-container">
        {/* Topbar Admin */}
        <header className="admin-navbar">
          <div className="admin-nav-brand">
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>✏️ ACCOR REFORÇO</span>
            <span className="admin-badge-logged">PAINEL ADMINISTRATIVO</span>
          </div>

          <div className="admin-nav-actions">
            <button 
              className="btn-admin-site-return" 
              onClick={() => setTelaAtual('site')}
              title="Voltar ao site público"
            >
              <ArrowLeft size={16} /> Ver Site
            </button>
            <button 
              className="btn-admin-logout" 
              onClick={handleLogout}
              title="Encerrar sessão de admin"
            >
              <LogOut size={16} /> Sair
            </button>
          </div>
        </header>

        {/* Corpo Principal Admin */}
        <main className="admin-main-container">
          <div className="admin-tabs-nav">
            <button 
              className={`admin-tab-btn ${adminTab === 'professores' ? 'active' : ''}`}
              onClick={() => setAdminTab('professores')}
            >
              <User size={18} />
              <span>Professores ({professores.length})</span>
            </button>

            <button 
              className={`admin-tab-btn ${adminTab === 'disciplinas' ? 'active' : ''}`}
              onClick={() => setAdminTab('disciplinas')}
            >
              <BookOpen size={18} />
              <span>Matérias & Disciplinas ({disciplinas.length})</span>
            </button>

            <button 
              className={`admin-tab-btn ${adminTab === 'solicitacoes' ? 'active' : ''}`}
              onClick={() => {
                setAdminTab('solicitacoes')
                carregarSolicitacoes()
              }}
            >
              <Database size={18} />
              <span>Solicitações SQLite ({solicitacoes.length})</span>
            </button>

            <button 
              className={`admin-tab-btn ${adminTab === 'avaliacoes' ? 'active' : ''}`}
              onClick={() => {
                setAdminTab('avaliacoes')
                carregarAvaliacoesDoBanco()
              }}
            >
              <Star size={18} />
              <span>Avaliações ({avaliacoes.length})</span>
            </button>
          </div>

          {/* TAB 1: GESTÃO DE PROFESSORES */}
          {adminTab === 'professores' && (
            <div className="admin-card-panel">
              <div className="admin-section-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0F172A' }}>Corpo Docente Cadastrado</h3>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>
                    Adicione novos professores, edite suas fotos e funções, ou remova da equipe.
                  </p>
                </div>
                <button className="btn-admin-add" onClick={abrirModalNovoProf}>
                  <Plus size={18} />
                  <span>Novo Professor</span>
                </button>
              </div>

              <div className="admin-professores-list">
                {professores.map((prof) => (
                  <div key={prof.id} className="admin-prof-row-card">
                    <div className="admin-prof-row-top">
                      <div className="admin-prof-thumb">
                        {prof.foto ? (
                          <img src={prof.foto} alt={prof.nome} />
                        ) : (
                          <span>👨‍🏫</span>
                        )}
                      </div>
                      <div className="admin-prof-details">
                        <h4>{prof.nome}</h4>
                        <p><strong>Função:</strong> {prof.cargo}</p>
                        <p><strong>Área:</strong> {prof.area || 'Geral'}</p>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.4' }}>
                      {prof.bio ? (prof.bio.length > 110 ? prof.bio.substring(0, 110) + '...' : prof.bio) : 'Sem bio cadastrada'}
                    </div>

                    <div className="admin-prof-actions">
                      <button 
                        className="btn-admin-edit"
                        onClick={() => abrirModalEditarProf(prof)}
                      >
                        <Edit size={15} /> Editar Função & Foto
                      </button>
                      <button 
                        className="btn-admin-del"
                        onClick={() => excluirProfessor(prof.id)}
                      >
                        <Trash2 size={15} /> Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: GESTÃO DE DISCIPLINAS */}
          {adminTab === 'disciplinas' && (
            <div className="admin-card-panel">
              <div className="admin-section-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0F172A' }}>Disciplinas e Matérias</h3>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>
                    Gerencie a grade curricular e matérias oferecidas aos estudantes.
                  </p>
                </div>
                <button className="btn-admin-add" onClick={() => setModalMateriaAberto(true)}>
                  <Plus size={18} />
                  <span>Nova Matéria</span>
                </button>
              </div>

              <div className="admin-materias-grid">
                {disciplinas.map((disc) => (
                  <div key={disc.id || disc.nome} className="admin-materia-item">
                    <div className="admin-materia-info">
                      <h5>{disc.nome}</h5>
                      <span>{disc.categoria}</span>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                        {disc.descricao}
                      </p>
                    </div>
                    <button 
                      className="btn-admin-del"
                      style={{ flex: 'initial', padding: '0.4rem 0.6rem' }}
                      onClick={() => excluirMateria(disc.id)}
                      title="Excluir Matéria"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SOLICITAÇÕES SQLITE */}
          {adminTab === 'solicitacoes' && (
            <div className="admin-card-panel">
              <div className="admin-section-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0F172A' }}>Contatos Salvos no SQLite</h3>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>
                    Leads e pedidos de aula enviados através do formulário do site.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn-admin-add" 
                    style={{ background: '#2563EB' }}
                    onClick={carregarSolicitacoes}
                  >
                    <Database size={16} />
                    <span>Atualizar Registros</span>
                  </button>
                  {solicitacoes.length > 0 && (
                    <button 
                      className="btn-admin-del" 
                      style={{ flex: 'initial', padding: '0.55rem 0.95rem' }}
                      onClick={excluirTodasSolicitacoesAdmin}
                    >
                      <Trash2 size={16} />
                      <span>Limpar Todas ({solicitacoes.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {solicitacoes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                  <Database size={44} style={{ opacity: 0.4, marginBottom: '0.8rem' }} />
                  <p>Nenhuma solicitação gravada ainda ou banco de dados iniciando.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {solicitacoes.map((item) => (
                    <div key={item.id} className="solicitacao-item">
                      <div className="solicitacao-header">
                        <span className="solicitacao-nome">
                          <User size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                          {item.nomeResponsavel} {item.nomeAluno ? `(Aluno: ${item.nomeAluno})` : ''}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <a
                            href={gerarUrlWhatsApp(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-header-whatsapp"
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                            title={`Enviar mensagem para ${item.telefone}`}
                          >
                            <MessageCircle size={14} />
                            <span>Enviar no WhatsApp ({item.telefone})</span>
                          </a>
                          <span className="solicitacao-status">{item.status || 'NOVO'}</span>
                          <button
                            type="button"
                            className="btn-admin-del"
                            style={{ flex: 'initial', padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                            onClick={() => excluirSolicitacaoAdmin(item.id)}
                            title="Apagar solicitação"
                          >
                            <Trash2 size={14} />
                            <span>Apagar</span>
                          </button>
                        </div>
                      </div>
                      <div className="solicitacao-details">
                        <div><strong>Telefone:</strong> {item.telefone}</div>
                        <div><strong>Disciplina:</strong> {item.disciplinaInteresse || 'Geral'}</div>
                        <div><strong>Série:</strong> {item.serieEscolar || 'Não informada'}</div>
                        <div><strong>Modalidade:</strong> {item.modalidade || 'Aldeia'}</div>
                      </div>
                      {item.mensagem && (
                        <div className="solicitacao-msg">
                          "{item.mensagem}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GESTÃO DE AVALIAÇÕES */}
          {adminTab === 'avaliacoes' && (
            <div className="admin-card-panel">
              <div className="admin-section-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0F172A' }}>Avaliações Publicadas no Site</h3>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>
                    {avaliacoes.length > 0
                      ? `Média atual: ${mediaAvaliacoesNumero.toFixed(1)} estrelas (${avaliacoes.length} ${avaliacoes.length === 1 ? 'avaliação cadastrada' : 'avaliações cadastradas'})`
                      : 'Visualize e apague avaliações enviadas pelos usuários no site.'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn-admin-add" 
                    style={{ background: '#2563EB' }}
                    onClick={carregarAvaliacoesDoBanco}
                  >
                    <Database size={16} />
                    <span>Atualizar Avaliações</span>
                  </button>
                  {avaliacoes.length > 0 && (
                    <button 
                      className="btn-admin-del" 
                      style={{ flex: 'initial', padding: '0.55rem 0.95rem' }}
                      onClick={excluirTodasAvaliacoesAdmin}
                    >
                      <Trash2 size={16} />
                      <span>Apagar Todas ({avaliacoes.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {avaliacoes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                  <Star size={44} style={{ opacity: 0.35, marginBottom: '0.8rem' }} />
                  <p>Nenhuma avaliação cadastrada no momento.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {avaliacoes.map((av, idx) => (
                    <div key={av.id || `${av.emailGoogle}-${idx}`} className="solicitacao-item">
                      <div className="solicitacao-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <span className="solicitacao-nome">
                            <User size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            {av.nomeAutor}
                          </span>
                          <span className="solicitacao-status" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            ⭐ {Number(av.estrelas || 5).toFixed(1)}
                          </span>
                        </div>

                        <button 
                          className="btn-admin-del"
                          style={{ flex: 'initial', padding: '0.45rem 0.85rem' }}
                          onClick={() => excluirAvaliacaoAdmin(av, idx)}
                          title="Apagar esta avaliação"
                        >
                          <Trash2 size={15} />
                          <span>Apagar Avaliação</span>
                        </button>
                      </div>

                      <div className="solicitacao-details">
                        <div><strong>E-mail:</strong> {av.emailGoogle || 'Não informado'}</div>
                        <div><strong>Relação / Série:</strong> {av.papel || 'Não informado'}</div>
                        <div><strong>Disciplina:</strong> {av.disciplina || 'Geral'}</div>
                        <div><strong>Nota Conquistada:</strong> {av.resultado || 'Não informada'}</div>
                      </div>

                      {av.comentario && (
                        <div className="solicitacao-msg">
                          "{av.comentario}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Modal de Professor (Criar ou Editar) */}
        {modalProfAberto && (
          <div className="modal-overlay" onClick={() => setModalProfAberto(false)}>
            <div className="modal-review-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
              <div className="modal-header" style={{ background: 'transparent', padding: '0 0 1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={20} color="#EA580C" />
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
                    {editandoProfId ? "Editar Professor" : "Cadastrar Novo Professor"}
                  </h3>
                </div>
                <button onClick={() => setModalProfAberto(false)} style={{ background: 'transparent', padding: '0.3rem' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={salvarProfessor}>
                <div className="form-group">
                  <label>Nome do Professor *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Professora Alessandra"
                    value={profForm.nome}
                    onChange={(e) => setProfForm({ ...profForm, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Função / Cargo *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Linguagens & Ensino Fundamental 2"
                      value={profForm.cargo}
                      onChange={(e) => setProfForm({ ...profForm, cargo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Área de Atuação</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Linguagens, Exatas, Computação"
                      value={profForm.area}
                      onChange={(e) => setProfForm({ ...profForm, area: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Foto (Caminho ou URL)</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: /professora.jpg ou https://..."
                      value={profForm.foto}
                      onChange={(e) => setProfForm({ ...profForm, foto: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Selo / Destaque</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Especialista UFPE"
                      value={profForm.badge}
                      onChange={(e) => setProfForm({ ...profForm, badge: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Especialidades (separadas por vírgula)</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Português, Redação, Fund. 2"
                    value={profForm.especialidades}
                    onChange={(e) => setProfForm({ ...profForm, especialidades: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Pontos Fortes / Destaques (separados por vírgula)</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Acompanhamento de todas as matérias, Aulas 1:1"
                    value={profForm.destaques}
                    onChange={(e) => setProfForm({ ...profForm, destaques: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Biografia Pedagógica</label>
                  <textarea 
                    className="form-textarea"
                    rows="3"
                    placeholder="Descrição da metodologia, formação e experiência..."
                    value={profForm.bio}
                    onChange={(e) => setProfForm({ ...profForm, bio: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-submit-form" style={{ width: '100%', marginTop: '0.8rem' }}>
                  <CheckCircle2 size={18} />
                  <span>{editandoProfId ? "Salvar Alterações do Professor" : "Cadastrar Professor"}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Nova Matéria / Disciplina */}
        {modalMateriaAberto && (
          <div className="modal-overlay" onClick={() => setModalMateriaAberto(false)}>
            <div className="modal-review-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div className="modal-header" style={{ background: 'transparent', padding: '0 0 1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={20} color="#EA580C" />
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Adicionar Disciplina</h3>
                </div>
                <button onClick={() => setModalMateriaAberto(false)} style={{ background: 'transparent', padding: '0.3rem' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={salvarMateria}>
                <div className="form-group">
                  <label>Nome da Disciplina *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Robótica Educacional"
                    value={materiaForm.nome}
                    onChange={(e) => setMateriaForm({ ...materiaForm, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoria</label>
                  <select 
                    className="form-select"
                    value={materiaForm.categoria}
                    onChange={(e) => setMateriaForm({ ...materiaForm, categoria: e.target.value })}
                  >
                    <option value="Exatas">Exatas</option>
                    <option value="Linguagens">Linguagens</option>
                    <option value="Humanas">Humanas</option>
                    <option value="Biológicas">Biológicas</option>
                    <option value="Tecnologia">Tecnologia</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Descrição Breve</label>
                  <textarea 
                    className="form-textarea"
                    rows="2"
                    placeholder="Ex: Introdução à programação em blocos e lógica..."
                    value={materiaForm.descricao}
                    onChange={(e) => setMateriaForm({ ...materiaForm, descricao: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-submit-form" style={{ width: '100%', marginTop: '0.8rem' }}>
                  <Plus size={18} />
                  <span>Salvar Disciplina</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="app-container">
      {/* Camada de fundo isolada na GPU com a moldura de lápis otimizada (sem repaints na rolagem) */}
      <div className="bg-fixed-gpu" aria-hidden="true" />

      {/* Sensor invisível no topo da janela: quando o mouse passa no topo, faz o navbar reaparecer */}
      <div 
        className="nav-hover-trigger"
        onMouseEnter={mostrarNavbar}
      />

      {/* Cabeçalho inteligente: recolhe ao rolar para baixo e reaparece no topo ou hover */}
      <div 
        ref={navRef}
        className="header-sticky-wrapper nav-visible"
        onMouseEnter={mostrarNavbar}
        onMouseLeave={ocultarNavbarSeRolado}
      >
        {/* Faixa Superior com Lápis de Cor Coloridos (Identidade da Arte) */}
        <div className="pencil-strip">
          {pencilColors.map((cor, i) => (
            <div key={i} className="pencil-segment" style={{ backgroundColor: cor }} />
          ))}
        </div>

        {/* Header */}
        <header className="site-header">
          <div className="header-content">
            <div className="brand-badge-group">
              <span className="brand-logo-text">
                ✏️ ACCOR
              </span>
              <span className="brand-sub">REFORÇO ESCOLAR</span>
            </div>

            <nav className="header-nav">
              <a href="#professores" className="header-nav-link">Professores</a>
              <a href="#disciplinas" className="header-nav-link">Disciplinas</a>
              <a href="#metodologia" className="header-nav-link">Diferenciais</a>
              <a href="#avaliacoes" className="header-nav-link">Avaliações</a>
              <a href="#contato" className="header-nav-link">Agendamento</a>
            </nav>

            <div className="header-actions">
              <button 
                className="btn-header-admin" 
                onClick={() => setTelaAtual('admin')}
                title="Acessar Área Administrativa (Login & Senha)"
              >
                <Lock size={15} />
                <span>Área Admin</span>
              </button>

              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-header-whatsapp"
              >
                <MessageCircle size={18} />
                <span>(81) 9.9122-5450</span>
              </a>
            </div>
          </div>
        </header>
      </div>

      {/* Conteúdo da Página com Efeito de Motion Blur em 60+ FPS via GPU (Sem re-renderizações) */}
      <main ref={contentRef} className="scroll-motion-blur-content">
        {/* Hero Section com o Design Baseado na Imagem Oficial */}
      <section className="hero-section reveal-on-scroll">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-info-tags">
              <span className="tag-location">
                <MapPin size={16} />
                Atendimento em domicílio | Aldeia
              </span>
              <span className="tag-ufpe">
                <GraduationCap size={16} />
                Professores especializados pela UFPE
              </span>
            </div>

            <h1 className="hero-title">
              ACCOR <span className="highlight">REFORÇO</span> ESCOLAR
            </h1>
            <p className="hero-subtitle-reforco">Educação com afeto, dedicação e metodologia ativa</p>

            <div className="hero-tagline-box">
              <p className="hero-tagline-main">“Um método feito sob medida para você!”</p>
              <p className="hero-tagline-sub">✨ Aulas individuais, evolução visível.</p>
            </div>

            <div className="hero-cta-group">
              <a href="#contato" className="btn-primary-action">
                <Calendar size={18} />
                Agendar Aulas
              </a>
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-whatsapp-action"
              >
                <MessageCircle size={18} />
                Falar pelo WhatsApp
              </a>
            </div>

            <div className="phone-quick-call">
              <Phone size={18} color="#16A34A" />
              <span>(81) 9.9122-5450</span>
            </div>
          </div>

          {/* Destaque da Arte Original com Moldura */}
          <div className="poster-showcase-container">
            <div className="poster-frame">
              <div className="poster-badge-original">
                <Sparkles size={14} /> Cartaz Oficial
              </div>
              <img 
                src="/accor-poster.jpg" 
                alt="ACCOR Reforço Escolar - Arte Oficial" 
                className="poster-img"
                decoding="async"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Apresentação dos Professores */}
      <section id="professores" className="section-wrapper">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">Corpo Docente Especializado UFPE</span>
          <h2 className="section-title">Nossos Professores</h2>
          <p className="section-desc">
            Aulas individuais no domicílio em Aldeia com profissionais dedicados a cada área do conhecimento.
          </p>
        </div>

        {/* Grade com os Professores da Equipe ACCOR - Dinâmico integrado ao SQLite/Admin */}
        <div className="professores-grid">
          {professores.map((prof, index) => {
            const cores = ['#DC2626', '#2563EB', '#0D9488', '#EA580C', '#7C3AED']
            const cor = cores[index % cores.length]
            const destaquesArray = prof.destaques ? (Array.isArray(prof.destaques) ? prof.destaques : prof.destaques.split(',')) : []
            const specsArray = prof.especialidades ? (Array.isArray(prof.especialidades) ? prof.especialidades : prof.especialidades.split(',')) : []

            return (
              <div key={prof.id || prof.nome} className="professor-card-item reveal-on-scroll">
                <div className="prof-top-bar" style={{ backgroundColor: cor }} />
                <div className="prof-header-box">
                  <div className="prof-avatar-wrap" style={{ background: prof.foto ? 'transparent' : `${cor}15`, color: cor }}>
                    {prof.foto ? (
                      <img 
                        src={prof.foto} 
                        alt={prof.nome} 
                        decoding="async"
                        loading="lazy"
                      />
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        {prof.area?.toLowerCase().includes('exatas') ? (
                          <Calculator size={52} color={cor} />
                        ) : prof.area?.toLowerCase().includes('computação') || prof.area?.toLowerCase().includes('lógica') ? (
                          <Code size={52} color={cor} />
                        ) : (
                          <GraduationCap size={52} color={cor} />
                        )}
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, marginTop: '4px', color: cor }}>
                          {prof.area?.toUpperCase() || "DOCENTE"}
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="prof-badge-tag" style={{ backgroundColor: `${cor}20`, color: cor }}>
                    <Sparkles size={14} /> {prof.badge || "Especialista UFPE"}
                  </span>
                  <h3 className="prof-name-title">{prof.nome}</h3>
                  <p className="prof-role-subtitle">{prof.cargo}</p>

                  {specsArray.length > 0 && (
                    <div className="prof-specialties-tags">
                      {specsArray.map((spec, sIdx) => (
                        <span key={sIdx} className="prof-spec-pill">
                          {spec.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="prof-body-box">
                  <p className="prof-bio-text">
                    {prof.bio}
                  </p>

                  {destaquesArray.length > 0 && (
                    <ul className="prof-features-list">
                      {destaquesArray.map((item, dIdx) => (
                        <li key={dIdx}>
                          <CheckCircle2 size={16} color="#16A34A" /> {item.trim()}
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Sem botões nos cards: conforme solicitado, o único contato é o do final da página */}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Seção das Disciplinas Oferecidas */}
      <section id="disciplinas" className="section-wrapper">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">Aulas Personalizadas</span>
          <h2 className="section-title">Disciplinas Atendidas</h2>
          <p className="section-desc">
            Acompanhamento individualizado para Ensino Fundamental e Médio, focado no ritmo de cada estudante.
          </p>
        </div>

        {/* Grade de Disciplinas */}
        <div className="disciplinas-grid">
          {disciplinasFiltradas.map((disc) => (
            <div 
              key={disc.id || disc.nome} 
              className="disciplina-card reveal-on-scroll"
            >
              <div className="card-top-bar" style={{ backgroundColor: disc.cor || '#2563EB' }} />
              <div 
                className="disciplina-icon-wrap" 
                style={{ 
                  backgroundColor: `${disc.cor || '#2563EB'}15`, 
                  color: disc.cor || '#2563EB' 
                }}
              >
                {renderIconeDisciplina(disc.nome)}
              </div>
              <span className="disciplina-category" style={{ color: disc.cor || '#2563EB' }}>
                {disc.categoria}
              </span>
              <h3 className="disciplina-title">{disc.nome}</h3>
              <p className="disciplina-text">{disc.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção Como Funciona / Metodologia */}
      <section id="metodologia" className="section-wrapper">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">Diferenciais</span>
          <h2 className="section-title">Por que escolher o ACCOR?</h2>
          <p className="section-desc">
            O reforço escolar em Aldeia com metodologia aprovada e corpo docente graduado pela UFPE.
          </p>
        </div>

        <div className="methodology-grid">
          <div className="method-card reveal-on-scroll">
            <div className="method-number">01</div>
            <h3>Atendimento em Domicílio</h3>
            <p>Conforto e segurança para os alunos em Aldeia, sem necessidade de deslocamento no trânsito.</p>
          </div>
          <div className="method-card reveal-on-scroll">
            <div className="method-number">02</div>
            <h3>Aulas 100% Individuais</h3>
            <p>Atenção total voltada às dúvidas específicas do aluno, eliminando lacunas de aprendizagem.</p>
          </div>
          <div className="method-card reveal-on-scroll">
            <div className="method-number">03</div>
            <h3>Formação pela UFPE</h3>
            <p>Professores qualificados com base acadêmica sólida e técnicas pedagógicas atualizadas.</p>
          </div>
          <div className="method-card reveal-on-scroll">
            <div className="method-number">04</div>
            <h3>Evolução Visível</h3>
            <p>Acompanhamento de tarefas, simulados e preparação para provas com relatórios de progresso.</p>
          </div>
        </div>
      </section>

      {/* Seção de Avaliações Reais com Efeito de Fade-In e Fade-Out */}
      <section id="avaliacoes" className="section-wrapper">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">Depoimentos Reais • E-mail Verificado</span>
          <h2 className="section-title">O que dizem os Pais e Alunos</h2>
          <p className="section-desc">
            Espaço aberto para avaliações reais de famílias e estudantes atendidos pelo ACCOR em Aldeia.
          </p>
        </div>

        <div className="avaliacoes-container reveal-on-scroll">
          {/* Barra de Média Dinâmica do Banco de Dados e Ação de Avaliar */}
          <div className="avaliacoes-header-bar">
            <div className="avaliacoes-score-box">
              {avaliacoes.length > 0 && (
                <div className="score-number">
                  {mediaAvaliacoesNumero.toFixed(1)}
                </div>
              )}
              <div className="score-stars-group">
                <div className="stars-row google-stars-bar">
                  {renderizarEstrelasGoogle(mediaAvaliacoesNumero, 20)}
                </div>
                <span className="score-subtext">
                  {avaliacoes.length > 0
                    ? `Média de ${mediaAvaliacoesNumero.toFixed(1)} estrelas (${avaliacoes.length} ${avaliacoes.length === 1 ? 'avaliação no banco' : 'avaliações no banco'})`
                    : 'Aguardando avaliações para calcular a média de estrelas'}
                </span>
              </div>
            </div>

            <button 
              className="btn-nova-avaliacao"
              onClick={() => {
                setErroAvaliacao('')
                setHoverEstrelas(0)
                setModalAvaliacaoAberta(true)
              }}
            >
              <Sparkles size={16} />
              <span>Deixar uma Avaliação</span>
            </button>
          </div>

          {/* Carrossel com Tamanho Uniforme e Efeito de Fade-In / Fade-Out */}
          <div className="carousel-viewport">
            {avaliacoes.length > 0 ? (
              <div className={`avaliacao-card-spotlight ${motionBlurClasse}`}>
                <Quote size={42} className="avaliacao-quote-icon" />

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <div className="google-verified-badge">
                    <ShieldCheck size={14} />
                    <span>E-mail Verificado ({mascararEmailGoogle(avaliacoes[indiceAvaliacao]?.emailGoogle)})</span>
                  </div>

                  {avaliacoes[indiceAvaliacao]?.resultado && (
                    <div className="resultado-destaque-badge" style={{ marginBottom: 0 }}>
                      <CheckCircle2 size={14} />
                      <span>
                        {/^[0-9.,]+$/.test(String(avaliacoes[indiceAvaliacao].resultado).trim())
                          ? `Nota conquistada: ${avaliacoes[indiceAvaliacao].resultado}`
                          : avaliacoes[indiceAvaliacao].resultado}
                      </span>
                    </div>
                  )}
                </div>

                <div className="stars-row" style={{ marginBottom: '0.6rem', alignItems: 'center', gap: '0.35rem' }}>
                  {renderizarEstrelasGoogle(avaliacoes[indiceAvaliacao]?.estrelas || 5, 17)}
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#B45309', marginLeft: '0.25rem' }}>
                    ({Number(avaliacoes[indiceAvaliacao]?.estrelas || 5).toFixed(1)})
                  </span>
                </div>

                <p className="avaliacao-depoimento-texto">
                  "{avaliacoes[indiceAvaliacao]?.comentario}"
                </p>

                <div className="avaliacao-autor-footer">
                  <div className="avaliacao-autor-info">
                    <div className="autor-avatar-circle">
                      {avaliacoes[indiceAvaliacao]?.nomeAutor?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <span className="autor-nome">{avaliacoes[indiceAvaliacao]?.nomeAutor}</span>
                      <span className="autor-detalhes">{avaliacoes[indiceAvaliacao]?.papel}</span>
                    </div>
                  </div>

                  <span className="avaliacao-disciplina-tag">
                    📚 {avaliacoes[indiceAvaliacao]?.disciplina}
                  </span>
                </div>
              </div>
            ) : (
              <div className="avaliacao-card-spotlight avaliacao-empty-card fade-in">
                <Quote size={42} className="avaliacao-quote-icon" />
                <div className="google-verified-badge" style={{ margin: '0 auto 0.8rem' }}>
                  <ShieldCheck size={15} />
                  <span>Validação por E-mail</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#1E293B', textAlign: 'center', marginBottom: '0.5rem' }}>
                  Seja o primeiro a deixar sua avaliação real!
                </h3>
                <p className="avaliacao-depoimento-texto" style={{ textAlign: 'center', justifyContent: 'center', fontStyle: 'normal', fontSize: '1rem', marginBottom: '1.2rem' }}>
                  Nossas avaliações são 100% reais, publicadas por pais, responsáveis e alunos com e-mail verificado. Compartilhe sua experiência com o reforço escolar ACCOR!
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn-nova-avaliacao"
                    onClick={() => {
                      setErroAvaliacao('')
                      setModalAvaliacaoAberta(true)
                    }}
                  >
                    <Sparkles size={16} />
                    <span>Publicar Avaliação</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controles de Navegação (exibidos quando há avaliações) */}
          {avaliacoes.length > 0 && (
            <div className="carousel-navigation-row">
              <button 
                className="btn-carousel-ctrl" 
                onClick={() => mudarSlideAvaliacao('prev')}
                title="Avaliação anterior"
              >
                <ChevronLeft size={22} />
              </button>

              {avaliacoes.length <= 12 ? (
                <div className="carousel-dots-list">
                  {avaliacoes.map((_, idx) => (
                    <button
                      key={idx}
                      className={`carousel-dot ${idx === indiceAvaliacao ? 'active' : ''}`}
                      onClick={() => {
                        if (idx !== indiceAvaliacao) {
                          const direcao = idx > indiceAvaliacao ? 'next' : 'prev'
                          mudarSlideAvaliacao(direcao, idx)
                        }
                      }}
                      title={`Ir para avaliação ${idx + 1}`}
                    />
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748B', padding: '0 0.5rem' }}>
                  {indiceAvaliacao + 1} / {avaliacoes.length}
                </span>
              )}

              <button 
                className="btn-carousel-ctrl" 
                onClick={() => mudarSlideAvaliacao('next')}
                title="Próxima avaliação"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Seção de Contato e Formulário Integrado com Spring Boot + SQLite */}
      <section id="contato" className="section-wrapper reveal-on-scroll">
        <div className="contact-container">
          <div className="form-info-col">
            <span className="section-tag">Agende uma conversa</span>
            <h3>Solicite uma aula ou tire suas dúvidas</h3>
            <p>
              Preencha o formulário para registrar sua solicitação no sistema ou fale direto no WhatsApp da professora.
            </p>

            <ul className="perks-list">
              <li><CheckCircle2 color="#16A34A" size={20} /> Atendimento domiciliar em Aldeia e região</li>
              <li><CheckCircle2 color="#16A34A" size={20} /> Horários flexíveis de segunda a sábado</li>
              <li><CheckCircle2 color="#16A34A" size={20} /> Planos especiais mensais ou aulas pontuais</li>
              <li><ShieldCheck color="#2563EB" size={20} /> Backend Spring Boot com banco SQLite ativo</li>
            </ul>

            <div className="whatsapp-box-direct">
              <div>
                <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>WhatsApp Direto</span>
                <div className="phone">{telefoneExibicao}</div>
              </div>
              <a 
                href={whatsappFormLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-header-whatsapp"
              >
                Conversar Agora
              </a>
            </div>
          </div>

          {/* Formulário de Contato / Inscrição */}
          <div className="form-col">
            {formStatus.mensagem && (
              <div className={`form-status-alert ${formStatus.tipo}`}>
                {formStatus.mensagem}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome do Responsável *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Maria Clara"
                  value={formData.nomeResponsavel}
                  onChange={(e) => setFormData({ ...formData, nomeResponsavel: formatarApenasLetras(e.target.value) })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nome do Aluno</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Pedro Henrique"
                    value={formData.nomeAluno}
                    onChange={(e) => setFormData({ ...formData, nomeAluno: formatarApenasLetras(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp / Telefone *</label>
                  <input 
                    type="tel" 
                    inputMode="numeric"
                    className="form-input" 
                    placeholder="(81) 9XXXX-XXXX"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: formatarTelefoneInput(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Série / Ano Escolar</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    className="form-input" 
                    placeholder="Ex: 8 (para 8º ano)"
                    value={formData.serieEscolar}
                    onChange={(e) => setFormData({ ...formData, serieEscolar: formatarApenasNumeros(e.target.value, 2) })}
                  />
                </div>
                <div className="form-group">
                  <label>Disciplina de Maior Interesse</label>
                  <select 
                    className="form-select"
                    value={formData.disciplinaInteresse}
                    onChange={(e) => setFormData({ ...formData, disciplinaInteresse: e.target.value })}
                  >
                    {disciplinas.map(d => (
                      <option key={d.id || d.nome} value={d.nome}>{d.nome}</option>
                    ))}
                    <option value="Outra / Pacote Completo">Outra / Pacote Completo</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Modalidade Preferida</label>
                <select 
                  className="form-select"
                  value={formData.modalidade}
                  onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                >
                  <option value="Domicílio (Aldeia)">Domicílio (Aldeia)</option>
                  <option value="Online">Online</option>
                  <option value="A Combinar">A Combinar</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mensagem ou Dúvida (Opcional)</label>
                <textarea 
                  className="form-textarea" 
                  rows="3"
                  placeholder="Conte um pouco sobre as principais necessidades do estudante..."
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-submit-form"
                disabled={enviando}
              >
                <Send size={18} />
                {enviando ? "Gravando no Banco SQLite..." : "Enviar Solicitação de Reforço"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Botão Flutuante de WhatsApp */}
      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="floating-whatsapp"
        title="Falar com ACCOR no WhatsApp"
      >
        <MessageCircle size={24} />
        <span>WhatsApp</span>
      </a>

      {/* Modal para visualizar as solicitações salvas no banco SQLite */}
      {modalAdminAberto && (
        <div className="modal-overlay" onClick={() => setModalAdminAberto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={22} color="#2563EB" />
                <h3 style={{ margin: 0 }}>Registros no Banco SQLite (ACCOR)</h3>
              </div>
              <button 
                onClick={() => setModalAdminAberto(false)}
                style={{ background: 'transparent', padding: '0.3rem' }}
              >
                <X size={22} />
              </button>
            </div>
            <div className="modal-body">
              {carregandoAdmin ? (
                <p>Consultando banco de dados SQLite...</p>
              ) : solicitacoes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                  <Database size={40} style={{ opacity: 0.4, marginBottom: '0.8rem' }} />
                  <p>Nenhuma solicitação gravada ainda ou backend ainda não iniciado.</p>
                  <p style={{ fontSize: '0.85rem' }}>Ao enviar pelo formulário acima, os dados serão salvos em <code>accor.db</code>.</p>
                </div>
              ) : (
                solicitacoes.map((item) => (
                  <div key={item.id} className="solicitacao-item">
                    <div className="solicitacao-header">
                      <span className="solicitacao-nome">
                        <User size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        {item.nomeResponsavel} {item.nomeAluno ? `(Aluno: ${item.nomeAluno})` : ''}
                      </span>
                      <span className="solicitacao-status">{item.status || 'NOVO'}</span>
                    </div>
                    <div className="solicitacao-details">
                      <div><strong>Telefone:</strong> {item.telefone}</div>
                      <div><strong>Disciplina:</strong> {item.disciplinaInteresse || 'Geral'}</div>
                      <div><strong>Série:</strong> {item.serieEscolar || 'Não informada'}</div>
                      <div><strong>Modalidade:</strong> {item.modalidade || 'Aldeia'}</div>
                    </div>
                    {item.mensagem && (
                      <div className="solicitacao-msg">
                        "{item.mensagem}"
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para Deixar Avaliação Real com E-mail do Google */}
      {modalAvaliacaoAberta && (
        <div className="modal-overlay" onClick={() => setModalAvaliacaoAberta(false)}>
          <div className="modal-review-content fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'transparent', padding: '0 0 1rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="#EA580C" />
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Avaliar o Reforço Escolar</h3>
              </div>
              <button 
                onClick={() => setModalAvaliacaoAberta(false)}
                style={{ background: 'transparent', padding: '0.3rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {erroAvaliacao && (
              <div className="form-status-alert error" style={{ marginBottom: '1rem', fontSize: '0.88rem' }}>
                {erroAvaliacao}
              </div>
            )}

            <form onSubmit={handleNovaAvaliacaoSubmit}>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <span>E-mail para Identificação *</span>
                  <span className="google-email-tag">Obrigatório</span>
                </label>

                {!usuarioGoogle ? (
                  <div className="google-login-box">
                    <button
                      type="button"
                      className="btn-google-oauth"
                      onClick={iniciarLoginGoogle}
                    >
                      <ShieldCheck size={20} color="#2563EB" />
                      <span>Informar E-mail para Avaliar</span>
                    </button>
                    <small style={{ color: '#64748B', fontSize: '0.78rem', display: 'block', marginTop: '0.45rem', textAlign: 'center' }}>
                      🔒 Informe seu e-mail no pop-up para validar e liberar sua avaliação.
                    </small>
                  </div>
                ) : (
                  <div className="google-connected-card">
                    <div className="google-connected-info">
                      <div className="google-avatar-badge">
                        <span>{(usuarioGoogle.email || 'E').charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="google-connected-name">
                          E-mail Identificado
                          <span className="google-connected-pill">✓ Verificado</span>
                        </div>
                        <div className="google-connected-email">{usuarioGoogle.email}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-google-switch"
                      onClick={desconectarContaGoogle}
                    >
                      Trocar e-mail
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Seu Nome *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Vanessa Guimarães"
                  value={formNovaAvaliacao.nomeAutor}
                  onChange={(e) => setFormNovaAvaliacao({ ...formNovaAvaliacao, nomeAutor: formatarApenasLetras(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Relação com o Aluno / Série *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Mãe do Arthur (7º ano) • Aldeia"
                  value={formNovaAvaliacao.papel}
                  onChange={(e) => setFormNovaAvaliacao({ ...formNovaAvaliacao, papel: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Disciplina *</label>
                  <select 
                    className="form-select"
                    value={formNovaAvaliacao.disciplina}
                    onChange={(e) => setFormNovaAvaliacao({ ...formNovaAvaliacao, disciplina: e.target.value })}
                    required
                  >
                    {disciplinas.map((d) => (
                      <option key={d.id || d.nome} value={d.nome}>
                        {d.nome}
                      </option>
                    ))}
                    <option value="Pacote Completo (Todas as Matérias)">Pacote Completo (Todas as Matérias)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nota Conquistada</label>
                  <input 
                    type="text" 
                    inputMode="decimal"
                    className="form-input" 
                    placeholder="Ex: 9.5"
                    value={formNovaAvaliacao.resultado}
                    onChange={(e) => setFormNovaAvaliacao({ ...formNovaAvaliacao, resultado: formatarNotaNumerica(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Avaliação (Estrelas) *</span>
                  {(hoverEstrelas || formNovaAvaliacao.estrelas) > 0 && (
                    <span className="google-star-score-pill">
                      ⭐ {(hoverEstrelas || formNovaAvaliacao.estrelas)}.0 / 5.0
                    </span>
                  )}
                </label>
                <div
                  className="star-rating-select google-interactive-stars"
                  onMouseLeave={() => setHoverEstrelas(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const ativa = star <= (hoverEstrelas || formNovaAvaliacao.estrelas)
                    return (
                      <button
                        type="button"
                        key={star}
                        className={`star-btn-select ${ativa ? 'filled' : ''}`}
                        onMouseEnter={() => setHoverEstrelas(star)}
                        onFocus={() => setHoverEstrelas(star)}
                        onBlur={() => setHoverEstrelas(0)}
                        onClick={() => {
                          setErroAvaliacao('')
                          setFormNovaAvaliacao({ ...formNovaAvaliacao, estrelas: star })
                        }}
                        title={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                      >
                        <Star
                          size={30}
                          fill={ativa ? '#FBBC04' : 'transparent'}
                          color={ativa ? '#F59E0B' : '#CBD5E1'}
                        />
                      </button>
                    )
                  })}
                </div>
                <div className="google-star-label-hint">
                  {obterRotuloEstrelasGoogle(hoverEstrelas || formNovaAvaliacao.estrelas)}
                </div>
              </div>

              <div className="form-group">
                <label>Seu Depoimento *</label>
                <textarea 
                  className="form-textarea" 
                  rows="3"
                  placeholder="Conte como foi a evolução e a experiência com as aulas..."
                  value={formNovaAvaliacao.comentario}
                  onChange={(e) => setFormNovaAvaliacao({ ...formNovaAvaliacao, comentario: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-submit-form">
                <Send size={18} />
                <span>Publicar Avaliação</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pop-up para Informar o E-mail (Sem vínculo com o Google) */}
      {modalLoginGoogleAberto && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setModalLoginGoogleAberto(false)}>
          <div className="google-signin-dialog fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="google-signin-header-bar">
              <ShieldCheck size={18} color="#2563EB" />
              <span>Identificação por E-mail</span>
              <button
                type="button"
                onClick={() => setModalLoginGoogleAberto(false)}
                style={{ marginLeft: 'auto', background: 'transparent', padding: '0.2rem', color: '#5F6368' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="google-signin-body">
              <form onSubmit={avancarEtapaEmailGoogle}>
                <h4 className="google-signin-title">Informe seu E-mail</h4>
                <p className="google-signin-sub">Validação rápida para avaliar o <strong>ACCOR Reforço Escolar</strong></p>

                {erroLoginGoogle && (
                  <div className="google-signin-error">{erroLoginGoogle}</div>
                )}

                <div className="google-field-group">
                  <label>Seu E-mail *</label>
                  <input
                    type="email"
                    className="google-input"
                    placeholder="seuemail@exemplo.com"
                    value={dadosLoginGoogle.email}
                    onChange={(e) => setDadosLoginGoogle({ ...dadosLoginGoogle, email: e.target.value })}
                    autoFocus
                    required
                  />
                </div>

                <p className="google-privacy-note">
                  🔒 Seu e-mail é usado apenas para validar que a avaliação é real e aparece mascarado no site.
                </p>

                <div className="google-signin-actions">
                  <button
                    type="button"
                    className="btn-google-link"
                    onClick={() => setModalLoginGoogleAberto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-google-primary">
                    Confirmar E-mail
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">ACCOR REFORÇO ESCOLAR</div>
          <p>Atendimento em domicílio em Aldeia | Professores especializados pela UFPE</p>
          <p>WhatsApp: (81) 9.9122-5450</p>
          <div className="footer-copy">
            Desenvolvido com carinho para o projeto de reforço escolar • React.js + Spring Boot & SQLite
          </div>
        </div>
      </footer>

      {/* Botão Flutuante Voltar ao Topo */}
      <button
        ref={btnTopoRef}
        type="button"
        className="btn-back-to-top"
        onClick={voltarAoTopo}
        aria-label="Voltar ao topo da página"
        title="Voltar ao topo"
      >
        <ArrowUp size={20} strokeWidth={2.5} />
        <span>Topo</span>
      </button>
      </main>
    </div>
  )
}

export default App
