package com.example.messengertgnk.service;

import com.example.messengertgnk.entity.Message;
import com.example.messengertgnk.entity.User;
import com.example.messengertgnk.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@Transactional
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public Message save(Message message) {
        return messageRepository.save(message);
    }

    public Optional<Message> findMessageBySenderAndReceiverOrderBySendTime(User sender, User receiver) {
        return messageRepository.findMessagesBySenderAndReceiverOrderBySendTimeDesc(sender.getId(), receiver.getId()).stream().findFirst();
    }

    public void deleteMessageById(Long id) {
        if (messageRepository.findById(id).isPresent()) {
            messageRepository.deleteById(id);
        }
    }
}
