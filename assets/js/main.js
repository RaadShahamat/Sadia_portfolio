/* =====================================================================
   Site behaviour. You normally do not need to edit this file —
   text lives in assets/js/data.js, photos live in the /images folders.
   ===================================================================== */
(function () {
  "use strict";

  var D = window.SITE || {};
  var P = D.profile || {};
  var PH = window.PHOTOS || {};      // made automatically by tools/build-photos.mjs

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function titleCase(s) { return String(s).replace(/[-_]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  var ARROW = '<span aria-hidden="true">→</span>';

  /* ---------- photos from folders ---------- */
  function photosIn(folder) { return (PH[folder] || []).slice(); }
  function subfolders(parent) {
    var depth = parent.split("/").length + 1;
    return Object.keys(PH).filter(function (k) { return k.indexOf(parent + "/") === 0 && k.split("/").length === depth; });
  }
  function isCover(p) { return /^(\d+[-_. ]+)?cover\./i.test(p.file || ""); }
  function projectPhotos(slug) {
    var all = photosIn("projects/" + slug);
    var cover = all.filter(isCover)[0] || all[0] || null;
    return { cover: cover, rest: all.filter(function (p) { return p !== cover; }) };
  }

  function photo(src, alt, opts) {
    opts = opts || {};
    var cls = "photo" + (opts.zoom ? " zoomable" : "") + (opts.cls ? " " + opts.cls : "");
    var attrs = opts.zoom ? ' tabindex="0" role="button" aria-label="Open photo' + (alt ? ": " + esc(alt) : "") + '"' : "";
    return '<div class="' + cls + '"' + attrs + (opts.attrs || "") + ">" +
      '<img data-photo src="' + esc(src) + '" alt="' + esc(alt || "") + '" loading="lazy" decoding="async">' +
      (opts.caption ? '<span class="cap">' + esc(opts.caption) + "</span>" : "") +
      "</div>";
  }

  /* all gallery photos: conferences first, then each images/gallery/<tab> folder */
  function galleryItems() {
    var items = [];
    subfolders("conferences").forEach(function (f) {
      photosIn(f).forEach(function (p) { items.push({ src: p.src, caption: p.caption, cat: "conferences" }); });
    });
    var tabs = Object.keys(D.galleryTabs || {});
    subfolders("gallery").sort(function (a, b) {
      var ia = tabs.indexOf(a.split("/")[1]), ib = tabs.indexOf(b.split("/")[1]);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || (a < b ? -1 : 1);
    }).forEach(function (f) {
      var cat = f.split("/")[1];
      photosIn(f).forEach(function (p) { items.push({ src: p.src, caption: p.caption, cat: cat }); });
    });
    return items;
  }
  function tabLabel(cat) { return (D.galleryTabs || {})[cat] || titleCase(cat); }

  function authorsHtml(list) {
    return (list || []).map(function (a) { return a === P.shortName ? "<b>" + esc(a) + "</b>" : esc(a); }).join(", ");
  }

  /* ---------- theme ---------- */
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) { /* private mode */ }
    $$(".theme-btn").forEach(function (b) {
      b.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
  }
  $$(".theme-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  });
  setTheme(document.documentElement.getAttribute("data-theme") || "light");

  /* ---------- mobile menu ---------- */
  var header = $(".site-header");
  var menuBtn = $(".menu-btn");
  function closeMenu() { header.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  if (header && menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".nav-links a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("open")) { closeMenu(); menuBtn.focus(); }
    });
  }

  /* ---------- profile links (hide empty ones) ---------- */
  $$("[data-link]").forEach(function (a) {
    var key = a.getAttribute("data-link");
    var url = key === "email" ? (P.email ? "mailto:" + P.email : "") :
              key === "cv" ? P.cvPdf : (P.links || {})[key];
    if (url) { a.setAttribute("href", url); } else {
      var li = a.closest("p, li");
      (li && li.children.length === 1 ? li : a).remove();
    }
  });

  /* ---------- no photos anywhere for the gallery? hide its links ---------- */
  var GALLERY = galleryItems();
  if (!GALLERY.length) {
    $$('a[href="gallery.html"], a[href^="gallery.html#"]').forEach(function (a) {
      if (a.closest(".nav-links")) a.closest("li").remove();
    });
  }

  /* ---------- renderers ---------- */
  var R = {};

  R.portrait = function (el) {
    var p = photosIn("profile")[0];
    el.innerHTML = p
      ? '<div class="photo"><img data-photo src="' + esc(p.src) + '" alt="Portrait of ' + esc(P.name) + '" fetchpriority="high"></div>'
      : '<div class="photo initials" aria-hidden="true"><span>' + esc((function (w) { return (w[0] || "").charAt(0) + (w.length > 1 ? w[w.length - 1].charAt(0) : ""); })((P.name || "").split(/\s+/))) + "</span></div>";
  };

  R.interests = function (el) {
    el.innerHTML = (D.interests || []).map(function (i) { return '<span class="tag">' + esc(i) + "</span>"; }).join("");
  };

  R.news = function (el) {
    var limit = +el.getAttribute("data-limit") || 999;
    var items = D.news || [];
    var html = items.map(function (n, i) {
      return '<div class="list-row' + (i >= limit ? " is-extra" : "") + '"><span class="when">' + esc(n.date) + "</span><span>" + n.text + "</span></div>";
    }).join("");
    html += '<div class="list-end">' + (items.length > limit
      ? '<button type="button" class="more" data-toggle-all aria-expanded="false"><span class="lbl">View all news</span> ' + ARROW + "</button>" : "") + "</div>";
    el.classList.add("collapsible");
    el.innerHTML = html;
    var btn = $("[data-toggle-all]", el);
    if (btn) {
      btn.addEventListener("click", function () {
        var on = el.classList.toggle("show-all");
        btn.setAttribute("aria-expanded", on ? "true" : "false");
        $(".lbl", btn).textContent = on ? "Show fewer updates" : "View all news";
      });
    }
  };

  R.research = function (el) {
    el.innerHTML = (D.research || []).map(function (r) {
      var pics = r.photoFolder ? photosIn(r.photoFolder) : [];
      var first = pics[0];
      var more = (r.details && r.details.length) || (r.tags && r.tags.length) || r.advisor;
      return '<article class="card research-card' + (first ? "" : " no-img") + '">' +
        (first ? photo(first.src, r.caption || first.caption || r.title, { zoom: true, caption: r.caption || first.caption }) : "") +
        '<div class="research-body">' +
          '<div class="meta"><span class="lead">' + esc(r.label) + "</span><span>" + esc(r.dates) + "</span><span>" + esc(r.place) + "</span></div>" +
          '<h3 class="ttl">' + esc(r.title) + "</h3>" +
          "<p>" + esc(r.summary) + "</p>" +
          (more ? '<details class="more-details"><summary class="more"><span class="when-closed">More details</span><span class="when-open">Show less</span> ' + ARROW + "</summary>" +
            '<div class="detail-body">' +
              (r.details || []).map(function (d) { return "<p>" + esc(d) + "</p>"; }).join("") +
              (pics.length > 1 ? '<div class="mini-grid">' + pics.slice(1).map(function (p) { return photo(p.src, p.caption || r.title, { zoom: true, caption: p.caption }); }).join("") + "</div>" : "") +
              (r.tags && r.tags.length ? '<div class="tags" style="margin:4px 0 14px">' + r.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" : "") +
              (r.advisor ? '<p class="fig-cap">' + esc(r.advisor) + "</p>" : "") +
            "</div></details>" : "") +
        "</div></article>";
    }).join("");
  };

  function bibtex(p) {
    var b = p.bib;
    if (!b) return "";
    var f = [["author", b.authors], ["title", "{" + p.title + "}"]];
    if (b.kind === "article") f.push(["journal", b.journal], ["volume", b.volume], ["number", b.number], ["pages", b.pages]);
    else f.push(["booktitle", b.booktitle], ["address", b.address], ["note", b.note]);
    f.push(["year", b.year]);
    if (p.doi) f.push(["doi", p.doi]);
    var lines = f.filter(function (x) { return x[1]; }).map(function (x) { return "  " + x[0] + " = {" + x[1] + "}"; });
    return "@" + b.kind + "{" + b.key + ",\n" + lines.join(",\n") + "\n}";
  }

  function pubRow(p) {
    var bib = bibtex(p);
    var badge = p.status === "Under review" ? "wait" : "ok";
    return '<article class="prow" data-type="' + esc(p.type) + '">' +
      '<div class="pid">[' + esc(p.id) + "]</div>" +
      '<div class="pbody"><h3 class="ttl">' + esc(p.title) + "</h3>" +
        '<div class="authors">' + authorsHtml(p.authors) + "</div>" +
        '<div class="venue">' + esc(p.venue) + "</div></div>" +
      '<div class="pside"><span class="badge ' + badge + '">' + esc(p.status) + "</span>" +
        '<div class="pactions">' +
          (p.doi ? '<a class="chip" href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">DOI ↗</a>' : "") +
          (bib ? '<button type="button" class="chip" data-bib aria-expanded="false">BibTeX</button>' : "") +
        "</div></div>" +
      (bib ? '<div class="bib-panel" hidden><pre>' + esc(bib) + '</pre><button type="button" class="chip" data-copy>Copy</button></div>' : "") +
      "</article>";
  }

  R.publications = function (el) {
    var limit = +el.getAttribute("data-limit") || 0;
    var list = D.publications || [];
    if (limit) {
      el.innerHTML = list.slice(0, limit).map(pubRow).join("");
      var link = $("[data-pub-count]");
      if (link) {
        if (list.length > limit) link.textContent = "View all " + list.length + " publications";
        else link.closest(".center-row").remove();
      }
      return;
    }
    var groups = [["journal", "Journal articles"], ["conference", "Conference papers"], ["review", "Manuscripts under review"]];
    el.innerHTML = groups.map(function (g) {
      var items = list.filter(function (p) { return p.type === g[0]; });
      if (!items.length) return "";
      return '<section class="pub-group" data-type="' + g[0] + '"><h2 class="pub-group-title">' + g[1] + "</h2>" + items.map(pubRow).join("") + "</section>";
    }).join("");
    /* hide filter buttons for empty groups */
    $$("[data-filter-group] button").forEach(function (b) {
      var t = b.getAttribute("data-filter");
      if (t !== "all" && !list.some(function (p) { return p.type === t; })) b.remove();
    });
  };

  /* publication filter buttons */
  $$("[data-filter-group]").forEach(function (bar) {
    var target = $(bar.getAttribute("data-filter-group"));
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var t = b.getAttribute("data-filter");
      $$("button", bar).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      $$(".pub-group", target).forEach(function (g) { g.hidden = !(t === "all" || g.getAttribute("data-type") === t); });
    });
  });

  /* BibTeX show / copy */
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-bib]");
    if (b) {
      var panel = $(".bib-panel", b.closest(".prow"));
      panel.hidden = !panel.hidden;
      b.setAttribute("aria-expanded", panel.hidden ? "false" : "true");
      return;
    }
    var c = e.target.closest && e.target.closest("[data-copy]");
    if (c) {
      var text = $("pre", c.parentNode).textContent;
      var done = function () { c.textContent = "Copied"; setTimeout(function () { c.textContent = "Copy"; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { c.textContent = "Select and copy"; });
      } else { c.textContent = "Select and copy"; }
    }
  });

  R.talks = function (el) {
    var SHOW = 3;
    el.innerHTML = (D.talks || []).map(function (t) {
      var pics = t.photoFolder ? photosIn(t.photoFolder) : [];
      var shown = pics.slice(0, SHOW);
      return '<article class="talk' + (pics.length ? "" : " no-img") + '">' +
        '<div class="talk-text"><div class="muted" style="font-size:14px;margin-bottom:10px">' + esc(t.date) + " · " + esc(t.place) + "</div>" +
          "<h3>" + esc(t.title) + "</h3><p>" + esc(t.event) + "</p>" +
          (t.note ? '<p class="muted" style="font-size:14.5px">' + esc(t.note) + "</p>" : "") +
          (pics.length > SHOW ? '<p style="margin-top:14px"><a class="more" href="gallery.html#conferences">View all ' + pics.length + " photos " + ARROW + "</a></p>" : "") +
        "</div>" +
        (shown.length ? '<div class="talk-photos n' + shown.length + '">' + shown.map(function (ph) {
          return photo(ph.src, ph.caption || t.title, { zoom: true, caption: ph.caption });
        }).join("") + "</div>" : "") +
        "</article>";
    }).join("");
  };

  R.teaching = function (el) {
    var t = D.teaching;
    if (!t) return;
    el.innerHTML = '<div class="teach"><div class="teach-intro"><h3>' + esc(t.role) + "</h3>" +
      '<p class="muted">' + esc(t.place) + " · " + esc(t.dates) + "</p><p>" + esc(t.duties) + "</p></div>" +
      '<div class="course-grid">' + (t.courses || []).map(function (c) {
        return '<div class="card course"><div class="code">' + esc(c.code) + '</div><div class="name ttl">' + esc(c.name) + "</div></div>";
      }).join("") +
      (t.mentoring ? '<div class="card course wide"><div class="code">Mentoring</div><div class="name ttl">' + esc(t.mentoring) + "</div></div>" : "") +
      "</div></div>";
  };

  function textCover(p) {
    var cat = String(p.meta || "").split("·")[0].trim();
    return '<div class="text-cover" aria-hidden="true"><span>' + esc(cat || p.title) + "</span></div>";
  }

  function projCard(p) {
    var pics = projectPhotos(p.slug);
    return '<a class="card proj" href="project.html?id=' + encodeURIComponent(p.slug) + '">' +
      (pics.cover ? photo(pics.cover.src, p.title) : textCover(p)) +
      '<div class="proj-body"><div class="kicker">' + esc(p.meta) + "</div>" +
      '<h3 class="ttl">' + esc(p.title) + "</h3><p>" + esc(p.summary) + "</p>" +
      '<span class="more">More details ' + ARROW + "</span></div></a>";
  }

  R.projects = function (el) {
    var limit = +el.getAttribute("data-limit") || 999;
    var list = D.projects || [];
    el.innerHTML = list.slice(0, limit).map(projCard).join("");
    var link = $("[data-proj-count]");
    if (link) {
      if (list.length > limit) link.textContent = "View all " + list.length + " projects";
      else link.closest(".center-row").remove();
    }
  };

  R.project = function (el) {
    var id = new URLSearchParams(location.search).get("id");
    var list = D.projects || [];
    var p = list.filter(function (x) { return x.slug === id; })[0];
    if (!p) {
      el.innerHTML = '<div class="wrap sec"><h1 class="page-title">Project not found</h1><p class="muted">This project does not exist. <a class="more" href="projects.html">See all projects ' + ARROW + "</a></p></div>";
      return;
    }
    document.title = p.title + " · " + (P.name || "");
    var pics = projectPhotos(p.slug);
    var next = list[(list.indexOf(p) + 1) % list.length];
    el.innerHTML =
      '<header class="page-head"><div class="wrap">' +
        '<div class="crumb"><a href="projects.html">Projects</a> / ' + esc(p.meta) + "</div>" +
        '<h1 class="page-title">' + esc(p.title) + "</h1><p>" + esc(p.summary) + "</p>" +
      "</div></header>" +
      '<div class="wrap sec" style="padding-top:48px">' +
        (pics.cover ? photo(pics.cover.src, pics.cover.caption || p.title, { zoom: true, cls: "detail-cover", caption: pics.cover.caption }) : "") +
        '<div class="detail"><div class="detail-main">' +
          (p.description || []).map(function (d) { return "<p>" + esc(d) + "</p>"; }).join("") +
          (pics.rest.length ? '<h2 class="sub-title" style="margin-top:32px">Photos (' + pics.rest.length + ')</h2><div class="gallery-full" style="grid-auto-rows:200px">' +
            pics.rest.map(function (ph) { return photo(ph.src, ph.caption || p.title, { zoom: true, caption: ph.caption }); }).join("") + "</div>" : "") +
        "</div>" +
        '<aside class="detail-side">' +
          (p.tools && p.tools.length ? '<div class="box"><h2 class="sub-title">Tools and topics</h2><div class="tags">' + p.tools.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div></div>" : "") +
          (p.links && p.links.length ? '<div class="box"><h2 class="sub-title">Links</h2><ul class="link-list">' + p.links.map(function (l) {
            return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " ↗</a></li>";
          }).join("") + "</ul></div>" : "") +
          (next && next !== p ? '<div class="box"><h2 class="sub-title">Next project</h2><a class="more" href="project.html?id=' + encodeURIComponent(next.slug) + '">' + esc(next.title) + " " + ARROW + "</a></div>" : "") +
        "</aside></div></div>";
  };

  /* home strip: up to N non-conference photos, taking turns between folders */
  function mixed(items, n) {
    var byCat = {}, order = [];
    items.forEach(function (it) {
      if (!byCat[it.cat]) { byCat[it.cat] = []; order.push(it.cat); }
      byCat[it.cat].push(it);
    });
    var out = [], i = 0;
    while (out.length < n && order.some(function (c) { return byCat[c].length; })) {
      var c = order[i++ % order.length];
      if (byCat[c].length) out.push(byCat[c].shift());
    }
    return out;
  }

  R.gallery = function (el) {
    var limit = +el.getAttribute("data-limit") || 0;
    var items = GALLERY;
    if (limit) {
      items = mixed(items.filter(function (g) { return g.cat !== "conferences"; }), limit);
      var section = el.closest("section");
      if (!items.length) { if (section) section.remove(); return; }
      el.classList.add("n" + Math.min(items.length, 5));
      var more = $("[data-gallery-count]");
      if (more) more.textContent = GALLERY.length > items.length ? "View all " + GALLERY.length + " photos" : "Open gallery";
    }
    if (!items.length) {
      el.innerHTML = '<p class="muted" style="grid-column:1/-1">Photos coming soon.</p>';
      return;
    }
    el.innerHTML = items.map(function (g) {
      return photo(g.src, g.caption || tabLabel(g.cat), { zoom: true, caption: g.caption, attrs: ' data-cat="' + esc(g.cat) + '"' });
    }).join("");

    /* full gallery page: build tabs from the folders that have photos */
    var bar = document.getElementById("gallery-tabs");
    if (!limit && bar) {
      var cats = [];
      items.forEach(function (g) { if (cats.indexOf(g.cat) < 0) cats.push(g.cat); });
      if (cats.length < 2) { bar.remove(); return; }
      bar.innerHTML = '<button type="button" data-filter="all" aria-pressed="true">All <span class="n">' + items.length + "</span></button>" +
        cats.map(function (c) {
          var n = items.filter(function (g) { return g.cat === c; }).length;
          return '<button type="button" data-filter="' + esc(c) + '" aria-pressed="false">' + esc(tabLabel(c)) + ' <span class="n">' + n + "</span></button>";
        }).join("");
      var apply = function (cat) {
        $$("button", bar).forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-filter") === cat ? "true" : "false"); });
        $$(".photo", el).forEach(function (ph) { ph.hidden = !(cat === "all" || ph.getAttribute("data-cat") === cat); });
      };
      bar.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        var cat = b.getAttribute("data-filter");
        apply(cat);
        if (history.replaceState) history.replaceState(null, "", cat === "all" ? location.pathname : "#" + cat);
      });
      var start = decodeURIComponent((location.hash || "").slice(1));
      if (start && cats.indexOf(start) >= 0) apply(start);
    }
  };

  R.education = function (el) {
    el.innerHTML = (D.education || []).map(function (e) {
      return '<div class="edu"><div class="deg">' + esc(e.degree) + '</div><div class="sch">' + esc(e.school) + " · " + esc(e.place) + "</div>" +
        '<div class="sch">' + esc(e.dates) + (e.note ? " · " + esc(e.note) : "") + "</div></div>";
    }).join("");
  };
  R.skills = function (el) {
    el.innerHTML = (D.skills || []).map(function (s) {
      return '<div class="skill"><span class="area">' + esc(s.area) + "</span><span>" + esc(s.items) + "</span></div>";
    }).join("");
  };
  function listR(key) {
    return function (el) { el.innerHTML = (D[key] || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); };
  }
  R.coursework = listR("coursework");
  R.honors = listR("honors");
  R.activities = listR("activities");
  R.references = function (el) {
    el.innerHTML = (D.references || []).map(function (r) {
      return '<div class="edu"><div class="deg">' + esc(r.name) + '</div><div class="sch">' + esc(r.title) + ", " + esc(r.dept) + "</div></div>";
    }).join("") + '<p class="muted" style="font-size:14.5px;margin-top:12px">Contact details available on request.</p>';
  };

  $$("[data-render]").forEach(function (el) {
    var fn = R[el.getAttribute("data-render")];
    if (fn) {
      try { fn(el); } catch (err) { console.error("Could not render " + el.getAttribute("data-render"), err); }
    }
  });

  /* ---------- lightbox ---------- */
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Photo viewer");
  lb.innerHTML =
    '<button type="button" class="lb-btn lb-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="Previous photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
    '<button type="button" class="lb-btn lb-next" aria-label="Next photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg></button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(lb);
  var lbImg = $("img", lb), lbCap = $("figcaption", lb);
  var group = [], pos = 0, lastFocus = null;

  function show(i) {
    pos = (i + group.length) % group.length;
    var img = $("img", group[pos]);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    var cap = $(".cap", group[pos]);
    lbCap.textContent = cap ? cap.textContent : "";
    var many = group.length > 1;
    $(".lb-prev", lb).style.display = many ? "" : "none";
    $(".lb-next", lb).style.display = many ? "" : "none";
  }
  function openLb(el) {
    var box = el.closest(".gallery, .gallery-full, .talk-photos, .mini-grid") || el.closest(".wrap") || el.parentNode;
    group = $$(".zoomable", box).filter(function (z) { return !z.hidden && $("img", z); });
    if (group.indexOf(el) < 0) group = [el];
    lastFocus = document.activeElement;
    show(group.indexOf(el));
    lb.classList.add("open");
    document.body.classList.add("no-scroll");
    $(".lb-close", lb).focus();
  }
  function closeLb() {
    lb.classList.remove("open");
    document.body.classList.remove("no-scroll");
    lbImg.removeAttribute("src");
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("click", function (e) {
    var z = e.target.closest && e.target.closest(".zoomable");
    if (z && $("img", z)) { e.preventDefault(); openLb(z); }
  });
  document.addEventListener("keydown", function (e) {
    if (lb.classList.contains("open")) {
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") show(pos - 1);
      else if (e.key === "ArrowRight") show(pos + 1);
      else if (e.key === "Tab") {
        var f = $$(".lb-btn", lb).filter(function (b) { return b.style.display !== "none"; });
        var i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
      return;
    }
    var z = document.activeElement;
    if ((e.key === "Enter" || e.key === " ") && z && z.classList && z.classList.contains("zoomable") && $("img", z)) {
      e.preventDefault(); openLb(z);
    }
  });
  $(".lb-close", lb).addEventListener("click", closeLb);
  $(".lb-prev", lb).addEventListener("click", function () { show(pos - 1); });
  $(".lb-next", lb).addEventListener("click", function () { show(pos + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });

  var sx = null;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50 && group.length > 1) show(pos + (dx < 0 ? 1 : -1));
    sx = null;
  });

  $$("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
