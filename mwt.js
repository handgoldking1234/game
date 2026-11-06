/* 민왕게임월드 · 이용 통계 + 좋아요 (사이트와 모든 게임에서 불러요)
   - 기기별 익명 ID만 써요. 이름·연락처는 모으지 않아요.
   - 게임 화면: 시작(play)·1분마다(hb)·끝(end)에 플레이 시간을 보내요. */
(function () {
  if (window.MWT) return;
  var SB_URL = 'https://flrdiplgoeyuvffwxvhq.supabase.co', SB_KEY = 'sb_publishable_2ksFf_0qhrfq513RhbyEdA_dmGoJNb5';
  var local = /^(file:|about:|blob:)/.test(location.protocol) || /localhost|127\.0\.0\.1/.test(location.hostname);
  function rid(n) { var s = '', c = 'abcdefghijkmnpqrstuvwxyz23456789'; for (var i = 0; i < n; i++) s += c[Math.random() * c.length | 0]; return s }
  function store(k, v, ss) { var S = ss ? sessionStorage : localStorage; try { if (v === undefined) return S.getItem(k); S.setItem(k, v) } catch (e) { return null } }
  var vid = store('mw_vid'); if (!vid) { vid = 'v' + rid(15); store('mw_vid', vid) }
  var sid = store('mw_sid', undefined, 1); if (!sid) { sid = 's' + rid(12); store('mw_sid', sid, 1) }
  var m = location.pathname.match(/\/games\/([a-z0-9-]+)\.html/i), game = m ? m[1] : null;
  var ref = ''; try { if (document.referrer) { var r = new URL(document.referrer); ref = r.hostname === location.hostname ? '' : r.hostname } } catch (e) {}
  function send(ev, extra) {
    if (local) return;
    var b = { ev: ev, game: game, path: location.pathname, vid: vid, sid: sid, ref: ref, sw: screen.width, sh: screen.height, lang: (navigator.language || '').slice(0, 16) };
    if (extra) for (var k in extra) b[k] = extra[k];
    var body = JSON.stringify(b);
    try { if (navigator.sendBeacon && navigator.sendBeacon('/api/t', new Blob([body], { type: 'text/plain' }))) return } catch (e) {}
    try { fetch('/api/t', { method: 'POST', body: body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }) } catch (e) {}
  }
  function rpc(fn, args) {
    return fetch(SB_URL + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args || {}) })
      .then(function (r) { if (!r.ok) throw new Error('rpc ' + r.status); return r.json() });
  }
  // 플레이 시간 (화면이 보이는 동안만 세요)
  var act = 0, last = Date.now(), vis = !document.hidden, ended = false;
  function tick() { var n = Date.now(); if (vis) act += (n - last) / 1000; last = n }
  if (game) {
    send('play');
    setInterval(function () { tick(); if (vis && act > 5) send('hb', { dur: Math.round(act) }) }, 60000);
    document.addEventListener('visibilitychange', function () { tick(); vis = !document.hidden; if (document.hidden && act > 3) send('hb', { dur: Math.round(act) }) });
    addEventListener('pagehide', function () { if (ended) return; ended = true; tick(); send('end', { dur: Math.round(act) }) });
  } else {
    send('view');
    document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[data-id]'); if (a) send('click', { game: a.dataset.id }) }, true);
  }
  // 게임 시간 (관리자가 정한 시간대 밖이면 게임을 잠가요 · 한국 시간 기준)
  var CFG = null, cfgP = null;
  function kst() { var d = new Date(Date.now() + 9 * 3600e3); return { dow: d.getUTCDay() || 7, m: d.getUTCHours() * 60 + d.getUTCMinutes() } }
  function mins(s) { var p = String(s || '0:0').split(':'); return (+p[0] || 0) * 60 + (+p[1] || 0) }
  function rule(c, g) {
    c = c || {}; var o = (c.games || {})[g] || {}, mode = o.mode || 'all';
    if (mode === 'free') return null;
    if (mode === 'off') return { off: true };
    if (mode === 'own') return { from: o.from, to: o.to, days: o.days || [1, 2, 3, 4, 5, 6, 7] };
    return c.on ? { from: c.from, to: c.to, days: c.days || [1, 2, 3, 4, 5, 6, 7] } : null;
  }
  function allowed(g, c) {
    var r = rule(c || CFG, g); if (!r) return true; if (r.off) return false;
    var n = kst(); if (r.days.indexOf(n.dow) < 0) return false;
    var f = mins(r.from || '00:00'), t = mins(r.to || '24:00'); if (f === t) return true;
    return f < t ? (n.m >= f && n.m < t) : (n.m >= f || n.m < t);
  }
  function ruleText(g) {
    var r = rule(CFG, g); if (!r) return ''; if (r.off) return '지금은 이 게임을 쉬고 있어요.';
    var D = ['', '월', '화', '수', '목', '금', '토', '일'], ds = r.days.length === 7 ? '매일' : r.days.map(function (d) { return D[d] }).join('·');
    return ds + ' ' + (r.from || '00:00') + ' ~ ' + (r.to || '24:00');
  }
  function cfg() {
    if (!cfgP) cfgP = rpc('mw_public_cfg').then(function (c) { CFG = c || {}; return CFG }).catch(function () { CFG = {}; return CFG });
    return cfgP;
  }
  var lockEl = null;
  function lock() {
    var adm = false; try { adm = localStorage.getItem('mw_admin') === '1' } catch (e) {}
    if (!game || adm || !CFG) return;
    var ok = allowed(game);
    if (ok) { if (lockEl) { lockEl.remove(); lockEl = null } return }
    if (lockEl) return;
    try { document.querySelectorAll('audio,video').forEach(function (a) { a.pause() }) } catch (e) {}
    try { if (document.pointerLockElement) document.exitPointerLock() } catch (e) {}
    lockEl = document.createElement('div');
    lockEl.setAttribute('role', 'alertdialog');
    lockEl.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(10,12,20,.94);color:#fff;display:flex;align-items:center;justify-content:center;font-family:Pretendard,"Malgun Gothic",sans-serif;text-align:center;padding:20px';
    var msg = (CFG && CFG.msg) || '지금은 게임 시간이 아니에요. 정해진 시간에 다시 만나요!';
    lockEl.innerHTML = '<div style="max-width:420px"><div style="font-size:64px">🔒</div><h2 style="margin:10px 0 8px;font-size:24px">쉬는 시간이에요</h2><p style="margin:0 0 6px;line-height:1.6;color:#e5e7eb"></p><p style="margin:0 0 18px;color:#fbbf24;font-weight:800"></p><a href="/" style="display:inline-block;background:#f26b1d;color:#fff;text-decoration:none;font-weight:800;border-radius:12px;padding:12px 22px">🏠 게임 목록으로</a></div>';
    var ps = lockEl.querySelectorAll('p'); var rr = rule(CFG, game); if (rr && rr.off) { lockEl.querySelector('h2').textContent = '지금은 쉬고 있는 게임이에요'; ps[0].textContent = '관리자가 이 게임을 잠시 꺼 두었어요. 다른 게임을 즐겨 보세요!'; ps[1].textContent = '' } else { ps[0].textContent = msg; ps[1].textContent = '⏰ 게임 시간: ' + ruleText(game) }
    ['keydown', 'keyup', 'mousedown', 'pointerdown', 'touchstart', 'wheel'].forEach(function (t) { lockEl.addEventListener(t, function (e) { e.stopPropagation() }) });
    (document.body || document.documentElement).appendChild(lockEl);
  }
  if (game) { cfg().then(lock); setInterval(lock, 30000) }

  window.MWT = {
    vid: vid,
    cfg: cfg,
    allowed: function (g) { return allowed(g) },
    hoursText: function (g) { return ruleText(g) },
    isOff: function (g) { var r = rule(CFG, g); return !!(r && r.off) },
    stats: function () { return rpc('mw_game_stats', { p_vid: vid }) },
    like: function (g) { return rpc('mw_toggle_like', { p_game: g, p_vid: vid }).then(function (r) { send(r.liked ? 'like' : 'unlike', { game: g }); return r }) }
  };
})();
