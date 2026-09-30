-- Clear existing data
TRUNCATE TABLE Notifications, Complaints, LeaveRequests, Examinations, LibraryRecords, Scholarships, Certificates, BusApplications, BusRoutes, HostelApplications, HostelRooms, RegistrationSubjects, Registrations, Subjects, Semesters, BankTransactions, FeeReceipts, Students, Admins, Departments, Users RESTART IDENTITY CASCADE;

-- Insert Users
-- Passwords are set to 'password' for demo purposes, hash these in production!
INSERT INTO Users (username, password_hash, role) VALUES
('BITM2026DS001', '$2b$10$3qwpDDDBxX1fdWTq4P/aROyuXiqKYy7sgN/cH7SljCgs74qUhKxxi', 'STUDENT'),
('admin123', '$2b$10$3qwpDDDBxX1fdWTq4P/aROyuXiqKYy7sgN/cH7SljCgs74qUhKxxi', 'ADMIN'),
('finance_admin', '$2b$10$3qwpDDDBxX1fdWTq4P/aROyuXiqKYy7sgN/cH7SljCgs74qUhKxxi', 'SUPERADMIN');

-- Insert Departments
INSERT INTO Departments (name, code) VALUES
('Computer Science and Engineering (Data Science)', 'CSE-DS'),
('Electronics and Communication Engineering', 'ECE'),
('Mechanical Engineering', 'ME');

-- Insert Students
INSERT INTO Students (register_number, user_id, name, department_id, current_semester, academic_year) VALUES
('BITM2026DS001', 1, 'Aparna Yadavalli', 1, 3, '2026-27');

-- Insert Admins
INSERT INTO Admins (user_id, name, department_role) VALUES
(2, 'Mr. Ramesh', 'Academic'),
(3, 'Mrs. Lakshmi', 'Finance');

-- Insert Semesters
INSERT INTO Semesters (semester_number, academic_year, is_active) VALUES
(1, '2025-26', false),
(2, '2025-26', false),
(3, '2026-27', true),
(4, '2026-27', false);

-- Insert Subjects for Semester 3 (CSE-DS)
INSERT INTO Subjects (semester_id, department_id, subject_code, subject_name, credits) VALUES
(3, 1, '21CS31', 'Transform Calculus and Numerical Methods', 3),
(3, 1, '21CS32', 'Data Structures and Applications', 4),
(3, 1, '21CS33', 'Analog and Digital Electronics', 4),
(3, 1, '21CS34', 'Computer Organization and Architecture', 3);

-- Insert Demo Fee Receipt
INSERT INTO FeeReceipts (student_register_number, receipt_number, fee_category, amount, payment_date, document_url, status) VALUES
('BITM2026DS001', 'RCPT-2026-001', 'Tuition Fee', 45000.00, '2026-08-15', '/demo/receipt1.pdf', 'Pending'),
('BITM2026DS001', 'RCPT-2026-002', 'Hostel Fee', 60000.00, '2026-08-16', '/demo/receipt2.pdf', 'Verified');

-- Insert Demo Bank Transaction
INSERT INTO BankTransactions (student_register_number, bank_name, account_holder_name, utr_number, transaction_date, amount, payment_type, screenshot_url, fee_receipt_id, status) VALUES
('BITM2026DS001', 'State Bank of India', 'Aparna Yadavalli', 'SBIN123456789', '2026-08-15', 45000.00, 'NEFT', '/demo/screenshot1.jpg', 1, 'Pending');

-- Insert Hostel Rooms
INSERT INTO HostelRooms (building_name, room_number, capacity, occupancy) VALUES
('Girls Hostel A', '101', 2, 0),
('Girls Hostel A', '102', 3, 1),
('Boys Hostel B', '201', 4, 4);

-- Insert Bus Routes
INSERT INTO BusRoutes (route_name, pickup_points, bus_fee) VALUES
('Route 1 - City Center', 'Cantonment, Bus Stand, SP Circle, College', 15000.00),
('Route 2 - Cantonment', 'Railway Station, Patel Nagar, College', 12000.00);

-- Insert Notifications for student
INSERT INTO Notifications (user_id, title, message) VALUES
(1, 'Welcome', 'Welcome to the BITM Student Portal!'),
(1, 'Fee Payment Received', 'Your Hostel Fee payment of ₹60,000 has been verified.');
