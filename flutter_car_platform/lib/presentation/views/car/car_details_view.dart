import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/routes/app_routes.dart';
import '../../../data/models/car_model.dart';
import '../../../data/models/conversation_model.dart';

class CarDetailsView extends StatefulWidget {
  const CarDetailsView({super.key});

  @override
  State<CarDetailsView> createState() => _CarDetailsViewState();
}

class _CarDetailsViewState extends State<CarDetailsView> {
  late final CarModel car;
  int _currentImageIndex = 0;

  @override
  void initState() {
    super.initState();
    car = Get.arguments as CarModel;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // App Bar with Image Slider
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            backgroundColor: AppColors.primary,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  PageView.builder(
                    itemCount: car.images.isNotEmpty ? car.images.length : 1,
                    onPageChanged: (i) => setState(() => _currentImageIndex = i),
                    itemBuilder: (context, index) {
                      final url = car.images.isNotEmpty ? car.images[index] : car.mainImage;
                      return CachedNetworkImage(
                        imageUrl: url,
                        fit: BoxFit.cover,
                      );
                    },
                  ),
                  if (car.images.length > 1)
                    Positioned(
                      bottom: 16,
                      right: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.6),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '${_currentImageIndex + 1} / ${car.images.length}',
                          style: const TextStyle(color: Colors.white, fontSize: 12),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Price and Year
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${car.price.toStringAsFixed(0)} ${'currency'.tr}',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: AppColors.accent,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'موديل ${car.year}',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  // Car Title
                  Text(
                    '${car.brand} ${car.model}',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),

                  const SizedBox(height: 6),

                  Row(
                    children: [
                      const Icon(Icons.location_on, color: AppColors.textSecondary, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        car.city,
                        style: const TextStyle(color: AppColors.textSecondary, fontSize: 14),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),
                  const Divider(color: AppColors.cardBorder),
                  const SizedBox(height: 16),

                  // Specifications Card
                  const Text(
                    'المواصفات الأساسية',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),

                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.cardBorder),
                    ),
                    child: Column(
                      children: [
                        _buildSpecRow('الماركة', car.brand),
                        const Divider(height: 20, color: AppColors.cardBorder),
                        _buildSpecRow('الموديل', car.model),
                        const Divider(height: 20, color: AppColors.cardBorder),
                        _buildSpecRow('سنة الصنع', '${car.year}'),
                        const Divider(height: 20, color: AppColors.cardBorder),
                        _buildSpecRow('المدينة', car.city),
                      ],
                    ),
                  ),

                  if (car.description != null && car.description!.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    const Text(
                      'الوصف والتفاصيل',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.cardBorder),
                      ),
                      child: Text(
                        car.description!,
                        style: const TextStyle(fontSize: 14, height: 1.6, color: AppColors.textPrimary),
                      ),
                    ),
                  ],

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),

      // Bottom Sticky Actions
      bottomSheet: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 10,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              // Chat Button
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // Navigate to chat room with this car attached
                    final dummyConv = ConversationModel(
                      id: 'conv_${car.id}',
                      participant1: '33333333-3333-3333-3333-333333333333',
                      participant2: car.userId ?? '22222222-2222-2222-2222-222222222222',
                      carId: car.id,
                      lastMessage: 'استفسار بخصوص ${car.brand} ${car.model}',
                      updatedAt: DateTime.now(),
                      carTitle: '${car.brand} ${car.model}',
                    );
                    Get.toNamed(AppRoutes.chatRoom, arguments: {'conversation': dummyConv, 'car': car});
                  },
                  icon: const Icon(Icons.chat_bubble_outline_rounded, size: 18),
                  label: const Text('محادثة فورية'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
              const SizedBox(width: 10),

              // WhatsApp Button
              if (car.whatsapp != null || car.phone != null)
                IconButton(
                  onPressed: () {
                    final p = car.whatsapp ?? car.phone ?? '';
                    final cleaned = p.replaceAll(RegExp(r'[^0-9+]'), '');
                    launchUrl(
                      Uri.parse('https://wa.me/$cleaned'),
                      mode: LaunchMode.externalApplication,
                    );
                  },
                  icon: const Icon(Icons.chat_rounded, color: Colors.white),
                  style: IconButton.styleFrom(
                    backgroundColor: const Color(0xFF25D366),
                    padding: const EdgeInsets.all(12),
                  ),
                ),
              const SizedBox(width: 6),

              // Call Button
              if (car.phone != null)
                IconButton(
                  onPressed: () => launchUrl(Uri.parse('tel:${car.phone}')),
                  icon: const Icon(Icons.phone_rounded, color: Colors.white),
                  style: IconButton.styleFrom(
                    backgroundColor: AppColors.accent,
                    padding: const EdgeInsets.all(12),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSpecRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 14)),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
      ],
    );
  }
}
