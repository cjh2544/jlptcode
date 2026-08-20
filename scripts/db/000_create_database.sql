-- Run once as a MariaDB admin (root), then grant the app user.
-- The jlptcode app user cannot create this database itself.

CREATE DATABASE IF NOT EXISTS `jlptcode`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON `jlptcode`.* TO 'jlptcode'@'localhost';
GRANT ALL PRIVILEGES ON `jlptcode`.* TO 'jlptcode'@'%';
FLUSH PRIVILEGES;
