// ---------- VARIABLES GLOBALES ----------
let allBooks = [];
let currentFilteredBooks = [];
let activeCategory = 'Todos';
let categories = [];

// ---------- FUNCIONES DE RENDERIZADO ----------
function groupByCategory(books) {
  const groups = {};
  books.forEach(book => {
    const cat = book.category || 'Sin categoría';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(book);
  });
  return groups;
}

function renderBooks(books) {
  const app = document.getElementById('books-container');
  if (!app) return;

  // Actualizar contador
  const countBadge = document.getElementById('books-count-badge');
  if (countBadge) {
    countBadge.textContent = books.length;
  }

  if (!books || books.length === 0) {
    app.innerHTML = `
      <div class="tw-text-center tw-py-20">
        <span class="tw-text-2xl tw-text-red-300">No se encontraron libros</span>
      </div>
    `;
    return;
  }

  const grouped = groupByCategory(books);
  let html = '';

  for (const [category, booksList] of Object.entries(grouped)) {
    html += `
      <div class="tw-flex tw-flex-col tw-gap-5 tw-mb-10">
        <span class="tw-text-2xl lg:tw-text-3xl tw-font-extrabold tw-text-unal-green">
          ${category} <span class="tw-text-sm tw-font-normal tw-text-gray-500">(${booksList.length})</span>
        </span>
        <div class="tw-w-full tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 xl:tw-grid-cols-4 tw-gap-5">
    `;

    booksList.forEach(book => {
      const searchQuery = encodeURIComponent(book.title + ' ' + book.year);
      const googleSearchUrl = `https://www.google.com.co/search?q=${searchQuery}`;
      const coverUrl = book.coverUrl || 'https://placecats.com/400/320';

      html += `
        <article class="tw-flex tw-flex-col tw-bg-transparent tw-rounded-2xl tw-overflow-hidden tw-h-full">
          <div class="tw-h-[320px] tw-relative tw-flex tw-items-center tw-justify-center tw-overflow-hidden tw-group">
            <img src="${coverUrl}" 
                 alt="${book.title}" 
                 class="tw-w-full tw-h-full tw-object-cover" 
                 loading="lazy"
                 onerror="this.onerror=null; this.src='https://placecats.com/400/320';">
            <div class="tw-flex tw-items-center tw-justify-center tw-absolute tw-inset-0 tw-bg-neutral-900/80 tw-backdrop-blur-[2px] tw-opacity-0 group-hover:tw-opacity-100 tw-transition-opacity tw-duration-300 tw-p-6 tw-z-10">
              <button 
                onclick="window.open('${book.amazonLink || '#'}', '_blank')" 
                class="tw-flex tw-relative tw-overflow-hidden tw-px-8 tw-py-4 tw-bg-gradient-to-r tw-from-unal-green tw-to-[#6b8529] tw-text-white tw-text-sm tw-font-extrabold tw-tracking-wide tw-rounded-full tw-items-center tw-gap-3"
                style="outline: 0;">
                Ver en Amazon™
              </button>
            </div>
          </div>
          <div class="tw-p-6 tw-flex-grow tw-flex tw-flex-col tw-bg-white tw-text-neutral-800 tw-gap-2">
            <span class="tw-text-lg tw-font-extrabold tw-text-unal-green tw-uppercase tw-tracking-widest">${book.year || 'Año'}</span>
            <span class="tw-text-lg tw-font-extrabold tw-leading-snug tw-line-clamp-3">
              ${book.title}
            </span>
            <div class="tw-flex tw-items-center tw-justify-end tw-border-neutral-100 tw-mt-auto">
              <a href="${googleSearchUrl}" 
                 target="_blank" 
                 class="tw-text-lg tw-font-semibold tw-text-unal-green hover:tw-text-neutral-400 tw-transition-colors">
                → Buscar más info
              </a>
            </div>
          </div>
        </article>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  app.innerHTML = html;
}

// ---------- RENDERIZAR CATEGORÍAS DINÁMICAMENTE ----------
function renderCategories() {
  const categoriesContainer = document.getElementById('categories-container');
  if (!categoriesContainer) return;

  // Obtener categorías únicas
  const uniqueCategories = [...new Set(allBooks.map(book => book.category))].sort();
  categories = ['Todos', ...uniqueCategories];

  let html = '';

  categories.forEach((category, index) => {
    const isAll = index === 0;
    const isAllClasses = isAll ? 'tw-bg-unal-green tw-text-white' : 'tw-bg-white/5 tw-text-neutral-300';

    // Contar libros por categoría
    let count = 0;
    if (category === 'Todos') {
      count = allBooks.length;
    } else {
      count = allBooks.filter(book => book.category === category).length;
    }

    html += `
      <button 
        class="category-filter-btn tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 hover:tw-bg-white/10 ${isAllClasses} tw-border tw-border-solid tw-border-white tw-rounded-full tw-text-sm tw-font-semibold tw-transition-all"
        data-category="${category}"
        style="outline: 0;">
        <span>${category}</span>
        <span class="category-count tw-bg-neutral-800 tw-px-2 tw-py-0.5 tw-rounded-full tw-text-xs tw-text-neutral-400 tw-font-bold">${count}</span>
      </button>
    `;
  });

  categoriesContainer.innerHTML = html;
}

// ---------- FUNCIÓN DE BÚSQUEDA Y FILTRADO ----------
function filterBooks() {
  const searchInput = document.getElementById('book-search-input');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = allBooks;

  // Filtrar por categoría
  if (activeCategory !== 'Todos') {
    filtered = filtered.filter(book => book.category === activeCategory);
  }

  // Filtrar por búsqueda
  if (searchTerm) {
    filtered = filtered.filter(book => {
      return book.title.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm) ||
        book.year.toString().includes(searchTerm);
    });
  }

  currentFilteredBooks = filtered;
  renderBooks(filtered);
  updateCategoryCounts();
}

function searchBooks(query) {
  filterBooks();
}

// ---------- ACTUALIZAR CONTADORES DE CATEGORÍAS ----------
function updateCategoryCounts() {
  const categoryButtons = document.querySelectorAll('.category-filter-btn');
  categoryButtons.forEach(btn => {
    const category = btn.dataset.category;
    const countSpan = btn.querySelector('.category-count');
    if (!countSpan) return;

    let count = 0;
    if (category === 'Todos') {
      count = allBooks.length;
    } else {
      count = allBooks.filter(book => book.category === category).length;
    }
    countSpan.textContent = count;
  });
}

// ---------- CONFIGURAR BÚSQUEDA ----------
function setupSearch() {
  const searchInput = document.getElementById('book-search-input');
  if (!searchInput) return;

  // Buscar en tiempo real con debounce
  let debounceTimer;
  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      filterBooks();
    }, 300);
  });

  // Buscar con Enter
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      clearTimeout(debounceTimer);
      filterBooks();
    }
  });

  // Botón ✕ para limpiar
  const clearBtn = searchInput.parentElement.querySelector('button');
  if (clearBtn) {
    clearBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      searchInput.value = '';
      filterBooks();
    });
  }
}

// ---------- CONFIGURAR FILTROS POR CATEGORÍA ----------
function setupCategoryFilters() {
  const categoryButtons = document.querySelectorAll('.category-filter-btn');
  
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remover clase activa de todos
      categoryButtons.forEach(b => {
        b.classList.remove('tw-bg-unal-green', 'tw-text-white');
        b.classList.add('tw-bg-white/5', 'tw-text-neutral-300');
      });
      
      // Activar el botón clickeado

      console.log(this.classList);
      
      this.classList.remove('tw-bg-white/5', 'tw-text-neutral-300', 'hover:tw-bg-white/10');
      this.classList.add('tw-bg-unal-green', 'tw-text-white');
      
      console.log(this.classList);

      // Actualizar categoría activa
      activeCategory = this.dataset.category;
      
      // Limpiar búsqueda si está activa
      const searchInput = document.getElementById('book-search-input');
      if (searchInput) {
        searchInput.value = '';
      }
      
      // Filtrar libros
      filterBooks();
    });
  });
}

// ---------- CARGAR DATOS DESDE JSON ----------
async function loadBooks() {
  const app = document.getElementById('books-container');

  try {
    const response = await fetch('js/books.json');

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    allBooks = await response.json();
    currentFilteredBooks = allBooks;

    // Renderizar categorías dinámicamente
    renderCategories();

    // Configurar búsqueda y filtros
    setupSearch();
    setupCategoryFilters();

    // Renderizar todos los libros
    renderBooks(allBooks);

  } catch (error) {
    console.error('Error cargando libros:', error);
    app.innerHTML = `
      <div class="tw-text-center tw-py-10">
        <span class="tw-text-2xl tw-text-red-300">Error cargando los libros:<br>${error.message}</span>
        <br>
        <button onclick="loadBooks()" class="tw-mt-4 tw-px-6 tw-py-3 tw-bg-[#94b43b]/80 tw-text-white tw-rounded-full tw-font-semibold hover:tw-bg-[#1a5e2b]">
          Reintentar
        </button>
      </div>
    `;
  }
}

// ---------- EJECUTAR ----------
document.addEventListener('DOMContentLoaded', loadBooks);