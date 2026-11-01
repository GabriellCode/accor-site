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

        // Remove quaisquer avaliações de exemplo antigas que não possuam e-mail Google real vinculado
        avaliacaoRepository.findAll().forEach(av -> {
            if (av.getEmailGoogle() == null || av.getEmailGoogle().trim().isEmpty()) {
                avaliacaoRepository.deleteById(av.getId());
            }
        });

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
                    "Professor de Exatas • Medicina UFPE",
                    "Ciências Exatas & Natureza",
                    "/eduardo.jpg",
                    "Estudante de Medicina na UFPE, é especialista em desmistificar números e cálculos complexos. Didática prática com foco em resolução guiada de exercícios sem decoreba, preparando para simulados, provas escolares, SSA e ENEM.",
                    "Medicina UFPE • Exatas",
                    "Matemática, Física, Química, SSA & ENEM",
                    "Estudante de Medicina na UFPE, Resolução passo a passo de listas de exercícios, Foco intensivo para provas do colégio, SSA e ENEM"
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
