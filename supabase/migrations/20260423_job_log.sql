-- 1. 테이블 생성
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  company_name text not null,
  job_title text not null,
  domain text,
  job_url text,
  company_size text,
  stage text default '서류',
  applied_at date default now(),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. 보안 정책(RLS) 활성화
alter table public.applications enable row level security;

-- 3. 본인 데이터만 읽기/쓰기 가능하게 설정
create policy "Users can perform all actions on their own applications"
  on public.applications
  for all
  using (auth.uid() = user_id);