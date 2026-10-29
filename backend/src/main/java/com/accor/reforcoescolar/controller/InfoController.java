package com.accor.reforcoescolar.controller;

import com.accor.reforcoescolar.dto.EscolaInfoDTO;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;

@RestController
@RequestMapping("/api/info")
@CrossOrigin(origins = "*")
public class InfoController {

    @GetMapping
    public EscolaInfoDTO getInfo() {
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
                "Geografia"
            ),
            "Professora Especialista UFPE",
            "Com formação de excelência pela Universidade Federal de Pernambuco (UFPE) e vocação para o ensino humanizado, dedico-me a acompanhar cada aluno de maneira única, identificando onde residem as dificuldades reais para construir uma base sólida e duradoura de conhecimento.",
            "Acredito que nenhum estudante deve se sentir incapaz diante de uma disciplina. Com o método certo, empatia e aulas individuais no conforto de casa em Aldeia, o aprendizado deixa de ser um peso e se torna motivo de orgulho.",
            Arrays.asList(
                "Graduação e especialização pela UFPE",
                "Atendimento domiciliar exclusivo em Aldeia e redondezas",
                "Metodologia ativa focada no ritmo de cada estudante",
                "Acompanhamento contínuo de tarefas, provas e vestibulares"
            )
        );
    }
}
