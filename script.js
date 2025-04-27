// Store XML data globally
let xmlDataGlobal = null;

// Function to load and parse XML data
async function loadXMLData() {
    try {
         loadThemeFromURL() 
        const response = await fetch('products.xml');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('XML parsing error');
        }

        console.log('XML loaded successfully');
        xmlDataGlobal = xmlDoc; // Store XML globally
        displayProducts(xmlDoc);
    } catch (error) {
        console.error('Error loading XML data:', error);
    }
}

// Function to display products from XML
function displayProducts(xmlDoc) {
    try {
        const categories = xmlDoc.getElementsByTagName('category');
        console.log('Found categories:', categories.length);

        Array.from(categories).forEach(category => {
            const categoryId = category.getAttribute('id');
            console.log('Processing category:', categoryId);

            const productsGrid = document.getElementById(`${categoryId}-grid`);
            if (!productsGrid) {
                console.error(`Grid element not found for category: ${categoryId}`);
                return;
            }

            // Clear existing content
            productsGrid.innerHTML = '';

            const products = category.getElementsByTagName('product');
            console.log(`Found ${products.length} products in category ${categoryId}`);

            if (products.length === 0) {
                productsGrid.innerHTML = '<p>No products available in this category.</p>';
                return;
            }

            Array.from(products).forEach(product => {
                const card = createProductCard(product);
                productsGrid.appendChild(card);
            });
        });
    } catch (error) {
        console.error('Error displaying products:', error);
    }
}

// Function to create a product card
function createProductCard(product) {
    try {
        const card = document.createElement('div');
        card.className = 'product-card';

        const name = product.getElementsByTagName('name')[0]?.textContent || 'Unknown Product';
        const price = product.getElementsByTagName('price')[0]?.textContent || '0';
        const description = product.getElementsByTagName('description')[0]?.textContent || 'No description available';
        const stock = product.getElementsByTagName('stock')[0]?.textContent || '0';
        const specs = product.getElementsByTagName('specs')[0];
        const image = product.getElementsByTagName('image')[0]?.textContent || 'images/placeholder.svg';

        let specsHtml = '<div class="specs">';
        if (specs) {
            Array.from(specs.children).forEach(spec => {
                specsHtml += `<p>${spec.tagName}: ${spec.textContent}</p>`;
            });
        }
        specsHtml += '</div>';

        card.innerHTML = `
            <img src="${image}" alt="${name}" class="product-image" onerror="this.src='images/placeholder.svg'">
            <h3>${name}</h3>
            <p>${description}</p>
            <div class="price">RM${price}</div>
            ${specsHtml}
            <p class="stock">In Stock: ${stock}</p>
        `;

        return card;
    } catch (error) {
        console.error('Error creating product card:', error);
        return document.createElement('div'); // Return empty div as fallback
    }
}

// Function to sort products based on selected option
function sortProducts() {
    if (!xmlDataGlobal) return;

    const sortBy = document.getElementById('sort-by').value;

    const categories = xmlDataGlobal.getElementsByTagName('category');
    Array.from(categories).forEach(category => {
        const products = Array.from(category.getElementsByTagName('product'));

        products.sort((a, b) => {
            let aValue, bValue;

            if (sortBy.includes('name')) {
                aValue = a.getElementsByTagName('name')[0]?.textContent || '';
                bValue = b.getElementsByTagName('name')[0]?.textContent || '';
                return sortBy.endsWith('asc') ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }

            if (sortBy.includes('price')) {
                aValue = parseFloat(a.getElementsByTagName('price')[0]?.textContent || 0);
                bValue = parseFloat(b.getElementsByTagName('price')[0]?.textContent || 0);
                return sortBy.endsWith('asc') ? aValue - bValue : bValue - aValue;
            }

            if (sortBy.includes('stock')) {
                aValue = parseInt(a.getElementsByTagName('stock')[0]?.textContent || 0);
                bValue = parseInt(b.getElementsByTagName('stock')[0]?.textContent || 0);
                return sortBy.endsWith('asc') ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });

        const productsGrid = document.getElementById(`${category.getAttribute('id')}-grid`);
        productsGrid.innerHTML = '';

        products.forEach(product => {
            const card = createProductCard(product);
            productsGrid.appendChild(card);
        });
    });
}
function filterCategory() {
    const selectedCategory = document.getElementById('category-filter').value;
    const allSections = document.querySelectorAll('.product-section');

    allSections.forEach(section => {
        const sectionId = section.id;
        // Ignore the top sort section (no id)
        if (!sectionId) return;

        if (selectedCategory === 'all') {
            section.style.display = 'block';
        } else {
            if (sectionId === selectedCategory) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    });
}
// Theme switching functionality
function loadThemeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');

    // If no theme or theme=light, use light theme
    if (!theme || theme === 'light') {
        currentTheme = 'light';
    } else {
        currentTheme = 'dark';
    }

    const themeLink = document.getElementById('theme-style');
    themeLink.href = `styles-${currentTheme}.css`;

    // Update navigation links accordingly
    const indexLink = document.getElementById('indexurl');
    const contactLink = document.getElementById('contacturl');

    if (indexLink) {
        indexLink.href = `index.html?theme=${currentTheme}`;
    }
    if (contactLink) {
        contactLink.href = `contact.html?theme=${currentTheme}`;
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    const themeLink = document.getElementById('theme-style');
    themeLink.href = `styles-${currentTheme}.css`;
    // Update URLs with theme parameter
    const indexLink = document.getElementById('indexurl');
    const contactLink = document.getElementById('contacturl');

    if (indexLink) {
        indexLink.href = `index.html?theme=${currentTheme}`;
    }
    if (contactLink) {
        contactLink.href = `contact.html?theme=${currentTheme}`;
    }
}

// Load XML data when the page loads
document.addEventListener('DOMContentLoaded', loadXMLData);
