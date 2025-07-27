package com.ikr.lift_log.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

/**
 * JWT トークンの生成と検証を行うユーティリティクラス
 */
@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long expirationTimeInHours;

    public JwtTokenProvider(@Value("${jwt.secret:mySecretKey12345678901234567890}") String secret,
            @Value("${jwt.expiration:24}") long expirationTimeInHours) {
        // 最低256ビット（32文字）のキーが必要
        if (secret.length() < 32) {
            secret = secret + "0".repeat(32 - secret.length());
        }
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationTimeInHours = expirationTimeInHours;
    }

    /**
     * ユーザーIDからJWTトークンを生成
     * 
     * @param userId ユーザーID
     * @return JWT トークン
     */
    public String generateToken(String userId) {
        Instant now = Instant.now();
        Instant expiration = now.plus(expirationTimeInHours, ChronoUnit.HOURS);

        return Jwts.builder()
                .subject(userId)
                .claim("userId", userId)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(secretKey)
                .compact();
    }

    /**
     * JWTトークンからユーザーIDを取得
     * 
     * @param token JWT トークン
     * @return ユーザーID
     * @throws JwtException トークンが無効な場合
     */
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get("userId", String.class);
    }

    /**
     * JWTトークンの有効性を検証
     * 
     * @param token JWT トークン
     * @return トークンが有効な場合 true
     */
    public boolean validateToken(String token) {
        try {
            // トークンの署名・構造がただしいか、有効期限が切れていないかを確認
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            // 無効な JWT 署名または構造
            return false;
        } catch (ExpiredJwtException e) {
            // 期限切れ JWT
            return false;
        } catch (UnsupportedJwtException e) {
            // サポートされていない JWT
            return false;
        } catch (IllegalArgumentException e) {
            // JWT が null または空
            return false;
        }
    }

    /**
     * Authorization ヘッダーからトークンを抽出
     * 
     * @param authorizationHeader Authorization ヘッダーの値
     * @return JWT トークン、または null
     */
    public String extractTokenFromHeader(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
}