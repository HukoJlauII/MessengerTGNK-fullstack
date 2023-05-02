package com.example.messengertgnk.repository;

import com.example.messengertgnk.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;


@RepositoryRestResource(collectionResourceRel = "messages", path = "messages")
@Repository
@CrossOrigin(origins = "http://localhost:3000")
public interface MessageRepository extends JpaRepository<Message, Long> {

    @RestResource(path = "/messagesInDialog")
    @Query("select m from message m where (m.sender.id = ?1 and m.receiver.id = ?2) or (m.sender.id = ?2 and m.receiver.id = ?1) order by m.sendTime desc")
    Page<Message> findMessagesBySenderAndReceiver(Long sender, Long receiver,
                                                  Pageable pageable);

    @Query("select m from message m where (m.sender.id = ?1 and m.receiver.id = ?2) or (m.sender.id = ?2 and m.receiver.id = ?1) order by m.sendTime desc")
    List<Message> findMessagesBySenderAndReceiverOrderBySendTimeDesc(Long sender, Long receiver);


}