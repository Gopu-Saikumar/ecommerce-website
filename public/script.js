const API = "http://localhost:3000";

async function loadProducts() {
  try {
    const res = await fetch(`${API}/products`);
    const products = await res.json();

    const list = document.getElementById("product-list");
    list.innerHTML = "";

    products.forEach(p => {
      list.innerHTML += `
        <article class="product-card">
          <div class="product-image">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </div>
          <div class="product-meta">
            <h3>${p.name}</h3>
            <p class="desc">${p.description || ''}</p>
            <div class="row price-row">
              <div class="price">₹${p.price}</div>
            </div>
            <div class="actions">
              <button class="btn btn-primary add-to-cart" data-id="${p.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `;
    });

    // attach click handlers to the newly rendered buttons (avoids inline onclick issues)
    list.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const card = e.currentTarget.closest('.product-card');
        const name = card ? (card.querySelector('.product-meta h3') || {}).innerText : undefined;
        console.log('Add-to-cart clicked:', { id, name });
        addToCart(id);
      });
    });
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// ADD TO CART 
async function addToCart(id) {
  const payload = { id: Number(id) };
  console.log('Sending add-to-cart payload:', payload);
  try {
    const res = await fetch(`${API}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Add to cart failed:', err);
      alert(err.message || 'Could not add to cart');
      return;
    }

    loadCart();
  } catch (err) {
    console.error('Network error adding to cart', err);
    alert('Network error adding to cart');
  }
} 

// LOAD CART 
async function loadCart() {
  const res = await fetch(`${API}/cart`);
  const cart = await res.json();

  const cartDiv = document.getElementById("cart-items");
  cartDiv.innerHTML = "";

  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Cart is empty</p>";
    return;
  }

  cart.forEach((item, index) => {
    cartDiv.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" class="cart-thumb" alt="${item.name}">
        <div class="cart-meta">
          <div class="cart-name">${item.name}</div>
          <div class="cart-price">₹${item.price}</div>
        </div>
        <button onclick="removeItem(${index})" class="btn btn-outline">Remove</button>
      </div>
    `;
  });
}

// REMOVE ITEM 
async function removeItem(index) {
  await fetch(`${API}/cart/${index}`, { method: "DELETE" });
  loadCart();
}

//INITIAL LOAD 
loadProducts();
loadCart();
