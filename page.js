const placeholders=[...document.querySelectorAll('[data-fragment]')];
await Promise.all(placeholders.map(async placeholder=>{
  const path=placeholder.dataset.fragment;
  const response=await fetch(path);
  if(!response.ok)throw new Error(`Unable to load ${path}`);
  const template=document.createElement('template');
  template.innerHTML=await response.text();
  placeholder.replaceWith(template.content);
}));
await import('./navigation.js');
