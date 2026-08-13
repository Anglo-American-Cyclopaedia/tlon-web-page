// Lógica de la aplicación ALEPH (Semillero Académico - Universidad Nacional de Colombia)

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initNavbar();
  initBackToTopButton();
});

// --- ENRUTADOR SPA (Vanilla JS) ---
let currentPath = '';

function initRouter() {
  // Manejo de clics en enlaces de navegación del enrutador
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    }
  });

  // Escuchar cambios de historial (atrás/adelante)
  window.addEventListener('popstate', route);
  window.addEventListener('hashchange', () => {
    if (isLocalFileProtocol()) {
      route();
    }
  });

  // Ejecutar enrutamiento inicial
  route();
}

function isLocalFileProtocol() {
  return window.location.protocol === 'file:';
}

function getPath() {
  if (isLocalFileProtocol()) {
    // Si corre de forma local (file://), usamos Hash Routing
    const hash = window.location.hash || '#/';
    return hash.slice(1) || '/';
  }
  // En servidor web (Vercel), usamos rutas limpias de la API History
  return window.location.pathname || '/';
}

function navigateTo(path) {
  if (isLocalFileProtocol()) {
    // En file://, cambiamos el hash
    window.location.hash = '#' + path;
  } else {
    // En http/https, usamos history pushstate
    if (window.location.pathname !== path) {
      window.history.pushState(null, null, path);
      route();
    }
  }
}

function route() {
  const path = getPath();
  currentPath = path;

  // Limpiar/Establecer clases activas en el menú navbar
  updateActiveMenu(path);

  // Seleccionar contenedor principal
  const appView = document.getElementById('app-view');
  if (!appView) return;

  // Transición suave: fade-out rápido
  appView.classList.remove('animate-fade-in');
  appView.style.opacity = 0;

  setTimeout(() => {
    // Cargar contenido según la ruta
    if (path === '/libros') {
      renderBooksPage(appView);
    } else {
      // Por defecto carga el Inicio
      renderHomePage(appView);
      
      // Manejar scroll suave si la URL tiene hash de sección
      handleSectionScroll();
    }

    // Transición suave: inyectar y dar fade-in
    appView.style.opacity = 1;
    appView.classList.add('animate-fade-in');

    // Sincronizar visibilidad del botón "volver arriba" con la nueva vista
    if (window.__updateBackToTopVisibility) window.__updateBackToTopVisibility();
  }, 100);
}

function handleSectionScroll() {
  // Si la ruta contiene un hash local como #enlaces, hacemos scroll suave
  const hash = window.location.hash;
  if (hash && hash.includes('enlaces')) {
    setTimeout(() => {
      const target = document.getElementById('enlaces');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  }
}

// --- NAVEGACIÓN NAVBAR ---
function initNavbar() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Cerrar menú móvil al hacer clic en enlaces
  document.addEventListener('click', (e) => {
    if (e.target.closest('#mobile-menu a')) {
      if (mobileMenu) mobileMenu.classList.add('hidden');
    }
  });
}

function updateActiveMenu(path) {
  const desktopLinks = document.querySelectorAll('.desktop-nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const highlightClass = 'border-white';
  const inactiveClass = 'border-transparent';

  desktopLinks.forEach(link => {
    const href = link.getAttribute('href');
    const isLibros = path === '/libros' && href.includes('libros');
    const isInicio = path === '/' && !href.includes('libros') && !href.includes('enlaces');

    if (isLibros || isInicio) {
      link.classList.add(highlightClass);
      link.classList.remove(inactiveClass);
    } else {
      link.classList.remove(highlightClass);
      link.classList.add(inactiveClass);
    }
  });
}

// Helper para normalizar las rutas de las imágenes de portada
function getNormalizedCoverUrl(coverUrl) {
  if (!coverUrl) return null;
  // Convertir rutas absolutas en relativas para que funcionen offline mediante file://
  return coverUrl.startsWith('/') ? coverUrl.slice(1) : coverUrl;
}

// --- VISTA: INICIO (HOME) ---
function renderHomePage(container) {
  let categoriesHtml = '';

  window.INTEREST_SITES.forEach(group => {
    let itemsHtml = '';
    group.items.forEach(item => {
      itemsHtml += `
        <li>
          <a href="${item.url}" target="_blank" class="interest-link-item group flex items-center gap-3 py-2 text-neutral-700 hover:text-unal-green transition-all duration-200 hover:pl-2">
            <span class="link-icon text-sm opacity-60 group-hover:scale-110 transition-transform duration-200">🔗</span>
            <span class="link-text font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">${item.title}</span>
          </a>
        </li>
      `;
    });

    categoriesHtml += `
      <div class="interest-card bg-white p-8 rounded-2xl shadow-sm border border-neutral-100/80 hover:shadow-md hover:border-unal-green/40 hover:-translate-y-1.5 transition-all duration-300">
        <h3 class="text-xl font-bold text-neutral-800 border-b border-neutral-100 pb-4 mb-5">${group.category}</h3>
        <ul class="interest-links space-y-1.5">
          ${itemsHtml}
        </ul>
      </div>
    `;
  });

  container.className = 'w-full bg-[#fcfcfc]';
  container.innerHTML = `
    <!-- Hero Section -->
    <header class="hero-section py-20 px-[5%] bg-gradient-to-br from-[#f9fbf2] to-white border-b border-neutral-100 flex items-center min-h-[70vh]">
      <div class="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div class="text-container lg:col-span-7 flex flex-col items-start text-left">
          <div class="aleph-identity flex items-center gap-4 mb-4">
            <span class="aleph-char text-5xl font-serif text-unal-green animate-float-slow leading-none">א</span>
            <h1 class="text-5xl lg:text-7xl font-extrabold text-neutral-800 tracking-tight leading-none m-0">EL ALEPH</h1>
          </div>
          <p class="home-subtitle text-xl lg:text-2xl text-neutral-600 font-light italic mb-6">Semillero Académico de Conocimiento</p>
          <p class="description text-base lg:text-lg text-neutral-600 leading-relaxed max-w-2xl mb-8">
            Un espacio dedicado al estudio formal, análisis e investigación avanzada en lenguajes de programación, compiladores, autómatas e historia de la computación científica en la Universidad Nacional de Colombia.
          </p>
          <div class="cta-group flex flex-wrap gap-6 mt-4">
            <a href="/libros" data-link class="relative group inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-unal-green to-[#6b8529] rounded-full shadow-[0_8px_30px_rgb(148,180,59,0.3)] hover:shadow-[0_8px_30px_rgb(148,180,59,0.5)] hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-unal-green overflow-hidden">
              <span class="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span class="relative flex items-center gap-2">
                <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Ver Biblioteca Técnica
              </span>
            </a>
            <a href="#enlaces" class="relative group inline-flex items-center justify-center px-10 py-4 font-bold text-neutral-700 transition-all duration-300 bg-white border-2 border-neutral-200 rounded-full shadow-sm hover:border-unal-green hover:text-unal-green hover:shadow-[0_8px_30px_rgb(148,180,59,0.15)] hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-unal-green overflow-hidden">
              <span class="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-y-full bg-unal-green/10 group-hover:translate-y-0"></span>
              <span class="relative flex items-center gap-2">
                Sitios de Interés
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
            </a>
          </div>
        </div>

        <div class="image-container hidden md:flex lg:col-span-5 justify-center items-center relative py-12 lg:py-0">
          <div class="relative w-full max-w-[200px] lg:max-w-[280px] flex justify-center items-center">
            <!-- Decorative blur background -->
            <div class="absolute inset-0 bg-unal-green/20 blur-[60px] rounded-full animate-float-slow"></div>
            <!-- Logo Image -->
            <img src="images/nuevo Logo.jpeg" alt="Logo de ALEPH" class="relative z-10 w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-3xl" />
          </div>
        </div>

      </div>
    </header>

    <!-- Enlaces / Sitios de Interés -->
    <main id="enlaces" class="max-w-6xl mx-auto px-6 py-20">
      <div class="section-title mb-12 flex flex-col items-start">
        <h2 class="text-3xl lg:text-4xl font-extrabold text-neutral-800 mb-3">Sitios de Interés</h2>
        <div class="title-accent w-12 h-1 bg-unal-green rounded-full"></div>
      </div>

      <div class="categories-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${categoriesHtml}
      </div>
    </main>
  `;

  // Asignar event listeners locales a los links con hashes internos (#enlaces)
  const links = container.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Modificar el hash en la URL sin recargar
        window.history.pushState(null, null, '#' + targetId);
      }
    });
  });
}

// --- VISTA: BIBLIOTECA TÉCNICA (BOOKS) ---
function renderBooksPage(container) {
  container.className = 'w-full bg-library-radial text-neutral-100 min-h-screen pb-20';
  
  // Renderizar la estructura básica de la página de libros
  container.innerHTML = `
    <!-- Cabecera de Página de Libros -->
    <header class="page-header pt-28 pb-12 px-6 flex justify-center text-center">
      <div class="glass-card backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 max-w-4xl w-full shadow-2xl animate-fade-in">
        <h1 class="text-4xl lg:text-5xl font-black mb-4 tracking-tight bg-gradient-to-r from-white via-white to-unal-green bg-clip-text text-transparent">
          La biblioteca de Babel
        </h1>
        <p class="text-neutral-300 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-light">
          Una colección curada de los pilares fundamentales y las últimas innovaciones en la ciencia de la computación.
        </p>
      </div>
    </header>

    <!-- Controles Interactivos: Buscador y Filtros -->
    <section class="max-w-6xl mx-auto px-6 mb-12">
      <div class="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
        
        <!-- Buscador en tiempo real -->
        <div class="relative w-full md:w-96">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            🔍
          </span>
          <input 
            type="text" 
            id="book-search-input" 
            placeholder="Buscar libros por título o año..." 
            class="w-full pl-10 pr-10 py-3 bg-neutral-900/60 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-unal-green focus:ring-1 focus:ring-unal-green transition-all"
          />
          <button 
            id="clear-search-btn" 
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 hidden"
          >
            ✕
          </button>
        </div>

        <!-- Indicador de cantidad de libros -->
        <div class="text-sm text-neutral-300 font-medium flex items-center gap-2">
          <span class="inline-block w-2.5 h-2.5 bg-unal-green rounded-full"></span>
          Mostrando <span id="books-count-badge" class="font-bold text-white text-base">0</span> libros en total
        </div>

      </div>

      <!-- Barra de Accesos Rápidos a Categorías -->
      <div class="mt-6 flex flex-wrap gap-2 justify-center" id="category-chips-container">
        <!-- Rellenado dinámicamente -->
      </div>
    </section>

    <!-- Contenedor del listado de libros -->
    <main id="books-list-root" class="max-w-6xl mx-auto px-6">
      <!-- Se inyecta dinámicamente -->
    </main>
  `;

  // Renderizar chips de categorías
  renderCategoryChips();

  // Realizar primer renderizado de libros (completo)
  renderBooksList('');

  // Configurar eventos interactivos
  const searchInput = document.getElementById('book-search-input');
  const clearBtn = document.getElementById('clear-search-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.trim() !== '') {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
      renderBooksList(query);
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      searchInput.focus();
      renderBooksList('');
    });
  }
}

// Controla el botón flotante de "volver arriba" (vive fuera de #app-view para no
// heredar el containing block que crea la animación "animate-fade-in" con transform)
function initBackToTopButton() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  const toggleVisibility = () => {
    const shouldShow = currentPath === '/libros' && window.scrollY > 400;
    if (shouldShow) {
      btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    }
  };

  window.addEventListener('scroll', toggleVisibility);
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Exponer para que route() pueda re-evaluar la visibilidad al cambiar de vista
  window.__updateBackToTopVisibility = toggleVisibility;
}

function renderCategoryChips() {
  const container = document.getElementById('category-chips-container');
  if (!container) return;

  let html = '';
  window.CATEGORIES.forEach((cat, index) => {
    // Contar cuántos libros tiene esta categoría en total
    const count = window.BOOKS_DATA.filter(b => b.category === cat).length;
    
    html += `
      <button
        data-category-target="${index}"
        class="category-chip px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-semibold text-neutral-300 hover:text-white hover:border-neutral-500 transition-all flex items-center gap-2"
      >
        <span>${cat}</span>
        <span class="bg-neutral-800 px-2 py-0.5 rounded-full text-xs text-neutral-400 font-bold">${count}</span>
      </button>
    `;
  });

  container.innerHTML = html;

  // Eventos para scroll suave a cada categoría
  container.querySelectorAll('[data-category-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-category-target');
      const targetSec = document.getElementById(`category-section-${idx}`);
      if (targetSec) {
        const offset = 90; // Offset para el navbar adhesivo
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetSec.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function renderBooksList(query) {
  const root = document.getElementById('books-list-root');
  const badge = document.getElementById('books-count-badge');
  if (!root) return;

  const normalizedQuery = query.toLowerCase().trim();
  let totalVisibleBooks = 0;
  let sectionsHtml = '';

  window.CATEGORIES.forEach((cat, catIdx) => {
    // Filtrar libros de esta categoría por la query
    const books = window.BOOKS_DATA.filter(book => {
      if (book.category !== cat) return false;
      if (normalizedQuery === '') return true;
      return (
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.year.toLowerCase().includes(normalizedQuery)
      );
    });

    if (books.length === 0) return; // Omitir categorías vacías al buscar

    totalVisibleBooks += books.length;
    let booksHtml = '';

    books.forEach(book => {
      const normalizedCover = getNormalizedCoverUrl(book.coverUrl);
      const imageTag = normalizedCover 
        ? `<img src="${normalizedCover}" alt="${book.title}" class="book-cover-img w-full height-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy">`
        : `<div class="book-placeholder flex items-center justify-center w-full h-full bg-neutral-100 text-neutral-300 font-serif text-6xl select-none">א</div>`;

      // Crear URL de búsqueda en Amazon si no hay link directo
      const searchUrl = book.amazonLink || `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}`;

      booksHtml += `
        <article class="book-card-premium bg-white text-neutral-800 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl hover:border-unal-green hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden group">
          
          <!-- Portada y Overlay -->
          <div class="book-visual h-[320px] bg-neutral-50 relative flex items-center justify-center overflow-hidden">
            ${imageTag}
            
            <div class="card-overlay absolute inset-0 bg-neutral-900/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 z-10">
              <a href="${searchUrl}" target="_blank" class="buy-btn relative overflow-hidden px-8 py-4 bg-gradient-to-r from-unal-green to-[#6b8529] text-white text-sm font-extrabold tracking-wide rounded-full shadow-[0_10px_40px_rgb(148,180,59,0.4)] transform translate-y-4 group-hover:translate-y-0 hover:scale-110 transition-all duration-500 flex items-center gap-3">
                <span class="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></span>
                <span class="text-lg">🛒</span> <span class="relative z-10">Ver en Amazon</span>
              </a>
            </div>
          </div>

          <!-- Detalles del Libro -->
          <div class="book-details p-6 flex-grow flex flex-col bg-white">
            <span class="book-year text-xs font-extrabold text-unal-green uppercase tracking-widest mb-2.5 block">${book.year}</span>
            <h3 class="book-title text-base font-extrabold text-neutral-800 leading-snug line-clamp-3 mb-6">${book.title}</h3>
            
            <div class="card-footer mt-auto border-t border-neutral-100 pt-4 flex items-center justify-between">
              <a href="https://www.amazon.com/s?k=${encodeURIComponent(book.title)}" target="_blank" class="search-link text-xs font-semibold text-neutral-400 hover:text-unal-green transition-colors">
                Buscar más info →
              </a>
            </div>
          </div>

        </article>
      `;
    });

    sectionsHtml += `
      <section id="category-section-${catIdx}" class="category-section mb-16 animate-fade-in">
        <div class="category-title mb-8 relative">
          <h2 class="text-2xl lg:text-3xl font-extrabold text-unal-green tracking-tight hover:text-white transition-colors duration-200">
            ${cat}
          </h2>
          <div class="category-line-accent h-1 w-12 bg-gradient-to-r from-unal-green to-transparent rounded-full mt-2.5"></div>
        </div>
        
        <div class="books-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          ${booksHtml}
        </div>
      </section>
    `;
  });

  // Mostrar badge
  if (badge) badge.innerText = totalVisibleBooks;

  if (totalVisibleBooks === 0) {
    root.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center py-20 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm px-6">
        <span class="text-5xl mb-4 select-none">📚</span>
        <h3 class="text-xl font-bold text-white mb-2">No se encontraron libros</h3>
        <p class="text-neutral-400 max-w-sm mb-6 font-light">No hay títulos ni años coincidentes con tu búsqueda "${query}". Intenta con otros términos.</p>
        <button 
          onclick="document.getElementById('book-search-input').value=''; document.getElementById('clear-search-btn').click();"
          class="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/25 rounded-full text-sm font-semibold text-white transition-all"
        >
          Limpiar búsqueda
        </button>
      </div>
    `;
  } else {
    root.innerHTML = sectionsHtml;
  }
}
