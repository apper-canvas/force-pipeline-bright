import { createContext, useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser } from '@/store/userSlice'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import { getRouteConfig, verifyRouteAccess } from '@/router/route.utils'

const Dashboard = lazy(() => import('@/components/pages/Dashboard'))
const Contacts = lazy(() => import('@/components/pages/Contacts'))
const ContactForm = lazy(() => import('@/components/pages/ContactForm'))
const Pipeline = lazy(() => import('@/components/pages/Pipeline'))
const DealForm = lazy(() => import('@/components/pages/DealForm'))
const Activities = lazy(() => import('@/components/pages/Activities'))
const ActivityForm = lazy(() => import('@/components/pages/ActivityForm'))
const NotFound = lazy(() => import('@/components/pages/NotFound'))
const Login = lazy(() => import('@/components/pages/Login'))
const Signup = lazy(() => import('@/components/pages/Signup'))
const Callback = lazy(() => import('@/components/pages/Callback'))
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'))
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'))
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'))

export const AuthContext = createContext(null)

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)
  const userState = useSelector((state) => state.user)
  const user = userState?.user || null
  
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true)
        let currentPath = window.location.pathname + window.location.search
        let redirectPath = new URLSearchParams(window.location.search).get('redirect')
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password')
        
        if (user) {
          if (redirectPath) {
            navigate(redirectPath)
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath)
            } else {
              navigate('/')
            }
          } else {
            navigate('/')
          }
          dispatch(setUser(JSON.parse(JSON.stringify(user))))
        } else {
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            )
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`)
            } else {
              navigate(currentPath)
            }
          } else if (isAuthPage) {
            navigate(currentPath)
          } else {
            navigate('/login')
          }
          dispatch(clearUser())
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error)
      }
    })
  }, [])

  useEffect(() => {
    if (isInitialized) {
      const config = getRouteConfig(location.pathname)
      const { allowed, redirectTo, excludeRedirectQuery } = verifyRouteAccess(config, user)
      
      if (!allowed && redirectTo) {
        const redirectPath = excludeRedirectQuery 
          ? redirectTo 
          : `${redirectTo}?redirect=${location.pathname}`
        navigate(redirectPath)
      }
    }
  }, [location.pathname, user, isInitialized])
  
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK
        await ApperUI.logout()
        dispatch(clearUser())
        navigate('/login')
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }
  }
  
  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path>
          <path d="m16.2 7.8 2.9-2.9"></path>
          <path d="M18 12h4"></path>
          <path d="m16.2 16.2 2.9 2.9"></path>
          <path d="M12 18v4"></path>
          <path d="m4.9 19.1 2.9-2.9"></path>
          <path d="M2 12h4"></path>
          <path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    )
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Suspense fallback={<div>Loading...</div>}><Login /></Suspense>} />
        <Route path="/signup" element={<Suspense fallback={<div>Loading...</div>}><Signup /></Suspense>} />
        <Route path="/callback" element={<Suspense fallback={<div>Loading...</div>}><Callback /></Suspense>} />
        <Route path="/error" element={<Suspense fallback={<div>Loading...</div>}><ErrorPage /></Suspense>} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<Suspense fallback={<div>Loading...</div>}><PromptPassword /></Suspense>} />
        <Route path="/reset-password/:appId/:fields" element={<Suspense fallback={<div>Loading...</div>}><ResetPassword /></Suspense>} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense>} />
          <Route path="contacts" element={<Suspense fallback={<div>Loading...</div>}><Contacts /></Suspense>} />
          <Route path="contacts/new" element={<Suspense fallback={<div>Loading...</div>}><ContactForm /></Suspense>} />
          <Route path="contacts/:id/edit" element={<Suspense fallback={<div>Loading...</div>}><ContactForm /></Suspense>} />
          <Route path="pipeline" element={<Suspense fallback={<div>Loading...</div>}><Pipeline /></Suspense>} />
          <Route path="deals/new" element={<Suspense fallback={<div>Loading...</div>}><DealForm /></Suspense>} />
          <Route path="deals/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><DealForm /></Suspense>} />
          <Route path="activities" element={<Suspense fallback={<div>Loading...</div>}><Activities /></Suspense>} />
          <Route path="activities/new" element={<Suspense fallback={<div>Loading...</div>}><ActivityForm /></Suspense>} />
          <Route path="*" element={<Suspense fallback={<div>Loading...</div>}><NotFound /></Suspense>} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </AuthContext.Provider>
  )
}

export default App