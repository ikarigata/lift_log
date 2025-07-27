package com.ikr.lift_log.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT認証フィルター
 * リクエストのAuthorizationヘッダーからJWTトークンを抽出し、検証する
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");
        String token = jwtTokenProvider.extractTokenFromHeader(authorizationHeader);

        // 正しく自分が発行したJWTトークンであれば認証とする
        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                String userId = jwtTokenProvider.getUserIdFromToken(token);
                JwtAuthenticationToken authentication = new JwtAuthenticationToken(token, userId);
                // ここでsetAuthenticationする⇒SecurityFilterChainのAuthenticatedにしているURLにもアクセスできる
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                // トークン解析エラーの場合は認証をクリア
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}