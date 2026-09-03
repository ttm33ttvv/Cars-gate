import 'dart:io';
import 'dart:typed_data';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:get/get.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/supabase_config.dart';
import 'supabase_service.dart';

class StorageService extends GetxService {
  static StorageService get to => Get.find<StorageService>();

  final SupabaseClient _client = SupabaseService.to.client;

  /// Compress an image file to reduce bandwidth and storage consumption
  Future<Uint8List?> compressImage(File file, {int quality = 75}) async {
    try {
      final result = await FlutterImageCompress.compressWithFile(
        file.absolute.path,
        minWidth: 1024,
        minHeight: 1024,
        quality: quality,
      );
      return result;
    } catch (e) {
      // Fallback: read raw bytes if compression plugin fails
      return await file.readAsBytes();
    }
  }

  /// Upload car image to Supabase Storage and return its public URL
  Future<String?> uploadCarImage(File file) async {
    try {
      final compressedBytes = await compressImage(file);
      if (compressedBytes == null) return null;

      final fileName = 'car_${DateTime.now().millisecondsSinceEpoch}_${file.path.split('/').last}';
      final storagePath = 'cars/$fileName';

      await _client.storage.from(SupabaseConfig.carImagesBucket).uploadBinary(
            storagePath,
            compressedBytes,
            fileOptions: const FileOptions(
              contentType: 'image/jpeg',
              upsert: true,
            ),
          );

      final publicUrl = _client.storage
          .from(SupabaseConfig.carImagesBucket)
          .getPublicUrl(storagePath);

      return publicUrl;
    } catch (e) {
      Get.log('Error uploading image to Supabase: $e');
      return null;
    }
  }

  /// Upload showroom logo to Supabase Storage
  Future<String?> uploadShowroomLogo(File file) async {
    try {
      final compressedBytes = await compressImage(file, quality: 85);
      if (compressedBytes == null) return null;

      final fileName = 'showroom_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final storagePath = 'logos/$fileName';

      await _client.storage.from(SupabaseConfig.showroomLogosBucket).uploadBinary(
            storagePath,
            compressedBytes,
            fileOptions: const FileOptions(contentType: 'image/jpeg', upsert: true),
          );

      return _client.storage
          .from(SupabaseConfig.showroomLogosBucket)
          .getPublicUrl(storagePath);
    } catch (e) {
      Get.log('Error uploading showroom logo: $e');
      return null;
    }
  }
}
