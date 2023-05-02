package com.example.messengertgnk.configuration;

import com.example.messengertgnk.entity.User;
import com.example.messengertgnk.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDateTime;

/**
 * The type Web socket event listener.
 */
@Component
public class WebSocketEventListener {
    @Autowired
    private UserService userService;

    @EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        StompHeaderAccessor stompAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = stompAccessor.getNativeHeader("user").get(0);
        User user = userService.findUserByUsername(username);
        String sessionId = stompAccessor.getSessionId();
        user.setSessionId(sessionId);
        user.setLastOnline(null);
        userService.save(user);
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor stompAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = stompAccessor.getSessionId();
        User user = userService.findUserBySessionId(sessionId);
        if (user != null) {
            user.setSessionId(null);
            user.setLastOnline(LocalDateTime.now());
            userService.save(user);
        }
    }
}
