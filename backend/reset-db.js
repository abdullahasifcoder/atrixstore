// Reset NEON database, run migrations, and seed data
require('dotenv').config();
const { sequelize } = require('./src/config/database');
const { execSync } = require('child_process');

async function resetDatabase() {
    console.log('🔄 Resetting NEON PostgreSQL database...\n');
    
    try {
        // Step 1: Drop and recreate schema
        console.log('📦 Step 1/3: Dropping schema...');
        await sequelize.query('DROP SCHEMA public CASCADE;');
        await sequelize.query('CREATE SCHEMA public;');
        await sequelize.query('GRANT ALL ON SCHEMA public TO neondb_owner;');
        await sequelize.query('GRANT ALL ON SCHEMA public TO public;');
        console.log('✅ Schema reset complete\n');
        
        // Close sequelize connection before running CLI commands
        await sequelize.close();
        
        // Step 2: Run migrations
        console.log('📦 Step 2/3: Running migrations...');
        execSync('npx sequelize-cli db:migrate', { 
            stdio: 'inherit',
            cwd: __dirname 
        });
        console.log('✅ Migrations complete\n');
        
        // Step 3: Run seeders
        console.log('📦 Step 3/3: Seeding data...');
        execSync('npx sequelize-cli db:seed:all', { 
            stdio: 'inherit',
            cwd: __dirname 
        });
        console.log('\n✅ Database reset and seeding complete!');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        process.exit(1);
    }
}

resetDatabase();
