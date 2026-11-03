-- ============================================================
-- 민왕게임월드 · 접속 통계 + 좋아요  (Supabase SQL Editor에서 한 번 실행)
-- 이 파일은 여러 번 실행해도 안전해요.
-- ============================================================

-- 1) 이벤트 기록 (방문·플레이·체류시간)
create table if not exists public.mw_events (
  id        bigserial primary key,
  ts        timestamptz not null default now(),
  ev        text not null,             -- view | play | hb | end | click | like | unlike
  game      text,                      -- 게임 id (index는 null)
  path      text,
  vid       text,                      -- 기기별 익명 ID (localStorage)
  sid       text,                      -- 탭/세션 ID
  dur       int,                       -- 누적 플레이 초 (hb/end)
  ref       text,                      -- 들어온 곳 (도메인)
  dev       text,                      -- mobile | tablet | desktop | chromebook
  os        text,
  br        text,
  sw        int, sh int,               -- 화면 크기
  lang      text,
  country   text, region text, city text,
  ip_mask   text,                      -- 마지막 자리를 가린 IP (예: 211.36.142.*)
  ip_hash   text,                      -- 같은 IP 세기용 해시 (원래 IP는 저장 안 함)
  ua        text
);
create index if not exists mw_events_ts   on public.mw_events (ts desc);
create index if not exists mw_events_game on public.mw_events (game, ev, ts desc);
create index if not exists mw_events_vid  on public.mw_events (vid);

-- 2) 좋아요 (게임 × 기기 하나에 한 번)
create table if not exists public.mw_likes (
  game text not null,
  vid  text not null,
  ts   timestamptz not null default now(),
  primary key (game, vid)
);

-- 3) 관리자 목록 (여기에 넣은 이메일로 로그인한 사람만 통계를 봐요)
create table if not exists public.mw_admins (email text primary key);

alter table public.mw_events enable row level security;
alter table public.mw_likes  enable row level security;
alter table public.mw_admins enable row level security;

create or replace function public.mw_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.mw_admins where lower(email) = lower(coalesce(auth.jwt()->>'email','')));
$$;

-- 누구나 기록은 넣을 수 있지만(읽기는 관리자만)
drop policy if exists mw_events_ins on public.mw_events;
create policy mw_events_ins on public.mw_events for insert to anon, authenticated
  with check (char_length(ev) <= 16 and coalesce(char_length(game),0) <= 40 and coalesce(char_length(vid),0) <= 40);
drop policy if exists mw_events_sel on public.mw_events;
create policy mw_events_sel on public.mw_events for select to authenticated using (public.mw_is_admin());
drop policy if exists mw_likes_sel on public.mw_likes;
create policy mw_likes_sel on public.mw_likes for select to authenticated using (public.mw_is_admin());
drop policy if exists mw_admins_sel on public.mw_admins;
create policy mw_admins_sel on public.mw_admins for select to authenticated using (public.mw_is_admin());

-- 4) 좋아요 누르기/취소 (결과: 지금 상태와 개수)
create or replace function public.mw_toggle_like(p_game text, p_vid text)
returns json language plpgsql security definer set search_path = public as $$
declare liked boolean; n bigint;
begin
  if p_game is null or p_vid is null or char_length(p_game) > 40 or char_length(p_vid) > 40 or char_length(p_vid) < 8 then
    raise exception 'bad input';
  end if;
  if exists (select 1 from mw_likes where game = p_game and vid = p_vid) then
    delete from mw_likes where game = p_game and vid = p_vid; liked := false;
  else
    insert into mw_likes(game, vid) values (p_game, p_vid); liked := true;
  end if;
  select count(*) into n from mw_likes where game = p_game;
  return json_build_object('liked', liked, 'count', n);
end $$;

-- 5) 게임별 공개 숫자 (좋아요 · 플레이 수) — 목록 정렬에 써요
create or replace function public.mw_game_stats(p_vid text default null)
returns table(game text, likes bigint, plays bigint, plays7 bigint, mine boolean)
language sql stable security definer set search_path = public as $$
  with g as (
    select game from mw_events where game is not null and ev = 'play'
    union select game from mw_likes
  )
  select g.game,
    (select count(*) from mw_likes l where l.game = g.game),
    (select count(*) from mw_events e where e.game = g.game and e.ev = 'play'),
    (select count(*) from mw_events e where e.game = g.game and e.ev = 'play' and e.ts > now() - interval '7 days'),
    exists (select 1 from mw_likes l where l.game = g.game and l.vid = p_vid)
  from g;
$$;

-- 6) 관리자 통계 (한 번에 모아서 돌려줘요)
create or replace function public.mw_admin_stats(p_days int default 7)
returns json language plpgsql stable security definer set search_path = public as $$
declare since timestamptz; r json;
begin
  if not mw_is_admin() then raise exception 'not admin'; end if;
  since := case when p_days <= 0 then '-infinity'::timestamptz
                when p_days = 1 then date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul'
                else now() - make_interval(days => p_days) end;
  with e as (select * from mw_events where ts >= since),
  firstseen as (select vid, min(ts) f from mw_events group by vid),
  pl as (select game, sid, max(dur) d from e where ev in ('hb','end') and game is not null group by game, sid)
  select json_build_object(
    'since', since,
    'totals', (select json_build_object(
        'visitors', count(distinct vid),
        'sessions', count(distinct sid),
        'views', count(*) filter (where ev = 'view'),
        'plays', count(*) filter (where ev = 'play'),
        'clicks', count(*) filter (where ev = 'click'),
        'ips', count(distinct ip_hash),
        'new_visitors', (select count(*) from firstseen where f >= since),
        'avg_play_sec', (select coalesce(round(avg(d)),0) from pl where d > 0),
        'total_play_min', (select coalesce(round(sum(d)/60.0),0) from pl),
        'likes', (select count(*) from mw_likes where ts >= since),
        'likes_all', (select count(*) from mw_likes)) from e),
    'daily', (select coalesce(json_agg(x order by x.d),'[]') from (
        select to_char(ts at time zone 'Asia/Seoul','YYYY-MM-DD') d, count(distinct vid) visitors,
               count(*) filter (where ev='view') views, count(*) filter (where ev='play') plays
        from e group by 1) x),
    'hourly', (select coalesce(json_agg(x order by x.h),'[]') from (
        select extract(hour from ts at time zone 'Asia/Seoul')::int h, count(*) n from e where ev in ('view','play') group by 1) x),
    'weekday', (select coalesce(json_agg(x order by x.w),'[]') from (
        select extract(isodow from ts at time zone 'Asia/Seoul')::int w, count(*) n from e where ev in ('view','play') group by 1) x),
    'games', (select coalesce(json_agg(x order by x.plays desc),'[]') from (
        select g.game,
          (select count(*) from e where e.game=g.game and ev='play') plays,
          (select count(distinct vid) from e where e.game=g.game and ev='play') players,
          (select count(*) from e where e.game=g.game and ev='click') clicks,
          (select coalesce(round(avg(d)),0) from pl where pl.game=g.game and d>0) avg_sec,
          (select coalesce(round(sum(d)/60.0),0) from pl where pl.game=g.game) total_min,
          (select count(*) from mw_likes l where l.game=g.game) likes
        from (select distinct game from e where game is not null union select game from mw_likes) g) x),
    'dev',     (select coalesce(json_agg(x order by x.n desc),'[]') from (select coalesce(dev,'?') k, count(distinct vid) n from e group by 1) x),
    'os',      (select coalesce(json_agg(x order by x.n desc),'[]') from (select coalesce(os,'?') k, count(distinct vid) n from e group by 1) x),
    'br',      (select coalesce(json_agg(x order by x.n desc),'[]') from (select coalesce(br,'?') k, count(distinct vid) n from e group by 1) x),
    'country', (select coalesce(json_agg(x order by x.n desc),'[]') from (select coalesce(country,'?') k, count(distinct vid) n from e group by 1) x),
    'region',  (select coalesce(json_agg(x order by x.n desc),'[]') from (select coalesce(region,'?') k, count(distinct vid) n from e group by 1 order by 2 desc limit 30) x),
    'city',    (select coalesce(json_agg(x order by x.n desc),'[]') from (select coalesce(city,'?') k, count(distinct vid) n from e group by 1 order by 2 desc limit 30) x),
    'ref',     (select coalesce(json_agg(x order by x.n desc),'[]') from (select coalesce(nullif(ref,''),'(직접 접속)') k, count(distinct sid) n from e where ev='view' group by 1 order by 2 desc limit 20) x),
    'screen',  (select coalesce(json_agg(x order by x.n desc),'[]') from (select sw||'×'||sh k, count(distinct vid) n from e where sw is not null group by 1 order by 2 desc limit 15) x),
    'lang',    (select coalesce(json_agg(x order by x.n desc),'[]') from (select coalesce(lang,'?') k, count(distinct vid) n from e group by 1 order by 2 desc limit 10) x),
    'ips',     (select coalesce(json_agg(x order by x.n desc),'[]') from (select ip_mask k, count(*) n, count(distinct vid) devices, max(city) city, max(ts) last from e where ip_mask is not null group by 1 order by 2 desc limit 30) x),
    'recent',  (select coalesce(json_agg(x order by x.ts desc),'[]') from (select ts, ev, game, dev, os, br, city, region, ip_mask, left(vid,8) vid, dur from e order by ts desc limit 120) x)
  ) into r;
  return r;
end $$;

grant execute on function public.mw_toggle_like(text,text) to anon, authenticated;
grant execute on function public.mw_game_stats(text)       to anon, authenticated;
grant execute on function public.mw_admin_stats(int)      to authenticated;
grant insert on public.mw_events to anon, authenticated;
grant usage, select on sequence public.mw_events_id_seq to anon, authenticated;

-- 7) 관리자 이메일 등록 (아래 이메일을 바꿔서 실행하세요)
-- insert into public.mw_admins(email) values ('관리자이메일@example.com') on conflict do nothing;
