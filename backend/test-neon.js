// Test NEON PostgreSQL connection
require('dotenv').config();
const { sequelize, testConnection } = require('./src/config/database');

async function runTest() {
    console.log('Testing NEON PostgreSQL connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set');
    
    try {
        await testConnection();
        
        // Check if tables exist
        const [results] = await sequelize.query(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
        );
        console.log('Tables in database:', results.map(r => r.tablename).join(', ') || 'No tables found');
        
        // Check row counts
        const tables = ['users', 'admins', 'categories', 'products', 'orders'];
        for (const table of tables) {
            try {
                const [[{ count }]] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`  - ${table}: ${count} rows`);
            } catch (e) {
                console.log(`  - ${table}: table not found`);
            }
        }
        
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('ERROR:', error.message);
        process.exit(1);
    }
}

runTest();
