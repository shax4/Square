package org.shax3.square.domain.proposal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "proposal")

public class Proposal {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String topic;

    @Column(name = "like_count", nullable = false)
    private int likeCount = 0;

    @Column(name ="is_valid",nullable = false)
    boolean isValid = false;

}
