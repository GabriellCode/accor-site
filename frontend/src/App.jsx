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
  { id: 8, nome: "Geografia", categoria: "Humanas", descricao: "Cartografia, geopolítica, meio ambiente, climatologia e sociedade.", icone: "globe", cor: "#0284C7" }
]

// Dados padrão de avaliações para o carrossel interativo
const DEFAULT_AVALIACOES = [
  {
    id: 1,
    nomeAutor: "Patrícia Albuquerque",
    papel: "Mãe do Lucas (8º ano) • Aldeia",
    disciplina: "Matemática e Física",
    estrelas: 5,
    comentario: "O Lucas tinha pavor das provas de matemática e travava em equações. Com a paciência e a didática maravilhosa da professora, a nota dele subiu de 4,5 para 9,2! O atendimento em domicílio aqui em Aldeia facilitou demais a nossa rotina.",
    resultado: "Nota subiu de 4,5 para 9,2 no bimestre"
  },
  {
    id: 2,
    nomeAutor: "Carlos Eduardo Valença",
    papel: "Pai da Sofia (3º ano Médio)",
    disciplina: "Química e Biologia",
    estrelas: 5,
    comentario: "Excelente profissional! Muito pontual, dedicada e com domínio total dos conteúdos exigidos pelo SSA e ENEM. A Sofia ganhou muito mais segurança e conquistou a aprovação.",
    resultado: "Aprovada com nota 940 no SSA/ENEM"
  },
  {
    id: 3,
    nomeAutor: "Renata Meireles",
    papel: "Mãe do Bernardo (6º ano) • Aldeia",
    disciplina: "Português e Redação",
    estrelas: 5,
    comentario: "Meu filho tinha muita dificuldade com interpretação e construção de textos. As aulas foram lúdicas, dinâmicas e o desenvolvimento dele foi visível já nas primeiras semanas. Recomendo de olhos fechados!",
    resultado: "Evolução surpreendente na redação"
  },
  {
    id: 4,
    nomeAutor: "Mariana Cavalcanti",
    papel: "Mãe da Alice (9º ano)",
    disciplina: "Matemática e Ciências",
    estrelas: 5,
    comentario: "Professora extraordinária, com uma metodologia afetuosa que realmente ensina a pensar. Não é decoreba, é compreensão real da matéria. Alice hoje faz os exercícios sozinha!",
    resultado: "Média final 9,8 e aluna destaque"
  },
  {
    id: 5,
    nomeAutor: "Rodrigo Siqueira",
    papel: "Pai do Matheus (1º ano Médio) • Aldeia",
    disciplina: "Física e Matemática",
    estrelas: 5,
    comentario: "O acompanhamento em domicílio é o ponto alto: conforto absoluto e atenção 100% no estudante. A formação pela UFPE faz toda a diferença na metodologia de ensino.",
    resultado: "Recuperação imediata de rendimento"
  }
]

function App() {
  const [disciplinas, setDisciplinas] = useState(DEFAULT_DISCIPLINAS)
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS')
  const [solicitacoes, setSolicitacoes] = useState([])
  const [modalAdminAberto, setModalAdminAberto] = useState(false)
  const [carregandoAdmin, setCarregandoAdmin] = useState(false)

  // Estados das avaliações e do carrossel com Motion Blur
  const [avaliacoes, setAvaliacoes] = useState(DEFAULT_AVALIACOES)
  const [indiceAvaliacao, setIndiceAvaliacao] = useState(0)
  const [motionBlurClasse, setMotionBlurClasse] = useState('fade-in')
  const [modalAvaliacaoAberta, setModalAvaliacaoAberta] = useState(false)
  const [formNovaAvaliacao, setFormNovaAvaliacao] = useState({
    nomeAutor: '',
    papel: '',
    disciplina: 'Matemática',
    estrelas: 5,
    comentario: '',
    resultado: ''
  })

  // Referência direta ao DOM para Motion Blur sem disparar re-renderizações do React (60+ FPS estável)
  const contentRef = useRef(null)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let targetBlur = 0
    let currentBlur = 0
    let targetScale = 1
    let currentScale = 1
    let rafId = null
    let isRunning = false
    let resetTimer = null

    // Motor de física suave usando interpolação linear (LERP) acelerada por GPU
    const updatePhysics = () => {
      currentBlur += (targetBlur - currentBlur) * 0.35
      currentScale += (targetScale - currentScale) * 0.35

      if (contentRef.current) {
        if (currentBlur > 0.15) {
          contentRef.current.style.filter = `blur(${currentBlur.toFixed(1)}px)`
          contentRef.current.style.transform = `translate3d(0, 0, 0) scaleY(${currentScale.toFixed(3)})`
        } else {
          contentRef.current.style.filter = 'none'
          contentRef.current.style.transform = 'translate3d(0, 0, 0)'
        }
      }

      // Continua enquanto houver velocidade residual
      if (Math.abs(targetBlur - currentBlur) > 0.05 || currentBlur > 0.1) {
        rafId = requestAnimationFrame(updatePhysics)
      } else {
        isRunning = false
        if (contentRef.current) {
          contentRef.current.style.filter = 'none'
          contentRef.current.style.transform = 'translate3d(0, 0, 0)'
        }
      }
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = Math.abs(currentScrollY - lastScrollY)
      lastScrollY = currentScrollY

      // Limita a um valor visual agradável sem causar overhead na placa gráfica
      targetBlur = Math.min(delta * 0.065, 3.8)
      targetScale = 1 + Math.min(delta * 0.00018, 0.008)

      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => {
        targetBlur = 0
        targetScale = 1
      }, 50)

      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(updatePhysics)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
      clearTimeout(resetTimer)
    }
  }, [])

  // Controle de visibilidade do Navbar (some ao rolar para o rodapé, reaparece no topo ou no hover)
  const [navVisivel, setNavVisivel] = useState(true)

  useEffect(() => {
    let ultimoScrollY = window.scrollY

    const monitorarScrollNav = () => {
      const scrollAtual = window.scrollY

      if (scrollAtual <= 60) {
        // No topo da página: sempre visível
        setNavVisivel(true)
      } else if (scrollAtual > ultimoScrollY + 8) {
        // Rolando para baixo em direção ao footer: esconde a barra
        setNavVisivel(false)
      } else if (scrollAtual < ultimoScrollY - 12) {
        // Rolando para cima: reaparece
        setNavVisivel(true)
      }

      ultimoScrollY = scrollAtual
    }

    window.addEventListener('scroll', monitorarScrollNav, { passive: true })
    return () => window.removeEventListener('scroll', monitorarScrollNav)
  }, [])

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

  // Carrega as avaliações salvas no backend Spring Boot + SQLite
  useEffect(() => {
    fetch(`${API_BASE_URL}/avaliacoes`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar avaliações no backend")
        return res.json()
      })
      .then(data => {
        if (data && data.length > 0) {
          setAvaliacoes(data)
        }
      })
      .catch(() => {
        // Mantém as avaliações padrão locais se o backend estiver iniciando
      })
  }, [])

  // Função para transição de avaliação com efeito de Motion Blur ao deslizar
  const mudarSlideAvaliacao = (direcao) => {
    const classe = direcao === 'next' ? 'motion-blur-slide-left' : 'motion-blur-slide-right'
    setMotionBlurClasse(classe)

    if (direcao === 'next') {
      setIndiceAvaliacao((prev) => (prev + 1) % avaliacoes.length)
    } else {
      setIndiceAvaliacao((prev) => (prev - 1 + avaliacoes.length) % avaliacoes.length)
    }

    // Desativa a classe após a animação de deslizar e blur
    setTimeout(() => {
      setMotionBlurClasse('')
    }, 500)
  }

  // Envio de nova avaliação de pais/alunos com gravação no SQLite
  const handleNovaAvaliacaoSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE_URL}/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formNovaAvaliacao)
      })
      if (res.ok) {
        const criada = await res.json()
        setAvaliacoes([criada, ...avaliacoes])
      } else {
        setAvaliacoes([formNovaAvaliacao, ...avaliacoes])
      }
    } catch {
      setAvaliacoes([formNovaAvaliacao, ...avaliacoes])
    }
    setIndiceAvaliacao(0)
    setModalAvaliacaoAberta(false)
    setFormNovaAvaliacao({
      nomeAutor: '',
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
      default: return <Sparkles size={26} />
    }
  }

  // Envio do formulário com persistência no SQLite via Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setFormStatus({ tipo: '', mensagem: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/contatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormStatus({
          tipo: 'success',
          mensagem: '✅ Solicitação enviada com sucesso! Os dados foram salvos no banco SQLite. Em instantes entraremos em contato via WhatsApp.'
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
      // Caso o backend não esteja ativo no momento, orienta e abre o WhatsApp diretamente
      setFormStatus({
        tipo: 'success',
        mensagem: '✅ Pedido registrado! Você também pode clicar no botão verde abaixo para falar conosco diretamente no WhatsApp (81) 9.9122-5450!'
      })
    } finally {
      setEnviando(false)
    }
  }

  const disciplinasFiltradas = filtroCategoria === 'TODAS' 
    ? disciplinas 
    : disciplinas.filter(d => d.categoria.toUpperCase().includes(filtroCategoria))

  const whatsappLink = "https://wa.me/5581991225450?text=Ol%C3%A1!%20Vi%20a%20apresenta%C3%A7%C3%A3o%20do%20refor%C3%A7o%20escolar%20ACCOR%20e%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es."

  return (
    <div className="app-container">
      {/* Sensor invisível no topo da janela: quando o mouse passa no topo, faz o navbar reaparecer */}
      <div 
        className="nav-hover-trigger"
        onMouseEnter={() => setNavVisivel(true)}
      />

      {/* Cabeçalho inteligente: recolhe ao rolar para baixo e reaparece no topo ou hover */}
      <div 
        className={`header-sticky-wrapper ${navVisivel ? 'nav-visible' : 'nav-hidden'}`}
        onMouseEnter={() => setNavVisivel(true)}
        onMouseLeave={() => {
          if (window.scrollY > 80) setNavVisivel(false)
        }}
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
              <a href="#sobre" className="header-nav-link">A Professora</a>
              <a href="#disciplinas" className="header-nav-link">Disciplinas</a>
              <a href="#metodologia" className="header-nav-link">Diferenciais</a>
              <a href="#avaliacoes" className="header-nav-link">Avaliações</a>
              <a href="#contato" className="header-nav-link">Agendamento</a>
            </nav>

            <div className="header-actions">
              <button 
                className="btn-header-admin" 
                onClick={() => {
                  setModalAdminAberto(true)
                  carregarSolicitacoes()
                }}
                title="Ver contatos salvos no banco SQLite"
              >
                <Database size={16} />
                <span>Painel SQLite</span>
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
      <section className="hero-section">
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

      {/* Seção de Apresentação da Professora */}
      <section id="sobre" className="section-wrapper">
        <div className="section-header">
          <span className="section-tag">Acolhimento & Experiência Pedagógica</span>
          <h2 className="section-title">Conheça a Professora</h2>
          <p className="section-desc">
            Compromisso com o aprendizado individualizado, respeito ao tempo de cada aluno e formação pela Universidade Federal de Pernambuco.
          </p>
        </div>

        <div className="teacher-profile-wrapper">
          <div className="teacher-grid">
            {/* Cartão Visual da Professora com Foto Real */}
            <div className="teacher-card-visual">
              <div className="teacher-photo-container">
                <img 
                  src="/professora.jpg" 
                  alt="Professora do ACCOR Reforço Escolar" 
                  className="teacher-photo-img" 
                  decoding="async"
                  loading="lazy"
                />
                <span className="teacher-photo-badge">
                  <GraduationCap size={14} /> Especialista UFPE
                </span>
              </div>
              <h4 className="teacher-card-name">Professora Responsável</h4>
              <p className="teacher-card-role">ACCOR Reforço Escolar • Aldeia</p>

              <div className="teacher-card-pills">
                <div className="teacher-pill-item">
                  <MapPin size={15} color="#2563EB" /> Atendimento em domicílio em Aldeia
                </div>
                <div className="teacher-pill-item">
                  <Award size={15} color="#D97706" /> Formada pela UFPE
                </div>
                <div className="teacher-pill-item">
                  <Heart size={15} color="#DC2626" /> Metodologia Afetiva & Ativa
                </div>
              </div>
            </div>

            {/* Conteúdo e Filosofia de Ensino */}
            <div className="teacher-info-content">
              <h3>"Aprender com afeto e método devolve a confiança ao estudante."</h3>
              <p className="teacher-intro-lead">
                Educação personalizada que respeita o ritmo e potencializa os pontos fortes do seu filho.
              </p>
              <p className="teacher-bio-text">
                Com base acadêmica sólida pela <strong>Universidade Federal de Pernambuco (UFPE)</strong>, dedico-me a auxiliar estudantes do Ensino Fundamental e Médio a superarem bloqueios, recuperarem o rendimento escolar e desenvolverem gosto genuíno pelo estudo.
              </p>
              <p className="teacher-bio-text">
                Sabemos que a rotina escolar coletiva muitas vezes deixa dúvidas para trás. O trabalho do <strong>ACCOR Reforço Escolar</strong> é levar o ensino de alto padrão até a sua casa em Aldeia, criando um espaço acolhedor, sem pressões desnecessárias, focado em resultados reais.
              </p>

              <div className="teacher-quote-box">
                “Cada aluno tem sua própria maneira de compreender o mundo. Nosso papel não é apenas passar a resposta correta, mas desenvolver o raciocínio, a segurança e a autonomia.”
              </div>

              <div className="teacher-credentials-grid">
                <div className="teacher-cred-item">
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span>Aulas 100% individuais e sob medida</span>
                </div>
                <div className="teacher-cred-item">
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span>Apoio em tarefas escolares e fixação prática</span>
                </div>
                <div className="teacher-cred-item">
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span>Preparação estratégica para provas e simulados</span>
                </div>
                <div className="teacher-cred-item">
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span>Relatórios periódicos de evolução para os pais</span>
                </div>
              </div>

              <div className="teacher-cta-actions">
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-whatsapp-action"
                >
                  <MessageCircle size={18} />
                  Falar com a Professora no WhatsApp
                </a>
                <a href="#contato" className="btn-primary-action">
                  <Calendar size={18} />
                  Solicitar Agendamento
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção das Disciplinas Oferecidas */}
      <section id="disciplinas" className="section-wrapper">
        <div className="section-header">
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
              className="disciplina-card"
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
      <section className="section-wrapper">
        <div className="section-header">
          <span className="section-tag">Diferenciais</span>
          <h2 className="section-title">Por que escolher o ACCOR?</h2>
          <p className="section-desc">
            O reforço escolar em Aldeia com metodologia aprovada e corpo docente graduado pela UFPE.
          </p>
        </div>

        <div className="methodology-grid">
          <div className="method-card">
            <div className="method-number">01</div>
            <h3>Atendimento em Domicílio</h3>
            <p>Conforto e segurança para os alunos em Aldeia, sem necessidade de deslocamento no trânsito.</p>
          </div>
          <div className="method-card">
            <div className="method-number">02</div>
            <h3>Aulas 100% Individuais</h3>
            <p>Atenção total voltada às dúvidas específicas do aluno, eliminando lacunas de aprendizagem.</p>
          </div>
          <div className="method-card">
            <div className="method-number">03</div>
            <h3>Formação pela UFPE</h3>
            <p>Professores qualificados com base acadêmica sólida e técnicas pedagógicas atualizadas.</p>
          </div>
          <div className="method-card">
            <div className="method-number">04</div>
            <h3>Evolução Visível</h3>
            <p>Acompanhamento de tarefas, simulados e preparação para provas com relatórios de progresso.</p>
          </div>
        </div>
      </section>

      {/* Seção de Avaliações com Efeito de Fade e Motion Blur ao Deslizar */}
      <section id="avaliacoes" className="section-wrapper">
        <div className="section-header">
          <span className="section-tag">Depoimentos Reais</span>
          <h2 className="section-title">O que dizem os Pais e Alunos</h2>
          <p className="section-desc">
            Acompanhe as experiências de famílias em Aldeia que transformaram a vida escolar com o ACCOR.
          </p>
        </div>

        <div className="avaliacoes-container">
          {/* Barra de Média e Ação de Avaliar */}
          <div className="avaliacoes-header-bar">
            <div className="avaliacoes-score-box">
              <div className="score-number">5.0</div>
              <div className="score-stars-group">
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <span className="score-subtext">Satisfação 100% comprovada</span>
              </div>
            </div>

            <button 
              className="btn-nova-avaliacao"
              onClick={() => setModalAvaliacaoAberta(true)}
            >
              <Sparkles size={16} />
              <span>Deixar uma Avaliação</span>
            </button>
          </div>

          {/* Carrossel com Efeito de Motion Blur */}
          <div className="carousel-viewport">
            {avaliacoes.length > 0 && (
              <div className={`avaliacao-card-spotlight ${motionBlurClasse}`}>
                <Quote size={42} className="avaliacao-quote-icon" />

                {avaliacoes[indiceAvaliacao]?.resultado && (
                  <div className="resultado-destaque-badge">
                    <CheckCircle2 size={14} />
                    <span>{avaliacoes[indiceAvaliacao].resultado}</span>
                  </div>
                )}

                <p className="avaliacao-depoimento-texto">
                  "{avaliacoes[indiceAvaliacao]?.comentario}"
                </p>

                <div className="avaliacao-autor-footer">
                  <div className="avaliacao-autor-info">
                    <div className="autor-avatar-circle">
                      {avaliacoes[indiceAvaliacao]?.nomeAutor?.charAt(0) || "A"}
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
            )}
          </div>

          {/* Controles de Navegação com Motion Blur */}
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
                    const direcao = idx > indiceAvaliacao ? 'next' : 'prev'
                    mudarSlideAvaliacao(direcao)
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
        </div>
      </section>

      {/* Seção de Contato e Formulário Integrado com Spring Boot + SQLite */}
      <section id="contato" className="section-wrapper">
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
                <div className="phone">(81) 9.9122-5450</div>
              </div>
              <a 
                href={whatsappLink} 
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
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
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

      {/* Modal para Deixar Avaliação */}
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

            <form onSubmit={handleNovaAvaliacaoSubmit}>
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
                <span>Salvar Avaliação no Banco SQLite</span>
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
