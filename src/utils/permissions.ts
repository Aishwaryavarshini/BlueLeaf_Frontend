
import { User, UserRole } from '../types';

export const canEditContent = (user: User | null): boolean => {
  if (!user) return false;
  return [UserRole.SUBJECT_STAFF, UserRole.CLASS_COORDINATOR, UserRole.PRINCIPAL].includes(user.role);
};

export const canManageStaff = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === UserRole.PRINCIPAL;
};

export const canViewAnalytics = (user: User | null): boolean => {
  if (!user) return false;
  return [UserRole.CLASS_COORDINATOR, UserRole.PRINCIPAL].includes(user.role);
};

export const canManageClass = (user: User | null): boolean => {
  if (!user) return false;
  return [UserRole.CLASS_COORDINATOR, UserRole.PRINCIPAL].includes(user.role);
};
