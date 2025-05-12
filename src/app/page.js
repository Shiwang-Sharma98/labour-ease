import { sql } from "@vercel/postgres";
import Home from "./components/Home";

// Function to run migrations (create tables, indexes, triggers)
async function runMigrations() {
  try {
    // Create verification_tokens table
    await sql`CREATE TABLE IF NOT EXISTS verification_tokens (
      email VARCHAR(255) PRIMARY KEY,
      token VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL
    );`;

    // Create pending_users table
    await sql`CREATE TABLE IF NOT EXISTS pending_users (
      id BIGINT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    // Indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_pending_users_email ON pending_users(email);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON verification_tokens(email);`;

    // Create or replace function for cleaning expired tokens
    await sql`CREATE OR REPLACE FUNCTION delete_expired_tokens()
    RETURNS TRIGGER AS $$
    BEGIN
      DELETE FROM verification_tokens WHERE expires_at < NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`;

    // Check if trigger already exists before creating
    const triggerExists = await sql`
      SELECT 1 FROM information_schema.triggers
      WHERE event_object_table = 'verification_tokens'
      AND trigger_name = 'clean_expired_tokens';
    `;

    // Create trigger only if it doesn't exist
    if (triggerExists.rowCount === 0) {
      await sql`CREATE TRIGGER clean_expired_tokens
      AFTER INSERT ON verification_tokens
      FOR EACH ROW
      EXECUTE FUNCTION delete_expired_tokens();`;
    }

  } catch (error) {
    console.error('Migration error:', error);
    // Optionally, you might want to handle or rethrow the error
    throw error;
  }
}

export default async function Main() {
  // Run migrations whenever the page is hit
  await runMigrations();

  return (
    <main>
      <Home />
    </main>
  );
}