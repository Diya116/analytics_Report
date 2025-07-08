-- Migration number: 0001 	 2025-07-08T14:44:04.370Z
-- migrations/0001_create_events_table.sql
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    country TEXT NOT NULL,
    device TEXT NOT NULL,
    browser TEXT NOT NULL,
    referrer TEXT NOT NULL
);