CREATE TABLE articles (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  destination VARCHAR(150) NOT NULL,
  pays        VARCHAR(100) NOT NULL,
  date_voyage DATE         NOT NULL,
  recit       TEXT         NOT NULL,
  emoji       VARCHAR(10)  DEFAULT '✈️',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Quelques articles de test pour démarrer :
INSERT INTO articles (destination, pays, date_voyage, recit, emoji) VALUES
('Tokyo', 'Japon', '2024-03-15', 'Ville incroyable, mélange de tradition et modernité. Les temples shintoïstes côtoient les gratte-ciels.', '🇯🇵'),
('Lisbonne', 'Portugal', '2024-07-20', 'La ville aux 7 collines. Les tramways, les azulejos et les pastéis de nata... inoubliable.', '🇵🇹');