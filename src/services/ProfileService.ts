import type { UserProfile, RecentActivity } from '@/models'

const PROFILE_KEY = 'semesteros.profile.v2'

const defaultProfile: UserProfile = {
  name: 'Hemanth',
  bio: 'Computer Science sophomore focusing on frontend systems and AI engineering.',
  email: 'hemanth@semesteros.dev',
  phone: '+1 (555) 019-2834',
  university: 'Stanford University',
  department: 'Computer Science & Engineering',
  semester: 'Semester III',
  branch: 'Artificial Intelligence',
  rollNumber: 'SU-2026-CS802',
  section: 'A',
  academicYear: 'AY 2026-27',
  expectedGraduation: 'Spring 2028',
  interests: ['React', 'TypeScript', 'Machine Learning', 'UX Design', 'Jerk-free Spacing'],
  careerGoal: 'Staff Frontend Engineer & Design Systems Architect',
  avatarUrl: null,
  achievements: ['Consistency', 'Early Bird'],
  recentActivities: [
    {
      id: 'act-1',
      type: 'assignment',
      content: 'Marked "Prepare COA Quiz Notes" as in-progress',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: 'act-2',
      type: 'lesson',
      content: 'Completed "Inheritance & Polymorphism" in OOP theory',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    },
    {
      id: 'act-3',
      type: 'resource',
      content: 'Uploaded "Statistical Expectations PDF" to Math resources',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ],
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
      'careerGoal',
      'avatarUrl',
    ]

    let filledCount = 0
    fields.forEach((field) => {
      if (profile[field]) filledCount++
    })

    if (profile.interests && profile.interests.length > 0) filledCount++
    
    // Max 11 fields monitored
    const totalFields = fields.length + 1
    return Math.round((filledCount / totalFields) * 100)
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
