import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface UserAccount {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role: 'customer' | 'merchant'
  provider?: 'local' | 'google' | 'facebook'
  location: string
}

const STORAGE_KEY = 'zaytstore_auth_user'
const LOCATION_KEY = 'zaytstore_current_location'

const defaultUser: UserAccount = {
  id: 'usr-101',
  name: 'عمر حسن الخالد',
  email: 'omar.khalid@gmail.com',
  phone: '0944 123 456',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
  role: 'customer',
  provider: 'local',
  location: 'دمشق',
}

export const useAuthStore = defineStore('auth', () => {
  // Load saved state or default to logged in demo if desired
  const savedRaw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  const initialUser: UserAccount | null = savedRaw ? JSON.parse(savedRaw) : null

  // By default, if nothing saved, we can start with true so client can see avatar and notifications immediately!
  const user = ref<UserAccount | null>(initialUser ?? defaultUser)
  const isLoggedIn = computed(() => user.value !== null)

  const savedLoc = typeof window !== 'undefined' ? localStorage.getItem(LOCATION_KEY) : null
  const selectedLocation = ref<string>(savedLoc || 'دمشق')

  const supportPhone = ref('+963 11 9876')
  const supportMobile = ref('+963 944 000 888')

  function save() {
    if (typeof window !== 'undefined') {
      if (user.value) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  function setLocation(loc: string) {
    selectedLocation.value = loc
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCATION_KEY, loc)
    }
  }

  function login(credentials: { email: string; name?: string; role?: 'customer' | 'merchant' }) {
    user.value = {
      id: 'usr-' + Date.now().toString(36),
      name: credentials.name || credentials.email.split('@')[0] || 'عمر خالد',
      email: credentials.email,
      phone: '0944 123 456',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      role: credentials.role || 'customer',
      provider: 'local',
      location: selectedLocation.value,
    }
    save()
  }

  function loginWithGoogle() {
    user.value = {
      id: 'goog-' + Date.now().toString(36),
      name: 'أحمد المحمد',
      email: 'ahmed.mohamad@gmail.com',
      phone: '0991 888 777',
      avatar:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
      role: 'customer',
      provider: 'google',
      location: selectedLocation.value,
    }
    save()
  }

  function loginWithFacebook() {
    user.value = {
      id: 'fb-' + Date.now().toString(36),
      name: 'سامر خليل',
      email: 'samer.khalil@facebook.com',
      phone: '0933 555 444',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      role: 'customer',
      provider: 'facebook',
      location: selectedLocation.value,
    }
    save()
  }

  function logout() {
    user.value = null
    save()
  }

  function updateProfile(patch: Partial<UserAccount>) {
    if (user.value) {
      user.value = { ...user.value, ...patch }
      save()
    }
  }

  return {
    user,
    isLoggedIn,
    selectedLocation,
    supportPhone,
    supportMobile,
    setLocation,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    updateProfile,
  }
})
