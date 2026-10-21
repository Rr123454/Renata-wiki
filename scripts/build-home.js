/* Local, dependency-free authoring helper: node scripts/build-home.js */
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const copy = require('../assets/story/home-copy.json');
const navContext = { window: {} };
require('node:vm').runInNewContext(fs.readFileSync(path.join(root, 'js/site-content.js'), 'utf8'), navContext);
const homeNavigation = require('../js/navigation.js').render(navContext.window.SITE_DATA.nav);
const {ROCKET_ART} = require('../js/mission-home.js');
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const paragraph = key => `<p data-science-copy="${key}">${escape(copy[key]).replace('Bacteroides thetaiotaomicron', '<em>Bacteroides thetaiotaomicron</em>').replace('Escherichia coli', '<em>Escherichia coli</em>').replace('titled SulFlux,', 'titled <em>SulFlux</em>,')}</p>`;
// Clip source PNGs in SVG, preserving the supplied files and their transparent pixels.
const framed = (file, box, shape, label, id, width=1936, height=1452) => `<svg viewBox="${box}" role="img" aria-label="${label}" class="mission-framed-art"><defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs><image href="assets/story/${file}" width="${width}" height="${height}" clip-path="url(#${id})"/></svg>`;
// The supplied 6000×4498 PNG is unchanged; scale into the established animation
// coordinates and frame the bottle without cutting into its transparent outline.
const bottle = framed('sulflux-bottle.png?v=b8231ea2bea2', '700 470 490 750', 'M700 470H1190V1220H700Z', 'SulFlux bottle with an orange spaceship emblem', 'new-bottle-cut');
const shipFrame = ROCKET_ART.frame;
const ship = `<svg viewBox="${shipFrame.x} ${shipFrame.y} ${shipFrame.width} ${shipFrame.height}" role="img" aria-label="Detailed blue and orange SulFlux spaceship" class="mission-framed-art"><defs><clipPath id="new-ship-cut"><rect x="30" y="350" width="550" height="630"/></clipPath></defs><g transform="matrix(${ROCKET_ART.matrix.join(' ')})"><image href="assets/story/spaceship.png" width="1936" height="1452" clip-path="url(#new-ship-cut)"/></g></svg>`;
const bileAcids = `<svg viewBox="510 455 740 255" role="img" aria-label="LCA and DCA characters interacting with the intestinal lining" class="mission-framed-art"><image href="assets/story/lca-dca.webp" width="1936" height="1452"/></svg>`;
const insideShape = 'M833 999Q810 943 855 871Q893 807 974 765Q981 598 1105 470Q1205 340 1287 337Q1350 343 1440 460Q1553 586 1606 765Q1673 796 1734 878Q1765 956 1738 1038Q1695 1051 1595 980Q1577 1063 1439 1092L1398 1135Q1453 1218 1364 1273Q1321 1303 1267 1267Q1180 1236 1180 1178L1201 1133Q1170 1135 1140 1096Q1033 1084 997 977Q924 1016 863 1037Z';
const inside = id => framed('spaceship-inside.png', '810 315 960 985', insideShape, 'The spaceship interior, with its pilot seat, controls, and observation window', id);
const liver = framed('liver.png', '130 65 1370 1355', 'M180 390Q340 203 677 241L832 247 831 139Q859 81 925 83L959 143 954 236Q1102 215 1215 245Q1415 267 1470 325Q1481 362 1453 407L1370 517Q1376 581 1412 669Q1473 909 1355 1095Q1286 1203 1105 1247L844 1246Q838 1317 775 1380Q683 1396 621 1364L529 1342 467 1272Q385 1268 384 1186L391 1087 357 1197Q322 1210 288 1164Q223 1075 213 944L189 832Q165 684 172 549Z', 'Liver and surrounding digestive anatomy, with the gallbladder region indicated', 'liver-cut');
const person = framed('person-drinking.png', '0 190 1030 1240', 'M20 1390V840L36 654 55 612 55 468Q69 408 141 398L204 378Q256 378 306 426L350 463Q347 383 408 306Q302 300 269 327Q264 272 360 263L405 262Q479 197 578 204Q704 214 734 360L731 460 751 611 748 667Q817 721 908 835L1007 985 1020 1035Q1005 1152 947 1262L874 1379Q768 1407 706 1424L615 1387 580 1353Q432 1353 295 1334L270 1315 197 1297Q198 1211 225 1157L276 992Q169 998 66 970Q13 924 20 845Z', 'A person drinking from a SulFlux bottle', 'person-cut', 1052, 1578);
const planet = (n, target, title, subtitle) => `<a class="mission-planet-link mission-planet-link--${n}" href="#${target}" data-planet="${target}"><span class="mission-planet-image"><img src="assets/story/planet-${n}.png" width="386" height="365" alt=""/><span class="mission-planet-orbit" aria-hidden="true"></span></span><span class="mission-planet-label"><small>0${n} / ${subtitle}</small><strong>${title} <span aria-hidden="true">↗</span></strong></span></a>`;
const back = `<a class="mission-back" href="#observatory">← Back to the planets</a>`;
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Explore the SulFlux project with ULP-CA: a journey from bottle to spaceship, through three interactive worlds." />
  <title>ULP-CA · SulFlux</title>
  <link rel="canonical" href="index.html" />
  <link rel="stylesheet" href="css/reset.css" />
  <link rel="stylesheet" href="css/loading-screen.css" />
  <link rel="stylesheet" href="css/rocket-cursor.css" />
  <link rel="stylesheet" href="css/site.css" />
  <link rel="stylesheet" href="css/orbit-home.css" />
  <link rel="stylesheet" href="css/navigation.css" />
  <link rel="stylesheet" href="css/site-header.css" />
  <link rel="stylesheet" href="css/cosmic-theme.css" />
  <link rel="stylesheet" href="css/mission-home.css" />
</head>
<body data-page="home" data-home-variant="orbit" class="mission-page" data-home-brand="ULP-CA">
  <script src="js/loading-screen.js"></script>
  <a class="flight-skip" href="#observatory">Skip to the planets</a>
  <header class="site-header flight-header" id="siteHeader"><div class="container header-inner"><a class="brand" href="index.html" aria-label="ULP-CA, homepage"><span class="brand-logo-wrap"><img src="assets/logo.png" alt="" class="brand-logo" width="52" height="52" /></span><span class="brand-text">ULP-CA</span></a><nav class="renata-nav" aria-label="Main navigation">${homeNavigation}</nav></div></header>
  <main class="mission-home" id="siteMain" data-static-content="true">
    <section class="mission-launch" id="launch" aria-labelledby="mission-title" data-preload="assets/story/sulflux-bottle.png?v=b8231ea2bea2 assets/story/spaceship.png assets/story/spaceship-inside.png assets/story/planet-1.png assets/story/planet-2.png assets/story/planet-3.png">
      <div id="observatory" class="mission-observatory-anchor" aria-hidden="true"></div>
      <div class="mission-launch-stage">
        <div class="mission-atmosphere" aria-hidden="true"><div class="mission-stars"></div><div class="mission-star-dust"></div><div class="mission-nebula"></div><svg class="mission-flight-lines" viewBox="0 0 1440 900" preserveAspectRatio="none"><ellipse cx="720" cy="460" rx="650" ry="280"/><ellipse cx="720" cy="460" rx="470" ry="350"/></svg></div>
        <div class="mission-intro"><p class="mission-eyebrow">iGEM 2026 / SulFlux</p><h1 class="mission-title" id="mission-title"><span>ULP</span><span>-CA</span></h1><a class="mission-button" href="#observatory">Explore the planets <span aria-hidden="true">↗</span></a></div>
        <div class="mission-bottle">${bottle}</div>
        <div class="mission-zoom-copy"><span class="mission-eyebrow">PCS</span>${paragraph('pcs')}</div>
        <div class="mission-vessel" aria-hidden="true"><div class="mission-exterior">${ship}</div><div class="mission-interior">${inside('cockpit-cut')}</div><span class="mission-window-glow"></span></div>
        <div class="mission-hub" role="group" aria-labelledby="mission-hub-title">
          <div class="mission-hub-heading"><p class="mission-eyebrow">SulFlux / Explore</p><h2 id="mission-hub-title" tabindex="-1">Explore.</h2><p>Select a planet to explore.</p></div>
          <nav class="mission-planets" aria-label="Explore the three planets">${planet(1,'gallbladder','Gallbladder','Bile flow')}${planet(2,'sulfation','SULT2A1','Sulfonation')}${planet(3,'bile-acids','LCA &amp; DCA','Bile acids')}</nav>
          <a class="mission-continue" href="#engineering-story">Continue to BtSULT &amp; SulFlux <span aria-hidden="true">↓</span></a>
        </div>
        <div class="mission-launch-caption" aria-hidden="true"><span data-launch-phase>01 / The bottle</span><span class="mission-launch-track"><i></i></span><span>Scroll to explore ↓</span></div>
      </div>
    </section>
    <section class="mission-scene mission-scene--gallbladder" id="gallbladder" aria-labelledby="gallbladder-title">
      <div class="mission-scene-copy">${back}<p class="mission-eyebrow">Planet 01</p><h2 id="gallbladder-title">The gallbladder</h2><div id="symptoms">${paragraph('pcs')}</div>${paragraph('gallbladder')}<a class="mission-next" href="#sulfation">Next: SULT2A1 <span aria-hidden="true">→</span></a></div>
      <figure class="mission-scene-art mission-liver-art"><span class="mission-art-ring" aria-hidden="true"></span>${liver}</figure>
    </section>
    <section class="mission-scene mission-scene--defense" id="sulfation" aria-labelledby="sulfation-title">
      <figure class="mission-scene-art mission-illustration-sheet"><img src="assets/story/sult2a1.png" width="2416" height="1370" alt="SULT2A1 with LCA and PAPS, and a sulfated LCA product" loading="lazy"/></figure>
      <div class="mission-scene-copy">${back}<p class="mission-eyebrow">Planet 02</p><h2 id="sulfation-title">SULT2A1</h2>${paragraph('sult2a1')}<a class="mission-next" href="#bile-acids">Next: LCA &amp; DCA <span aria-hidden="true">→</span></a></div>
    </section>
    <section class="mission-scene mission-scene--challenge" id="bile-acids" aria-labelledby="bile-acids-title">
      <div class="mission-scene-copy">${back}<p class="mission-eyebrow">Planet 03</p><h2 id="bile-acids-title">LCA &amp; DCA</h2>${paragraph('bileAcids')}<a class="mission-next" href="#engineering-story">Next: BtSULT <span aria-hidden="true">→</span></a></div>
      <figure class="mission-scene-art">${bileAcids}</figure>
    </section>
    <section class="mission-scene mission-scene--engineering" id="engineering-story" aria-labelledby="engineering-title">
      <figure class="mission-scene-art mission-illustration-sheet"><img src="assets/story/btsult.png" width="1660" height="1370" alt="BtSULT enzyme and the LCA molecule" loading="lazy"/></figure>
      <div class="mission-scene-copy">${back}<p class="mission-eyebrow">BtSULT / SulFlux</p><h2 id="engineering-title">BtSULT</h2>${paragraph('btsult')}<h3>SulFlux</h3>${paragraph('sulflux')}<a class="mission-next" href="#sulflux">Continue <span aria-hidden="true">→</span></a></div>
    </section>
    <section class="mission-scene mission-scene--proposal" id="sulflux" aria-labelledby="sulflux-title">
      <div class="mission-scene-copy">${back}<p class="mission-eyebrow">SulFlux</p><h2 id="sulflux-title"><em>Escherichia coli</em></h2>${paragraph('probiotic')}<a class="mission-button" href="project-description.html">Explore the project <span aria-hidden="true">↗</span></a></div>
      <figure class="mission-scene-art mission-person-art">${person}</figure>
    </section>
    <section class="mission-finale" id="mission"><p class="mission-eyebrow">ULP-CA / SulFlux</p><h2>Explore more.</h2><div class="mission-next-links"><a href="engineering.html#dbtl-cycle">Engineering ↗</a><a href="wet-lab.html">Wet lab ↗</a><a href="model.html">Model ↗</a><a href="team.html">Our team ↗</a></div>${back}</section>
  </main>
  <footer class="site-footer" id="siteFooter"></footer>
  <script src="js/site-content.js"></script>
  <script src="js/navigation.js"></script>
  <script src="js/site.js"></script>
  <script src="js/mission-home.js"></script>
  <script src="js/rocket-cursor.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(root,'index.html'),html);
require('./version-assets.js').refreshAll();
