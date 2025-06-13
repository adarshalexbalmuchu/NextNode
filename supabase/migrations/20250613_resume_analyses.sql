-- Create resume_analyses table for storing resume analysis results
-- This migration adds the necessary table and RLS policies for the Resume Analyzer tool

-- Create the resume_analyses table
CREATE TABLE IF NOT EXISTS public.resume_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_text TEXT NOT NULL,
    job_description TEXT,
    analysis_result JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_resume_analyses_user_id 
ON public.resume_analyses(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_resume_analyses_created_at 
ON public.resume_analyses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own analyses
CREATE POLICY "Users can view own resume analyses"
ON public.resume_analyses
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own analyses
CREATE POLICY "Users can insert own resume analyses"
ON public.resume_analyses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own analyses
CREATE POLICY "Users can update own resume analyses"
ON public.resume_analyses
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own analyses
CREATE POLICY "Users can delete own resume analyses"
ON public.resume_analyses
FOR DELETE
USING (auth.uid() = user_id);

-- Policy: Admins can see all analyses
CREATE POLICY "Admins can view all resume analyses"
ON public.resume_analyses
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid() 
        AND ur.role = 'admin'
    )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to resume_analyses table
DROP TRIGGER IF EXISTS update_resume_analyses_updated_at ON public.resume_analyses;
CREATE TRIGGER update_resume_analyses_updated_at
    BEFORE UPDATE ON public.resume_analyses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_analyses TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Add a comment to the table
COMMENT ON TABLE public.resume_analyses IS 'Stores resume analysis results from the Resume Analyzer tool';
COMMENT ON COLUMN public.resume_analyses.analysis_result IS 'JSON object containing the complete analysis result with scores, feedback, and recommendations';
