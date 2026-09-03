import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:get/get.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../routes/app_routes.dart';
import '../../data/models/user_preference_model.dart';
import '../../data/models/notification_model.dart';

class NotificationService extends GetxService {
  static NotificationService get to => Get.find<NotificationService>();

  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  RealtimeChannel? _chatChannel;
  RealtimeChannel? _carAlertsChannel;

  // Reactive state
  final RxInt unreadCount = 0.obs;
  final RxList<NotificationModel> notificationsList = <NotificationModel>[].obs;
  final Rx<UserPreferenceModel?> userPreferences = Rx<UserPreferenceModel?>(null);

  Future<NotificationService> init() async {
    await _initializeLocalNotifications();
    return this;
  }

  /// Initialize Android & iOS local notification settings and channels
  Future<void> _initializeLocalNotifications() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const darwinSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: darwinSettings,
    );

    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    // Create high-importance Android Notification Channels
    final androidImplementation = _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>();

    if (androidImplementation != null) {
      // 1. Channel for Chat Messages
      await androidImplementation.createNotificationChannel(
        const AndroidNotificationChannel(
          'chat_channel',
          'رسائل المحادثات الفورية (Chat Messages)',
          description: 'إشعارات الرسائل الجديدة في المحادثات المباشرة',
          importance: Importance.max,
          enableVibration: true,
          playSound: true,
        ),
      );

      // 2. Channel for Car Alerts Matching Preferences
      await androidImplementation.createNotificationChannel(
        const AndroidNotificationChannel(
          'car_alerts_channel',
          'تنبيهات السيارات المطابقة (Car Alerts)',
          description: 'إشعارات وصول سيارات جديدة مطابقة لتفضيلات البحث المحفوظة',
          importance: Importance.high,
          enableVibration: true,
          playSound: true,
        ),
      );
    }
  }

  /// Handles deep-link routing when user taps a notification banner
  void _onNotificationTapped(NotificationResponse response) {
    if (response.payload == null || response.payload!.isEmpty) return;

    try {
      final Map<String, dynamic> data = jsonDecode(response.payload!);
      final String? route = data['route'];
      final dynamic arguments = data['arguments'];

      if (route != null) {
        if (route == AppRoutes.chatRoom) {
          Get.toNamed(AppRoutes.chatRoom, arguments: arguments);
        } else if (route == AppRoutes.carDetails) {
          Get.toNamed(AppRoutes.carDetails, arguments: arguments);
        }
      }
    } catch (e) {
      debugPrint('Error parsing notification payload: $e');
    }
  }

  /// Set up push notifications & Supabase Realtime listeners for active user
  Future<void> setupUserNotifications(String userId) async {
    await fetchUserPreferences(userId);
    subscribeToChatNotifications(userId);
    if (userPreferences.value != null) {
      subscribeToCarPreferencesNotifications(userPreferences.value!);
    }
    await fetchNotificationsHistory(userId);
  }

  /// 1. REALTIME LISTENER FOR CHAT MESSAGES
  void subscribeToChatNotifications(String currentUserId) {
    final client = Supabase.instance.client;

    // Unsubscribe from existing channel if active
    if (_chatChannel != null) {
      client.removeChannel(_chatChannel!);
    }

    _chatChannel = client
        .channel('public:messages:$currentUserId')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'messages',
          filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'receiver_id',
            value: currentUserId,
          ),
          callback: (payload) async {
            final newRecord = payload.newRecord;
            final senderId = newRecord['sender_id'] as String;

            // Don't notify self
            if (senderId == currentUserId) return;

            final content = newRecord['content'] as String? ?? 'رسالة جديدة';
            final conversationId = newRecord['conversation_id'] as String?;

            // Fetch sender profile name
            String senderName = 'مستخدم';
            try {
              final userRow = await client
                  .from('users')
                  .select('name')
                  .eq('id', senderId)
                  .maybeSingle();
              if (userRow != null && userRow['name'] != null) {
                senderName = userRow['name'];
              }
            } catch (_) {}

            // Display Local Push Notification Banner
            await showChatNotification(
              id: newRecord['id'].hashCode,
              title: '💬 رسالة جديدة من $senderName',
              body: content,
              payload: jsonEncode({
                'route': AppRoutes.chatRoom,
                'arguments': {
                  'conversation_id': conversationId,
                  'other_user_name': senderName,
                },
              }),
            );

            // Add to reactive notification list
            final notificationItem = NotificationModel(
              id: newRecord['id'] as String? ?? UniqueKey().toString(),
              userId: currentUserId,
              title: 'رسالة جديدة من $senderName',
              body: content,
              type: 'chat_message',
              data: {'conversation_id': conversationId},
              createdAt: DateTime.now(),
            );
            notificationsList.insert(0, notificationItem);
            unreadCount.value++;
          },
        )
        .subscribe();
  }

  /// 2. REALTIME LISTENER FOR NEW CARS MATCHING USER PREFERENCES
  void subscribeToCarPreferencesNotifications(UserPreferenceModel preferences) {
    if (!preferences.notifyOnNewCars) return;

    final client = Supabase.instance.client;

    if (_carAlertsChannel != null) {
      client.removeChannel(_carAlertsChannel!);
    }

    _carAlertsChannel = client
        .channel('public:cars:alerts:${preferences.userId}')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'cars',
          callback: (payload) async {
            final newCar = payload.newRecord;
            final status = newCar['status'] as String? ?? 'active';

            // Only notify for active/approved cars
            if (status != 'active') return;

            final brand = newCar['brand'] as String? ?? '';
            final model = newCar['model'] as String? ?? '';
            final city = newCar['city'] as String? ?? '';
            final price = double.tryParse(newCar['price']?.toString() ?? '0') ?? 0;

            // Check if car matches current user's preferences
            if (preferences.matchesCar(brand: brand, price: price, city: city)) {
              await showCarAlertNotification(
                id: newCar['id'].hashCode,
                title: '🚗 سيارة مطابقة لتفضيلاتك!',
                body: 'تمت إضافة $brand $model بسعر ${price.toStringAsFixed(0)} ر.س في $city',
                payload: jsonEncode({
                  'route': AppRoutes.carDetails,
                  'arguments': newCar,
                }),
              );

              final notificationItem = NotificationModel(
                id: newCar['id'] as String? ?? UniqueKey().toString(),
                userId: preferences.userId,
                title: 'سيارة مطابقة: $brand $model',
                body: 'وصلت سيارة مطابقة لتفضيلاتك بسعر ${price.toStringAsFixed(0)} ر.س',
                type: 'new_car_match',
                data: {'car_id': newCar['id']},
                createdAt: DateTime.now(),
              );
              notificationsList.insert(0, notificationItem);
              unreadCount.value++;
            }
          },
        )
        .subscribe();
  }

  /// Display Chat Notification
  Future<void> showChatNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'chat_channel',
      'رسائل المحادثات الفورية',
      channelDescription: 'تنبيهات فورية بالرسائل الواردة',
      importance: Importance.max,
      priority: Priority.high,
      showWhen: true,
      category: AndroidNotificationCategory.message,
    );

    const notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    );

    await _localNotifications.show(id, title, body, notificationDetails, payload: payload);
  }

  /// Display Car Alert Notification
  Future<void> showCarAlertNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'car_alerts_channel',
      'تنبيهات السيارات المطابقة',
      channelDescription: 'تنبيهات السيارات التي تناسب معايير بحثك المحفوظة',
      importance: Importance.high,
      priority: Priority.high,
      showWhen: true,
    );

    const notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    );

    await _localNotifications.show(id, title, body, notificationDetails, payload: payload);
  }

  /// Fetch User Preferences from Supabase Database
  Future<void> fetchUserPreferences(String userId) async {
    try {
      final client = Supabase.instance.client;
      final response = await client
          .from('user_preferences')
          .select()
          .eq('user_id', userId)
          .maybeSingle();

      if (response != null) {
        userPreferences.value = UserPreferenceModel.fromJson(response);
      } else {
        // Default preferences
        userPreferences.value = UserPreferenceModel(userId: userId);
      }
    } catch (e) {
      debugPrint('Error loading user preferences: $e');
      userPreferences.value = UserPreferenceModel(userId: userId);
    }
  }

  /// Save / Update User Preferences in Supabase
  Future<bool> saveUserPreferences(UserPreferenceModel preferences) async {
    try {
      final client = Supabase.instance.client;
      await client.from('user_preferences').upsert(
            preferences.toJson(),
            onConflict: 'user_id',
          );
      userPreferences.value = preferences;

      // Re-subscribe with updated filters
      subscribeToCarPreferencesNotifications(preferences);
      return true;
    } catch (e) {
      debugPrint('Error saving preferences: $e');
      return false;
    }
  }

  /// Load Notification History
  Future<void> fetchNotificationsHistory(String userId) async {
    try {
      final client = Supabase.instance.client;
      final response = await client
          .from('notifications')
          .select()
          .eq('user_id', userId)
          .order('created_at', ascending: false)
          .limit(30);

      final list = (response as List<dynamic>)
          .map((json) => NotificationModel.fromJson(json as Map<String, dynamic>))
          .toList();

      notificationsList.assignAll(list);
      unreadCount.value = list.where((n) => !n.isRead).length;
    } catch (_) {}
  }

  /// Mark all notifications as read
  Future<void> markAllAsRead(String userId) async {
    try {
      final client = Supabase.instance.client;
      await client
          .from('notifications')
          .update({'is_read': true})
          .eq('user_id', userId);

      for (var i = 0; i < notificationsList.length; i++) {
        notificationsList[i] = notificationsList[i].copyWith(isRead: true);
      }
      unreadCount.value = 0;
    } catch (_) {}
  }

  /// Clean up Realtime channels on user logout
  void disposeSubscriptions() {
    final client = Supabase.instance.client;
    if (_chatChannel != null) {
      client.removeChannel(_chatChannel!);
      _chatChannel = null;
    }
    if (_carAlertsChannel != null) {
      client.removeChannel(_carAlertsChannel!);
      _carAlertsChannel = null;
    }
    notificationsList.clear();
    unreadCount.value = 0;
  }
}
