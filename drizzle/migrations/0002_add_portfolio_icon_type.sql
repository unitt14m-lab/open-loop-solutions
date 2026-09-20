ALTER TABLE public.portfolio_items
ADD COLUMN icon_type TEXT NOT NULL DEFAULT 'project_file'
CHECK (icon_type IN ('project_file', 'video_design', 'visual_design', 'presentation', 'other'));