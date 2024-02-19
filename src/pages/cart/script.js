const updateProductSum = (inputNode, isInc) => {

    const value = parseInt(inputNode.value)
    const calc = inputNode.closest('.cart__calc')

    const sumNode = calc.querySelector('[data-total]')
    const priceNode = calc.querySelector('[data-price]')
    const price = parseFloat(priceNode.innerText.replace(/\s/g, ""))

    const totalNode = document.querySelector('#total')
    const total = parseFloat(totalNode.innerText.replace(/\s/g, ""))

    const totalValue = isInc ? total + price : total - price

    sumNode.innerText = formatNumber(price * value)
    totalNode.innerText = formatNumber(Math.abs(totalValue))
}

const cartRequest = window.throttle(function(code, val) {
    window.setProductToCart({ art: code, count: val })
}, 3000)

const initCartCounter = () => {
    const btns = Array.from(document.querySelectorAll('.cart__calc-counter button'))

    btns.forEach(el => {
        el.addEventListener('click', function() {
            const isInc = this.dataset.type === 'inc'
            const input = this.parentNode.querySelector('input')
            const decBtn = this.parentNode.querySelector('[data-type="dec"')
            let val = input.value

            val = isInc
                ? parseInt(val) + 1
                : parseInt(val) - 1

            if (val === 0) val++

            decBtn.disabled = !(val > 1)

            input.value = val

            updateProductSum(input, isInc)


            // *** Сейчас добавляем товары в корзину на бэке только для товаров !!!!!!
            // *** Когда решится вопрос с реализацией Дотов, нужно будет дописать код и для них !!!!!!
            const cartItem = this.closest('.cart__item')

            if (!cartItem) return

            const code = cartItem.querySelector('.cart__title').innerText
            cartRequest(code, val)
        })
    })
}

const getTotalValue = () => {
    const cartTotal = document.getElementById('total')
    const total = cartTotal.innerText
    return parseInt(total.replace(/\s/g, ""))
}

const updateTotalPrice = (val) => {
    const cartTotal = document.getElementById('total')
    cartTotal.innerText = formatNumber(getTotalValue() + val)
}

const resetTotalText = () => {
    const totalText = document.querySelector('.cart__total')
    const orderBtn = document.querySelector('.cart__actions-btns .btn_dark')

    totalText.style.justifyContent = 'center'
    totalText.innerHTML = '<mark>В корзине нет товаров</mark>'
    orderBtn.remove()
}

const checkTotalPrice = () => {
    const total = getTotalValue()
    if (total <= 0) resetTotalText()
}

const delProduct = (el) => {
    let height = el.offsetHeight

    el.style.maxHeight = height + 'px'

    setTimeout(() => el.classList.add('removed'), 10)
    setTimeout(() => el.remove(), 1000)
    setTimeout(() => {
        showAnimElements()
        setAnimationElms()
    }, 300)
}

const initDelProdBtns = () => {
    const btns = Array.from(document.querySelectorAll('.cart__calc .btn_del'))

    btns.forEach(el => el.addEventListener('click', function() {
        const product = el.closest('[data-product]')
        const totalText = product.querySelector('[data-total]').innerText
        const total = parseInt(totalText.replace(/\s/g, ""))
        const subtitle = product.querySelector('.cart__subtitle')

        delProduct(product)
        updateTotalPrice(total * -1)
        checkTotalPrice()

        const cartItem = this.closest('.cart__item')

        if (!cartItem) return

        const input = cartItem.querySelector('input')
        const code = cartItem.querySelector('.cart__title').innerText

        // Remove current product from Cart Global Object (window.CART)
        window.removeProductFromCart({ art: code, count: parseInt(input.value) })

        showModalMsg(subtitle.innerText, 'Удален из корзины')
    }))
}

const setErrorOnController = (inputNode, errorText) => {
    const container = inputNode.parentNode
    const message = container.querySelector('.error-message')

    container.classList.add('has-error')
    message.innerText = errorText

    inputNode.addEventListener('input', () => {
        container.classList.remove('has-error')
    })
}

const resetErrorOnController = (inputNode) => {
    inputNode.parentNode.classList.remove('has-error')
}

const clearCart = () => {
    const products = Array.from(document.querySelectorAll('[data-product]'))
    products.forEach(el => delProduct(el))
    resetTotalText()
}

const initOrderSubmit = () => {
    const form = document.getElementById('setOrderForm')
    const formValid = {name: true, phone: true, email: true}
    const phoneNumber = form.querySelector('[name="phone"]')

    // Phone masking
    const phoneMaskOptions = {
        mask: '+{7} (000) 000-00-00',
        lazy: true,
        placeholderChar: '#'
    }
    const phoneMask = IMask(
        phoneNumber,
        phoneMaskOptions
    )

    phoneNumber.addEventListener('focus', () => phoneMask.updateOptions({lazy: false}))
    phoneNumber.addEventListener('blur', () => phoneMask.updateOptions({lazy: true}))

    form.addEventListener('submit', function(e) {
        e.preventDefault()

        const name  = this.querySelector('[name="name"]')
        const phone = this.querySelector('[name="phone"]')
        const email = this.querySelector('[name="email"]')

        // Check name
        if (name.value === '') {
            setErrorOnController(name, 'Заполните поле ФИО')
            formValid.name = false
        } else {
            resetErrorOnController(name)
            formValid.name = true
        }

        // Check phone
        if (phone.value === '') {
            setErrorOnController(phone, 'Заполните поле Телефон')
            formValid.phone = false
        } else {

            if (window.validatePhone(parseInt(phoneMask.unmaskedValue))) {
                resetErrorOnController(phone)
                formValid.phone = true
            } else {
                setErrorOnController(phone, 'Некорректный номер телефона')
                formValid.phone = false
            }
        }

        // Check email
        if (email.value !== '') {
            if (window.validateEmail(email.value)) {
                resetErrorOnController(email)
                formValid.email = true
            } else {
                setErrorOnController(email, 'Некорректный адрес электронной почты')
                formValid.email = false
            }
        } else {
            resetErrorOnController(email)
            formValid.email = true
        }

        // Senging form data
        if (formValid.name && formValid.phone && formValid.email) {

            console.log('Send fromData to back -------------------------------------');
            const formData = new FormData(form);
            for (let [name, value] of formData) {
                console.log(`${name}: ${value}`);
            }

            form.reset()
            clearCart()
            toggleModalDialog('#orderSentMsg')
        }
    })
}

window.addEventListener('load', () => {
    initCartCounter()
    initDelProdBtns()
    initOrderSubmit()
})
