// Load and parse XML
async function loadXMLData() {
    try {
        const response = await fetch('products.xml');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) throw new Error('XML parsing error');

        console.log('XML loaded successfully');
        displayProducts(xmlDoc);
    } catch (error) {
        console.error('Error loading XML data:', error);
    }
}

// Display products
function displayProducts(xmlDoc) {
    try {
        const categories = xmlDoc.getElementsByTagName('category');
        console.log('Found categories:', categories.length);

        Array.from(categories).forEach(category => {
            const categoryId = category.getAttribute('id');
            const productsGrid = document.getElementById(`${categoryId}-grid`);
            if (!productsGrid) return;

            productsGrid.innerHTML = '';

            const products = Array.from(category.getElementsByTagName('product'));

            products.forEach(product => {
                const card = createProductCard(product);
                productsGrid.appendChild(card);
            });
        });
    } catch (error) {
        console.error('Error displaying products:', error);
    }
}

// Create product card
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
            <p>${description}</p>
            <div class="price">RM${price}</div>
            ${specsHtml}
            <p class="stock">In Stock: <span class="stock-count">${stock}</span></p>
            <button class="order-button">Order Now</button>
        `;

        const orderButton = card.querySelector('.order-button');
        orderButton.addEventListener('click', () => handleOrder(card));

        return card;
    } catch (error) {
        console.error('Error creating product card:', error);
        return document.createElement('div');
    }
}

// Handle order
function handleOrder(card) {
    const stockSpan = card.querySelector('.stock-count');
    let currentStock = parseInt(stockSpan.textContent);

    if (currentStock > 0) {
        currentStock -= 1;
        stockSpan.textContent = currentStock;
        alert('Order placed successfully!');
    } else {
        alert('Sorry, out of stock!');
    }
}

// Toggle Theme
let currentTheme = 'light';
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    const themeLink = document.getElementById('theme-style');
    themeLink.href = `styles-${currentTheme}.css`;
}

// Initialize
document.addEventListener('DOMContentLoaded', loadXMLData);
