const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🚀 Starting MySQL database setup...');
    
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Read and execute the schema file
    const schemaPath = path.join(__dirname, 'mysql_schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    console.log('📄 Executing database schema...');
    await connection.execute(schema);
    
    console.log('✅ Database schema created successfully');
    console.log('🎉 MySQL database setup completed!');
    
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with correct MySQL credentials');
    console.log('2. Run: npm install');
    console.log('3. Run: npm start');
    console.log('\n💡 Sample .env configuration:');
    console.log('DB_HOST=localhost');
    console.log('DB_USER=root');
    console.log('DB_PASSWORD=your_password');
    console.log('DB_NAME=wanderwise');
    console.log('DB_PORT=3306');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n🔧 Fix: Check your MySQL credentials in .env file');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Fix: Make sure MySQL server is running');
    } else if (error.code === 'ENOENT') {
      console.log('\n🔧 Fix: mysql_schema.sql file not found');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;