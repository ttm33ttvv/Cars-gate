import React, { useState, useEffect } from 'react';
import {
  Car as CarIcon,
  Store,
  PlusCircle,
  MessageSquare,
  ShieldCheck,
  Search,
  Phone,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Globe,
  RotateCcw,
  Camera,
  Trash2,
  SlidersHorizontal,
  Send,
  UserCheck,
  Bell,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  LogOut,
  Settings,
  Sliders,
  Sparkles
} from 'lucide-react';
import { INITIAL_SHOWROOMS, INITIAL_PENDING_CARS, INITIAL_CONVERSATIONS, INITIAL_USERS } from '../data/mockData';
import { Showroom, Car, Conversation, User } from '../types';

export function PhoneSimulator() {
  // Simulator State
  const [currentScreen, setCurrentScreen] = useState<
    | 'splash'
    | 'home'
    | 'showroom'
    | 'car-details'
    | 'add-car'
    | 'conversations'
    | 'chat-room'
    | 'admin'
    | 'login'
    | 'signup'
    | 'forgot-password'
    | 'preferences'
  >('splash');
  const [isArabic, setIsArabic] = useState(true);
  const [selectedShowroom, setSelectedShowroom] = useState<Showroom>(INITIAL_SHOWROOMS[0]);
  const [selectedCar, setSelectedCar] = useState<Car>(INITIAL_SHOWROOMS[0].cars[0]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(INITIAL_CONVERSATIONS[0]);

  // Active User Authentication State (Supabase Auth Session)
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [authLoading, setAuthLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: 'buyer@cars.com', password: 'password123' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'user' | 'showroom_owner',
    password: '',
    confirmPassword: ''
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // User Car Alert & Push Notification Preferences
  const [userPreferences, setUserPreferences] = useState({
    notifyOnChatMessages: true,
    notifyOnNewCars: true,
    preferredBrands: ['مرسيدس بنز', 'تويوتا'],
    maxPrice: 65000,
    preferredCity: 'صنعاء'
  });

  // Active Realtime Push Notification Banner State
  const [activeNotification, setActiveNotification] = useState<{
    id: string;
    title: string;
    body: string;
    type: 'chat' | 'car_match';
    time: string;
  } | null>(null);

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2);

  // Dynamic Data in Simulator
  const [showrooms, setShowrooms] = useState<Showroom[]>(INITIAL_SHOWROOMS);
  const [pendingCars, setPendingCars] = useState<Car[]>(INITIAL_PENDING_CARS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'me' | 'other'; text: string; time: string }[]>([
    { id: '1', sender: 'other', text: 'أهلاً بك في معرض صنعاء الدولي للسيارات! كيف نقدر نخدمك اليوم؟', time: '10:30 ص' },
    { id: '2', sender: 'me', text: 'السلام عليكم، هل سيارة مرسيدس S500 مجمركة وجاهزة للمعاينة في المعرض؟', time: '10:32 ص' },
    { id: '3', sender: 'other', text: 'وعليكم السلام ورحمة الله. نعم متوفرة جاهزة ومجمركة مع فحص كامل وضمان.', time: '10:33 ص' }
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000000);

  // Add Car Form State
  const [addCarForm, setAddCarForm] = useState({
    brand: '',
    model: '',
    year: '2024',
    price: '',
    city: 'صنعاء',
    phone: '',
    whatsapp: '',
    description: '',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
    ]
  });
  const [addCarSuccess, setAddCarSuccess] = useState(false);

  // Auto transition from Splash screen after 3 seconds (as requested in prompt)
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('home');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Admin Tab
  const [adminTab, setAdminTab] = useState<'pending' | 'showrooms' | 'users'>('pending');

  const handleSendMessage = (customText?: string) => {
    const text = customText || messageInput.trim();
    if (!text) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'me' as const,
      text,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setMessageInput('');

    // Simulate Supabase Realtime auto-reply from Showroom after 1.2s
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'other',
          text: 'تم استلام استفسارك! يمكنك الاتصال بنا مباشرة أو زيارة المعرض لمعاينة السيارة.',
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handlePublishAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addCarForm.brand || !addCarForm.model || !addCarForm.price || !addCarForm.phone) {
      alert(isArabic ? 'يرجى ملء جميع الحقول الإلزامية' : 'Please fill all required fields');
      return;
    }

    const newCar: Car = {
      id: `car_${Date.now()}`,
      brand: addCarForm.brand,
      model: addCarForm.model,
      year: parseInt(addCarForm.year) || 2024,
      price: parseFloat(addCarForm.price) || 0,
      city: addCarForm.city,
      phone: addCarForm.phone,
      whatsapp: addCarForm.whatsapp || addCarForm.phone,
      images: addCarForm.images,
      description: addCarForm.description,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setPendingCars((prev) => [newCar, ...prev]);
    setAddCarSuccess(true);
    setTimeout(() => {
      setAddCarSuccess(false);
      setCurrentScreen('home');
      setAddCarForm({
        brand: '',
        model: '',
        year: '2024',
        price: '',
        city: 'الرياض',
        phone: '',
        whatsapp: '',
        description: '',
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800']
      });
    }, 1800);
  };

  const triggerPushNotification = (
    type: 'chat' | 'car_match',
    customTitle?: string,
    customBody?: string
  ) => {
    const notif = {
      id: Date.now().toString(),
      title:
        customTitle ||
        (type === 'chat'
          ? isArabic
            ? '💬 رسالة جديدة من معرض صنعاء الدولي'
            : '💬 New message from Sanaa Showroom'
          : isArabic
          ? '🚗 سيارة مطابقة لتفضيلاتك!'
          : '🚗 New Car Matching Your Preferences!'),
      body:
        customBody ||
        (type === 'chat'
          ? isArabic
            ? 'السعر قابل للتفاوض البسيط للجادين، هل ترغب بمعاينة السيارة في المعرض بصنعاء؟'
            : 'Price is slightly negotiable. Would you like to inspect it at the showroom in Sanaa?'
          : isArabic
          ? 'مرسيدس S500 موديل 2024 بسعر $62,000 بصنعاء تطابق معاييرك'
          : 'Mercedes S500 2024 for $62,000 in Sanaa matches your alert'),
      type,
      time: isArabic ? 'الآن' : 'Just now'
    };
    setActiveNotification(notif);
    setUnreadNotificationsCount((prev) => prev + 1);

    setTimeout(() => {
      setActiveNotification((curr) => (curr?.id === notif.id ? null : curr));
    }, 6000);
  };

  const handleLogin = (demoRole?: 'buyer' | 'showroom' | 'admin') => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      if (demoRole === 'showroom') {
        setCurrentUser(INITIAL_USERS[1]);
      } else if (demoRole === 'admin') {
        setCurrentUser(INITIAL_USERS[2]);
      } else {
        setCurrentUser(INITIAL_USERS[0]);
      }
      setCurrentScreen('home');
    }, 500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      alert(isArabic ? 'يرجى إكمال جميع الحقول الإلزامية' : 'Please complete all required fields');
      return;
    }
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: signupForm.name,
        email: signupForm.email,
        phone: signupForm.phone,
        role: signupForm.role,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(newUser);
      setCurrentScreen('home');
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      alert(isArabic ? 'يرجى كتابة البريد الإلكتروني' : 'Please enter your email');
      return;
    }
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setResetSuccess(true);
    }, 500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const handleApproveCar = (carId: string) => {
    const car = pendingCars.find((c) => c.id === carId);
    if (!car) return;
    setPendingCars((prev) => prev.filter((c) => c.id !== carId));
    // Add to first showroom as active
    setShowrooms((prev) => {
      const copy = [...prev];
      copy[0] = {
        ...copy[0],
        cars: [{ ...car, status: 'active' }, ...copy[0].cars]
      };
      return copy;
    });

    // If car matches user preferences, trigger Realtime Push Notification!
    if (userPreferences.notifyOnNewCars) {
      const brandMatch =
        userPreferences.preferredBrands.length === 0 ||
        userPreferences.preferredBrands.some(
          (b) => car.brand.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(car.brand.toLowerCase())
        );
      const priceMatch = !userPreferences.maxPrice || car.price <= userPreferences.maxPrice;
      const cityMatch =
        !userPreferences.preferredCity ||
        userPreferences.preferredCity === 'الكل' ||
        car.city.includes(userPreferences.preferredCity);

      if (brandMatch && priceMatch && cityMatch) {
        triggerPushNotification(
          'car_match',
          isArabic ? '🚗 سيارة مطابقة لتفضيلاتك!' : '🚗 New Car Matching Alert!',
          isArabic
            ? `وصلت ${car.brand} ${car.model} بسعر $${car.price.toLocaleString()} في ${car.city}`
            : `New ${car.brand} ${car.model} for $${car.price.toLocaleString()} in ${car.city}`
        );
      }
    }
  };

  const handleRejectCar = (carId: string) => {
    setPendingCars((prev) => prev.filter((c) => c.id !== carId));
  };

  return (
    <div className="flex flex-col items-center">
      {/* Simulator Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 w-full max-w-[390px] mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Supabase Auth & Realtime
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsArabic(!isArabic)}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#16191E] border border-white/10 hover:bg-white/10 text-slate-300 text-[11px] font-semibold rounded-lg transition-colors"
          >
            <Globe className="w-3 h-3 text-blue-400" />
            {isArabic ? 'English' : 'عربي'}
          </button>
          <button
            onClick={() => setCurrentScreen('splash')}
            title="إعادة تشغيل شاشة الترحيب (3s)"
            className="p-1 bg-[#16191E] border border-white/10 hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Push Notification Testing Quick Toolbar */}
      <div className="w-full max-w-[390px] mb-3 bg-[#16191E] border border-white/10 rounded-xl p-2 flex items-center justify-between gap-1.5 shadow-sm">
        <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
          <Bell className="w-3 h-3 text-blue-400" />
          <span>{isArabic ? 'توليد إشعار فوري:' : 'Simulate Alert:'}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => triggerPushNotification('chat')}
            className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-md text-[10px] font-medium flex items-center gap-1 transition-colors"
            title="محاكاة وصول رسالة جديدة عبر Realtime"
          >
            <MessageSquare className="w-3 h-3" />
            {isArabic ? 'رسالة محادثة' : 'Chat Msg'}
          </button>
          <button
            onClick={() => triggerPushNotification('car_match')}
            className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-medium flex items-center gap-1 transition-colors"
            title="محاكاة وصول سيارة تطابق التفضيلات"
          >
            <CarIcon className="w-3 h-3" />
            {isArabic ? 'سيارة مطابقة' : 'Car Match'}
          </button>
        </div>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        className="w-[375px] h-[760px] bg-[#11141B] rounded-[44px] p-3 shadow-2xl border-4 border-white/10 relative flex flex-col overflow-hidden font-sans"
      >
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#16191E] border border-slate-700" />
        </div>

        {/* Screen Container */}
        <div className="w-full h-full bg-[#0A0B0E] rounded-[34px] overflow-hidden flex flex-col relative text-slate-100 select-none">
          {/* Status Bar */}
          <div className="h-9 px-6 flex justify-between items-center text-xs font-semibold text-slate-400 bg-[#11141B]/90 backdrop-blur-md z-30 pt-1 border-b border-white/5">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-slate-600 rounded-sm p-0.5 flex items-center">
                <div className="h-full w-3/4 bg-slate-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Realtime Push Notification Banner (Drops from top) */}
          {activeNotification && (
            <div
              onClick={() => {
                if (activeNotification.type === 'chat') {
                  setCurrentScreen('chat-room');
                } else {
                  setSelectedCar(showrooms[0].cars[0]);
                  setCurrentScreen('car-details');
                }
                setActiveNotification(null);
              }}
              className="absolute top-11 left-3 right-3 z-50 bg-[#16191E]/95 backdrop-blur-md border border-blue-500/50 p-3 rounded-2xl shadow-2xl flex items-start gap-2.5 cursor-pointer animate-in fade-in slide-in-from-top-3 duration-300"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeNotification.type === 'chat'
                    ? 'bg-blue-600/20 border border-blue-500/40 text-blue-400'
                    : 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400'
                }`}
              >
                {activeNotification.type === 'chat' ? (
                  <MessageSquare className="w-5 h-5" />
                ) : (
                  <CarIcon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100 truncate">
                    {activeNotification.title}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {activeNotification.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-snug">
                  {activeNotification.body}
                </p>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5">
                  <span className="text-[9px] text-blue-400 font-semibold">
                    {isArabic ? 'اضغط للمعاينة الفورية ➔' : 'Tap to open details ➔'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    Push • Realtime
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveNotification(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ========================================================
              SCREEN 1: SPLASH SCREEN (3 SECONDS)
             ======================================================== */}
          {currentScreen === 'splash' && (
            <div className="flex-1 bg-[#0A0B0E] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="w-24 h-24 rounded-full bg-blue-600/10 border-2 border-blue-500/40 flex items-center justify-center shadow-lg shadow-blue-600/20 mb-6 animate-bounce">
                <CarIcon className="w-12 h-12 text-blue-400" />
              </div>
              <h1 className="text-2xl font-black tracking-tight mb-2 text-center text-slate-100">
                Cars Gate
              </h1>
              <p className="text-slate-400 text-xs text-center max-w-[250px] leading-relaxed mb-8">
                {isArabic
                  ? 'بوابتك الأولى لمعارض وسوق السيارات في اليمن'
                  : 'Your premier portal for car showrooms in Yemen'}
              </p>
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[11px] text-slate-500">
                  {currentUser
                    ? isArabic
                      ? `تم العثور على جلسة نشطة (${currentUser.name})`
                      : `Active Supabase session (${currentUser.name})`
                    : isArabic
                    ? 'جاري التحقق عبر Supabase Auth (3 ثوانٍ)...'
                    : 'Checking Supabase Auth session (3s)...'}
                </span>
              </div>
              <div className="mt-8 flex items-center gap-2">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs rounded-full text-white font-semibold transition-colors shadow-sm"
                >
                  {isArabic ? 'الرئيسية ➔' : 'Home ➔'}
                </button>
                {!currentUser && (
                  <button
                    onClick={() => setCurrentScreen('login')}
                    className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs rounded-full text-slate-300 transition-colors"
                  >
                    {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              SCREEN 2: HOME SCREEN
             ======================================================== */}
          {currentScreen === 'home' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0B0E]">
              {/* Header */}
              <div className="p-3.5 bg-[#11141B] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                    <CarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-100 leading-tight">
                      {isArabic ? 'Cars Gate | اليمن' : 'Cars Gate | Yemen'}
                    </h2>
                    <span className="text-[9px] text-emerald-400 font-medium block">
                      {currentUser
                        ? isArabic
                          ? `● مرحباً، ${currentUser.name.split(' ')[0]}`
                          : `● Hello, ${currentUser.name.split(' ')[0]}`
                        : isArabic
                        ? '● متزامن مع Supabase'
                        : '● Supabase Synced'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Notification Alerts Center Bell */}
                  <button
                    onClick={() => setCurrentScreen('preferences')}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors relative"
                    title={isArabic ? 'تنبيهات وتفضيلات السيارات' : 'Car Alerts & Preferences'}
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </button>

                  {/* Auth User Profile Button */}
                  {currentUser ? (
                    <button
                      onClick={() => setCurrentScreen('preferences')}
                      className="flex items-center gap-1 pl-1.5 pr-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 text-[11px] transition-colors"
                      title={isArabic ? 'إدارة الحساب' : 'Account'}
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                        {currentUser.name.charAt(0)}
                      </div>
                      <span className="text-[10px] font-medium hidden sm:inline max-w-[60px] truncate">
                        {currentUser.name.split(' ')[0]}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentScreen('login')}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition-colors shadow-sm"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>{isArabic ? 'دخول' : 'Sign In'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setCurrentScreen('admin')}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"
                    title={isArabic ? 'لوحة الإدارة' : 'Admin'}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentScreen('conversations')}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"
                    title={isArabic ? 'المحادثات' : 'Chat'}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isArabic
                        ? 'ابحث بالماركة، الموديل، أو المدينة...'
                        : 'Search by brand, model, city...'
                    }
                    className="w-full bg-[#11141B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                  <Search className={`w-4 h-4 text-slate-500 absolute top-3 ${isArabic ? 'left-3' : 'right-3'}`} />
                </div>

                {/* Promo Card */}
                <div className="bg-gradient-to-r from-[#11141B] to-[#1E232D] text-white rounded-2xl p-4 border border-white/5 shadow-md">
                  <span className="inline-block bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 shadow-sm">
                    {isArabic ? 'خاص بالأفراد' : 'For Individuals'}
                  </span>
                  <h3 className="text-sm font-bold mb-1 text-slate-100">
                    {isArabic ? 'اعرض سيارتك للبيع في دقائق' : 'List your car for sale in minutes'}
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                    {isArabic
                      ? 'ارفع صور سيارتك وتواصل مباشرة مع المشترين عبر الواتساب والمحادثة الفورية.'
                      : 'Upload photos and connect directly with thousands of buyers.'}
                  </p>
                  <button
                    onClick={() => setCurrentScreen('add-car')}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg shadow-blue-600/20 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    {isArabic ? 'أضف سيارتك الآن' : 'List Your Car'}
                  </button>
                </div>

                {/* Showrooms Header */}
                <div className="flex items-center justify-between pt-1">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {isArabic ? 'المعارض المعتمدة' : 'Verified Showrooms'}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {showrooms.length} {isArabic ? 'معارض' : 'showrooms'}
                  </span>
                </div>

                {/* Showrooms List with Animated Horizontal Carousels */}
                {showrooms.map((showroom) => (
                  <div
                    key={showroom.id}
                    className="bg-[#16191E] rounded-2xl border border-white/5 shadow-xs overflow-hidden"
                  >
                    {/* Showroom Header */}
                    <div className="p-3.5 flex items-center justify-between border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={showroom.logo}
                          alt={showroom.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">{showroom.name}</h4>
                          <span className="text-[10px] text-slate-400 block">{showroom.location}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedShowroom(showroom);
                          setCurrentScreen('showroom');
                        }}
                        className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        {isArabic ? 'عرض الكل' : 'View All'}
                        {isArabic ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Horizontal Animated Carousel of Cars */}
                    <div className="p-3 bg-[#11141B]/60">
                      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                        {showroom.cars.map((car) => (
                          <div
                            key={car.id}
                            onClick={() => {
                              setSelectedCar(car);
                              setCurrentScreen('car-details');
                            }}
                            className="min-w-[155px] max-w-[155px] bg-[#16191E] rounded-xl border border-white/5 overflow-hidden shadow-2xs hover:border-blue-500/40 transition-all cursor-pointer group"
                          >
                            <div className="h-24 w-full overflow-hidden relative">
                              <img
                                src={car.images[0]}
                                alt={car.brand}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/10">
                                {car.year}
                              </span>
                            </div>
                            <div className="p-2">
                              <h5 className="text-[11px] font-bold text-slate-100 truncate">
                                {car.brand} {car.model}
                              </h5>
                              <p className="text-[10px] text-slate-400 truncate">{car.city}</p>
                              <div className="mt-1.5 flex items-center justify-between">
                                <span className="text-[11px] font-extrabold text-blue-400">
                                  ${car.price.toLocaleString()} {isArabic ? 'دولار' : 'USD'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* ========================================================
              SCREEN 3: SHOWROOM DETAILS (WITH SEARCH & FILTER)
             ======================================================== */}
          {currentScreen === 'showroom' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0B0E]">
              {/* Top Nav */}
              <div className="p-3.5 bg-[#11141B] border-b border-white/5 flex items-center gap-3">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-300"
                >
                  {isArabic ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-slate-100 truncate">{selectedShowroom.name}</h3>
                  <span className="text-[10px] text-slate-400">{selectedShowroom.location}</span>
                </div>
              </div>

              {/* Showroom Banner Info */}
              <div className="p-4 bg-[#16191E] border-b border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={selectedShowroom.logo}
                    alt={selectedShowroom.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{selectedShowroom.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">{selectedShowroom.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <a
                    href={`tel:${selectedShowroom.phone}`}
                    className="flex-1 py-1.5 bg-[#11141B] hover:bg-white/5 border border-white/10 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {isArabic ? 'اتصال بالمعرض' : 'Call'}
                  </a>
                  <button
                    onClick={() => {
                      setSelectedConversation({
                        id: `conv_${selectedShowroom.id}`,
                        participant1: 'user',
                        participant2: selectedShowroom.name,
                        lastMessage: 'مرحباً، أود الاستفسار عن سياراتكم',
                        updatedAt: 'الآن',
                        otherUserName: selectedShowroom.name,
                        carTitle: 'استفسار المعرض'
                      });
                      setCurrentScreen('chat-room');
                    }}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-lg shadow-blue-600/20 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {isArabic ? 'محادثة فورية' : 'Live Chat'}
                  </button>
                </div>
              </div>

              {/* Live Search & Brand Filter Chips */}
              <div className="p-3 bg-[#11141B] border-b border-white/5 space-y-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isArabic ? 'ابحث عن سيارة في هذا المعرض...' : 'Search inside showroom...'}
                  className="w-full bg-[#16191E] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  {['all', 'مرسيدس بنز', 'بي إم دبليو', 'تويوتا', 'بورش', 'لكزس'].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                        selectedBrand === brand
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-slate-200'
                      }`}
                    >
                      {brand === 'all' ? (isArabic ? 'الكل' : 'All') : brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cars Grid */}
              <div className="flex-1 overflow-y-auto p-3 bg-[#0A0B0E]">
                <div className="grid grid-cols-2 gap-2.5">
                  {selectedShowroom.cars
                    .filter((car) => {
                      const matchSearch =
                        !searchQuery ||
                        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        car.model.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchBrand = selectedBrand === 'all' || car.brand === selectedBrand;
                      return matchSearch && matchBrand;
                    })
                    .map((car) => (
                      <div
                        key={car.id}
                        onClick={() => {
                          setSelectedCar(car);
                          setCurrentScreen('car-details');
                        }}
                        className="bg-[#16191E] rounded-xl border border-white/5 overflow-hidden shadow-2xs hover:border-blue-500/40 transition-all cursor-pointer"
                      >
                        <div className="h-28 w-full overflow-hidden relative">
                          <img src={car.images[0]} alt={car.brand} className="w-full h-full object-cover" />
                          <span className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/10">
                            {car.year}
                          </span>
                        </div>
                        <div className="p-2.5">
                          <h5 className="text-xs font-bold text-slate-100 truncate">
                            {car.brand} {car.model}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate">{car.city}</p>
                          <div className="mt-2 text-xs font-extrabold text-blue-400">
                            ${car.price.toLocaleString()} {isArabic ? 'دولار' : 'USD'}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SCREEN 4: CAR DETAILS SCREEN
             ======================================================== */}
          {currentScreen === 'car-details' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0B0E]">
              {/* Top Bar */}
              <div className="p-3 bg-[#11141B] border-b border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-300"
                >
                  {isArabic ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
                <h3 className="text-xs font-bold text-slate-100 truncate">
                  {selectedCar.brand} {selectedCar.model}
                </h3>
                <span className="text-[10px] bg-blue-600/10 text-blue-400 border border-blue-600/20 font-bold px-2 py-0.5 rounded-full">
                  {isArabic ? 'معتمد' : 'Verified'}
                </span>
              </div>

              {/* Scrollable Car Body */}
              <div className="flex-1 overflow-y-auto">
                <div className="h-52 w-full relative bg-[#11141B]">
                  <img src={selectedCar.images[0]} alt={selectedCar.brand} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded border border-white/10">
                    1 / {selectedCar.images.length}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <span className="text-lg font-black text-blue-400 block">
                      ${selectedCar.price.toLocaleString()} {isArabic ? 'دولار' : 'USD'}
                    </span>
                    <h2 className="text-base font-bold text-slate-100">
                      {selectedCar.brand} {selectedCar.model} ({selectedCar.year})
                    </h2>
                    <span className="text-xs text-slate-400">{selectedCar.city}</span>
                  </div>

                  {/* Specifications Card */}
                  <div className="bg-[#16191E] rounded-xl border border-white/5 p-3 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-100 border-b border-white/5 pb-1.5">
                      {isArabic ? 'المواصفات' : 'Specs'}
                    </h4>
                    <div className="flex justify-between text-slate-400">
                      <span>{isArabic ? 'الماركة' : 'Brand'}</span>
                      <span className="font-semibold text-slate-200">{selectedCar.brand}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{isArabic ? 'الموديل' : 'Model'}</span>
                      <span className="font-semibold text-slate-200">{selectedCar.model}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{isArabic ? 'سنة الصنع' : 'Year'}</span>
                      <span className="font-semibold text-slate-200">{selectedCar.year}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{isArabic ? 'المدينة' : 'City'}</span>
                      <span className="font-semibold text-slate-200">{selectedCar.city}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedCar.description && (
                    <div className="bg-[#16191E] rounded-xl border border-white/5 p-3 text-xs">
                      <h4 className="font-bold text-slate-100 mb-1.5">{isArabic ? 'الوصف' : 'Description'}</h4>
                      <p className="text-slate-300 leading-relaxed">{selectedCar.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-3 bg-[#11141B] border-t border-white/5 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedConversation({
                      id: `conv_${selectedCar.id}`,
                      participant1: 'user',
                      participant2: selectedCar.brand,
                      carId: selectedCar.id,
                      lastMessage: `استفسار عن ${selectedCar.brand} ${selectedCar.model}`,
                      updatedAt: 'الآن',
                      otherUserName: `${selectedCar.brand} ${selectedCar.model}`,
                      carTitle: `${selectedCar.brand} ${selectedCar.model}`
                    });
                    setCurrentScreen('chat-room');
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/20 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  {isArabic ? 'محادثة فورية' : 'Live Chat'}
                </button>
                <a
                  href={`https://wa.me/${(selectedCar.whatsapp || selectedCar.phone || '').replace(/[^0-9+]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${selectedCar.phone}`}
                  className="p-2.5 bg-[#16191E] hover:bg-white/10 border border-white/10 text-slate-200 rounded-xl flex items-center justify-center transition-colors"
                  title="Call"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* ========================================================
              SCREEN 5: ADD CAR FOR INDIVIDUALS (WITH IMAGE PICKER)
             ======================================================== */}
          {currentScreen === 'add-car' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0B0E]">
              {/* Header */}
              <div className="p-3.5 bg-[#11141B] border-b border-white/5 flex items-center gap-3">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-300"
                >
                  {isArabic ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
                <h3 className="text-xs font-bold text-slate-100">
                  {isArabic ? 'إضافة سيارة للأفراد' : 'List Your Car'}
                </h3>
              </div>

              {/* Form */}
              <form onSubmit={handlePublishAd} className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {addCarSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {isArabic
                        ? 'تم نشر إعلانك بنجاح وهو الآن في لوحة الإدارة قيد المراجعة!'
                        : 'Your ad was submitted and is pending admin approval!'}
                    </span>
                  </div>
                )}

                {/* Photo Picker Section */}
                <div className="bg-[#16191E] p-3 rounded-xl border border-white/5">
                  <label className="text-xs font-bold text-slate-200 block mb-2">
                    {isArabic ? 'صور السيارة (Supabase Storage)' : 'Car Photos'}
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        alert(
                          isArabic
                            ? 'في تطبيق Flutter: يتم التقاط الصورة بالكاميرا أو المعرض وضغطها تلقائياً ثم رفعها إلى حاوية car-images في Supabase Storage.'
                            : 'In Flutter: Photo is compressed and uploaded to Supabase Storage.'
                        );
                      }}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-blue-500/40 bg-blue-600/10 flex flex-col items-center justify-center text-blue-400 shrink-0 hover:bg-blue-600/20 transition-colors"
                    >
                      <Camera className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-semibold">{isArabic ? 'رفع صورة' : 'Upload'}</span>
                    </button>

                    {addCarForm.images.map((img, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 border border-white/10">
                        <img src={img} alt="car" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] px-1 rounded border border-white/10">
                          مضغوطة
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fields */}
                <div className="bg-[#16191E] p-3 rounded-xl border border-white/5 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        {isArabic ? 'الماركة *' : 'Brand *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={addCarForm.brand}
                        onChange={(e) => setAddCarForm({ ...addCarForm, brand: e.target.value })}
                        placeholder="مثال: تويوتا"
                        className="w-full bg-[#11141B] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        {isArabic ? 'الموديل *' : 'Model *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={addCarForm.model}
                        onChange={(e) => setAddCarForm({ ...addCarForm, model: e.target.value })}
                        placeholder="مثال: كامري"
                        className="w-full bg-[#11141B] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        {isArabic ? 'سنة الصنع *' : 'Year *'}
                      </label>
                      <input
                        type="number"
                        required
                        value={addCarForm.year}
                        onChange={(e) => setAddCarForm({ ...addCarForm, year: e.target.value })}
                        className="w-full bg-[#11141B] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        {isArabic ? 'السعر ($ دولار أمريكي) *' : 'Price (USD $) *'}
                      </label>
                      <input
                        type="number"
                        required
                        value={addCarForm.price}
                        onChange={(e) => setAddCarForm({ ...addCarForm, price: e.target.value })}
                        placeholder="25000"
                        className="w-full bg-[#11141B] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      {isArabic ? 'المدينة (صنعاء، عدن، حضرموت، تعز) *' : 'City (Sanaa, Aden, etc.) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={addCarForm.city}
                      onChange={(e) => setAddCarForm({ ...addCarForm, city: e.target.value })}
                      placeholder="صنعاء"
                      className="w-full bg-[#11141B] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        {isArabic ? 'رقم الهاتف *' : 'Phone *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={addCarForm.phone}
                        onChange={(e) => setAddCarForm({ ...addCarForm, phone: e.target.value })}
                        placeholder="771234567"
                        className="w-full bg-[#11141B] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        {isArabic ? 'واتساب' : 'WhatsApp'}
                      </label>
                      <input
                        type="tel"
                        value={addCarForm.whatsapp}
                        onChange={(e) => setAddCarForm({ ...addCarForm, whatsapp: e.target.value })}
                        placeholder="771234567"
                        className="w-full bg-[#11141B] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      {isArabic ? 'الوصف ومواصفات الفحص' : 'Description'}
                    </label>
                    <textarea
                      rows={3}
                      value={addCarForm.description}
                      onChange={(e) => setAddCarForm({ ...addCarForm, description: e.target.value })}
                      placeholder={
                        isArabic
                          ? 'حالة السيارة، الممشى، خلوها من الحوادث والرش...'
                          : 'Car condition, mileage, inspection notes...'
                      }
                      className="w-full bg-[#11141B] border border-white/10 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {isArabic ? 'نشر الإعلان الآن' : 'Publish Ad Now'}
                </button>
              </form>
            </div>
          )}

          {/* ========================================================
              SCREEN 6: CONVERSATIONS LIST
             ======================================================== */}
          {currentScreen === 'conversations' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0B0E]">
              <div className="p-3.5 bg-[#11141B] border-b border-white/5 flex items-center gap-3">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-300"
                >
                  {isArabic ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
                <div>
                  <h3 className="text-xs font-bold text-slate-100">
                    {isArabic ? 'المحادثات المباشرة' : 'Live Conversations'}
                  </h3>
                  <span className="text-[10px] text-emerald-400">Supabase Realtime</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-white/5 bg-[#0A0B0E]">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv);
                      setCurrentScreen('chat-room');
                    }}
                    className="p-3.5 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className="text-xs font-bold text-slate-100 truncate">{conv.otherUserName}</h4>
                        <span className="text-[10px] text-slate-400">{conv.updatedAt}</span>
                      </div>
                      {conv.carTitle && (
                        <span className="inline-block text-[10px] bg-blue-600/10 text-blue-400 border border-blue-600/20 font-semibold px-1.5 py-0.2 rounded mb-0.5 truncate max-w-full">
                          {conv.carTitle}
                        </span>
                      )}
                      <p className="text-[11px] text-slate-400 truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              SCREEN 7: CHAT ROOM (1-ON-1 REALTIME)
             ======================================================== */}
          {currentScreen === 'chat-room' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0B0E]">
              {/* Header */}
              <div className="p-3 bg-[#11141B] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentScreen('conversations')}
                    className="p-1 rounded-lg hover:bg-white/5 text-slate-300"
                  >
                    {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  </button>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100 leading-tight">
                      {selectedConversation.otherUserName}
                    </h3>
                    <span className="text-[9px] text-emerald-400 font-semibold block">
                      ● {isArabic ? 'متصل الآن (Realtime)' : 'Online (Realtime)'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <a href="tel:+966501234567" className="p-1.5 text-slate-400 hover:text-blue-400">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Attached Car Pin */}
              {selectedConversation.carTitle && (
                <div className="bg-blue-600/10 border-b border-blue-500/20 px-3 py-1.5 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-blue-300 truncate">
                    🚗 {selectedConversation.carTitle}
                  </span>
                  <span className="text-[10px] text-blue-400 font-bold">معاينة</span>
                </div>
              )}

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#0A0B0E]">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                        msg.sender === 'me'
                          ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                          : 'bg-[#16191E] text-slate-200 rounded-bl-none border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Quick Tags */}
              <div className="px-3 py-1 bg-[#11141B] border-t border-white/5 flex gap-1.5 overflow-x-auto text-[10px]">
                {['هل السعر نهائي؟', 'هل فحص السيارة ساري؟', 'موقع المعاينة'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSendMessage(chip)}
                    className="bg-[#16191E] border border-white/10 hover:border-blue-500/50 px-2 py-0.5 rounded-full whitespace-nowrap text-slate-300 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-2 bg-[#11141B] border-t border-white/5 flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Type a message...'}
                  className="flex-1 bg-[#16191E] border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              SCREEN 8: ADMIN DASHBOARD (APPROVALS & MANAGEMENT)
             ======================================================== */}
          {currentScreen === 'admin' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0B0E]">
              {/* Header */}
              <div className="p-3.5 bg-[#11141B] text-white border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="p-1 rounded-lg hover:bg-white/5 text-slate-300"
                  >
                    {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  </button>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">{isArabic ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}</h3>
                    <span className="text-[10px] text-slate-400">إدارة المعارض والسيارات</span>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full font-bold shadow-sm">Admin</span>
              </div>

              {/* Tabs */}
              <div className="flex bg-[#11141B] border-b border-white/5 text-xs font-bold">
                <button
                  onClick={() => setAdminTab('pending')}
                  className={`flex-1 py-2.5 text-center border-b-2 transition-colors relative ${
                    adminTab === 'pending'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isArabic ? 'الإعلانات المعلقة' : 'Pending'}
                  {pendingCars.length > 0 && (
                    <span className="ml-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.2 rounded-full">
                      {pendingCars.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setAdminTab('showrooms')}
                  className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                    adminTab === 'showrooms'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isArabic ? 'المعارض' : 'Showrooms'}
                </button>
                <button
                  onClick={() => setAdminTab('users')}
                  className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                    adminTab === 'users'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isArabic ? 'المستخدمين' : 'Users'}
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0A0B0E]">
                {/* 1. Pending Listings Review */}
                {adminTab === 'pending' && (
                  <>
                    {pendingCars.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 text-xs">
                        <Check className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                        {isArabic ? 'لا توجد إعلانات معلقة حالياً' : 'No pending car listings'}
                      </div>
                    ) : (
                      pendingCars.map((car) => (
                        <div key={car.id} className="bg-[#16191E] rounded-xl border border-white/5 p-3 shadow-xs">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-xs font-bold text-slate-100">
                                {car.brand} {car.model} ({car.year})
                              </h4>
                              <span className="text-[11px] font-extrabold text-blue-400">
                                ${car.price.toLocaleString()} {isArabic ? 'دولار' : 'USD'}
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                {car.city} • هاتف: {car.phone}
                              </span>
                            </div>
                            <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold px-1.5 py-0.5 rounded">
                              {isArabic ? 'قيد المراجعة' : 'Pending'}
                            </span>
                          </div>

                          {car.description && (
                            <p className="text-[10px] text-slate-300 bg-[#11141B] p-2 rounded mb-2.5 border border-white/5">
                              {car.description}
                            </p>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveCar(car.id)}
                              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              {isArabic ? 'قبول الإعلان' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleRejectCar(car.id)}
                              className="flex-1 py-1.5 bg-white/5 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              {isArabic ? 'رفض' : 'Reject'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {/* 2. Showrooms Management */}
                {adminTab === 'showrooms' && (
                  <>
                    <button
                      onClick={() => {
                        const name = prompt(isArabic ? 'أدخل اسم المعرض الجديد:' : 'Enter showroom name:');
                        if (name) {
                          const newShowroom: Showroom = {
                            id: `sr_${Date.now()}`,
                            name,
                            logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300',
                            location: 'صنعاء',
                            phone: '+967770000000',
                            cars: []
                          };
                          setShowrooms((prev) => [newShowroom, ...prev]);
                        }
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 mb-2 shadow-lg shadow-blue-600/20 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      {isArabic ? 'إضافة معرض جديد' : 'Add Showroom'}
                    </button>

                    {showrooms.map((sr) => (
                      <div
                        key={sr.id}
                        className="bg-[#16191E] rounded-xl border border-white/5 p-2.5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <img src={sr.logo} alt={sr.name} className="w-8 h-8 rounded-lg object-cover border border-white/10" />
                          <div>
                            <h5 className="text-xs font-bold text-slate-100">{sr.name}</h5>
                            <span className="text-[10px] text-slate-400">
                              {sr.location} • {sr.cars.length} سيارات
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowrooms((prev) => prev.filter((item) => item.id !== sr.id))}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {/* 3. Users Management */}
                {adminTab === 'users' && (
                  <div className="space-y-2">
                    {INITIAL_USERS.map((usr) => (
                      <div
                        key={usr.id}
                        className="bg-[#16191E] rounded-xl border border-white/5 p-2.5 flex items-center justify-between"
                      >
                        <div>
                          <h5 className="text-xs font-bold text-slate-100">{usr.name}</h5>
                          <span className="text-[10px] text-slate-400 block">{usr.email}</span>
                          <span className="inline-block text-[9px] font-semibold bg-white/5 border border-white/10 text-slate-300 px-1.5 rounded mt-0.5">
                            {usr.role}
                          </span>
                        </div>
                        <button
                          onClick={() => alert(`تعديل صلاحيات ${usr.name}`)}
                          className="text-[11px] text-blue-400 font-bold hover:underline"
                        >
                          {isArabic ? 'تعديل الصلاحية' : 'Edit Role'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              SCREEN 8: LOGIN (SUPABASE AUTH)
             ======================================================== */}
          {currentScreen === 'login' && (
            <div className="flex-1 flex flex-col bg-[#0A0B0E] overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="p-2 text-slate-400 hover:text-slate-200 bg-[#16191E] border border-white/5 rounded-xl transition-colors"
                >
                  {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>
                <span className="text-xs font-bold text-slate-300">
                  {isArabic ? 'بوابة تسجيل الدخول' : 'Sign In Portal'}
                </span>
                <div className="w-8" />
              </div>

              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-blue-600/10">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-base font-bold text-slate-100 mb-0.5">
                  {isArabic ? 'تسجيل الدخول إلى حسابك' : 'Sign In to Your Account'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {isArabic ? 'إدارة الجلسات والتنبيهات المخصصة عبر Supabase Auth' : 'Supabase Auth with secure encrypted storage'}
                </p>
              </div>

              {/* Quick Demo Login Preset Buttons */}
              <div className="mb-4 bg-[#11141B] border border-white/5 rounded-2xl p-3">
                <span className="text-[10px] font-bold text-slate-400 block mb-2">
                  {isArabic ? '⚡ دخول فوري بحسابات تجريبية:' : '⚡ Quick Demo Logins:'}
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleLogin('buyer')}
                    disabled={authLoading}
                    className="py-1.5 px-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/20 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'مشتري' : 'Buyer'}</span>
                  </button>
                  <button
                    onClick={() => handleLogin('showroom')}
                    disabled={authLoading}
                    className="py-1.5 px-1 bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 border border-purple-500/20 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition-colors"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'معرض' : 'Showroom'}</span>
                  </button>
                  <button
                    onClick={() => handleLogin('admin')}
                    disabled={authLoading}
                    className="py-1.5 px-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-300 border border-emerald-500/20 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'مدير' : 'Admin'}</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin('buyer');
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="user@example.com"
                      required
                      className="w-full bg-[#11141B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <Mail className={`w-4 h-4 text-slate-500 absolute top-3 ${isArabic ? 'left-3' : 'right-3'}`} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      {isArabic ? 'كلمة المرور' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('forgot-password')}
                      className="text-[10px] text-blue-400 hover:underline"
                    >
                      {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#11141B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className={`p-1 text-slate-500 hover:text-slate-300 absolute top-2.5 ${isArabic ? 'left-2.5' : 'right-2.5'}`}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all mt-3"
                >
                  {authLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{isArabic ? 'تسجيل الدخول' : 'Sign In'}</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-3 border-t border-white/5 space-y-2">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('signup')}
                    className="text-xs text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    {isArabic ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
                    <span className="text-blue-400 font-bold">{isArabic ? 'إنشاء حساب جديد' : 'Sign Up'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentScreen('home')}
                    className="block w-full text-center text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {isArabic ? 'المتابعة كزائر بدون تسجيل ➔' : 'Continue as guest ➔'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================
              SCREEN 9: SIGN UP (SUPABASE AUTH)
             ======================================================== */}
          {currentScreen === 'signup' && (
            <div className="flex-1 flex flex-col bg-[#0A0B0E] overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setCurrentScreen('login')}
                  className="p-2 text-slate-400 hover:text-slate-200 bg-[#16191E] border border-white/5 rounded-xl transition-colors"
                >
                  {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>
                <span className="text-xs font-bold text-slate-300">
                  {isArabic ? 'إنشاء حساب جديد' : 'Create New Account'}
                </span>
                <div className="w-8" />
              </div>

              {/* Role Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#11141B] rounded-xl border border-white/5 mb-3">
                <button
                  type="button"
                  onClick={() => setSignupForm({ ...signupForm, role: 'user' })}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    signupForm.role === 'user' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'فرد / مشتري' : 'Buyer'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignupForm({ ...signupForm, role: 'showroom_owner' })}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    signupForm.role === 'showroom_owner' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'صاحب معرض' : 'Showroom'}</span>
                </button>
              </div>

              <form onSubmit={handleSignup} className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isArabic ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    placeholder={isArabic ? 'مثال: أحمد اليماني' : 'e.g. Ahmed Al-Yamani'}
                    required
                    className="w-full bg-[#11141B] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-[#11141B] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isArabic ? 'رقم الجوال' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    placeholder="+967771234567"
                    className="w-full bg-[#11141B] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isArabic ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#11141B] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className={`p-1 text-slate-500 hover:text-slate-300 absolute top-2 ${isArabic ? 'left-2' : 'right-2'}`}
                    >
                      {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all mt-2"
                >
                  {authLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>{isArabic ? 'تأكيد التسجيل وإنشاء الحساب' : 'Complete Registration'}</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('login')}
                    className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {isArabic ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                    <span className="text-blue-400 font-bold">{isArabic ? 'تسجيل الدخول' : 'Sign In'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================
              SCREEN 10: FORGOT PASSWORD (SUPABASE AUTH RECOVERY)
             ======================================================== */}
          {currentScreen === 'forgot-password' && (
            <div className="flex-1 flex flex-col bg-[#0A0B0E] p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={() => setCurrentScreen('login')}
                  className="p-2 text-slate-400 hover:text-slate-200 bg-[#16191E] border border-white/5 rounded-xl transition-colors"
                >
                  {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>
                <span className="text-xs font-bold text-slate-300">
                  {isArabic ? 'استعادة الحساب' : 'Reset Password'}
                </span>
                <div className="w-8" />
              </div>

              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h2 className="text-base font-bold text-slate-100 mb-1">
                  {isArabic ? 'استعادة كلمة المرور' : 'Reset Your Password'}
                </h2>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-[250px] mx-auto">
                  {isArabic
                    ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً مباشراً عبر Supabase لتعيين كلمة مرور جديدة.'
                    : 'Enter your registered email and we will send a secure password reset link via Supabase.'}
                </p>
              </div>

              {resetSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-3 animate-in fade-in duration-300">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-emerald-300">
                    {isArabic ? 'تم إرسال الرابط بنجاح!' : 'Reset Link Sent!'}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isArabic
                      ? `أرسلنا رابط إعادة التعيين إلى ${resetEmail || 'بريدك الإلكتروني'}. يرجى فحص صندوق الوارد ورسائل التنبيهات.`
                      : `We sent a reset link to ${resetEmail || 'your email'}. Please check your inbox.`}
                  </p>
                  <button
                    onClick={() => {
                      setResetSuccess(false);
                      setCurrentScreen('login');
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    {isArabic ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isArabic ? 'البريد الإلكتروني المسجل' : 'Registered Email'}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="user@example.com"
                        required
                        className="w-full bg-[#11141B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <Mail className={`w-4 h-4 text-slate-500 absolute top-3 ${isArabic ? 'left-3' : 'right-3'}`} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                  >
                    {authLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isArabic ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('login')}
                      className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {isArabic ? 'تذكرت كلمة المرور؟ العودة للدخول' : 'Remembered password? Back to Login'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================
              SCREEN 11: USER PROFILE & PUSH NOTIFICATION PREFERENCES
             ======================================================== */}
          {currentScreen === 'preferences' && (
            <div className="flex-1 flex flex-col bg-[#0A0B0E] overflow-y-auto p-4 space-y-3.5">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="p-1.5 text-slate-400 hover:text-slate-200 bg-[#16191E] border border-white/5 rounded-xl transition-colors"
                >
                  {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>
                <h3 className="text-xs font-bold text-slate-100">
                  {isArabic ? 'إدارة الحساب والتنبيهات الفورية' : 'Account & Push Alerts'}
                </h3>
                <div className="w-7" />
              </div>

              {/* Current User Card */}
              <div className="bg-[#11141B] border border-white/5 rounded-2xl p-3">
                {currentUser ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{currentUser.name}</h4>
                        <span className="text-[10px] text-slate-400 block">{currentUser.email}</span>
                        <span className="inline-block px-1.5 py-0.2 mt-0.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[9px] font-semibold rounded">
                          {currentUser.role === 'admin'
                            ? isArabic ? 'مدير نظام' : 'Admin'
                            : currentUser.role === 'showroom_owner'
                            ? isArabic ? 'صاحب معرض' : 'Showroom Owner'
                            : isArabic ? 'مشتري / فرد' : 'Buyer'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl border border-red-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title={isArabic ? 'تسجيل الخروج' : 'Log Out'}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">
                        {isArabic ? 'أنت تتصفح كزائر' : 'Guest Visitor'}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {isArabic ? 'سجل دخولك لتفعيل التنبيهات المخصصة' : 'Sign in to save alert preferences'}
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentScreen('login')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                    </button>
                  </div>
                )}
              </div>

              {/* Push Notification Switch Toggles */}
              <div className="bg-[#11141B] border border-white/5 rounded-2xl p-3 space-y-2.5">
                <div className="flex items-center gap-2 pb-1.5 border-b border-white/5">
                  <Bell className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold text-slate-100">
                    {isArabic ? 'إعدادات الإشعارات الفورية (Push Alerts)' : 'Push Notification Settings'}
                  </span>
                </div>

                {/* Chat Messages Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      {isArabic ? 'تنبيهات المحادثات والرسائل' : 'Chat Message Alerts'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isArabic ? 'إشعار فوري عند استلام رد من المعرض' : 'Instant notification on new message'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setUserPreferences({
                        ...userPreferences,
                        notifyOnChatMessages: !userPreferences.notifyOnChatMessages
                      })
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                      userPreferences.notifyOnChatMessages ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        userPreferences.notifyOnChatMessages ? (isArabic ? '-translate-x-5' : 'translate-x-5') : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Matching Cars Toggle */}
                <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      {isArabic ? 'تنبيهات السيارات المطابقة' : 'Matching Car Alerts'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isArabic ? 'إشعار فوري فور نشر سيارة تطابق معاييرك' : 'Alert when a matching car is listed'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setUserPreferences({
                        ...userPreferences,
                        notifyOnNewCars: !userPreferences.notifyOnNewCars
                      })
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                      userPreferences.notifyOnNewCars ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        userPreferences.notifyOnNewCars ? (isArabic ? '-translate-x-5' : 'translate-x-5') : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Matching Criteria Filters */}
              <div className="bg-[#11141B] border border-white/5 rounded-2xl p-3 space-y-2.5">
                <div className="flex items-center gap-2 pb-1.5 border-b border-white/5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-100">
                    {isArabic ? 'معايير السيارات للتنبيهات (Matching Filter)' : 'Alert Matching Criteria'}
                  </span>
                </div>

                {/* Preferred Brands Chips */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                    {isArabic ? 'الماركات المفضلة للتنبيه:' : 'Preferred Brands:'}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {['مرسيدس بنز', 'بي إم دبليو', 'لكزس', 'بورشه', 'تويوتا'].map((brand) => {
                      const isSelected = userPreferences.preferredBrands.includes(brand);
                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setUserPreferences({
                                ...userPreferences,
                                preferredBrands: userPreferences.preferredBrands.filter((b) => b !== brand)
                              });
                            } else {
                              setUserPreferences({
                                ...userPreferences,
                                preferredBrands: [...userPreferences.preferredBrands, brand]
                              });
                            }
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-[#16191E] text-slate-400 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {brand} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Max Price */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-300 mb-1">
                    <span>{isArabic ? 'الحد الأقصى للسعر:' : 'Max Price:'}</span>
                    <span className="text-blue-400 font-mono font-bold">
                      ${userPreferences.maxPrice.toLocaleString()} {isArabic ? 'دولار' : 'USD'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={120000}
                    step={2500}
                    value={userPreferences.maxPrice}
                    onChange={(e) =>
                      setUserPreferences({
                        ...userPreferences,
                        maxPrice: parseInt(e.target.value)
                      })
                    }
                    className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-700 rounded-lg"
                  />
                </div>

                {/* Preferred City */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                    {isArabic ? 'المدينة المفضلة في اليمن:' : 'Preferred City in Yemen:'}
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {['صنعاء', 'عدن', 'حضرموت', 'تعز', 'الكل'].map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setUserPreferences({ ...userPreferences, preferredCity: city })}
                        className={`py-1 rounded-lg text-[9px] font-semibold transition-colors border ${
                          userPreferences.preferredCity === city
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-[#16191E] text-slate-400 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Test Matching Notification Button */}
                <button
                  type="button"
                  onClick={() => {
                    triggerPushNotification(
                      'car_match',
                      isArabic ? '🚗 تنبيه مطابق لتفضيلاتك المحفوظة!' : '🚗 New Car Matching Preferences!',
                      isArabic
                        ? `تم رصد مرسيدس S500 بسعر $${userPreferences.maxPrice.toLocaleString()} في ${userPreferences.preferredCity}`
                        : `Found Mercedes S500 under $${userPreferences.maxPrice.toLocaleString()} in ${userPreferences.preferredCity}`
                    );
                  }}
                  className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'اختبار التنبيه الفوري بالتفضيلات' : 'Test Alert With Preferences'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              BOTTOM NAVIGATION BAR (GETX ROUTING SIMULATION)
             ======================================================== */}
          {currentScreen !== 'splash' &&
            currentScreen !== 'login' &&
            currentScreen !== 'signup' &&
            currentScreen !== 'forgot-password' && (
              <div className="h-14 bg-[#11141B] border-t border-white/5 flex items-center justify-around px-2 z-20">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                    currentScreen === 'home' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CarIcon className="w-4 h-4" />
                  <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
                </button>

              <button
                onClick={() => {
                  setSelectedShowroom(showrooms[0]);
                  setCurrentScreen('showroom');
                }}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                  currentScreen === 'showroom' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>{isArabic ? 'المعارض' : 'Showrooms'}</span>
              </button>

              <button
                onClick={() => setCurrentScreen('add-car')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                  currentScreen === 'add-car' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isArabic ? 'أضف سيارتك' : 'Add Car'}</span>
              </button>

              <button
                onClick={() => setCurrentScreen('conversations')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                  currentScreen === 'conversations' || currentScreen === 'chat-room'
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isArabic ? 'الدردشة' : 'Chat'}</span>
              </button>

              <button
                onClick={() => setCurrentScreen('admin')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
                  currentScreen === 'admin' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isArabic ? 'الإدارة' : 'Admin'}</span>
              </button>
            </div>
          )}

          {/* Home Indicator Bar */}
          <div className="h-4 bg-[#11141B] flex items-center justify-center">
            <div className="w-32 h-1 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
