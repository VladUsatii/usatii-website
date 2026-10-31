# Enterprise AI visual scenes

`/software/enterprise-ai` uses a custom SVG desktop illustration and a repeating photographic archive. Both are illustrative, not customer data or product screenshots.

## Assets

- `retro-icon.jsx` contains original SVG file, folder, audio, photograph, spreadsheet, notes, globe, lock, and trash icons.
- VT323 is self-hosted under the SIL Open Font License. Its license is in `public/fonts/VT323-OFL.txt`.
- Vintage photographs were curated from [New Old Stock](https://nos.twnsnd.co/), which describes its collection as free of known copyright restrictions. Each image's original Flickr link, title, curator page, and download URL are preserved in `public/enterprise-ai/archive/sources.json`. The collection's [usage statement](https://nos.twnsnd.co/rights-and-usage) points readers to each originating institution's rights information. These images illustrate an archive; no pictured institution is presented as a customer or endorser.

## Interaction

The desktop files can be dragged. Dock buttons open sample file windows and can close them again.

The archive uses the existing Framer Motion dependency for scroll-linked opacity and headline movement. A requestAnimationFrame loop provides pointer panning, momentum, and seamless tile wrapping. It stops when motion settles and is cancelled on unmount. ResizeObserver sizes the bounded tile pool to the viewport. Photos are served locally and repeated rather than requesting an unbounded image feed.

Arrow keys pan the focused photo field. Vertical touch gestures retain native page scrolling; horizontal gestures pan the archive. Reduced-motion preferences remove momentum and show the headline immediately. Attribution and the source manifest remain available from the scene.

## CRT scroll transition

`computer-zoom.jsx` keeps one live desktop mounted from the desk scene through the final interactive viewport. Normalized glass bounds in the photograph drive both the photograph's camera transform and the clipping aperture. The scale ends with 4% overscan so the bezel cannot show at viewport edges. Desktop content scales independently on each axis until it reaches full viewport dimensions. The ending portion of the sticky section holds this final composition before the archive enters. Motion is reversible and resize-aware; reduced-motion users skip directly to the desktop. The intermediate desktop is inert to prevent focus jumps during the zoom.

`public/enterprise-ai/office-crt.webp` is an AI-generated office photograph, created with the built-in image generation tool and compressed to WebP. Generation prompt: a straight-on cinematic photograph of a beige 1994 CRT computer on a worn oak office desk, keyboard, wired mouse, paper stacks, filing cabinets and venetian blinds, warm muted morning light, empty charcoal screen for a live HTML replacement, no people, branding, or text. The source generation is retained under the default generated-images location; the website uses the workspace asset.

## Work Flow parity and archive handoff

The demonstration now follows the REBUILDITINC Work Flow source: `components/dashboard/WorkflowBoardTab.js` and `app/globals.css` (`work-flow-grid`, group headings, toolbar and status cells). It uses the source palette (#323338, #676879, #d0d4e4, #0073ea), 36px rows, 6px group stripe, purple group heading, blue selected rows, and colored status cells. It is an illustrative local board, not the deployed application or a full functional replica.

The archive and board share one sticky viewport. During the latter part of the scroll, photographic tiles converge on measured Files-cell rectangles as the board appears. Extra tiles fade out; the matching eight photographs remain in the table. The board becomes interactive after this transition. Search, approval filtering, selection, review/approval and reset operate on sample data only. Reduced-motion users skip the tile flight.

## Genuine Work Flow component integration

The earlier hand-built table was replaced with a snapshot of REBUILDITINC's actual `WorkflowBoardTab.js` and its UI dependencies under `genuine-workflow/`. The source board's sidebar is removed. Changes to that snapshot are limited to routing API requests into `demo-transport.js`, disabling production-only invoice/bug-report entry points, namespacing remembered-board storage, seeding archival photo attachments, and adapting file upload/download to browser-local data. No REBUILDITINC production API is contacted.

The adapter supports local board/item/group edits, schemas and column changes, query filtering/sorting, views, bulk operations, imports, and photo assets. Source UI controls are retained; backend-dependent features outside those contracts are not a claim of production functionality. Requests without a demo adapter return an explicit error rather than silently pretending to execute.

Browser verification covered genuine filter UI, inline edit, persistence after reload, and expanded photo preview. Adapter contract checks covered edit/query, saved views, schema publication, row creation/trash, CSV import, and seeded assets. The photo handoff now waits for target thumbnails and latches readiness so hiding a file column or deleting a row cannot bring the photo overlay back.

## Closing CTA photograph

`public/enterprise-ai/team-installation.webp` was created with the built-in image generation tool using the user's logo screenshot as a branding reference. Prompt: a photorealistic candid editorial photograph of precisely three male engineers installing rackmount equipment and routing cables in a real data center; all wear white crewneck sweatshirts with a small centered purple-orb / navy USATII chest logo; natural cool-white practical lighting, textured cotton, credible hardware and hands, no posing, neon glow, or superimposed text. The photo is illustrative, not a claim that these are actual employees. Its alt text identifies it as AI generated.

The closing CTA uses an open two-column editorial composition with the original requested headline and a single Bootcamp link. The entire 3:2 photograph appears at right on desktop and below the copy on mobile.
