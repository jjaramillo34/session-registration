export const D79_PROGRAMS = [
  'Pathways to Graduation',
  'Adult Education',
  'YABC',
  'Co-op Tech & Judith S. Kaye',
  'LYFE',
  'ALC',
  'ReSTART Academy',
  'East River Academy & Passages',
  'Other'
] as const;

/** Program description and optional website(s) for display on program pages. */
export const PROGRAM_DESCRIPTIONS: Record<string, { description: string; website?: string; websiteLabel?: string; website2?: string; website2Label?: string }> = {
  'Pathways to Graduation': {
    description:
      'Pathways to Graduation provides students aged 17½–21 with free, Department of Education classes to prepare for a successful future, through earning their High School Equivalency Diploma. With over 90 sites offering classes within community based organizations and in high schools, P2G provides preparation classes and wrap around services to ensure that students are prepared for life after their diploma.',
    website: 'https://www.p2g.nyc',
  },
  'Adult Education': {
    description:
      'Adult Education is located in over 175 sites throughout the five boroughs and provides tuition-free classes to adults age 21 and over. Classes are held both during the day and night, Monday through Saturday. Classes include High School Equivalency preparation, Basic Literacy, ESL, and Career and Technical Education.',
    website: 'https://www.adultedu.nyc',
  },
  YABC: {
    description:
      'Young Adult Borough Centers (YABCs) are afternoon and evening programs designed to meet the educational needs of high school students who are behind in credit or have adult responsibilities that make it difficult to attend school during the day. Students attend YABCs part-time in the afternoon or evening to earn a high school diploma. Students graduate with a diploma from their home school after they have earned all their credits and passed all the required exams while attending the YABC. YABC’s also offer a shared instruction program to students across the city.',
    website: 'https://www.yabcnyc.org',
  },
  'Co-op Tech & Judith S. Kaye': {
    description:
      'Co-Op Tech (School of Cooperative Technical Education) offers half-day career and technical training courses for students who are enrolled in academic courses in another Department of Education school or program including Pathways to Graduation and ReStart Academy. The Judith S. Kaye High School (JSK) reengages students who are not on track for graduation in their current school. Utilizing a multitude of services, JSK has designed a customized level of support for each student to earn a Regents diploma, career and technical certificates and develop a college, career, and post-graduate plan. All students participate in a course of study, which includes interpersonal skill development, that best fits their needs so that they can be successful in the demanding 21st century college and career world.',
    website: 'https://www.co-optech.org',
    websiteLabel: 'Co-Op Tech',
    website2: 'https://www.jskhigh.org',
    website2Label: 'Judith S. Kaye High School',
  },
  LYFE: {
    description:
      'The Living for the Young Family through Education (LYFE) program is a NYC Department of Education program that provides free early childhood education to children of student parents. LYFE makes it possible for student parents to stay on track toward graduating from high school or completing their high school equivalency while parenting. In addition, LYFE supports student parents\' transition into parenthood by providing high-quality early childhood education, supportive counseling, academic guidance and advocacy services.',
    website: 'https://www.lyfenyc.org',
  },
  ALC: {
    description:
      'Located in over 20 sites across the city, Alternate Learning Centers (ALC) are instructional and supportive programs for middle and high school students on Superintendent’s Suspension. ALC staff members collaborate with home school principals and staff to ensure that instruction and social emotional needs of students are met at the ALC, and when the student transitions back to the home school.',
  },
  'ReSTART Academy': {
    description:
      'ReStart Academy is a multi sited program that serves over age 7th and 8th graders and students in residential and non-residential settings such as therapeutic communities. As a program under the auspices of NYC District 79, New York City\'s alternative schools district, ReStart Academy has 21 locations throughout the five boroughs including two residential sites in upstate New York.',
    website: 'https://www.restartacademy.org',
  },
  'East River Academy & Passages': {
    description:
      'East River Academy serves students who are incarcerated on Rikers Island ages 18+. Passages Academy serves students in the custody of ACS and are located in secure and non-secure detention and placement facilities.',
    website: 'https://www.passagesacademy.org',
  },
};

export const AVAILABLE_DATES = [
  '2025-02-26', // Wednesday
  '2025-02-27', // Thursday
  '2025-02-28'  // Friday
] as const;

export const DAYTIME_SLOTS = [
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30'
] as const;

export const EVENING_SLOTS = [
  '17:30',
  '18:00',
  '18:30'
] as const;

export const SESSION_CAPACITY = 2; 