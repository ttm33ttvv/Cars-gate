import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_text_field.dart';
import '../../controllers/add_car_controller.dart';

class AddCarView extends StatelessWidget {
  const AddCarView({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(AddCarController());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text('add_car'.tr),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Instructions banner
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.04),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.primary.withOpacity(0.1)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline_rounded, color: AppColors.primary, size: 22),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'أضف صور وتفاصيل سيارتك بدقة ليصل إعلانك لآلاف المشترين فور مراجعته من الإدارة.',
                      style: TextStyle(color: AppColors.textPrimary, fontSize: 13, height: 1.4),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Photos Section Header
            Text(
              'upload_photos'.tr,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),

            // Images Horizontal List / Pick Box
            Obx(() => SizedBox(
                  height: 110,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      // Add Photo Box
                      if (controller.selectedImages.length < 6)
                        InkWell(
                          onTap: () => _showImageSourcePicker(context, controller),
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            width: 100,
                            margin: const EdgeInsets.only(right: 10),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.accent, width: 1.5, style: BorderStyle.solid),
                            ),
                            child: const Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.add_a_photo_outlined, color: AppColors.accent, size: 28),
                                SizedBox(height: 6),
                                Text(
                                  'إضافة صورة',
                                  style: TextStyle(color: AppColors.accent, fontSize: 12, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                        ),

                      // Selected Images List
                      ...List.generate(controller.selectedImages.length, (index) {
                        final file = controller.selectedImages[index];
                        return Stack(
                          children: [
                            Container(
                              width: 100,
                              margin: const EdgeInsets.only(right: 10),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
                                image: DecorationImage(
                                  image: FileImage(file),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                            Positioned(
                              top: 4,
                              right: 14,
                              child: InkWell(
                                onTap: () => controller.removeImage(index),
                                child: Container(
                                  padding: const EdgeInsets.all(3),
                                  decoration: const BoxDecoration(
                                    color: Colors.black87,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.close, color: Colors.white, size: 14),
                                ),
                              ),
                            ),
                          ],
                        );
                      }),
                    ],
                  ),
                )),

            const SizedBox(height: 24),

            // Form Fields
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: CustomTextField(
                          controller: controller.brandController,
                          label: 'brand'.tr,
                          hint: 'مثال: تويوتا، مرسيدس',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: CustomTextField(
                          controller: controller.modelController,
                          label: 'model'.tr,
                          hint: 'مثال: كامري، S500',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: CustomTextField(
                          controller: controller.yearController,
                          label: 'year'.tr,
                          hint: 'مثال: 2024',
                          keyboardType: TextInputType.number,
                          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: CustomTextField(
                          controller: controller.priceController,
                          label: '${'price'.tr} (${'currency'.tr})',
                          hint: 'مثال: 125000',
                          keyboardType: TextInputType.number,
                          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  CustomTextField(
                    controller: controller.cityController,
                    label: 'city'.tr,
                    hint: 'مثال: الرياض، جدة، الدمام',
                    prefixIcon: Icons.location_city_rounded,
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: CustomTextField(
                          controller: controller.phoneController,
                          label: 'phone'.tr,
                          hint: '05xxxxxxxx',
                          keyboardType: TextInputType.phone,
                          prefixIcon: Icons.phone_rounded,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: CustomTextField(
                          controller: controller.whatsappController,
                          label: 'واتساب (اختياري)',
                          hint: '05xxxxxxxx',
                          keyboardType: TextInputType.phone,
                          prefixIcon: Icons.chat_bubble_rounded,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  CustomTextField(
                    controller: controller.descriptionController,
                    label: 'description'.tr,
                    hint: 'اذكر حالة السيارة، الممشى، المواصفات، الفحص...',
                    maxLines: 4,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Progress text if uploading
            Obx(() {
              if (controller.uploadProgressText.isNotEmpty) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Center(
                    child: Text(
                      controller.uploadProgressText.value,
                      style: const TextStyle(
                        color: AppColors.accent,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                );
              }
              return const SizedBox.shrink();
            }),

            // Publish Ad Button
            Obx(() => CustomButton(
                  text: 'publish_ad'.tr,
                  icon: Icons.check_circle_outline_rounded,
                  isLoading: controller.isSubmitting.value,
                  onPressed: () => controller.submitListing(),
                )),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  void _showImageSourcePicker(BuildContext context, AddCarController controller) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'اختر مصدر الصورة',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 18),
                ListTile(
                  leading: const Icon(Icons.photo_library_rounded, color: AppColors.primary),
                  title: Text('from_gallery'.tr),
                  onTap: () {
                    Get.back();
                    controller.pickImage(ImageSource.gallery);
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.camera_alt_rounded, color: AppColors.accent),
                  title: Text('take_photo'.tr),
                  onTap: () {
                    Get.back();
                    controller.pickImage(ImageSource.camera);
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
