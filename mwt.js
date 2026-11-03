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
  window.MWT = {
    vid: vid,
    stats: function () { return rpc('mw_game_stats', { p_vid: vid }) },
    like: function (g) { return rpc('mw_toggle_like', { p_game: g, p_vid: vid }).then(function (r) { send(r.liked ? 'like' : 'unlike', { game: g }); return r }) }
  };
})();
