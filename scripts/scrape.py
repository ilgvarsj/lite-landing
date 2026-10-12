#!/usr/bin/env python3
"""One-shot importer: pulls LV product pages from the old lite.lv WordPress REST API
and writes Markdown + images into an output tree shaped like src/content/.

Usage:  python3 -I scripts/scrape.py <out_dir>
Then review <out_dir> and copy into src/content/. Not part of the build.
"""
import html
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from html.parser import HTMLParser

BASE = "https://lite.lv"
UA = {"User-Agent": "Mozilla/5.0 (lite.lv migration)"}
MAX_GALLERY = 12

# Extra non-product pages to import (path -> output folder under pages/)
EXTRA = {
    "/home-lat/par-mums/": "par-mums",
    "/tehniska-informacija/": "tehniska-informacija",
    "/dileri-latvija/": "dileri-latvija",
}


# Paths that exist in the new site; other internal links stay absolute to lite.lv
LOCAL_PREFIXES = ("/produkti/", "/kontakti/", "/home-lat/par-mums/", "/tehniska-informacija/",
                  "/dileri-latvija/")


def get(url, binary=False):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    return data if binary else data.decode("utf-8")


def all_pages():
    out, page = [], 1
    while True:
        try:
            batch = json.loads(get(f"{BASE}/wp-json/wp/v2/pages?per_page=100&page={page}"))
        except urllib.error.HTTPError:
            break
        if not batch:
            break
        out += batch
        page += 1
    return out


def media_urls(ids):
    ids = [i for i in ids if i]
    res = {}
    for i in range(0, len(ids), 50):
        chunk = ",".join(map(str, ids[i:i + 50]))
        for m in json.loads(get(f"{BASE}/wp-json/wp/v2/media?per_page=50&include={chunk}")):
            sizes = m.get("media_details", {}).get("sizes", {})
            best = pick_size(sizes) or m["source_url"]
            res[m["id"]] = (best, m.get("alt_text") or "")
    return res


def pick_size(sizes):
    """Largest rendition whose width is <= 1600px."""
    cands = [(int(s["width"]), s["source_url"]) for s in sizes.values() if int(s.get("width") or 0) <= 1600]
    return max(cands)[1] if cands else None


SIZE_RE = re.compile(r"-\d{2,4}x\d{2,4}(?=\.\w+$)")


def best_from_img(attrs):
    srcset = attrs.get("srcset", "")
    cands = []
    for part in srcset.split(","):
        bits = part.strip().split()
        if len(bits) == 2 and bits[1].endswith("w"):
            w = int(bits[1][:-1])
            if w <= 1600:
                cands.append((w, bits[0]))
    if cands:
        return max(cands)[1]
    return attrs.get("src", "")


class Extract(HTMLParser):
    """Turns Enfold/Elementor markup into simple Markdown and collects images."""

    BLOCK = {"p", "div", "section", "br", "li", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.images = []
        self.skip = 0
        self.href = None
        self.link_text = []
        self.heading = None
        self.list_depth = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("style", "script", "iframe", "noscript"):
            self.skip += 1
            return
        if self.skip:
            return
        if tag == "img":
            src = best_from_img(a)
            if "/wp-content/uploads/" in src:
                self.images.append((src, a.get("alt", "")))
            return
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.out.append("\n\n" + "#" * max(2, int(tag[1])) + " ")
            self.heading = tag
        elif tag == "li":
            self.out.append("\n- ")
            self.list_depth += 1
        elif tag in ("p", "div", "section", "ul", "ol"):
            self.out.append(" " if self.list_depth and tag in ("p", "div") else "\n\n")
        elif tag == "br":
            self.out.append("  \n")
        elif tag in ("strong", "b"):
            self.out.append("\x01")  # bold start marker
        elif tag == "a":
            self.href = a.get("href")
            self.out.append("\x00")  # link start marker

    def handle_endtag(self, tag):
        if tag in ("style", "script", "iframe", "noscript"):
            self.skip = max(0, self.skip - 1)
            return
        if self.skip:
            return
        if tag == "li":
            self.list_depth = max(0, self.list_depth - 1)
        elif tag in ("strong", "b") and "\x01" in self.out:
            idx = len(self.out) - 1 - self.out[::-1].index("\x01")
            text = "".join(self.out[idx + 1:])
            del self.out[idx:]
            inner = text.strip()
            if not inner or "\n" in inner or inner.startswith(("[", "#")):
                self.out.append(text)  # bold spanning blocks/links: drop emphasis
            else:
                lead = text[: len(text) - len(text.lstrip())]
                trail = text[len(text.rstrip()):]
                self.out.append(f"{lead}**{inner}**{trail}")
        elif tag == "a" and self.href is not None:
            # collapse everything since the marker into [text](href)
            idx = len(self.out) - 1 - self.out[::-1].index("\x00")
            text = "".join(self.out[idx + 1:]).strip()
            del self.out[idx:]
            href = self.href
            self.href = None
            if text and href and not href.startswith("#"):
                if href.startswith(BASE):
                    href = href[len(BASE):] or "/"
                if href.startswith("/") and not href.startswith(LOCAL_PREFIXES):
                    href = BASE + href  # page not migrated yet: keep pointing at the old site
                self.out.append(f"[{text}]({href})")
            else:
                self.out.append(text)
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.out.append("\n\n")
            self.heading = None

    def handle_data(self, data):
        if self.skip:
            return
        self.out.append(re.sub(r"\s+", " ", data))

    def markdown(self):
        md = "".join(self.out).replace("\x00", "").replace("\x01", "")
        md = md.replace(" ", " ")
        md = re.sub(r"[ \t]+\n", "\n", md)
        md = re.sub(r"\n[ \t]+", "\n", md)
        md = re.sub(r"^(#+)\s*\n+", "", md, flags=re.M)  # empty headings
        md = re.sub(r"^\s*[»›]\s*", "", md, flags=re.M)
        md = re.sub(r"^- \s*$", "", md, flags=re.M)
        md = re.sub(r"\n{3,}", "\n\n", md)
        return md.strip()


def clean_title(t):
    t = html.unescape(re.sub(r"<[^>]+>", "", t)).strip()
    return t[:1].upper() + t[1:].lower() if t.isupper() else t


def norm_heading(line):
    s = line.strip("# *").strip()
    if s.isupper() and len(s) > 3:
        s = s[:1] + s[1:].lower()
    return s


def tidy(md, title):
    out = []
    for ln in md.split("\n"):
        s = ln.strip()
        bare = s.strip("*#").strip()
        if CUT_RE.search(bare):
            break  # shared contact/portfolio boilerplate: rendered by the template instead
        if (s in ("-", "Previous", "Next", "PreviousNext") or re.fullmatch(r"[\d ]{1,40}", s)
                or NAV_LINK_RE.fullmatch(s) or s.lower().startswith("[atpakaļ")):
            continue
        # ALL-CAPS paragraphs -> headings in sentence case
        if bare and bare.isupper() and 3 < len(bare) < 60 and not s.startswith(("-", "[")):
            ln = "## " + bare[:1] + bare[1:].lower()
        if not out and (not s or norm_heading(ln).lower() == title.lower()):
            continue  # leading blanks / heading that repeats the page title
        out.append(ln)
    md = "\n".join(out)
    md = re.sub(r"(\n- [^\n]*)\n(?![-#\n])", r"\1 ", md)  # fold wrapped list items
    md = re.sub(r"\n{3,}", "\n\n", md)
    return md.strip()


CUT_RE = re.compile(r"^(Nepieciešama konsultācija|Sazināties ar mums|Mūsu projekti)", re.I)  # noqa: E501
NAV_LINK_RE = re.compile(r"\[(\*\*)?».*\]\([^)]*\)")


def slug_file(url):
    name = os.path.basename(urllib.parse.urlparse(url).path)
    name = SIZE_RE.sub("", name)
    name = re.sub(r"[^a-z0-9._-]+", "-", name.lower())
    return name


def yaml_str(s):
    return json.dumps(s, ensure_ascii=False)


def main(out_dir):
    pages = all_pages()
    by_id = {p["id"]: p for p in pages}
    wanted = [p for p in pages if p["link"].startswith(f"{BASE}/produkti/")]
    extras = [p for p in pages if urllib.parse.urlparse(p["link"]).path in EXTRA]
    media = media_urls([p["featured_media"] for p in wanted + extras])

    for p in wanted + extras:
        path = urllib.parse.urlparse(p["link"]).path
        if path in EXTRA:
            rel = os.path.join("pages", EXTRA[path])
        else:
            rel = os.path.join("produkti", path[len("/produkti/"):].strip("/") or "_index")
        dest = os.path.join(out_dir, rel)
        os.makedirs(dest, exist_ok=True)

        title = clean_title(p["title"]["rendered"])
        y = p.get("yoast_head_json") or {}
        ex = Extract()
        ex.feed(p["content"]["rendered"])
        body = tidy(ex.markdown(), title)

        # gallery: dedupe by base name, skip tiny icons
        seen, gallery = set(), []
        for src, alt in ex.images:
            if re.search(r"-(?:[1-9]\d|1[0-7]\d)x\d+\.", src) or "logo" in src.lower():
                continue
            key = slug_file(src)
            if key in seen:
                continue
            seen.add(key)
            gallery.append((src, alt, key))

        cover = None
        if p["featured_media"] in media:
            src, alt = media[p["featured_media"]]
            cover = (src, alt, slug_file(src))
        elif gallery:
            cover = gallery[0]
        # sub-pages show children instead of their own nav thumbnails
        has_children = any(c["parent"] == p["id"] for c in pages)
        if has_children:
            gallery = []
        gallery = [g for g in gallery if not cover or g[2] != cover[2]][:MAX_GALLERY]

        def fetch(item):
            src, _, name = item
            target = os.path.join(dest, name)
            if not os.path.exists(target):
                try:
                    data = get(src, binary=True)
                except Exception as e:  # noqa: BLE001
                    print("  ! image failed", src, e)
                    return None
                with open(target, "wb") as f:
                    f.write(data)
                time.sleep(0.1)
            return name

        cover_name = fetch(cover) if cover else None
        gal = [(fetch(g), g[1]) for g in gallery]
        gal = [(n, a) for n, a in gal if n]

        fm = ["---", f"title: {yaml_str(title)}"]
        if y.get("title"):
            fm.append(f"seoTitle: {yaml_str(html.unescape(y['title']))}")
        if y.get("description"):
            fm.append(f"description: {yaml_str(html.unescape(y['description']))}")
        fm.append(f"order: {p.get('menu_order', 0)}")
        fm.append(f"wpId: {p['id']}")
        if cover_name:
            fm.append(f"cover: ./{cover_name}")
            fm.append(f"coverAlt: {yaml_str(cover[1] or title)}")
        if gal:
            fm.append("gallery:")
            for n, a in gal:
                fm.append(f"  - src: ./{n}")
                fm.append(f"    alt: {yaml_str(a or title)}")
        fm.append("---")
        with open(os.path.join(dest, "index.md"), "w", encoding="utf-8") as f:
            f.write("\n".join(fm) + "\n\n" + body + "\n")
        print(f"{rel}: {len(body)} chars, cover={'y' if cover_name else 'n'}, gallery={len(gal)}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
