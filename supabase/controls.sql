-- 민왕게임월드 · 관리자 운영 설정 (게임 시간 · 숫자 조정)
-- analytics.sql 다음에 한 번 실행. 여러 번 실행해도 안전해요.

create table if not exists public.mw_settings (k text primary key, v jsonb not null, ts timestamptz not null default now());
create table if not exists public.mw_adjust (game text primary key, plays_add bigint not null default 0, likes_add bigint not null default 0, ts timestamptz not null default now());
alter table public.mw_settings enable row level security;
alter table public.mw_adjust enable row level security;

-- 누구나 읽는 공개 설정 (게임 시간)
create or replace function public.mw_public_cfg() returns json
language sql stable security definer set search_path = public as $$
  select coalesce((select v from mw_settings where k = 'hours'), '{}'::jsonb)::json;
$$;

-- 관리자: 설정 저장
create or replace function public.mw_admin_set(p_k text, p_v jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not mw_is_admin() then raise exception 'not admin'; end if;
  insert into mw_settings(k, v, ts) values (p_k, p_v, now())
  on conflict (k) do update set v = excluded.v, ts = now();
end $$;

-- 관리자: 게임별 숫자 보정 (+/-)
create or replace function public.mw_admin_adjust(p_game text, p_plays bigint, p_likes bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not mw_is_admin() then raise exception 'not admin'; end if;
  insert into mw_adjust(game, plays_add, likes_add, ts) values (p_game, coalesce(p_plays,0), coalesce(p_likes,0), now())
  on conflict (game) do update set plays_add = excluded.plays_add, likes_add = excluded.likes_add, ts = now();
end $$;

-- 관리자: 현재 설정 + 게임별 실제/보정 숫자
create or replace function public.mw_admin_cfg() returns json
language plpgsql stable security definer set search_path = public as $$
declare r json;
begin
  if not mw_is_admin() then raise exception 'not admin'; end if;
  select json_build_object(
    'hours', (select v from mw_settings where k = 'hours'),
    'games', (select coalesce(json_agg(x order by x.game), '[]') from (
      select g.game,
        (select count(*) from mw_events e where e.game = g.game and e.ev = 'play') plays,
        (select count(*) from mw_likes l where l.game = g.game) likes,
        coalesce(a.plays_add, 0) plays_add, coalesce(a.likes_add, 0) likes_add
      from (select distinct game from mw_events where game is not null and ev = 'play'
            union select game from mw_likes union select game from mw_adjust) g
      left join mw_adjust a on a.game = g.game) x)
  ) into r;
  return r;
end $$;

-- 목록에 보이는 숫자 = 실제 + 보정
create or replace function public.mw_game_stats(p_vid text default null)
returns table(game text, likes bigint, plays bigint, plays7 bigint, mine boolean)
language sql stable security definer set search_path = public as $$
  with g as (select game from mw_events where game is not null and ev = 'play'
             union select game from mw_likes union select game from mw_adjust)
  select g.game,
    greatest(0, (select count(*) from mw_likes l where l.game = g.game) + coalesce(a.likes_add, 0)),
    greatest(0, (select count(*) from mw_events e where e.game = g.game and e.ev = 'play') + coalesce(a.plays_add, 0)),
    (select count(*) from mw_events e where e.game = g.game and e.ev = 'play' and e.ts > now() - interval '7 days'),
    exists (select 1 from mw_likes l where l.game = g.game and l.vid = p_vid)
  from g left join mw_adjust a on a.game = g.game;
$$;

-- 좋아요 누른 뒤 보이는 개수도 보정 포함
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
  select greatest(0, count(*) + coalesce((select likes_add from mw_adjust where game = p_game), 0))
    into n from mw_likes where game = p_game;
  return json_build_object('liked', liked, 'count', n);
end $$;

grant execute on function public.mw_public_cfg() to anon, authenticated;
grant execute on function public.mw_game_stats(text) to anon, authenticated;
grant execute on function public.mw_toggle_like(text,text) to anon, authenticated;
grant execute on function public.mw_admin_set(text,jsonb) to authenticated;
grant execute on function public.mw_admin_adjust(text,bigint,bigint) to authenticated;
grant execute on function public.mw_admin_cfg() to authenticated;
