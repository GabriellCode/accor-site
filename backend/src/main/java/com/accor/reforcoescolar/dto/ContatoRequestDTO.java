package com.accor.reforcoescolar.dto;

public class ContatoRequestDTO {
    private String nomeResponsavel;
    private String nomeAluno;
    private String telefone;
    private String serieEscolar;
    private String disciplinaInteresse;
    private String modalidade;
    private String mensagem;

    public ContatoRequestDTO() {
    }

    public String getNomeResponsavel() {
        return nomeResponsavel;
    }

    public void setNomeResponsavel(String nomeResponsavel) {
        this.nomeResponsavel = nomeResponsavel;
    }

    public String getNomeAluno() {
        return nomeAluno;
    }

    public void setNomeAluno(String nomeAluno) {
        this.nomeAluno = nomeAluno;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getSerieEscolar() {
        return serieEscolar;
    }

    public void setSerieEscolar(String serieEscolar) {
        this.serieEscolar = serieEscolar;
    }

    public String getDisciplinaInteresse() {
        return disciplinaInteresse;
    }

    public void setDisciplinaInteresse(String disciplinaInteresse) {
        this.disciplinaInteresse = disciplinaInteresse;
    }

    public String getModalidade() {
        return modalidade;
    }

    public void setModalidade(String modalidade) {
        this.modalidade = modalidade;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
}
