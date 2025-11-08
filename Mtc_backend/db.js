const { Pool } = require('pg');

// -----------------------------------------------------------------
// CRITICAL: Update the 'user' and 'password' fields below 
// with your actual PostgreSQL credentials.
// -----------------------------------------------------------------
const config = {
  // Try 'postgres' as the default user if you didn't create a custom one.
  user: 'postgres',           
  host: 'localhost',
  // Ensure the database name matches what you created exactly (case sensitive).
  database: 'mtc_bus', 
  // IMPORTANT: Replace this with your PostgreSQL master password.
  password: 'Shanmugavel@123', 
  port: 5432, // Default PostgreSQL port
};

const pool = new Pool(config);

// -----------------------------------------------------------------
// Connection Test: Connect once to ensure credentials are correct
// -----------------------------------------------------------------
async function testDbConnection() {
    let client;
    try {
        client = await pool.connect();
        console.log('✅ PostgreSQL database connected successfully to:', config.database);
        // Ensure the client is released back to the pool immediately after the test
        client.release(); 
    } catch (error) {
        console.error('----------------------------------------------------');
        console.error('❌ DATABASE CONNECTION FAILED AT STARTUP ❌');
        // The password authentication error code is '28P01'
        console.error(`Error Code: ${error.code} | Message: ${error.message}`);
        console.error('Please check db.js credentials (user/password) and ensure PostgreSQL is running.');
        console.error('----------------------------------------------------');
        // If connection fails, throw the error to stop the server from proceeding
        throw error; 
    }
}

// Execute the connection test when the module loads
testDbConnection();

// Export the pool instance so server.js can use it for queries
module.exports = pool;
