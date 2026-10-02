const sections = [...document.querySelectorAll('main > section, main > footer')];
const navLinks = [...document.querySelectorAll('[data-nav]')];
const dock = document.querySelector('.dock');
const dockWrap = document.querySelector('.dock-wrap');
const dockExtra = document.querySelector('.dock-extra');
const dockToggle = document.querySelector('.dock-toggle');
const counters = [...document.querySelectorAll('[data-count-for]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function applyPortfolioCms(){
  const cms=window.PORTFOLIO_CMS;
  if(!cms)return;
  for(const item of cms.images||[]){
    for(const node of document.querySelectorAll(item.selector)){
      node.src=item.src;
      if(item.srcset)node.srcset=item.srcset;
    }
  }
  for(const item of cms.links||[]){
    for(const node of document.querySelectorAll(item.selector))node.href=item.href;
  }
  for(const item of cms.text||[]){
    for(const node of document.querySelectorAll(item.selector))node.textContent=item.text;
  }
}

applyPortfolioCms();

const productVideos = [...document.querySelectorAll('[data-autoplay-video]')];

if(productVideos.length){
  const setVideoPlayback=(video,play)=>{
    if(play){
      const attempt=video.play();
      if(attempt&&typeof attempt.catch==='function')attempt.catch(()=>{});
    }else{
      video.pause();
    }
  };

  const videoObserver=new IntersectionObserver(entries=>{
    for(const entry of entries)setVideoPlayback(entry.target,entry.isIntersecting);
  },{threshold:.35});

  for(const video of productVideos){
    video.muted=true;
    video.playsInline=true;
    video.pause();
    videoObserver.observe(video);
  }
}

function updateNavigation(){
  const marker=window.scrollY+window.innerHeight*.45;
  let current=sections[0];
  for(const section of sections){if(section.offsetTop<=marker)current=section}
  for(const link of navLinks){
    const active=link.dataset.nav===current.id;
    link.classList.toggle('active',active);
    if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
  }
  dock.classList.toggle('is-home',current.id==='home');
  for(const counter of counters){
    const cards=[...document.querySelectorAll(`[data-stack="${counter.dataset.countFor}"]`)];
    if(!cards.length)continue;
    let index=0;
    for(let i=0;i<cards.length;i++){
      const stickyTop=parseFloat(getComputedStyle(cards[i]).top)||0;
      if(cards[i].getBoundingClientRect().top<=stickyTop+2)index=i;
    }
    counter.textContent=`${index+1} of ${cards.length}`;
  }
}

let frame=0;
window.addEventListener('scroll',()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;updateNavigation()})},{passive:true});
window.addEventListener('resize',updateNavigation);
updateNavigation();

const hyderabadTime=document.querySelector('[data-hyderabad-time]');
if(hyderabadTime){
  const updateHyderabadTime=()=>{
    const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
    hyderabadTime.textContent=time+' IST';
  };
  updateHyderabadTime();
  setInterval(updateHyderabadTime,60000);
}

const copyEmail=document.querySelector('[data-copy-email]');
if(copyEmail){
  copyEmail.addEventListener('click',async()=>{
    try{
      await navigator.clipboard.writeText('umamahesh.chinchula@gmail.com');
      copyEmail.setAttribute('aria-label','Email address copied');
      setTimeout(()=>copyEmail.setAttribute('aria-label','Copy email address'),2000);
    }catch{
      window.location.href='mailto:umamahesh.chinchula@gmail.com';
    }
  });
}

dockToggle.addEventListener('click',()=>{
  const open=dockExtra.hidden;
  dockExtra.hidden=!open;
  dockWrap.classList.toggle('menu-open',open);
  dockToggle.setAttribute('aria-expanded',String(open));
  dockToggle.textContent=open?'×':'+';
  dockToggle.setAttribute('aria-label',open?'Close navigation':'More navigation');
});
for(const link of dockWrap.querySelectorAll('a'))link.addEventListener('click',()=>{dockExtra.hidden=true;dockWrap.classList.remove('menu-open');dockToggle.setAttribute('aria-expanded','false');dockToggle.textContent='+'});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){dockExtra.hidden=true;dockWrap.classList.remove('menu-open');dockToggle.setAttribute('aria-expanded','false');dockToggle.textContent='+'}});

if(!reduceMotion&&window.Lenis){
  const lenis=new Lenis({
    duration:1.25,
    easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),
    smoothWheel:true,
    smoothTouch:false,
    wheelMultiplier:.86,
    touchMultiplier:1.2
  });
  function raf(time){
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  lenis.on('scroll',updateNavigation);
  document.addEventListener('click',event=>{
    const anchor=event.target.closest('a[href^="#"]');
    if(!anchor)return;
    const target=document.querySelector(anchor.getAttribute('href'));
    if(!target)return;
    event.preventDefault();
    lenis.scrollTo(target,{offset:-24,duration:1.1});
  });
}

const caseModal=document.querySelector('#case-study-password-modal');
if(caseModal){
  const modalContent={
    pitch40:{project:'PROJECT 1',title:'Pitch40 Marketplace Experience',description:'How I shaped a startup-investor platform by simplifying discovery, founder onboarding, and investment decision flows into one clear product experience.',href:'pitch40.html'},
    inkwave:{project:'PROJECT 2',title:'Inkwave Creator Platform Experience',description:'This case study shows how I designed a newsletter platform from 0 to 1, helping creators publish, monetize, and grow from one product experience.',href:'inkwave.html'}
  };
  const projectLabel=caseModal.querySelector('.case-modal-project');
  const title=caseModal.querySelector('#case-modal-title');
  const description=caseModal.querySelector('.case-modal-description');
  const form=caseModal.querySelector('.case-modal-form');
  const input=caseModal.querySelector('input');
  let destination='';

  function openCaseModal(project){
    const content=modalContent[project];
    if(!content)return;
    caseModal.dataset.project=project;
    projectLabel.textContent=content.project;
    title.textContent=content.title;
    description.textContent=content.description;
    destination=content.href;
    input.value='';
    caseModal.showModal();
    requestAnimationFrame(()=>input.focus());
  }

  for(const trigger of document.querySelectorAll('[data-modal-trigger]'))trigger.addEventListener('click',event=>{event.stopPropagation();openCaseModal(trigger.dataset.modalTrigger)});
  for(const card of document.querySelectorAll('[data-protected-project]'))card.addEventListener('click',event=>{if(event.target.closest('a,button,input,.ps-media-viewport'))return;openCaseModal(card.dataset.protectedProject)});
  caseModal.addEventListener('click',event=>{if(event.target===caseModal)caseModal.close()});
  form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;window.location.href=destination});
}
