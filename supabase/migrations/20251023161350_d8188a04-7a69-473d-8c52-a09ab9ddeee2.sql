-- Create enum for milestone status
CREATE TYPE milestone_status AS ENUM ('Planned', 'In Progress', 'Completed');

-- Create milestones table
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status milestone_status NOT NULL DEFAULT 'Planned',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Enable RLS
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view milestones"
ON public.milestones
FOR SELECT
USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert milestones"
ON public.milestones
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for authenticated users to update
CREATE POLICY "Authenticated users can update milestones"
ON public.milestones
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Add trigger for updated_at
CREATE TRIGGER update_milestones_updated_at
BEFORE UPDATE ON public.milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;

-- Insert sample milestones for pitch day
INSERT INTO public.milestones (title, description, start_date, end_date, status, progress) VALUES
('Project Kickoff', 'Initial planning and architecture design for PredictivePulse platform', '2025-01-01', '2025-01-15', 'Completed', 100),
('Core Dashboard Development', 'Build main dashboard with market metrics and real-time data visualization', '2025-01-16', '2025-02-28', 'Completed', 100),
('Industry Modules Implementation', 'Develop sector-specific dashboards: Mining, Agriculture, Housing, Finance', '2025-03-01', '2025-04-30', 'Completed', 100),
('Predictive Analytics Engine', 'Integrate AI models for forecasting and weighted predictions', '2025-05-01', '2025-06-15', 'Completed', 100),
('Authentication & User Management', 'Implement Supabase auth, subscription tiers, and role-based access', '2025-06-16', '2025-07-31', 'Completed', 100),
('Payment Integration', 'Add Stripe and Paystack payment gateways for subscriptions', '2025-08-01', '2025-08-31', 'Completed', 100),
('Media & Entertainment Module', 'Build creative economy dashboard with artist profiles and marketplace', '2025-09-01', '2025-09-30', 'Completed', 100),
('Namibia Heatmap & Regional Insights', 'Accurate geographic visualization with 14 regions and data normalization', '2025-10-01', '2025-10-15', 'Completed', 100),
('Visual Consistency Audit', 'Global UI/UX refinement, responsive design fixes, and accessibility improvements', '2025-10-16', '2025-10-22', 'In Progress', 85),
('Project Roadmap & Gantt Chart', 'Interactive milestone tracking with real-time Supabase sync', '2025-10-23', '2025-10-25', 'In Progress', 60),
('Final Testing & QA', 'Cross-browser testing, performance optimization, and bug fixes', '2025-10-26', '2025-10-30', 'Planned', 0),
('Pitch Deck Preparation', 'Create compelling presentation materials and demo scenarios', '2025-10-31', '2025-11-05', 'Planned', 0),
('Pitch Day Rehearsal', 'Practice presentations and refine messaging', '2025-11-06', '2025-11-10', 'Planned', 0),
('Launch Day', 'Official pitch presentation and platform demo', '2025-11-15', '2025-11-15', 'Planned', 0);