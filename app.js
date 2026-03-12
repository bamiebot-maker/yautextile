// Product Data
const products = [
    {
        id: 1,
        name: "Emerald Serenity Silk",
        category: "Luxury Silk",
        price: 85.00,
        image: "luxury_silk_fabric_1772187339580.png",
        description: "Pure mulberry silk with a liquid-like drape and brilliant emerald lustre."
    },
    {
        id: 2,
        name: "Imperial Charcoal Brocade",
        category: "Vintage Brocade",
        price: 120.00,
        image: "gold_brocade_fabric_1772187478539.png",
        description: "Intricately woven gold thread on deep charcoal, perfect for statement pieces."
    },
    {
        id: 3,
        name: "Artisan Ivory Linen",
        category: "Fine Linen",
        price: 45.00,
        image: "linen_textured_fabric_1772187603735.png",
        description: "High-grade natural linen with a refined texture and breathable weave."
    }
];

// App State
let cart = [];
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const filterBtns = document.querySelectorAll('#filter-btns .btn');
const searchInput = document.getElementById('product-search');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

// Initialization
function init() {
    renderProducts();
    setupEventListeners();
}

// Render Products to UI
function renderProducts() {
    const filteredProducts = products.filter(p => {
        const matchesFilter = currentFilter === 'all' || p.category === currentFilter;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 5rem 0;">
                <p style="color: hsl(var(--text-muted)); font-size: 1.2rem;">No fabrics found matching your criteria.</p>
                <button onclick="resetFilters()" class="btn btn-outline" style="margin-top: 2rem;">Reset Filters</button>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card reveal" style="background: hsl(var(--bg-card)); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-soft); transition: var(--transition);">
            <div style="height: 400px; overflow: hidden; position: relative;" class="img-container">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; transition: var(--transition);">
                <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.7)); opacity: 0; transition: var(--transition);" class="overlay">
                     <button onclick="addToCart(${product.id})" class="btn btn-primary" style="width: 100%;">Add to Cart</button>
                </div>
            </div>
            <div style="padding: 1.5rem;">
                <p style="font-size: 0.75rem; color: hsl(var(--primary-dark)); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">${product.category}</p>
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                    <h3 class="serif" style="font-size: 1.4rem;">${product.name}</h3>
                    <span style="font-weight: 700; color: hsl(var(--text-main));">$${product.price.toFixed(2)} / yd</span>
                </div>
                <p style="font-size: 0.9rem; color: hsl(var(--text-muted));">${product.description}</p>
            </div>
        </div>
    `).join('');

    // Add card styles dynamically for hover effects
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = 'var(--shadow-strong)';
            card.querySelector('.overlay').style.opacity = '1';
            card.querySelector('img').style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-soft)';
            card.querySelector('.overlay').style.opacity = '0';
            card.querySelector('img').style.transform = 'scale(1)';
        });
    });
}

// Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart();
}

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update list
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align: center; color: hsl(var(--text-muted)); margin-top: 5rem;">Your gallery is currently empty.</p>`;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div style="display: flex; gap: 1rem; margin-bottom: 2rem; align-items: center;">
                <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: var(--radius-sm);">
                <div style="flex-grow: 1;">
                    <h4 class="serif" style="font-size: 1rem;">${item.name}</h4>
                    <p style="font-size: 0.8rem; color: hsl(var(--text-muted));">${item.quantity} yd x $${item.price.toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background: none; border: none; cursor: pointer; color: #cc0000; font-size: 1.2rem;">&times;</button>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function openCart() {
    cartDrawer.style.right = '0';
}

function closeCartDrawer() {
    cartDrawer.style.right = '-450px';
}

function handleCheckout() {
    if (cart.length === 0) {
        alert("Your selection is empty. Please add some fabrics first.");
        return;
    }

    const phoneNumber = "2348137761978"; // Nigeria country code 234 + number
    const userName = "YUSKING";

    let messageText = `Hello ${userName}!\n\nI would like to place an order for the following fabrics:\n\n`;

    cart.forEach(item => {
        messageText += `• ${item.name} (${item.quantity} yds) - $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    messageText += `\n*Total Order Value: $${total.toFixed(2)}*\n\nPlease let me know the next steps for payment and delivery!`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
}

function resetFilters() {
    currentFilter = 'all';
    searchQuery = '';
    searchInput.value = '';
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === 'all') btn.classList.add('active');
    });
    renderProducts();
}

// Event Listeners
function setupEventListeners() {
    cartBtn.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartDrawer);
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);

    // Mobile Menu Toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Filter Listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderProducts();
        });
    });

    // Search Listener
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProducts();
    });

    // Close cart if clicking outside
    document.addEventListener('click', (e) => {
        if (!cartDrawer.contains(e.target) && !cartBtn.contains(e.target) && cartDrawer.style.right === '0px') {
            closeCartDrawer();
        }
    });
}

// Initialize
init();
