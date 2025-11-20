import { useEffect, useState } from 'react'
import axiosInstance from '../../axiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
	const [stockTicker, setStockTicker] = useState('')
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)
	const [loading, SetLoading] = useState(false)
	const [plot, setPlot] = useState(null)
	const [ma100Plot, setMa100Plot] = useState(null)
	const [ma200Plot, setMa200Plot] = useState(null)

	useEffect(() => {
		const fetchProtectedData = async () => {
			try {
				const response = await axiosInstance.get('/protected-view')
				console.log('Success:', response)
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}

		fetchProtectedData()
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError(null)
		setSuccess(null)
		SetLoading(true)

		try {
			const response = await axiosInstance.post('/predict/', { ticker: stockTicker })
			console.log('Prediction response:', response.data)
			setSuccess(`Success get the data for ticker ${stockTicker.toUpperCase()}`)

			// Set the plot URL from the response
			const backendRoot = import.meta.env.VITE_BACKEND_ROOT
			const plotUrl = backendRoot + response.data.plot_image 
			const ma100PlotUrl = backendRoot + response.data.plot_100_dma
			const ma200PlotUrl = backendRoot + response.data.plot_200_dma
			setPlot(plotUrl)
			setMa100Plot(ma100PlotUrl)
			setMa200Plot(ma200PlotUrl)
		} catch (error) {
			console.error('Error fetching prediction:', error)
			
			const message =
			error.response?.data?.error ||      // backend error message
			error.message ||                    // axios/network error
			"An unexpected error occurred";     // fallback
			setError(message)
		}finally{
            SetLoading(false)
        }
	}

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-6 mx-auto">
					<form onSubmit={handleSubmit}>
						<input type="text" className='form-control mb-2' placeholder='Enter Stock Ticker' onChange={(e) => setStockTicker(e.target.value)} required />
						<small>
							{error && <div className="text-danger">{error}</div>}
							{success && <div className="text-info">{success}</div>}
						</small>
							<button type='submit' className="btn btn-info mt-3">
								{
									loading ? (
										<span><FontAwesomeIcon icon={faSpinner} spin /> Getting Prediction...</span>
									) : (
										"See Prediction"
									)
								}
							</button>
					</form>
				</div>
				{/* Display the plot image if available */}
				{plot && (
					<div className="mt-4">
						<div className="p-5">
							<img src={plot} alt={`Stock plot for ${stockTicker.toUpperCase()}`} className="img-fluid" />
						</div>
						<div className="p-5">
							<img src={ma100Plot} alt={`100-day moving average plot for ${stockTicker.toUpperCase()}`} className="img-fluid" />
						</div>
						<div className="p-5">
							<img src={ma200Plot} alt={`200-day moving average plot for ${stockTicker.toUpperCase()}`} className="img-fluid" />
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Dashboard