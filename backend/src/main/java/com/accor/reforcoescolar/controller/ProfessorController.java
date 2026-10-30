package com.accor.reforcoescolar.controller;

import com.accor.reforcoescolar.model.Professor;
import com.accor.reforcoescolar.repository.ProfessorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
@CrossOrigin(origins = "*")
public class ProfessorController {

    private final ProfessorRepository professorRepository;

    public ProfessorController(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    @GetMapping
    public List<Professor> listarTodos() {
        return professorRepository.findByAtivoTrue();
    }

    @PostMapping
    public ResponseEntity<Professor> criar(@RequestBody Professor professor) {
        professor.setAtivo(true);
        Professor salvo = professorRepository.save(professor);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professor> atualizar(@PathVariable Long id, @RequestBody Professor dadosAtualizados) {
        return professorRepository.findById(id).map(existente -> {
            if (dadosAtualizados.getNome() != null) existente.setNome(dadosAtualizados.getNome());
            if (dadosAtualizados.getCargo() != null) existente.setCargo(dadosAtualizados.getCargo());
            if (dadosAtualizados.getArea() != null) existente.setArea(dadosAtualizados.getArea());
            if (dadosAtualizados.getFoto() != null) existente.setFoto(dadosAtualizados.getFoto());
            if (dadosAtualizados.getBio() != null) existente.setBio(dadosAtualizados.getBio());
            if (dadosAtualizados.getBadge() != null) existente.setBadge(dadosAtualizados.getBadge());
            if (dadosAtualizados.getEspecialidades() != null) existente.setEspecialidades(dadosAtualizados.getEspecialidades());
            if (dadosAtualizados.getDestaques() != null) existente.setDestaques(dadosAtualizados.getDestaques());

            Professor salvo = professorRepository.save(existente);
            return ResponseEntity.ok(salvo);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!professorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        professorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
