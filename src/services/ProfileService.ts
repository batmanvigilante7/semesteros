import type { UserProfile, RecentActivity } from '@/models'

const PROFILE_KEY = 'semesteros.profile.v2'

const defaultProfile: UserProfile = {
  name: '',
  bio: '',
  email: '',
  phone: '',
  university: '',
  department: '',
  semester: '',
  branch: '',
  rollNumber: '',
  section: '',
  academicYear: '',
  expectedGraduation: '',
  interests: [],
  careerGoal: '',
  avatarUrl: null,
  achievements: [],
  recentActivities: [],
  
  apaarId: '',
  campus: '',
  college: '',
  batch: '',
  degree: '',
  program: '',
  currentYear: '',
  academicAdvisor: '',
  studentStatus: '',

  dob: '',
  gender: '',
  nationality: '',
  religion: '',
  category: '',
  bloodGroup: '',
  aadharNumber: '',
  passportNumber: '',

  alternateEmail: '',
  parentPhone: '',
  emergencyContact: '',
  linkedin: '',
  github: '',
  portfolio: '',

  fatherName: '',
  motherName: '',
  guardianName: '',
  guardianContact: '',

  permanentAddress: '',
  currentAddress: '',
  city: '',
  district: '',
  state: '',
  country: '',
  postalCode: '',

  theme: 'dark',
  accentColor: '#6FA8FF',
  language: 'en',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '12h',
  timezone: 'UTC',
}

export const ProfileService = {
  getProfile(): UserProfile {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile))
      return defaultProfile
    }
    try {
      return JSON.parse(raw)
    } catch {
      return defaultProfile
    }
  },

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  },

  calculateCompletion(profile: UserProfile): number {
    const fields: (keyof UserProfile)[] = [
      'name',
      'bio',
      'email',
      'phone',
      'university',
      'department',
      'rollNumber',
      'branch',
      'avatarUrl',
      'campus',
      'degree',
      'program',
      'dob',
      'gender',
      'nationality',
      'aadharNumber',
      'permanentAddress',
      'fatherName',
      'linkedin',
    ]

    let filledCount = 0
    fields.forEach((field) => {
      if (profile[field]) filledCount++
    })

    return Math.round((filledCount / fields.length) * 100)
  },

  addActivity(type: RecentActivity['type'], content: string): void {
    const profile = this.getProfile()
    const newActivity: RecentActivity = {
      id: `act-${Date.now()}`,
      type,
      content,
      timestamp: new Date().toISOString(),
    }
    profile.recentActivities = [newActivity, ...profile.recentActivities].slice(0, 10) // Limit to latest 10
    this.saveProfile(profile)
  },

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  },
}
