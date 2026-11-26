package com.accor.reforcoescolar.controller;

import com.accor.reforcoescolar.model.Disciplina;
import com.accor.reforcoescolar.repository.DisciplinaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disciplinas")
@CrossOrigin(origins = "*")
public class DisciplinaController {

    private final DisciplinaRepository disciplinaRepository;

    public DisciplinaController(DisciplinaRepository disciplinaRepository) {
        this.disciplinaRepository = disciplinaRepository;
    }

    @GetMapping
    public List<Disciplina> listarTodas() {
        return disciplinaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> criar(
        @RequestBody Disciplina disciplina,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (!AuthController.validarTokenAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", "Acesso restrito ao administrador."));
        }
        Disciplina salva = disciplinaRepository.save(disciplina);
        return ResponseEntity.ok(salva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (!AuthController.validarTokenAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", "Acesso restrito ao administrador."));
        }
        if (!disciplinaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        disciplinaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
