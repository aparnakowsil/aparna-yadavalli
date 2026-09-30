CREATE TABLE FeeReceipts (
    id SERIAL PRIMARY KEY,
    student_register_number VARCHAR(50) REFERENCES Students(register_number),
    receipt_number VARCHAR(100) NOT NULL,
    fee_category VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Under Review', 'Verified', 'Rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE BankTransactions (
    id SERIAL PRIMARY KEY,
    student_register_number VARCHAR(50) REFERENCES Students(register_number),
    bank_name VARCHAR(100) NOT NULL,
    account_holder_name VARCHAR(100) NOT NULL,
    utr_number VARCHAR(100) UNIQUE NOT NULL,
    transaction_date DATE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_type VARCHAR(50),
    screenshot_url VARCHAR(255) NOT NULL,
    fee_receipt_id INTEGER REFERENCES FeeReceipts(id),
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Under Review', 'Verified', 'Failed', 'Requires Correction')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Semesters (
    id SERIAL PRIMARY KEY,
    semester_number INTEGER NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT false
);

CREATE TABLE Subjects (
    id SERIAL PRIMARY KEY,
    semester_id INTEGER REFERENCES Semesters(id),
    department_id INTEGER REFERENCES Departments(id),
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL
);

CREATE TABLE Registrations (
    id SERIAL PRIMARY KEY,
    student_register_number VARCHAR(50) REFERENCES Students(register_number),
    semester_id INTEGER REFERENCES Semesters(id),
    status VARCHAR(20) DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Submitted', 'Approved', 'Rejected')),
    registration_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RegistrationSubjects (
    registration_id INTEGER REFERENCES Registrations(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES Subjects(id),
    PRIMARY KEY (registration_id, subject_id)
);
