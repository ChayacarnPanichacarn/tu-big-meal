// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import {Favourite, EditShop, Profile, SignIn, Homepage} from './components/pages'
import ShopPage from './components/pages/ShopPage'
import { UserProvider } from './context/UserContext'
import SuggestPage from './components/pages/SuggestPage'

function App() {

  return (
    <UserProvider>
      <div className='app'>
        <Navbar />

        <Routes>
          <Route path='/' element={<Homepage />}/>
          <Route path='/favourite' element={<Favourite />} />
          <Route path='/shop' element={<EditShop />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/shop-detail' element={<ShopPage />} />
          <Route path='/suggest-page' element={<SuggestPage />} />
        </Routes>
      </div>
    </UserProvider>
  )
}

export default App;
