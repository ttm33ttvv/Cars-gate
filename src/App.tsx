import React, { useState } from 'react';
import {
  Car,
  Download,
  Smartphone,
  FileCode2,
  Database,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  GitBranch,
  Layers,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { ProjectFilesViewer } from './components/ProjectFilesViewer';
import { SupabaseGuide } from './components/SupabaseGuide';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'files' | 'database' | 'docs'>('simulator');

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-100 font-sans flex flex-col" dir="rtl">
      {/* Top Navbar */}
      <header className="bg-[#11141B] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 leading-tight">
                Cars Gate | منصة وسوق معارض السيارات في اليمن
              </h1>
              <p className="text-xs text-slate-400">
                صنعاء • عدن • حضرموت • تعز | Clean Architecture • GetX • Supabase Realtime
              </p>
            </div>
          </div>

          {/* Direct Download ZIP CTA */}
          <div className="flex items-center gap-3">
            <a
              href="/flutter_car_platform.zip"
              download="flutter_car_platform.zip"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تحميل المشروع كاملاً (ZIP)</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-white/5 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-blue-500 text-blue-400 bg-blue-600/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>المحاكي التفاعلي المباشر (App Simulator)</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'files'
                ? 'border-blue-500 text-blue-400 bg-blue-600/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>هيكل المشروع والشيفرة المصدرية (38 ملفاً)</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-blue-500 text-blue-400 bg-blue-600/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>قاعدة البيانات Supabase (RLS & Schema)</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'docs'
                ? 'border-blue-500 text-blue-400 bg-blue-600/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>المواصفات والتوثيق التقني</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6">
        {/* Feature Badges Banner */}
        <section className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-[#16191E] rounded-2xl border border-white/5 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">الهيكلية البرمجية</span>
              <span className="text-xs font-bold text-slate-100">Clean MVC + GetX</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#16191E] rounded-2xl border border-white/5 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">الواجهة الخلفية</span>
              <span className="text-xs font-bold text-slate-100">Supabase Realtime + RLS</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#16191E] rounded-2xl border border-white/5 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">التحزيم التلقائي</span>
              <span className="text-xs font-bold text-slate-100">GitHub Actions (APK/AAB)</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#16191E] rounded-2xl border border-white/5 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">لوحة تحكم المشرف</span>
              <span className="text-xs font-bold text-slate-100">اعتماد الإعلانات والمعارض</span>
            </div>
          </div>
        </section>

        {/* Active Tab Views */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Main Column: Phone Simulator */}
            <div className="lg:col-span-5 flex justify-center">
              <PhoneSimulator />
            </div>

            {/* Right Column: Interactive Walkthrough & Instructions */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#16191E] rounded-2xl border border-white/5 p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-100 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>تطبيق Flutter التفاعلي جاهز للتجربة الآن</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  تمت برمجة التطبيق بالكامل وفق معايير Flutter و Clean MVC مع GetX. يمكنك التفاعل في المحاكي يميناً مع جميع الشاشات والميزات المطلوبة:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#11141B] border border-white/5">
                    <span className="font-bold text-blue-400 block mb-1">
                      1. الشاشة الترحيبية (Splash Screen):
                    </span>
                    <p className="text-slate-400">
                      تعرض شعار التطبيق مع حركة نبضية لمدة 3 ثوانٍ ثم تنتقل تلقائياً للشاشة الرئيسية (يمكنك الضغط على أيقونة الإعادة بأعلى الهاتف لإعادة تشغيلها).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#11141B] border border-white/5">
                    <span className="font-bold text-blue-400 block mb-1">
                      2. الشاشة الرئيسية وكاروسيل المعارض:
                    </span>
                    <p className="text-slate-400">
                      قائمة بالمعارض المعتمدة، وكل معرض يعرض أسفله كاروسيل متحرك لأحدث سياراته مع زر "عرض الكل" للانتقال لتفاصيل المعرض.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#11141B] border border-white/5">
                    <span className="font-bold text-blue-400 block mb-1">
                      3. تفاصيل المعرض مع البحث والتصفية:
                    </span>
                    <p className="text-slate-400">
                      بحث لحظي، وتصفية حسب الماركة وشريط نطاق السعر، وشبكة السيارات المتوفرة.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#11141B] border border-white/5">
                    <span className="font-bold text-blue-400 block mb-1">
                      4. إضافة سيارة للأفراد مع ضغط الصور ورفعها:
                    </span>
                    <p className="text-slate-400">
                      رفع الصور (كاميرا/معرض) مع ضغطها قبل الرفع، وإدخال بيانات السيارة، وزر نشر الإعلان ليذهب مباشرة إلى قائمة المراجعة المعلقة لدى الإدارة.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#11141B] border border-white/5">
                    <span className="font-bold text-blue-400 block mb-1">
                      5. الدردشة اللحظية (Supabase Realtime Chat):
                    </span>
                    <p className="text-slate-400">
                      قائمة بالمحادثات النشطة وغرفة محادثة فورية 1-on-1 مع إرسال واستقبال رسائل لحظياً، وردود سريعة، وأزرار اتصال وواتساب.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#11141B] border border-white/5">
                    <span className="font-bold text-blue-400 block mb-1">
                      6. لوحة تحكم الإدارة (Admin Dashboard):
                    </span>
                    <p className="text-slate-400">
                      مراجعة الإعلانات المعلقة واعتمادها (قبول/رفض) فورياً، وإضافة وحذف المعارض، وإدارة صلاحيات المستخدمين.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Download Box */}
              <div className="p-5 bg-gradient-to-r from-[#11141B] to-[#1E232D] text-white rounded-2xl border border-white/5 shadow-md flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold mb-1 text-slate-100">تنزيل كود المشروع كملف مضغوط جاهز</h4>
                  <p className="text-xs text-slate-400">
                    يحتوي الأرشيف على كافة ملفات Dart، وإعدادات Android و iOS، ومخطط Supabase SQL، وسير عمل GitHub Actions.
                  </p>
                </div>
                <a
                  href="/flutter_car_platform.zip"
                  download="flutter_car_platform.zip"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-lg shadow-blue-600/20"
                >
                  تحميل ZIP
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && <ProjectFilesViewer />}

        {activeTab === 'database' && <SupabaseGuide />}

        {activeTab === 'docs' && (
          <div className="bg-[#16191E] rounded-2xl border border-white/5 p-6 space-y-6 text-slate-100">
            <h3 className="text-lg font-bold text-slate-100 border-b border-white/5 pb-3">
              دليل المشروع والمواصفات المعمارية
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-blue-400">🏛️ الهيكل البرمجي (Clean Architecture / MVC)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تم تقسيم الكود إلى طبقات واضحة ومنفصلة تضمن سهولة الصيانة والتوسع المستقبلي:
                </p>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li><b className="text-slate-200">Core</b>: يحتوي على الثوابت (Colors, Themes)، الترجمة RTL/LTR، الخدمات العامة (SupabaseService, StorageService)، ونظام التوجيه (AppRoutes, AppPages).</li>
                  <li><b className="text-slate-200">Data</b>: يحتوي على النماذج (UserModel, ShowroomModel, CarModel, MessageModel, ConversationModel) مع دوال التحويل من وإلى JSON.</li>
                  <li><b className="text-slate-200">Presentation</b>: يحتوي على وحدات التحكم GetX (Controllers) المنفصلة تماماً عن الواجهات (Views) والمكونات المشتركة (Widgets).</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-blue-400">⚡ مزايا Supabase Realtime & RLS</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تطبيق آمن بالكامل دون أي كود من Firebase:
                </p>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li><b className="text-slate-200">Row Level Security (RLS)</b>: قواعد صارمة تمنع المستخدمين من تعديل أو حذف إعلانات أو بيانات غيرهم.</li>
                  <li><b className="text-slate-200">Realtime Streaming</b>: استخدام قنوات Supabase Realtime لبث الرسائل والمحادثات لحظياً دون الحاجة لتحديث الصفحة.</li>
                  <li><b className="text-slate-200">Storage Bucket</b>: تخزين الصور في حاوية <code className="bg-[#0A0B0E] px-1 py-0.5 rounded text-blue-400 border border-white/5">car-images</code> مع ضغطها إلى دقة 1024x1024 وبجودة 80% لتوفير استهلاك البيانات.</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h4 className="text-sm font-bold text-slate-100 mb-3">🚀 خطوات البناء والتشغيل السريع</h4>
              <div className="bg-[#0A0B0E] text-slate-300 border border-white/5 p-4 rounded-xl text-xs font-mono space-y-2 overflow-x-auto">
                <div className="text-slate-500"># 1. استخراج الملف المضغوط والدخول إلى المجلد:</div>
                <div className="text-emerald-400">unzip flutter_car_platform.zip &amp;&amp; cd flutter_car_platform</div>
                <div className="text-slate-500"># 2. تحميل الحزم والمكتبات:</div>
                <div className="text-emerald-400">flutter pub get</div>
                <div className="text-slate-500"># 3. تشغيل التطبيق على الهاتف أو المحاكي:</div>
                <div className="text-emerald-400">flutter run</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sophisticated Dark Footer */}
      <footer className="mt-8 py-4 border-t border-white/5 bg-[#11141B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <div className="flex gap-4">
            <span>إصدار التطبيق: 1.0.4 (Flutter)</span>
            <span>خادم البيانات: Supabase Cloud (Live)</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-slate-400">جميع الأنظمة والخدمات تعمل بشكل طبيعي</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

