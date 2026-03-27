-- Initial database setup for GlobeNews
-- This file is mounted to postgres container for initialization

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables (Prisma will manage these, but we can add custom indexes here)
-- Custom indexes for better query performance
-- These will be created by Prisma migrations as well
