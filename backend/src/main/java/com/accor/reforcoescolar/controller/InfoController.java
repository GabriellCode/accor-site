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
            )
        );
    }
}
