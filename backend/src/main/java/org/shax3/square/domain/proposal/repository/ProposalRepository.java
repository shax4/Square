package org.shax3.square.domain.proposal.repository;

import org.shax3.square.domain.proposal.model.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProposalRepository extends JpaRepository<Proposal, Long>, ProposalRepositoryCustom {
}
