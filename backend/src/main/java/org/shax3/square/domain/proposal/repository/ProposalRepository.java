package org.shax3.square.domain.proposal.repository;

import org.shax3.square.domain.proposal.model.Proposal;
import org.shax3.square.domain.proposal.repository.custom.ProposalRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProposalRepository extends JpaRepository<Proposal, Long>, ProposalRepositoryCustom {
}
