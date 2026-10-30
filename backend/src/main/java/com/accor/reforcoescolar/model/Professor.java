package com.accor.reforcoescolar.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "professores")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cargo;
    private String area;
    private String foto;
    private String bio;
    private String badge;
    private String especialidades; // ex: "Linguagens, Fund. 2, Português, Redação"
    private String destaques;      // ex: "Aulas 1:1, Formação UFPE"
    private boolean ativo = true;

    public Professor() {
    }

    public Professor(String nome, String cargo, String area, String foto, String bio, String badge, String especialidades, String destaques) {
        this.nome = nome;
        this.cargo = cargo;
        this.area = area;
        this.foto = foto;
        this.bio = bio;
        this.badge = badge;
        this.especialidades = especialidades;
        this.destaques = destaques;
        this.ativo = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getEspecialidades() {
        return especialidades;
    }

    public void setEspecialidades(String especialidades) {
        this.especialidades = especialidades;
    }

    public String getDestaques() {
        return destaques;
    }

    public void setDestaques(String destaques) {
        this.destaques = destaques;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
