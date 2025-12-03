-- Add color column to notes table
ALTER TABLE public.notes ADD COLUMN color TEXT DEFAULT 'orange';