package org.shax3.square.domain.auth.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.stereotype.Service;

@Service
public class FirebaseService {

    public FirebaseToken verifyIdToken(String idToken) {
        try {
            return FirebaseAuth.getInstance().verifyIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new CustomException(ExceptionCode.INVALID_ID_TOKEN);
        }
    }
}
