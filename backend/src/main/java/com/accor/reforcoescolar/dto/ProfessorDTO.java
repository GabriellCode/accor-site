package com.accor.reforcoescolar.dto;

import java.util.List;

public class ProfessorDTO {
    private String nome;
    private String cargo;
    private String area;
    private String foto;
    private String bio;
    private String badge;
    private List<String> especialidades;
    private List<String> destaques;

    public ProfessorDTO() {
    }

    public ProfessorDTO(String nome, String cargo, String area, String foto, String bio, String badge,
                        List<String> especialidades, List<String> destaques) {
        this.nome = nome;
        this.cargo = cargo;
        this.area = area;
        this.foto = foto;
        this.bio = bio;
        this.badge = badge;
        this.especialidades = especialidades;
        this.destaques = destaques;
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

    public List<String> getEspecialidades() {
        return especialidades;
    }

    public void setEspecialidades(List<String> especialidades) {
        this.especialidades = especialidades;
    }

    public List<String> getDestaques() {
        return destaques;
    }

    public void setDestaques(List<String> destaques) {
        this.destaques = destaques;
    }
}
