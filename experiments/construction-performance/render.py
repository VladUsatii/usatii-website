import json, pathlib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
root=pathlib.Path(__file__).parent
r=json.loads((root/'results.json').read_text())
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10,'axes.spines.top':False,'axes.spines.right':False,'axes.edgecolor':'#aaa','axes.labelcolor':'#333','xtick.color':'#666','ytick.color':'#666','figure.facecolor':'white','axes.facecolor':'white'})
colors=['#326fbd','#b08735']
figures=[]
for task,slug in [('Floor area','floor-area'),('Surface triangulation','triangulation'),('Work Flow formulas','formulas')]:
 fig,ax=plt.subplots(figsize=(7.2,4.3),dpi=180)
 data=[d for d in r['results'] if d['task']==task]
 names=list(data[0]['scores'])
 if len(data)>1:
  for i,name in enumerate(names):
   ax.plot([d['size'] for d in data],[d['scores'][name]['medianMs']*1000 for d in data],label=name,color=colors[i],marker=['o','*'][i],markersize=[5,9][i],lw=1.4)
  ax.set_xscale('log',base=2);ax.set_xticks([d['size'] for d in data]);ax.set_xticklabels([str(d['size']) for d in data]);ax.set_xlabel('Vertices per polygon')
  if task=='Surface triangulation':ax.set_yscale('log')
  else:ax.set_ylim(bottom=0)
  ax.legend(frameon=False,loc='upper left')
 else:
  vals=[data[0]['scores'][n]['medianMs']*1000 for n in names]
  ax.bar(names,vals,width=.48,color=colors)
  for i,v in enumerate(vals):ax.text(i,v+max(vals)*.03,f'{v:.3f} μs',ha='center')
  ax.set_ylim(0,max(vals)*1.25);ax.set_xticks(range(2));ax.set_xticklabels(['USATII\ncompile + evaluate','HyperFormula\ncalculateFormula'])
 ax.set_ylabel('Median time per call (μs) · lower is better')
 ax.set_title(task,loc='left',fontweight='bold',pad=25)
 ax.grid(axis='y',alpha=.15);ax.set_axisbelow(True)
 fig.text(.13,.015,'Local CPU benchmark · synthetic inputs · 21 timed batches',fontsize=9,color='#666')
 fig.tight_layout(rect=(0,.055,1,1));fig.savefig(root/f'{slug}.png');fig.savefig(root/f'{slug}.svg');plt.close(fig)
 figures.append(f'<section><h2>{task}</h2><img src="{slug}.png" alt="{task} measured runtime comparison"></section>')
rows=''.join(f'<tr><td><code>{e["source"]}</code></td><td>{e["expected"]}</td><td>{e["actual"].get("value") if e["actual"]["ok"] else e["actual"]["error"]["code"]}</td><td>{e["hyperformula"]}</td></tr>' for e in r['edgeCases'])
html='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>USATII performance experiments</title><style>body{font:16px/1.65 system-ui;color:#202023;margin:60px auto;max-width:760px;padding:0 24px}h1{font-size:36px;line-height:1.15;letter-spacing:-.04em}h2{font-size:22px;margin-top:70px}img{width:100%;height:auto}table{border-collapse:collapse;font-size:12px;width:100%}td,th{text-align:left;border-bottom:1px solid #ddd;padding:12px 8px}code{font-size:11px}a{color:#326fbd}p{color:#555}.meta{font-size:12px}section>h2{display:none}section{margin:64px 0}</style><h1>Measured performance.<br>Local engineering experiments.</h1><p>These measurements compare runnable USATII functions with Three.js and HyperFormula on identical synthetic tasks. They do not measure HOVER, monday, capture accuracy, or end-to-end user workflows.</p>'''
html+=f'<p class="meta">{r["timestamp"]} · {r["environment"]["cpu"]} · Node {r["environment"]["node"]}<br>Three.js {r["environment"]["threeVersion"]} · HyperFormula {r["environment"]["hyperformulaVersion"]}</p>'
html+=''.join(figures)
html+='<h2>Correctness</h2><p>Both geometry engines passed all 400 valid-polygon cases for area and triangulation. Both formula engines passed all 3,000 ordinary arithmetic and budget-branch cases. The four separately reported spreadsheet-semantics probes below failed in USATII and passed in HyperFormula.</p><table><tr><th>Probe</th><th>Expected</th><th>USATII</th><th>HyperFormula</th></tr>'+rows+'</table>'
html+='''<h2>Method</h2><p>Seed 20261009 generates 80 simple star-shaped polygons at each of 8, 16, 32, 64, and 128 vertices, alternating winding. Ground-truth area uses analytic radial wedges. Triangulation must return n−2 faces and preserve area to relative error ≤10⁻⁹. This tests neither holes nor invalid boundaries. USATII includes boundary validation; Earcut has a different validation contract, so the timing difference includes that work.</p><p>Ten warm-up passes precede 21 timed batches. Execution order alternates. Identical adaptive repeat counts target at least 5 ms for the faster engine. Results are medians of batch means, not individual request latency. Native input conversion is outside both geometry timers. HyperFormula sheet initialization and USATII column/value preparation are outside formula timers; parse/evaluation and warm engine caches are included as exposed by each API. Formula fixtures are 1,000 numeric inputs across three expressions.</p><p>Raw files include all timings, generated inputs, per-case outputs, runtime versions, and SHA-256 hashes of the USATII modules. No production records were changed.</p><p><a href="results.json">Raw timings and metadata</a> · <a href="fixtures.json">Inputs</a> · <a href="observations.json">Outputs</a> · <a href="run.mjs">Runner</a></p><p>Reference APIs: <a href="https://threejs.org/docs/pages/ShapeUtils.html">Three.js ShapeUtils</a> · <a href="https://hyperformula.handsontable.com/docs/api/classes/hyperformula.html">HyperFormula</a></p>'''
(root/'report.html').write_text(html)
