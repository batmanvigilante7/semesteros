import { useState, useRef, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  GraduationCap,
  Upload,
  Save,
  Download,
  MapPin,
  Mail,
  Trash2,
  Settings,
  Sparkles,
  Info,
  ShieldAlert,
} from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useCourseStore, useAssignmentStore, useStudyStore } from '@/stores/AcademicEngine'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// Animation presets

export default function Profile() {
  const {
    profile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    completionPercentage,
  } = useProfile()

  const { courses } = useCourseStore()
  const { assignments } = useAssignmentStore()
  const { studySessions } = useStudyStore()

  // Form states
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('academic')
  const [zoomLevel, setZoomLevel] = useState(1.0)
  const [dragActive, setDragActive] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)

  // Local form state
  const [formData, setFormData] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    email: profile.email || '',
    phone: profile.phone || '',
    university: profile.university || '',
    department: profile.department || '',
    semester: profile.semester || '',
    branch: profile.branch || '',
    rollNumber: profile.rollNumber || '',
    section: profile.section || '',
    academicYear: profile.academicYear || '',
    expectedGraduation: profile.expectedGraduation || '',
    careerGoal: profile.careerGoal || '',

    apaarId: profile.apaarId || '',
    campus: profile.campus || '',
    college: profile.college || '',
    batch: profile.batch || '',
    degree: profile.degree || '',
    program: profile.program || '',
    currentYear: profile.currentYear || '',
    academicAdvisor: profile.academicAdvisor || '',
    studentStatus: profile.studentStatus || '',

    dob: profile.dob || '',
    gender: profile.gender || '',
    nationality: profile.nationality || '',
    religion: profile.religion || '',
    category: profile.category || '',
    bloodGroup: profile.bloodGroup || '',
    aadharNumber: profile.aadharNumber || '',
    passportNumber: profile.passportNumber || '',

    alternateEmail: profile.alternateEmail || '',
    parentPhone: profile.parentPhone || '',
    emergencyContact: profile.emergencyContact || '',
    linkedin: profile.linkedin || '',
    github: profile.github || '',
    portfolio: profile.portfolio || '',

    fatherName: profile.fatherName || '',
    motherName: profile.motherName || '',
    guardianName: profile.guardianName || '',
    guardianContact: profile.guardianContact || '',

    permanentAddress: profile.permanentAddress || '',
    currentAddress: profile.currentAddress || '',
    city: profile.city || '',
    district: profile.district || '',
    state: profile.state || '',
    country: profile.country || '',
    postalCode: profile.postalCode || '',

    theme: profile.theme || 'dark',
    accentColor: profile.accentColor || '#6FA8FF',
    language: profile.language || 'en',
    dateFormat: profile.dateFormat || 'YYYY-MM-DD',
    timeFormat: profile.timeFormat || '12h',
    timezone: profile.timezone || 'UTC',
  })

  // Sync state if profile changes (e.g. on import)
  useEffect(() => {
    setFormData({
      name: profile.name || '',
      bio: profile.bio || '',
      email: profile.email || '',
      phone: profile.phone || '',
      university: profile.university || '',
      department: profile.department || '',
      semester: profile.semester || '',
      branch: profile.branch || '',
      rollNumber: profile.rollNumber || '',
      section: profile.section || '',
      academicYear: profile.academicYear || '',
      expectedGraduation: profile.expectedGraduation || '',
      careerGoal: profile.careerGoal || '',
      apaarId: profile.apaarId || '',
      campus: profile.campus || '',
      college: profile.college || '',
      batch: profile.batch || '',
      degree: profile.degree || '',
      program: profile.program || '',
      currentYear: profile.currentYear || '',
      academicAdvisor: profile.academicAdvisor || '',
      studentStatus: profile.studentStatus || '',
      dob: profile.dob || '',
      gender: profile.gender || '',
      nationality: profile.nationality || '',
      religion: profile.religion || '',
      category: profile.category || '',
      bloodGroup: profile.bloodGroup || '',
      aadharNumber: profile.aadharNumber || '',
      passportNumber: profile.passportNumber || '',
      alternateEmail: profile.alternateEmail || '',
      parentPhone: profile.parentPhone || '',
      emergencyContact: profile.emergencyContact || '',
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      portfolio: profile.portfolio || '',
      fatherName: profile.fatherName || '',
      motherName: profile.motherName || '',
      guardianName: profile.guardianName || '',
      guardianContact: profile.guardianContact || '',
      permanentAddress: profile.permanentAddress || '',
      currentAddress: profile.currentAddress || '',
      city: profile.city || '',
      district: profile.district || '',
      state: profile.state || '',
      country: profile.country || '',
      postalCode: profile.postalCode || '',
      theme: profile.theme || 'dark',
      accentColor: profile.accentColor || '#6FA8FF',
      language: profile.language || 'en',
      dateFormat: profile.dateFormat || 'YYYY-MM-DD',
      timeFormat: profile.timeFormat || '12h',
      timezone: profile.timezone || 'UTC',
    })
  }, [profile])

  // Drag and drop image handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadAvatar(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadAvatar(e.target.files[0])
    }
  }

  // Profile Save
  const handleSave = () => {
    updateProfile(formData)
    setIsEditing(false)
  }

  // Export JSON
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `${profile.name || 'student'}_semesteros_profile.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string)
          updateProfile(parsed)
          alert('Profile configurations imported successfully!')
        } catch (err) {
          alert('Failed to parse JSON file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  // List of missing important fields for the completeness score
  const missingFieldsList = useMemo(() => {
    const fieldsToTrack: { key: keyof typeof formData; label: string }[] = [
      { key: 'name', label: 'Full Name' },
      { key: 'email', label: 'Primary Email' },
      { key: 'phone', label: 'Mobile Number' },
      { key: 'university', label: 'University' },
      { key: 'rollNumber', label: 'Registration Number' },
      { key: 'degree', label: 'Degree' },
      { key: 'program', label: 'Program' },
      { key: 'dob', label: 'Date of Birth' },
      { key: 'gender', label: 'Gender' },
      { key: 'aadharNumber', label: 'Aadhar Number' },
      { key: 'permanentAddress', label: 'Permanent Address' },
      { key: 'fatherName', label: "Father's Name" },
      { key: 'linkedin', label: 'LinkedIn Url' },
    ]
    return fieldsToTrack.filter((f) => !formData[f.key]).map((f) => f.label)
  }, [formData])

  // Academic statistics derivations
  const totalStudyMinutes = studySessions.reduce((sum, s) => sum + s.duration, 0)
  const totalStudyHours = Math.round((totalStudyMinutes / 60) * 10) / 10
  
  let totalTopics = 0
  let completedTopics = 0
  let totalHoursRemaining = 0
  courses.forEach((c) => {
    c.modules.forEach((m) => {
      m.topics.forEach((t) => {
        totalTopics++
        if (t.status === 'Completed') {
          completedTopics++
        } else {
          totalHoursRemaining += t.estimatedStudyTime || t.duration || 1
        }
      })
    })
  })

  const averageCompletion = courses.length > 0 
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length) 
    : 0

  const pendingAssignments = assignments.filter((a) => a.status !== 'completed').length

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12 text-left"
    >
      {/* 1. STUDENT IDENTITY COMMAND HEADER */}
      <Card className="overflow-hidden border border-border-subtle bg-surface shadow-subtle p-0 rounded-[28px] relative">
        <div className="h-36 w-full bg-gradient-to-r from-primary/10 via-accent-indigo/15 to-accent-rose/10 relative" />
        
        <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
            {/* Avatar Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative h-28 w-28 rounded-full border-4 border-surface shadow-soft bg-surface cursor-pointer overflow-hidden transition-all duration-300 ${
                dragActive ? 'border-primary scale-105' : 'hover:scale-[1.02]'
              }`}
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name || 'Student'}
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="h-full w-full object-cover rounded-full transition-transform duration-300"
                />
              ) : (
                <div className="h-full w-full bg-accent-indigo text-white flex items-center justify-center font-bold text-3xl">
                  {formData.name ? formData.name.substring(0, 2).toUpperCase() : 'ID'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                <Upload className="h-5 w-5 mb-1" />
                <span className="text-[9px] font-bold uppercase">Upload</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge variant="indigo">{formData.degree || 'Degree Not Set'}</Badge>
                <Badge variant="teal">{formData.program || 'Program Not Set'}</Badge>
                <Badge variant="orange">{formData.semester || 'Semester Not Set'}</Badge>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                {formData.name || 'Enter Full Name'}
              </h2>
              <p className="text-xs text-text-secondary">
                {formData.university || 'Enter University Name'} • Dept: {formData.department || 'Enter Department'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end">
            {/* Completion Percentage */}
            <div className="min-w-[200px] rounded-xl border border-border-subtle bg-bg-secondary/40 p-3.5 shadow-subtle">
              <div className="flex items-center justify-between text-[10px] font-bold text-text-tertiary">
                <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-accent-amber" /> PROFILE COMPLEXITY</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-500" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {profile.avatarUrl && (
                <Button variant="outline" size="sm" onClick={removeAvatar} className="border-accent-rose/20 text-accent-rose hover:bg-accent-rose/5">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              {isEditing ? (
                <Button size="sm" onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" /> Save
                </Button>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                  <Save className="h-4 w-4" /> Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Zoom slider in edit mode */}
        {isEditing && profile.avatarUrl && (
          <div className="px-8 pb-4 flex items-center gap-3 text-xs font-semibold text-text-secondary">
            <span>Avatar Zoom:</span>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="w-32 accent-primary"
            />
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        
        {/* LEFT COLUMN: EDITABLE FORMS BY CATEGORY */}
        <div className="space-y-6">
          {/* Tab Selection */}
          <div className="flex border-b border-border-subtle overflow-x-auto no-scrollbar gap-1 py-1">
            {[
              { id: 'academic', label: 'Academic Profile', icon: GraduationCap },
              { id: 'personal', label: 'Personal Information', icon: User },
              { id: 'contact', label: 'Contact Details', icon: Mail },
              { id: 'family', label: 'Family details', icon: Info },
              { id: 'address', label: 'Address info', icon: MapPin },
              { id: 'preferences', label: 'System Prefs', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "text-accent-blue bg-bg-primary shadow-subtle border border-border-subtle"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <Card className="rounded-[24px] p-6 border-border-subtle bg-surface/75 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="grid gap-4 sm:grid-cols-2 text-left"
              >
                {/* TAB 1: ACADEMIC PROFILE */}
                {activeTab === 'academic' && (
                  <>
                    <ProfileField
                      label="Roll / Registration Number"
                      value={formData.rollNumber}
                      placeholder="Enter registration number"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('rollNumber', val)}
                    />
                    <ProfileField
                      label="APAAR ID"
                      value={formData.apaarId}
                      placeholder="Enter APAAR ID"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('apaarId', val)}
                    />
                    <ProfileField
                      label="University / Institution"
                      value={formData.university}
                      placeholder="Enter university name"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('university', val)}
                    />
                    <ProfileField
                      label="College Name"
                      value={formData.college}
                      placeholder="Enter college campus name"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('college', val)}
                    />
                    <ProfileField
                      label="Campus Location"
                      value={formData.campus}
                      placeholder="Select campus location"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('campus', val)}
                    />
                    <ProfileField
                      label="Degree"
                      value={formData.degree}
                      placeholder="Select degree (e.g. B.Tech)"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('degree', val)}
                    />
                    <ProfileField
                      label="Program / Branch"
                      value={formData.program}
                      placeholder="Enter program (e.g. CSE)"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('program', val)}
                    />
                    <ProfileField
                      label="Department"
                      value={formData.department}
                      placeholder="Enter department name"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('department', val)}
                    />
                    <ProfileField
                      label="Batch Year"
                      value={formData.batch}
                      placeholder="Enter batch (e.g. 2024-2028)"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('batch', val)}
                    />
                    <ProfileField
                      label="Current Year"
                      value={formData.currentYear}
                      placeholder="Select current year"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('currentYear', val)}
                    />
                    <ProfileField
                      label="Current Semester"
                      value={formData.semester}
                      placeholder="Select semester (e.g. Semester 3)"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('semester', val)}
                    />
                    <ProfileField
                      label="Section"
                      value={formData.section}
                      placeholder="Enter current section"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('section', val)}
                    />
                    <ProfileField
                      label="Academic Advisor"
                      value={formData.academicAdvisor}
                      placeholder="Enter advisor name"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('academicAdvisor', val)}
                    />
                    <ProfileField
                      label="Student Status"
                      value={formData.studentStatus}
                      placeholder="Enter status (e.g. Active)"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('studentStatus', val)}
                    />
                  </>
                )}

                {/* TAB 2: PERSONAL INFORMATION */}
                {activeTab === 'personal' && (
                  <>
                    <ProfileField
                      label="Full Name"
                      value={formData.name}
                      placeholder="Enter full name"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('name', val)}
                    />
                    <ProfileField
                      label="Date of Birth"
                      value={formData.dob}
                      placeholder="Enter DOB (e.g. YYYY-MM-DD)"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('dob', val)}
                    />
                    <ProfileField
                      label="Gender"
                      value={formData.gender}
                      placeholder="Select gender"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('gender', val)}
                    />
                    <ProfileField
                      label="Nationality"
                      value={formData.nationality}
                      placeholder="Enter nationality"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('nationality', val)}
                    />
                    <ProfileField
                      label="Religion"
                      value={formData.religion}
                      placeholder="Enter religion"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('religion', val)}
                    />
                    <ProfileField
                      label="Category"
                      value={formData.category}
                      placeholder="Enter category (e.g. General)"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('category', val)}
                    />
                    <ProfileField
                      label="Blood Group"
                      value={formData.bloodGroup}
                      placeholder="Enter blood group"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('bloodGroup', val)}
                    />
                    <ProfileField
                      label="Aadhar Number"
                      value={formData.aadharNumber}
                      placeholder="Enter Aadhar Number"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('aadharNumber', val)}
                    />
                    <ProfileField
                      label="Passport Number"
                      value={formData.passportNumber}
                      placeholder="Enter Passport Number (optional)"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('passportNumber', val)}
                    />
                  </>
                )}

                {/* TAB 3: CONTACT INFORMATION */}
                {activeTab === 'contact' && (
                  <>
                    <ProfileField
                      label="Primary Email"
                      value={formData.email}
                      placeholder="Enter institutional email"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('email', val)}
                    />
                    <ProfileField
                      label="Alternate Email"
                      value={formData.alternateEmail}
                      placeholder="Enter alternate email"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('alternateEmail', val)}
                    />
                    <ProfileField
                      label="Mobile Number"
                      value={formData.phone}
                      placeholder="Enter mobile number"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('phone', val)}
                    />
                    <ProfileField
                      label="Parent Mobile"
                      value={formData.parentPhone}
                      placeholder="Enter parent mobile number"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('parentPhone', val)}
                    />
                    <ProfileField
                      label="Emergency Contact"
                      value={formData.emergencyContact}
                      placeholder="Enter emergency contact info"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('emergencyContact', val)}
                    />
                    <ProfileField
                      label="LinkedIn Url"
                      value={formData.linkedin}
                      placeholder="Enter LinkedIn link"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('linkedin', val)}
                    />
                    <ProfileField
                      label="GitHub Username"
                      value={formData.github}
                      placeholder="Enter GitHub link"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('github', val)}
                    />
                    <ProfileField
                      label="Portfolio Website"
                      value={formData.portfolio}
                      placeholder="Enter portfolio website link"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('portfolio', val)}
                    />
                  </>
                )}

                {/* TAB 4: FAMILY DETAILS */}
                {activeTab === 'family' && (
                  <>
                    <ProfileField
                      label="Father's Name"
                      value={formData.fatherName}
                      placeholder="Enter father's name"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('fatherName', val)}
                    />
                    <ProfileField
                      label="Mother's Name"
                      value={formData.motherName}
                      placeholder="Enter mother's name"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('motherName', val)}
                    />
                    <ProfileField
                      label="Guardian Name"
                      value={formData.guardianName}
                      placeholder="Enter guardian name"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('guardianName', val)}
                    />
                    <ProfileField
                      label="Guardian Contact"
                      value={formData.guardianContact}
                      placeholder="Enter guardian contact number"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('guardianContact', val)}
                    />
                  </>
                )}

                {/* TAB 5: ADDRESS DETAILS */}
                {activeTab === 'address' && (
                  <>
                    <ProfileField
                      label="Permanent Address"
                      value={formData.permanentAddress}
                      placeholder="Enter permanent address"
                      isEditing={isEditing}
                      isMultiline
                      onChange={(val) => handleInputChange('permanentAddress', val)}
                    />
                    <ProfileField
                      label="Current Address"
                      value={formData.currentAddress}
                      placeholder="Enter current address"
                      isEditing={isEditing}
                      isMultiline
                      onChange={(val) => handleInputChange('currentAddress', val)}
                    />
                    <ProfileField
                      label="City"
                      value={formData.city}
                      placeholder="Enter city"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('city', val)}
                    />
                    <ProfileField
                      label="District"
                      value={formData.district}
                      placeholder="Enter district"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('district', val)}
                    />
                    <ProfileField
                      label="State"
                      value={formData.state}
                      placeholder="Enter state"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('state', val)}
                    />
                    <ProfileField
                      label="Country"
                      value={formData.country}
                      placeholder="Enter country"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('country', val)}
                    />
                    <ProfileField
                      label="Postal Code"
                      value={formData.postalCode}
                      placeholder="Enter postal code"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('postalCode', val)}
                    />
                  </>
                )}

                {/* TAB 6: PREFERENCES */}
                {activeTab === 'preferences' && (
                  <>
                    <ProfileField
                      label="System Theme"
                      value={formData.theme}
                      placeholder="Select theme (dark/light)"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('theme', val)}
                    />
                    <ProfileField
                      label="Accent Color"
                      value={formData.accentColor}
                      placeholder="Select accent color (hex)"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('accentColor', val)}
                    />
                    <ProfileField
                      label="Language"
                      value={formData.language}
                      placeholder="Select language"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('language', val)}
                    />
                    <ProfileField
                      label="Date Format"
                      value={formData.dateFormat}
                      placeholder="Select date format"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('dateFormat', val)}
                    />
                    <ProfileField
                      label="Time Format"
                      value={formData.timeFormat}
                      placeholder="Select time format (12h/24h)"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('timeFormat', val)}
                    />
                    <ProfileField
                      label="Timezone"
                      value={formData.timezone}
                      placeholder="Select timezone"
                      isEditing={isEditing}
                      onChange={(val) => handleInputChange('timezone', val)}
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>

        {/* RIGHT COLUMN: ACADEMIC SUMMARY & QUICK ACTIONS */}
        <div className="space-y-6">
          {/* Missing fields notification */}
          {missingFieldsList.length > 0 && (
            <Card className="rounded-[24px] p-5 border-amber-500/20 bg-amber-500/5 text-amber-500 flex gap-3 text-left">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Incomplete Identity Profile</h4>
                <p className="text-[10px] text-amber-500/80 mt-1 leading-relaxed">
                  Fill in the missing details to complete your academic command profile:
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {missingFieldsList.slice(0, 4).map((lbl, idx) => (
                    <span key={idx} className="bg-amber-500/10 text-[9px] px-1.5 py-0.5 rounded font-semibold border border-amber-500/10">
                      {lbl}
                    </span>
                  ))}
                  {missingFieldsList.length > 4 && (
                    <span className="text-[9px] font-bold text-amber-500/70 pt-0.5">
                      +{missingFieldsList.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* ACADEMIC SUMMARY */}
          <Card className="rounded-[24px] p-6 border-border-subtle space-y-4 text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-primary" /> Academic Summary
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Registered Courses</span>
                <span className="font-bold text-text-primary">{courses.length} subjects</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-border-subtle/50 pt-3">
                <span className="text-text-secondary">Overall Syllabus Progress</span>
                <span className="font-bold text-text-primary">{averageCompletion}%</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-border-subtle/50 pt-3">
                <span className="text-text-secondary">Total Study Time</span>
                <span className="font-bold text-text-primary">{totalStudyHours} Hours</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-border-subtle/50 pt-3">
                <span className="text-text-secondary">Checklist Completion</span>
                <span className="font-bold text-text-primary">{completedTopics} / {totalTopics} items</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-border-subtle/50 pt-3">
                <span className="text-text-secondary">Study Time Left</span>
                <span className="font-bold text-text-primary">{totalHoursRemaining} Hours</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-border-subtle/50 pt-3">
                <span className="text-text-secondary">Pending Assignments</span>
                <span className="font-bold text-accent-rose font-mono">{pendingAssignments} due</span>
              </div>
            </div>
          </Card>

          {/* QUICK ACTIONS */}
          <Card className="rounded-[24px] p-6 border-border-subtle space-y-4 text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-primary">Quick Settings Actions</h4>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="w-full justify-between hover:bg-bg-secondary text-[11px] font-semibold">
                <span>Backup Profile (Export JSON)</span>
                <Download className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => importInputRef.current?.click()} className="w-full justify-between hover:bg-bg-secondary text-[11px] font-semibold">
                <span>Restore Profile (Import JSON)</span>
                <Upload className="h-3.5 w-3.5" />
              </Button>
              <input
                type="file"
                ref={importInputRef}
                className="hidden"
                accept=".json"
                onChange={handleImport}
              />
            </div>
          </Card>
        </div>

      </div>
    </motion.div>
  )
}

interface ProfileFieldProps {
  label: string
  value: string
  placeholder: string
  isEditing: boolean
  isMultiline?: boolean
  onChange: (val: string) => void
}

function ProfileField({
  label,
  value,
  placeholder,
  isEditing,
  isMultiline = false,
  onChange,
}: ProfileFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{label}</span>
      {isEditing ? (
        isMultiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="w-full rounded-xl border border-border-medium bg-bg-primary px-3 py-2 text-xs font-medium text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-border-medium bg-bg-primary px-3 py-2 text-xs font-medium text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        )
      ) : (
        <div className="min-h-8 flex items-center">
          {value ? (
            <p className="text-xs font-bold text-text-primary text-wrap break-all">{value}</p>
          ) : (
            <p className="text-xs font-medium text-amber-500/80 italic flex items-center gap-1">
              <Info className="h-3.5 w-3.5" /> Not Filled
            </p>
          )}
        </div>
      )}
    </div>
  )
}
