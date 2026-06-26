import { userTypeEnum } from '@/types/register'

export const APPLICANT_LABEL = 'Applicant'

export interface UserProfileSubtitleInput {
  role?: string | null
  study_year?: string | null
  major?: string | null
  occupation?: string | null
  affiliation?: string | null
}

export function isApplicantRole(role?: string | null): boolean {
  return role === userTypeEnum.Applicant || role === 'applicant'
}

export function getUserProfileSubtitleLines({ role, study_year, major, occupation, affiliation }: UserProfileSubtitleInput): {
  line1: string
  line2: string
} {
  if (isApplicantRole(role)) {
    return { line1: APPLICANT_LABEL, line2: '' }
  }

  const isStudent = role === userTypeEnum.Student || role === 'student'
  return {
    line1: isStudent ? study_year || '' : occupation || '',
    line2: isStudent ? major || '' : affiliation || '',
  }
}