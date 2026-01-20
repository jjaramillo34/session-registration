# MongoDB Schema Documentation

This document describes the MongoDB schema (Mongoose models) used in the session registration application.

## Models Overview

### 1. TimeSlot
**Collection:** `timeslots`

| Field | Type | Required | Default | Index |
|-------|------|----------|---------|-------|
| date | String | Yes | - | Compound unique (date, time) |
| time | String | Yes | - | Compound unique (date, time) |
| capacity | Number | No | 2 | - |
| available | Boolean | No | true | Yes |
| sessionType | String | Yes | - | Yes |
| createdAt | Date | Auto | now() | - |
| updatedAt | Date | Auto | now() | - |

**Indexes:**
- Unique compound index on `(date, time)`
- Index on `sessionType`
- Index on `available`

---

### 2. Session
**Collection:** `sessions`

| Field | Type | Required | Default | Index |
|-------|------|----------|---------|-------|
| name | String | Yes | - | - |
| email | String | Yes | - | - |
| programName | String | Yes | - | - |
| sessionDate | String | Yes | - | - |
| sessionTime | String | Yes | - | - |
| sessionType | String | Yes | - | - |
| teamsLink | String | No | null | - |
| createdAt | Date | Auto | now() | - |
| updatedAt | Date | Auto | now() | - |

**Relationships:**
- Referenced by: `Registration.sessionId` (ObjectId)
- Referenced by: `Signup.sessionId` (ObjectId)

---

### 3. Registration
**Collection:** `registrations`

| Field | Type | Required | Default | Index |
|-------|------|----------|---------|-------|
| name | String | Yes | - | - |
| email | String | Yes | - | Yes |
| language | Enum | No | ENGLISH | - |
| programName | String | Yes | - | - |
| agencyName | String | No | null | - |
| isNYCPSStaff | Boolean | No | false | - |
| status | Enum | No | CONFIRMED | - |
| sessionId | ObjectId | Yes | - | Yes (ref: Session) |
| createdAt | Date | Auto | now() | - |
| updatedAt | Date | Auto | now() | - |

**Enums:**
- `Language`: ASL, ARABIC, BANGLA, CHINESE_MANDARIN, CHINESE_CANTONESE, ENGLISH, FRENCH, HAITIAN_CREOLE, KOREAN, RUSSIAN, SPANISH, URDU
- `RegistrationStatus`: CONFIRMED, CANCELLED

**Indexes:**
- Index on `email`
- Index on `sessionId`

---

### 4. Signup
**Collection:** `signups`

| Field | Type | Required | Default | Index |
|-------|------|----------|---------|-------|
| email | String | Yes | - | - |
| name | String | Yes | - | - |
| sessionId | ObjectId | Yes | - | Yes (ref: Session) |
| createdAt | Date | Auto | now() | - |
| updatedAt | Date | Auto | now() | - |

**Indexes:**
- Index on `sessionId`

---

### 5. Crawl
**Collection:** `crawls`

| Field | Type | Required | Default | Index |
|-------|------|----------|---------|-------|
| name | String | Yes | - | - |
| location | String | Yes | - | - |
| address | String | Yes | - | - |
| date | String | Yes | - | Compound (date, time) |
| time | String | Yes | - | Compound (date, time) |
| capacity | Number | No | 10 | - |
| available | Boolean | No | true | Yes |
| coordinates | Number[] | Yes | [] | - |
| description | String | Yes | - | - |
| createdAt | Date | Auto | now() | - |
| updatedAt | Date | Auto | now() | - |

**Indexes:**
- Compound index on `(date, time)`
- Index on `available`

---

### 6. CrawlRegistration
**Collection:** `crawlregistrations`

| Field | Type | Required | Default | Index |
|-------|------|----------|---------|-------|
| name | String | Yes | - | - |
| email | String | Yes | - | Yes |
| crawlId | ObjectId | Yes | - | Yes (ref: Crawl) |
| status | Enum | No | CONFIRMED | - |
| createdAt | Date | Auto | now() | - |
| updatedAt | Date | Auto | now() | - |

**Enums:**
- `RegistrationStatus`: CONFIRMED, CANCELLED

**Indexes:**
- Index on `email`
- Index on `crawlId`

---

## Schema Notes

1. **IDs**: MongoDB uses ObjectIds (`_id: ObjectId`) for all documents
2. **Relationships**: ObjectId references with `ref` in schema for relationships
3. **Enums**: String enums with validation using Mongoose enum types
4. **Arrays**: Native MongoDB array types (e.g., `[Number]` for coordinates)
5. **Timestamps**: Automatic `createdAt` and `updatedAt` fields via Mongoose timestamps
