-- Delete existing crawls
DELETE FROM "Crawl";

-- Insert Manhattan crawls
INSERT INTO "Crawl" (name, location, address, date, time, capacity, available, coordinates, description, "createdAt", "updatedAt") VALUES
-- Manhattan 1
('Manhattan 1', 'Harlem Renaissance HS', '22 East 128th St, New York, NY 10035', '2025-02-28', '09:00', 10, true, ARRAY[-73.9397, 40.8079], 'Visit our LYFE Program and Pathways to Graduation facilities at Harlem Renaissance High School', NOW(), NOW()),

-- Manhattan 2
('Manhattan 2', 'ReSTART Academy & LYFE Program', '145 Stanton St & 198 Forsyth St, New York, NY 10002', '2025-02-28', '09:00', 10, true, ARRAY[-73.9839, 40.7194], 'Visit two locations: ReSTART Academy at Lower East Preparatory HS (145 Stanton St) and LYFE Program/Pathways to Graduation at Jeffrey C. Tenzer (198 Forsyth St)', NOW(), NOW()),

-- Manhattan 3
('Manhattan 3', 'COOP TECH & JSK', '321 East 96th St, New York, NY 10128', '2025-02-28', '09:00', 10, true, ARRAY[-73.9474, 40.7845], 'Explore our technical education programs and career preparation opportunities at COOP TECH and the Judith S. Kaye High School (JSK)', NOW(), NOW()),

-- Queens 1
('Queens 1', 'LYFE & Pathways to Graduation', '160-05 Highland Ave & 162-02 Hillside Ave, Queens, NY 11432', '2025-02-28', '09:00', 10, true, ARRAY[-73.7935, 40.7075], 'Visit two locations in Jamaica: LYFE Program at Hillcrest HS (160-05 Highland Ave) and Pathways to Graduation at Jamaica Learning Center (162-02 Hillside Ave)', NOW(), NOW()),

-- Queens 2
('Queens 2', 'QTC Multi-Program Campus', '142-10 Linden Blvd, Queens, NY 11436', '2025-02-28', '09:00', 10, true, ARRAY[-73.7892, 40.6689], 'Visit three programs at our Queens Transition Center campus: The Judith S. Kaye High School, COOP TECH at QTC, and Adult Education School 3', NOW(), NOW()),

-- Brooklyn 1
('Brooklyn 1', 'East New York Multi-Program Campus', '400-452 Pennsylvania Ave, Brooklyn, NY 11207', '2025-02-28', '09:00', 10, true, ARRAY[-73.8960, 40.6721], 'Visit Adult Education at Police Athletic Academy (452 Pennsylvania Ave) and LYFE Program/YABC at Thomas Jefferson Educational Campus (400 Pennsylvania Ave)', NOW(), NOW()),

-- Brooklyn 2
('Brooklyn 2', 'Bedford Stuyvesant Multi-Program Campus', '475 Nostrand Ave & 832 Marcy Ave, Brooklyn, NY 11216', '2025-02-28', '09:00', 10, true, ARRAY[-73.9495, 40.6892], 'Visit Adult Education at Brooklyn Adult Learning Center (475 Nostrand Ave) and Pathways to Graduation/LYFE Program at Bedford Stuyvesant Complex (832 Marcy Ave)', NOW(), NOW()),

-- Bronx 1
('Bronx 1', 'Bronx Regional Multi-Program Campus', '1010 Rev James A. Polite Ave & 975 Kelly St, Bronx, NY 10459', '2025-02-28', '09:00', 10, true, ARRAY[-73.8960, 40.8243], 'Visit LYFE Program and Pathways to Graduation at Bronx Regional HS (1010 Rev James A. Polite Ave) and ReSTART Academy at Adolescent Skills Center (975 Kelly St)', NOW(), NOW()),

-- Staten Island 1
('Staten Island 1', 'Staten Island Multi-Program Campus', '340 Bay St, Staten Island, NY 10301', '2025-02-28', '09:00', 10, true, ARRAY[-74.0762, 40.6368], 'Visit Pathways to Graduation Referral Center and Adult Education programs at our Staten Island location', NOW(), NOW()); 