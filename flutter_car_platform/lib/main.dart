import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get/get.dart';
import 'core/constants/app_theme.dart';
import 'core/routes/app_pages.dart';
import 'core/routes/app_routes.dart';
import 'core/services/notification_service.dart';
import 'core/services/storage_service.dart';
import 'core/services/supabase_service.dart';
import 'core/translations/app_translations.dart';
import 'presentation/controllers/auth_controller.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables (.env)
  try {
    await dotenv.load(fileName: '.env');
  } catch (e) {
    debugPrint('Note: .env file not found, using default fallback variables.');
  }

  // Initialize Core Services with GetX Dependency Injection
  await Get.putAsync<SupabaseService>(() => SupabaseService().init());
  Get.put<StorageService>(StorageService());
  await Get.putAsync<NotificationService>(() => NotificationService().init());
  Get.put<AuthController>(AuthController(), permanent: true);

  runApp(const CarPlatformApp());
}

class CarPlatformApp extends StatelessWidget {
  const CarPlatformApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'منصة معارض السيارات',
      debugShowCheckedModeBanner: false,

      // Internationalization & RTL Arabic Support
      translations: AppTranslations(),
      locale: const Locale('ar', 'SA'),
      fallbackLocale: AppTranslations.fallbackLocale,

      // Theme
      theme: AppTheme.lightTheme,

      // Routing
      initialRoute: AppRoutes.splash,
      getPages: AppPages.routes,
    );
  }
}
