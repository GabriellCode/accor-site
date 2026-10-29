package com.accor.reforcoescolar.controller;

import com.accor.reforcoescolar.dto.ContatoRequestDTO;
import com.accor.reforcoescolar.model.ContatoSolicitacao;
import com.accor.reforcoescolar.repository.ContatoSolicitacaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contatos")
@CrossOrigin(origins = "*")
public class ContatoController {

    private final ContatoSolicitacaoRepository contatoRepository;

    public ContatoController(ContatoSolicitacaoRepository contatoRepository) {
        this.contatoRepository = contatoRepository;
    }

    @GetMapping
    public List<ContatoSolicitacao> listarContatos() {
        return contatoRepository.findAllByOrderByDataCriacaoDesc();
    }

    @PostMapping
    public ResponseEntity<?> registrarContato(@RequestBody ContatoRequestDTO dto) {
        if (dto.getTelefone() == null || dto.getTelefone().trim().isEmpty()) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "O telefone ou WhatsApp é obrigatório para contato.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }

        ContatoSolicitacao solicitacao = new ContatoSolicitacao(
            dto.getNomeResponsavel(),
            dto.getNomeAluno(),
            dto.getTelefone(),
            dto.getSerieEscolar(),
            dto.getDisciplinaInteresse(),
            dto.getModalidade(),
            dto.getMensagem()
        );

        ContatoSolicitacao salvo = contatoRepository.save(solicitacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }
}
