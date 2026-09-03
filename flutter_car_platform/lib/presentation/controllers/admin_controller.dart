import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../core/services/supabase_service.dart';
import '../../data/models/car_model.dart';
import '../../data/models/showroom_model.dart';
import '../../data/models/user_model.dart';

class AdminController extends GetxController {
  final SupabaseService _supabase = SupabaseService.to;

  final RxList<CarModel> pendingCars = <CarModel>[].obs;
  final RxList<CarModel> allCars = <CarModel>[].obs;
  final RxList<ShowroomModel> showrooms = <ShowroomModel>[].obs;
  final RxList<UserModel> users = <UserModel>[].obs;

  final RxBool isLoading = false.obs;
  final RxInt activeTabIndex = 0.obs; // 0: Listings, 1: Showrooms, 2: Cars, 3: Users

  @override
  void onInit() {
    super.onInit();
    loadAllAdminData();
  }

  Future<void> loadAllAdminData() async {
    try {
      isLoading.value = true;
      await Future.wait([
        fetchCars(),
        fetchShowrooms(),
        fetchUsers(),
      ]);
    } catch (e) {
      Get.log('Admin data load error: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> fetchCars() async {
    final res = await _supabase.client
        .from('cars')
        .select()
        .order('created_at', ascending: false);

    final list = (res as List)
        .map((c) => CarModel.fromJson(c as Map<String, dynamic>))
        .toList();

    allCars.assignAll(list);
    pendingCars.assignAll(list.where((c) => c.status == 'pending').toList());
  }

  Future<void> fetchShowrooms() async {
    final res = await _supabase.client
        .from('showrooms')
        .select()
        .order('created_at', ascending: false);

    final list = (res as List)
        .map((s) => ShowroomModel.fromJson(s as Map<String, dynamic>))
        .toList();

    showrooms.assignAll(list);
  }

  Future<void> fetchUsers() async {
    final res = await _supabase.client
        .from('users')
        .select()
        .order('created_at', ascending: false);

    final list = (res as List)
        .map((u) => UserModel.fromJson(u as Map<String, dynamic>))
        .toList();

    users.assignAll(list);
  }

  // 1. Listings Review Actions (Approve / Reject)
  Future<void> approveCar(String carId) async {
    try {
      await _supabase.client
          .from('cars')
          .update({'status': 'active'}).eq('id', carId);

      Get.snackbar(
        'تم القبول',
        'تم اعتماد الإعلان بنجاح وأصبح متاحاً للجمهور',
        backgroundColor: const Color(0xFF10B981),
        colorText: Colors.white,
      );
      fetchCars();
    } catch (e) {
      Get.snackbar('خطأ', e.toString());
    }
  }

  Future<void> rejectCar(String carId) async {
    try {
      await _supabase.client
          .from('cars')
          .update({'status': 'rejected'}).eq('id', carId);

      Get.snackbar(
        'تم الرفض',
        'تم رفض الإعلان',
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      fetchCars();
    } catch (e) {
      Get.snackbar('خطأ', e.toString());
    }
  }

  // 2. Showrooms Management (Add / Delete)
  Future<void> addShowroom({
    required String name,
    required String location,
    required String phone,
    required String description,
  }) async {
    try {
      await _supabase.client.from('showrooms').insert({
        'name': name,
        'location': location,
        'phone': phone,
        'description': description,
        'created_at': DateTime.now().toIso8601String(),
      });
      Get.back();
      Get.snackbar(
        'تمت الإضافة',
        'تمت إضافة المعرض بنجاح',
        backgroundColor: const Color(0xFF10B981),
        colorText: Colors.white,
      );
      fetchShowrooms();
    } catch (e) {
      Get.snackbar('خطأ', e.toString());
    }
  }

  Future<void> deleteShowroom(String showroomId) async {
    try {
      await _supabase.client.from('showrooms').delete().eq('id', showroomId);
      Get.snackbar(
        'تم الحذف',
        'تم حذف المعرض بنجاح',
        backgroundColor: Colors.amber.shade900,
        colorText: Colors.white,
      );
      fetchShowrooms();
    } catch (e) {
      Get.snackbar('خطأ', e.toString());
    }
  }

  // 3. Cars Management (Delete / Status)
  Future<void> deleteCar(String carId) async {
    try {
      await _supabase.client.from('cars').delete().eq('id', carId);
      Get.snackbar('تم الحذف', 'تم حذف السيارة بنجاح');
      fetchCars();
    } catch (e) {
      Get.snackbar('خطأ', e.toString());
    }
  }

  // 4. Users Management (Role change)
  Future<void> updateUserRole(String userId, String newRole) async {
    try {
      await _supabase.client
          .from('users')
          .update({'role': newRole}).eq('id', userId);
      Get.snackbar('تم التحديث', 'تم تغيير صلاحية المستخدم بنجاح');
      fetchUsers();
    } catch (e) {
      Get.snackbar('خطأ', e.toString());
    }
  }
}
