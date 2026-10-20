(function (root) {
  "use strict";
  function chooseActive(entries, readingLine) {
    let active = entries.find(entry => entry.visible)?.id || null;
    for (const entry of entries) if (entry.visible && entry.top <= readingLine) active = entry.id;
    return active;
  }
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function headingTree(headings) {
    const tree = [], stack = [{level:0, children:tree}];
    headings.forEach(heading => {
      while (stack.length > 1 && stack.at(-1).level >= heading.level) stack.pop();
      const item = {...heading, children:[]};
      stack.at(-1).children.push(item); stack.push(item);
    });
    return tree;
  }
  function treeMarkup(tree) {
    return tree.map(item => {
      const link = `<a href="#${escape(item.id)}">${escape(item.label)}</a>`;
      return item.children.length
        ? `<li class="project-outline-branch" data-outline-branch="${escape(item.id)}"><div class="project-outline-row">${link}<button type="button" data-outline-toggle aria-expanded="true" aria-controls="outline-${escape(item.id)}" aria-label="Toggle ${escape(item.label)} subsections"><span aria-hidden="true">⌄</span></button></div><ul id="outline-${escape(item.id)}" class="project-outline-children">${treeMarkup(item.children)}</ul></li>`
        : `<li>${link}</li>`;
    }).join('');
  }
  function prepare(doc) {
    if (!['human-practices','wet-lab','model'].includes(doc.body?.dataset.page)) return;
    const article = doc.querySelector('.project-paper,.lab-article');
    const sidebar = doc.querySelector('.project-paper-sidebar,.lab-sidebar');
    const nav = sidebar?.querySelector('nav');
    if (!article || !nav || nav.dataset.projectOutline !== undefined) return;
    let tree;
    if (nav.hasAttribute('data-outline-auto')) {
      const headings = [...article.querySelectorAll('h2,h3,h4,summary')].map((heading, index) => {
        const section = heading.closest('section');
        const first = section?.querySelector('h2,h3,h4');
        let depth = 1, parent = section?.parentElement?.closest('section');
        while (parent && article.contains(parent)) { depth++; parent = parent.parentElement?.closest('section'); }
        const rank = heading.tagName === 'SUMMARY' ? 3 : Number(heading.tagName.slice(1));
        if (first && first !== heading) depth += Math.max(1, rank - Number(first.tagName.slice(1)));
        let target = first === heading && section.id ? section : heading;
        if (!target.id) {
          const slug = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || `section-${index}`;
          let id = `reading-${slug}`, suffix = 2;
          while (doc.getElementById(id)) id = `reading-${slug}-${suffix++}`;
          target.id = id;
        }
        return {id:target.id, label:heading.textContent.trim(), level:depth};
      });
      tree = headingTree(headings);
    } else {
      function readList(list) {
        return [...list.children].map(li => {
          const link = li.querySelector('a'), child = [...li.children].find(node => node.tagName === 'UL');
          return {id:link.getAttribute('href').slice(1), label:link.textContent, children:child ? readList(child) : []};
        });
      }
      tree = readList(nav.querySelector('ul'));
    }
    nav.classList.add('page-outline');
    nav.dataset.projectOutline = '';
    nav.setAttribute('aria-labelledby','project-outline-title');
    nav.innerHTML = `<div class="project-outline-heading"><p class="page-outline-title" id="project-outline-title">On this page</p><button type="button" data-outline-collapse aria-expanded="true" aria-controls="project-outline-list" aria-label="Toggle page contents"><span aria-hidden="true">⌄</span></button></div><ul id="project-outline-list">${treeMarkup(tree)}</ul>`;
    sidebar.classList.remove('reveal','delay-1');
    article.parentElement.insertBefore(sidebar, article);
    doc.body.classList.add('reading-outline-page');
  }
  function init(win, doc) {
    prepare(doc);
    const nav = doc.querySelector('[data-project-outline]');
    if (!nav || nav.dataset.outlineReady) return;
    nav.dataset.outlineReady = 'true'; nav.classList.add('is-enhanced');
    const article = doc.querySelector('.project-paper,.lab-article');
    const header = doc.getElementById('siteHeader');
    const mobile = win.matchMedia('(max-width: 900px)');
    const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
    const rootList = doc.getElementById('project-outline-list');
    const collapse = nav.querySelector('[data-outline-collapse]');
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const entries = links.map(link => ({ link, target: doc.getElementById(link.getAttribute('href').slice(1)) })).filter(entry => entry.target);
    const groups = [...nav.querySelectorAll('[data-outline-branch]')].map(node => ({
      node, id: node.dataset.outlineBranch, button: node.querySelector('[data-outline-toggle]'), list: node.querySelector('.project-outline-children')
    }));
    let active = null, frame = 0;
    function setGroup(group, open) {
      group.list.hidden = !open;
      group.button.setAttribute('aria-expanded', String(open));
    }
    function setContents(open) {
      if (!open && rootList.contains(doc.activeElement)) collapse.focus();
      rootList.hidden = !open;
      collapse.setAttribute('aria-expanded', String(open));
    }
    function update() {
      frame = 0;
      const readingLine = (header?.getBoundingClientRect().height || 80) + (mobile.matches ? 105 : 45);
      const next = chooseActive(entries.map(entry => ({ id:entry.target.id, top:entry.target.getBoundingClientRect().top, visible:entry.target.getClientRects().length > 0 })), readingLine);
      if (!next || next === active) return;
      active = next;
      const current = entries.find(entry => entry.target.id === active);
      entries.forEach(entry => {
        if (entry === current) entry.link.setAttribute('aria-current', 'location');
        else entry.link.removeAttribute('aria-current');
      });
      groups.forEach(group => {
        const ancestor = group.node.contains(current.link);
        group.node.classList.toggle('is-active-ancestor', ancestor);
        // Preserve a branch containing keyboard focus until focus leaves it.
        if (ancestor || !group.list.contains(doc.activeElement)) setGroup(group, ancestor);
      });
      if (!rootList.hidden && !nav.contains(doc.activeElement)) {
        const item = current.link.getBoundingClientRect(), box = nav.getBoundingClientRect();
        if (item.top < box.top + 55) nav.scrollTop -= box.top + 55 - item.top;
        else if (item.bottom > box.bottom - 14) nav.scrollTop += item.bottom - box.bottom + 14;
      }
    }
    function schedule() { if (!frame) frame = win.requestAnimationFrame(update); }
    groups.forEach(group => {
      group.button.hidden = false;
      group.button.addEventListener('click', () => setGroup(group, group.list.hidden));
    });
    collapse.hidden = false;
    collapse.addEventListener('click', () => setContents(rootList.hidden));
    entries.forEach(({link,target}) => link.addEventListener('click', event => {
      event.preventDefault();
      let disclosure = target.closest('details');
      while (disclosure) { disclosure.open = true; disclosure = disclosure.parentElement?.closest('details'); }
      if (mobile.matches) setContents(false);
      win.history.pushState(null, '', link.getAttribute('href'));
      target.scrollIntoView({block:'start', behavior:reduced.matches ? 'instant' : 'smooth'});
      schedule();
    }));
    win.addEventListener('scroll', schedule, {passive:true});
    win.addEventListener('resize', schedule);
    win.addEventListener('hashchange', schedule);
    win.addEventListener('load', schedule);
    article.addEventListener('toggle', schedule, true);
    if (win.ResizeObserver) new win.ResizeObserver(schedule).observe(article);
    mobile.addEventListener('change', () => {setContents(!mobile.matches); active = null; schedule();});
    setContents(!mobile.matches); update();
    return {update, setContents};
  }
  const api = {chooseActive, headingTree, treeMarkup, prepare, init};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else init(root, root.document);
})(typeof window === 'undefined' ? globalThis : window);
