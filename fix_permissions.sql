-- Enable permissions for Chat and Messages
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Allow authenticated users to INSERT messages
create policy "Authenticated can insert messages"
on public.messages for insert
to authenticated
with check (true);

-- 2. Allow authenticated users to SELECT messages
create policy "Authenticated can view messages"
on public.messages for select
to authenticated
using (true);

-- 3. Allow authenticated users to UPDATE chats (for updated_at)
create policy "Authenticated can update chats"
on public.chats for update
to authenticated
using (true);

-- 4. Enable Read access to chats
create policy "Authenticated can view chats"
on public.chats for select
to authenticated
using (true);
