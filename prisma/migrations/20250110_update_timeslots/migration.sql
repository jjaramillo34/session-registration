-- Delete existing time slots
DELETE FROM "TimeSlot";

-- February 11, 2025 (Tuesday) - Daytime slots
INSERT INTO "TimeSlot" (date, time, capacity, available, "sessionType", "createdAt", "updatedAt") VALUES
('2025-02-11', '11:00', 2, true, 'daytime', NOW(), NOW()),
('2025-02-11', '11:30', 2, true, 'daytime', NOW(), NOW()),
('2025-02-11', '12:00', 2, true, 'daytime', NOW(), NOW()),
('2025-02-11', '12:30', 2, true, 'daytime', NOW(), NOW()),
('2025-02-11', '13:00', 2, true, 'daytime', NOW(), NOW()),
('2025-02-11', '13:30', 2, true, 'daytime', NOW(), NOW());

-- February 11, 2025 (Tuesday) - Evening slots
INSERT INTO "TimeSlot" (date, time, capacity, available, "sessionType", "createdAt", "updatedAt") VALUES
('2025-02-11', '17:30', 2, true, 'evening', NOW(), NOW()),
('2025-02-11', '18:00', 2, true, 'evening', NOW(), NOW()),
('2025-02-11', '18:30', 2, true, 'evening', NOW(), NOW());

-- February 12, 2025 (Wednesday) - Daytime slots
INSERT INTO "TimeSlot" (date, time, capacity, available, "sessionType", "createdAt", "updatedAt") VALUES
('2025-02-12', '11:00', 2, true, 'daytime', NOW(), NOW()),
('2025-02-12', '11:30', 2, true, 'daytime', NOW(), NOW()),
('2025-02-12', '12:00', 2, true, 'daytime', NOW(), NOW()),
('2025-02-12', '12:30', 2, true, 'daytime', NOW(), NOW()),
('2025-02-12', '13:00', 2, true, 'daytime', NOW(), NOW()),
('2025-02-12', '13:30', 2, true, 'daytime', NOW(), NOW());

-- February 12, 2025 (Wednesday) - Evening slots
INSERT INTO "TimeSlot" (date, time, capacity, available, "sessionType", "createdAt", "updatedAt") VALUES
('2025-02-12', '17:30', 2, true, 'evening', NOW(), NOW()),
('2025-02-12', '18:00', 2, true, 'evening', NOW(), NOW()),
('2025-02-12', '18:30', 2, true, 'evening', NOW(), NOW());

-- February 13, 2025 (Thursday) - Daytime slots
INSERT INTO "TimeSlot" (date, time, capacity, available, "sessionType", "createdAt", "updatedAt") VALUES
('2025-02-13', '11:00', 2, true, 'daytime', NOW(), NOW()),
('2025-02-13', '11:30', 2, true, 'daytime', NOW(), NOW()),
('2025-02-13', '12:00', 2, true, 'daytime', NOW(), NOW()),
('2025-02-13', '12:30', 2, true, 'daytime', NOW(), NOW()),
('2025-02-13', '13:00', 2, true, 'daytime', NOW(), NOW()),
('2025-02-13', '13:30', 2, true, 'daytime', NOW(), NOW());

-- February 13, 2025 (Thursday) - Evening slots
INSERT INTO "TimeSlot" (date, time, capacity, available, "sessionType", "createdAt", "updatedAt") VALUES
('2025-02-13', '17:30', 2, true, 'evening', NOW(), NOW()),
('2025-02-13', '18:00', 2, true, 'evening', NOW(), NOW()),
('2025-02-13', '18:30', 2, true, 'evening', NOW(), NOW()); 