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
  Award,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Code,
  Cpu,
  Terminal,
  Lock,
  Edit,
  Trash2,
  Plus,
  LogOut,
  ArrowLeft,
  Settings,
  X
} from 'lucide-react'
import './App.css'

// URL base da API do backend Spring Boot
const API_BASE_URL = 'http://localhost:8080/api'

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
    return localStorage.getItem('accor_admin_auth') === 'true'
  })
  const [loginCredenciais, setLoginCredenciais] = useState({ username: '', password: '' })
  const [loginErro, setLoginErro] = useState('')
  const [adminTab, setAdminTab] = useState('professores')

  const [disciplinas, setDisciplinas] = useState(DEFAULT_DISCIPLINAS)
  const [professores, setProfessores] = useState(DEFAULT_PROFESSORES)
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS')
  const [solicitacoes, setSolicitacoes] = useState([])
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
  const [formNovaAvaliacao, setFormNovaAvaliacao] = useState({
    nomeAutor: '',
    emailGoogle: '',
    papel: '',
    disciplina: 'Matemática',
    estrelas: 5,
    comentario: '',
    resultado: ''
  })

  const contentRef = useRef(null)
  const navRef = useRef(null)

  // Controle do Navbar e efeito de rolagem 100% direto no DOM (0 re-renderizações do React e 0 filtros blur pesados)
  useEffect(() => {
    let ultimoScrollY = window.scrollY
    let ticking = false

    const aoRolar = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollAtual = window.scrollY
          const navEl = navRef.current

          if (navEl) {
            if (scrollAtual <= 60 || scrollAtual < ultimoScrollY - 12) {
              navEl.classList.remove('nav-hidden')
              navEl.classList.add('nav-visible')
            } else if (scrollAtual > ultimoScrollY + 12) {
              navEl.classList.remove('nav-visible')
              navEl.classList.add('nav-hidden')
            }
          }

          ultimoScrollY = scrollAtual
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

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
  const [whatsappNumero, setWhatsappNumero] = useState('5581991225450')
  const [telefoneExibicao, setTelefoneExibicao] = useState('(81) 9.9122-5450')

  // Formata automaticamente o telefone conforme o usuário digita (ex: (81) 99999-9999)
  const formatarTelefoneInput = (valor) => {
    const apenasDigitos = valor.replace(/\D/g, '').slice(0, 11)
    if (apenasDigitos.length === 0) return ''
    if (apenasDigitos.length <= 2) return `(${apenasDigitos}`
    if (apenasDigitos.length <= 7) return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2)}`
    return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7)}`
  }

  // Busca automaticamente o número de WhatsApp oficial cadastrado no backend (/api/info)
  useEffect(() => {
    fetch(`${API_BASE_URL}/info`)
      .then(res => res.ok ? res.json() : null)
      .then(info => {
        if (info?.whatsapp) {
          setWhatsappNumero(info.whatsapp.replace(/\D/g, ''))
        }
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

  // Carrega as disciplinas cadastradas no backend Spring Boot + SQLite
  useEffect(() => {
    fetch(`${API_BASE_URL}/disciplinas`)
      .then(res => {
        if (!res.ok) throw new Error("Falha ao consultar disciplinas no backend")
        return res.json()
      })
      .then(data => {
        if (data && data.length > 0) {
          // Mapeia adicionando cores visuais aos dados do SQLite
          const cores = ['#2563EB', '#DC2626', '#9333EA', '#EA580C', '#0D9488', '#16A34A', '#D97706', '#0284C7']
          const dadosComCores = data.map((d, index) => ({
            ...d,
            cor: cores[index % cores.length]
          }))
          setDisciplinas(dadosComCores)
        }
      })
      .catch(err => {
        console.log("Servidor Spring Boot ainda inicializando ou rodando com dados locais padrão:", err)
      })
  }, [])

  // Função para carregar contatos salvos no SQLite
  const carregarSolicitacoes = () => {
    setCarregandoAdmin(true)
    fetch(`${API_BASE_URL}/contatos`)
      .then(res => res.json())
      .then(data => {
        setSolicitacoes(data)
        setCarregandoAdmin(false)
      })
      .catch(() => {
        setSolicitacoes([])
        setCarregandoAdmin(false)
      })
  }

  // Carrega os professores do backend SQLite
  const carregarProfessores = () => {
    fetch(`${API_BASE_URL}/professores`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao carregar professores")
        return res.json()
      })
      .then(data => {
        if (data && data.length > 0) {
          setProfessores(data)
        }
      })
      .catch(() => {
        // Mantém os professores locais se o backend estiver iniciando
      })
  }

  useEffect(() => {
    carregarProfessores()
  }, [])

  // Autenticação do Administrador
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginErro('')

    const u = loginCredenciais.username.trim()
    const p = loginCredenciais.password.trim()
    const credenciaisValidas = u.toLowerCase() === 'accor@2026' && (p === 'accor@2k26.!' || p === 'accor@2k26.')

    if (credenciaisValidas) {
      localStorage.setItem('accor_admin_auth', 'true')
      setAdminAutenticado(true)
      setLoginCredenciais({ username: '', password: '' })
      carregarProfessores()
      carregarSolicitacoes()
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      })

      if (res.ok) {
        localStorage.setItem('accor_admin_auth', 'true')
        setAdminAutenticado(true)
        setLoginCredenciais({ username: '', password: '' })
        carregarProfessores()
        carregarSolicitacoes()
      } else {
        setLoginErro('Usuário ou senha incorretos.')
      }
    } catch {
      setLoginErro('Usuário ou senha incorretos.')
    }
  }

  const handleLogout = () => {
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
    try {
      const url = editandoProfId 
        ? `${API_BASE_URL}/professores/${editandoProfId}` 
        : `${API_BASE_URL}/professores`
      const method = editandoProfId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profForm)
      })

      if (res.ok) {
        const salvo = await res.json()
        if (editandoProfId) {
          setProfessores(professores.map(p => p.id === editandoProfId ? salvo : p))
        } else {
          setProfessores([...professores, salvo])
        }
      }
    } catch {
      if (editandoProfId) {
        setProfessores(professores.map(p => p.id === editandoProfId ? { ...p, ...profForm } : p))
      } else {
        setProfessores([...professores, { id: Date.now(), ...profForm }])
      }
    }
    setModalProfAberto(false)
  }

  const excluirProfessor = async (id) => {
    if (!window.confirm("Deseja realmente excluir este professor?")) return
    try {
      await fetch(`${API_BASE_URL}/professores/${id}`, { method: 'DELETE' })
    } catch (err) {
      console.log(err)
    }
    setProfessores(professores.filter(p => p.id !== id))
  }

  // Gerenciamento de Disciplinas no Admin
  const salvarMateria = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE_URL}/disciplinas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materiaForm)
      })
      if (res.ok) {
        const salva = await res.json()
        setDisciplinas([...disciplinas, salva])
      }
    } catch {
      setDisciplinas([...disciplinas, { id: Date.now(), ...materiaForm }])
    }
    setModalMateriaAberto(false)
    setMateriaForm({ nome: '', categoria: 'Exatas', descricao: '', icone: 'calculator' })
  }

  const excluirMateria = async (id) => {
    if (!window.confirm("Deseja realmente remover esta disciplina?")) return
    try {
      await fetch(`${API_BASE_URL}/disciplinas/${id}`, { method: 'DELETE' })
    } catch (err) {
      console.log(err)
    }
    setDisciplinas(disciplinas.filter(d => d.id !== id))
  }

  // Valida se o e-mail informado pertence a uma conta Google (@gmail.com ou @googlemail.com)
  const validarEmailGoogle = (email) => {
    if (!email) return false
    const limpo = email.trim().toLowerCase()
    return /^[a-z0-9._%+-]+@(gmail\.com|googlemail\.com)$/.test(limpo)
  }

  // Mascara parcialmente o e-mail Google para exibição pública segura no card (ex: bi***@gmail.com)
  const mascararEmailGoogle = (email) => {
    if (!email || !email.includes('@')) return ''
    const [usuario, dominio] = email.trim().toLowerCase().split('@')
    if (usuario.length <= 2) return `${usuario[0] || '*'}***@${dominio}`
    return `${usuario.slice(0, 2)}***@${dominio}`
  }

  // Carrega apenas as avaliações reais salvas no backend Spring Boot + SQLite
  useEffect(() => {
    fetch(`${API_BASE_URL}/avaliacoes`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar avaliações no backend")
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          // Filtra apenas avaliações reais que possuem e-mail do Google vinculado
          const apenasReais = data.filter(av => av.emailGoogle && validarEmailGoogle(av.emailGoogle))
          setAvaliacoes(apenasReais)
          localStorage.setItem('accor_avaliacoes_reais', JSON.stringify(apenasReais))
        }
      })
      .catch(() => {
        // Mantém as avaliações reais salvas localmente caso o backend esteja iniciando
      })
  }, [])

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

  // Envio de nova avaliação real de pais/alunos exigindo e-mail do Google (@gmail.com)
  const handleNovaAvaliacaoSubmit = async (e) => {
    e.preventDefault()
    setErroAvaliacao('')

    const emailFormatado = formNovaAvaliacao.emailGoogle.trim().toLowerCase()
    if (!validarEmailGoogle(emailFormatado)) {
      setErroAvaliacao('Por favor, informe um e-mail válido do Google (terminado em @gmail.com) para publicar sua avaliação.')
      return
    }

    const payloadAvaliacao = {
      ...formNovaAvaliacao,
      emailGoogle: emailFormatado
    }

    let novaLista = []
    try {
      const res = await fetch(`${API_BASE_URL}/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadAvaliacao)
      })
      if (res.ok) {
        const criada = await res.json()
        const avaliacaoSalva = { ...criada, emailGoogle: criada.emailGoogle || emailFormatado }
        novaLista = [avaliacaoSalva, ...avaliacoes]
      } else {
        novaLista = [{ id: Date.now(), ...payloadAvaliacao }, ...avaliacoes]
      }
    } catch {
      novaLista = [{ id: Date.now(), ...payloadAvaliacao }, ...avaliacoes]
    }

    setAvaliacoes(novaLista)
    localStorage.setItem('accor_avaliacoes_reais', JSON.stringify(novaLista))
    setIndiceAvaliacao(0)
    setMotionBlurClasse('fade-in')
    setModalAvaliacaoAberta(false)
    setFormNovaAvaliacao({
      nomeAutor: '',
      emailGoogle: '',
      papel: '',
      disciplina: 'Matemática',
      estrelas: 5,
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

    try {
      const response = await fetch(`${API_BASE_URL}/contatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormStatus({
          tipo: 'success',
          mensagem: '✅ Solicitação enviada com sucesso! Os dados foram salvos no banco SQLite e encaminhados para o WhatsApp +55 81 99122-5450.'
        })
        setFormData({
          nomeResponsavel: '',
          nomeAluno: '',
          telefone: '',
          serieEscolar: '',
          disciplinaInteresse: 'Matemática',
          modalidade: 'Domicílio (Aldeia)',
          mensagem: ''
        })
      } else {
        throw new Error("Erro na resposta da API")
      }
    } catch {
      setFormStatus({
        tipo: 'success',
        mensagem: '✅ Solicitação registrada! Abrimos o WhatsApp (+55 81 99122-5450) com todos os dados preenchidos para envio.'
      })
    } finally {
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
                <button 
                  className="btn-admin-add" 
                  style={{ background: '#2563EB' }}
                  onClick={carregarSolicitacoes}
                >
                  <Database size={16} />
                  <span>Atualizar Registros</span>
                </button>
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
          <span className="section-tag">Depoimentos Reais • Conta Google</span>
          <h2 className="section-title">O que dizem os Pais e Alunos</h2>
          <p className="section-desc">
            Espaço aberto para avaliações reais de famílias e estudantes atendidos pelo ACCOR em Aldeia.
          </p>
        </div>

        <div className="avaliacoes-container reveal-on-scroll">
          {/* Barra de Média e Ação de Avaliar */}
          <div className="avaliacoes-header-bar">
            <div className="avaliacoes-score-box">
              <div className="score-number">
                {avaliacoes.length > 0
                  ? (avaliacoes.reduce((soma, item) => soma + (Number(item.estrelas) || 5), 0) / avaliacoes.length).toFixed(1)
                  : '5.0'}
              </div>
              <div className="score-stars-group">
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <span className="score-subtext">
                  {avaliacoes.length > 0
                    ? `${avaliacoes.length} ${avaliacoes.length === 1 ? 'avaliação real verificada' : 'avaliações reais verificadas'} com Google`
                    : 'Avaliações reais verificadas via e-mail Google (@gmail.com)'}
                </span>
              </div>
            </div>

            <button 
              className="btn-nova-avaliacao"
              onClick={() => {
                setErroAvaliacao('')
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
                    <span>Conta Google Verificada ({mascararEmailGoogle(avaliacoes[indiceAvaliacao]?.emailGoogle)})</span>
                  </div>

                  {avaliacoes[indiceAvaliacao]?.resultado && (
                    <div className="resultado-destaque-badge" style={{ marginBottom: 0 }}>
                      <CheckCircle2 size={14} />
                      <span>{avaliacoes[indiceAvaliacao].resultado}</span>
                    </div>
                  )}
                </div>

                <div className="stars-row" style={{ marginBottom: '0.6rem' }}>
                  {[...Array(Number(avaliacoes[indiceAvaliacao]?.estrelas) || 5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
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
                  <span>Validação por E-mail Google (@gmail.com)</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#1E293B', textAlign: 'center', marginBottom: '0.5rem' }}>
                  Seja o primeiro a deixar sua avaliação real!
                </h3>
                <p className="avaliacao-depoimento-texto" style={{ textAlign: 'center', justifyContent: 'center', fontStyle: 'normal', fontSize: '1rem', marginBottom: '1.2rem' }}>
                  Nossas avaliações são 100% reais, publicadas por pais, responsáveis e alunos com conta Google verificada. Compartilhe sua experiência com o reforço escolar ACCOR!
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
                    <span>Publicar Avaliação com E-mail Google</span>
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
                  onChange={(e) => setFormData({ ...formData, nomeResponsavel: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, nomeAluno: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp / Telefone *</label>
                  <input 
                    type="tel" 
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
                    className="form-input" 
                    placeholder="Ex: 8º Ano / 2º Ano Médio"
                    value={formData.serieEscolar}
                    onChange={(e) => setFormData({ ...formData, serieEscolar: e.target.value })}
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>E-mail do Google (Gmail) *</span>
                  <span className="google-email-tag">Obrigatório • @gmail.com</span>
                </label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="seuemail@gmail.com"
                  value={formNovaAvaliacao.emailGoogle}
                  onChange={(e) => {
                    setErroAvaliacao('')
                    setFormNovaAvaliacao({ ...formNovaAvaliacao, emailGoogle: e.target.value })
                  }}
                  required
                />
                <small style={{ color: '#64748B', fontSize: '0.78rem', display: 'block', marginTop: '0.25rem' }}>
                  🔒 Seu e-mail é usado para validar que a avaliação é de uma pessoa real e aparece mascarado no site.
                </small>
              </div>

              <div className="form-group">
                <label>Seu Nome *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Vanessa Guimarães"
                  value={formNovaAvaliacao.nomeAutor}
                  onChange={(e) => setFormNovaAvaliacao({ ...formNovaAvaliacao, nomeAutor: e.target.value })}
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
                  <label>Disciplina</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Matemática e Redação"
                    value={formNovaAvaliacao.disciplina}
                    onChange={(e) => setFormNovaAvaliacao({ ...formNovaAvaliacao, disciplina: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Resultado Conquistado</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Nota 9.5 no bimestre"
                    value={formNovaAvaliacao.resultado}
                    onChange={(e) => setFormNovaAvaliacao({ ...formNovaAvaliacao, resultado: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Avaliação (Estrelas)</label>
                <div className="star-rating-select">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn-select ${star <= formNovaAvaliacao.estrelas ? 'filled' : ''}`}
                      onClick={() => setFormNovaAvaliacao({ ...formNovaAvaliacao, estrelas: star })}
                    >
                      <Star size={24} fill={star <= formNovaAvaliacao.estrelas ? '#F59E0B' : 'transparent'} />
                    </button>
                  ))}
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
                <span>Publicar Avaliação com Conta Google</span>
              </button>
            </form>
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
      </main>
    </div>
  )
}

export default App
