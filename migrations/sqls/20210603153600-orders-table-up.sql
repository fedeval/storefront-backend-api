CREATE TYPE status AS ENUM ('active', 'complete');

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  currentStatus status NOT NULL,
  userId BIGINT NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY(userId)
      REFERENCES users(id)
      ON DELETE CASCADE
);