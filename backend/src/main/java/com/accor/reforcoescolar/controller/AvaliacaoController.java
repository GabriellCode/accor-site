package com.accor.reforcoescolar.controller;

import com.accor.reforcoescolar.model.Avaliacao;
import com.accor.reforcoescolar.repository.AvaliacaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    private final AvaliacaoRepository avaliacaoRepository;

    public AvaliacaoController(AvaliacaoRepository avaliacaoRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
    }

    @GetMapping
    public List<Avaliacao> listarTodas() {
        return avaliacaoRepository.findAllByOrderByDataCriacaoDesc();
    }

    @PostMapping
    public ResponseEntity<Avaliacao> criar(@RequestBody Avaliacao avaliacao) {
        if (avaliacao.getEstrelas() <= 0 || avaliacao.getEstrelas() > 5) {
            avaliacao.setEstrelas(5);
        }
        Avaliacao salva = avaliacaoRepository.save(avaliacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }
}
