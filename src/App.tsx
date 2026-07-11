import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import Home from '@/pages/Home'
import Planner from '@/pages/Planner'
import Courses from '@/pages/Courses'
import CourseDetail from '@/pages/CourseDetail'
import Timeline from '@/pages/Timeline'
import Insights from '@/pages/Insights'
import Preferences from '@/pages/Preferences'
import Showcase from '@/pages/Showcase'
import { AcademicEngineProvider } from '@/stores/AcademicEngine'
import { ToastProvider } from '@/components/ui/Toast'

export default function App() {
  return (
    <AcademicEngineProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="planner" element={<Planner />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:subjectId" element={<CourseDetail />} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="insights" element={<Insights />} />
              <Route path="preferences" element={<Preferences />} />
              <Route path="showcase" element={<Showcase />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AcademicEngineProvider>
  )
}
