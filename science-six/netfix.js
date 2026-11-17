/* ===== 민왕게임월드 온라인 연결 도우미 v2 =====
   PeerJS(WebRTC)로 먼저 연결하고, 안 되면(서버 장애·학교/통신사 방화벽) MQTT 중계 서버로 자동 전환해요.
   게임 코드는 그대로 new Peer(...)를 쓰면 돼요. */
(function(){
if(window.__MWG_NET)return;window.__MWG_NET=2;
var RealPeer=window.Peer;
var BROKERS=window.MWG_MQTT||['wss://broker.emqx.io:8084/mqtt','wss://broker.hivemq.com:8884/mqtt','wss://test.mosquitto.org:8081/mqtt'];
var ICE=[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'},{urls:'stun:stun.cloudflare.com:3478'},
 {urls:'turn:openrelay.metered.ca:80',username:'openrelayproject',credential:'openrelayproject'},
 {urls:'turn:openrelay.metered.ca:443',username:'openrelayproject',credential:'openrelayproject'},
 {urls:'turn:openrelay.metered.ca:443?transport=tcp',username:'openrelayproject',credential:'openrelayproject'}];
var TOPIC='mwgame/v2/';
function rid(n){var s='',c='abcdefghijkmnpqrstuvwxyz23456789';for(var i=0;i<(n||10);i++)s+=c[Math.random()*c.length|0];return s}
function Em(){this._h={}}
Em.prototype.on=function(e,f){(this._h[e]=this._h[e]||[]).push(f);return this};
Em.prototype.off=function(e,f){var a=this._h[e];if(a){var i=a.indexOf(f);if(i>=0)a.splice(i,1)}return this};
Em.prototype.emit=function(e){var a=(this._h[e]||[]).slice(),args=[].slice.call(arguments,1);for(var i=0;i<a.length;i++){try{a[i].apply(this,args)}catch(err){console.error(err)}}};
function inherit(C){C.prototype=Object.create(Em.prototype);C.prototype.constructor=C}

/* ---------- 아주 작은 MQTT 3.1.1 (웹소켓) ---------- */
var te=new TextEncoder(),td=new TextDecoder();
function str(s){var b=te.encode(s);var o=new Uint8Array(2+b.length);o[0]=b.length>>8;o[1]=b.length&255;o.set(b,2);return o}
function cat(arr){var n=0,i;for(i=0;i<arr.length;i++)n+=arr[i].length;var o=new Uint8Array(n),p=0;for(i=0;i<arr.length;i++){o.set(arr[i],p);p+=arr[i].length}return o}
function pkt(h,body){var len=body.length,lb=[];do{var d=len%128;len=Math.floor(len/128);if(len>0)d|=128;lb.push(d)}while(len>0);return cat([new Uint8Array([h].concat(lb)),body])}
function Mqtt(clientId){Em.call(this);this.cid=clientId;this.bi=0;this.ok=false;this.subs=[];this.buf=new Uint8Array(0);this.pid=1;this.dead=false;this._go()}
inherit(Mqtt);
Mqtt.prototype._go=function(){var self=this;if(this.dead)return;if(this.bi>=BROKERS.length){this.emit('fail');return}
  var url=BROKERS[this.bi],ws,done=false;try{ws=new WebSocket(url,'mqtt')}catch(e){this.bi++;return this._go()}
  ws.binaryType='arraybuffer';this.ws=ws;
  var to=setTimeout(function(){if(!done){done=true;try{ws.close()}catch(e){}self.bi++;self._go()}},6000);
  ws.onopen=function(){var body=cat([str('MQTT'),new Uint8Array([4,2,0,40]),str(self.cid)]);ws.send(pkt(0x10,body))};
  ws.onmessage=function(ev){self._rx(new Uint8Array(ev.data),function(){if(!done){done=true;clearTimeout(to)}})};
  ws.onerror=function(){};
  ws.onclose=function(){clearTimeout(to);var was=self.ok;self.ok=false;clearInterval(self.pt);if(self.dead)return;if(!done){done=true;self.bi++;self._go();return}
    if(was){self.emit('down');setTimeout(function(){if(!self.dead){self.bi=0;self._go()}},1500)}}};
Mqtt.prototype._rx=function(chunk,onConn){var b=cat([this.buf,chunk]);var p=0;
  while(p<b.length){var h=b[p],mul=1,len=0,q=p+1,d;do{if(q>=b.length){this.buf=b.slice(p);return}d=b[q++];len+=(d&127)*mul;mul*=128}while(d&128);
    if(q+len>b.length){this.buf=b.slice(p);return}var body=b.subarray(q,q+len);p=q+len;var t=h>>4;
    if(t===2){if(body[1]===0){onConn();var first=!this.everOk;this.ok=true;this.everOk=true;var self=this;this.pt=setInterval(function(){try{self.ws.send(new Uint8Array([0xC0,0]))}catch(e){}},20000);for(var i=0;i<this.subs.length;i++)this._sub(this.subs[i]);this.emit(first?'ready':'up')}else{try{this.ws.close()}catch(e){}}}
    else if(t===3){var tl=(body[0]<<8)|body[1];var topic=td.decode(body.subarray(2,2+tl));var off=2+tl+((h>>1)&3?2:0);this.emit('msg',topic,td.decode(body.subarray(off)))}}
  this.buf=new Uint8Array(0)};
Mqtt.prototype._sub=function(t){var id=this.pid++&65535||1;this.ws.send(pkt(0x82,cat([new Uint8Array([id>>8,id&255]),str(t),new Uint8Array([0])])))};
Mqtt.prototype.sub=function(t){this.subs.push(t);if(this.ok)this._sub(t)};
Mqtt.prototype.pub=function(t,s){if(!this.ok)return false;try{this.ws.send(pkt(0x30,cat([str(t),te.encode(s)])));return true}catch(e){return false}};
Mqtt.prototype.close=function(){this.dead=true;clearInterval(this.pt);try{this.ws.send(new Uint8Array([0xE0,0]));this.ws.close()}catch(e){}};

/* ---------- 연결 하나 (PeerJS 또는 MQTT를 감싸요) ---------- */
function Conn(peer,remote){Em.call(this);this.peer=remote;this.open=false;this.reliable=true;this._p=peer;this._k=null;this._rc=null;this.closed=false;this.via=''}
inherit(Conn);
Conn.prototype.send=function(d){if(!this.open||this.closed)return;if(this._rc){try{this._rc.send(d)}catch(e){}}else if(this._k){this._p._mq.pub(TOPIC+this.peer,JSON.stringify({t:'d',c:this._k,f:this._p.id,d:d}));this._tx=Date.now()}};
Conn.prototype.close=function(){if(this.closed)return;this.closed=true;var was=this.open;this.open=false;if(this._rc){try{this._rc.close()}catch(e){}}if(this._k){this._p._mq&&this._p._mq.pub(TOPIC+this.peer,JSON.stringify({t:'fin',c:this._k,f:this._p.id}));delete this._p._mc[this._k]}clearInterval(this._ka);if(was)this.emit('close')};
Conn.prototype._useReal=function(rc){var self=this;this._rc=rc;this.via='webrtc';
  rc.on('data',function(d){self.emit('data',d)});rc.on('close',function(){if(!self.closed){self.closed=true;self.open=false;self.emit('close')}});rc.on('error',function(e){self.emit('error',e)})};
Conn.prototype._setOpen=function(){var self=this;if(this.open||this.closed)return;this.open=true;setTimeout(function(){self.emit('open')},0)};
Conn.prototype._useMq=function(k){var self=this;this._k=k;this.via='relay';this._rx=Date.now();this._p._mc[k]=this;
  this._ka=setInterval(function(){if(!self.open)return;if(Date.now()-(self._tx||0)>3000)self._p._mq.pub(TOPIC+self.peer,JSON.stringify({t:'png',c:k,f:self._p.id}));if(Date.now()-self._rx>16000){self.close()}},2000)};

/* ---------- Peer 대신 쓰는 SmartPeer ---------- */
function SmartPeer(id,opts){if(!(this instanceof SmartPeer))return new SmartPeer(id,opts);Em.call(this);var self=this;
  if(id&&typeof id==='object'){opts=id;id=undefined}
  this.id=id||('g'+rid(11));this.isHost=!!id;this.opts=opts||{};this.destroyed=false;this.open=false;this._mc={};this._openSent=false;this._rpOpen=false;this._mqReady=false;
  // 1) PeerJS
  if(RealPeer){try{var o={};for(var k in this.opts)o[k]=this.opts[k];o.config=o.config||{iceServers:ICE};
    this._rp=new RealPeer(this.id,o);
    this._rp.on('open',function(){self._rpOpen=true;self._open()});
    this._rp.on('connection',function(rc){var c=new Conn(self,rc.peer);rc.on('open',function(){if(c.closed)return;c._useReal(rc);c._setOpen();self.emit('connection',c)})});
    this._rp.on('error',function(e){var t=e&&e.type;if(t==='unavailable-id'){self.emit('error',e);return}if(t==='peer-unavailable'){var m=/peer\s+(\S+)/i.exec(e.message||'');self.emit('_pu',m?m[1]:'');return}self._rpBad=true;if(!self._rpOpen)self._maybeOpen()});
    this._rp.on('disconnected',function(){if(!self.destroyed){try{self._rp.reconnect()}catch(e){}}});
  }catch(e){this._rp=null;this._rpBad=true}}else this._rpBad=true;
  // 2) MQTT 중계 (항상 함께 켜 둬요)
  this._mq=new Mqtt('mw'+rid(12));
  this._mq.on('ready',function(){self._mqReady=true;self._maybeOpen()});
  this._mq.on('fail',function(){self._mqBad=true;if(!self._openSent&&(self._rpBad||!RealPeer))self.emit('error',{type:'network',message:'연결 서버에 닿지 못했어요'})});
  this._mq.on('msg',function(t,s){self._onMsg(s)});
  this._mq.sub(TOPIC+this.id);
  setTimeout(function(){self._waited=true;self._maybeOpen()},3500)}
inherit(SmartPeer);
SmartPeer.prototype._maybeOpen=function(){if(this._openSent||this.destroyed)return;if(this._rpOpen)return this._open();if(this._mqReady&&(this._waited||this._rpBad))this._open()};
SmartPeer.prototype._open=function(){if(this._openSent||this.destroyed)return;this._openSent=true;this.open=true;var self=this;setTimeout(function(){self.emit('open',self.id)},0)};
SmartPeer.prototype._onMsg=function(s){var m;try{m=JSON.parse(s)}catch(e){return}if(!m||!m.c)return;var c=this._mc[m.c];
  if(m.t==='syn'){if(!this.isHost&&!this._acceptAll)return;if(!c){c=new Conn(this,String(m.f));c._useMq(m.c);c._setOpen();this.emit('connection',c)}c._rx=Date.now();this._mq.pub(TOPIC+m.f,JSON.stringify({t:'ack',c:m.c,f:this.id}));return}
  if(!c)return;c._rx=Date.now();
  if(m.t==='ack'){if(c._wait){c._wait=false;clearInterval(c._synT);c._setOpen()}}
  else if(m.t==='d'){if(c.open)c.emit('data',m.d)}
  else if(m.t==='fin'){if(!c.closed){c.closed=true;var was=c.open;c.open=false;clearInterval(c._ka);delete this._mc[m.c];if(was)c.emit('close')}}};
SmartPeer.prototype.connect=function(remote,opts){var self=this,c=new Conn(this,remote);var fellBack=false;
  function relay(){if(fellBack||c.closed||c.open)return;fellBack=true;
    var go=function(){var k=rid(12);c._useMq(k);c._wait=true;var n=0;var syn=function(){if(!c._wait||c.closed){clearInterval(c._synT);return}if(++n>8){clearInterval(c._synT);c._wait=false;c.closed=true;self.emit('error',{type:'peer-unavailable',message:'Could not connect to peer '+remote});c.emit('error',{type:'peer-unavailable'});return}self._mq.pub(TOPIC+remote,JSON.stringify({t:'syn',c:k,f:self.id}))};syn();c._synT=setInterval(syn,1300)};
    if(self._mqReady)go();else{var w=setInterval(function(){if(self._mqReady){clearInterval(w);go()}else if(self._mqBad){clearInterval(w);self.emit('error',{type:'network'})}},300)}}
  if(this._rp&&this._rpOpen&&!this._rpBad){try{var rc=this._rp.connect(remote,opts||{reliable:true});
      rc.on('open',function(){if(c.open||c.closed){try{rc.close()}catch(e){}return}if(fellBack){if(c._wait){c._wait=false;clearInterval(c._synT);if(c._k)delete self._mc[c._k];clearInterval(c._ka);c._k=null}else{try{rc.close()}catch(e){}return}}c._useReal(rc);c._setOpen()});
      var pu=function(who){if(!who||who===remote)relay()};this.on('_pu',pu);
      setTimeout(relay,7000)}catch(e){relay()}}
  else relay();
  return c};
SmartPeer.prototype.destroy=function(){if(this.destroyed)return;this.destroyed=true;for(var k in this._mc){try{this._mc[k].close()}catch(e){}}if(this._rp){try{this._rp.destroy()}catch(e){}}if(this._mq)this._mq.close();this.emit('close')};
SmartPeer.prototype.disconnect=function(){this.destroy()};
SmartPeer.prototype.reconnect=function(){};
window.Peer=SmartPeer;window.MWG_RealPeer=RealPeer;
})();

