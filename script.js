// step 1 crear inventario

let stock = [
    { name: 'Televisor 4K', code: 'TV001', quantity: 0, price: 300 },
    { name: 'Auriculares', code: 'AU002', quantity: 2, price: 50 },
    { name: 'Smartphone', code: 'SP003', quantity: 15, price: 800, },
    { name: 'Laptop', code: 'LP004', quantity: 15, price: 800 }
]

// step 2 verificar stock
function syncStockState(inventory = stock) {

    const stock_validations = [
        { test: (quantity) => quantity === 0, state: 'Agotado' },
        { test: (quantity) => quantity <= 5, state: 'Crítico' },
        { test: (quantity) => quantity > 5, state: 'Disponible' }
    ]

    inventory.forEach(product => {
        for (const validation of stock_validations) {
            if (validation.test(product.quantity)) {
                product["state"] = validation.state;
                break;
            }
        }
    });
}

// step 3 actualizar stock

const in_stock = (stock, code) => {
    return stock.find(product => product.code.trim().toLowerCase() === code.trim().toLowerCase());
}

function updateStock(new_quantity, stock, code) {
    product = in_stock(stock, code);

    if (!product) {
        console.log('El producto no existe');
        return
    }

    product.quantity = new_quantity;
}

// step 5 eleminar producto

function deleteProduct(code) {
    stock = stock.filter(product => product.code !== code);
}

// renderizar el contenido de la tabla
// renderizar los datos del inventario en la tabla
function renderInventory(inventory = stock) {
    const table = document.querySelector(".inventory-table");
    const table_body = document.querySelectorAll(".inventory-row__body");

    if (!table) return;

    if (table_body.length > 0) {
        table_body.forEach((node) => node.remove());
    }

    syncStockState();

    inventory.forEach(product => {
        console.log(product);
        const table_row = renderInventoryRow(product);
        table.appendChild(table_row);
    });
}

// step 6 mostrar inventario
// responsabilidad -> crear una fila para la tabla 
function renderInventoryRow(product) {
    const row = document.createElement("div");
    row.classList.add("inventory-row", "inventory-row__body");

    for (let prop in product) {
        const cell = document.createElement("div");
        cell.classList.add("inventory-cell", "inventory-body__cell");

        if (!(prop === "state")) {
            cell.textContent = product[prop];
        } else {
            const state_element = document.createElement("div");
            const tooltip = document.createElement("span");
            cell.classList.add("--state", "--tooltip-container");
            tooltip.classList.add("--tooltip-top")

            if (product[prop] === "Disponible") {
                state_element.classList.add("--able");
            } else if (product[prop] === "Agotado") {
                state_element.classList.add("--out");
            } else {
                state_element.classList.add("--critical");
            }

            tooltip.textContent = product[prop];
            cell.appendChild(state_element);
            cell.appendChild(tooltip);
        }

        row.appendChild(cell);
    }

    return row;
}

// step 7 buscar producto por nombre

function lookingForName(stock, product_name) {
    return stock.find(product => product.name === product_name) !== undefined ? console.log(`${product.name} ${product.quantity}`) : console.log('no se encontro el producto');
}

// step 8 precio total del inventario

function totalStockPrice(stock) {
    return stock.reduce((acc, product) => acc += product.price, 0)
}

// step 9 ordenar inventario por precio
/**
 * Responsabilidad -> ordenar el inventario por precio
 * Consumidor -> consumir la funcion orderByPrice y Renderizar la tabla con los nuevos datos
 */
function sortByPrice(inventory = stock) {
    const inventory_copy = [...inventory];
    return inventory_copy.sort((a, b) => a.price - b.price);
}

function handleSortByPrice() {
    const sorted = sortByPrice();
    renderInventory(sorted);
}

// step 10 hay productos en stock

function has_products(stock) {
    return stock.some(product => product.quantity > 5);
}

// step 11 duplicar precio de productos

function duplicatePrice() {
    return stock.map((product) => {
        product.price *= 2;
        return product
    })
}

// step 12 reemplazar producto 

function replaceProduct(new_product, code) {
    stock.find((product, idx) => {
        if (product.code === code) {
            stock[idx] = new_product;
        }
    });
}

// configuracion de vistas para mostrar

const views = {
    inventory: document.querySelector(".inventory-section"),
    form: document.querySelector(".form-section")
}


// seleccionar los botones para insertar html dinamico
const sidebar = document.querySelector('.sidebar');

const events = {
    check: renderInventory,
    show: syncStockState,
    sort: handleSortByPrice
}

sidebar.addEventListener("click", (e) => {
    const button_selected = e.target.closest(".sidebar__button");
    const button_action = button_selected.dataset.action;

    if (!Object.hasOwn(events, button_action)) return;

    console.log(button_action);

    events[button_action]?.();
})

function init() {
    renderInventory();
}

init();
console.table(stock);