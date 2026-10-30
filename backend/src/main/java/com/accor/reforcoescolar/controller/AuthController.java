package com.accor.reforcoescolar.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    public static class LoginRequest {
        private String username;
        private String password;

        public LoginRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String user = request.getUsername() != null ? request.getUsername().trim() : "";
        String pass = request.getPassword() != null ? request.getPassword().trim() : "";

        // Aceita 'admin' / 'admin' ou 'admin' / 'accor123'
        if ("admin".equalsIgnoreCase(user) && ("admin".equals(pass) || "accor123".equals(pass))) {
            Map<String, Object> response = new HashMap<>();
            response.put("sucesso", true);
            response.put("token", "accor-adm-token-" + System.currentTimeMillis());
            response.put("usuario", "admin");
            response.put("nome", "Administrador ACCOR");
            return ResponseEntity.ok(response);
        }

        Map<String, String> erro = new HashMap<>();
        erro.put("mensagem", "Usuário ou senha incorretos.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
    }
}
