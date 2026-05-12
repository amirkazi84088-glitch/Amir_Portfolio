// scripts/init-db.js
// Run: node scripts/init-db.js
// This creates all required tables in your MySQL database

const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

async function init() {
  // Support Railway env var formats (with and without underscore)
  const url = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL || process.env.DATABASE_URL

  let connConfig
  if (url && url.startsWith('mysql')) {
    console.log('Using MYSQL_PUBLIC_URL connection string')
    connConfig = { uri: url, ssl: { rejectUnauthorized: false } }
  } else {
    const host = process.env.MYSQLHOST || process.env.MYSQL_HOST || 'localhost'
    const port = parseInt(process.env.MYSQLPORT || process.env.MYSQL_PORT || '3306')
    const user = process.env.MYSQLUSER || process.env.MYSQL_USER || 'root'
    const password = process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || ''
    const database = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway'
    console.log(`Connecting to ${host}:${port} db=${database}`)
    connConfig = { host, port, user, password, database, ssl: { rejectUnauthorized: false } }
  }

  const conn = await mysql.createConnection(connConfig)

  console.log('✅ Connected to MySQL')

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      tech_stack VARCHAR(500),
      demo_url VARCHAR(500),
      github_url VARCHAR(500),
      category VARCHAR(100),
      emoji VARCHAR(10) DEFAULT '🚀',
      visible TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      summary TEXT,
      content LONGTEXT NOT NULL,
      category VARCHAR(100),
      read_time VARCHAR(50) DEFAULT '5 min read',
      emoji VARCHAR(10) DEFAULT '✍️',
      visible TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS visitors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      visitor_id VARCHAR(36) NOT NULL,
      ip_address VARCHAR(100),
      country VARCHAR(100),
      city VARCHAR(100),
      region VARCHAR(100),
      user_agent TEXT,
      browser VARCHAR(100),
      os VARCHAR(100),
      device VARCHAR(50),
      referrer VARCHAR(500),
      page_visited VARCHAR(500),
      visit_count INT DEFAULT 1,
      first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_visitor_id (visitor_id),
      INDEX idx_ip (ip_address),
      INDEX idx_last_seen (last_seen)
    )
  `)

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'amirkazi84088@gmail.com'
  const adminPass = 'amirkazi' // default — CHANGE THIS!
  const hash = await bcrypt.hash(adminPass, 12)

  const [existing] = await conn.execute('SELECT id FROM admin_users WHERE email = ?', [adminEmail])
  if (existing.length === 0) {
    await conn.execute('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)', [adminEmail, hash])
    console.log(`✅ Admin created: ${adminEmail}`)
    console.log(`⚠️  Default password: ${adminPass} — CHANGE THIS in the admin panel!`)
  } else {
    console.log('ℹ️  Admin user already exists')
  }

  // Seed sample projects
  const [proj] = await conn.execute('SELECT COUNT(*) as cnt FROM projects')
  if (proj[0].cnt === 0) {
    await conn.execute(`INSERT INTO projects (title, description, tech_stack, demo_url, github_url, category, emoji) VALUES
      ('Work Permit Management System', 'Industrial WPMS with 6 roles, 3-level approval workflow, and email notifications. Built with Team Error 404.', 'Spring Boot,Angular,MySQL', '#', '#', 'Full Stack', '🔐'),
      ('Personal Portfolio Website', 'Animated portfolio with particle effects, admin panel, and full CRUD functionality.', 'Next.js,React,Tailwind', '#', '#', 'Frontend', '🌐'),
      ('Security Research Lab', 'CTF writeups and vulnerability research. Exploring OWASP Top 10 with hands-on exploitation.', 'Python,Kali Linux,Burp Suite', '#', '#', 'Security', '🛡️')
    `)
    console.log('✅ Sample projects seeded')
  }

  // Seed sample blogs
  const [bl] = await conn.execute('SELECT COUNT(*) as cnt FROM blogs')
  if (bl[0].cnt === 0) {
    await conn.execute(`INSERT INTO blogs (title, slug, summary, content, category, read_time, emoji) VALUES
      ('Understanding SQL Injection: A Developer Guide', 'sql-injection-guide', 'How SQL injection works and how to prevent it in Spring Boot.', '<h2>What is SQL Injection?</h2><p>SQL Injection is one of the most common and dangerous web vulnerabilities. It allows attackers to interfere with the queries that an application makes to its database.</p><h2>How it Works</h2><p>When user input is not properly sanitized, an attacker can inject malicious SQL code into a query. For example, a login form that uses string concatenation is vulnerable.</p><h2>Prevention in Spring Boot</h2><p>Always use Prepared Statements or JPA repositories. Never concatenate user input directly into SQL queries. Enable input validation at the API layer.</p>', 'Security', '5 min read', '🔒'),
      ('Building Secure REST APIs with Spring Boot & JWT', 'secure-rest-api-jwt', 'Step-by-step guide to JWT authentication and authorization in Spring Boot.', '<h2>Why JWT?</h2><p>JSON Web Tokens provide a stateless, scalable authentication mechanism for REST APIs. They encode user identity and permissions in a signed token.</p><h2>Implementation</h2><p>Add Spring Security and jjwt dependencies. Create a JwtFilter that validates tokens on every request. Store only non-sensitive data in the token payload.</p><h2>Best Practices</h2><p>Use short expiry times (15-60 minutes) with refresh tokens. Always sign with a strong secret. Never store JWTs in localStorage — use httpOnly cookies.</p>', 'Development', '7 min read', '⚡'),
      ('My First CTF Win: Lessons from the Trenches', 'first-ctf-win', 'Walkthrough of my first Capture The Flag competition and lessons learned.', '<h2>Getting Started with CTF</h2><p>Capture The Flag competitions are one of the best ways to learn offensive security. They present real-world scenarios in a controlled environment.</p><h2>Tools I Used</h2><p>Burp Suite for web challenges, Ghidra for reverse engineering, and John the Ripper for cryptography. The key is knowing which tool fits which challenge.</p><h2>Key Takeaways</h2><p>Read the challenge description carefully. Start with easy points. Google is your friend — the security community shares knowledge freely. Never give up on a challenge until the very end.</p>', 'CTF', '4 min read', '🎯')
    `)
    console.log('✅ Sample blogs seeded')
  }

  await conn.end()
  console.log('🎉 Database initialized successfully!')
}

init().catch(err => {
  console.error('❌ DB init failed:', err.message)
  process.exit(1)
})

// This function adds new tables — safe to run multiple times
async function addNewTables(conn) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS skills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      percentage INT DEFAULT 80,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(500),
      message TEXT NOT NULL,
      is_read TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      key_name VARCHAR(100) NOT NULL UNIQUE,
      value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)

  // Seed default skills
  const [sc] = await conn.execute('SELECT COUNT(*) as cnt FROM skills')
  if (sc[0].cnt === 0) {
    await conn.execute(`INSERT INTO skills (name, category, percentage, sort_order) VALUES
      ('Penetration Testing', 'Security', 80, 1),
      ('Network Security', 'Security', 75, 2),
      ('OWASP / Web Security', 'Security', 78, 3),
      ('Spring Boot / Java', 'Backend', 85, 4),
      ('Angular / TypeScript', 'Frontend', 80, 5),
      ('MySQL / JPA', 'Database', 82, 6)
    `)
    console.log('Skills seeded')
  }
  console.log('New tables created')
}
