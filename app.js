// ROUGH — loja virtual (HTML + CSS + JS puro). Carrinho salvo no localStorage.
const PRODUTOS = [
 {id:1,nome:'Camiseta Oversized Concrete',cat:'Roupas',preco:129.9,ic:'👕',img:'img/camiseta.jpg',desc:'Camiseta preta oversized 100% algodão, estampa nas costas.'},
 {id:2,nome:'Moletom Street Rules',cat:'Roupas',preco:249.9,ic:'🧥',img:'img/moletom.jpg',desc:'Moletom pesado com capuz, perfeito para o rolê de inverno.'},
 {id:3,nome:'Shape Rough Pro 8.0',cat:'Skates',preco:299.9,ic:'🛹',img:'img/shape.jpg',desc:'Shape de maple canadense, 7 camadas, concave médio.'},
 {id:4,nome:'Kit Rodas Street 52mm',cat:'Skates',preco:189.9,ic:'⚙️',img:'img/rodas.jpg',desc:'Jogo com 4 rodas 52mm 99A, ideal para street e pista.'},
 {id:5,nome:'Tênis Rough Low Black',cat:'Tênis',preco:399.9,ic:'👟',img:'img/tenis-low.jpg',desc:'Tênis de cano baixo em lona reforçada, sola vulcanizada.'},
 {id:6,nome:'Tênis Rough Mid',cat:'Tênis',preco:449.9,ic:'👟',img:'img/tenis-mid.jpg',desc:'Cano médio, cabedal em couro e proteção extra no tornozelo.'},
 {id:7,nome:'Boné Rough Dad Hat',cat:'Acessórios',preco:89.9,ic:'🧢',img:'img/bone.jpg',desc:'Boné preto aba curva com logo bordado.'},
 {id:8,nome:'Meias Rough (Pack 3)',cat:'Acessórios',preco:49.9,ic:'🧦',img:'img/meias.jpg',desc:'Três pares de meia cano alto, algodão penteado.'}
];
const CATS = ['Skates','Roupas','Tênis','Acessórios'];
const $ = s => document.querySelector(s), app = $('#app');
const fmt = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
let cupom = 0; // desconto (ex.: 0.1 = 10%)

// ---------- carrinho ----------
const getCart = () => { try { return JSON.parse(localStorage.getItem('rough_cart')) || {}; } catch { return {}; } };
const saveCart = c => { try { localStorage.setItem('rough_cart', JSON.stringify(c)); } catch {} $('#count').textContent = Object.values(c).reduce((a,b)=>a+b,0); };
function add(id,q=1){ const c=getCart(); c[id]=(c[id]||0)+q; saveCart(c); toast('Adicionado à sacola ✓'); }
function setQty(id,q){ const c=getCart(); if(q<1) delete c[id]; else c[id]=q; saveCart(c); route(); }
function itens(){ const c=getCart(); return Object.keys(c).map(id=>({p:PRODUTOS.find(x=>x.id==id),q:c[id]})).filter(i=>i.p); }
function totais(){ const sub=itens().reduce((s,i)=>s+i.p.preco*i.q,0); const desc=sub*cupom; return {sub,desc,total:sub-desc}; }
function toast(m){ const t=document.createElement('div'); t.className='toast'; t.textContent=m; document.body.append(t); setTimeout(()=>t.remove(),1500); }

// ---------- componentes ----------
const imgHtml = p => `<div class="im"><span>${p.ic}</span><img src="${p.img}" alt="${p.nome}" onerror="this.remove()"></div>`;
const card = p => `<div class="card"><a href="#/produto/${p.id}">${imgHtml(p)}<h3>${p.nome}</h3></a><span>${p.cat}</span><b>${fmt(p.preco)}</b><button class="btn" data-add="${p.id}">Adicionar</button></div>`;

// ---------- páginas ----------
function home(){
 app.innerHTML = `<section class="hero"><div><h1>A rua é nossa.<br>O estilo é seu.</h1><p>Skate, roupas, tênis e acessórios feitos para quem vive o concreto.</p><a class="btn" href="#/produtos">Ver coleção</a></div><div class="pic">🛹</div></section>
 <h2>Categorias</h2><div class="grid">${CATS.map(c=>`<a class="cat" href="#/produtos?cat=${c}">${c}</a>`).join('')}</div>
 <h2>Novo drop</h2><div class="grid">${PRODUTOS.slice(0,4).map(card).join('')}</div>`;
}
function produtos(q){
 const cat = new URLSearchParams(q).get('cat') || '';
 app.innerHTML = `<h1>${cat||'Todos os produtos'}</h1><div class="bar" style="margin-top:16px"><input id="busca" placeholder="Buscar produto..."><select id="fcat"><option value="">Todas categorias</option>${CATS.map(c=>`<option ${c==cat?'selected':''}>${c}</option>`).join('')}</select><select id="fpreco"><option value="9999">Qualquer preço</option><option value="100">Até R$ 100</option><option value="250">Até R$ 250</option><option value="400">Até R$ 400</option></select></div><div class="grid" id="lista"></div>`;
 const filtra = () => { const t=$('#busca').value.toLowerCase(), c=$('#fcat').value, m=+$('#fpreco').value;
  const l=PRODUTOS.filter(p=>p.nome.toLowerCase().includes(t)&&(!c||p.cat==c)&&p.preco<=m);
  $('#lista').innerHTML = l.length ? l.map(card).join('') : '<p class="vazio">Nenhum produto encontrado.</p>'; };
 ['#busca','#fcat','#fpreco'].forEach(s=>$(s).addEventListener('input',filtra)); filtra();
}
function produto(id){
 const p = PRODUTOS.find(x=>x.id==id); if(!p) return app.innerHTML='<p class="vazio">Produto não encontrado.</p>';
 app.innerHTML = `<p><a href="#/produtos">← Voltar</a></p><div class="det" style="margin-top:16px">${imgHtml(p)}<div><span>${p.cat}</span><h1>${p.nome}</h1><div class="price">${fmt(p.preco)}</div><p>${p.desc}</p><p>ou 6x de ${fmt(p.preco/6)} sem juros</p><label>Quantidade</label><input type="number" id="q" value="1" min="1" style="width:90px;margin-bottom:14px"><br><button class="btn" id="addd">Adicionar à sacola</button></div></div>`;
 $('#addd').onclick = () => add(p.id, Math.max(1,+$('#q').value||1));
}
function carrinho(){
 const l = itens();
 if(!l.length) return app.innerHTML = '<h1>Sua sacola</h1><p class="vazio">Sua sacola está vazia. <a href="#/produtos"><u>Ver produtos</u></a></p>';
 const t = totais();
 app.innerHTML = `<h1>Sua sacola (${l.length})</h1><div style="margin-top:16px">${l.map(i=>`<div class="row">${imgHtml(i.p)}<div><b>${i.p.nome}</b><br>${fmt(i.p.preco)}</div><div class="qty"><button data-m="${i.p.id}">−</button>${i.q}<button data-p="${i.p.id}">+</button></div><div><b>${fmt(i.p.preco*i.q)}</b> <button class="rm" data-r="${i.p.id}">Remover</button></div></div>`).join('')}</div>
 <div class="box"><div class="bar"><input id="cup" placeholder="Cupom (use ROUGH10)"><button class="btn out" id="apl">Aplicar</button></div><div class="l"><span>Subtotal</span><span>${fmt(t.sub)}</span></div><div class="l"><span>Desconto</span><span>− ${fmt(t.desc)}</span></div><div class="l tot"><span>Total</span><span>${fmt(t.total)}</span></div><a class="btn" href="#/checkout">Finalizar compra</a></div>`;
 app.onclick = null;
 $('#apl').onclick = () => { if($('#cup').value.trim().toUpperCase()=='ROUGH10'){cupom=.1;toast('Cupom aplicado!');carrinho();} else toast('Cupom inválido'); };
 app.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>setQty(b.dataset.m,getCart()[b.dataset.m]-1));
 app.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>setQty(b.dataset.p,getCart()[b.dataset.p]+1));
 app.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>setQty(b.dataset.r,0));
}
function checkout(){
 if(!itens().length) return location.hash='#/carrinho';
 const t = totais();
 const parc = [1,2,3,4,5,6].map(n=>`<option value="${n}">${n}x de ${fmt(t.total/n)} sem juros</option>`).join('');
 app.innerHTML = `<h1>Finalizar compra</h1><form id="f" style="margin-top:16px"><h2>Seus dados</h2>
 <div><label>Nome completo</label><input name="nome" required minlength="3"></div><div><label>E-mail</label><input name="email" type="email" required></div>
 <div><label>CPF</label><input name="cpf" required pattern="[0-9.\\-]{11,14}" placeholder="000.000.000-00"></div><div><label>Telefone</label><input name="tel" required pattern="[0-9() \\-]{10,15}"></div>
 <div><label>CEP</label><input name="cep" required pattern="[0-9\\-]{8,9}"></div><div><label>Endereço e número</label><input name="end" required></div>
 <h2>Pagamento</h2><div class="pays"><label><input type="radio" name="pg" value="credito" checked>Cartão de crédito</label><label><input type="radio" name="pg" value="debito">Cartão de débito</label><label><input type="radio" name="pg" value="pix">PIX</label></div>
 <div id="card" class="full" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="full"><label>Número do cartão (fictício)</label><input name="num" pattern="[0-9 ]{16,19}" placeholder="0000 0000 0000 0000"></div><div><label>Nome no cartão</label><input name="cn"></div><div><label>Validade</label><input name="val" pattern="[0-9]{2}/[0-9]{2}" placeholder="MM/AA"></div><div><label>CVV</label><input name="cvv" pattern="[0-9]{3,4}"></div><div id="parc"><label>Parcelamento</label><select name="parc">${parc}</select></div></div>
 <div id="pix" class="full pix box" style="display:none"><b>Pague com PIX</b><div class="qr"></div><code>00020126580014BR.GOV.BCB.PIX0136rough-loja-ficticia-0001520400005303986540${t.total.toFixed(2)}5904ROUGH6009SAO PAULO</code><p>QR Code simulado — nenhum pagamento real.</p></div>
 <div class="full box"><div class="l tot"><span>Total</span><span>${fmt(t.total)}</span></div><button class="btn" type="submit">Confirmar pedido</button></div></form>`;
 const setPay = () => { const v=$('input[name=pg]:checked').value, c=v!='pix';
  $('#card').style.display=c?'grid':'none'; $('#pix').style.display=c?'none':'block'; $('#parc').style.display=v=='credito'?'block':'none';
  ['num','cn','val','cvv'].forEach(n=>$(`[name=${n}]`).required=c); };
 document.querySelectorAll('input[name=pg]').forEach(r=>r.onchange=setPay); setPay();
 $('#f').onsubmit = e => { e.preventDefault(); const n='RGH'+Date.now().toString().slice(-6);
  const d=Object.fromEntries(new FormData(e.target)); const ped={n,total:t.total,pg:d.pg,parc:d.pg=='credito'?d.parc:1,itens:itens().map(i=>({nome:i.p.nome,q:i.q}))};
  try{const h=JSON.parse(localStorage.getItem('rough_pedidos')||'[]');h.push(ped);localStorage.setItem('rough_pedidos',JSON.stringify(h));localStorage.setItem('rough_ultimo',JSON.stringify(ped));}catch{}
  saveCart({}); cupom=0; location.hash='#/sucesso'; };
}
function sucesso(){
 let p; try{p=JSON.parse(localStorage.getItem('rough_ultimo'));}catch{} if(!p) return location.hash='#/';
 const forma={credito:`Cartão de crédito em ${p.parc}x`,debito:'Cartão de débito',pix:'PIX'}[p.pg];
 app.innerHTML = `<div class="ok"><div class="tick">✓</div><h1>Tá na mão.<br>Agora é só o rolê.</h1><p class="vazio">Pedido <b>${p.n}</b> confirmado — ${fmt(p.total)} via ${forma}.</p><a class="btn" href="#/produtos">Continuar comprando</a></div>`;
}

// ---------- rotas ----------
function route(){
 const [path,q] = (location.hash.slice(1)||'/').split('?'), [,pg,arg] = path.split('/');
 ({'':home,produtos:()=>produtos(q),produto:()=>produto(arg),carrinho,checkout,sucesso}[pg||''] || home)();
 $('#menu').classList.remove('open'); window.scrollTo(0,0);
}
document.addEventListener('click',e=>{ const b=e.target.closest('[data-add]'); if(b) add(b.dataset.add); });
$('#burger').onclick = () => $('#menu').classList.toggle('open');
window.addEventListener('hashchange',route);
saveCart(getCart()); route();
