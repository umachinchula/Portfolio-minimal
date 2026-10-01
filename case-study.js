document.querySelectorAll('[data-case-tracker]').forEach((tracker) => {
  const links = [...tracker.querySelectorAll('.case-tracker-link')]
  const targets = links.map((link) => {
    const anchor = document.querySelector(link.getAttribute('href'))
    return anchor?.closest('.case-section, .case-chapter, .case-hero') || anchor
  }).filter(Boolean)
  const progress = tracker.querySelector('.case-tracker-progress')
  const scroller = tracker.querySelector('.case-tracker-scroll')
  let activeIndex = 0

  const render = (index, reveal = false) => {
    activeIndex = Math.max(0, Math.min(index, links.length - 1))
    links.forEach((link, itemIndex) => {
      link.classList.toggle('is-active', itemIndex === activeIndex)
      link.classList.toggle('is-complete', itemIndex < activeIndex)
      link.setAttribute('aria-current', itemIndex === activeIndex ? 'location' : 'false')
    })
    const active = links[activeIndex]
    progress.style.width = `${active.offsetLeft + active.offsetWidth}px`
    if (reveal && window.innerWidth < 744) {
      scroller.scrollTo({ left: Math.max(0, active.offsetLeft - 20), behavior: 'smooth' })
    }
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
    if (!visible.length) return
    visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))
    render(targets.indexOf(visible[0].target), true)
  }, { rootMargin: '-112px 0px -68% 0px', threshold: 0 })

  targets.forEach((target) => observer.observe(target))
  links.forEach((link, index) => link.addEventListener('click', (event) => {
    event.preventDefault()
    const target = targets[index]
    history.replaceState(null, '', link.getAttribute('href'))
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    render(index, true)
  }))
  new ResizeObserver(() => render(activeIndex)).observe(tracker.querySelector('.case-tracker-row'))
  render(0)
})
