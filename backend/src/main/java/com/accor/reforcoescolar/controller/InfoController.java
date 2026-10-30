package com.accor.reforcoescolar.controller;

import com.accor.reforcoescolar.dto.EscolaInfoDTO;
import com.accor.reforcoescolar.dto.ProfessorDTO;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/info")
@CrossOrigin(origins = "*")
public class InfoController {

    @GetMapping
    public EscolaInfoDTO getInfo() {
        List<ProfessorDTO> listaProfessores = Arrays.asList(
            new ProfessorDTO(
                "Professora Alessandra",
                "Linguagens & Ensino Fundamental 2 (Todas as Disciplinas)",
                "Linguagens & Ensino Fundamental 2",
                "/professora.jpg",
                "Formada pela UFPE, atua com foco em Linguagens e no acompanhamento completo de todas as disciplinas do Ensino Fundamental 2. Dedica-se a construir uma base sólida com metodologia afetiva, acolhedora e aulas 1:1 no domicílio em Aldeia.",
                "Especialista UFPE",
                Arrays.asList("Linguagens", "Português", "Redação", "Fund. 2 (Todas as Matérias)", "Inglês"),
                Arrays.asList(
                    "Acompanhamento completo de todas as matérias do Fundamental 2",
                    "Especialista em Linguagens, interpretação e redação",
                    "Aulas 1:1 com metodologia afetiva no domicílio em Aldeia",
                    "Acompanhamento contínuo e relatórios para a família"
                )
            ),
            new ProfessorDTO(
                "Eduardo",
                "Professor de Exatas",
                "Matemática, Física & Química",
                "/eduardo-avatar.jpg",
                "Especialista em transformar o 'medo de contas' em compreensão lógica e intuitiva. Foco absoluto em resolução guiada passo a passo, preparação para simulados, provas escolares, SSA e ENEM sem decoreba.",
                "Exatas & Vestibulares",
                Arrays.asList("Matemática", "Física", "Química", "Álgebra", "Geometria"),
                Arrays.asList(
                    "Desmistificação de fórmulas e cálculos complexos",
                    "Treinamento intensivo de exercícios e resolução guiada",
                    "Preparação estratégica para SSA e ENEM",
                    "Recuperação rápida de notas e base em exatas"
                )
            ),
            new ProfessorDTO(
                "Gabriell",
                "Professor de Computação & Lógica",
                "Lógica de Programação, Algoritmos & Tecnologia",
                "/gabriell-avatar.jpg",
                "Apaixonado por ensinar o pensamento computacional e a ciência da computação para jovens e estudantes. Desenvolve raciocínio estruturado, resolução de problemas reais e autonomia através do código.",
                "Computação & Lógica",
                Arrays.asList("Lógica de Programação", "Algoritmos", "Pensamento Computacional", "Python", "Web"),
                Arrays.asList(
                    "Aprender programando com projetos práticos e jogos",
                    "Desenvolvimento do raciocínio lógico analítico",
                    "Base sólida para olimpíadas científicas e tecnologia",
                    "Aulas dinâmicas e mentoria individualizada"
                )
            )
        );

        return new EscolaInfoDTO(
            "ACCOR",
            "REFORÇO ESCOLAR",
            "Atendimento em domicílio | Aldeia",
            "Professores especializados pela UFPE",
            "Um método feito sob medida para você!",
            "Aulas individuais, evolução visível.",
            "5581991225450",
            "(81) 9.9122-5450",
            Arrays.asList(
                "Matemática",
                "Português",
                "Inglês",
                "Física",
                "Química",
                "Biologia",
                "História",
                "Geografia",
                "Computação e Lógica"
            ),
            "Professora Especialista UFPE",
            "Com formação de excelência pela Universidade Federal de Pernambuco (UFPE) e vocação para o ensino humanizado, dedico-me a acompanhar cada aluno de maneira única, identificando onde residem as dificuldades reais para construir uma base sólida e duradoura de conhecimento.",
            "Acredito que nenhum estudante deve se sentir incapaz diante de uma disciplina. Com o método certo, empatia e aulas individuais no conforto de casa em Aldeia, o aprendizado deixa de ser um peso e se torna motivo de orgulho.",
            Arrays.asList(
                "Graduação e especialização pela UFPE",
                "Atendimento domiciliar exclusivo em Aldeia e redondezas",
                "Metodologia ativa focada no ritmo de cada estudante",
                "Acompanhamento contínuo de tarefas, provas e vestibulares"
            ),
            listaProfessores
        );
    }
}
