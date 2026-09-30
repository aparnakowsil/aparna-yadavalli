CREATE TABLE HostelRooms (
    id SERIAL PRIMARY KEY,
    building_name VARCHAR(100) NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    capacity INTEGER NOT NULL,
    occupancy INTEGER DEFAULT 0,
    UNIQUE (building_name, room_number)
);

CREATE TABLE HostelApplications (
    id SERIAL PRIMARY KEY,
    student_register_number VARCHAR(50) REFERENCES Students(register_number),
    preference VARCHAR(100),
    allocated_room_id INTEGER REFERENCES HostelRooms(id),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Allocated')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE BusRoutes (
    id SERIAL PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    pickup_points TEXT NOT NULL, -- comma separated
    bus_fee NUMERIC(10,2) NOT NULL
);

CREATE TABLE BusApplications (
    id SERIAL PRIMARY KEY,
    student_register_number VARCHAR(50) REFERENCES Students(register_number),
    route_id INTEGER REFERENCES BusRoutes(id),
    pickup_point VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Certificates (
    id SERIAL PRIMARY KEY,
    student_register_number VARCHAR(50) REFERENCES Students(register_number),
    certificate_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Ready', 'Rejected')),
    download_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Scholarships (
    id SERIAL PRIMARY KEY,
    student_register_number VARCHAR(50) REFERENCES Students(register_number),
    scholarship_name VARCHAR(100) NOT NULL,
    document_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Under Review', 'Approved', 'Rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LibraryRecords (
    id SERIAL PRIMARY KEY,
    student_register_number VARCHAR(50) REFERENCES Students(register_number),
    book_name VARCHAR(200) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE Examinations (
    id SERIAL PRIMARY KEY,
    student_register_number VARCHAR(50) REFERENCES Students(register_number),
    semester_id INTEGER REFERENCES Semesters(id),
    exam_type VARCHAR(50),
    hall_ticket_url VARCHAR(255),
    result_url VARCHAR(255)
);

CREATE TABLE LeaveRequests (
    id SERIAL PRIMARY KEY,
    student_register_number VARCHAR(50) REFERENCES Students(register_number),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    document_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Complaints (
    id SERIAL PRIMARY KEY,
    student_register_number VARCHAR(50) REFERENCES Students(register_number),
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    evidence_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
