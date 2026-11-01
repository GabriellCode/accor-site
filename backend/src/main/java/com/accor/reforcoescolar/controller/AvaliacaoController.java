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
    public ResponseEntity<?> criar(@RequestBody Avaliacao avaliacao) {
        String email = avaliacao.getEmailGoogle() != null ? avaliacao.getEmailGoogle().trim().toLowerCase() : "";
        if (email.isEmpty() || !email.matches("^[a-z0-9._%+-]+@(gmail\\.com|googlemail\\.com)$")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(java.util.Map.of("erro", "É obrigatório informar um e-mail válido do Google (@gmail.com) para publicar uma avaliação."));
        }
        avaliacao.setEmailGoogle(email);
        if (avaliacao.getEstrelas() <= 0 || avaliacao.getEstrelas() > 5) {
            avaliacao.setEstrelas(5);
        }
        Avaliacao salva = avaliacaoRepository.save(avaliacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (avaliacaoRepository.existsById(id)) {
            avaliacaoRepository.deleteById(id);
        }
        return ResponseEntity.noContent().build();
    }
}
