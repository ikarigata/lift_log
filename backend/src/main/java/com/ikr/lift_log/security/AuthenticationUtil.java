package com.ikr.lift_log.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 認証関連のユーティリティクラス
 */
public class AuthenticationUtil {

    /**
     * 現在の認証済みユーザーのIDを取得
     * 
     * @return ユーザーID。認証されていない場合は null
     */
    public static String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            return jwtAuth.getUserId();
        }
        
        return null;
    }

    /**
     * 現在のユーザーが認証されているかチェック
     * 
     * @return 認証されている場合 true
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() && 
               authentication instanceof JwtAuthenticationToken;
    }

    /**
     * 現在の認証済みユーザーのIDを取得（例外付き）
     * 
     * @return ユーザーID
     * @throws IllegalStateException 認証されていない場合
     */
    public static String requireCurrentUserId() {
        String userId = getCurrentUserId();
        if (userId == null) {
            throw new IllegalStateException("User is not authenticated");
        }
        return userId;
    }

    /**
     * 現在の認証済みユーザーのIDをUUIDとして取得
     * 
     * @return ユーザーID（UUID形式）
     * @throws IllegalStateException 認証されていない場合またはUUID形式が無効な場合
     */
    public static java.util.UUID requireCurrentUserUUID() {
        String userId = requireCurrentUserId();
        try {
            return java.util.UUID.fromString(userId);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("User ID is not a valid UUID: " + userId, e);
        }
    }
}