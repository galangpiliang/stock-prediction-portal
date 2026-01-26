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
	const [predVsOrigPlot, setPredVsOrigPlot] = useState(null)
	const [mse, setMse] = useState(null)
	const [rmse, setRmse] = useState(null)
	const [r2, setR2] = useState(null)

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
			const plotUrl = `data:image/png;base64,${response.data.plot_image}`
			const ma100PlotUrl = `data:image/png;base64,${response.data.plot_100_dma}`
			const ma200PlotUrl = `data:image/png;base64,${response.data.plot_200_dma}`
			const predVsOrigPlotUrl = `data:image/png;base64,${response.data.plot_pred_vs_orig}`

			setPlot(plotUrl)
			setMa100Plot(ma100PlotUrl)
			setMa200Plot(ma200PlotUrl)
			setPredVsOrigPlot(predVsOrigPlotUrl)
			setMse(response.data.mse)
			setRmse(response.data.rmse)
			setR2(response.data.r2)
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
		<div className="container p-3">
			<div className="row">
				<div className="col-md-6 mx-auto">
					<form onSubmit={handleSubmit}>
						<input type="text" className='form-control mb-2' placeholder="Enter Stock Ticker (e.g., AAPL, TSLA)" onChange={(e) => setStockTicker(e.target.value)} required />
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
						{loading && (
							<div className="mt-2 text-warning">
								This website runs on free hosting with limited resources.
								Stock prediction may take up to 2 minutes. Thank you for your patience!
							</div>
						)}
					</form>
				</div>
				{/* Display the plot image if available */}
				{plot && (
					<div className="mt-4">
						<div className="p-3">
							<img src={plot} alt={`Stock plot for ${stockTicker.toUpperCase()}`} className="img-fluid" />
						</div>
						<div className="p-3">
							<img src={ma100Plot} alt={`100-day moving average plot for ${stockTicker.toUpperCase()}`} className="img-fluid" />
						</div>
						<div className="p-3">
							<img src={ma200Plot} alt={`200-day moving average plot for ${stockTicker.toUpperCase()}`} className="img-fluid" />
						</div>
						<div className="p-3">
							<img src={predVsOrigPlot} alt={`Prediction vs Original plot for ${stockTicker.toUpperCase()}`} className="img-fluid" />
						</div>
						<div className="text-light p-3">
							<h4>Model Evaluation</h4>
							<p>Mean Square Error (MSE): {mse}</p>
							<p>Root Mean Square Error (RMSE): {rmse}</p>
							<p>R-squared (R2) Score: {r2}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Dashboard