package com.ikr.lift_log.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Collections;

/**
 * JWT認証トークンを表すクラス
 */
public class JwtAuthenticationToken extends AbstractAuthenticationToken {

    private final String userId;
    private final String token;

    public JwtAuthenticationToken(String token, String userId) {
        super(Collections.emptyList());
        this.token = token;
        this.userId = userId;
        setAuthenticated(true);
    }

    public JwtAuthenticationToken(String token) {
        super(Collections.emptyList());
        this.token = token;
        this.userId = null;
        setAuthenticated(false);
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public Object getPrincipal() {
        return userId;
    }

    public String getUserId() {
        return userId;
    }

    public String getToken() {
        return token;
    }
}