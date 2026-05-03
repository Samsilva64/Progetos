// --- Simple local app: dishes, orders saved to localStorage ---
const STORAGE_KEY = 'larosa_data_v1';
let state = {dishes:[], orders:[]};
const ADMIN_PASS = 'larosa123'; // muda depois para produção

function loadState(){
  try{const raw = localStorage.getItem(STORAGE_KEY); if(raw) state = JSON.parse(raw);}catch(e){console.error(e)}
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function renderMenu(){
  const menu = document.getElementById('menu'); menu.innerHTML='';
  const select = document.getElementById('prato'); select.innerHTML='';
  if(state.dishes.length===0){ menu.innerHTML='<div class="card">Nenhum prato adicionado. Pede ao dono para entrar no painel.</div>'; return }
  state.dishes.forEach((d,idx)=>{
    const div = document.createElement('div'); div.className='card';
    div.innerHTML = `<h3>${d.name}</h3><p>${d.desc||''}</p>${d.img?`<img class="dish" src="${d.img}" alt="${d.name}"/>`:''}<p class="price">${Number(d.price).toLocaleString()} XOF</p>`;
    menu.appendChild(div);
    const opt = document.createElement('option'); opt.text=d.name; opt.value=d.name; select.add(opt);
  })
}

function placeOrder(){
  const nome=document.getElementById('nome').value.trim();
  const tel=document.getElementById('tel').value.trim();
  const end=document.getElementById('end').value.trim();
  const prato=document.getElementById('prato').value;
  const qtd=document.getElementById('qtd').value;
  if(!nome||!tel||!end||!prato) return alert('Preenche todos os campos');
  const order={id:Date.now(),nome,tel,end,prato,qtd,when:new Date().toISOString()};
  state.orders.unshift(order); saveState(); renderOrders();
  const msg = encodeURIComponent(`NOVO PEDIDO - Restaurante La Rosa\n\nNome: ${nome}\nTelefone: ${tel}\nEndereço: ${end}\nPrato: ${prato}\nQuantidade: ${qtd}`);
  // open WhatsApp web/phone
  const wa = `https://wa.me/${tel.replace(/\D/g,'')}?text=${msg}`;
  window.open(wa,'_blank');
}

function saveDraft(){
  const nome=document.getElementById('nome').value.trim();
  const tel=document.getElementById('tel').value.trim();
  const draft={nome,tel,end:document.getElementById('end').value,prato:document.getElementById('prato').value,qtd:document.getElementById('qtd').value};
  localStorage.setItem('larosa_draft',JSON.stringify(draft)); alert('Rascunho salvo localmente.');
}

function renderOrders(){
  const box = document.getElementById('ordersList'); box.innerHTML='';
  if(state.orders.length===0) box.innerHTML='<div class="small">Nenhum pedido local.</div>';
  state.orders.forEach(o=>{
    const d = document.createElement('div'); d.className='card'; d.style.marginTop='8px';
    d.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center">`+
                `<div><strong>${o.nome}</strong><div class="small">${o.prato} x ${o.qtd}</div><div class="small">${o.end}</div></div>`+
                `<div><button class="btn-ghost" onclick="removeOrder(${o.id})">Remover</button></div>`+
                `</div>`;
    box.appendChild(d);
  })
}

function removeOrder(id){ state.orders = state.orders.filter(o=>o.id!==id); saveState(); renderOrders(); }

// Admin functions
function showLogin(){ document.getElementById('loginBox').style.display='block'; }
function login(){ const p=document.getElementById('adminPass').value; if(p===ADMIN_PASS){ document.getElementById('adminArea').style.display='block'; document.getElementById('loginBox').style.display='none'; document.getElementById('loginBtn').style.display='none'; renderManage(); } else alert('Password incorreta'); }
function logout(){ document.getElementById('adminArea').style.display='none'; document.getElementById('loginBox').style.display='none'; document.getElementById('loginBtn').style.display='inline-block'; }

function renderManage(){ const el=document.getElementById('manageList'); el.innerHTML=''; if(state.dishes.length===0) el.innerHTML='<div class="small">Sem pratos</div>';
  state.dishes.forEach((d,i)=>{
    const item = document.createElement('div'); item.className='card'; item.style.marginTop='8px';
    item.innerHTML = `<div style="display:flex;gap:10px;align-items:center">${d.img?`<img src="${d.img}" style="width:80px;height:60px;object-fit:cover;border-radius:6px"/>`:''}`+
                     `<div style="flex:1"><strong>${d.name}</strong><div class="small">${d.desc||''}</div><div class="small">${d.price} XOF</div></div>`+
                     `<div style="display:flex;flex-direction:column;gap:6px"><button onclick="editDish(${i})">Editar</button><button class="btn-ghost" onclick="deleteDish(${i})">Apagar</button></div></div>`;
    el.appendChild(item);
  })
}

function addOrUpdateDish(){ const name=document.getElementById('mName').value.trim(); if(!name) return alert('Nome é obrigatório'); const desc=document.getElementById('mDesc').value; const price=document.getElementById('mPrice').value||0; const file=document.getElementById('mImg').files[0];
  const reader = new FileReader();
  reader.onload = ()=>{
    const img = reader.result || null;
    const existingIndex = state._editingIndex;
    const dish = {name,desc,price,img};
    if(existingIndex!=null){ state.dishes[existingIndex]=dish; delete state._editingIndex; }
    else state.dishes.push(dish);
    saveState(); clearForm(); renderManage(); renderMenu();
  }
  if(file) reader.readAsDataURL(file); else { const img=null; const existingIndex=state._editingIndex; const dish={name,desc,price,img}; if(existingIndex!=null){ state.dishes[existingIndex]=dish; delete state._editingIndex; } else state.dishes.push(dish); saveState(); clearForm(); renderManage(); renderMenu(); }
}

function clearForm(){ 
document.getElementById('mName').value=''; document.getElementById('mDesc').value=''; document.getElementById('mPrice').value=''; document.getElementById('mImg').value=''; delete state._editingIndex; 
}

function editDish(i){ 
const d=state.dishes[i]; document.getElementById('mName').value=d.name; document.getElementById('mDesc').value=d.desc||''; document.getElementById('mPrice').value=d.price||''; state._editingIndex = i;
}

function deleteDish(i){ 
if(!confirm('Apagar este prato?')) return; state.dishes.splice(i,1); saveState(); renderManage(); renderMenu(); 
}

// Import / Export
function exportData(){ 
const data=JSON.stringify(state,null,2); const blob = new Blob([data],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='larosa_data.json'; a.click(); URL.revokeObjectURL(url); 
}

function importPrompt(){ 
const inp = document.createElement('input');
inp.type='file'; 
inp.accept='application/json'; 
inp.onchange = e => { const f=e.target.files[0]; const r=new FileReader(); r.onload= ev => { try{ const imported=JSON.parse(ev.target.result); if(imported.dishes) state=imported; 
saveState(); renderMenu(); renderManage(); renderOrders(); 
alert('Importado com sucesso'); 
} 
catch(err){alert('Ficheiro inválido')} }; r.readAsText(f); }; inp.click(); 
}

// Init
loadState(); renderMenu(); renderOrders();
