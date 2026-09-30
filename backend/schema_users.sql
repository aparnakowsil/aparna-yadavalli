CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'ADMIN', 'SUPERADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE Students (
    register_number VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES Departments(id),
    current_semester INTEGER NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    profile_photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Admins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    department_role VARCHAR(50) NOT NULL, -- e.g., Finance, Academic, Hostel, Transport, General
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
