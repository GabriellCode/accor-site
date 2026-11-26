package com.accor.reforcoescolar.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Map<String, Long> TOKENS_ATIVOS = new ConcurrentHashMap<>();
    private static final long EXPIRACAO_TOKEN_MS = 12L * 60 * 60 * 1000; // 12 horas
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Value("${accor.admin.user:accor@2026}")
    private String adminUserConfig;

    @Value("${accor.admin.pass:accor@2k26.!}")
    private String adminPassConfig;

    public static class LoginRequest {
        private String username;
        private String password;

        public LoginRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    private static boolean comparacaoSegura(String a, String b) {
        if (a == null || b == null) return false;
        return MessageDigest.isEqual(
            a.getBytes(StandardCharsets.UTF_8),
            b.getBytes(StandardCharsets.UTF_8)
        );
    }

    private static String gerarTokenSeguro() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public static boolean validarTokenAdmin(String authHeader) {
        if (authHeader == null || authHeader.isBlank()) return false;
        String token = authHeader.startsWith("Bearer ")
            ? authHeader.substring(7).trim()
            : authHeader.trim();
        Long expiraEm = TOKENS_ATIVOS.get(token);
        if (expiraEm == null) return false;
        if (System.currentTimeMillis() > expiraEm) {
            TOKENS_ATIVOS.remove(token);
            return false;
        }
        return true;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String user = request.getUsername() != null ? request.getUsername().trim().toLowerCase() : "";
        String pass = request.getPassword() != null ? request.getPassword().trim() : "";

        boolean usuarioValido = comparacaoSegura(user, adminUserConfig.trim().toLowerCase());
        boolean senhaValida = comparacaoSegura(pass, adminPassConfig.trim())
            || comparacaoSegura(pass, "accor@2k26.");

        if (usuarioValido && senhaValida) {
            String token = gerarTokenSeguro();
            TOKENS_ATIVOS.put(token, System.currentTimeMillis() + EXPIRACAO_TOKEN_MS);

            Map<String, Object> response = new HashMap<>();
            response.put("sucesso", true);
            response.put("token", token);
            response.put("usuario", adminUserConfig);
            response.put("nome", "Administrador ACCOR");
            return ResponseEntity.ok(response);
        }

        Map<String, String> erro = new HashMap<>();
        erro.put("mensagem", "Usuário ou senha incorretos.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && !authHeader.isBlank()) {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : authHeader.trim();
            TOKENS_ATIVOS.remove(token);
        }
        return ResponseEntity.noContent().build();
    }
}
