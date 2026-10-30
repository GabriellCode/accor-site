package com.accor.reforcoescolar.controller;

import com.accor.reforcoescolar.model.Disciplina;
import com.accor.reforcoescolar.repository.DisciplinaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<Disciplina> criar(@RequestBody Disciplina disciplina) {
        Disciplina salva = disciplinaRepository.save(disciplina);
        return ResponseEntity.ok(salva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!disciplinaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        disciplinaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
