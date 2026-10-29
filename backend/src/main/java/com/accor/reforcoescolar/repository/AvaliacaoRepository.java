package com.accor.reforcoescolar.repository;

import com.accor.reforcoescolar.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findAllByOrderByDataCriacaoDesc();
}
