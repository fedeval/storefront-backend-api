CREATE TABLE order_details (
  id SERIAL PRIMARY KEY,
  product_id BIGINT,
  quantity INTEGER,
  user_id BIGINT,
  CONSTRAINT fk_product
  FOREIGN KEY(product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user
  FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);