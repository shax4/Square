package org.shax3.square.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.model.UserDevice;
import org.shax3.square.domain.user.repository.UserDeviceRepository;
import org.shax3.square.domain.user.repository.UserRepository;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserDeviceService {

    private final UserDeviceRepository userDeviceRepository;
    private final UserRepository userRepository;

    public void registerOrUpdateDevice(Long userId, String fcmToken, String deviceId, String deviceType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionCode.USER_NOT_FOUND));

        userDeviceRepository.findByDeviceId(deviceId)
                .ifPresentOrElse(
                        existingDevice -> {
                            existingDevice.updateFcmToken(fcmToken);
                            existingDevice.updateLastLogin(LocalDateTime.now());
                        },
                        () -> userDeviceRepository.save(UserDevice.builder()
                                .user(user)
                                .deviceId(deviceId)
                                .deviceType(deviceType)
                                .fcmToken(fcmToken)
                                .lastLogin(LocalDateTime.now())
                                .build())
                );
    }
}
