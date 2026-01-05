CREATE TYPE hr_status AS ENUM (
  'Accepted Invite',
  'Awaiting Response',
  'Email Sent',
  'Called Declined',
  'Emailed Declined',
  'Blacklisted',
  'Wrong Number',
  'Call Postponed',
  'Not Reachable'
);

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  poc_name TEXT,
  poc_email TEXT
);
  
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('member', 'admin', 'super_admin')) NOT NULL,
  team_id INTEGER REFERENCES teams(id)
);

CREATE TABLE hr_contacts (
  id SERIAL PRIMARY KEY,
  hr_name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  interview_mode TEXT CHECK (interview_mode IN ('Online', 'Offline')),
  status hr_status NOT NULL,
  remark TEXT,
  uploaded_by INTEGER REFERENCES users(id),
  team_id INTEGER REFERENCES teams(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER REFERENCES hr_contacts(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);
