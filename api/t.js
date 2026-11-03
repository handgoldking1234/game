// 민왕게임월드 · 접속 기록 받기 (Vercel 서버 함수)
// 브라우저가 보낸 이벤트에 서버만 알 수 있는 정보(IP·지역·기기)를 붙여 Supabase에 저장해요.
// 원래 IP는 저장하지 않고, 마지막 자리를 가린 IP와 해시만 남겨요.
const crypto = require('crypto');

const SB_URL = process.env.SB_URL || 'https://flrdiplgoeyuvffwxvhq.supabase.co';
const SB_KEY = process.env.SB_KEY || 'sb_publishable_2ksFf_0qhrfq513RhbyEdA_dmGoJNb5';
const SALT = process.env.IP_SALT || 'minwang-game-world';
const KR = {'11':'서울','26':'부산','27':'대구','28':'인천','29':'광주','30':'대전','31':'울산','50':'세종','41':'경기','42':'강원','51':'강원','43':'충북','44':'충남','45':'전북','52':'전북','46':'전남','47':'경북','48':'경남','49':'제주'};
const EVS = new Set(['view', 'play', 'hb', 'end', 'click', 'like', 'unlike']);

const cut = (v, n) => (v == null ? null : String(v).slice(0, n));
const int = (v, max) => { const n = parseInt(v, 10); return Number.isFinite(n) && n >= 0 ? Math.min(n, max) : null; };

function maskIp(ip) {
  if (!ip) return null;
  if (ip.includes('.')) { const p = ip.split('.'); return p.length === 4 ? `${p[0]}.${p[1]}.${p[2]}.*` : null; }
  if (ip.includes(':')) return ip.split(':').slice(0, 3).join(':') + ':*';
  return null;
}

function parseUA(ua) {
  ua = ua || '';
  const L = ua.toLowerCase();
  let os = '기타';
  if (/cros/.test(L)) os = 'ChromeOS';
  else if (/android/.test(L)) os = 'Android';
  else if (/iphone|ipad|ipod/.test(L)) os = 'iOS';
  else if (/macintosh|mac os x/.test(L)) os = (/mobile/.test(L) ? 'iOS' : 'macOS');
  else if (/windows/.test(L)) os = 'Windows';
  else if (/linux/.test(L)) os = 'Linux';
  let br = '기타';
  if (/kakaotalk/.test(L)) br = '카카오톡';
  else if (/naver\(inapp|naver/.test(L)) br = '네이버 앱';
  else if (/whale/.test(L)) br = '웨일';
  else if (/samsungbrowser/.test(L)) br = '삼성 인터넷';
  else if (/edg\//.test(L)) br = '엣지';
  else if (/opr\/|opera/.test(L)) br = '오페라';
  else if (/firefox|fxios/.test(L)) br = '파이어폭스';
  else if (/crios|chrome\//.test(L)) br = '크롬';
  else if (/safari/.test(L)) br = '사파리';
  let dev = 'desktop';
  if (os === 'ChromeOS') dev = 'chromebook';
  else if (/ipad|tablet/.test(L) || (os === 'Android' && !/mobile/.test(L))) dev = 'tablet';
  else if (/mobi|iphone|ipod|android/.test(L)) dev = 'mobile';
  const bot = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|yeti|daum/.test(L);
  return { os, br, dev, bot };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.statusCode = 204; return res.end(); }
  let body = req.body;
  try {
    if (typeof body === 'string') body = JSON.parse(body);
    else if (!body || typeof body !== 'object') {
      const chunks = []; for await (const c of req) chunks.push(c);
      body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
    }
  } catch (e) { res.statusCode = 400; return res.end(); }
  const list = Array.isArray(body) ? body.slice(0, 20) : [body];
  const h = req.headers;
  const ua = h['user-agent'] || '';
  const u = parseUA(ua);
  if (u.bot) { res.statusCode = 204; return res.end(); }
  const ip = String(h['x-real-ip'] || (h['x-forwarded-for'] || '').split(',')[0] || '').trim();
  const dec = v => { try { return v ? decodeURIComponent(v) : null; } catch (e) { return v || null; } };
  const base = {
    dev: u.dev, os: u.os, br: u.br, ua: cut(ua, 300),
    country: cut(h['x-vercel-ip-country'], 8), region: cut((h['x-vercel-ip-country'] === 'KR' && KR[h['x-vercel-ip-country-region']]) || dec(h['x-vercel-ip-country-region']), 40), city: cut(dec(h['x-vercel-ip-city']), 60),
    ip_mask: maskIp(ip), ip_hash: ip ? crypto.createHash('sha256').update(ip + SALT).digest('hex').slice(0, 24) : null,
  };
  const rows = list.filter(b => b && EVS.has(b.ev)).map(b => Object.assign({
    ev: b.ev, game: cut(b.game, 40), path: cut(b.path, 120), vid: cut(b.vid, 40), sid: cut(b.sid, 40),
    dur: int(b.dur, 86400), ref: cut(b.ref, 120), sw: int(b.sw, 10000), sh: int(b.sh, 10000), lang: cut(b.lang, 16),
  }, base));
  if (!rows.length) { res.statusCode = 204; return res.end(); }
  try {
    const r = await fetch(`${SB_URL}/rest/v1/mw_events`, {
      method: 'POST',
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(rows),
    });
    res.statusCode = r.ok ? 204 : 502;
    if (!r.ok) res.setHeader('X-MW-Err', String(r.status));
  } catch (e) { res.statusCode = 502; }
  res.end();
};
module.exports.parseUA = parseUA;
module.exports.maskIp = maskIp;
