package com.accor.reforcoescolar.config;

import com.accor.reforcoescolar.model.Avaliacao;
import com.accor.reforcoescolar.model.Disciplina;
import com.accor.reforcoescolar.repository.AvaliacaoRepository;
import com.accor.reforcoescolar.repository.DisciplinaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DisciplinaRepository disciplinaRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    public DataInitializer(DisciplinaRepository disciplinaRepository, AvaliacaoRepository avaliacaoRepository) {
        this.disciplinaRepository = disciplinaRepository;
        this.avaliacaoRepository = avaliacaoRepository;
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
                new Disciplina("Geografia", "Humanas", "Geopolítica, meio ambiente, cartografia e urbanização.", "globe")
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
    }
}
