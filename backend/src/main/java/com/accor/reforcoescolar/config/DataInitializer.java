package com.accor.reforcoescolar.config;

import com.accor.reforcoescolar.model.Avaliacao;
import com.accor.reforcoescolar.model.Disciplina;
import com.accor.reforcoescolar.model.Professor;
import com.accor.reforcoescolar.repository.AvaliacaoRepository;
import com.accor.reforcoescolar.repository.DisciplinaRepository;
import com.accor.reforcoescolar.repository.ProfessorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DisciplinaRepository disciplinaRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final ProfessorRepository professorRepository;

    public DataInitializer(DisciplinaRepository disciplinaRepository,
                           AvaliacaoRepository avaliacaoRepository,
                           ProfessorRepository professorRepository) {
        this.disciplinaRepository = disciplinaRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.professorRepository = professorRepository;
    }

    @Override
    public void run(String... args) {
        if (disciplinaRepository.count() == 0) {
            List<Disciplina> disciplinas = Arrays.asList(
                new Disciplina("Matemática", "Exatas", "Aritmética, Álgebra, Geometria e raciocínio lógico.", "calculator"),
                new Disciplina("Português", "Linguagens", "Gramática, interpretação textual e produção de redação.", "book-open"),
                new Disciplina("Inglês", "Idiomas", "Vocabulário, conversação, gramática e compreensão de textos.", "languages"),
                new Disciplina("Física", "Exatas", "Mecânica, eletricidade, ondulatória e termologia.", "zap"),
                new Disciplina("Química", "Exatas", "Estrutura atômica, reações químicas, estequiometria e orgânica.", "flask-conical"),
                new Disciplina("Biologia", "Ciências da Natureza", "Citologia, genética, evolução e ecologia.", "dna"),
                new Disciplina("História", "Humanas", "História do Brasil, Geral e desenvolvimento crítico.", "landmark"),
                new Disciplina("Geografia", "Humanas", "Geopolítica, meio ambiente, cartografia e urbanização.", "globe"),
                new Disciplina("Computação & Lógica", "Tecnologia", "Lógica de programação, pensamento computacional e algoritmos práticos.", "code")
            );
            disciplinaRepository.saveAll(disciplinas);
            System.out.println("Disciplinas cadastradas no banco SQLite com sucesso!");
        }

        if (avaliacaoRepository.count() == 0) {
            List<Avaliacao> avaliacoes = Arrays.asList(
                new Avaliacao(
                    "Patrícia Albuquerque",
                    "Mãe do Lucas (8º ano) • Aldeia",
                    "Matemática e Física",
                    5,
                    "O Lucas tinha pavor das provas de matemática e travava em equações. Com a paciência e a didática maravilhosa da professora, a nota dele subiu de 4,5 para 9,2! O atendimento em domicílio aqui em Aldeia facilitou demais a nossa rotina.",
                    "Nota subiu de 4,5 para 9,2 no bimestre"
                ),
                new Avaliacao(
                    "Carlos Eduardo Valença",
                    "Pai da Sofia (3º ano Médio)",
                    "Química e Biologia",
                    5,
                    "Excelente profissional! Muito pontual, dedicada e com domínio total dos conteúdos exigidos pelo SSA e ENEM. A Sofia ganhou muito mais segurança e conquistou a aprovação.",
                    "Aprovada com nota 940 no SSA/ENEM"
                ),
                new Avaliacao(
                    "Renata Meireles",
                    "Mãe do Bernardo (6º ano) • Aldeia",
                    "Português e Redação",
                    5,
                    "Meu filho tinha muita dificuldade com interpretação e construção de textos. As aulas foram lúdicas, dinâmicas e o desenvolvimento dele foi visível já nas primeiras semanas. Recomendo de olhos fechados!",
                    "Evolução surpreendente na redação"
                ),
                new Avaliacao(
                    "Mariana Cavalcanti",
                    "Mãe da Alice (9º ano)",
                    "Matemática e Ciências",
                    5,
                    "Professora extraordinária, com uma metodologia afetuosa que realmente ensina a pensar. Não é decoreba, é compreensão real da matéria. Alice hoje faz os exercícios sozinha!",
                    "Média final 9,8 e aluna destaque"
                ),
                new Avaliacao(
                    "Rodrigo Siqueira",
                    "Pai do Matheus (1º ano Médio) • Aldeia",
                    "Física e Matemática",
                    5,
                    "O acompanhamento em domicílio é o ponto alto: conforto absoluto e atenção 100% no estudante. A formação pela UFPE faz toda a diferença na metodologia de ensino.",
                    "Recuperação imediata de rendimento"
                )
            );
            avaliacaoRepository.saveAll(avaliacoes);
            System.out.println("Avaliações cadastradas no banco SQLite com sucesso!");
        }

        if (professorRepository.count() == 0) {
            List<Professor> professores = Arrays.asList(
                new Professor(
                    "Professora Alessandra",
                    "Linguagens & Ensino Fundamental 2",
                    "Linguagens & Fundamental 2",
                    "/professora.jpg",
                    "Formada pela UFPE, a professora Alessandra atua com foco em Linguagens e no acompanhamento pedagógico completo de todas as disciplinas do Ensino Fundamental 2, auxiliando nas tarefas diárias, superação de bloqueios e base sólida com didática afetiva.",
                    "Especialista UFPE",
                    "Linguagens, Fund. 2 (Todas as Matérias), Português, Redação",
                    "Acompanhamento de todas as matérias do Fundamental 2, Especialista em Linguagens, Aulas 1:1 em Aldeia"
                ),
                new Professor(
                    "Eduardo",
                    "Professor de Exatas",
                    "Ciências Exatas",
                    "",
                    "Especialista em desmistificar números e cálculos complexos. Didática prática com foco em resolução guiada de exercícios sem decoreba, preparando para simulados, provas escolares e vestibulares.",
                    "Exatas & Vestibulares",
                    "Matemática, Física, Química, SSA & ENEM",
                    "Resolução passo a passo de listas de exercícios, Foco intensivo para provas do colégio e SSA, Recuperação rápida de base"
                ),
                new Professor(
                    "Gabriell",
                    "Professor de Computação & Lógica",
                    "Computação & Tecnologia",
                    "/gabriell.png",
                    "Ensina lógica de programação e pensamento computacional para jovens e estudantes. Metodologia ativa construindo programas e projetos práticos, estimulando raciocínio analítico e criatividade.",
                    "Computação & Lógica",
                    "Lógica de Programação, Algoritmos, Pensamento Computacional, Python & Web",
                    "Aulas práticas construindo programas e algoritmos, Raciocínio lógico estruturado, Mentoria individual em tecnologia"
                )
            );
            professorRepository.saveAll(professores);
            System.out.println("Professores cadastrados no banco SQLite com sucesso!");
        }
    }
}
