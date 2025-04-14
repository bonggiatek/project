// Function to load and parse XML data
async function loadXMLData() {
    try {
        const response = await fetch('products.xml');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('XML parsing error');
        }
        
        console.log('XML loaded successfully');
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

// Theme switching functionality
let currentTheme = 'light';

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    const themeLink = document.getElementById('theme-style');
    themeLink.href = `styles-${currentTheme}.css`;
}

// Load XML data when the page loads
document.addEventListener('DOMContentLoaded', loadXMLData);