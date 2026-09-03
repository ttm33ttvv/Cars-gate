import 'package:get/get.dart';
import 'app_routes.dart';
import '../../presentation/views/splash/splash_view.dart';
import '../../presentation/views/auth/login_view.dart';
import '../../presentation/views/auth/signup_view.dart';
import '../../presentation/views/auth/forgot_password_view.dart';
import '../../presentation/views/home/home_view.dart';
import '../../presentation/views/showroom/showroom_details_view.dart';
import '../../presentation/views/car/car_details_view.dart';
import '../../presentation/views/car/add_car_view.dart';
import '../../presentation/views/chat/conversations_view.dart';
import '../../presentation/views/chat/chat_room_view.dart';
import '../../presentation/views/admin/admin_dashboard_view.dart';
import '../../presentation/views/profile/preferences_view.dart';

class AppPages {
  static const initial = AppRoutes.splash;

  static final routes = [
    GetPage(
      name: AppRoutes.splash,
      page: () => const SplashView(),
      transition: Transition.fadeIn,
    ),
    GetPage(
      name: AppRoutes.login,
      page: () => const LoginView(),
      transition: Transition.fadeIn,
    ),
    GetPage(
      name: AppRoutes.signup,
      page: () => const SignupView(),
      transition: Transition.rightToLeftWithFade,
    ),
    GetPage(
      name: AppRoutes.forgotPassword,
      page: () => const ForgotPasswordView(),
      transition: Transition.rightToLeftWithFade,
    ),
    GetPage(
      name: AppRoutes.home,
      page: () => const HomeView(),
      transition: Transition.fadeIn,
    ),
    GetPage(
      name: AppRoutes.showroomDetails,
      page: () => const ShowroomDetailsView(),
      transition: Transition.rightToLeftWithFade,
    ),
    GetPage(
      name: AppRoutes.carDetails,
      page: () => const CarDetailsView(),
      transition: Transition.rightToLeftWithFade,
    ),
    GetPage(
      name: AppRoutes.addCar,
      page: () => const AddCarView(),
      transition: Transition.downToUp,
    ),
    GetPage(
      name: AppRoutes.conversations,
      page: () => const ConversationsView(),
      transition: Transition.rightToLeftWithFade,
    ),
    GetPage(
      name: AppRoutes.chatRoom,
      page: () => const ChatRoomView(),
      transition: Transition.rightToLeftWithFade,
    ),
    GetPage(
      name: AppRoutes.adminDashboard,
      page: () => const AdminDashboardView(),
      transition: Transition.rightToLeftWithFade,
    ),
    GetPage(
      name: AppRoutes.preferences,
      page: () => const PreferencesView(),
      transition: Transition.rightToLeftWithFade,
    ),
  ];
}
