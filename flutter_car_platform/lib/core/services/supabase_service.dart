import 'package:get/get.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/supabase_config.dart';

class SupabaseService extends GetxService {
  static SupabaseService get to => Get.find<SupabaseService>();

  late final SupabaseClient client;

  Future<SupabaseService> init() async {
    await Supabase.initialize(
      url: SupabaseConfig.url,
      anonKey: SupabaseConfig.anonKey,
      realtimeClientOptions: const RealtimeClientOptions(
        eventsPerSecond: 10,
      ),
    );
    client = Supabase.instance.client;
    return this;
  }

  // Get current session / user
  User? get currentUser => client.auth.currentUser;
  bool get isAuthenticated => currentUser != null;

  // Realtime stream for messages of a conversation
  Stream<List<Map<String, dynamic>>> streamMessages(String conversationId) {
    return client
        .from('messages')
        .stream(primaryKey: ['id'])
        .eq('conversation_id', conversationId)
        .order('created_at', ascending: true);
  }

  // Realtime stream for conversations
  Stream<List<Map<String, dynamic>>> streamConversations(String userId) {
    return client
        .from('conversations')
        .stream(primaryKey: ['id'])
        .order('updated_at', ascending: false);
  }

  // Realtime stream for pending cars (for admin)
  Stream<List<Map<String, dynamic>>> streamCars() {
    return client
        .from('cars')
        .stream(primaryKey: ['id'])
        .order('created_at', ascending: false);
  }
}
