import 'dart:io';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/services/supabase_service.dart';
import '../../core/services/storage_service.dart';

class AddCarController extends GetxController {
  final SupabaseService _supabase = SupabaseService.to;
  final StorageService _storage = StorageService.to;
  final ImagePicker _picker = ImagePicker();

  // Form Controllers
  final brandController = TextEditingController();
  final modelController = TextEditingController();
  final yearController = TextEditingController();
  final priceController = TextEditingController();
  final cityController = TextEditingController();
  final phoneController = TextEditingController();
  final whatsappController = TextEditingController();
  final descriptionController = TextEditingController();

  final RxList<File> selectedImages = <File>[].obs;
  final RxBool isSubmitting = false.obs;
  final RxString uploadProgressText = ''.obs;

  @override
  void onClose() {
    brandController.dispose();
    modelController.dispose();
    yearController.dispose();
    priceController.dispose();
    cityController.dispose();
    phoneController.dispose();
    whatsappController.dispose();
    descriptionController.dispose();
    super.onClose();
  }

  Future<void> pickImage(ImageSource source) async {
    try {
      if (selectedImages.length >= 6) {
        Get.snackbar(
          'تنبيه',
          'الحد الأقصى للصور هو 6 صور فقط',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.amber.shade800,
          colorText: Colors.white,
        );
        return;
      }

      final XFile? picked = await _picker.pickImage(
        source: source,
        maxWidth: 1600,
        maxHeight: 1600,
        imageQuality: 85,
      );

      if (picked != null) {
        selectedImages.add(File(picked.path));
      }
    } catch (e) {
      Get.snackbar(
        'خطأ',
        'تعذر اختيار الصورة: $e',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    }
  }

  void removeImage(int index) {
    if (index >= 0 && index < selectedImages.length) {
      selectedImages.removeAt(index);
    }
  }

  Future<void> submitListing() async {
    // Basic Form Validation
    if (brandController.text.trim().isEmpty ||
        modelController.text.trim().isEmpty ||
        yearController.text.trim().isEmpty ||
        priceController.text.trim().isEmpty ||
        cityController.text.trim().isEmpty ||
        phoneController.text.trim().isEmpty) {
      Get.snackbar(
        'تنبيه',
        'يرجى ملء جميع الحقول المطلوبة',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.shade700,
        colorText: Colors.white,
      );
      return;
    }

    if (selectedImages.isEmpty) {
      Get.snackbar(
        'تنبيه',
        'يرجى إرفاق صورة واحدة على الأقل للسيارة',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.amber.shade800,
        colorText: Colors.white,
      );
      return;
    }

    try {
      isSubmitting.value = true;
      uploadProgressText.value = 'جاري ضغط ورفع الصور إلى السحابة...';

      List<String> uploadedUrls = [];

      for (int i = 0; i < selectedImages.length; i++) {
        uploadProgressText.value = 'جاري رفع الصورة (${i + 1}/${selectedImages.length})...';
        final url = await _storage.uploadCarImage(selectedImages[i]);
        if (url != null) {
          uploadedUrls.add(url);
        }
      }

      uploadProgressText.value = 'جاري حفظ بيانات الإعلان...';

      final user = _supabase.currentUser;

      // Insert record to Supabase
      await _supabase.client.from('cars').insert({
        'brand': brandController.text.trim(),
        'model': modelController.text.trim(),
        'year': int.tryParse(yearController.text.trim()) ?? DateTime.now().year,
        'price': double.tryParse(priceController.text.trim()) ?? 0.0,
        'city': cityController.text.trim(),
        'phone': phoneController.text.trim(),
        'whatsapp': whatsappController.text.trim().isNotEmpty
            ? whatsappController.text.trim()
            : phoneController.text.trim(),
        'images': uploadedUrls,
        'description': descriptionController.text.trim(),
        'status': 'pending', // Individual listings wait for admin approval
        'user_id': user?.id,
        'created_at': DateTime.now().toIso8601String(),
      });

      Get.snackbar(
        'تم بنجاح! 🚗',
        'تم نشر إعلانك بنجاح وهو الآن قيد مراجعة الإدارة.',
        snackPosition: SnackPosition.TOP,
        backgroundColor: const Color(0xFF10B981),
        colorText: Colors.white,
        duration: const Duration(seconds: 4),
      );

      // Reset form
      _resetForm();
      Get.back();
    } catch (e) {
      Get.snackbar(
        'فشل النشر',
        'حدث خطأ أثناء حفظ الإعلان: $e',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isSubmitting.value = false;
      uploadProgressText.value = '';
    }
  }

  void _resetForm() {
    brandController.clear();
    modelController.clear();
    yearController.clear();
    priceController.clear();
    cityController.clear();
    phoneController.clear();
    whatsappController.clear();
    descriptionController.clear();
    selectedImages.clear();
  }
}
