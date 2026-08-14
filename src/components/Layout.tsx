import { Outlet } from 'react-router'
import Navbar from './Navbar'

/** Shared chrome for every route, so the navbar persists across navigation. */
export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
