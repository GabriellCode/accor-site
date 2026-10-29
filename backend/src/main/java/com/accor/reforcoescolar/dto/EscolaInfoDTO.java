package com.accor.reforcoescolar.dto;

import java.util.List;

public class EscolaInfoDTO {
    private String nome;
    private String subtitulo;
    private String localizacao;
    private String formacao;
    private String slogan;
    private String descricaoMetodo;
    private String whatsapp;
    private String whatsappDisplay;
    private List<String> disciplinas;

    public EscolaInfoDTO() {
    }

    public EscolaInfoDTO(String nome, String subtitulo, String localizacao, String formacao,
                         String slogan, String descricaoMetodo, String whatsapp,
                         String whatsappDisplay, List<String> disciplinas) {
        this.nome = nome;
        this.subtitulo = subtitulo;
        this.localizacao = localizacao;
        this.formacao = formacao;
        this.slogan = slogan;
        this.descricaoMetodo = descricaoMetodo;
        this.whatsapp = whatsapp;
        this.whatsappDisplay = whatsappDisplay;
        this.disciplinas = disciplinas;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSubtitulo() {
        return subtitulo;
    }

    public void setSubtitulo(String subtitulo) {
        this.subtitulo = subtitulo;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public String getFormacao() {
        return formacao;
    }

    public void setFormacao(String formacao) {
        this.formacao = formacao;
    }

    public String getSlogan() {
        return slogan;
    }

    public void setSlogan(String slogan) {
        this.slogan = slogan;
    }

    public String getDescricaoMetodo() {
        return descricaoMetodo;
    }

    public void setDescricaoMetodo(String descricaoMetodo) {
        this.descricaoMetodo = descricaoMetodo;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getWhatsappDisplay() {
        return whatsappDisplay;
    }

    public void setWhatsappDisplay(String whatsappDisplay) {
        this.whatsappDisplay = whatsappDisplay;
    }

    public List<String> getDisciplinas() {
        return disciplinas;
    }

    public void setDisciplinas(List<String> disciplinas) {
        this.disciplinas = disciplinas;
    }
}
