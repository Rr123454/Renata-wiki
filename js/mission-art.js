/* Inline vector compositions retain the team's original PNG artwork. */
(function (root) {
  "use strict";
  // A paper-sticker silhouette around the supplied rocket, also used as its blueprint.
  const hull = "M165 72Q170 61 184 70L305 140Q399 55 521 78Q627 95 660 289L729 253Q744 249 755 263L846 378Q858 397 843 409L817 427Q874 490 896 565Q916 626 892 651Q858 688 776 666L665 645Q549 644 440 620L333 624Q249 626 157 599Q141 594 144 575L147 538Q173 510 205 493L178 381L76 387Q44 382 48 352L51 337Q63 326 83 321L147 303Q151 246 188 191L163 95Q158 79 165 72Z";
  function rocket(id = "mission-rocket") {
    return `<svg viewBox="0 0 1000 750" width="1000" height="750" class="mission-rocket-art" aria-hidden="true" focusable="false"><defs><clipPath id="${id}-cut"><path d="${hull}"/></clipPath></defs>
      <g class="mission-blueprint" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
        <path d="${hull}" pathLength="1" class="mission-blueprint-hull"/>
        <path d="M304 142Q434 50 554 126Q628 191 660 289Q653 391 458 390Q337 384 306 305Q271 229 304 142ZM660 289Q737 330 817 427M205 493 445 415 620 492 333 624M188 191Q212 270 288 307M665 645Q615 505 727 441Q796 405 817 427"/>
        <ellipse cx="300" cy="427" rx="28" ry="44" transform="rotate(-20 300 427)"/><ellipse cx="472" cy="499" rx="24" ry="44" transform="rotate(-20 472 499)"/>
        <path d="M114 165H231M190 160V106M803 191H930M868 195V285M740 713H924" stroke-width="2" stroke-dasharray="7 7"/>
        <g fill="currentColor" stroke="none" font-family="monospace" font-size="20"><text x="94" y="146">01 / HULL</text><text x="795" y="175">02 / FLIGHT</text><text x="750" y="706">SULFLUX</text></g>
      </g>
      <g class="mission-rocket-details" clip-path="url(#${id}-cut)"><image href="assets/story/rocket-right.png" width="1000" height="750"/></g>
    </svg>`;
  }
  function bottle() {
    return `<svg viewBox="700 470 490 750" class="mission-bottle-art" role="img" aria-label="The team’s SulFlux bottle illustration, with a spacecraft blueprint on its label"><defs><clipPath id="mission-bottle-cut"><path d="M780 520Q780 480 943 478Q1109 478 1111 520L1111 599Q1115 642 1173 705L1173 813Q1137 842 1141 881L1176 920 1176 1102Q1117 1209 949 1212Q801 1206 735 1112L731 928Q733 902 758 868Q767 843 724 809L719 707Q777 650 779 597Z"/></clipPath></defs><image href="assets/story/sulflux-bottle.png" width="1936" height="1452" clip-path="url(#mission-bottle-cut)"/><rect x="961" y="1022" width="186" height="138" rx="34" fill="#ffe9d6"/><g class="mission-bottle-emblem" transform="translate(974 1030) scale(.17)">${rocket("bottle-emblem")}</g></svg>`;
  }
  function anatomy() {
    return `<svg viewBox="0 0 700 650" role="img" aria-label="Schematic liver above the gallbladder, with bile ducts leading toward the intestine">
      <path d="M245 55Q350 12 455 55L476 116 584 171Q627 230 606 328L570 566Q463 626 350 622Q230 625 129 566L94 327Q76 226 120 171L224 116Z" fill="#fce2b9" stroke="#653355" stroke-width="6"/>
      <path d="M176 203Q284 151 370 185Q443 147 516 194Q560 236 523 273Q474 306 370 274Q283 330 168 294Q117 271 176 203Z" fill="#b45767" stroke="#653355" stroke-width="6"/>
      <path d="M370 188Q388 225 370 274" fill="none" stroke="#653355" stroke-width="5"/>
      <path d="M354 261V327Q356 365 414 383V430" fill="none" stroke="#5d855f" stroke-width="14" stroke-linecap="round"/>
      <path class="mission-gallbladder" d="M300 291Q300 322 278 347Q254 378 283 400Q323 420 335 379L334 323Q334 301 354 287" fill="#91b967" stroke="#456e51" stroke-width="5"/>
      <path d="M242 448Q194 429 192 468Q190 504 237 504H462Q506 506 500 544Q497 572 458 571H246Q210 572 212 542Q215 518 249 521H452" fill="none" stroke="#d27981" stroke-width="28" stroke-linecap="round"/>
      <path class="mission-bile-flow" d="M355 278V328Q357 362 414 385V432" fill="none" stroke="#f5d15d" stroke-width="6" stroke-linecap="round" stroke-dasharray="9 18"/>
      <g fill="none" stroke="#653355" stroke-width="2"><path d="M522 215H642"/><path d="M278 360H66"/><path d="M430 412H638"/></g>
      <g fill="#653355" font-family="Trebuchet MS,Arial" font-size="18" font-weight="700"><text x="555" y="202">Liver</text><text x="25" y="345">Gallbladder</text><text x="535" y="400">Bile flow</text></g>
    </svg>`;
  }
  function patient() {
    return `<svg viewBox="0 0 650 600" role="img" aria-label="Illustration of a person holding their abdomen to represent discomfort"><circle cx="332" cy="118" r="72" fill="#e7a77e" stroke="#653355" stroke-width="6"/><path d="M259 115Q245 26 340 35Q420 35 409 120L386 91Q331 111 291 82Z" fill="#2b3565"/><path d="M268 205Q324 179 387 209L436 416 406 533H246L215 416Z" fill="#94ccdf" stroke="#653355" stroke-width="6"/><path d="M276 208Q225 233 205 326Q196 365 270 382L335 363M381 212Q423 238 444 327Q450 361 377 383L318 363" fill="#e7a77e" stroke="#653355" stroke-width="26" stroke-linecap="round"/><path d="M302 131l15 3m40-3-15 3M320 163Q331 155 344 163" fill="none" stroke="#653355" stroke-width="5" stroke-linecap="round"/><path d="m331 294-13 27 24 8-14 24" fill="none" stroke="#d25458" stroke-width="8" stroke-linecap="round"/><path d="m166 273-24-13m19 42-29 2m350-21 26-14m-22 43 28 3" fill="none" stroke="#df885c" stroke-width="6" stroke-linecap="round"/><path d="M252 532L239 578M398 532 414 578" stroke="#2b3565" stroke-width="45" stroke-linecap="round"/></svg>`;
  }
  function bileAcids() {
    const creature = (x, y, label, flip) => `<g class="mission-acid mission-acid--${label.toLowerCase()}" transform="translate(${x} ${y}) rotate(${flip})"><path d="m0 35 34-30 42 8 30-21 40 27 42-7 36 38-18 51-46 16-35-14-38 18-35-28-34 5Z" fill="#f8d26b" stroke="#8f543b" stroke-width="5"/><circle cx="74" cy="47" r="7" fill="#4e3156"/><circle cx="132" cy="47" r="7" fill="#4e3156"/><path class="mission-acid-mouth" d="M75 72Q104 106 135 72Z" fill="#713657" stroke="#713657" stroke-width="4"/><path d="m83 76 8 12 8-9 8 13 8-12 10 8 6-12" fill="white"/><text x="103" y="133" text-anchor="middle" fill="#713657" font-family="Trebuchet MS" font-weight="800" font-size="22">${label}</text></g>`;
    return `<svg viewBox="0 0 700 540" role="img" aria-label="Cartoon LCA and DCA characters above an intestinal lining; a metaphor for the effects of excessive bile-acid exposure"><path d="M30 431Q97 384 156 422T292 425T434 423T573 423T678 415V528H30Z" fill="#d98391" stroke="#713657" stroke-width="6"/><path d="M32 469Q97 426 160 464T295 467T436 465T575 466T676 459" fill="none" stroke="#f7b5a9" stroke-width="16"/>${creature(115, 207, "LCA", -12)}${creature(365, 214, "DCA", 13)}<g fill="#f7c674"><circle cx="82" cy="191" r="13"/><circle cx="352" cy="119" r="10"/><circle cx="607" cy="191" r="17"/></g><text x="350" y="505" text-anchor="middle" fill="#713657" font-family="Trebuchet MS" font-size="17" font-weight="700">Intestinal lining · schematic</text></svg>`;
  }
  function engineered() {
    return `<svg viewBox="0 0 700 610" role="img" aria-label="Concept illustration of an engineered SulFlux pocket accommodating LCA; a design goal, not a demonstrated result"><path d="M123 204Q62 147 130 100Q176 57 244 92Q295 33 354 85Q436 36 478 113Q560 92 580 167Q654 198 608 272Q656 343 594 393Q600 484 518 496Q458 567 387 527Q313 589 248 527Q157 559 133 477Q53 453 86 376Q28 293 123 204Z" fill="#9ed9d5" stroke="#437b97" stroke-width="10"/><path d="M181 278Q209 194 290 230Q347 180 410 235Q490 204 525 282Q563 379 478 415Q387 479 303 427Q193 462 166 365Z" fill="#3c7da7"/>
      <g class="mission-fit-molecule"><path d="m237 302 38-24 37 19 34-26 39 18 35-26 42 25 10 43-37 25-41-19-35 26-40-17-36 20-38-23Z" fill="#ffdd79" stroke="#a47743" stroke-width="5"/><circle cx="330" cy="316" r="6" fill="#534065"/><circle cx="366" cy="316" r="6" fill="#534065"/><path d="M336 335Q350 350 364 335" fill="none" stroke="#534065" stroke-width="5" stroke-linecap="round"/></g>
      <path d="m456 198 12 23 26 4-19 19 5 26-24-12-23 12 4-26-18-19 25-4Z" fill="#fff1bc"/>
      <g fill="#263b76" font-family="Trebuchet MS,Arial" text-anchor="middle"><text x="350" y="150" font-size="36" font-weight="800">SulFlux</text><text x="350" y="185" font-size="18">Proposed engineered pocket</text><text x="350" y="490" font-size="17">LCA + PAPS → sulfated LCA</text></g></svg>`;
  }
  function proposal() {
    return `<svg viewBox="0 0 700 530" role="img" aria-label="Research concept: a plasmid encodes the proposed enzyme in a bacterial chassis"><g fill="none" stroke="#fff1bc" stroke-width="6"><circle cx="148" cy="249" r="83"/><path d="M148 166A83 83 0 0 1 231 249" stroke="#ef9a7d" stroke-width="15"/><path d="M270 249H359m-20-17 20 17-20 17" stroke-linecap="round"/></g><g class="mission-bacterium" transform="rotate(-15 501 249)"><rect x="398" y="170" width="220" height="140" rx="70" fill="#a8dfd5" stroke="#132d64" stroke-width="7"/><path d="M420 250q25-70 53 0t54 0 53 0" fill="none" stroke="#497eae" stroke-width="6"/><circle cx="563" cy="207" r="6" fill="#132d64"/><circle cx="585" cy="207" r="6" fill="#132d64"/><path d="M569 226q8 9 17-1" fill="none" stroke="#132d64" stroke-width="4"/></g><g font-family="Trebuchet MS,Arial" fill="#fff1bc" text-anchor="middle"><text x="148" y="379" font-size="23" font-weight="800">The blueprint</text><text x="148" y="412" font-size="17">A plasmid encoding SulFlux</text><text x="501" y="379" font-size="23" font-weight="800">The proposed chassis</text><text x="501" y="412" font-size="17">Engineered E. coli</text></g></svg>`;
  }
  const api = { rocket, bottle, anatomy, patient, bileAcids, engineered, proposal };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.MissionArt = api;
})(typeof window === "undefined" ? globalThis : window);
