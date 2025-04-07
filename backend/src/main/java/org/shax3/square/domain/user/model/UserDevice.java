package org.shax3.square.domain.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.shax3.square.common.entity.BaseTimeEntity;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserDevice extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fcmToken;

    private String deviceType;

    private String deviceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime lastLogin;

    public void updateFcmToken(String newToken) {
        this.fcmToken = newToken;
    }

    public void updateLastLogin(LocalDateTime loginTime) {
        this.lastLogin = loginTime;
    }

}
