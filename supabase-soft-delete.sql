alter table public.tarefas
add column if not exists deleted_at timestamptz;

create index if not exists tarefas_user_deleted_at_idx
on public.tarefas (user_id, deleted_at);
