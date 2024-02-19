// Init cart custom Event
const cartEvent = new CustomEvent('cartUpdateEvent', {
    detail: {
        message: 'Fired cart product updated custom Event!'
    },
    bubbles: false,
    cancelable: false
})

// Methods for work with cart
window.setProductToCart = async ({art, count}) => {

    console.log('Размещаем фиксированное количество товара в корзине:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = await fetch('/ajax/cart/set', { // /ajax/cart/set --- https://anaragaev.github.io/technolight.layout/mocks/cart-set.json
        method: 'POST',
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        window.CART.products = [...data]

        console.log('Размещаем товары в корзине', data);

    } else {
        console.error('Ошибка размещения товара в Корзине! Код ошибки:', res.status)
    }
}

window.addProductToCart = async ({art, count}) => {

    console.log('Добавление товара в корзину:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = await fetch('/ajax/cart/add', { // /ajax/cart/add --- https://anaragaev.github.io/technolight.layout/mocks/cart-add.json
        method: 'POST',
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        window.CART.products = [...data]

        console.log('Добавление товара в корзину', data);

    } else {
        console.error('Ошибка добавления товара в Корзину! Код ошибки:', res.status)
    }
}

window.removeProductFromCart = async ({art, count}) => {

    console.log('Удаление товара из корзины:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = await fetch('/ajax/cart/del', { // /ajax/cart/del --- https://anaragaev.github.io/technolight.layout/mocks/cart-del.json
        method: 'POST',
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        window.CART.products = [...data]

        console.log('Удаление товара из корзины', data);

    } else {
        console.error('Ошибка удаления товара из Корзины! Код ошибки:', res.status)
    }
}


// Cart Proxy
const cartGet = (target, prop) => {
    return target[prop]
}

const cartSet = (target, prop, val) => {
    console.log('SETTING');
    console.log('target', target);
    console.log('prop', prop);
    console.log('val', val);

    if (prop === 'products') {
        target.products = [...val]

        // Dispathcing custom cart update Event
        const cartProductCountNode = document.querySelector('#cartProductCount')
        if (cartProductCountNode) cartProductCountNode.dispatchEvent(cartEvent)
    }

    return true
}

const initCart = async () => {

    console.log('window.CART before', window.CART);

    if (!window.CART) {
        const res = await fetch('/ajax/cart/get', { // /ajax/cart/get --- https://anaragaev.github.io/technolight.layout/mocks/cart-get.json
            method: 'POST'
        })

        if (res.ok) {
            const data = await res.json()

            window.CART = new Proxy({
                products: [...data]
            }, {
                get: cartGet,
                set: cartSet
            })


            console.log('Inicializing cart -------------------------- START');
            console.log('Response data', data)
            console.log('window.CART', window.CART)
            console.log('Inicializing cart -------------------------- FINISH');



        } else {
            console.error('Ошибка запроса Корзины! Код ошибки:', res.status)
        }
    }
}

window.addEventListener('load', () => {
    initCart()
})