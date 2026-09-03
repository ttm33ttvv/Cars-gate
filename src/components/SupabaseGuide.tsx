import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, ShieldCheck, Zap, HardDrive, Terminal } from 'lucide-react';

export function SupabaseGuide() {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const envSample = `SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
STORAGE_BUCKET_CARS=car-images`;

  return (
    <div className="bg-[#16191E] rounded-2xl border border-white/5 shadow-xs p-6 space-y-6 text-slate-100">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">دليل ربط Supabase والتثبيت المباشر</h3>
            <p className="text-xs text-slate-400">
              قاعدة بيانات PostgreSQL كاملة مع أمان Row Level Security وميزة البث اللحظي Realtime
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-blue-600/10 text-blue-400 rounded-full border border-blue-600/20">
          Supabase v2.5.6
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="p-4 bg-[#11141B] rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs">1</span>
            <span>تنفيذ مخطط SQL</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            افتح لوحة تحكم <b>Supabase</b> وانتقل إلى <b>SQL Editor</b>، ثم الصق محتوى الملف{' '}
            <code className="bg-[#0A0B0E] px-1 py-0.5 rounded text-blue-300 border border-white/5">supabase/schema.sql</code> واضغط Run.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-4 bg-[#11141B] rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs">2</span>
            <span>إنشاء حاوية الصور (Storage)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            من تبويب <b>Storage</b>، أنشئ حاوية جديدة باسم <code className="bg-[#0A0B0E] px-1 py-0.5 rounded text-blue-300 border border-white/5">car-images</code> وضعها Public لتمكين عرض الصور.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-4 bg-[#11141B] rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs">3</span>
            <span>ملف الإعدادات البيئية .env</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            انسخ <code className="bg-[#0A0B0E] px-1 py-0.5 rounded text-blue-300 border border-white/5">Project URL</code> و <code className="bg-[#0A0B0E] px-1 py-0.5 rounded text-blue-300 border border-white/5">anon public key</code> إلى ملف <code className="bg-[#0A0B0E] px-1 py-0.5 rounded text-blue-300 border border-white/5">.env</code> في جذر المشروع.
          </p>
        </div>
      </div>

      {/* Code Block for .env */}
      <div className="bg-[#0A0B0E] border border-white/5 rounded-xl p-4 text-slate-200 text-xs font-mono relative">
        <div className="flex justify-between items-center text-slate-400 mb-2 border-b border-white/5 pb-2">
          <span className="text-blue-400">.env</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(envSample);
              setCopiedEnv(true);
              setTimeout(() => setCopiedEnv(false), 2000);
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-100 px-2 py-0.5 rounded hover:bg-white/5 transition-colors"
          >
            {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEnv ? 'تم النسخ' : 'نسخ'}</span>
          </button>
        </div>
        <pre className="text-slate-300 overflow-x-auto">{envSample}</pre>
      </div>

      {/* Terminal Command for Running Flutter */}
      <div className="p-4 bg-[#11141B] border border-white/5 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-blue-400" />
          <span className="font-mono text-xs text-slate-200 font-bold">
            flutter pub get &amp;&amp; flutter run
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText('flutter pub get && flutter run');
            setCopiedCmd(true);
            setTimeout(() => setCopiedCmd(false), 2000);
          }}
          className="px-3 py-1.5 bg-[#1E232D] border border-white/10 hover:bg-white/10 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedCmd ? 'تم النسخ' : 'نسخ الأمر'}</span>
        </button>
      </div>
    </div>
  );
}

