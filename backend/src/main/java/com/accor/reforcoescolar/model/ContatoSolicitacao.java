package com.accor.reforcoescolar.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "contato_solicitacoes")
public class ContatoSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeResponsavel;
    private String nomeAluno;
    private String telefone;
    private String serieEscolar;
    private String disciplinaInteresse;
    private String modalidade; // Domicílio (Aldeia) ou Online
    private String mensagem;
    private LocalDateTime dataCriacao;
    private String status; // PENDENTE, CONTATADO, AGENDADO

    public ContatoSolicitacao() {
        this.dataCriacao = LocalDateTime.now();
        this.status = "PENDENTE";
    }

    public ContatoSolicitacao(String nomeResponsavel, String nomeAluno, String telefone,
                              String serieEscolar, String disciplinaInteresse, String modalidade, String mensagem) {
        this();
        this.nomeResponsavel = nomeResponsavel;
        this.nomeAluno = nomeAluno;
        this.telefone = telefone;
        this.serieEscolar = serieEscolar;
        this.disciplinaInteresse = disciplinaInteresse;
        this.modalidade = modalidade;
        this.mensagem = mensagem;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
