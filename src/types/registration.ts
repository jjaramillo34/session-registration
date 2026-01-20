// Shared types and enums for registrations
// This file should NOT import Mongoose or any server-only modules

export enum Language {
  ASL = 'ASL',
  ARABIC = 'ARABIC',
  BANGLA = 'BANGLA',
  CHINESE_MANDARIN = 'CHINESE_MANDARIN',
  CHINESE_CANTONESE = 'CHINESE_CANTONESE',
  ENGLISH = 'ENGLISH',
  FRENCH = 'FRENCH',
  HAITIAN_CREOLE = 'HAITIAN_CREOLE',
  KOREAN = 'KOREAN',
  RUSSIAN = 'RUSSIAN',
  SPANISH = 'SPANISH',
  URDU = 'URDU',
}

export enum RegistrationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}
