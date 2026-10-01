window.PORTFOLIO_CMS = {
  images: [
    { selector: '[data-nav="home"] img', src: 'assets/figma-shared/home.svg' },
    { selector: '[data-nav="projects"] img', src: 'assets/figma-shared/projects.svg' },
    { selector: '[data-nav="products"] img', src: 'assets/figma-shared/products.svg' },
    { selector: '[data-nav="snapshots"] img', src: 'assets/figma-shared/snapshots.svg' },
    { selector: '[data-nav="journey"] img', src: 'assets/figma-shared/journey.svg' },
    { selector: '[data-nav="contact"] img', src: 'assets/figma-shared/user.svg' },
    { selector: '.ps-image-tile img', src: 'assets/figma-projects/portfolio-preview.png' },
    { selector: '.products-snapbud-art img', src: 'assets/figma-products/snapbud.png' },
    { selector: '.products-interface img', src: 'assets/figma-products/product-interface.png' },
    { selector: '.journey-experience-heading > img', src: 'assets/figma-journey/company-mark.png' },
    { selector: '.journey-photo-strip img, .footer-photo-strip img', src: 'assets/figma-journey/phone-art.png' }
  ],
  links: [
    { selector: '[href="https://pitch40.com/"]', href: 'https://pitch40.com/' },
    { selector: '[href="https://app.inkwave.dev"]', href: 'https://app.inkwave.dev' },
    { selector: '[href="https://snapbud.space"]', href: 'https://snapbud.space' },
    { selector: '[aria-labelledby="halo-heading"] .products-button', href: 'https://github.com/umachinchula/halo' },
    { selector: '[aria-labelledby="mova-heading"] .products-button', href: 'https://github.com/umachinchula/MOVA.git' },
    { selector: '[href="https://natfit.framer.website"]', href: 'https://natfit.framer.website' }
  ],
  text: [
    { selector: '#mova-heading + p', text: 'A simple daily stretching app.' },
    { selector: '#halo-heading + p', text: 'A customizable Dynamic Island for the Mac, with music, timers, downloads and calls built in.' }
  ]
};
