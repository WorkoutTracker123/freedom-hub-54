
-- Create chat messages table (anonymous, volatile)
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access (anonymous chat)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can read messages
CREATE POLICY "Anyone can read chat messages"
ON public.chat_messages FOR SELECT
USING (true);

-- Anyone can insert messages
CREATE POLICY "Anyone can insert chat messages"
ON public.chat_messages FOR INSERT
WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Auto-delete messages older than 30 minutes via a cron-like approach
-- We'll use a database function that can be called periodically
CREATE OR REPLACE FUNCTION public.cleanup_old_chat_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.chat_messages WHERE created_at < now() - interval '30 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
