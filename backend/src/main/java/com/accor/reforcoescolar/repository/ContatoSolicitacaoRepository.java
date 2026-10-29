package com.accor.reforcoescolar.repository;

import com.accor.reforcoescolar.model.ContatoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContatoSolicitacaoRepository extends JpaRepository<ContatoSolicitacao, Long> {
    List<ContatoSolicitacao> findAllByOrderByDataCriacaoDesc();
}
