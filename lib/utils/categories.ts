import {
  ShoppingCart,
  Home,
  Utensils,
  Car,
  Heart,
  Zap,
  Tv,
  Briefcase,
  TrendingUp,
  LucideIcon,
} from 'lucide-react'

export const CATEGORIES = {
  shopping: { label: 'Shopping', icon: ShoppingCart, color: 'text-blue-600' },
  housing: { label: 'Housing', icon: Home, color: 'text-amber-600' },
  food: { label: 'Food', icon: Utensils, color: 'text-orange-600' },
  transport: { label: 'Transport', icon: Car, color: 'text-red-600' },
  health: { label: 'Health', icon: Heart, color: 'text-pink-600' },
  utilities: { label: 'Utilities', icon: Zap, color: 'text-yellow-600' },
  entertainment: { label: 'Entertainment', icon: Tv, color: 'text-purple-600' },
  work: { label: 'Work', icon: Briefcase, color: 'text-green-600' },
  investment: { label: 'Investment', icon: TrendingUp, color: 'text-emerald-600' },
}

export type Category = keyof typeof CATEGORIES

export function getCategoryIcon(category: string): LucideIcon {
  return (CATEGORIES[category as Category]?.icon || ShoppingCart)
}

export function getCategoryColor(category: string): string {
  return CATEGORIES[category as Category]?.color || 'text-gray-600'
}

export function getCategoryLabel(category: string): string {
  return CATEGORIES[category as Category]?.label || category
}
