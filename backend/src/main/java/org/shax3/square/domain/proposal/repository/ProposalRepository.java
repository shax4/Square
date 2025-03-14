package org.shax3.square.domain.proposal.repository;

import org.shax3.square.domain.proposal.model.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    Optional<Proposal> findProposalById(Long id);

}
