const projects={
  'social-links':{
    name:'Social Links',
    title:'Bring your work, social profiles, and personal links together in one place, making it easy to share who you are.',
    gallery:'assets/explorations/gallery-social-links.png',
    width:1465,
    height:440,
    frames:6
  },
  natfit:{
    name:'NatFit',
    title:'Track your fitness, build habits, and stay consistent.',
    gallery:'assets/explorations/gallery-natfit.png',
    width:1965,
    height:440,
    frames:8
  },
  'bucket-list':{
    name:'Bucket List',
    title:'Collect your dreams, plan new experiences, and make someday happen.',
    gallery:'assets/explorations/gallery-bucket-list.png',
    width:1465,
    height:440,
    frames:6
  },
  'invoice-maker':{
    name:'Invoice Maker',
    title:'Create invoices, track payments, and spend less time on paperwork.',
    gallery:'assets/explorations/gallery-invoice-maker.png',
    width:1465,
    height:440,
    frames:6
  },
  'my-store':{
    name:'My Store',
    title:'Save products you love, organise them, and keep your next purchase in sight.',
    gallery:'assets/explorations/gallery-my-store.png',
    width:228,
    height:443,
    repeat:6
  },
  calmier:{
    name:'Calmier',
    title:'Meditation for a calmer, stronger you.',
    gallery:'assets/explorations/gallery-calmier.png',
    width:228,
    height:443,
    repeat:6
  }
};

const params=new URLSearchParams(window.location.search);
const key=projects[params.get('project')]?params.get('project'):'social-links';
const project=projects[key];
const page=document.querySelector('[data-exploration-detail]');
const gallery=document.querySelector('[data-exploration-gallery]');
const track=document.querySelector('[data-gallery-track]');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelector('[data-project-name]').textContent=project.name;
document.querySelector('[data-project-title]').textContent=project.title;
document.title=`${project.name} UI Exploration | Chinchula Uma Maheswara Rao`;
page.dataset.project=key;

function createSet(hidden=false){
  const set=document.createElement('div');
  set.className='exploration-gallery-set';
  if(project.repeat)set.classList.add('is-single');
  if(hidden)set.setAttribute('aria-hidden','true');
  if(project.frames){
    const deviceWidth=212;
    const step=(project.width-deviceWidth)/(project.frames-1);
    for(let index=0;index<project.frames;index+=1){
      const device=document.createElement('div');
      device.className='exploration-gallery-device';
      device.style.backgroundImage=`url("${project.gallery}")`;
      device.style.backgroundSize=`${project.width}px ${project.height}px`;
      device.style.backgroundPosition=`-${index*step}px 0`;
      if(!hidden){
        device.setAttribute('role','img');
        device.setAttribute('aria-label',`${project.name} product mockup ${index+1}`);
      }
      set.append(device);
    }
    return set;
  }
  const count=project.repeat||1;
  for(let index=0;index<count;index+=1){
    const image=document.createElement('img');
    image.className='exploration-gallery-image';
    image.src=project.gallery;
    image.width=project.width;
    image.height=project.height;
    image.alt=hidden?'':`${project.name} product mockups`;
    image.decoding='async';
    image.draggable=false;
    set.append(image);
  }
  return set;
}

const firstSet=createSet();
track.append(firstSet,createSet(true));

let pauseUntil=0;
let lastTime=0;
let animationFrame=0;
let dragging=false;
let dragStartX=0;
let dragStartScroll=0;

function pause(duration=1800){pauseUntil=performance.now()+duration}

function animate(time){
  if(!lastTime)lastTime=time;
  const delta=Math.min(time-lastTime,34);
  lastTime=time;
  if(time>pauseUntil&&firstSet.offsetWidth){
    gallery.scrollLeft+=delta*.035;
    if(gallery.scrollLeft>=firstSet.offsetWidth)gallery.scrollLeft-=firstSet.offsetWidth;
  }
  animationFrame=requestAnimationFrame(animate);
}

gallery.addEventListener('wheel',()=>pause(),{passive:true});
gallery.addEventListener('touchstart',()=>pause(2200),{passive:true});
gallery.addEventListener('touchmove',()=>pause(2200),{passive:true});
gallery.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse')return;
  dragging=true;
  dragStartX=event.clientX;
  dragStartScroll=gallery.scrollLeft;
  gallery.setPointerCapture(event.pointerId);
  pause(2400);
});
gallery.addEventListener('pointermove',event=>{
  if(!dragging||event.pointerType!=='mouse')return;
  gallery.scrollLeft=dragStartScroll-(event.clientX-dragStartX);
  pause(2400);
});
gallery.addEventListener('pointerup',event=>{
  if(event.pointerType!=='mouse')return;
  dragging=false;
  if(gallery.hasPointerCapture(event.pointerId))gallery.releasePointerCapture(event.pointerId);
  pause(1600);
});
gallery.addEventListener('pointercancel',()=>{dragging=false;pause(1600)});

if(!reduceMotion)animationFrame=requestAnimationFrame(animate);
window.addEventListener('pagehide',()=>cancelAnimationFrame(animationFrame),{once:true});
