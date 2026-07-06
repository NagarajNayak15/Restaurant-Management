import React from 'react'
import Navbar from '../other/Navbar.jsx'
import Categories from '../other/Categories'
import MenuCards from '../other/MenuCards.jsx'
import ViewCart from '../other/ViewCart.jsx'

const CustomerDashboard = () => {
  return (
    <div>
      <Navbar/>
      <Categories/>
      <MenuCards/> 
      <ViewCart/>
    </div>
  )
}

export default CustomerDashboard
