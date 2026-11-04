# Quick Mode preview

Separate from the main portfolio. Serve the repository root, then open `/quick-mode/`.

```sh
python3 -m http.server 4174 --bind 127.0.0.1
```

To rebuild the supplied carousel adaptation:

```sh
cd quick-mode
npm ci
npm run build
```

The native TypeScript engine preserves the supplied Three.js/GSAP liquid-glass effect with entry animation disabled. Drag, horizontal wheel/trackpad, arrow buttons, and keyboard arrows navigate; select a panel to focus it and Escape to close. Vertical scrolling continues through the page.

Figma assets are local. The sky uses a static export of its video fill; the original video is not exposed by the asset export. The footer game is intentionally deferred pending the next brief. Its supplied composite reference is retained as `assets/59564.png` but is not displayed as a fake interactive game.

The main portfolio and its navigation are unchanged. This preview is noindex until ready to publish.
