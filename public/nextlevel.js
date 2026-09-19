(() => {

const SERVICES = [
  {name:"Website Design", price:499, cat:"WEB", icon:"🌐", desc:"Modern responsive business, portfolio and landing websites."},
  {name:"Resume / CV", price:149, cat:"DESIGN", icon:"📄", desc:"Professional ATS-friendly resume and CV design."},
  {name:"Poster Design", price:99, cat:"DESIGN", icon:"🎨", desc:"Professional posters for events, business and promotions."},
  {name:"Instagram Post", price:99, cat:"DESIGN", icon:"📸", desc:"Premium social media creatives and promotional posts."},
  {name:"Photo Editing", price:99, cat:"DESIGN", icon:"✨", desc:"Professional photo enhancement, retouching and editing."},
  {name:"Mobile Application", price:2999, cat:"TECH", icon:"📱", desc:"Custom mobile application development."},
  {name:"Practice File Written", price:299, cat:"ACADEMIC", icon:"📚", desc:"Clean and properly formatted practical files."},
  {name:"Notes Written", price:199, cat:"ACADEMIC", icon:"📝", desc:"Subject-wise handwritten/typed notes preparation."},
  {name:"Detention Work Written", price:10, cat:"ACADEMIC", icon:"✍️", desc:"Per-page academic writing work."},
  {name:"Other / Any Work", price:0, cat:"OTHER", icon:"⚡", desc:"Tell us your requirement and get a custom quotation."}
];

let cart = JSON.parse(localStorage.getItem("mayur_cart") || "[]");

function money(n){
  return n ? "₹"+n.toLocaleString("en-IN")+"+" : "Custom";
}

function toast(msg){
  let t=document.querySelector(".nx-toast");
  if(!t){
    t=document.createElement("div");
    t.className="nx-toast";
    document.body.appendChild(t);
  }
  t.textContent=msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200);
}

function saveCart(){
  localStorage.setItem("mayur_cart",JSON.stringify(cart));
  renderCart();
}

function addCart(service){
  if(cart.some(x=>x.name===service.name)){
    toast("Already added to your order");
    return;
  }
  cart.push(service);
  saveCart();
  toast(service.name+" added to order");
}

function removeCart(name){
  cart=cart.filter(x=>x.name!==name);
  saveCart();
}

function renderCart(){
  const box=document.querySelector(".nx-cart-items");
  const total=document.querySelector(".nx-cart-total");
  const count=document.querySelector(".nx-cart-count");
  if(!box)return;

  box.innerHTML="";

  if(!cart.length){
    box.innerHTML='<div style="padding:15px 0;color:#8f98aa">No services selected yet.</div>';
  }else{
    cart.forEach(x=>{
      const row=document.createElement("div");
      row.className="nx-cart-item";
      row.innerHTML=
        "<span>"+x.icon+" "+x.name+"</span>"+
        "<span>"+money(x.price)+
        ' <button data-remove="'+encodeURIComponent(x.name)+'" style="margin-left:5px;background:none;border:0;color:#ff6b8a;cursor:pointer">×</button></span>';
      box.appendChild(row);
    });
  }

  let totalPrice=cart.reduce((a,b)=>a+(b.price||0),0);
  total.textContent=totalPrice ? "₹"+totalPrice.toLocaleString("en-IN")+"+" : "Custom Quote";
  count.textContent=cart.length;
}

function goOrder(){
  if(!cart.length){
    toast("Select at least one service");
    return;
  }

  const names=cart.map(x=>x.name).join(", ");
  localStorage.setItem("mayur_selected_services",names);

  location.href="/order?service="+encodeURIComponent(names);
}

function buildNextLevel(){

  const anchor=document.querySelector("main") || document.body;

  const wrap=document.createElement("div");
  wrap.id="mayur-nextlevel";

  wrap.innerHTML=`
  <section class="nx-shell">

    <div class="nx-panel">
      <div style="font-size:11px;letter-spacing:.18em;color:#00d9ff;font-weight:900">
        MAYUR SERVICES • NEXT LEVEL
      </div>

      <h2 class="nx-title">Everything You Need. One Premium Place.</h2>

      <p class="nx-sub">
        Explore services, compare options, build your order and send your complete
        requirement directly to MAYUR SERVICES.
      </p>

      <div class="nx-grid" style="margin-top:25px">
        <div class="nx-stat">
          <b>10+</b><span>Professional Services</span>
        </div>
        <div class="nx-stat">
          <b>₹99+</b><span>Starting Price</span>
        </div>
        <div class="nx-stat">
          <b>24/7</b><span>Order Access</span>
        </div>
        <div class="nx-stat">
          <b>LIVE</b><span>Order Tracking</span>
        </div>
      </div>
    </div>

    <div style="margin-top:28px">
      <div class="nx-panel">

        <h2 style="margin-top:0">Find Your Service</h2>

        <div class="nx-tools">
          <input class="nx-input" id="nx-search"
                 placeholder="🔎 Search website, resume, poster, editing...">

          <button class="nx-filter active" data-cat="ALL">ALL</button>
          <button class="nx-filter" data-cat="WEB">WEB</button>
          <button class="nx-filter" data-cat="DESIGN">DESIGN</button>
          <button class="nx-filter" data-cat="TECH">TECH</button>
          <button class="nx-filter" data-cat="ACADEMIC">ACADEMIC</button>
          <button class="nx-filter" data-cat="OTHER">OTHER</button>
        </div>

        <div class="nx-services" id="nx-services"></div>

      </div>
    </div>

    <div class="nx-panel" style="margin-top:28px">
      <div style="font-size:11px;letter-spacing:.16em;color:#a78bfa;font-weight:900">
        SPECIAL DEALS
      </div>
      <h2>Premium Offers</h2>

      <div class="nx-offers">
        <div class="nx-offer">
          <strong>🔥 Combo Offer</strong>
          <span>Multiple creative services together.</span>
          <button class="nx-btn" onclick="window.nxOffer('Combo Offer')">Choose</button>
        </div>

        <div class="nx-offer">
          <strong>🎓 Student Pack</strong>
          <span>Academic work + notes + design.</span>
          <button class="nx-btn" onclick="window.nxOffer('Student Pack')">Choose</button>
        </div>

        <div class="nx-offer">
          <strong>📱 App Starter</strong>
          <span>Start your custom mobile app project.</span>
          <button class="nx-btn" onclick="window.nxOffer('App Starter')">Choose</button>
        </div>

        <div class="nx-offer">
          <strong>📦 Bulk Work</strong>
          <span>Large quantity? Get a custom quote.</span>
          <button class="nx-btn" onclick="window.nxOffer('Bulk Work')">Choose</button>
        </div>
      </div>
    </div>

    <div class="nx-panel" style="margin-top:28px">
      <h2>💰 Quick Price Estimator</h2>
      <p class="nx-sub">Choose a service and quantity to get an approximate starting price.</p>

      <div class="nx-calc">
        <div>
          <select id="nx-calc-service" class="nx-input"></select>

          <div style="margin-top:22px">
            <label style="color:#aab2c2;font-size:13px">
              Quantity: <b id="nx-qty-label">1</b>
            </label>
            <input id="nx-qty" class="nx-range" type="range" min="1" max="20" value="1">
          </div>
        </div>

        <div class="nx-estimate">
          <div>
            <small style="color:#9ca5b8">ESTIMATED STARTING PRICE</small>
            <b id="nx-estimate">₹499+</b>
            <small style="color:#9ca5b8">Final price depends on requirements</small>
          </div>
        </div>
      </div>
    </div>

    <div class="nx-panel" style="margin-top:28px">
      <h2>⚡ How It Works</h2>

      <div class="nx-grid">
        <div class="nx-stat"><b>01</b><span>Select service</span></div>
        <div class="nx-stat"><b>02</b><span>Build your order</span></div>
        <div class="nx-stat"><b>03</b><span>Send requirement</span></div>
        <div class="nx-stat"><b>04</b><span>Track delivery</span></div>
      </div>
    </div>

    <div class="nx-panel" style="margin-top:28px">
      <h2>❓ Frequently Asked Questions</h2>

      <div class="nx-faq">
        <button>How do I place an order? +</button>
        <div class="nx-answer">Select one or more services, add them to your order and press ORDER SELECTED.</div>
      </div>

      <div class="nx-faq">
        <button>How will I receive my order? +</button>
        <div class="nx-answer">The final delivery method is confirmed with you through WhatsApp based on your project.</div>
      </div>

      <div class="nx-faq">
        <button>Can I request custom work? +</button>
        <div class="nx-answer">Yes. Use Other / Any Work and describe exactly what you need.</div>
      </div>

      <div class="nx-faq">
        <button>Can I track my order? +</button>
        <div class="nx-answer">Yes. After placing an order you receive an Order ID that can be checked from the Track Order page.</div>
      </div>
    </div>

    <div class="nx-panel" style="margin-top:28px;text-align:center">
      <div style="font-size:11px;letter-spacing:.2em;color:#00d9ff;font-weight:900">
        READY TO START?
      </div>
      <h2 class="nx-title" style="font-size:34px">Turn Your Idea Into Reality.</h2>

      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="nx-btn" onclick="window.nxOrder()">🚀 ORDER NOW</button>
        <button class="nx-btn alt" onclick="location.href='/track'">⌁ TRACK ORDER</button>
        <button class="nx-btn alt" onclick="window.open('https://wa.me/919370155844','_blank')">💬 WHATSAPP</button>
      </div>
    </div>

  </section>

  <div class="nx-cart" id="nx-cart">
    <div class="nx-cart-head">
      <strong>🛒 Your Order</strong>
      <span><span class="nx-cart-count">0</span> services</span>
    </div>

    <div class="nx-cart-items"></div>

    <div class="nx-total">
      <span>Starting Total</span>
      <span class="nx-cart-total">Custom Quote</span>
    </div>

    <div style="display:flex;gap:8px">
      <button class="nx-btn" style="flex:1" onclick="window.nxOrder()">ORDER SELECTED</button>
      <button class="nx-btn alt" onclick="cart=[];localStorage.removeItem('mayur_cart');window.nxRenderCart()">CLEAR</button>
    </div>
  </div>

  <div class="nx-fab" onclick="document.getElementById('nx-cart').classList.toggle('show')">🛒</div>
  `;

  anchor.appendChild(wrap);

  const serviceBox=document.getElementById("nx-services");

  function renderServices(){

    const q=(document.getElementById("nx-search").value||"").toLowerCase();
    const active=document.querySelector(".nx-filter.active")?.dataset.cat || "ALL";

    serviceBox.innerHTML="";

    SERVICES
      .filter(s=>active==="ALL" || s.cat===active)
      .filter(s=>
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q)
      )
      .forEach(s=>{

        const card=document.createElement("div");
        card.className="nx-service";

        card.innerHTML=`
          <div class="nx-icon">${s.icon}</div>
          <h3>${s.name}</h3>
          <p>${s.desc}</p>
          <div class="nx-price">${money(s.price)}</div>
          <div class="nx-actions">
            <button class="nx-btn" data-add="${s.name}">＋ ADD</button>
            <button class="nx-btn alt" data-order="${s.name}">ORDER ↗</button>
          </div>
        `;

        serviceBox.appendChild(card);
      });
  }

  document.querySelectorAll(".nx-filter").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".nx-filter").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      renderServices();
    });
  });

  document.getElementById("nx-search").addEventListener("input",renderServices);

  serviceBox.addEventListener("click",e=>{

    const add=e.target.closest("[data-add]");
    const order=e.target.closest("[data-order]");

    if(add){
      const s=SERVICES.find(x=>x.name===add.dataset.add);
      if(s)addCart(s);
    }

    if(order){
      const s=SERVICES.find(x=>x.name===order.dataset.order);
      if(s){
        localStorage.setItem("mayur_selected_services",s.name);
        location.href="/order?service="+encodeURIComponent(s.name);
      }
    }
  });

  const calc=document.getElementById("nx-calc-service");

  SERVICES.forEach(s=>{
    const o=document.createElement("option");
    o.value=s.name;
    o.textContent=s.name+" — "+money(s.price);
    calc.appendChild(o);
  });

  function calculate(){
    const s=SERVICES.find(x=>x.name===calc.value);
    const qty=Number(document.getElementById("nx-qty").value||1);

    document.getElementById("nx-qty-label").textContent=qty;

    const total=(s?.price||0)*qty;

    document.getElementById("nx-estimate").textContent=
      total ? "₹"+total.toLocaleString("en-IN")+"+" : "Custom";
  }

  calc.addEventListener("change",calculate);
  document.getElementById("nx-qty").addEventListener("input",calculate);

  document.querySelectorAll(".nx-faq button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      btn.nextElementSibling.classList.toggle("open");
    });
  });

  renderServices();
  calculate();
  renderCart();
}

window.nxOffer=function(name){
  localStorage.setItem("mayur_selected_services",name);
  location.href="/order?service="+encodeURIComponent(name);
};

window.nxOrder=goOrder;
window.nxRenderCart=renderCart;

document.addEventListener("click",e=>{
  const btn=e.target.closest("[data-remove]");
  if(btn)removeCart(decodeURIComponent(btn.dataset.remove));
});

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",buildNextLevel);
}else{
  buildNextLevel();
}

})();
