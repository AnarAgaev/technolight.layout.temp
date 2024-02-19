import { productInterface } from './types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

declare global {
    interface Window {
        getUrlParameterByName: (name: string, url?: string) => string | null
        productDataLink: string
    }
}

interface productStoreInterface {
    series: {
        title: string
        products_available: productInterface[]
        fields: Record<string, never>
        translate: Record<string, never>
        units: Record<string, never>
        videos: {[key: string]: string}[] | null
        specifications: { [key: string]: string } | null
        description: string | null
        files: {[key: string]: string}[] | null
    }

    current: productInterface
    loading: boolean
    error: Error | unknown
    selectsMap: productInterface

    fetchProductInitData: () => void
    setInitProduct: () => void
    updateProduct: (field: string, val: number | string | boolean | undefined) => void
}

const useProduct = create<productStoreInterface>()(devtools((set, get) => ({
    current: {
        article: '',
        price: 0,
        image: '',
        color: '',
        colorful_temperature: 0,
        light_flow: 0,
        power: 0,
        angle_of_light: 0,
        brightness_adjustment: false
    },

    series: {
        title: '',
        products_available: [],
        fields: {},
        translate: {},
        units: {},
        videos: null,
        specifications: null,
        description: null,
        files: null
    },

    loading: true,
    error: null,
    selectsMap: {},

    fetchProductInitData: async () => {
        set({ loading: true })

        let productDataLink = window.productDataLink

        if (!productDataLink) {
            productDataLink =
                // 'https://anaragaev.github.io/technolight.layout/mocks/globo-135-fixed.json'
                // 'https://anaragaev.github.io/technolight.layout/mocks/spot-42-empty.json'
                'https://anaragaev.github.io/technolight.layout/mocks/spot-42-fixed.json'
        }

        try {
            const res = await fetch(productDataLink)

            if (!res.ok) throw new Error('Failed to fetch json initial product data! Try again.')

            const json = await res.json()

            set(() => {
                return {
                    series: json.data,
                    loading: false,
                    error: null
                }
            })

            get().setInitProduct()

        } catch (error: Error | unknown) {
            set({ error: error })
        } finally {
            set({ loading: false })
        }
    },

    setInitProduct: () => {
        const products = get().series.products_available
        const fields = get().series.fields
        const selectsMap: productInterface = {}
        let article: string | undefined | null

        // For the testing, at first getting article from the URL
        article = window.getUrlParameterByName('article')

        if (!article) article = (document.querySelector('[data-product-article]') as HTMLElement).dataset.productArticle

        const currentProduct = products.filter(product => article === product.article)

        if (currentProduct.length !== 0) {
            // Add select map fro selects from current Product
            for (const prop in fields) {
                selectsMap[prop] = currentProduct[0][prop]
            }

            set({
                current: currentProduct[0],
                selectsMap
            })
        } else {
            throw new Error("There's no correct product article at the data-product attribute!")
        }
    },

    updateProduct: (field: string, value: number | string | boolean | undefined = undefined) => {
        let products = [...get().series.products_available]
        const currentProduct: productInterface = { ...get().current }
        const fields = get().series.fields
        let resetMarker = false // По этомоу маркеру отслеживаем, что обрабатываемое поле находится после кликнутого (ниже его) в списке выбираемых опций товара

        const selectsMap: productInterface = {}
        /**
         * Карта свойств по которым выводим селекты.
         * В свойствах перечислены все свойства селекта: color, power и т.д.
         *
         * selectsMap[prop] может принимать значения
         *
         * 1. текущее значнеие соответствующиего свойства активного продукта
         * 2. null - не имеет значения, НО может быть выбрано в селекте
         * 3. undefined - не имеет значения и не может быть выбрано в селекте
         */

        for (const prop in fields) {
            if (field === prop) { // Если выбранное поле равно текущему в цикле
                resetMarker = true
                selectsMap[prop] = value !== undefined ? value : null
                continue
            }

            if (resetMarker) {
                // Если в текущем массиве свойств есть только одно совойство, это занчит, что у всех товаров значение этого свойство идентично. Тогда сразу ставим его выбранным.
                if ((fields[prop] as unknown[]).length === 1 && value !== undefined) {
                    selectsMap[prop] = (fields[prop] as {value: string}[])[0].value;
                    continue
                }

                if (value) {
                    selectsMap[prop] = null
                    value = undefined
                } else {
                    selectsMap[prop] = undefined
                }

            } else {
                selectsMap[prop] = currentProduct[prop]
            }
        }

        const filteredProducts = (products: productInterface[], prop: string) => {
            return products.filter(product => {
                return product[prop] == selectsMap[prop]
            })
        }

        const getCheapestProduct = (products: productInterface[]) => {
            let minPrice = Infinity
            let cheapestProduct = {}

            for (const product of products) {
                if (typeof product.price !== 'number') continue

                if (product.price < minPrice) {
                    minPrice = product.price
                    cheapestProduct = product
                }

            }
            return cheapestProduct
        }

        // Filtering products
        console.log('Продукты до фильтрации', products);
        for (const prop in selectsMap) {
            if (selectsMap[prop]) {
                products = filteredProducts(products, prop)
            }
        }
        console.log('Продукты после фильтрации', products);

        const newProduct: productInterface = getCheapestProduct(products)
        console.log('Самый дешовый из отфильтрованных', newProduct)

        set({
            current: getCheapestProduct(products),
            selectsMap
        })
    }
})))

export default useProduct