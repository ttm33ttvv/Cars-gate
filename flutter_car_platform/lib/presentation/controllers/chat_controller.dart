import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/services/supabase_service.dart';
import '../../data/models/message_model.dart';
import '../../data/models/conversation_model.dart';
import '../../data/models/car_model.dart';

class ChatController extends GetxController {
  final SupabaseService _supabase = SupabaseService.to;

  final RxList<ConversationModel> conversations = <ConversationModel>[].obs;
  final RxList<MessageModel> activeMessages = <MessageModel>[].obs;
  final RxBool isLoading = false.obs;

  final messageInputController = TextEditingController();
  final ScrollController scrollController = ScrollController();

  ConversationModel? currentConversation;
  CarModel? attachedCar;

  @override
  void onInit() {
    super.onInit();
    fetchConversations();
  }

  @override
  void onClose() {
    messageInputController.dispose();
    scrollController.dispose();
    super.onClose();
  }

  Future<void> fetchConversations() async {
    try {
      isLoading.value = true;
      final currentUserId = _supabase.currentUser?.id ?? '33333333-3333-3333-3333-333333333333';

      final response = await _supabase.client
          .from('conversations')
          .select()
          .order('updated_at', ascending: false);

      final list = (response as List)
          .map((item) => ConversationModel.fromJson(item as Map<String, dynamic>))
          .toList();

      conversations.assignAll(list);
    } catch (e) {
      Get.log('Error fetching conversations: $e');
    } finally {
      isLoading.value = false;
    }
  }

  void subscribeToMessages(String conversationId) {
    activeMessages.clear();

    // Supabase Realtime Stream for Instant Messaging
    _supabase.client
        .from('messages')
        .stream(primaryKey: ['id'])
        .eq('conversation_id', conversationId)
        .order('created_at', ascending: true)
        .listen((List<Map<String, dynamic>> data) {
      final messages = data.map((json) => MessageModel.fromJson(json)).toList();
      activeMessages.assignAll(messages);

      // Smooth auto scroll to bottom
      Future.delayed(const Duration(milliseconds: 150), () {
        if (scrollController.hasClients) {
          scrollController.animateTo(
            scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeOut,
          );
        }
      });
    });
  }

  Future<void> sendMessage({String? customContent}) async {
    final text = customContent ?? messageInputController.text.trim();
    if (text.isEmpty) return;

    final currentUserId = _supabase.currentUser?.id ?? '33333333-3333-3333-3333-333333333333';
    final convId = currentConversation?.id;

    if (convId == null) return;

    try {
      if (customContent == null) {
        messageInputController.clear();
      }

      // Insert message
      await _supabase.client.from('messages').insert({
        'conversation_id': convId,
        'sender_id': currentUserId,
        'receiver_id': currentConversation?.participant2 ?? '22222222-2222-2222-2222-222222222222',
        'car_id': attachedCar?.id ?? currentConversation?.carId,
        'content': text,
        'created_at': DateTime.now().toIso8601String(),
      });

      // Update conversation last_message
      await _supabase.client.from('conversations').update({
        'last_message': text,
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('id', convId);

    } catch (e) {
      Get.snackbar(
        'خطأ في الإرسال',
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    }
  }

  // Quick WhatsApp Launcher
  Future<void> openWhatsApp(String phone, {String? carTitle}) async {
    final cleanedPhone = phone.replaceAll(RegExp(r'[^0-9+]'), '');
    final msg = Uri.encodeComponent(
      'السلام عليكم، بخصوص إعلان السيارة المعروضة في التطبيق: ${carTitle ?? ""}',
    );
    final url = Uri.parse('https://wa.me/$cleanedPhone?text=$msg');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } else {
      Get.snackbar('تنبيه', 'تعذر فتح تطبيق واتساب على هذا الجهاز');
    }
  }

  // Phone Call Launcher
  Future<void> makePhoneCall(String phone) async {
    final url = Uri.parse('tel:$phone');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    } else {
      Get.snackbar('تنبيه', 'تعذر إجراء الاتصال الهاتفي');
    }
  }
}
