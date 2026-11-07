-- 민왕게임월드 · 기기별 접근 기록 (관리자 전용) — analytics.sql 다음에 한 번 실행

create index if not exists mw_events_vid_ts on public.mw_events (vid, ts desc);

-- 기기 목록 (기간 안에 들어온 기기마다 한 줄)
create or replace function public.mw_admin_devices(p_days int default 7, p_q text default null)
returns json language plpgsql stable security definer set search_path = public as $$
declare since timestamptz; r json;
begin
  if not mw_is_admin() then raise exception 'not admin'; end if;
  since := case when p_days <= 0 then '-infinity'::timestamptz
    when p_days = 1 then date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul'
    else now() - make_interval(days => p_days) end;
  select coalesce(json_agg(x order by x.last desc), '[]') into r from (
    select e.vid,
      min(e.ts) first_in, max(e.ts) last,
      (select min(ts) from mw_events f where f.vid = e.vid) first_ever,
      count(distinct e.sid) sessions,
      count(*) filter (where e.ev = 'view') views,
      count(*) filter (where e.ev = 'play') plays,
      count(distinct e.game) filter (where e.ev = 'play') games,
      (select coalesce(sum(m), 0) from (select max(dur) m from mw_events p where p.vid = e.vid and p.ts >= since and p.ev in ('hb','end') group by p.sid, p.game) z) play_sec,
      (array_agg(e.dev order by e.ts desc))[1] dev,
      (array_agg(e.os order by e.ts desc))[1] os,
      (array_agg(e.br order by e.ts desc))[1] br,
      (array_agg(e.sw||'×'||e.sh order by e.ts desc))[1] scr,
      (array_agg(concat_ws(' ', e.region, e.city) order by e.ts desc))[1] place,
      (array_agg(e.ip_mask order by e.ts desc))[1] ip,
      count(distinct e.ip_hash) ips,
      (select string_agg(g, ',') from (select game g from mw_events q where q.vid = e.vid and q.ts >= since and q.ev = 'play' and q.game is not null group by game order by count(*) desc limit 5) gg) top
    from mw_events e
    where e.ts >= since and e.vid is not null
      and (p_q is null or p_q = '' or e.vid ilike p_q || '%' or e.ip_mask ilike '%' || p_q || '%' or e.city ilike '%' || p_q || '%' or e.region ilike '%' || p_q || '%')
    group by e.vid
    order by max(e.ts) desc
    limit 300) x;
  return r;
end $$;

-- 한 기기의 접근 기록 (최근 300건)
create or replace function public.mw_admin_device(p_vid text)
returns json language plpgsql stable security definer set search_path = public as $$
declare r json;
begin
  if not mw_is_admin() then raise exception 'not admin'; end if;
  select coalesce(json_agg(x order by x.ts desc), '[]') into r from (
    select ts, ev, game, sid, dur, dev, os, br, sw, sh, region, city, ip_mask, ref, ua
    from mw_events where vid = p_vid order by ts desc limit 300) x;
  return r;
end $$;

grant execute on function public.mw_admin_devices(int, text) to authenticated;
grant execute on function public.mw_admin_device(text) to authenticated;
