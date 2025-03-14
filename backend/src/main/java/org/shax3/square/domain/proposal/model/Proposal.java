package org.shax3.square.domain.proposal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "proposal")
public class Proposal {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String topic;

    @Column(name = "like_count", nullable = false)
    private int likeCount;

    @Column(name ="is_valid",nullable = false)
    private boolean isValid;

    @Builder
    public Proposal(User user, String topic) {
        this.user = user;
        this.topic = topic;
        this.likeCount = 0;
        this.isValid = false;
    }
}
