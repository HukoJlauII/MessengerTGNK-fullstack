package com.example.messengertgnk.repository;

import com.example.messengertgnk.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;


@Repository
@CrossOrigin(origins = "http://localhost:3000")
@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Optional<User> findUserByUsername(String username);

    Optional<User> findUserBySessionId(String sessionId);

    @Query("""
            select u from User u
            where upper(u.username) like upper(concat('%',?1, '%'))""")
    @RestResource(path = "/usersInChat")
    Page<User> findByUsernameStartsWithIgnoreCaseOrUsernameEndsWithIgnoreCase(String username, Pageable pageable);

    @Override
    List<User> findAll();
}
