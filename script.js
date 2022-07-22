let modalQtd = 1;
let cart = [];
let modalKey = 0;

const c = (el) => {
    return document.querySelector(el);
}

const cs = (el) => {
    return document.querySelectorAll(el);
}

const addEventModal = (e) => {
    e.preventDefault();
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalQtd = 1;
    modalKey = key;

    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    c('.pizzaBig img').src = pizzaJson[key].img;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
    c('.pizzaInfo--size.selected').classList.remove('selected');

    cs('.pizzaInfo--size').forEach((size, index) => {
        if (index === 2) {
            size.classList.add('selected');
        }
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[index];
    });

    c('.pizzaInfo--qt').innerHTML = modalQtd;
    c('.pizzaWindowArea').style.opacity = 0;
    c('.pizzaWindowArea').style.display = 'flex';
    setTimeout(() => {
        c('.pizzaWindowArea').style.opacity = 1;
    }, 200);
}

const showListPizzas = () => {
    pizzaJson.map((item, index) => {
        let pizzaItem = c('.models .pizza-item').cloneNode(true);

        pizzaItem.setAttribute('data-key', index);
        pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
        pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
        pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
        pizzaItem.querySelector('.pizza-item--img img').src = item.img;

        pizzaItem.querySelector('a').addEventListener('click', (e) => {
            addEventModal(e);
        });

        c('.pizza-area').append(pizzaItem);
    })
}

const closeModel = () => {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModel);
})

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQtd === 1) {
        return;
    }

    modalQtd--;
    c('.pizzaInfo--qt').innerHTML = modalQtd;
})

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQtd++;
    c('.pizzaInfo--qt').innerHTML = modalQtd;
})

cs('.pizzaInfo--size').forEach((item) => {
    item.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        item.classList.add('selected');
    })
})

c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex((item) => {
        return item.identifier === identifier;
    })

    if (key > -1) {
        cart[key].qt += modalQtd;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQtd
        });
    }

    updateCart();
    closeModel();
})

c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
})

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
})

const updateCart = () => {
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = ''
        let subtotal = 0;
        let total = 0;
        let desconto = 0

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => {
                return item.id == cart[i].id;
            });
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }

                updateCart();
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            })

            c('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}

showListPizzas();