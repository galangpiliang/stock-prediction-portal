import React, { useEffect } from 'react'
import axios from 'axios'

const Dashboard = () => {
	const accessToken = localStorage.getItem('accessToken')

	useEffect(() => {
		const fetchProtectedData = async () => {
			try {
				const response = await axios.get('http://127.0.0.1:8000/api/v1/protected-view', {
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				})
				console.log('Success:', response.data)
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}

		fetchProtectedData()
	}, [])

	return (
		<div className='text-light container'>Dashboard</div>
	)
}

export default Dashboard