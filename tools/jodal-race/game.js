
/* ================= 나라장터 배송 레이스 ================= */
var T={Scene:Scene,PerspectiveCamera:PerspectiveCamera,WebGLRenderer:WebGLRenderer,Color:Color,Fog:Fog,HemisphereLight:HemisphereLight,DirectionalLight:DirectionalLight,Mesh:Mesh,Group:Group,BoxGeometry:BoxGeometry,CylinderGeometry:CylinderGeometry,SphereGeometry:SphereGeometry,PlaneGeometry:PlaneGeometry,ConeGeometry:ConeGeometry,TorusGeometry:TorusGeometry,BufferGeometry:BufferGeometry,Float32BufferAttribute:Float32BufferAttribute,MeshStandardMaterial:MeshStandardMaterial,MeshBasicMaterial:MeshBasicMaterial,CanvasTexture:CanvasTexture,RepeatWrapping:RepeatWrapping,Vector3:Vector3,CatmullRomCurve3:CatmullRomCurve3,Sprite:Sprite,SpriteMaterial:SpriteMaterial,SRGBColorSpace:SRGBColorSpace,DoubleSide:DoubleSide,RingGeometry:RingGeometry};
var $=function(id){return document.getElementById(id)};
var R=Math.random;
var FONT="'Pretendard','Apple SD Gothic Neo','Malgun Gothic','Noto Sans CJK KR','Noto Sans KR',sans-serif";

/* ---------- 소리 ---------- */
var AC=null,muted=false,engine=null;
function ac(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)()}catch(e){}return AC}
function tone(f,d,type,v,delay){if(muted||!ac())return;var t=AC.currentTime+(delay||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v||.1,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d)}
var sfx={
 box:function(){tone(660,.08,'square',.06);tone(990,.12,'square',.06,.07)},
 boost:function(){tone(300,.3,'sawtooth',.06);tone(600,.3,'sawtooth',.05,.05)},
 spin:function(){tone(220,.3,'sawtooth',.08);tone(160,.35,'sawtooth',.07,.12)},
 deliver:function(){tone(523,.1,'triangle',.1);tone(784,.18,'triangle',.1,.09)},
 coin:function(){tone(988,.06,'square',.05);tone(1319,.12,'square',.05,.06)},
 beep:function(h){tone(h?880:440,.2,'square',.08)},
 lap:function(){tone(659,.1,'triangle',.1);tone(880,.1,'triangle',.1,.1);tone(1175,.25,'triangle',.1,.2)}
};
function engineOn(){if(muted||!ac()||engine)return;var o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();o.type='sawtooth';f.type='lowpass';f.frequency.value=500;g.gain.value=.025;o.connect(f);f.connect(g);g.connect(AC.destination);o.start();engine={o:o,g:g}}
function engineSet(sp){if(engine){engine.o.frequency.setTargetAtTime(55+sp*3.2,AC.currentTime,.1)}}
function engineOff(){if(engine){try{engine.o.stop()}catch(e){}engine=null}}
$('snd').onclick=function(){muted=!muted;this.innerHTML='<svg class="i"><use href="#i-'+(muted?'mute':'sound')+'"/></svg>';if(muted)engineOff();else if(G&&G.running)engineOn()};

/* ---------- 렌더러 ---------- */
var renderer=new T.WebGLRenderer({canvas:$('cv'),antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
renderer.outputColorSpace=T.SRGBColorSpace;
var scene=new T.Scene();scene.background=new T.Color('#a9d4ff');scene.fog=new T.Fog('#cfe6ff',160,560);
var camera=new T.PerspectiveCamera(70,1,.5,1200);
scene.add(new T.HemisphereLight('#ffffff','#7fae63',1.6));
var sun=new T.DirectionalLight('#ffffff',1.6);sun.position.set(120,220,80);scene.add(sun);
function resize(){var w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<h?84:68;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

function ctex(w,h,draw){var c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);var t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t}
function M(c,o){return new T.MeshStandardMaterial(Object.assign({color:c,roughness:.6,metalness:.05},o||{}))}
function label(text,bg,fg,w,h){w=w||512;h=h||128;return ctex(w,h,function(x){x.fillStyle=bg;x.beginPath();x.roundRect?x.roundRect(4,4,w-8,h-8,h*.22):x.rect(4,4,w-8,h-8);x.fill();x.fillStyle=fg||'#fff';x.font='900 '+Math.round(h*.46)+'px '+FONT;x.textAlign='center';x.textBaseline='middle';x.fillText(text,w/2,h/2+4)})}

/* ---------- 트랙 ---------- */
var RAW=[[0,0],[120,-10],[220,30],[270,120],[230,210],[140,230],[90,300],[120,390],[60,460],[-60,470],[-150,410],[-170,310],[-250,250],[-270,140],[-200,60],[-110,20]];
var curve=new T.CatmullRomCurve3(RAW.map(function(p){return new T.Vector3(p[0],0,p[1])}),true,'centripetal');
var N=900,RW=17,P=curve.getSpacedPoints(N),TAN=[],SIDE=[];P.pop();
for(var i=0;i<N;i++){var a=P[(i+1)%N],b=P[(i-1+N)%N];var t=new T.Vector3(a.x-b.x,0,a.z-b.z).normalize();TAN.push(t);SIDE.push(new T.Vector3(-t.z,0,t.x))}
var LEN=curve.getLength();

function strip(off0,off1,mat,y,vRep){var pos=[],uv=[],idx=[],d=0;
 for(var i=0;i<=N;i++){var k=i%N,p=P[k],s=SIDE[k];if(i>0)d+=P[k].distanceTo(P[(k-1+N)%N]);
  pos.push(p.x+s.x*off0,y,p.z+s.z*off0,p.x+s.x*off1,y,p.z+s.z*off1);uv.push(0,d/vRep,1,d/vRep);
  if(i<N){var j=i*2;idx.push(j,j+1,j+2,j+1,j+3,j+2)}}
 var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
 var m=new T.Mesh(g,mat);scene.add(m);return m}
var texRoad=ctex(256,256,function(x,w,h){x.fillStyle='#4a4f5c';x.fillRect(0,0,w,h);for(var i=0;i<2500;i++){x.fillStyle='rgba('+(R()<.5?'0,0,0':'255,255,255')+','+R()*.12+')';x.fillRect(R()*w,R()*h,2,2)}x.fillStyle='#f5f5f5';x.fillRect(w/2-4,0,8,h*.5)});
texRoad.wrapS=texRoad.wrapT=T.RepeatWrapping;
strip(-RW/2,RW/2,new T.MeshStandardMaterial({map:texRoad,roughness:.9}),.05,14);
var texCurb=ctex(64,64,function(x,w,h){x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='#e5383b';x.fillRect(0,0,w,h/2)});texCurb.wrapS=texCurb.wrapT=T.RepeatWrapping;
strip(RW/2,RW/2+2,new T.MeshStandardMaterial({map:texCurb}),.07,4);strip(-RW/2-2,-RW/2,new T.MeshStandardMaterial({map:texCurb}),.07,4);
var ground=new T.Mesh(new T.PlaneGeometry(2400,2400),M('#79c25a',{roughness:1}));ground.rotation.x=-Math.PI/2;scene.add(ground);

/* 출발선 */
(function(){var p=P[0],s=SIDE[0],t=TAN[0];
 var chk=ctex(256,32,function(x,w,h){for(var i=0;i<16;i++)for(var j=0;j<2;j++){x.fillStyle=(i+j)%2?'#111':'#fff';x.fillRect(i*16,j*16,16,16)}});
 var line=new T.Mesh(new T.PlaneGeometry(RW,3),new T.MeshBasicMaterial({map:chk}));line.rotation.x=-Math.PI/2;line.rotation.z=-Math.atan2(t.z,t.x)+Math.PI/2;line.position.set(p.x,.12,p.z);
 line.rotation.order='YXZ';line.rotation.set(-Math.PI/2,0,0);var g=new T.Group();g.add(line);line.rotation.z=0;g.position.set(p.x,.12,p.z);g.rotation.y=Math.atan2(t.x,t.z);g.children[0].position.set(0,0,0);scene.add(g);
 var gate=new T.Group();var pm=M('#1f5eff');
 [-1,1].forEach(function(d){var c=new T.Mesh(new T.BoxGeometry(1.6,11,1.6),pm);c.position.set(d*(RW/2+2),5.5,0);gate.add(c)});
 var ban=new T.Mesh(new T.BoxGeometry(RW+6,3.4,1),new T.MeshBasicMaterial({map:label('나라장터 배송 레이스','#1f5eff','#fff',1024,160)}));ban.position.y=11;gate.add(ban);
 gate.position.set(p.x,0,p.z);gate.rotation.y=Math.atan2(t.x,t.z);scene.add(gate);
})();

/* 기관 건물(배송지) */
var STOPS=[
 {f:.16,nm:'초등학교',it:'책걸상',c:'#ffb703',roof:'#e85d04'},
 {f:.38,nm:'소방서',it:'소화기',c:'#e5383b',roof:'#9d0208'},
 {f:.6,nm:'재난 대피소',it:'구호 담요',c:'#f08c00',roof:'#6c584c'},
 {f:.8,nm:'보건소',it:'구급상자',c:'#2a9d8f',roof:'#1d6f65'}
];
STOPS.forEach(function(st,k){
 var i=Math.floor(st.f*N),p=P[i],s=SIDE[i],side=k%2?1:-1,t=TAN[i];
 var g=new T.Group();var bw=22,bh=12+k%2*4;
 var body=new T.Mesh(new T.BoxGeometry(bw,bh,14),M(st.c));body.position.y=bh/2;g.add(body);
 var win=ctex(256,128,function(x,w,h){x.fillStyle=st.c;x.fillRect(0,0,w,h);x.fillStyle='rgba(255,255,255,.85)';for(var a=0;a<5;a++)for(var b=0;b<2;b++)x.fillRect(14+a*48,18+b*56,30,34)});
 var face=new T.Mesh(new T.PlaneGeometry(bw-1,bh-2),new T.MeshBasicMaterial({map:win}));face.position.set(0,bh/2,7.05);g.add(face);
 var roof=new T.Mesh(new T.ConeGeometry(15,6,4),M(st.roof));roof.position.y=bh+3;roof.rotation.y=Math.PI/4;roof.scale.set(1,1,.7);g.add(roof);
 var sign=new T.Sprite(new T.SpriteMaterial({map:label(st.nm,'#14213d','#fff'),depthTest:true}));sign.scale.set(26,6.5,1);sign.position.y=bh+11;g.add(sign);
 g.position.set(p.x+s.x*side*(RW/2+20),0,p.z+s.z*side*(RW/2+20));g.lookAt(p.x,0,p.z);scene.add(g);
 /* 배송 아치 */
 var arch=new T.Mesh(new T.TorusGeometry(RW/2+1.5,.5,8,24,Math.PI),M(st.c,{emissive:st.c,emissiveIntensity:.25}));arch.position.set(p.x,0,p.z);arch.rotation.y=Math.atan2(t.x,t.z);scene.add(arch);
 st.i=i;
});
/* 주변 꾸미기 */
var winTex=ctex(64,128,function(x,w,h){x.fillStyle='#eef3fb';x.fillRect(0,0,w,h);x.fillStyle='#9db4d6';for(var a=0;a<3;a++)for(var b=0;b<6;b++)x.fillRect(6+a*20,8+b*20,12,12)});
(function(){var tm=M('#2d6a4f'),trm=M('#7f5539');var bm=['#dce7f5','#c9d8ee','#e9eef7'];
 for(var n=0;n<110;n++){var i=Math.floor(R()*N),p=P[i],s=SIDE[i],d=(R()<.5?-1:1)*(RW/2+14+R()*80);var x=p.x+s.x*d,z=p.z+s.z*d,ok=true;if(Math.abs(d)<RW/2+30&&R()>.75)continue;
  for(var q=0;q<N;q+=6){var pp=P[q];if((pp.x-x)*(pp.x-x)+(pp.z-z)*(pp.z-z)<(RW/2+8)*(RW/2+8)){ok=false;break}}if(!ok)continue;
  if(R()<.75){var tr=new T.Group();var c=new T.Mesh(new T.ConeGeometry(3.2,8,7),tm);c.position.y=6;var st=new T.Mesh(new T.CylinderGeometry(.6,.7,2.5),trm);st.position.y=1.2;tr.add(c,st);tr.position.set(x,0,z);var sc=.8+R()*.7;tr.scale.set(sc,sc,sc);scene.add(tr)}
  else{if(Math.abs(d)<RW/2+34)continue;var h=8+R()*16;var b=new T.Mesh(new T.BoxGeometry(12,h,12),new T.MeshStandardMaterial({map:winTex,color:bm[n%3]}));b.position.set(x,h/2,z);scene.add(b)}}
})();

/* ---------- 카트 ---------- */
var KCOL=['#1f5eff','#e5383b','#139a5b','#f4a300','#7b3fe4','#f15bb5'];
var KNAME=['바로(나)','튼튼배송','한빛물류','늘봄운송','미르택배','하랑로지스'];
function kartMesh(col,me){
 var g=new T.Group();var body=new T.Group();g.add(body);
 var base=new T.Mesh(new T.BoxGeometry(3.4,1,5.2),M(col,{roughness:.35,metalness:.2}));base.position.y=.9;body.add(base);
 var nose=new T.Mesh(new T.BoxGeometry(3,.7,1.4),M(col,{roughness:.35}));nose.position.set(0,.8,2.8);body.add(nose);
 var cargo=new T.Mesh(new T.BoxGeometry(2.8,2.2,2.4),new T.MeshStandardMaterial({map:ctex(128,128,function(x,w,h){x.fillStyle='#d9a066';x.fillRect(0,0,w,h);x.strokeStyle='#8a5a2b';x.lineWidth=8;x.strokeRect(4,4,w-8,h-8);x.fillStyle='#8a5a2b';x.fillRect(w/2-6,0,12,h);x.fillStyle='#fff';x.font='900 30px '+FONT;x.textAlign='center';x.fillText('조달',w/2,h*.75)})}));
 cargo.position.set(0,2.5,-1.3);body.add(cargo);
 /* 운전사: 로봇 머리 */
 var head=new T.Mesh(new T.BoxGeometry(1.7,1.4,1.4),M(me?'#1f5eff':'#5b6478'));head.position.set(0,2.3,.9);body.add(head);
 var face=new T.Mesh(new T.PlaneGeometry(1.4,1),new T.MeshBasicMaterial({map:ctex(64,48,function(x,w,h){x.fillStyle='#e8efff';x.fillRect(0,0,w,h);x.fillStyle='#14213d';x.beginPath();x.arc(20,20,5,0,7);x.arc(44,20,5,0,7);x.fill();x.lineWidth=4;x.strokeStyle='#14213d';x.beginPath();x.arc(32,28,9,.3,Math.PI-.3);x.stroke()})}));
 face.position.set(0,2.3,1.61);body.add(face);
 var ant=new T.Mesh(new T.SphereGeometry(.25,8,6),M('#f4a300'));ant.position.set(0,3.4,.9);body.add(ant);
 var wm=M('#1b1b1b',{roughness:.8});var wg=new T.CylinderGeometry(.75,.75,.7,14);
 [[-1.8,1.7],[1.8,1.7],[-1.8,-1.7],[1.8,-1.7]].forEach(function(w){var m=new T.Mesh(wg,wm);m.rotation.z=Math.PI/2;m.position.set(w[0],.75,w[1]);g.add(m)});
 if(me){var ring=new T.Mesh(new T.RingGeometry(2.8,3.3,32),new T.MeshBasicMaterial({color:'#ffd60a',transparent:true,opacity:.7,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.1;g.add(ring)}
 var tag=new T.Sprite(new T.SpriteMaterial({map:label(me?'나':KNAME[KCOL.indexOf(col)]||'',me?'#ffd60a':'rgba(20,33,61,.8)',me?'#14213d':'#fff',256,72)}));tag.scale.set(me?2.4:3.9,1.1,1);tag.position.y=4.6;g.add(tag);
 g.userData.body=body;g.userData.tag=tag;
 scene.add(g);return g;
}

/* ---------- 상자·함정·구리 ---------- */
var boxTex=ctex(128,128,function(x,w,h){var g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#7b3fe4');g.addColorStop(.5,'#1f5eff');g.addColorStop(1,'#00b4d8');x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='900 84px '+FONT;x.textAlign='center';x.textBaseline='middle';x.fillText('?',w/2,h/2+6)});
var trapTex=ctex(128,128,function(x,w,h){x.fillStyle='#2b2d42';x.beginPath();x.arc(w/2,h/2,w/2-4,0,7);x.fill();x.strokeStyle='#ff4d6d';x.lineWidth=8;x.stroke();x.lineWidth=9;x.strokeStyle='#fff';x.beginPath();x.arc(w/2-14,h/2-8,20,0,7);x.stroke();x.beginPath();x.arc(w/2+14,h/2-8,20,0,7);x.stroke();x.fillStyle='#ff4d6d';x.font='900 26px '+FONT;x.textAlign='center';x.fillText('담합',w/2,h-24)});
var ITEMS=[];
function placeAt(f,lat){var i=Math.floor(((f%1)+1)%1*N),p=P[i],s=SIDE[i];return {i:i,x:p.x+s.x*lat,z:p.z+s.z*lat}}
[.08,.3,.52,.72,.9].forEach(function(f){[-5.5,0,5.5].forEach(function(l){var q=placeAt(f,l);var m=new T.Mesh(new T.BoxGeometry(2.4,2.4,2.4),new T.MeshStandardMaterial({map:boxTex,emissive:'#3a2a8a',emissiveIntensity:.3,transparent:true,opacity:.92}));m.position.set(q.x,1.8,q.z);scene.add(m);ITEMS.push({k:'box',x:q.x,z:q.z,m:m,cd:0})})});
var TRAPS=[];
[.12,.24,.34,.47,.57,.66,.77,.86,.96].forEach(function(f,n){var q=placeAt(f,[-4.5,3,-1,5,-5,1.5,4,-3,0][n]);var m=new T.Mesh(new T.PlaneGeometry(5.2,5.2),new T.MeshBasicMaterial({map:trapTex,transparent:true}));m.rotation.x=-Math.PI/2;m.position.set(q.x,.15,q.z);scene.add(m);
 var glow=new T.Mesh(new T.RingGeometry(3,3.7,24),new T.MeshBasicMaterial({color:'#ff2d2d',transparent:true,opacity:0,side:T.DoubleSide}));glow.rotation.x=-Math.PI/2;glow.position.set(q.x,.2,q.z);scene.add(glow);
 TRAPS.push({x:q.x,z:q.z,m:m,g:glow,i:q.i,lat:[-4.5,3,-1,5,-5,1.5,4,-3,0][n]})});
var COPPER=[];
function makeCopper(){COPPER.forEach(function(c){scene.remove(c.m)});COPPER=[];for(var n=0;n<14;n++){var q=placeAt(.05+n*.068,Math.sin(n*1.7)*5);var m=new T.Mesh(new T.CylinderGeometry(1.1,1.1,.5,16),M('#c8691c',{metalness:.6,roughness:.3,emissive:'#7a3a0a',emissiveIntensity:.35}));m.rotation.x=Math.PI/2;m.position.set(q.x,1.6,q.z);m.visible=false;scene.add(m);COPPER.push({x:q.x,z:q.z,m:m,on:false})}}
makeCopper();

/* ---------- 상태 ---------- */
var LAPS=2,G=null,K=[],ME=null;
var input={l:false,r:false,brake:false,item:false};
function newKart(n){var me=n===0;var row=Math.floor(n/2),lat=n%2?4:-4;var i=(N-6-row*8)%N,p=P[i],s=SIDE[i];
 var t=TAN[i];return {n:n,me:me,nm:KNAME[n],x:p.x+s.x*lat,z:p.z+s.z*lat,yaw:Math.atan2(t.x,t.z),sp:0,idx:i,lap:-1,prog:0,boostT:0,spinT:0,lane:(R()-.5)*8,skill:.86+R()*.1,item:null,aiItemT:2+R()*6,done:false,fin:0,mesh:kartMesh(KCOL[n],me)}}
function nearIdx(k){var best=k.idx,bd=1e9;for(var d=-20;d<=40;d++){var i=(k.idx+d+N)%N,p=P[i],dd=(p.x-k.x)*(p.x-k.x)+(p.z-k.z)*(p.z-k.z);if(dd<bd){bd=dd;best=i}}return best}
function lateral(k){var p=P[k.idx],s=SIDE[k.idx];return (k.x-p.x)*s.x+(k.z-p.z)*s.z}

function start(){
 K.forEach(function(k){scene.remove(k.mesh)});
 K=[];for(var n=0;n<6;n++)K.push(newKart(n));ME=K[0];
 ITEMS.forEach(function(b){b.cd=0;b.m.visible=true});makeCopper();
 G={t:0,running:false,count:3.2,over:false,delivered:0,dodged:0,hit:0,copper:0,inno:0,ai:0,aiT:0,crisis:false,lastStop:-1,stopHit:{},nextStop:0,camYaw:ME.yaw,shake:0};
 $('sTitle').classList.remove('on');$('sEnd').classList.remove('on');$('hud').classList.add('on');$('touch').classList.add('on');$('home').style.display='';
 setItem(null);renderHud(true);
}

/* ---------- 아이템 ---------- */
var ITEM_INFO={
 inno:{nm:'혁신 부스터',d:'혁신제품 시범구매! 잠깐 아주 빨라져요',c:'#7b3fe4'},
 ai:{nm:'AI 돋보기',d:'담합 함정이 빨갛게 보이고 6초 동안 함정을 막아 줘요',c:'#1f5eff'},
 green:{nm:'녹색 충전',d:'전기 배송차 충전! 조금 빨라져요',c:'#2f9e44'}
};
function setItem(k){ME&&(ME.item=k);var s=$('slot');if(!k){s.innerHTML='<span class="empty">?</span>';s.classList.remove('full');$('tI').classList.remove('ready');return}
 s.innerHTML='<b style="color:'+ITEM_INFO[k].c+'">'+ITEM_INFO[k].nm+'</b>';s.classList.add('full');$('tI').classList.add('ready')}
function useItem(k,kt){var it=kt.item;if(!it)return;kt.item=null;
 if(it==='inno'){kt.boostT=2.4;kt.boostK=1.55;if(kt.me){G.inno++;sfx.boost();toast('혁신 부스터! 새 기술 제품을 먼저 써 보는 혁신조달','inno')}}
 if(it==='green'){kt.boostT=1.6;kt.boostK=1.3;if(kt.me){sfx.boost();toast('녹색 충전! 탄소를 덜 내는 전기 배송차','good')}}
 if(it==='ai'){kt.shieldT=6;if(kt.me){G.aiT=6;G.ai++;sfx.coin();toast('AI 돋보기! 6초 동안 담합 함정을 알아채고 피해요','blue')}}
 if(kt.me)setItem(null);
}

/* ---------- 움직임 ---------- */
function stepKart(k,dt){
 k.idx=nearIdx(k);
 var lat=lateral(k),off=Math.abs(lat)>RW/2+1;
 var maxSp=36*(k.me?1:k.skill)*(off?.55:1);
 var steer=0,thr=1;
 if(k.done){thr=.3}
 if(k.me){steer=(input.l?1:0)-(input.r?1:0);if(input.brake)thr=-.6}
 else{
  var look=(k.idx+14+Math.floor(k.sp*.25))%N,tp=P[look],ts=SIDE[look];
  var tx=tp.x+ts.x*k.lane,tz=tp.z+ts.z*k.lane;
  var want=Math.atan2(tx-k.x,tz-k.z),d=want-k.yaw;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
  steer=Math.max(-1,Math.min(1,d*2.2));
  /* 따라잡기 조절: 나와 너무 멀면 천천히, 뒤처지면 조금 빨리 */
  var gap=(k.prog-ME.prog)/N;maxSp*=gap>.08?.9:gap<-.08?1.06:1;
  k.aiItemT-=dt;if(k.aiItemT<=0){k.aiItemT=5+R()*7;if(R()<.5){k.boostT=1.4;k.boostK=1.25}}
  if(R()<dt*.25)k.lane=Math.max(-5,Math.min(5,k.lane+(R()-.5)*4));
 }
 if(k.spinT>0){thr=0;k.spinT-=dt;k.yaw+=dt*11;k.sp*=Math.pow(.25,dt)}
 else{
  if(k.boostT>0){k.boostT-=dt;maxSp*=k.boostK||1.4;thr=1}
  if(thr>0)k.sp+=(maxSp-k.sp)*Math.min(1,dt*(k.sp<maxSp?1.1:2.5));else k.sp=Math.max(0,k.sp+thr*40*dt);
  var turn=steer*dt*(1.7+Math.min(1,k.sp/20)*.6)*Math.min(1,k.sp/6+.15);k.yaw+=turn;
 }
 if(k.shieldT>0)k.shieldT-=dt;if(k.immT>0)k.immT-=dt;
 k.x+=Math.sin(k.yaw)*k.sp*dt;k.z+=Math.cos(k.yaw)*k.sp*dt;
 /* 길 밖 벽 */
 k.idx=nearIdx(k);lat=lateral(k);var lim=RW/2+7;
 if(Math.abs(lat)>lim){var s=SIDE[k.idx],push=(Math.abs(lat)-lim)*Math.sign(lat);k.x-=s.x*push;k.z-=s.z*push;k.sp*=.96}
 /* 바퀴 수 */
 var prevI=k.lastI==null?k.idx:k.lastI;
 if(prevI>N*.8&&k.idx<N*.2){k.lap++;if(k.me)onLap()}
 if(prevI<N*.2&&k.idx>N*.8){k.lap--}
 k.lastI=k.idx;
 k.prog=k.lap*N+k.idx;
 if(!k.done&&k.lap>=LAPS){k.done=true;k.fin=G.t;if(k.me)finish()}
}
function collide(){for(var a=0;a<K.length;a++)for(var b=a+1;b<K.length;b++){var A=K[a],B=K[b],dx=A.x-B.x,dz=A.z-B.z,d=Math.sqrt(dx*dx+dz*dz);if(d<3.6&&d>0){var o=(3.6-d)/2,nx=dx/d,nz=dz/d;A.x+=nx*o;A.z+=nz*o;B.x-=nx*o;B.z-=nz*o}}}

function onLap(){
 if(ME.lap<=0)return;
 if(ME.lap<LAPS){sfx.lap();center('마지막 바퀴!','공급망 위기 경보: 길 위의 구리를 모아 비축해요',2600,'red');G.crisis=true;COPPER.forEach(function(c){c.on=true;c.m.visible=true});
  scene.background=new T.Color('#ffd6c4');scene.fog.color=new T.Color('#ffe3d6')}
}
function pickups(){
 ITEMS.forEach(function(b){if(b.cd>0)return;K.forEach(function(k){if(b.cd>0)return;var dx=k.x-b.x,dz=k.z-b.z;if(dx*dx+dz*dz<9){b.cd=3;b.m.visible=false;
  if(k.me){if(!k.item){var r=R(),it=r<.45?'inno':r<.75?'ai':'green';setItem(it);sfx.box();toast(ITEM_INFO[it].nm+' 획득! '+(isTouch?'아이템 버튼':'스페이스 키')+'로 써요','blue')}}
  else if(!k.item){k.item=R()<.5?'inno':'green';setTimeout(function(){useItem(null,k)},800+R()*2500)}}})});
 TRAPS.forEach(function(t,tn){K.forEach(function(k){if(k.spinT>0||k.immT>0)return;var dx=k.x-t.x,dz=k.z-t.z;if(dx*dx+dz*dz<6.5){
  if(k.shieldT>0){if(k.me&&!t.saved){t.saved=1;toast('AI 돋보기가 담합 함정을 막았어요!','blue')}return}
  if(!k.me&&R()<.6)return; /* 상대는 가끔 피해요 */
  k.spinT=1.1;k.immT=2.6;if(k.me){G.stopHit['t'+ME.lap+':'+tn]=1;G.hit++;G.shake=.4;sfx.spin();toast(G.hit===1?'담합 함정! 업체끼리 미리 짠 가격에 걸려 빙글빙글. 피해 가요!':'또 담합 함정! 조심!','bad')}}})});
 if(G.crisis)COPPER.forEach(function(c){if(!c.on)return;var dx=ME.x-c.x,dz=ME.z-c.z;if(dx*dx+dz*dz<8){c.on=false;c.m.visible=false;G.copper++;ME.boostT=Math.max(ME.boostT,.5);ME.boostK=1.2;sfx.coin();floatHud('+1 구리 비축')}});
 /* 배송 */
 STOPS.forEach(function(st,n){var key=ME.lap+':'+n;if(G.stopHit[key]||ME.lap<0||ME.done)return;var d=(ME.idx-st.i+N)%N;if(d<6){G.stopHit[key]=1;G.delivered++;sfx.deliver();toast(st.nm+'에 '+st.it+' 납품 완료!','good');floatHud('납품 +1')}});
 /* 함정 피하기 세기 */
 TRAPS.forEach(function(t,n){var key='t'+ME.lap+':'+n;if(G.stopHit[key])return;var dx=ME.x-t.x,dz=ME.z-t.z,d2=dx*dx+dz*dz;if(d2<120){t.near=true}else if(t.near){t.near=false;G.stopHit[key]=1;if(ME.spinT<=0)G.dodged++}});
}

/* ---------- 화면 정보 ---------- */
var isTouch=('ontouchstart' in window)||navigator.maxTouchPoints>0;
function ranks(){return K.slice().sort(function(a,b){if(a.done&&b.done)return a.fin-b.fin;if(a.done)return -1;if(b.done)return 1;return b.prog-a.prog})}
function renderHud(full){
 var rk=ranks().indexOf(ME)+1;$('rkN').textContent=rk;
 $('lap').innerHTML='<small>바퀴</small>'+Math.min(LAPS,Math.max(1,ME.lap+1))+'/'+LAPS;
 var t=G.t;$('tm').textContent=Math.floor(t/60)+':'+('0'+Math.floor(t%60)).slice(-2)+'.'+Math.floor(t*10%10);
 $('spd').innerHTML=Math.round(ME.sp*3.2)+'<small>km/h</small>';
 $('dlv').textContent=G.delivered;
 var cop=$('cop');cop.style.display=G.crisis?'':'none';cop.textContent='구리 비축 '+G.copper;
 var aiS=$('aiS');aiS.style.display=G.aiT>0?'':'none';aiS.textContent='AI 돋보기 '+Math.ceil(G.aiT)+'초';
}
var mm=$('mm'),mx=mm.getContext('2d'),BB=(function(){var a=1e9,b=-1e9,c=1e9,d=-1e9;P.forEach(function(p){a=Math.min(a,p.x);b=Math.max(b,p.x);c=Math.min(c,p.z);d=Math.max(d,p.z)});return [a,b,c,d]})();
function mmXY(x,z){var w=mm.width,pad=14,s=Math.min((w-pad*2)/(BB[1]-BB[0]),(w-pad*2)/(BB[3]-BB[2]));return [pad+(x-BB[0])*s,pad+(BB[3]-z)*s]}
function drawMini(){var w=mm.width;mx.clearRect(0,0,w,w);mx.lineJoin='round';mx.lineWidth=10;mx.strokeStyle='rgba(20,33,61,.55)';mx.beginPath();P.forEach(function(p,i){var q=mmXY(p.x,p.z);i?mx.lineTo(q[0],q[1]):mx.moveTo(q[0],q[1])});mx.closePath();mx.stroke();mx.lineWidth=5;mx.strokeStyle='#fff';mx.stroke();
 STOPS.forEach(function(st){var q=mmXY(P[st.i].x,P[st.i].z);mx.fillStyle=st.c;mx.fillRect(q[0]-5,q[1]-5,10,10)});
 K.slice().reverse().forEach(function(k){var q=mmXY(k.x,k.z);mx.fillStyle=KCOL[k.n];mx.beginPath();mx.arc(q[0],q[1],k.me?7:5,0,7);mx.fill();if(k.me){mx.lineWidth=2.5;mx.strokeStyle='#fff';mx.stroke()}})}
function toast(t,k){var d=document.createElement('div');d.className='toast '+(k||'');d.textContent=t;$('toasts').appendChild(d);while($('toasts').children.length>2)$('toasts').firstChild.remove();setTimeout(function(){d.remove()},2600)}
function center(t,sub,ms,cls){var c=$('center');c.className='on '+(cls||'');c.innerHTML=t+(sub?'<small>'+sub+'</small>':'');clearTimeout(center.tm);if(ms)center.tm=setTimeout(function(){c.className=''},ms)}
function floatHud(t){var d=document.createElement('div');d.className='fl';d.textContent=t;document.body.appendChild(d);setTimeout(function(){d.remove()},900)}

/* ---------- 결과 ---------- */
function finish(){
 G.over=true;engineOff();
 setTimeout(function(){
  var rk=ranks().indexOf(ME)+1,st=rk===1?3:rk<=3?2:1;
  $('eTitle').textContent=rk===1?'1등 배송 완료!':rk<=3?rk+'등! 믿음직한 배송':rk+'등! 다음엔 더 빨리';
  var s='';for(var i=0;i<3;i++)s+=i<st?'★':'<span class="off">★</span>';$('eStars').innerHTML=s;
  $('eRank').textContent=rk+'등';$('eTime').textContent=Math.floor(ME.fin/60)+':'+('0'+Math.floor(ME.fin%60)).slice(-2);$('eDel').textContent=G.delivered+'곳';
  $('eDodge').textContent=G.dodged;$('eHit').textContent=G.hit;$('eCop').textContent=G.copper;
  $('eLearn').innerHTML='<span class="h">오늘 배운 조달 상식</span><p>조달청은 학교 책걸상부터 소방 장비까지 공공기관이 쓰는 물건을 사서 <b>제때</b> 공급해요. 나라장터는 공공기관 7만 1천여 곳과 업체 60만여 곳이 함께 쓰는 전자 조달 창구예요.</p><p>업체끼리 미리 짜고 가격을 맞추는 <b>담합</b>은 불공정 조달행위라 조달청이 조사하고 감독해요.</p><p>새 기술 제품을 공공이 먼저 사 주는 <b>혁신조달</b>, 원자재를 쌓아 두었다 위기 때 푸는 <b>비축</b>도 조달청의 일이에요.</p>';
  $('hud').classList.remove('on');$('touch').classList.remove('on');$('sEnd').classList.add('on');sfx.lap();
 },1600);
 center('도착!',null,1500);
}

/* ---------- 카메라·그리기 ---------- */
function drawKarts(dt){K.forEach(function(k){var m=k.mesh;if(!k.me){var cdx=camera.position.x-k.x,cdz=camera.position.z-k.z;m.userData.tag.visible=cdx*cdx+cdz*cdz>18*18}m.position.set(k.x,0,k.z);m.rotation.y=k.yaw;var b=m.userData.body;b.rotation.z=k.spinT>0?Math.sin(G.t*30)*.15:0;b.position.y=Math.sin(G.t*20+k.n)*.04})}
var camPos=new T.Vector3(),camLook=new T.Vector3();
function cameraStep(dt,instant){
 var d=G.camYaw-ME.yaw;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;G.camYaw-=d*Math.min(1,dt*(ME.spinT>0?1:5));
 var back=15+ME.sp*.07,up=8.5;var tx=ME.x-Math.sin(G.camYaw)*back,tz=ME.z-Math.cos(G.camYaw)*back;
 if(instant)camPos.set(tx,up,tz);else camPos.lerp(new T.Vector3(tx,up,tz),Math.min(1,dt*8));
 camera.position.copy(camPos);if(G.shake>0){camera.position.x+=(R()-.5)*G.shake*2;camera.position.y+=(R()-.5)*G.shake}
 camLook.set(ME.x+Math.sin(G.camYaw)*14,2.5,ME.z+Math.cos(G.camYaw)*14);camera.lookAt(camLook);
 camera.fov+=((innerWidth<innerHeight?84:68)+(ME.boostT>0?10:0)-camera.fov)*Math.min(1,dt*4);camera.updateProjectionMatrix();
}
var last=performance.now(),hudT=0,titleT=0;
function loop(now){
 var dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;
 if(G&&!G.over){
  if(!G.running){
   var before=Math.ceil(G.count);G.count-=dt;var after=Math.ceil(G.count);
   if(after!==before&&after>0&&after<=3){center(String(after),null,0);sfx.beep(false)}
   if(G.count<=0){G.running=true;center('출발!','학교·소방서·대피소·보건소에 물건을 배송해요',1300);sfx.beep(true);engineOn()}
  }else{
   G.t+=dt;
   K.forEach(function(k){stepKart(k,dt)});collide();pickups();
   if(input.item&&ME.item){useItem(null,ME);input.item=false}
   if(G.aiT>0)G.aiT-=dt;if(G.shake>0)G.shake-=dt;
   engineSet(ME.sp);
  }
  ITEMS.forEach(function(b){if(b.cd>0){b.cd-=dt;if(b.cd<=0)b.m.visible=true}b.m.rotation.y+=dt*1.5;b.m.position.y=1.8+Math.sin(now/300+b.x)*.25});
  TRAPS.forEach(function(t){t.g.material.opacity=G.aiT>0?.6+Math.sin(now/120)*.3:.22});
  COPPER.forEach(function(c){c.m.rotation.z+=dt*3});
  drawKarts(dt);cameraStep(dt,!G.running&&G.count>3);
  hudT-=dt;if(hudT<=0){hudT=.1;renderHud();drawMini()}
 }else if(!G){
  /* 시작 화면: 트랙 위를 천천히 돌며 보여 주기 */
  titleT+=dt*.02;var i=Math.floor((titleT%1)*N),p=P[i],t=TAN[i];camera.position.set(p.x-t.x*30+SIDE[i].x*25,22,p.z-t.z*30+SIDE[i].z*25);camera.lookAt(p.x+t.x*20,0,p.z+t.z*20);
 }else{drawKarts(dt);if(ME)cameraStep(dt)}
 renderer.render(scene,camera);
 requestAnimationFrame(loop);
}

/* ---------- 조작 ---------- */
addEventListener('keydown',function(e){var k=e.key;
 if(k==='ArrowLeft'||k==='a'||k==='A')input.l=true;if(k==='ArrowRight'||k==='d'||k==='D')input.r=true;
 if(k==='ArrowDown'||k==='s'||k==='S')input.brake=true;
 if(k===' '||k==='Shift'||k==='Control'){e.preventDefault();if(G&&G.running)input.item=true}
 if(k==='Enter'&&(!G||G.over)){start()}
});
addEventListener('keyup',function(e){var k=e.key;if(k==='ArrowLeft'||k==='a'||k==='A')input.l=false;if(k==='ArrowRight'||k==='d'||k==='D')input.r=false;if(k==='ArrowDown'||k==='s'||k==='S')input.brake=false});
function hold(id,key){var el=$(id);var on=function(e){e.preventDefault();input[key]=true;el.classList.add('down')},off=function(e){e.preventDefault();input[key]=false;el.classList.remove('down')};
 el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointercancel',off);el.addEventListener('pointerleave',off)}
hold('tL','l');hold('tR','r');hold('tB','brake');
$('tI').addEventListener('pointerdown',function(e){e.preventDefault();if(G&&G.running)input.item=true});
$('bStart').onclick=function(){ac();start()};$('bAgain').onclick=start;
$('home').onclick=function(){if(G){G.over=true}engineOff();K.forEach(function(k){scene.remove(k.mesh)});K=[];G=null;ME=null;$('hud').classList.remove('on');$('touch').classList.remove('on');$('sEnd').classList.remove('on');$('sTitle').classList.add('on');$('center').className='';this.style.display='none'};
$('keys').textContent=isTouch?'◀ ▶ 버튼으로 운전, 저절로 달려요':'← → 운전 · ↓ 브레이크 · 스페이스 아이템 (저절로 달려요)';
requestAnimationFrame(loop);
window.__race={get G(){return G},get ME(){return ME},get K(){return K},input:input,start:start,N:N,P:P,SIDE:SIDE,TAN:TAN,useItem:useItem,setItem:setItem,traps:function(){return TRAPS.map(function(t){return {x:t.x,z:t.z,i:t.i,lat:t.lat}})}};
