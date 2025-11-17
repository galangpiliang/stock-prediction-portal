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

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-6 mx-auto">
					<form action="">
						<input type="text" className='form-control' placeholder='Enter Stock Ticker' onChange={(e) => setStockTicker(e.target.value)} required />
						<button type="submit" className='btn btn-info mt-3'>See Prediction</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Dashboard