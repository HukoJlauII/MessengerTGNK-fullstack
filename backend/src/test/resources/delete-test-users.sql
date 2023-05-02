DELETE FROM jpa.user_role WHERE user_id IN (SELECT id FROM jpa.users);
DELETE FROM jpa.users;
