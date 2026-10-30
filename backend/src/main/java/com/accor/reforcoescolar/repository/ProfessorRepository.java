package com.accor.reforcoescolar.repository;

import com.accor.reforcoescolar.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    List<Professor> findByAtivoTrue();
}
