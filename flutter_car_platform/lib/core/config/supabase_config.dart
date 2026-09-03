import 'package:flutter_dotenv/flutter_dotenv.dart';

class SupabaseConfig {
  static String get url {
    return dotenv.env['SUPABASE_URL'] ?? 'https://your-project.supabase.co';
  }

  static String get anonKey {
    return dotenv.env['SUPABASE_ANON_KEY'] ?? 'your-anon-key';
  }

  // Storage Bucket Names
  static const String carImagesBucket = 'car-images';
  static const String showroomLogosBucket = 'showroom-logos';
  static const String avatarsBucket = 'avatars';
}
