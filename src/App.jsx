/* eslint-disable react/react-in-jsx-scope */
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './pages/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import User from './pages/user/User'
import Login from './pages/login/Login'
import NotFound from './pages/notfound/NotFound'
import WebDev from './pages/services/webDev/WebDev'
import AppDev from './pages/services/appDev/AppDev'
import Graphic from './pages/services/graphic/Graphic'
import Team from './pages/team/Team'
import Blog from './pages/blog/Blog'
import TrustBy from './pages/trustby/TrustBy'
import Order from './pages/order/Order'
import UserDetails from './pages/user/UserDetails'
import { useAuth } from './context/AuthProvider'
import { useEffect } from 'react'

function App() {
  const { token } = useAuth()

  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Navigate to={token ? 'admin/dashboard' : 'admin/login'} />} />
        <Route path='admin/login' element={token ? <Navigate to='admin/dashboard' /> : <Login />} />
        <Route element={token ? <Layout /> : <Login />}>
          <Route path='admin/dashboard' element={<Dashboard />} />
          <Route path='admin/users' element={<User />} />
          <Route path='admin/users/details/:id' element={<UserDetails />} />
          <Route path='admin/orders' element={<Order />} />
          <Route path='admin/service/web' element={<WebDev />} />
          <Route path='admin/service/app' element={<AppDev />} />
          <Route path='admin/service/graphic' element={<Graphic />} />
          <Route path='admin/team' element={<Team />} />
          <Route path='admin/blog' element={<Blog />} />
          <Route path='admin/trustby' element={<TrustBy />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
