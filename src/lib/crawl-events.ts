/** Crawl events for D79 Site Crawls - 15 spots per event. */

export const CRAWL_CAPACITY = 15;

export interface CrawlEventInput {
  Borough: string;
  'Location / School': string;
  Programs: string;
  Address: string;
  Date: string;
  StartTime: string;
  EndTime: string;
  Latitude: number;
  Longitude: number;
}

export const CRAWL_EVENTS: CrawlEventInput[] = [
  { Borough: 'Manhattan', 'Location / School': 'LYFE @ Jeffrey C. Tenzer', Programs: 'LYFE Program', Address: '198 Forsyth St, Manhattan, NY 10002', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.7216, Longitude: -73.9916 },
  { Borough: 'Manhattan', 'Location / School': 'Pathways to Graduation @ Jeffrey C. Tenzer', Programs: 'Pathways to Graduation', Address: '198 Forsyth St, Manhattan, NY 10002', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.7216, Longitude: -73.9916 },
  { Borough: 'Manhattan', 'Location / School': 'COOP Tech and JSK', Programs: 'COOP Tech / JSK', Address: '321 East 96th St, Manhattan, NY 10128', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.7840, Longitude: -73.9464 },
  { Borough: 'Queens', 'Location / School': 'Hillcrest High School', Programs: 'LYFE', Address: '160-05 Highland Ave, Queens, NY 11432', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.7100, Longitude: -73.8018 },
  { Borough: 'Queens', 'Location / School': 'Jamaica Learning Center', Programs: 'Pathways to Graduation (P2G)', Address: '162-02 Hillside Ave, Queens, NY 11432', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.7085, Longitude: -73.8003 },
  { Borough: 'Queens', 'Location / School': 'August Martin HS', Programs: 'Pathways to Graduation', Address: '156-10 Baisley Blvd, Rochdale Village, NY 11434', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6767, Longitude: -73.7823 },
  { Borough: 'Queens', 'Location / School': 'August Martin HS', Programs: 'ReStart Academy', Address: '156-10 Baisley Blvd, Rochdale Village, NY 11434', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6767, Longitude: -73.7823 },
  { Borough: 'Queens', 'Location / School': 'August Martin HS', Programs: 'ALC', Address: '156-10 Baisley Blvd, Rochdale Village, NY 11434', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6767, Longitude: -73.7823 },
  { Borough: 'Queens', 'Location / School': 'Judith S. Kaye HS @ Queens Transition Center', Programs: 'High School Program', Address: '142-10 Linden Blvd, Queens, NY 11436', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6785, Longitude: -73.7914 },
  { Borough: 'Queens', 'Location / School': 'COOP Tech @ Queens Transition Center', Programs: 'COOP Tech', Address: '142-10 Linden Blvd, Queens, NY 11436', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6785, Longitude: -73.7914 },
  { Borough: 'Queens', 'Location / School': 'Adult Education School 3', Programs: 'Adult Education School 3', Address: '142-10 Linden Blvd, Queens, NY 11436', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6785, Longitude: -73.7914 },
  { Borough: 'Brooklyn', 'Location / School': 'Brooklyn Adult Learning Center', Programs: 'Adult Education', Address: '475 Nostrand Ave, Brooklyn, NY 11216', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6804, Longitude: -73.9504 },
  { Borough: 'Brooklyn', 'Location / School': 'Bedford Stuyvesant Complex', Programs: 'Pathways to Graduation (P2G)', Address: '832 Marcy Ave, Brooklyn, NY 11216', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6912, Longitude: -73.9481 },
  { Borough: 'Brooklyn', 'Location / School': 'Bedford Stuyvesant Complex', Programs: 'LYFE', Address: '832 Marcy Ave, Brooklyn, NY 11216', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6912, Longitude: -73.9481 },
  { Borough: 'Brooklyn', 'Location / School': 'Canarsie HS', Programs: 'COOP Tech', Address: '1600 Rockaway Pkwy, Brooklyn, NY 11236', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6405, Longitude: -73.9020 },
  { Borough: 'Brooklyn', 'Location / School': 'Canarsie HS', Programs: 'Adult Ed', Address: '1600 Rockaway Pkwy, Brooklyn, NY 11236', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6405, Longitude: -73.9020 },
  { Borough: 'Bronx', 'Location / School': 'Bronx Regional High School', Programs: 'LYFE', Address: '1010 Rev. James A. Polite Ave, Bronx, NY 10459', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.8242, Longitude: -73.8935 },
  { Borough: 'Bronx', 'Location / School': 'Bronx Regional High School', Programs: 'Pathways to Graduation (P2G)', Address: '1010 Rev. James A. Polite Ave, Bronx, NY 10459', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.8242, Longitude: -73.8935 },
  { Borough: 'Staten Island', 'Location / School': 'P2G Referral Center and Adult Education', Programs: 'P2G & Adult Education', Address: '340 Bay St, Staten Island, NY 10301', Date: '2026-02-27', StartTime: '09:00', EndTime: '12:00', Latitude: 40.6407, Longitude: -74.0779 },
];
