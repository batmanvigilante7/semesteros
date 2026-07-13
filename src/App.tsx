import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import Home from '@/pages/Home'
import Planner from '@/pages/Planner'
import Courses from '@/pages/Courses'
import Timeline from '@/pages/Timeline'
import Analytics from '@/pages/Analytics'
import Preferences from '@/pages/Preferences'
import Showcase from '@/pages/Showcase'
import Profile from '@/pages/Profile'
import { AcademicEngineProvider } from '@/stores/AcademicEngine'
import { ToastProvider } from '@/components/ui/Toast'
import ErrorBoundary from '@/components/ErrorBoundary'

const CourseDetail = lazy(() => import('@/pages/CourseDetail'))
const Resources = lazy(() => import('@/pages/Resources'))
const StudyWorkspace = lazy(() => import('@/pages/StudyWorkspace'))
const Welcome = lazy(() => import('@/pages/Welcome'))
const Auth = lazy(() => import('@/pages/Auth'))
const Onboarding = lazy(() => import('@/pages/Onboarding'))
const ImportWorkspace = lazy(() => import('@/pages/ImportWorkspace'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  return (
    <ErrorBoundary>
      <AcademicEngineProvider>
        <ToastProvider>
          <HashRouter>
          <Routes>
            <Route
              path="welcome"
              element={
                <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
                  <Welcome />
                </Suspense>
              }
            />
            <Route
              path="login"
              element={
                <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
                  <Auth />
                </Suspense>
              }
            />
            <Route
              path="signup"
              element={
                <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
                  <Auth />
                </Suspense>
              }
            />
            <Route
              path="forgot-password"
              element={
                <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
                  <Auth />
                </Suspense>
              }
            />
            <Route
              path="onboarding"
              element={
                <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
                  <Onboarding />
                </Suspense>
              }
            />
            <Route path="/" element={<AppShell />}>
              <Route index element={<Home />} />
              <Route path="planner" element={<Planner />} />
              <Route path="courses" element={<Courses />} />
              <Route
                path="resources"
                element={
                  <Suspense
                    fallback={
                      <div className="h-96 w-full flex flex-col justify-center items-center">
                        <div className="animate-pulse space-y-4 w-full max-w-2xl bg-surface border border-border-subtle rounded-3xl p-8">
                          <div className="h-8 bg-bg-tertiary rounded-xl w-1/3"></div>
                          <div className="h-4 bg-bg-tertiary rounded-lg w-2/3"></div>
                        </div>
                      </div>
                    }
                  >
                    <Resources />
                  </Suspense>
                }
              />
              <Route
                path="study"
                element={
                  <Suspense
                    fallback={
                      <div className="h-96 w-full flex flex-col justify-center items-center">
                        <div className="animate-pulse space-y-4 w-full max-w-2xl bg-surface border border-border-subtle rounded-3xl p-8">
                          <div className="h-8 bg-bg-tertiary rounded-xl w-1/3"></div>
                          <div className="h-4 bg-bg-tertiary rounded-lg w-2/3"></div>
                        </div>
                      </div>
                    }
                  >
                    <StudyWorkspace />
                  </Suspense>
                }
              />
              <Route
                path="courses/:subjectId"
                element={
                  <Suspense
                    fallback={
                      <div className="h-96 w-full flex flex-col justify-center items-center space-y-6">
                        <div className="animate-pulse space-y-4 w-full max-w-2xl bg-surface border border-border-subtle rounded-3xl p-8">
                          <div className="h-8 bg-bg-tertiary rounded-xl w-1/3"></div>
                          <div className="h-4 bg-bg-tertiary rounded-lg w-2/3"></div>
                          <div className="space-y-3 pt-6">
                            <div className="h-3 bg-bg-tertiary rounded-lg w-full"></div>
                            <div className="h-3 bg-bg-tertiary rounded-lg w-5/6"></div>
                            <div className="h-3 bg-bg-tertiary rounded-lg w-4/5"></div>
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <CourseDetail />
                  </Suspense>
                }
              />
              <Route path="timeline" element={<Timeline />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="preferences" element={<Preferences />} />
              <Route path="showcase" element={<Showcase />} />
              <Route path="profile" element={<Profile />} />
              <Route path="import" element={<ImportWorkspace />} />
            </Route>
            <Route
              path="*"
              element={
                <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center font-bold">Loading...</div>}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </AcademicEngineProvider>
  </ErrorBoundary>
  )
}
