package org.shax3.square.domain.opinion.model;
import jakarta.persistence.*;
import lombok.*;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.user.model.User;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "opinioncomment")
public class OpinionComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="opinion_id",nullable = false)
    private Opinion opinion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String content;

    @Column(name = "like_count", nullable = false)
    private int likeCount;

    @Column(name ="is_valid",nullable = false)
    private boolean isValid;



}
