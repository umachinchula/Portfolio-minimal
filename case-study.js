const index = document.querySelector('[data-case-tracker]')
const sections = [...index.querySelectorAll('.case-tracker-link')].flatMap((link) => {
  const anchor = document.getElementById(link.hash.slice(1))
  if (!anchor) return []
  return [{ link, target: anchor.closest('.case-section, .case-chapter, .case-hero') || anchor }]
})

let frame = 0
function updateIndex() {
  frame = 0
  let active = sections[0]
  for (const section of sections) {
    if (section.target.getBoundingClientRect().top <= 80) active = section
  }
  for (const section of sections) {
    if (section === active) section.link.setAttribute('aria-current', 'location')
    else section.link.removeAttribute('aria-current')
  }
}

function scheduleIndexUpdate() {
  if (!frame) frame = requestAnimationFrame(updateIndex)
}

window.addEventListener('scroll', scheduleIndexUpdate, { passive: true })
window.addEventListener('resize', scheduleIndexUpdate)
window.addEventListener('load', scheduleIndexUpdate)
updateIndex()
