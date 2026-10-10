USATII performance experiments — 9 October 2026

Run: node experiments/construction-performance/run.mjs
Render: MPLCONFIGDIR=/private/tmp/usatii-matplotlib python3 experiments/construction-performance/render.py

The runner reads production-source modules from BENCH_SOURCE (default /Users/vladusatii/Dev/REBUILDITINC) without modifying that repository or starting its app. It requires the Three.js dependency installed there and HyperFormula 3.5.0 installed at /private/tmp/usatii-performance-reference/node_modules/hyperformula. Install the latter with npm install --prefix /private/tmp/usatii-performance-reference hyperformula@3.5.0 --ignore-scripts. Python rendering requires matplotlib.

Outputs: report.html; results.json (method, runtime, source hashes, batch timings); fixtures.json (all inputs); observations.json (all correctness outputs); summary.json; three PNG and SVG figures.

Experiment scope
1. Floor polygon area: USATII geometryArea vs Three.js ShapeUtils.area.
2. Surface tessellation: USATII triangulatePolygon vs Three.js ShapeUtils.triangulateShape (Earcut).
3. Work Flow formula parse/evaluation: USATII formula engine vs HyperFormula calculateFormula.

These are local component-level performance comparisons against reference engines, not product-level HOVER or monday comparisons. No sensor/capture accuracy claim is possible from exact synthetic geometry. Both geometry implementations receive the same valid simple polygons in their native formats; USATII additionally validates boundaries. Neither experiment tests holes or malformed polygons. Formula tests use integer arithmetic to avoid rounding ambiguities; four additional compatibility probes explicitly exercise conditional error handling and negative rounding.

HOVER product experiment status
The user opened Commercial Office Blueprint Example (shared demo, job 24255998 / model 24373004). Its workspace exposes Split, Measure, materials, measurements and estimates. However My Projects subsequently showed Log in and no project-creation control. Account sign-in is pending before a matched-input product trial can proceed.

Planned product tasks, fixed before timing
A. Upload the same synthetic dimensioned building plan to HOVER and USATII; start at accepted input, finish at an inspectable model and quantity report. Record processing cost before submission; no paid order without a user limit. Report timeout/ineligibility separately, never as a guessed completion time.
B. Compare per-surface quantities against dimensions calculated independently from that plan; match inclusion/exclusion rules (openings, roof vs floor, units, waste). Score mean absolute percentage error and signed bias; preserve every surface result.
C. Export the same accepted measurement result to PDF; time request-to-download completion using the same browser and acquisition method. Report identical content requirements and export failures.

Use at least 10 matched independent inputs per scenario, alternate product order, preserve all failures, record software versions/environment, and keep processing, operator interaction, and export time separate. Demo-model navigation and browser-automation transport time are not valid stand-ins for these measurements.

Product repositories remain read-only. Findings are recorded here rather than silently changing the code under test.
