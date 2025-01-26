// Testimonios de ejemplo
const testimonios = [
  {
    nombre: "Laura García",
    edad: 16,
    texto: "¡Una experiencia increíble en Vanuatu! Mejoré mi inglés mientras exploraba un paraíso tropical.",
    rating: 5
  },
  {
    nombre: "Carlos Martínez",
    edad: 15,
    texto: "El snorkel en los arrecifes y las excursiones al volcán fueron inolvidables. ¡Los monitores son geniales!",
    rating: 5
  },
  {
    nombre: "Ana Rodríguez",
    edad: 17,
    texto: "Hacer amigos de todo el mundo mientras aprendíamos sobre la cultura de Vanuatu fue increíble.",
    rating: 4
  }
];

// Cargar testimonios
function cargarTestimonios() {
  const carousel = document.querySelector('.testimonios-carousel');
  if (carousel) {
    testimonios.forEach(testimonio => {
      const card = document.createElement('div');
      card.className = 'testimonio-card';
      card.innerHTML = `
        <h3>${testimonio.nombre}</h3>
        <p>${testimonio.edad} años</p>
        <p>"${testimonio.texto}"</p>
        <div class="rating">
          ${'★'.repeat(testimonio.rating)}${'☆'.repeat(5-testimonio.rating)}
        </div>
      `;
      carousel.appendChild(card);
    });
  }
}

// Manejo de modales
function openModal(type) {
  const modal = document.getElementById(`${type}Modal`);
  if (modal) {
    modal.style.display = "block";
  }
}

function closeModal(type) {
  const modal = document.getElementById(`${type}Modal`);
  if (modal) {
    modal.style.display = "none";
  }
}

function openInfoModal() {
  const modal = document.getElementById('infoModal');
  if (modal) {
    modal.style.display = "block";
  }
}

// User management
let currentUser = null;
const users = new Map();

function registerUser(name, email, password) {
  if (users.has(email)) {
    showNotification(
      'Error de Registro ',
      'Este email ya está registrado',
      'error'
    );
    throw new Error('Email already registered');
  }
  
  users.set(email, { name, password });
  showNotification(
    '¡Registro Exitoso! ',
    '¡Bienvenido a Golden Oak Camp!'
  );
  return true;
}

function loginUser(email, password) {
  const user = users.get(email);
  if (!user || user.password !== password) {
    showNotification(
      'Error de Acceso ',
      'Email o contraseña incorrectos',
      'error'
    );
    throw new Error('Invalid credentials');
  }
  
  currentUser = { email, name: user.name };
  
  // Add authenticated class to body
  document.body.classList.add('authenticated');
  
  // Show welcome overlay
  const overlay = document.createElement('div');
  overlay.className = 'welcome-overlay';
  overlay.innerHTML = `
    <div class="welcome-message">
      <h1>¡Bienvenido, ${user.name}! 🎉</h1>
      <p>Descubre toda la experiencia Golden Oak</p>
    </div>
  `;
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.addEventListener('animationend', () => {
      overlay.remove();
    });
  }, 2000);
  
  showNotification(
    '¡Bienvenido! ',
    `¡Nos alegra verte de nuevo, ${user.name}!`
  );
  
  updateUIForUser();
  
  return true;
}

function updateUIForUser() {
  const authButtons = document.querySelector('.auth-buttons');
  const profileBtn = document.querySelector('.user-profile-btn');
  
  if (currentUser) {
    // Hide login/register buttons
    Array.from(authButtons.children).forEach(button => {
      if (button.classList.contains('login-btn') || button.classList.contains('register-btn')) {
        button.style.display = 'none';
      }
    });
    // Show profile button
    profileBtn.style.display = 'block';
  } else {
    // Show login/register buttons
    Array.from(authButtons.children).forEach(button => {
      if (button.classList.contains('login-btn') || button.classList.contains('register-btn')) {
        button.style.display = 'block';
      }
    });
    // Hide profile button
    profileBtn.style.display = 'none';
  }
}

function logout() {
  currentUser = null;
  updateUIForUser();
  document.body.classList.remove('authenticated');
  const dropdown = document.querySelector('.user-profile-dropdown');
  if (dropdown) {
    dropdown.classList.remove('active');
  }
}

// Shopping Cart functionality
let cart = [];

function addToCart(productName, price) {
  const quantity = parseInt(document.querySelector(`#quantity-${productName.replace(/\s+/g, '-')}`).value);
  
  // Check if product already exists in cart
  const existingProduct = cart.find(item => item.name === productName);
  
  if (existingProduct) {
    existingProduct.quantity += quantity;
    existingProduct.totalPrice = existingProduct.quantity * price;
  } else {
    cart.push({
      name: productName,
      price: price,
      quantity: quantity,
      totalPrice: quantity * price
    });
  }
  
  updateCartCount();
  
  showNotification(
    '¡Producto Añadido! ',
    `${quantity}x ${productName} se ha añadido a tu carrito`
  );
  
  const cartButton = document.getElementById('cart-button');
  if (cartButton) {
    cartButton.style.transform = 'scale(1.2) rotate(20deg)';
    setTimeout(() => {
      cartButton.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
  }
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
  updateCartCount();
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  if (cartItems && cartTotal) {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <div class="cart-item-quantity">
            <button onclick="updateQuantity(${index}, -1)" class="quantity-btn">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${index}, 1)" class="quantity-btn">+</button>
          </div>
        </div>
        <div class="cart-item-price">
          ${(item.price * item.quantity).toFixed(2)}€
          <button onclick="removeFromCart(${index})" class="remove-btn">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
      cartItems.appendChild(cartItem);
      total += item.price * item.quantity;
    });

    cartTotal.innerHTML = `
      <div class="cart-total-details">
        <span>Total:</span>
        <span class="cart-total-amount">${total.toFixed(2)}€</span>
      </div>
    `;
  }
}

function updateQuantity(index, change) {
  const item = cart[index];
  const newQuantity = item.quantity + change;
  
  if (newQuantity > 0) {
    item.quantity = newQuantity;
    item.totalPrice = item.quantity * item.price;
    updateCartDisplay();
    updateCartCount();
  } else if (newQuantity === 0) {
    removeFromCart(index);
  }
}

function checkout() {
  if (cart.length === 0) {
    showNotification(
      'Carrito Vacío ',
      'Añade algunos productos antes de continuar',
      'error'
    );
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  showNotification(
    '¡Compra Exitosa! ',
    `Tu pedido por ${total}€ ha sido procesado. ¡Gracias por tu compra!`
  );
  
  cart = [];
  updateCartCount();
  updateCartDisplay();
  document.getElementById('cart-modal').style.display = 'none';
}

// Image interaction
function setupImageInteractions() {
  const interactiveImages = document.querySelectorAll('.excursion-card img, .deporte-card img');
  
  interactiveImages.forEach(img => {
    img.addEventListener('mouseover', (e) => {
      e.target.style.transform = 'scale(1.1)';
      e.target.style.transition = 'transform 0.3s ease';
    });
    
    img.addEventListener('mouseout', (e) => {
      e.target.style.transform = 'scale(1)';
    });
    
    img.addEventListener('click', (e) => {
      const modal = document.createElement('div');
      modal.className = 'image-modal modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <img src="${e.target.src}" style="width: 100%; height: auto;">
          <p>${e.target.alt}</p>
        </div>
      `;
      document.body.appendChild(modal);
      modal.style.display = 'block';
      
      modal.querySelector('.close').onclick = () => {
        modal.remove();
      };
      
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      };
    });
  });
}

// Profile functionality
function toggleProfileDropdown() {
  const dropdown = document.querySelector('.user-profile-dropdown');
  dropdown.classList.toggle('active');
}

function editProfile() {
  alert('Función de editar perfil en desarrollo');
}

function changePassword() {
  alert('Función de cambiar contraseña en desarrollo');
}

function viewBookings() {
  alert('Función de ver reservas en desarrollo');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) {
    document.body.classList.add('authenticated');
  }
  
  cargarTestimonios();
  setupImageInteractions();

  // Add smooth scroll for inicio link
  document.querySelector('a[href="#hero"]').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Testimonios
  const testimonialForm = document.getElementById('testimonialForm');
  if (testimonialForm) {
    testimonialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newTestimonio = {
        nombre: document.getElementById('testimonialName').value,
        edad: parseInt(document.getElementById('testimonialAge').value),
        texto: document.getElementById('testimonialText').value,
        rating: parseInt(document.querySelector('input[name="rating"]:checked').value)
      };

      // Añadir el nuevo testimonio al array
      testimonios.unshift(newTestimonio);

      // Actualizar el carrusel
      const carousel = document.querySelector('.testimonios-carousel');
      const card = document.createElement('div');
      card.className = 'testimonio-card';
      card.innerHTML = `
        <h3>${newTestimonio.nombre}</h3>
        <p>${newTestimonio.edad} años</p>
        <p>"${newTestimonio.texto}"</p>
        <div class="rating">
          ${'★'.repeat(newTestimonio.rating)}${'☆'.repeat(5-newTestimonio.rating)}
        </div>
      `;
      
      // Añadir con animación
      card.style.opacity = '0';
      carousel.insertBefore(card, carousel.firstChild);
      
      // Animar la entrada
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease';
        card.style.opacity = '1';
      }, 10);

      // Limpiar el formulario
      testimonialForm.reset();

      // Mostrar mensaje de éxito
      alert('¡Gracias por compartir tu experiencia!');
    });
  }

  // Login form handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;
      const password = e.target.querySelector('input[type="password"]').value;
      
      try {
        loginUser(email, password);
        closeModal('login');
        updateUIForUser();
      } catch (error) {
        // Error notification is handled in loginUser
      }
    });
  }

  // Register form handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = e.target.querySelector('input[placeholder="Nombre"]').value;
      const email = e.target.querySelector('input[type="email"]').value;
      const password = e.target.querySelector('input[placeholder="Contraseña"]').value;
      const confirmPassword = e.target.querySelector('input[placeholder="Confirmar Contraseña"]').value;
      
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      
      try {
        registerUser(name, email, password);
        closeModal('register');
        alert('¡Registro exitoso! Por favor, inicia sesión.');
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // Update modal click handler to exclude info modal close button
  const closeButtons = document.querySelectorAll('.modal:not(#infoModal) .close');
  Array.from(closeButtons).forEach(button => {
    if (button) {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
          modal.style.display = "none";
        }
      });
    }
  });

  // Keep the click outside to close functionality
  window.addEventListener('click', (e) => {
    const infoModal = document.getElementById('infoModal');
    if (e.target === infoModal) {
      infoModal.style.display = "none";
    }
    if (e.target.classList.contains('modal')) {
      e.target.style.display = "none";
    }
  });

  // Profile dropdown
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-profile-btn')) {
      const dropdown = document.querySelector('.user-profile-dropdown');
      if (dropdown) {
        dropdown.classList.remove('active');
      }
    }
  });

  // Navegación suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const element = document.querySelector(this.getAttribute('href'));
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Animación para mostrar las secciones al hacer scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('section').forEach((section) => {
    observer.observe(section);
  });

  // Add smooth scroll for info modal
  const infoModalContent = document.querySelector('.info-modal-content');
  if (infoModalContent) {
    infoModalContent.addEventListener('scroll', (e) => {
      const scrollTop = e.target.scrollTop;
      const header = e.target.querySelector('h2');
      if (header) {
        if (scrollTop > 50) {
          header.style.fontSize = '1.5rem';
          header.style.transition = 'font-size 0.3s';
        } else {
          header.style.fontSize = '2rem';
        }
      }
    });
  }

  // Event Listeners for cart
  const cartButton = document.getElementById('cart-button');
  const cartModal = document.getElementById('cart-modal');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (cartButton && cartModal) {
    cartButton.addEventListener('click', () => {
      cartModal.style.display = 'block';
      updateCartDisplay();
    });

    window.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        cartModal.style.display = 'none';
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }

  // Add scroll spy functionality
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveSection() {
    const scrollPosition = window.scrollY + 100; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Special case for top of page
    if (scrollPosition < sections[0].offsetTop) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#hero') {
          link.classList.add('active');
        }
      });
    }
  }

  // Initial check
  updateActiveSection();

  // Add scroll event listener
  window.addEventListener('scroll', updateActiveSection);
});

function showNotification(title, message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <h4>${title}</h4>
    <p>${message}</p>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutToast 0.5s ease forwards';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}