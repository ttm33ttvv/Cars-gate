import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/routes/app_routes.dart';
import '../../controllers/chat_controller.dart';
import '../../../data/models/conversation_model.dart';

class ConversationsView extends StatelessWidget {
  const ConversationsView({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ChatController());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text('conversations'.tr),
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        if (controller.conversations.isEmpty) {
          // Provide sample fallback list if database has no active conversations yet
          final sampleConversations = [
            ConversationModel(
              id: 'sample_conv_1',
              participant1: '33333333-3333-3333-3333-333333333333',
              participant2: '22222222-2222-2222-2222-222222222222',
              carId: 'c1111111-0000-0000-0000-000000000001',
              lastMessage: 'مرحباً، هل السيارة مفحوصة وجاهزة للنقل؟',
              updatedAt: DateTime.now().subtract(const Duration(minutes: 15)),
              otherUserName: 'معرض النخبة للسيارات الفاخرة',
              carTitle: 'مرسيدس بنز S500',
            ),
            ConversationModel(
              id: 'sample_conv_2',
              participant1: '33333333-3333-3333-3333-333333333333',
              participant2: '22222222-2222-2222-2222-222222222222',
              carId: 'c1111111-0000-0000-0000-000000000003',
              lastMessage: 'نعم متوفرة في فرع جدة، يمكنك المعاينة اليوم.',
              updatedAt: DateTime.now().subtract(const Duration(hours: 2)),
              otherUserName: 'أوتو ستار العالمية',
              carTitle: 'تويوتا لاند كروزر VXR',
            ),
          ];

          return ListView.separated(
            itemCount: sampleConversations.length,
            separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.cardBorder),
            itemBuilder: (context, index) {
              final conv = sampleConversations[index];
              return _buildConversationTile(conv);
            },
          );
        }

        return ListView.separated(
          itemCount: controller.conversations.length,
          separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.cardBorder),
          itemBuilder: (context, index) {
            final conv = controller.conversations[index];
            return _buildConversationTile(conv);
          },
        );
      }),
    );
  }

  Widget _buildConversationTile(ConversationModel conv) {
    return ListTile(
      tileColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      leading: CircleAvatar(
        radius: 26,
        backgroundColor: AppColors.primaryLight,
        child: const Icon(Icons.storefront_rounded, color: Colors.white, size: 24),
      ),
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              conv.otherUserName ?? 'معرض سيارات',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Text(
            DateFormat('hh:mm a').format(conv.updatedAt),
            style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
          ),
        ],
      ),
      subtitle: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (conv.carTitle != null) ...[
            const SizedBox(height: 2),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.surfaceMuted,
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                conv.carTitle!,
                style: const TextStyle(color: AppColors.accent, fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ),
          ],
          const SizedBox(height: 4),
          Text(
            conv.lastMessage,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
        ],
      ),
      onTap: () {
        Get.toNamed(AppRoutes.chatRoom, arguments: {'conversation': conv});
      },
    );
  }
}
