package com.example.messengertgnk.controller;

import com.example.messengertgnk.entity.Message;
import com.example.messengertgnk.entity.User;
import com.example.messengertgnk.service.MessageService;
import com.example.messengertgnk.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @MessageMapping("chat.send/{sender}/{receiver}")
    @SendTo("/topic/{sender}/{receiver}")
    public Message sendMessage(@Payload Message message) {
        return messageService.save(message);
    }

    @MessageMapping("chat.delete/{roomId}")
    @SendTo("/topic/{roomId}")
    public void deleteMessage(@Payload Message message) {
        messageService.deleteMessageById(message.getId());
    }

    @ResponseBody
    @GetMapping("/api/user/dialogs")
    public ResponseEntity<?> showAllUserDialogs(Authentication authentication) {
        User user = userService.getUserAuth(authentication);
        List<User> users = userService.findAll();
        List<Message> messages =
                users.stream().filter((receiver) -> messageService.findMessageBySenderAndReceiverOrderBySendTime(user, receiver).isPresent()).map((receiver) -> messageService.findMessageBySenderAndReceiverOrderBySendTime(user, receiver).get()).toList();
        return ResponseEntity.ok(messages);
    }
}
