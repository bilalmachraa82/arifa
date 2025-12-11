-- Add AI score columns to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS ai_score integer,
ADD COLUMN IF NOT EXISTS ai_score_reason text,
ADD COLUMN IF NOT EXISTS ai_scored_at timestamp with time zone;