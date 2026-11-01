import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {TYPES,descriptor,parseId,generate,emptyPlan,evaluate,solve,csv,clock,validateConfig} from '../docs/engine.js';
import {TOOLS,sample,calculate} from '../docs/kit.js';
test('6,000 unique, deterministic and solvable puzzle configurations',()=>{
 const seen=new Set(),ids=new Set();
 for(let i=0;i<6000;i++){
  const d=descriptor(i);assert.ok(d.type);assert.deepEqual(parseId(d.id),d);assert.ok(!ids.has(d.id));ids.add(d.id);
  const c=generate(d.type,d.level,d.seed);assert.ok(validateConfig(c),d.id);assert.deepEqual(c,generate(d.type,d.level,d.seed));
  const shape=structuredClone(c);delete shape.seed;delete shape.level;
  const hash=createHash('sha256').update(JSON.stringify(shape)).digest('hex');assert.ok(!seen.has(hash),'Duplicate board '+d.id);seen.add(hash);
  assert.equal(evaluate(c,emptyPlan(c)).valid,false,d.id+' empty');
  const solution=solve(c);assert.ok(solution,'Unsolvable '+d.id);assert.equal(evaluate(c,solution).valid,true,d.id+' solved');
 }
 assert.equal(seen.size,6000);
});
test('shift engine rejects unavailable, unqualified, overloaded and overlapping people',()=>{
 const c=generate('shifts',0,1),p=solve(c);p.assignments.s0='missing';assert.equal(evaluate(c,p).valid,false);
 const c2=generate('shifts',0,1),p2=solve(c2);c2.people.find(v=>v.id===p2.assignments.s0).available=[];assert.equal(evaluate(c2,p2).valid,false);
 const c3=generate('shifts',0,1),p3=solve(c3);const v=c3.people.find(v=>v.id===p3.assignments.s0);v.skills=[];assert.equal(evaluate(c3,p3).valid,false);
 const c4=generate('shifts',0,1),p4=solve(c4);for(const s of c4.slots)p4.assignments[s.id]='v0';assert.ok(evaluate(c4,p4).errors.some(s=>s.includes('limit')));
});
test('delivery engine checks duplicates, capacity, cooling, time and complete coverage',()=>{
 const c=generate('deliveries',0,1),p=solve(c);p.routes.r0.push('d0');p.routes.r1.push('d0');assert.equal(evaluate(c,p).valid,false);
 for(const key of ['capacity','cold']){const cc=generate('deliveries',0,2);if(key==='capacity')cc.vehicles.forEach(v=>v.capacity=0);else cc.vehicles.forEach(v=>v.cold=false);assert.equal(evaluate(cc,solve(c)).valid,false);}
 const c2=generate('deliveries',0,1);c2.returnBy=0;assert.equal(evaluate(c2,solve(c)).valid,false);
});
test('pack engine checks minimums, stock, integer counts, weight and fairness',()=>{
 const c=generate('packs',0,1);for(const mutator of [p=>p.packs.k0.i0=-1,p=>p.packs.k0.i0=1.5,p=>p.packs.k0.i0=100000]){const p=solve(c);mutator(p);assert.equal(evaluate(c,p).valid,false);}
 const cc=generate('packs',0,1),p=solve(cc);cc.maxWeight=0;assert.equal(evaluate(cc,p).valid,false);
 const c2=generate('packs',0,1),p2=solve(c2);c2.items[0].stock=1000;p2.packs.k0.i0+=10;assert.ok(evaluate(c2,p2).errors.some(s=>s.includes('fairness')));
});
test('24 tools calculate finite outputs and every sample has complete input fields',()=>{
 assert.equal(TOOLS.length,24);assert.equal(new Set(TOOLS.map(t=>t.id)).size,24);
 for(const tool of TOOLS){const r=sample(tool),result=calculate(tool,[r]);assert.equal(result.rows.length,1);assert.ok(result.summary.length>=2);for(const v of Object.values(tool.calc(r)))assert.ok(!/NaN|Infinity/.test(String(v)),tool.id);}
 assert.equal(TOOLS.find(t=>t.id==='food').calc({kg:10,portion:150}).portions,66);
 assert.equal(TOOLS.find(t=>t.id==='budget').calc({qty:10,price:25,funded:100}).gap,150);
});
test('CSV handles quotes, commas, linebreaks and spreadsheet formulas',()=>{
 const s=csv([{name:'=IMPORTXML("bad")',note:'a,b\nc'}]);assert.ok(s.includes("'=IMPORTXML"));assert.ok(s.includes('"a,b\nc"'));assert.ok(s.includes('""bad""'));
 assert.equal(clock(90),'09:30');assert.equal(parseId('shifts-4-1'),null);assert.equal(validateConfig({type:'packs'}),false);
});
