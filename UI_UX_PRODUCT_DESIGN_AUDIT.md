# Comprehensive UI/UX Exploration + Product Design Audit

_Audit-only document. No product UI implementation is included in this pass._

This document evaluates the current single-page evidence map as a research product, investigation workspace, knowledge system, graph interface, and collaborative intelligence environment. It intentionally challenges the current implementation and explores conservative, bold, and experimental directions.

## SECTION 1 — Current UI/UX strengths

### Recommendation 1.1 — Preserve the source-first evidence model
- **Rationale:** The product's strongest foundation is that cards carry source links, metadata, facts, flags, details, and source-quality notes rather than only narrative prose.
- **Benefits:** Builds user trust, supports independent verification, and makes the product usable as a research artifact instead of a visual essay.
- **Tradeoffs:** Source-first cards can feel dense and slower than a simple story view.
- **Implementation complexity:** Low; preserve existing model while improving presentation.
- **Expected user impact:** High; users can cite, export, and audit claims with less friction.

### Recommendation 1.2 — Keep non-destructive inline discovery
- **Rationale:** Clicking tags/entities without overwriting global search solves a major orientation problem in dense evidence maps.
- **Benefits:** Users can explore side branches without losing their place.
- **Tradeoffs:** Inline discovery can become another panel competing for attention.
- **Implementation complexity:** Low to medium; primarily refinement and state visibility.
- **Expected user impact:** Very high for investigative browsing.

### Recommendation 1.3 — Retain trajectory/domino thinking
- **Rationale:** The domino map is closer to how investigations work: sequences, triggers, timing windows, and linked events.
- **Benefits:** Helps users understand chronology and convergence rather than isolated cards.
- **Tradeoffs:** Curated trajectories risk implying causality if not labeled carefully.
- **Implementation complexity:** Medium; requires better timeline/graph integration.
- **Expected user impact:** High; improves comprehension and recall.

### Recommendation 1.4 — Keep multiple entry points
- **Rationale:** Users may arrive as novices, researchers, analysts, skeptics, or power users.
- **Benefits:** Lenses, search, filters, timelines, graphs, and cards allow different mental models.
- **Tradeoffs:** Too many entry points can create interface overload.
- **Implementation complexity:** Medium; requires stronger hierarchy.
- **Expected user impact:** High if organized into clear modes.

## SECTION 2 — Current UI/UX weaknesses

### Recommendation 2.1 — Reduce top-level panel sprawl
- **Rationale:** The current page stacks many panels before the card accordion, which may feel like a control room without a primary cockpit.
- **Benefits:** A clearer hierarchy would reduce scroll fatigue and first-run confusion.
- **Tradeoffs:** Some power features become one click farther away.
- **Implementation complexity:** Medium; requires layout restructuring.
- **Expected user impact:** High for both novice orientation and expert speed.

### Recommendation 2.2 — Separate orientation, exploration, synthesis, and export
- **Rationale:** Current panels mix overview, discovery, trails, graph, quotes, timeline, and evidence in one vertical flow.
- **Benefits:** Users understand what stage they are in and what action is expected.
- **Tradeoffs:** Requires more deliberate navigation architecture.
- **Implementation complexity:** Medium to high.
- **Expected user impact:** Very high; reduces cognitive load.

### Recommendation 2.3 — Make state visible
- **Rationale:** Filters, open categories, saved cards, compared cards, selected trajectory, discovery term, and search state are all important but not presented as one coherent state model.
- **Benefits:** Users know what view they are looking at and how they got there.
- **Tradeoffs:** A state bar can itself become cluttered.
- **Implementation complexity:** Medium.
- **Expected user impact:** High for confidence and recoverability.

### Recommendation 2.4 — Improve scale strategy
- **Rationale:** The current approach works for ~150 cards but will strain at 500, 2,000, or 20,000 records.
- **Benefits:** Preparing scale early avoids a future redesign.
- **Tradeoffs:** More abstraction and data modeling work now.
- **Implementation complexity:** High if data architecture changes.
- **Expected user impact:** High long-term.

## SECTION 3 — Missing capabilities

### Recommendation 3.1 — Add entity dossiers
- **Rationale:** High-convergence people/institutions need dedicated pages or overlays with timeline, links, investments, quotes, source quality, connected cards, and unresolved questions.
- **Benefits:** Turns repeated names into navigable knowledge objects.
- **Tradeoffs:** Requires entity normalization and disambiguation.
- **Implementation complexity:** High.
- **Expected user impact:** Very high; entity-first investigation becomes possible.

### Recommendation 3.2 — Add hypothesis workbench
- **Rationale:** Investigations often revolve around hypotheses, not only keywords.
- **Benefits:** Users can attach evidence for/against claims, track uncertainty, and avoid overclaiming.
- **Tradeoffs:** Adds complexity and may require careful wording to prevent false certainty.
- **Implementation complexity:** High.
- **Expected user impact:** Very high for serious research.

### Recommendation 3.3 — Add source-quality audit system
- **Rationale:** Links decay; source type and reliability vary.
- **Benefits:** Users can filter official records, primary documents, secondary commentary, archived copies, and uncertain sources.
- **Tradeoffs:** Requires ongoing maintenance.
- **Implementation complexity:** Medium.
- **Expected user impact:** High for trust and repeat use.

### Recommendation 3.4 — Add graph export/import
- **Rationale:** The product already implies graph structure but does not fully expose nodes/edges.
- **Benefits:** Enables external analysis, graph visualization, and reproducible network research.
- **Tradeoffs:** Requires schema discipline.
- **Implementation complexity:** Medium.
- **Expected user impact:** High for power users.

## SECTION 4 — Dynamic layout concepts

### Recommendation 4.1 — Introduce a three-zone command workspace
- **Rationale:** A dynamic workspace could use left navigation/state, center evidence canvas, and right contextual inspector.
- **Benefits:** Reduces vertical scrolling and makes context persistent.
- **Tradeoffs:** More complex responsive behavior, especially mobile.
- **Implementation complexity:** High.
- **Expected user impact:** Very high on desktop and multi-monitor setups.

### Recommendation 4.2 — Add layout presets
- **Rationale:** Users need different layouts for scanning, timeline work, graph work, briefing, and deep reading.
- **Benefits:** Supports novice and power-user workflows without forcing one interface.
- **Tradeoffs:** More UI state to manage.
- **Implementation complexity:** Medium.
- **Expected user impact:** High.

### Recommendation 4.3 — Use adaptive density by evidence volume
- **Rationale:** When 10 results are visible, rich cards are fine; when 300 are visible, table/list/radar views are better.
- **Benefits:** The interface responds to information density.
- **Tradeoffs:** Multiple renderers require consistency work.
- **Implementation complexity:** Medium.
- **Expected user impact:** High for scalability.

### Recommendation 4.4 — Create a pinned context rail
- **Rationale:** Current context disappears while scrolling.
- **Benefits:** Always shows active filters, selected trajectory, saved count, comparison state, and current discovery term.
- **Tradeoffs:** Consumes screen space.
- **Implementation complexity:** Medium.
- **Expected user impact:** High for orientation.

## SECTION 5 — Adaptive workspace concepts

### Recommendation 5.1 — Intent-aware workspace modes
- **Rationale:** The UI should adapt when the user is browsing, validating, synthesizing, exporting, or comparing.
- **Benefits:** Reduces irrelevant controls and highlights next likely actions.
- **Tradeoffs:** Wrong inference may annoy users.
- **Implementation complexity:** High.
- **Expected user impact:** High if user can override mode.

### Recommendation 5.2 — Role-based configurations
- **Rationale:** Executive readers, researchers, data auditors, journalists, and collaborators need different defaults.
- **Benefits:** Faster onboarding and less overload.
- **Tradeoffs:** Role selection may feel artificial if too rigid.
- **Implementation complexity:** Medium.
- **Expected user impact:** High.

### Recommendation 5.3 — Evidence-density adaptive summarization
- **Rationale:** When a view contains many cards, the workspace should summarize dominant entities, date clusters, source types, and contradictions.
- **Benefits:** Turns overload into situational awareness.
- **Tradeoffs:** Summaries can hide nuance.
- **Implementation complexity:** High, especially if AI-assisted.
- **Expected user impact:** Very high.

### Recommendation 5.4 — Stage-aware calls to action
- **Rationale:** The same controls are not equally useful at every investigation stage.
- **Benefits:** Better pacing: discover → inspect → compare → synthesize → export.
- **Tradeoffs:** Requires robust state modeling.
- **Implementation complexity:** Medium.
- **Expected user impact:** Medium to high.

## SECTION 6 — Investigation workflow concepts

### Recommendation 6.1 — Build an investigation board
- **Rationale:** Saved cards and compare trays are useful but limited; users need boards for clusters, hypotheses, timelines, and source piles.
- **Benefits:** Supports actual investigative thinking: grouping, labeling, sequencing, and contradiction tracking.
- **Tradeoffs:** More complex than current save/compare.
- **Implementation complexity:** High.
- **Expected user impact:** Very high.

### Recommendation 6.2 — Add branching trails
- **Rationale:** Investigations fork: one thread may split into funding, family, policy, patent, and quote branches.
- **Benefits:** Users can pursue branches without losing parent context.
- **Tradeoffs:** Branch management can become complex.
- **Implementation complexity:** High.
- **Expected user impact:** Very high for power users.

### Recommendation 6.3 — Evidence-for/evidence-against lanes
- **Rationale:** Source maps should help users avoid confirmation bias.
- **Benefits:** Encourages disciplined analysis and uncertainty handling.
- **Tradeoffs:** Requires users to classify evidence or AI assistance.
- **Implementation complexity:** Medium to high.
- **Expected user impact:** High for credibility.

### Recommendation 6.4 — Investigation checkpoints
- **Rationale:** Users need moments to summarize what is known, unknown, inferred, contradicted, and missing.
- **Benefits:** Prevents endless browsing and creates reusable outputs.
- **Tradeoffs:** Adds workflow structure some users may skip.
- **Implementation complexity:** Medium.
- **Expected user impact:** High.

## SECTION 7 — Collaboration workflow concepts

### Recommendation 7.1 — Multi-user evidence rooms
- **Rationale:** Investigations often involve multiple researchers reviewing different branches.
- **Benefits:** Enables shared boards, assignments, comments, and source review.
- **Tradeoffs:** Requires identity, permissions, and synchronization.
- **Implementation complexity:** Very high.
- **Expected user impact:** Transformational for teams.

### Recommendation 7.2 — Presence and activity awareness
- **Rationale:** Multiplayer systems work because users can see who is where and what changed.
- **Benefits:** Reduces duplicate effort and supports coordination.
- **Tradeoffs:** Privacy and distraction concerns.
- **Implementation complexity:** High.
- **Expected user impact:** High for collaborative teams.

### Recommendation 7.3 — Source review queues
- **Rationale:** Teams need a pipeline for unreviewed, verified, disputed, archived, and rejected sources.
- **Benefits:** Improves evidence governance.
- **Tradeoffs:** Adds workflow overhead.
- **Implementation complexity:** Medium.
- **Expected user impact:** High for serious research groups.

### Recommendation 7.4 — Collaborative synthesis notes
- **Rationale:** Evidence collections are only valuable if teams can synthesize findings.
- **Benefits:** Converts source browsing into reports, timelines, and briefs.
- **Tradeoffs:** Requires conflict resolution and versioning.
- **Implementation complexity:** High.
- **Expected user impact:** High.

## SECTION 8 — AI-native interaction concepts

### Recommendation 8.1 — AI research copilot with citations only
- **Rationale:** AI can help navigate the corpus but must be constrained to cite cards and source links.
- **Benefits:** Faster onboarding, better query expansion, and guided exploration.
- **Tradeoffs:** Risk of hallucination unless retrieval is strict.
- **Implementation complexity:** High.
- **Expected user impact:** Very high.

### Recommendation 8.2 — AI-generated workspace layouts
- **Rationale:** AI can infer whether a user is doing timeline analysis, entity analysis, or source verification and suggest a layout.
- **Benefits:** Interface adapts to intent instead of forcing static dashboards.
- **Tradeoffs:** Needs transparent user override.
- **Implementation complexity:** High.
- **Expected user impact:** High.

### Recommendation 8.3 — AI contradiction detector
- **Rationale:** Dense evidence sets often contain conflicting dates, claims, actors, and interpretations.
- **Benefits:** Surfaces uncertainty and prevents overconfident narratives.
- **Tradeoffs:** Requires structured claims extraction.
- **Implementation complexity:** Very high.
- **Expected user impact:** Very high for credibility.

### Recommendation 8.4 — AI brief generator with audit trail
- **Rationale:** Users will want executive summaries, but every sentence must point back to sources.
- **Benefits:** Turns evidence into shareable outputs without losing provenance.
- **Tradeoffs:** Needs strict citation and quote controls.
- **Implementation complexity:** High.
- **Expected user impact:** Very high.

## SECTION 9 — Graph-native interaction concepts

### Recommendation 9.1 — Promote entities to first-class graph nodes
- **Rationale:** Repeated people, organizations, documents, technologies, places, and grants should be navigable objects.
- **Benefits:** Enables entity pages, centrality, relationship paths, and graph analytics.
- **Tradeoffs:** Requires entity normalization.
- **Implementation complexity:** High.
- **Expected user impact:** Very high.

### Recommendation 9.2 — Add edge types and relationship confidence
- **Rationale:** Not all connections are equal; “funded,” “authored,” “mentioned,” “partnered,” and “same date” are different.
- **Benefits:** Prevents misleading graph visuals.
- **Tradeoffs:** More metadata work.
- **Implementation complexity:** High.
- **Expected user impact:** Very high.

### Recommendation 9.3 — Pathfinding between entities
- **Rationale:** Users often ask, “How is A connected to B?”
- **Benefits:** Converts the evidence map into an exploratory graph tool.
- **Tradeoffs:** Bad pathfinding can imply significance where there is only weak co-occurrence.
- **Implementation complexity:** High.
- **Expected user impact:** Very high.

### Recommendation 9.4 — Graph/time hybrid view
- **Rationale:** Relationships without time can mislead; timelines without relationships can feel flat.
- **Benefits:** Shows when connections appear, intensify, or disappear.
- **Tradeoffs:** Complex visualization design.
- **Implementation complexity:** Very high.
- **Expected user impact:** Very high.

## SECTION 10 — Information architecture improvements

### Recommendation 10.1 — Reorganize around primary navigation modes
- **Rationale:** Current panels are functionally rich but vertically stacked.
- **Benefits:** A mode-based IA could clarify: Overview, Evidence, Entities, Timeline, Graph, Board, Exports.
- **Tradeoffs:** More navigation design and routing.
- **Implementation complexity:** Medium to high.
- **Expected user impact:** High.

### Recommendation 10.2 — Separate data categories from workflow categories
- **Rationale:** “Funding,” “patents,” and “legacy” are data types; “investigate,” “compare,” and “export” are workflow stages.
- **Benefits:** Reduces conceptual mixing.
- **Tradeoffs:** Requires a clearer mental model.
- **Implementation complexity:** Medium.
- **Expected user impact:** High.

### Recommendation 10.3 — Add entity taxonomy and aliases
- **Rationale:** Search quality depends on recognizing aliases, abbreviations, and variants.
- **Benefits:** Better matching and graph integrity.
- **Tradeoffs:** Needs ongoing curation.
- **Implementation complexity:** Medium.
- **Expected user impact:** High.

### Recommendation 10.4 — Add saved views
- **Rationale:** Users need to return to a configured lens/filter/search/trajectory state.
- **Benefits:** Reproducible workflows and collaboration readiness.
- **Tradeoffs:** Requires state serialization.
- **Implementation complexity:** Medium.
- **Expected user impact:** High.

## SECTION 11 — Orientation and navigation improvements

### Recommendation 11.1 — Add a persistent minimap
- **Rationale:** Long single-page interfaces need spatial awareness.
- **Benefits:** Users can see where they are: overview, panels, timeline, graph, cards.
- **Tradeoffs:** Can add visual noise.
- **Implementation complexity:** Medium.
- **Expected user impact:** High.

### Recommendation 11.2 — Add breadcrumb/state chips
- **Rationale:** Users need clear visibility into active filters, selected lens, selected trajectory, discovery term, saved cards, and compare state.
- **Benefits:** Improves wayfinding and reset confidence.
- **Tradeoffs:** Must avoid chip clutter.
- **Implementation complexity:** Low to medium.
- **Expected user impact:** High.

### Recommendation 11.3 — Improve first-run onboarding
- **Rationale:** The product is powerful but dense.
- **Benefits:** A short “choose your entry point” flow can reduce abandonment.
- **Tradeoffs:** Returning users may not want onboarding.
- **Implementation complexity:** Medium.
- **Expected user impact:** High for novices.

### Recommendation 11.4 — Add command palette
- **Rationale:** Power users need fast keyboard access to cards, entities, actions, views, exports, and lenses.
- **Benefits:** Increases speed and discoverability.
- **Tradeoffs:** Requires good indexing.
- **Implementation complexity:** Medium.
- **Expected user impact:** High for experts.

## SECTION 12 — Experimental concepts

### Recommendation 12.1 — Knowledge radar
- **Rationale:** A radar-like view could show hot clusters by entity density, date density, source quality, and uncertainty.
- **Benefits:** Makes the corpus feel alive and navigable.
- **Tradeoffs:** Experimental visuals can confuse if not grounded.
- **Implementation complexity:** High.
- **Expected user impact:** Medium to high if well executed.

### Recommendation 12.2 — Investigation RTS interface
- **Rationale:** Strategy games solve multi-front awareness: minimaps, alerts, resources, units, fog-of-war, and command groups.
- **Benefits:** Useful metaphor for multiple evidence fronts and unresolved branches.
- **Tradeoffs:** Could feel too game-like if visual language is not professional.
- **Implementation complexity:** Very high.
- **Expected user impact:** High for advanced users.

### Recommendation 12.3 — Swarm research mode
- **Rationale:** Multiple AI or human agents could take separate branches: source audit, entity timeline, quote extraction, graph edge typing.
- **Benefits:** Parallelizes research and exposes progress.
- **Tradeoffs:** Needs strong provenance and coordination.
- **Implementation complexity:** Very high.
- **Expected user impact:** Transformational for teams.

### Recommendation 12.4 — Visual-programming investigation pipelines
- **Rationale:** Users could assemble workflows like: filter → entity extraction → timeline → contradiction check → export brief.
- **Benefits:** Makes complex analysis reproducible.
- **Tradeoffs:** High learning curve.
- **Implementation complexity:** Very high.
- **Expected user impact:** High for technical users.

## SECTION 13 — Highest-impact recommendations

### Recommendation 13.1 — Build entity-specific timeline overlays first
- **Rationale:** This is the next logical step from the current domino map and thread explorer.
- **Benefits:** Makes high-convergence nodes understandable as chronological dossiers.
- **Tradeoffs:** Requires normalized entity matching.
- **Implementation complexity:** Medium to high.
- **Expected user impact:** Very high.

### Recommendation 13.2 — Add graph nodes/edges schema
- **Rationale:** Many current features would improve if the dataset had explicit relationships.
- **Benefits:** Enables graph export, pathfinding, confidence labels, and entity pages.
- **Tradeoffs:** Requires data migration and schema decisions.
- **Implementation complexity:** High.
- **Expected user impact:** Very high.

### Recommendation 13.3 — Create a persistent workspace shell
- **Rationale:** Current stacked panels should become a workspace with persistent context.
- **Benefits:** Better orientation, faster navigation, and scalable feature growth.
- **Tradeoffs:** Significant UI architecture work.
- **Implementation complexity:** High.
- **Expected user impact:** Very high.

### Recommendation 13.4 — Add source-quality audit and archive layer
- **Rationale:** Trust is the product's core value.
- **Benefits:** Increases credibility and long-term reliability.
- **Tradeoffs:** Requires maintenance and possibly automated link checking.
- **Implementation complexity:** Medium.
- **Expected user impact:** High.

### Recommendation 13.5 — Add hypothesis/evidence board
- **Rationale:** Users need to synthesize, not only browse.
- **Benefits:** Turns the map into an investigation workspace.
- **Tradeoffs:** Adds new interaction complexity.
- **Implementation complexity:** High.
- **Expected user impact:** Very high.

## SECTION 14 — Lowest-risk improvements

### Recommendation 14.1 — Rename and group panels more clearly
- **Rationale:** Some labels are strong, but the order and grouping can be clearer.
- **Benefits:** Better comprehension with minimal architecture change.
- **Tradeoffs:** Does not solve deeper layout scale issues.
- **Implementation complexity:** Low.
- **Expected user impact:** Medium.

### Recommendation 14.2 — Add active-state summary bar
- **Rationale:** Showing current filters/search/lens/trajectory is low-risk and high-value.
- **Benefits:** Strong orientation improvement.
- **Tradeoffs:** Needs careful visual compression.
- **Implementation complexity:** Low to medium.
- **Expected user impact:** High.

### Recommendation 14.3 — Add keyboard shortcuts and command hints
- **Rationale:** Existing actions are already present; shortcuts simply expose them faster.
- **Benefits:** Improves power-user speed.
- **Tradeoffs:** Must avoid conflicts and document shortcuts.
- **Implementation complexity:** Low to medium.
- **Expected user impact:** Medium.

### Recommendation 14.4 — Add empty-state and overload-state messages
- **Rationale:** Users need help when there are no results or too many results.
- **Benefits:** Reduces confusion.
- **Tradeoffs:** Minor copy/design work.
- **Implementation complexity:** Low.
- **Expected user impact:** Medium.

### Recommendation 14.5 — Add “why this is shown” explanations
- **Rationale:** Lenses, discovery, and graph matches should explain match logic.
- **Benefits:** Builds trust in recommendations and ranking.
- **Tradeoffs:** Adds text density.
- **Implementation complexity:** Low to medium.
- **Expected user impact:** High.

## SECTION 15 — Long-term vision concepts

### Recommendation 15.1 — Evidence operating system
- **Rationale:** The product could become an OS-like workspace for documents, entities, trails, hypotheses, timelines, graphs, and reports.
- **Benefits:** Coherent long-term product direction.
- **Tradeoffs:** Much larger scope than a single-page app.
- **Implementation complexity:** Very high.
- **Expected user impact:** Transformational.

### Recommendation 15.2 — Collaborative intelligence command center
- **Rationale:** Teams could coordinate human and AI research across source auditing, entity timelines, graph mapping, and report generation.
- **Benefits:** Enables scale beyond one researcher.
- **Tradeoffs:** Requires accounts, permissions, sync, provenance, and trust controls.
- **Implementation complexity:** Very high.
- **Expected user impact:** Transformational for organizations.

### Recommendation 15.3 — AI-cited investigative notebook
- **Rationale:** Notebook-style cells could combine prompts, evidence queries, generated summaries, charts, and citations.
- **Benefits:** Makes research reproducible and inspectable.
- **Tradeoffs:** Requires careful AI guardrails and citation fidelity.
- **Implementation complexity:** Very high.
- **Expected user impact:** Very high.

### Recommendation 15.4 — Graph-native evidence commons
- **Rationale:** If relationships become structured, the product can support shared public datasets, graph exports, and independent verification layers.
- **Benefits:** Allows the corpus to grow beyond one UI and become an interoperable knowledge base.
- **Tradeoffs:** Requires governance, schema stability, and moderation.
- **Implementation complexity:** Very high.
- **Expected user impact:** Transformational.

## Priority map

1. **Next logical task:** entity-specific timeline overlays for the highest-convergence nodes.
2. **Best trust task:** source-quality audit and archive layer.
3. **Best architecture task:** explicit graph nodes/edges schema.
4. **Best usability task:** persistent state bar + clearer mode navigation.
5. **Best long-term bet:** AI-cited investigative notebook plus graph-native workspace.

## Assumptions challenged

- **Assumption:** More panels equal more power.  
  **Challenge:** More panels can reduce power if users lose context.

- **Assumption:** A single vertical page is enough.  
  **Challenge:** Investigation workflows benefit from persistent context, side inspectors, boards, and multi-pane layouts.

- **Assumption:** Search is the main navigation system.  
  **Challenge:** Entity-first, timeline-first, graph-first, and hypothesis-first modes may be more powerful.

- **Assumption:** Cards are the primary unit.  
  **Challenge:** Entities, relationships, hypotheses, timelines, and source bundles may be more important units.

- **Assumption:** The product is primarily a dataset viewer.  
  **Challenge:** It is closer to an investigation workspace and should be designed as one.
