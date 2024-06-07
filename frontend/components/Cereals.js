import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// !!!! note: real security is implemented in the back end!
// this is more like a better UI/UX, not exactly security
// even if it is called a 'protected' route, 
// the protection happens on the server

export default function Cereals() {
  const [cereals, setCereals] = useState([])
  const navigate = useNavigate()
  
  const logout = () => {
    // wipe the token from local storage
    localStorage.removeItem('token')
    // redirecting the user to login
    navigate('/')
  }

  useEffect(() => {
    // grab token from local storage
    const token = localStorage.getItem('token')
    // if not there, navigate user back to login screen
    if (!token) {
      navigate('/')
    } else {
      const fetchCereals = async () => {
        try {
          // Get cereals, appending token to Authorization header
          const response = await axios.get(
            '/api/cereals',
            { headers: { Authorization: token }}
          )
          // if res is ok set the cereals in component state
          setCereals(response.data)
        } catch (error) {
          // if res is a 401 Unauthorized perform a logout
          if (error?.response?.status == 401) logout()
        }
      }
      fetchCereals()
    }
  }, [])

  return (
    <div className="container">
      <h3>Cereals List <button onClick={logout}>Logout</button></h3>
      {cereals.length > 0 ? (
        <div>
          {cereals.map((cereal) => (
            <div key={cereal.id} style={{ marginBottom: '20px' }} className="cereal">
              <h4>{cereal.name}</h4>
              <p>Brand: {cereal.brand}</p>
              <p>Sugar content: {cereal.sugarContent}</p>
              <p>{cereal.history}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No cereals found.</p>
      )}
    </div>
  )
}
