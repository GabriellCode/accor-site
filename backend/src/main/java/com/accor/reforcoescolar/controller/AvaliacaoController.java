package com.accor.reforcoescolar.controller;

import com.accor.reforcoescolar.model.Avaliacao;
import com.accor.reforcoescolar.repository.AvaliacaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/avaliacoes")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    private final AvaliacaoRepository avaliacaoRepository;

    public AvaliacaoController(AvaliacaoRepository avaliacaoRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
    }

    private static String cortarTexto(String valor, int max) {
        if (valor == null) return "";
        String limpo = valor.trim();
        return limpo.length() > max ? limpo.substring(0, max) : limpo;
    }

    private static String mascararEmailPublico(String email) {
        if (email == null || !email.contains("@")) return "";
        String[] partes = email.trim().toLowerCase().split("@", 2);
        String usuario = partes[0];
        String dominio = partes[1];
        if (usuario.length() <= 2) {
            return (usuario.isEmpty() ? "*" : usuario.charAt(0)) + "***@" + dominio;
        }
        return usuario.substring(0, 2) + "***@" + dominio;
    }

    private static Avaliacao criarCopiaPublica(Avaliacao original) {
        Avaliacao copia = new Avaliacao();
        copia.setId(original.getId());
        copia.setNomeAutor(original.getNomeAutor());
        copia.setEmailGoogle(mascararEmailPublico(original.getEmailGoogle()));
        copia.setPapel(original.getPapel());
        copia.setDisciplina(original.getDisciplina());
        copia.setEstrelas(original.getEstrelas());
        copia.setComentario(original.getComentario());
        copia.setResultado(original.getResultado());
        copia.setDataCriacao(original.getDataCriacao());
        return copia;
    }

    @GetMapping
    public List<Avaliacao> listarTodas(
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        List<Avaliacao> todas = avaliacaoRepository.findAllByOrderByDataCriacaoDesc();
        if (AuthController.validarTokenAdmin(authHeader)) {
            return todas;
        }
        return todas.stream().map(AvaliacaoController::criarCopiaPublica).collect(Collectors.toList());
    }

    @GetMapping("/resumo")
    public ResponseEntity<?> obterResumoMedia() {
        List<Avaliacao> todas = avaliacaoRepository.findAllByOrderByDataCriacaoDesc();
        int total = todas.size();
        double media = total > 0
            ? todas.stream().mapToInt(Avaliacao::getEstrelas).average().orElse(0.0)
            : 0.0;
        double mediaArredondada = Math.round(media * 10.0) / 10.0;
        List<Avaliacao> publicas = todas.stream()
            .map(AvaliacaoController::criarCopiaPublica)
            .collect(Collectors.toList());
        return ResponseEntity.ok(Map.of(
            "total", total,
            "media", mediaArredondada,
            "avaliacoes", publicas
        ));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Avaliacao avaliacao) {
        String email = cortarTexto(avaliacao.getEmailGoogle(), 120).toLowerCase();
        if (email.isEmpty() || !email.matches("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("erro", "É obrigatório informar um e-mail válido para publicar uma avaliação."));
        }
        if (avaliacao.getEstrelas() < 1 || avaliacao.getEstrelas() > 5) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("erro", "Por favor, selecione de 1 a 5 estrelas para avaliar."));
        }
        String nomeAutor = cortarTexto(avaliacao.getNomeAutor(), 100);
        String comentario = cortarTexto(avaliacao.getComentario(), 800);
        if (nomeAutor.isEmpty() || comentario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("erro", "Nome e depoimento são obrigatórios."));
        }

        avaliacao.setEmailGoogle(email);
        avaliacao.setNomeAutor(nomeAutor);
        avaliacao.setPapel(cortarTexto(avaliacao.getPapel(), 120));
        avaliacao.setDisciplina(cortarTexto(avaliacao.getDisciplina(), 80));
        avaliacao.setResultado(cortarTexto(avaliacao.getResultado(), 40));
        avaliacao.setComentario(comentario);

        Avaliacao salva = avaliacaoRepository.save(avaliacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(criarCopiaPublica(salva));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (!AuthController.validarTokenAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", "Acesso restrito ao administrador."));
        }
        if (avaliacaoRepository.existsById(id)) {
            avaliacaoRepository.deleteById(id);
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<?> excluirTodas(
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (!AuthController.validarTokenAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", "Acesso restrito ao administrador."));
        }
        avaliacaoRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }
}
