from pathlib import Path
import sys

CONTRACTS = Path('app/src/main/assets/contracts.js')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(CONTRACTS.is_file(), 'contracts.js is missing')
text = CONTRACTS.read_text(encoding='utf-8') if CONTRACTS.is_file() else ''
flat = ''.join(text.lower().split())

require("functioncontractstorageget(key,fallback='')" in flat, 'contract reads must use a guarded storage helper')
require('try{constvalue=localstorage.getitem(key)' in flat and 'catch(_){returnfallback}' in flat, 'contract storage reads must tolerate unavailable localStorage')
require('functioncontractstorageset(key,value)' in flat and 'catch(_){returnfalse}' in flat, 'contract storage writes must tolerate quota/privacy failures')
require("activecontract=contractstorageget('jr_contract','standard')" in flat, 'active contract must load through the guarded storage helper')
require("contractstorageget('jr_contract_records','{}')" in flat, 'contract records must load through the guarded storage helper')
require("!contracts.some(c=>c.id===activecontract)" in flat and "activecontract='standard'" in flat, 'unknown saved contract ids must fall back to standard')
require("typeofparsed==='object'&&!array.isarray(parsed)" in flat, 'saved contract record payload must be validated before use')
require("b.setattribute('aria-pressed',c.id===activecontract?'true':'false')" in flat, 'contract selection state must remain exposed to assistive technology')
require("math.max(0,number(contractrecords[c.id])||0)+1" in flat, 'contract clear counters must recover from malformed saved values')

if errors:
    print('CONTRACT STORAGE QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('CONTRACT STORAGE QUALITY GATE: PASSED')
print('storage_read_guard=yes storage_write_guard=yes malformed_state_recovery=yes invalid_contract_fallback=yes aria_pressed=yes')
