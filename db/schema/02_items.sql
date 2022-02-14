
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  category_type VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS items CASCADE;
CREATE TABLE items (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  category_id INTEGER REFERENCES categories(id),
  title VARCHAR(255) NOT NULL,
  date_created TIMESTAMP DEFAULT NOW(),
  -- reminder_time DATE,
  is_active BOOLEAN DEFAULT TRUE
);
