package com.accor.reforcoescolar.config;

import com.accor.reforcoescolar.model.Disciplina;
import com.accor.reforcoescolar.repository.DisciplinaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DisciplinaRepository disciplinaRepository;

    public DataInitializer(DisciplinaRepository disciplinaRepository) {
        this.disciplinaRepository = disciplinaRepository;
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
    }
}
