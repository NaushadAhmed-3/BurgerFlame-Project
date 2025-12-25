// Simple JavaScript for Burger Flame Website

let cart = JSON.parse(sessionStorage.getItem('userCart')) || [];
let cartTotal = 0;

// Save Cart Function
function saveCart() {
    sessionStorage.setItem('userCart', JSON.stringify(cart));
}

// Start countdown timer
function startTimer() {
    let hours = 2;
    let minutes = 30;
    let seconds = 45;
    
    const timer = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    clearInterval(timer);
                    document.querySelector('.discount-box h3').textContent = 'OFFER EXPIRED';
                    return;
                }
            }
        }
        // Update display
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Flip card function
function flipCard(card) {
    card.parentElement.querySelector('.flip-card').classList.toggle('flipped');
}

// Filter menu items
function filterCategory(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (typeof event !== 'undefined' && event.type === 'click') {
        event.target.classList.add('active');
    } else {
        const autoBtn = document.querySelector(`button[onclick="filterCategory('${category}')"]`);
        if (autoBtn) {
            autoBtn.classList.add('active');
        }
    }

    document.querySelectorAll('.menu-item').forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add item to cart
function addToCart(itemName, price) {
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === itemName) {
            cart[i].quantity++;
            found = true;
            break;
        }
    }
    
    if (!found) {
        cart.push({
            name: itemName,
            price: price,
            quantity: 1
        });
    }
    
    saveCart(); // Save changes
    updateCart();
    alert(`${itemName} added to cart!`);
}

// Update cart display
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.getElementById('cartCount');
    const totalPrice = document.getElementById('totalPrice');
    
    // SAFETY CHECK: If these elements don't exist on this page, stop here.
    if (!cartItems || !cartCount || !totalPrice) {
        return; 
    }
    
    // Clear current items
    cartItems.innerHTML = '';
    cartTotal = 0;
    
    // If cart is empty
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartCount.textContent = '0';
        totalPrice.textContent = 'Rs.0';
        return;
    }
    
    // Add each item
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        itemElement.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>Rs.${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="event.stopPropagation(); updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="event.stopPropagation(); updateQuantity(${index}, 1)">+</button>
                <button onclick="event.stopPropagation(); removeFromCart(${index})">×</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
        
        cartTotal += item.price * item.quantity;
    });
    
    // Update totals
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    totalPrice.textContent = `Rs.${cartTotal.toFixed(2)}`;
}
// Update item quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart(); // Save changes
    updateCart();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart(); // Save changes
    updateCart();
    alert('Item removed from cart');
}

// Show/Hide Cart
function showCart() {
    document.querySelector('.cart-sidebar').classList.add('show');
}
function hideCart() {
    document.querySelector('.cart-sidebar').classList.remove('show');
}

// 2. CHANGE: Clean Checkout Function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Save to Session Storage
    saveCart();
    
    // Redirect to the Order Details page
    window.location.href = 'Details For Order.html';
}

// Order now
function orderNow() {
    showCart();
}
// Send message form
function sendMessage(event) {

    event.preventDefault();

    const name = event.target.querySelector('input[type="text"]').value;

    alert(`Thank you ${name}! Your message has been sent.`);

    event.target.reset();

}

//  Add Fries to Cart 
function addFriesToCart() {
    const selector = document.getElementById('friesSize');
    const selectedOption = selector.options[selector.selectedIndex];
    addToCart(`French Fries (${selector.value})`, parseFloat(selectedOption.getAttribute('data-price')));
}
// Add Animal Fries to Cart
function addAnimalFriesToCart() {
    const selection = document.getElementById('AnimalfriesSize');
    const selectedOptions = selection.options[selection.selectedIndex];
    addToCart(`Animal Loaded Fries (${selection.value})`, parseFloat(selectedOptions.getAttribute('data-price')));
}
// Add Drinks to Cart
function addCustomDrinkToCart() {
    const flavor = document.getElementById('drinkFlavor').value;
    const sizeSelector = document.getElementById('drinkSize');
    const size = sizeSelector.value;
    const price = parseFloat(sizeSelector.options[sizeSelector.selectedIndex].getAttribute('data-price'));
    addToCart(`Soft Drink (${flavor}, ${size})`, price);
}

// Window when thw Website opens
window.onload = function() {
    // Only run timer if elements exist
    if(document.getElementById('hours')) {
        startTimer();
    }
    
    // Load the cart visual
    updateCart();

    // Navbar Logic
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({ top: targetSection.offsetTop - 80, behavior: 'smooth' });
                }
            }
        });
    });
    
    // Close cart logic
    document.addEventListener('click', function(e) {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartBtn = document.querySelector('.order-btn');
        if (cartSidebar && cartBtn) {
            if (cartSidebar.classList.contains('show') && 
                !cartSidebar.contains(e.target) && 
                !cartBtn.contains(e.target)) {
                hideCart();
            }
        }
    });
    // this opens deals section at first when Menu Button is Clicked
    filterCategory('deals');
};