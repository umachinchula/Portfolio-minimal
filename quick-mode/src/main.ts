import {createCarousel} from './carousel';
const items = Array.from({length:8},(_,i)=>({
 src:`assets/project-${i+1}.jpg`,
 title:i<4?'Pitch40':'Inkwave',
  aspect:3/4,
}));
const mount=document.querySelector('#carousel');
const area=document.querySelector('.carousel-area');
const close=document.querySelector('#close');
const title=document.querySelector('#project-title');
const counter=document.querySelector('#counter');
const poster=document.querySelector('.project-poster');
const activateCarousel=()=>poster?.classList.add('is-hidden');
const engine=createCarousel(mount,document.querySelector('#cursor'),{items,panelHeight:450,gap:10,background:'#ffffff',entry:false,initialIndex:3,onActiveChange(i){title.replaceChildren(Object.assign(document.createElement('strong'),{textContent:items[i].title}),document.createTextNode(i<4?', from founder onboarding and admin verification to investor':', write, publish, monetize, and grow from one place'));counter.textContent=String(i+1).padStart(2,'0')+'/08';},onFocusChange(open){close.hidden=!open;},onEntryDone(){}});
if(!engine){const fallback=document.querySelector('#fallback');fallback.hidden=false;items.forEach(item=>{const img=new Image();img.src=item.src;img.alt=item.title;fallback.append(img);});}
area.addEventListener('pointerdown',activateCarousel,{capture:true});
area.addEventListener('wheel',activateCarousel,{capture:true,passive:true});
close.addEventListener('click',()=>engine?.closeFocus());
document.querySelector('#next').addEventListener('click',()=>{activateCarousel();engine?.next();});
document.querySelector('#previous').addEventListener('click',()=>{activateCarousel();engine?.previous();});
area.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){activateCarousel();e.preventDefault();engine?.next();}if(e.key==='ArrowLeft'){activateCarousel();e.preventDefault();engine?.previous();}if(e.key==='Escape')engine?.closeFocus();});
const productCarousel=document.querySelector<HTMLElement>('.product-carousel');
const productCards=[...document.querySelectorAll<HTMLElement>('.product-card')];
const productDots=[...document.querySelectorAll<HTMLButtonElement>('.product-dots button')];
let activeProduct=2;
let productPointerStart:number|null=null;
let productWheelLocked=false;
const renderProducts=()=>{
 productCards.forEach((card,i)=>{const delta=i-activeProduct;card.dataset.position=delta===0?'active':delta>0?`next-${delta}`:`prev-${Math.abs(delta)}`;card.setAttribute('aria-current',String(delta===0));});
 productDots.forEach((dot,i)=>{if(i===activeProduct)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
};
const showProduct=(i:number)=>{activeProduct=Math.max(0,Math.min(productCards.length-1,i));renderProducts();};
productCards.forEach((card,i)=>{card.addEventListener('click',()=>showProduct(i));card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();showProduct(i);}});});
productDots.forEach((dot,i)=>dot.addEventListener('click',()=>showProduct(i)));
productCarousel?.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showProduct(activeProduct+1);}if(event.key==='ArrowLeft'){event.preventDefault();showProduct(activeProduct-1);}});
productCarousel?.addEventListener('pointerdown',event=>{productPointerStart=event.clientX;productCarousel.setPointerCapture(event.pointerId);});
productCarousel?.addEventListener('pointerup',event=>{if(productPointerStart===null)return;const distance=event.clientX-productPointerStart;productPointerStart=null;if(Math.abs(distance)>50)showProduct(activeProduct+(distance<0?1:-1));});
productCarousel?.addEventListener('pointercancel',()=>{productPointerStart=null;});
productCarousel?.addEventListener('wheel',event=>{if(Math.abs(event.deltaX)<=Math.abs(event.deltaY)||Math.abs(event.deltaX)<18)return;event.preventDefault();event.stopPropagation();if(productWheelLocked)return;productWheelLocked=true;showProduct(activeProduct+(event.deltaX>0?1:-1));window.setTimeout(()=>{productWheelLocked=false;},420);},{passive:false});
renderProducts();
const intro=document.querySelector<HTMLElement>('.intro');
const introContent=intro?.querySelector<HTMLElement>('.content');
const heroPreview=document.querySelector<HTMLElement>('#hero-preview');
const heroTargets=[...document.querySelectorAll<HTMLElement>('.hero-focus')];
const heroCards=[...document.querySelectorAll<HTMLElement>('[data-preview-card]')];
const heroVideos=[...document.querySelectorAll<HTMLVideoElement>('.hero-preview-card video')];
heroVideos.forEach(video=>{video.muted=true;video.defaultMuted=true;video.volume=0;});
const hideHeroPreview=()=>{
 intro?.classList.remove('is-spotlighting');
 heroTargets.forEach(target=>target.classList.remove('is-active'));
 heroCards.forEach(card=>card.classList.remove('is-active'));
 heroPreview?.classList.remove('is-visible');
 heroPreview?.setAttribute('aria-hidden','true');
 heroVideos.forEach(video=>video.pause());
};
const showHeroPreview=(target:HTMLElement)=>{
 if(!intro||!introContent||!heroPreview)return;
 const previewName=target.dataset.preview;
 intro.classList.add('is-spotlighting');
 heroTargets.forEach(item=>item.classList.toggle('is-active',item===target));
 heroCards.forEach(card=>card.classList.toggle('is-active',card.dataset.previewCard===previewName));
 const activeCard=heroCards.find(card=>card.dataset.previewCard===previewName);
 if(!activeCard){heroPreview.classList.remove('is-visible');heroPreview.setAttribute('aria-hidden','true');return;}
 const contentRect=introContent.getBoundingClientRect();
 const targetRect=target.getBoundingClientRect();
 const cardWidth=activeCard.offsetWidth;
 const cardHeight=activeCard.offsetHeight;
 const center=targetRect.left+targetRect.width/2-contentRect.left;
 const left=Math.max(cardWidth/2,Math.min(contentRect.width-cardWidth/2,center));
 const top=targetRect.top-contentRect.top-cardHeight-14;
 heroPreview.style.left=`${left}px`;
 heroPreview.style.top=`${top}px`;
 heroPreview.classList.add('is-visible');
 heroPreview.setAttribute('aria-hidden','false');
 const video=activeCard.querySelector<HTMLVideoElement>('video');
 if(video){video.muted=true;video.defaultMuted=true;video.volume=0;void video.play().catch(()=>{});}
};
heroTargets.forEach(target=>{
 target.addEventListener('pointerenter',()=>showHeroPreview(target));
 target.addEventListener('focus',()=>showHeroPreview(target));
 target.addEventListener('pointerleave',hideHeroPreview);
 target.addEventListener('blur',hideHeroPreview);
});
document.querySelectorAll<HTMLAnchorElement>('.intro-social a[href="#"]').forEach(link=>{
 link.addEventListener('click',event=>event.preventDefault());
});
intro?.addEventListener('pointerleave',hideHeroPreview);
const nav=[...document.querySelectorAll('.dock nav:last-child a')];const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)nav.forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-25% 0px -50% 0px'});
document.querySelectorAll('main section').forEach(s=>observer.observe(s));

type SurfGameState='ready'|'playing'|'over';
type SurfObstacle={element:HTMLElement;x:number;gapTop:number;gapBottom:number;passed:boolean};
type SurfCharacter={id:string;src:string;label:string};
const surfCharacters:SurfCharacter[]=[{id:'surfer',src:'assets/surfer.png',label:'Surfer'}];
const surfGame=document.querySelector<HTMLElement>('#surf-game');
const surfPlayer=document.querySelector<HTMLElement>('#surf-player');
const surfPlayerImage=surfPlayer?.querySelector<HTMLImageElement>('img');
const surfObstacleLayer=document.querySelector<HTMLElement>('#surf-obstacles');
const surfScore=document.querySelector<HTMLElement>('#surf-score');
const surfFinalScore=document.querySelector<HTMLElement>('#surf-final-score');
const surfGameOver=document.querySelector<HTMLElement>('#surf-game-over');
const surfPlayAgain=document.querySelector<HTMLButtonElement>('#surf-play-again');
const surfSoundToggle=document.querySelector<HTMLButtonElement>('#surf-sound-toggle');
const footer=document.querySelector<HTMLElement>('#footer');
const surfPointSound=new Audio('assets/surf-point.mp3');
const surfCrashSound=new Audio('assets/surf-crash.mp3');
surfPointSound.preload='auto';
surfCrashSound.preload='auto';
surfPointSound.volume=.48;
surfCrashSound.volume=.58;
let surfState:SurfGameState='ready';
let surfPoints=0;
let surfY=0;
let surfVelocity=0;
let surfFrame=0;
let surfPreviousTime=0;
let surfObstacles:SurfObstacle[]=[];
let surfResizeTimer=0;
let surfMuted=false;
let surfGameInView=false;
const surfCharacter=surfCharacters[0];
if(surfPlayerImage){surfPlayerImage.src=surfCharacter.src;surfPlayerImage.dataset.character=surfCharacter.id;}
const surfDimensions=()=>{
 const width=surfGame?.clientWidth||0;
 const height=surfGame?.clientHeight||0;
 const playerWidth=surfPlayer?.offsetWidth||104;
 const playerHeight=surfPlayer?.offsetHeight||82;
 const playerX=Math.max(34,Math.min(width*.22,270));
 const obstacleWidth=width<744?50:58;
 const gapSize=Math.max(158,Math.min(190,height*.37));
 return{width,height,playerWidth,playerHeight,playerX,obstacleWidth,gapSize};
};
const surfRandomGap=()=>{
 const{height,gapSize}=surfDimensions();
 const topLimit=Math.max(76,height*.17);
 const bottomLimit=Math.max(88,height*.18);
 return topLimit+Math.random()*Math.max(1,height-topLimit-bottomLimit-gapSize);
};
const surfMakeObstacle=(x:number):SurfObstacle=>{
 const{gapSize}=surfDimensions();
 const gapTop=surfRandomGap();
 const pair=document.createElement('div');
 pair.className='surf-obstacle-pair';
 const upper=document.createElement('div');
 upper.className='surf-obstacle surf-obstacle--top';
 const lower=document.createElement('div');
 lower.className='surf-obstacle surf-obstacle--bottom';
 const upperBuoy=new Image();
 upperBuoy.src='assets/buoy.png';
 upperBuoy.alt='';
 const lowerBuoy=new Image();
 lowerBuoy.src='assets/buoy.png';
 lowerBuoy.alt='';
 upper.append(upperBuoy);
 lower.append(lowerBuoy);
 pair.append(upper,lower);
 surfObstacleLayer?.append(pair);
 const obstacle={element:pair,x,gapTop,gapBottom:gapTop+gapSize,passed:false};
 surfRenderObstacle(obstacle);
 return obstacle;
};
const surfRenderObstacle=(obstacle:SurfObstacle)=>{
 obstacle.element.style.transform=`translate3d(${obstacle.x}px,0,0)`;
 obstacle.element.style.setProperty('--gap-top',`${obstacle.gapTop}px`);
 obstacle.element.style.setProperty('--gap-bottom',`${obstacle.gapBottom}px`);
};
const surfClearObstacles=()=>{
 surfObstacles.forEach(obstacle=>obstacle.element.remove());
 surfObstacles=[];
};
const surfRenderPlayer=()=>{
 if(!surfPlayer)return;
 const{playerX}=surfDimensions();
 const angle=Math.max(-9,Math.min(12,surfVelocity*.032));
 surfPlayer.style.transform=`translate3d(${playerX}px,${surfY}px,0) rotate(${angle}deg)`;
};
const surfPlaySound=(sound:HTMLAudioElement)=>{
 if(surfMuted)return;
 sound.currentTime=0;
 void sound.play().catch(()=>{});
};
const surfSetMuted=(muted:boolean)=>{
 surfMuted=muted;
 surfPointSound.muted=muted;
 surfCrashSound.muted=muted;
 if(!surfSoundToggle)return;
 surfSoundToggle.textContent=muted?'Sound off':'Sound on';
 surfSoundToggle.setAttribute('aria-pressed',String(muted));
 surfSoundToggle.setAttribute('aria-label',muted?'Turn game sounds on':'Mute game sounds');
};
const surfSetPoints=(points:number,pulse=false)=>{
 surfPoints=points;
 if(surfScore)surfScore.textContent=String(points);
 if(surfFinalScore)surfFinalScore.textContent=String(points);
 if(pulse){
  surfPlaySound(surfPointSound);
  if(surfScore){surfScore.classList.remove('is-pulsing');void surfScore.offsetWidth;surfScore.classList.add('is-pulsing');window.setTimeout(()=>surfScore.classList.remove('is-pulsing'),190);}
 }
};
const surfSetState=(state:SurfGameState)=>{
 surfState=state;
 surfGame?.classList.toggle('is-ready',state==='ready');
 surfGame?.classList.toggle('is-playing',state==='playing');
 surfGame?.classList.toggle('is-over',state==='over');
 surfGame?.setAttribute('aria-label',state==='ready'?'Surfboard buoy game. Tap or press space to play.':state==='playing'?`Surfboard buoy game. Score ${surfPoints}.`:`Surfboard buoy game. Game over. Score ${surfPoints}.`);
 if(surfGameOver)surfGameOver.hidden=state!=='over';
};
const surfReset=()=>{
 cancelAnimationFrame(surfFrame);
 surfPreviousTime=0;
 surfVelocity=0;
 surfSetPoints(0);
 surfClearObstacles();
 const{height,playerHeight}=surfDimensions();
 surfY=Math.max(70,height*.52-playerHeight*.5);
 surfRenderPlayer();
 surfSetState('ready');
};
const surfBoost=()=>{surfVelocity=surfGame?.clientWidth&&surfGame.clientWidth<744?-218:-232;};
const surfEnd=()=>{
 if(surfState!=='playing')return;
 cancelAnimationFrame(surfFrame);
 surfSetState('over');
 surfPlaySound(surfCrashSound);
 window.setTimeout(()=>surfPlayAgain?.focus({preventScroll:true}),80);
};
const surfCollided=(obstacle:SurfObstacle)=>{
 const{playerX,playerWidth,playerHeight,obstacleWidth}=surfDimensions();
 const insetX=Math.max(9,playerWidth*.13);
 const insetY=Math.max(7,playerHeight*.12);
 const playerLeft=playerX+insetX;
 const playerRight=playerX+playerWidth-insetX;
 const playerTop=surfY+insetY;
 const playerBottom=surfY+playerHeight-insetY;
 const overlapsX=playerRight>obstacle.x+6&&playerLeft<obstacle.x+obstacleWidth-6;
 return overlapsX&&(playerTop<obstacle.gapTop||playerBottom>obstacle.gapBottom);
};
const surfTick=(time:number)=>{
 if(surfState!=='playing')return;
 const elapsed=Math.min(.032,Math.max(.001,(time-surfPreviousTime)/1000||.016));
 surfPreviousTime=time;
 const dimensions=surfDimensions();
 const gravity=dimensions.width<744?410:430;
 const speed=dimensions.width<744?132:158;
 surfVelocity+=gravity*elapsed;
 surfY+=surfVelocity*elapsed;
 surfRenderPlayer();
 const spacing=Math.max(290,Math.min(410,dimensions.width*.31));
 for(const obstacle of surfObstacles){
  obstacle.x-=speed*elapsed;
  if(!obstacle.passed&&obstacle.x+dimensions.obstacleWidth<dimensions.playerX){obstacle.passed=true;surfSetPoints(surfPoints+1,true);}
  surfRenderObstacle(obstacle);
 }
 const rightmost=Math.max(...surfObstacles.map(obstacle=>obstacle.x),dimensions.width);
 for(const obstacle of surfObstacles){
  if(obstacle.x+dimensions.obstacleWidth<-16){
   obstacle.x=rightmost+spacing;
   obstacle.gapTop=surfRandomGap();
   obstacle.gapBottom=obstacle.gapTop+dimensions.gapSize;
   obstacle.passed=false;
   surfRenderObstacle(obstacle);
  }
 }
 const hitEdge=surfY<0||surfY+dimensions.playerHeight>dimensions.height;
 if(hitEdge||surfObstacles.some(surfCollided)){surfEnd();return;}
 surfFrame=requestAnimationFrame(surfTick);
};
const surfStart=()=>{
 if(!surfGame||surfState==='playing')return;
 surfClearObstacles();
 const{width}=surfDimensions();
 const spacing=Math.max(290,Math.min(410,width*.31));
 surfObstacles=[0,1,2].map(index=>surfMakeObstacle(width+120+index*spacing));
 surfSetPoints(0);
 surfSetState('playing');
 surfBoost();
 surfPreviousTime=performance.now();
 surfFrame=requestAnimationFrame(surfTick);
};
const surfAction=()=>{if(surfState==='ready')surfStart();else if(surfState==='playing')surfBoost();};
surfGame?.addEventListener('pointerdown',event=>{
 if((event.target as HTMLElement).closest('button'))return;
 surfGame.focus({preventScroll:true});
 surfAction();
});
surfGame?.addEventListener('keydown',event=>{
 if(event.key!==' '&&event.code!=='Space')return;
 event.preventDefault();
 surfAction();
});
surfPlayAgain?.addEventListener('click',event=>{
 event.stopPropagation();
 surfReset();
 surfGame?.focus({preventScroll:true});
});
surfSoundToggle?.addEventListener('click',event=>{
 event.stopPropagation();
 surfSetMuted(!surfMuted);
 surfGame?.focus({preventScroll:true});
});
const surfIsTypingTarget=(target:EventTarget|null)=>target instanceof HTMLElement&&Boolean(target.closest('input,textarea,select,[contenteditable="true"]'));
const surfWindowKeydown=(event:KeyboardEvent)=>{
 if(event.defaultPrevented||!surfGameInView||surfIsTypingTarget(event.target)||(event.key!==' '&&event.code!=='Space'))return;
 event.preventDefault();
 surfGame?.focus({preventScroll:true});
 surfAction();
};
window.addEventListener('keydown',surfWindowKeydown);
const surfViewObserver=new IntersectionObserver(entries=>{
 surfGameInView=entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.2);
},{threshold:[0,.2,.5]});
if(surfGame)surfViewObserver.observe(surfGame);
const footerObserver=new IntersectionObserver(entries=>{
 document.body.classList.toggle('is-footer-active',entries.some(entry=>entry.isIntersecting));
},{threshold:0});
if(footer)footerObserver.observe(footer);
window.addEventListener('resize',()=>{
 window.clearTimeout(surfResizeTimer);
 surfResizeTimer=window.setTimeout(()=>{
  if(surfState==='playing'){surfY=Math.min(surfY,surfDimensions().height-surfDimensions().playerHeight);surfRenderPlayer();}
  else surfReset();
 },120);
});
surfSetMuted(false);
surfReset();
window.addEventListener('pagehide',()=>{
 engine?.destroy();
 cancelAnimationFrame(surfFrame);
 window.removeEventListener('keydown',surfWindowKeydown);
 surfViewObserver.disconnect();
 footerObserver.disconnect();
 surfPointSound.pause();
 surfCrashSound.pause();
},{once:true});

