const bcrypt = require('bcrypt');
const fs = require('fs');

async function updatePasswords() {
    const seedFile = 'seed.sql';
    let seedContent = fs.readFileSync(seedFile, 'utf8');

    const hashedPassword = await bcrypt.hash('password', 10);

    seedContent = seedContent.replace(
        /INSERT INTO Users \(username, password_hash, role\) VALUES[\s\S]*?\('finance_admin', 'password', 'SUPERADMIN'\);/,
        `INSERT INTO Users (username, password_hash, role) VALUES
('BITM2026DS001', '${hashedPassword}', 'STUDENT'),
('admin123', '${hashedPassword}', 'ADMIN'),
('finance_admin', '${hashedPassword}', 'SUPERADMIN');`
    );

    fs.writeFileSync(seedFile, seedContent);
    console.log('Updated passwords in seed.sql');
}

updatePasswords();
