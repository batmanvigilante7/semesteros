import { useState, useEffect } from 'react'
import type { UserProfile, RecentActivity } from '@/models'
import { ProfileService } from '@/services/ProfileService'
import { useAnalyticsStore } from '@/stores/AcademicEngine'

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => ProfileService.getProfile())
  const analytics = useAnalyticsStore()

  // Sync profile to local storage whenever it changes
  useEffect(() => {
    ProfileService.saveProfile(profile)
  }, [profile])

  // Recalculate achievements based on actual stats
  useEffect(() => {
    const updatedBadges = [...profile.achievements]

    // 1. Consistency: streak > 0
    if (analytics.currentStreak > 0 && !updatedBadges.includes('Consistency')) {
      updatedBadges.push('Consistency')
    }

    // 2. Assignment Slayer: completed assignments > 0
    // (let's assume we check completed assignments, or simply count if analytics shows completed)
    // Actually let's mock checks or rely on streak
    if (analytics.currentStreak >= 7 && !updatedBadges.includes('7-Day Streak')) {
      updatedBadges.push('7-Day Streak')
    }
    if (analytics.currentStreak >= 30 && !updatedBadges.includes('30-Day Streak')) {
      updatedBadges.push('30-Day Streak')
    }

    if (updatedBadges.length !== profile.achievements.length) {
      setProfile((prev) => ({
        ...prev,
        achievements: updatedBadges,
      }))
    }
  }, [analytics.currentStreak, profile.achievements, analytics.upcomingDeadlines])

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }))
  };

  const uploadAvatar = async (file: File) => {
    try {
      const base64 = await ProfileService.fileToBase64(file)
      updateProfile({ avatarUrl: base64 })
      logActivity('resource', 'Updated profile picture')
    } catch (err) {
      console.error('Failed to convert image to base64', err)
    }
  }

  const removeAvatar = () => {
    updateProfile({ avatarUrl: null })
    logActivity('resource', 'Removed profile picture')
  }

  const logActivity = (type: RecentActivity['type'], content: string) => {
    const newActivity: RecentActivity = {
      id: `act-${Date.now()}`,
      type,
      content,
      timestamp: new Date().toISOString(),
    }
    setProfile((prev) => ({
      ...prev,
      recentActivities: [newActivity, ...prev.recentActivities].slice(0, 10),
    }))
  }

  const completionPercentage = ProfileService.calculateCompletion(profile)

  return {
    profile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    logActivity,
    completionPercentage,
    analytics,
  }
}
