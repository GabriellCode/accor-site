package com.accor.reforcoescolar.controller;

import com.accor.reforcoescolar.dto.ContatoRequestDTO;
import com.accor.reforcoescolar.model.ContatoSolicitacao;
import com.accor.reforcoescolar.repository.ContatoSolicitacaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contatos")
@CrossOrigin(origins = "*")
public class ContatoController {

    private final ContatoSolicitacaoRepository contatoRepository;

    public ContatoController(ContatoSolicitacaoRepository contatoRepository) {
        this.contatoRepository = contatoRepository;
    }

    private static String cortarTexto(String valor, int max) {
        if (valor == null) return "";
        String limpo = valor.trim();
        return limpo.length() > max ? limpo.substring(0, max) : limpo;
    }

    @GetMapping
    public ResponseEntity<?> listarContatos(
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (!AuthController.validarTokenAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", "Acesso restrito ao administrador."));
        }
        return ResponseEntity.ok(contatoRepository.findAllByOrderByDataCriacaoDesc());
    }

    @PostMapping
    public ResponseEntity<?> registrarContato(@RequestBody ContatoRequestDTO dto) {
        String telefone = cortarTexto(dto.getTelefone(), 30);
        if (telefone.isEmpty()) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "O telefone ou WhatsApp é obrigatório para contato.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }

        ContatoSolicitacao solicitacao = new ContatoSolicitacao(
            cortarTexto(dto.getNomeResponsavel(), 100),
            cortarTexto(dto.getNomeAluno(), 100),
            telefone,
            cortarTexto(dto.getSerieEscolar(), 30),
            cortarTexto(dto.getDisciplinaInteresse(), 80),
            cortarTexto(dto.getModalidade(), 50),
            cortarTexto(dto.getMensagem(), 800)
        );

        ContatoSolicitacao salvo = contatoRepository.save(solicitacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirContato(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (!AuthController.validarTokenAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", "Acesso restrito ao administrador."));
        }
        if (contatoRepository.existsById(id)) {
            contatoRepository.deleteById(id);
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<?> excluirTodosContatos(
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (!AuthController.validarTokenAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", "Acesso restrito ao administrador."));
        }
        contatoRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }
}
