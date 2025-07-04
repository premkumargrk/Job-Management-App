const fs = require('fs');
const path = require('path');

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('📥 Reading cities.json...');
    const rawData = fs.readFileSync(path.join(__dirname, 'cities.json'), 'utf-8');
    const cities = JSON.parse(rawData);

    console.log('🔄 Creating locations table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `);

    console.log('🧱 Creating jobs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
        job_type VARCHAR(50) CHECK (job_type IN ('FullTime', 'PartTime', 'Contract', 'Internship')) NOT NULL,
        salary_min INTEGER NOT NULL,
        salary_max INTEGER NOT NULL,
        description TEXT,
        deadline DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('🚀 Inserting city names...');
    for (const { city } of cities) {
      await client.query(
        `INSERT INTO locations (name)
         VALUES ($1)
         ON CONFLICT (name) DO NOTHING`,
        [city]
      );
    }

    console.log('🚀 Inserting Jobs...');
    await client.query(
        `
        INSERT INTO jobs (
          title,company_name,location_id,job_type,salary_min,salary_max,description,deadline
        ) VALUES
        (
          'NodeJs Developer',
          'Tesla',
          713,
          'FullTime',
          45000,
          70000,
          'Proficient in both frontend (React, Next.js) and backend (Node.js, NestJS) technologies.
          Hands-on experience with databases like PostgreSQL and MongoDB.
          Solid understanding of RESTful APIs, JWT authentication, and Git workflows.',
          CURRENT_DATE + INTERVAL '50 days'
        ),
        (
          'Backend Developer',
          'swiggy',
          1146,
          'FullTime',
          200000,
          600000,
          'We are hiring a Backend Developer to build robust and scalable server-side applications. The role involves API development, database design, and ensuring high system performance. Experience with modern backend frameworks is preferred.',
          CURRENT_DATE + INTERVAL '60 days'
        ),
        (
          'Fullstack Developer',
          'Amazon',
          141,
          'FullTime',
          25000,
          55000,
          'Proficient in both frontend (React, Next.js) and backend (Node.js, NestJS) technologies.
          Hands-on experience with databases like PostgreSQL and MongoDB.
          Solid understanding of RESTful APIs, JWT authentication, and Git workflows.',
          CURRENT_DATE + INTERVAL '75 days'
        ),
        (
          'UI / UX Developer',
          'AHInfosea',
          1214,
          'FullTime',
          100000,
          500000,
          'Proficient in both frontend (React, Next.js) and backend (Node.js, NestJS) technologies.
          Hands-on experience with databases like PostgreSQL and MongoDB.
          Solid understanding of RESTful APIs, JWT authentication, and Git workflows.',
          CURRENT_DATE + INTERVAL '65 days'
        ),
        (
          'Java Developer',
          'Microsoft',
          1163,
          'FullTime',
          50000,
          300000,
          'Proficient in both frontend (React, Next.js) and backend (Node.js, NestJS) technologies.
          Hands-on experience with databases like PostgreSQL and MongoDB.
          Solid understanding of RESTful APIs, JWT authentication, and Git workflows.',
          CURRENT_DATE + INTERVAL '80 days'
        ),
        (
          'Mobile App Developer',
          'Amazon',
          1163,
          'FullTime',
          35000,
          80000,
          'Proficient in both frontend (React, Next.js) and backend (Node.js, NestJS) technologies.
          Hands-on experience with databases like PostgreSQL and MongoDB.
          Solid understanding of RESTful APIs, JWT authentication, and Git workflows.',
          CURRENT_DATE + INTERVAL '55 days'
      );`
    );
    console.log('✅ Database seeded successfully.');
  } catch (err) {
    console.log('❌ Error seeding database:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedDatabase();
