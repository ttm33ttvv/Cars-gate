import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/routes/app_routes.dart';
import '../../core/services/notification_service.dart';
import '../../data/models/user_model.dart';

class AuthController extends GetxController {
  static AuthController get to => Get.find<AuthController>();

  final SupabaseClient _client = Supabase.instance.client;
  StreamSubscription<AuthState>? _authSubscription;

  // Reactive State Variables
  final Rx<User?> currentUser = Rx<User?>(null);
  final Rx<UserModel?> userProfile = Rx<UserModel?>(null);
  final RxBool isLoading = false.obs;
  final RxBool isPasswordVisible = false.obs;
  final RxBool isConfirmPasswordVisible = false.obs;
  final RxString selectedRole = 'user'.obs; // 'user' (فرد/مشتري) or 'showroom_owner' (معرض)
  final RxString errorMessage = ''.obs;

  // Text Editing Controllers for Login Form
  final loginEmailController = TextEditingController();
  final loginPasswordController = TextEditingController();

  // Text Editing Controllers for Sign-Up Form
  final signupNameController = TextEditingController();
  final signupEmailController = TextEditingController();
  final signupPhoneController = TextEditingController();
  final signupPasswordController = TextEditingController();
  final signupConfirmPasswordController = TextEditingController();

  // Text Editing Controller for Reset Password
  final resetEmailController = TextEditingController();

  // New Password Controller for password update
  final newPasswordController = TextEditingController();

  @override
  void onInit() {
    super.onInit();
    _initAuthListener();
  }

  @override
  void onClose() {
    _authSubscription?.cancel();
    loginEmailController.dispose();
    loginPasswordController.dispose();
    signupNameController.dispose();
    signupEmailController.dispose();
    signupPhoneController.dispose();
    signupPasswordController.dispose();
    signupConfirmPasswordController.dispose();
    resetEmailController.dispose();
    newPasswordController.dispose();
    super.onClose();
  }

  /// 1. Initialize Supabase Auth State Listener for Session Management
  void _initAuthListener() {
    currentUser.value = _client.auth.currentUser;

    _authSubscription = _client.auth.onAuthStateChange.listen((data) async {
      final AuthChangeEvent event = data.event;
      final Session? session = data.session;

      currentUser.value = session?.user;

      switch (event) {
        case AuthChangeEvent.signedIn:
          if (session?.user != null) {
            await _loadUserProfile(session!.user.id);
            // Setup realtime push notifications for this user
            if (Get.isRegistered<NotificationService>()) {
              await NotificationService.to.setupUserNotifications(session.user.id);
            }
          }
          break;
        case AuthChangeEvent.signedOut:
          userProfile.value = null;
          if (Get.isRegistered<NotificationService>()) {
            NotificationService.to.disposeSubscriptions();
          }
          Get.offAllNamed(AppRoutes.login);
          break;
        case AuthChangeEvent.tokenRefreshed:
          debugPrint('Supabase Auth: Session token refreshed securely.');
          break;
        case AuthChangeEvent.passwordRecovery:
          // User clicked password reset link in email
          Get.toNamed(AppRoutes.forgotPassword, arguments: {'isRecovery': true});
          break;
        default:
          break;
      }
    });
  }

  /// 2. Load User Profile from 'public.users' Table
  Future<void> _loadUserProfile(String userId) async {
    try {
      final data = await _client
          .from('users')
          .select()
          .eq('id', userId)
          .maybeSingle();

      if (data != null) {
        userProfile.value = UserModel.fromJson(data);
      }
    } catch (e) {
      debugPrint('Error loading user profile: $e');
    }
  }

  /// 3. SIGN IN WITH EMAIL & PASSWORD
  Future<bool> signIn() async {
    final email = loginEmailController.text.trim();
    final password = loginPasswordController.text;

    if (email.isEmpty || !GetUtils.isEmail(email)) {
      _showSnackbar('خطأ في الإدخال', 'يرجى إدخال بريد إلكتروني صحيح', isError: true);
      return false;
    }

    if (password.isEmpty) {
      _showSnackbar('خطأ في الإدخال', 'يرجى إدخال كلمة المرور', isError: true);
      return false;
    }

    try {
      isLoading.value = true;
      errorMessage.value = '';

      final AuthResponse response = await _client.auth.signInWithPassword(
        email: email,
        password: password,
      );

      if (response.user != null) {
        await _loadUserProfile(response.user!.id);

        _showSnackbar('مرحباً بك', 'تم تسجيل الدخول بنجاح');
        loginPasswordController.clear();

        // Redirect based on user role
        if (userProfile.value?.role == 'admin') {
          Get.offAllNamed(AppRoutes.adminDashboard);
        } else {
          Get.offAllNamed(AppRoutes.home);
        }
        return true;
      }
      return false;
    } on AuthException catch (e) {
      errorMessage.value = _translateAuthError(e.message);
      _showSnackbar('فشل تسجيل الدخول', errorMessage.value, isError: true);
      return false;
    } catch (e) {
      _showSnackbar('خطأ غير متوقع', 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً', isError: true);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /// 4. SIGN UP NEW USER
  Future<bool> signUp() async {
    final name = signupNameController.text.trim();
    final email = signupEmailController.text.trim();
    final phone = signupPhoneController.text.trim();
    final password = signupPasswordController.text;
    final confirmPassword = signupConfirmPasswordController.text;
    final role = selectedRole.value;

    // Validations
    if (name.length < 3) {
      _showSnackbar('خطأ', 'يرجى كتابة الاسم الكامل (3 أحرف على الأقل)', isError: true);
      return false;
    }

    if (!GetUtils.isEmail(email)) {
      _showSnackbar('خطأ', 'يرجى كتابة بريد إلكتروني صحيح', isError: true);
      return false;
    }

    if (phone.length < 9) {
      _showSnackbar('خطأ', 'يرجى إدخال رقم هاتف صحيح', isError: true);
      return false;
    }

    if (password.length < 6) {
      _showSnackbar('خطأ', 'كلمة المرور يجب أن لا تقل عن 6 خانات', isError: true);
      return false;
    }

    if (password != confirmPassword) {
      _showSnackbar('خطأ', 'كلمتا المرور غير متطابقتين', isError: true);
      return false;
    }

    try {
      isLoading.value = true;
      errorMessage.value = '';

      final AuthResponse response = await _client.auth.signUp(
        email: email,
        password: password,
        data: {
          'name': name,
          'phone': phone,
          'role': role,
        },
      );

      if (response.user != null) {
        // Automatically save/ensure user profile row exists in public.users
        await _client.from('users').upsert({
          'id': response.user!.id,
          'email': email,
          'name': name,
          'phone': phone,
          'role': role,
        });

        // Initialize default user preferences for alerts
        await _client.from('user_preferences').upsert({
          'user_id': response.user!.id,
          'notify_on_new_cars': true,
          'notify_on_chat_messages': true,
        });

        _showSnackbar('تم بنجاح', 'تم إنشاء حسابك بنجاح! تم تسجيل الدخول تلقائياً.');
        Get.offAllNamed(AppRoutes.home);
        return true;
      }
      return false;
    } on AuthException catch (e) {
      errorMessage.value = _translateAuthError(e.message);
      _showSnackbar('فشل إنشاء الحساب', errorMessage.value, isError: true);
      return false;
    } catch (e) {
      _showSnackbar('خطأ', 'حدث خطأ أثناء إنشاء الحساب', isError: true);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /// 5. PASSWORD RESET (FORGOT PASSWORD)
  Future<bool> sendPasswordResetEmail() async {
    final email = resetEmailController.text.trim();

    if (!GetUtils.isEmail(email)) {
      _showSnackbar('خطأ', 'يرجى إدخال بريد إلكتروني صحيح', isError: true);
      return false;
    }

    try {
      isLoading.value = true;
      await _client.auth.resetPasswordForEmail(
        email,
        redirectTo: 'io.supabase.carplatform://reset-callback',
      );

      _showSnackbar(
        'تم إرسال الرابط',
        'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح',
      );
      return true;
    } on AuthException catch (e) {
      _showSnackbar('خطأ', _translateAuthError(e.message), isError: true);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /// 6. UPDATE PASSWORD
  Future<bool> updatePassword() async {
    final newPassword = newPasswordController.text;
    if (newPassword.length < 6) {
      _showSnackbar('خطأ', 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', isError: true);
      return false;
    }

    try {
      isLoading.value = true;
      await _client.auth.updateUser(UserAttributes(password: newPassword));
      _showSnackbar('تم بنجاح', 'تم تغيير كلمة المرور بنجاح');
      Get.offAllNamed(AppRoutes.home);
      return true;
    } on AuthException catch (e) {
      _showSnackbar('خطأ', _translateAuthError(e.message), isError: true);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /// 7. SIGN OUT & CLEANUP SESSION
  Future<void> signOut() async {
    try {
      isLoading.value = true;
      await _client.auth.signOut();
    } catch (e) {
      debugPrint('Sign out error: $e');
    } finally {
      isLoading.value = false;
    }
  }

  /// Quick Demo Account Login Helper (for testers/reviewers)
  void fillDemoAccount(String type) {
    if (type == 'buyer') {
      loginEmailController.text = 'buyer@cars.com';
      loginPasswordController.text = '123456';
    } else if (type == 'showroom') {
      loginEmailController.text = 'showroom@cars.com';
      loginPasswordController.text = '123456';
    } else if (type == 'admin') {
      loginEmailController.text = 'admin@cars.com';
      loginPasswordController.text = 'admin123';
    }
  }

  /// Translate Supabase Auth English Errors to Arabic
  String _translateAuthError(String msg) {
    final lower = msg.toLowerCase();
    if (lower.contains('invalid login credentials') || lower.contains('invalid_credentials')) {
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    }
    if (lower.contains('email already in use') || lower.contains('user already registered')) {
      return 'هذا البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول';
    }
    if (lower.contains('weak password') || lower.contains('at least 6 characters')) {
      return 'كلمة المرور ضعيفة جداً، يرجى استخدام 6 خانات أو أكثر';
    }
    if (lower.contains('email not confirmed')) {
      return 'يرجى تأكيد بريدك الإلكتروني عبر الرابط المرسل إليك';
    }
    if (lower.contains('rate limit')) {
      return 'تم تجاوز حد المحاولات المسموح، يرجى الانتظار دقيقة والمحاولة مجدداً';
    }
    return msg;
  }

  void _showSnackbar(String title, String message, {bool isError = false}) {
    Get.snackbar(
      title,
      message,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: isError ? Colors.red.shade900.withOpacity(0.9) : const Color(0xFF1E293B),
      colorText: Colors.white,
      margin: const EdgeInsets.all(12),
      borderRadius: 12,
      duration: const Duration(seconds: 3),
      icon: Icon(
        isError ? Icons.error_outline : Icons.check_circle_outline,
        color: isError ? Colors.redAccent : Colors.emerald,
      ),
    );
  }
}
