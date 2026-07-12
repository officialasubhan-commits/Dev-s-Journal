// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    connectionString: "postgresql://postgres:Ratul%402007%23%23@localhost:5432/postgres"
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL successfully!");
    
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'boss_journal'");
    if (res.rows.length === 0) {
      console.log("Creating database 'boss_journal'...");
      await client.query('CREATE DATABASE boss_journal');
      console.log("Database created successfully!");
    } else {
      console.log("Database 'boss_journal' already exists.");
    }
  } catch (err) {
    console.error("Error connecting to PostgreSQL:", err.message);
  } finally {
    await client.end();
  }
}

createDatabase();
