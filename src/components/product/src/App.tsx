import { useEffect } from 'react'
import { useProduct } from './Store'
import Loader from './Components/Loader'
import Gallery from './Components/Gallery'
import Body from './Components/Body'

const ErrorComponent = () => {
	throw new Error("There's no correct product article at the data-product attribute!")
}

const App:React.FC = () => {
	const loading = useProduct(state => state.loading)
	const error = useProduct(state => state.error)
	const fetchProductInitData = useProduct(state => state.fetchProductInitData)

	useEffect(() => {
		fetchProductInitData()
	}, [fetchProductInitData])

	return (
		loading
			? <Loader />
			: error
				? <ErrorComponent />
				: <>
					<div className="col-12 col-lg-4">
						<Gallery />
					</div>
					<div className="col-12 col-lg-8">
						<Body />
					</div>
				</>
	)
}

export default App
