# THE EVIDENCE — Primary Source Documentation Database

A single-page evidence map for tracking public source material on artificial intelligence governance, digital identity, biometrics, neurotechnology, health-data infrastructure, surveillance, public funding, patents, corporate filings, and related policy documents.

## What is included

- 240+ evidence cards across patents, legislation, official documents, speeches, corporate filings, leaks/declassified material, research, funding trails, bioengineering/vector releases, pathogen surveillance, environment/weather modification, human genome editing, virtual-human/digital-twin systems, identity-medicine funding, pharmaceutical endocrine technologies, key-player/network dossiers, and legacy-root/family-lineage records, and a new Social Engineering category for propaganda, indoctrination, conditioning, entertainment priming, machine-empathy, space-expansion narratives, Dennis Bushnell future-warfare material, civilisational-stage scripts, and explicitly speculative planetary-cycle theories, plus a Mythos & Folklore layer for ancient literature, artificial-life folklore, control-fiction roots, radio/media panic history, and archetypal stage/cycle narratives.
- Direct source links for each card, with emphasis on government, standards-body, patent, regulator, institutional, peer-reviewed, and project-primary sources; recent standards-layer additions include EUDI Wallet ARF, W3C VC/DID credentials, WHO GDHCN, OECD AI Principles, ISO/IEC 42001, Council of Europe AI Convention, GA4GH, and the WEF Global Future Councils layer.
- Added coverage for the EU AI Act, U.S. Executive Order 14110, NIST AI RMF, WHO AI-for-health guidance, FDA AI guidance, IEEE 2089, NSF AI Institutes, NIH BRAIN Initiative, COVID/EcoHealth oversight records, HantaNet/Hantavirus genomics, genetically engineered mosquito releases, Wolbachia mosquito biopesticides, DARPA Safe Genes/Insect Allies/PREEMPT, CRISPR tick and Lyme ecological-engineering research, human genome editing governance, and weather/solar-geoengineering governance, Martine Rothblatt/Terasem/United Therapeutics records, Pritzker/TAWANI gender-medicine funding trails, WPATH/Endocrine Society/Cass Review documents, Meta Reality Labs metaverse filings, Microsoft digital-person chatbot patents, and Human Brain Project/Blue Brain/Living Heart digital-twin initiatives, WEF/YGL network records, an official-cohort YGL roster index with 2020-2026 classes, verification queue, expanded historical archive-target queues, profile cards for Omar Al Olama, Mykhailo Fedorov, Joy Buolamwini, Sanna Marin, Michael Kratsios, Shou Zi Chew, Han Bicheng / BrainCo, Kaitlyn Sadtler, Aakrit Vaish, Marissa Giustina, Miku Hirano, Annalena Baerbock, Alicia Garza, Camille François, May Habib, Sofia Elizondo, and Vilas Dhar.

## Mythos & Folklore

The Mythos & Folklore layer pushes the Social Engineering timeline backward into ancient literature, folklore, early artificial-life stories, lost-civilisation myths, dystopian fiction roots, radio/media reality confusion, and symbolic cycle narratives. It is intentionally source-aware: ancient or literary artifacts can be high-confidence texts while modern interpretations about transhumanism, programming, earth-as-farm, or civilisational cycles remain medium, low-confidence, contested, or explicitly speculative unless primary evidence supports stronger claims. The layer now includes early futurist and posthuman-adjacent sources that connect world knowledge systems, ectogenesis, body engineering, posthuman species, and machine-city cinema to the main evidence spine where relevant, plus a comparative belief-systems section for savior heroes, dying/rising and descent/return figures, prophet/lawgiver archetypes, monomyth scholarship, and apocalypse/world-renewal scripts.

## Social Engineering

The Social Engineering section is a source-aware research layer for propaganda history, education/indoctrination systems, behavioural conditioning, entertainment tropes, machine-empathy narratives, space-expansion narratives, strategic forecasting, and speculative civilisational scripts. It includes clearly separated confidence labels so documented historical material remains distinct from interpretive patterning or low-confidence theory shelves.

- **High confidence** — directly documented publications, institutions, reports, policies, or official records.
- **Medium confidence** — strong interpretive patterns across multiple documented examples.
- **Low confidence** — speculative or symbolic extrapolation.
- **Contested** — disputed claims or weakly sourced intent claims that require primary-source hardening before escalation.

## Useful features

- Search across titles, descriptions, jurisdictions, tags, research flags, details, related entities, source quality notes, and source URLs.
- Collapsible category tabs and a slim left-edge Workspace Index drawer keep both analysis panels and source-card categories folded by default; the drawer opens from a fixed side tab, adds fast route presets for Connection Map, Source Hardening, Report Path, and Evidence Cards, groups the main sections downward by purpose, and supports open/collapse plus drag-reordering without occupying the main page flow.
- Compact/comfortable density controls plus per-category enlarge/shrink actions make it easier to scan many entries at a glance; newly opened cards now receive category-coloured outlines, a subtle focus pulse, and an opened-state pill so users can immediately see what changed. Source links and expanded-card entities can open draggable floating comparison windows that can be tiled, cascaded, saved/restored as layouts, optionally persisted across reloads, regenerated from saved term/source payloads when restored, minimized into bottom tabs, grouped by dragging tabs together, and exported as JSON.
- Category filters and quick-search chips for high-value topics including Comparative Religion, Jesus Parallels, Savior Hero, Monomyth, Apocalypse, Mythos, Folklore, Gilgamesh, Prometheus, Golem, Frankenstein, War of the Worlds, Social Engineering, propaganda, machine empathy, Dennis Bushnell, bio-nano age, earth-as-farm speculation, Rothblatt, Pritzker, digital twins, mind uploading, virtual humans, puberty blockers, WPATH, and pathogen/vector topics; category chips are draggable, persist their order, and rearrange the card-section accordion to match.
- Sort controls for newest, oldest, title, category, and most source links.
- Expand/collapse visible cards, open/close all category tabs, and open/collapse all workspace panels from the toolbar or left Workspace Index.
- Timeline panel showing the selected trajectory chain above the newest visible entries.
- Research Track Router keeps core transhuman evidence separate from contextual bridges, mythos roots, and optional/speculative additional reading; the Bridge Map turns cross-domain routes such as DPI identity/payment/data rails, health-genomics/AI medicine, social-engineering/platform governance, surveillance fusion, and bioethics/enhancement into one-click discovery paths, now shows matching Domino trajectories for each route, and includes a zoomable visual route-to-domino graph; Signal Stack Radar makes pattern convergence pop by ranking ancient-mythos, persuasion, machine-empathy, stage-script, and planetary-expansion stacks by matching cards and source-link density. Thread Explorer overlay that surfaces recurring people, organizations, and concepts, then lets you search, open, or copy a whole connection thread.
- Persistent current-view state bar, Focus Mode, Entity Intelligence dossiers with source-quality audit and source-hardening drawers and checklist exports for weak-link/archive-candidate cards, enhanced compare surfaces, and reusable workspace pages for saving and comparing distinct investigative views.
- Copy a single card citation with links, copy all visible links, or export the visible dataset as JSON.
- Expanded card details include research flags, source-quality labels, source-domain chips, and clarifying notes that distinguish documented releases/proposals from unsupported claims.

## How to use

Open `index.html` directly in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

For a desktop-style launcher, copy the repository folder wherever you want and double-click `Open_Evidence_Map.cmd` on Windows. Linux/macOS users can run `./Open_Evidence_Map.sh` to open the same map from a shell.

## Testing

Run the static smoke suite with:

```bash
node tests/smoke-test.js
node tests/ui-behavior-test.js
```

The smoke suites check inline JavaScript, dataset/card schema, persisted category/workspace ordering, physical section reordering, lazy collapsed-panel rendering, and deterministic Index/Impact/Source drawer behavior.

## Notes

This project is for research and educational use. Links may change over time; if a primary URL is unavailable, check official archives or the Internet Archive.
