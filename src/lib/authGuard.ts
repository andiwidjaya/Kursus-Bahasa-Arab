import { User, Enrollment } from '../types';

/**
 * Access Control & Security Guard Engine
 * Implements PRD Section 29 (Access Control) & Section 30 (Security Requirements)
 */

export interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
  redirectTo?: 'checkout' | 'courses' | 'home';
}

/**
 * Validates whether a user is authorized to view a specific course content.
 * Requirement (§29):
 * 1. Is user authenticated?
 * 2. Is user Admin (Full Access) OR does user have valid Enrollment?
 */
export const checkCourseAuthorization = (
  user: User | null,
  courseId: string,
  enrollments: Enrollment[]
): AuthorizationResult => {
  if (!user) {
    return {
      allowed: false,
      reason: 'Anda harus masuk ke akun terlebih dahulu untuk mengakses materi kursus ini.',
      redirectTo: 'courses'
    };
  }

  if (user.role === 'ADMIN') {
    return { allowed: true };
  }

  const hasEnrollment = enrollments.some(
    e => e.user_id === user.id && e.course_id === courseId && e.status === 'ACTIVE'
  );

  if (!hasEnrollment) {
    return {
      allowed: false,
      reason: 'Anda belum mendaftar di kursus ini. Silakan selesaikan pendaftaran dan pembayaran.',
      redirectTo: 'checkout'
    };
  }

  return { allowed: true };
};

/**
 * Validates admin role for protected admin routes (/admin/*).
 */
export const checkAdminAuthorization = (user: User | null): AuthorizationResult => {
  if (!user) {
    return {
      allowed: false,
      reason: 'Diperlukan hak akses administrator untuk membuka halaman ini.',
      redirectTo: 'home'
    };
  }

  if (user.role !== 'ADMIN') {
    return {
      allowed: false,
      reason: 'Akses ditolak. Halaman ini hanya dapat diakses oleh Administrator.',
      redirectTo: 'home'
    };
  }

  return { allowed: true };
};
