
-- Add message column to ai_messages
ALTER TABLE ai_messages ADD COLUMN IF NOT EXISTS message text NOT NULL DEFAULT '';

-- Create index for rate limiting queries
CREATE INDEX IF NOT EXISTS ai_messages_user_time_idx ON ai_messages(user_id, created_at DESC);

-- Enterprise Hard Limit: Prevent API Spam at the DB Level
CREATE OR REPLACE FUNCTION enforce_ai_rate_limit()
RETURNS trigger AS $$
BEGIN
  IF (SELECT count(*) FROM ai_messages WHERE user_id = NEW.user_id AND created_at > now() - interval '1 hour') >= 5 THEN
    RAISE EXCEPTION 'AI rate limit exceeded for this hour.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER ai_rate_limit_trigger
  BEFORE INSERT ON ai_messages
  FOR EACH ROW EXECUTE FUNCTION enforce_ai_rate_limit();

-- Storage: Ensure documents bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT DO NOTHING;

-- Storage RLS: Users can upload their own safe docs
CREATE POLICY "Users can upload their own safe docs"
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND lower(storage.extension(name)) IN ('pdf', 'jpg', 'jpeg', 'png')
);

-- Storage RLS: Users can view their own docs
CREATE POLICY "Users can view their own docs"
ON storage.objects FOR SELECT USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
