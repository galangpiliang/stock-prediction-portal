import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosInstance'

const Dashboard = () => {
	const [stockTicker, setStockTicker] = useState('')

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

		try {
			const response = await axiosInstance.post('/predict/', { ticker: stockTicker })
			console.log('Prediction response:', response.data)
		} catch (error) {
			console.error('Error fetching prediction:', error)
		}
	}

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-6 mx-auto">
					<form onSubmit={handleSubmit}>
						<input type="text" className='form-control' placeholder='Enter Stock Ticker' onChange={(e) => setStockTicker(e.target.value)} required />
						<button type="submit" className='btn btn-info mt-3'>See Prediction</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Dashboard