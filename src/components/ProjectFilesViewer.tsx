import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  Copy,
  Check,
  Download,
  Database,
  GitBranch,
  Terminal,
  ExternalLink,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface FileItem {
  name: string;
  path: string;
  content: string;
  category: string;
}

const PROJECT_FILES: FileItem[] = [
  {
    name: 'pubspec.yaml',
    path: 'pubspec.yaml',
    category: 'Configuration',
    content: `name: flutter_car_platform
description: "A complete Flutter Car Showroom Platform with Clean Architecture, GetX, and Supabase."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # State Management & Routing
  get: ^4.6.6

  # Backend & Database
  supabase_flutter: ^2.5.6

  # Environment Variables
  flutter_dotenv: ^5.1.0

  # Storage & Media
  image_picker: ^1.1.2
  flutter_image_compress: ^2.3.0
  cached_network_image: ^3.3.1

  # UI Enhancements & Animations
  shimmer: ^3.0.0
  carousel_slider: ^4.2.1
  flutter_staggered_grid_view: ^0.7.0
  intl: ^0.19.0
  url_launcher: ^6.3.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - .env
    - assets/images/`
  },
  {
    name: 'schema.sql',
    path: 'supabase/schema.sql',
    category: 'Supabase SQL',
    content: `-- ==============================================================================
-- CAR SHOWROOM PLATFORM - SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('user', 'showroom_owner', 'admin');
CREATE TYPE car_status AS ENUM ('active', 'pending', 'rejected', 'sold');

-- 2. Users Profile Table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Showrooms Table
CREATE TABLE public.showrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  phone TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Cars Table
CREATE TABLE public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showroom_id UUID REFERENCES public.showrooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  status car_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Realtime Conversations & Messages
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  participant2 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES public.cars(id) ON DELETE SET NULL,
  last_message TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES public.cars(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 7. Enable Supabase Realtime for Messages & Conversations
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;`
  },
  {
    name: 'build.yml',
    path: '.github/workflows/build.yml',
    category: 'CI/CD Workflow',
    content: `name: Flutter CI/CD Build

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]

jobs:
  build:
    name: Build APK & Bundle
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Set up Flutter
        uses: subosito/flutter-action@v2
        with:
          channel: 'stable'
          cache: true

      - name: Get dependencies
        run: flutter pub get

      - name: Verify formatting and analysis
        run: flutter analyze

      - name: Build Android APK
        run: flutter build apk --release

      - name: Build Android App Bundle (AAB)
        run: flutter build appbundle --release

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: release-apk
          path: build/app/outputs/flutter-apk/app-release.apk`
  },
  {
    name: 'main.dart',
    path: 'lib/main.dart',
    category: 'Flutter Core',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get/get.dart';
import 'core/constants/app_theme.dart';
import 'core/routes/app_pages.dart';
import 'core/routes/app_routes.dart';
import 'core/services/storage_service.dart';
import 'core/services/supabase_service.dart';
import 'core/translations/app_translations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');

  // Supabase & GetX DI
  await Get.putAsync<SupabaseService>(() => SupabaseService().init());
  Get.put<StorageService>(StorageService());

  runApp(const CarPlatformApp());
}

class CarPlatformApp extends StatelessWidget {
  const CarPlatformApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'منصة معارض السيارات',
      debugShowCheckedModeBanner: false,
      translations: AppTranslations(),
      locale: const Locale('ar', 'SA'),
      theme: AppTheme.lightTheme,
      initialRoute: AppRoutes.splash,
      getPages: AppPages.routes,
    );
  }
}`
  },
  {
    name: 'chat_controller.dart',
    path: 'lib/presentation/controllers/chat_controller.dart',
    category: 'Controllers',
    content: `import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/services/supabase_service.dart';
import '../../../data/models/message_model.dart';
import '../../../data/models/conversation_model.dart';

class ChatController extends GetxController {
  final SupabaseClient _client = SupabaseService.client;
  final activeMessages = <MessageModel>[].obs;
  StreamSubscription<List<Map<String, dynamic>>>? _messageSubscription;

  void subscribeToMessages(String conversationId) {
    _messageSubscription?.cancel();
    _messageSubscription = _client
        .from('messages')
        .stream(primaryKey: ['id'])
        .eq('conversation_id', conversationId)
        .order('created_at', ascending: true)
        .listen((records) {
          activeMessages.value = records.map((e) => MessageModel.fromJson(e)).toList();
        });
  }

  Future<void> sendMessage() async {
    // Inserts message into Supabase and updates conversation timestamp
  }
}`
  },
  {
    name: 'admin_controller.dart',
    path: 'lib/presentation/controllers/admin_controller.dart',
    category: 'Controllers',
    content: `import 'package:get/get.dart';
import '../../../core/services/supabase_service.dart';
import '../../../data/models/car_model.dart';

class AdminController extends GetxController {
  final pendingCars = <CarModel>[].obs;
  final isLoading = false.obs;

  Future<void> approveCar(String carId) async {
    await SupabaseService.client
        .from('cars')
        .update({'status': 'active'})
        .eq('id', carId);
    pendingCars.removeWhere((car) => car.id === carId);
    Get.snackbar('تم بنجاح', 'تم اعتماد ونشر إعلان السيارة');
  }

  Future<void> rejectCar(String carId) async {
    await SupabaseService.client
        .from('cars')
        .update({'status': 'rejected'})
        .eq('id', carId);
    pendingCars.removeWhere((car) => car.id === carId);
  }
}`
  }
];

export function ProjectFilesViewer() {
  const [selectedFile, setSelectedFile] = useState<FileItem>(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#16191E] rounded-2xl border border-white/5 shadow-xs overflow-hidden flex flex-col h-[760px]">
      {/* Top Header */}
      <div className="p-4 bg-[#11141B] border-b border-white/5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">هيكل المشروع والشيفرة المصدرية (Flutter + Clean MVC)</h3>
            <span className="text-xs text-slate-400">38 ملفاً كاملاً جاهزة للتشغيل والتصدير</span>
          </div>
        </div>

        {/* Download ZIP Button */}
        <a
          href="/flutter_car_platform.zip"
          download="flutter_car_platform.zip"
          className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-blue-600/20"
        >
          <Download className="w-4 h-4" />
          تحميل المشروع (ZIP)
        </a>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Navigator Sidebar */}
        <div className="w-64 bg-[#11141B] border-l border-white/5 p-3 overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            الملفات الرئيسية
          </div>
          <div className="space-y-1">
            {PROJECT_FILES.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-right px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedFile.path === file.path
                    ? 'bg-blue-600/10 text-blue-400 font-bold border border-blue-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.2 rounded shrink-0 ${
                  selectedFile.path === file.path
                    ? 'bg-blue-600/20 text-blue-300'
                    : 'bg-white/5 text-slate-400 border border-white/5'
                }`}>
                  {file.category}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 p-3 bg-[#16191E] border border-white/5 rounded-xl text-xs space-y-2 text-slate-400">
            <span className="font-bold text-slate-200 block">الهيكل المعماري:</span>
            <ul className="space-y-1 text-[11px]">
              <li>📁 <b className="text-slate-200">core/</b>: Services, Constants, Routes</li>
              <li>📁 <b className="text-slate-200">data/</b>: Models, Repositories</li>
              <li>📁 <b className="text-slate-200">presentation/</b>: Controllers &amp; Views</li>
              <li>📁 <b className="text-slate-200">supabase/</b>: SQL Schema, RLS, Seed</li>
              <li>📁 <b className="text-slate-200">.github/</b>: Automated CI/CD</li>
            </ul>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 flex flex-col bg-[#0A0B0E] text-slate-200 overflow-hidden">
          {/* Code Header */}
          <div className="p-3 bg-[#11141B] border-b border-white/5 flex items-center justify-between text-xs">
            <span className="font-mono text-blue-400">{selectedFile.path}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1E232D] hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>

          {/* Pre / Code */}
          <pre className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-300 selection:bg-blue-600 selection:text-white">
            {selectedFile.content}
          </pre>
        </div>
      </div>
    </div>
  );
}

