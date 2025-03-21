package org.shax3.square.domain.debate.repository;

import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    boolean existsByDebateAndUser(Debate debate, User user);
    int countByDebate(Debate debate);
    int countByDebateAndLeftTrue(Debate debate);
}
