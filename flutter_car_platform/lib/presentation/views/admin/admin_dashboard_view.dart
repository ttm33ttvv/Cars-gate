import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../core/constants/app_colors.dart';
import '../../controllers/admin_controller.dart';
import '../../../data/models/car_model.dart';
import '../../../data/models/showroom_model.dart';
import '../../../data/models/user_model.dart';

class AdminDashboardView extends StatelessWidget {
  const AdminDashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(AdminController());

    return DefaultTabController(
      length: 4,
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: Text('admin_panel'.tr),
          bottom: TabBar(
            isScrollable: true,
            indicatorColor: AppColors.accent,
            labelColor: AppColors.accent,
            unselectedLabelColor: AppColors.textSecondary,
            tabs: [
              Tab(
                child: Row(
                  children: [
                    const Icon(Icons.pending_actions_rounded, size: 18),
                    const SizedBox(width: 6),
                    Text('pending_listings'.tr),
                    const SizedBox(width: 4),
                    Obx(() => controller.pendingCars.isNotEmpty
                        ? Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: const BoxDecoration(
                              color: AppColors.accent,
                              shape: BoxShape.circle,
                            ),
                            child: Text(
                              '${controller.pendingCars.length}',
                              style: const TextStyle(color: Colors.white, fontSize: 10),
                            ),
                          )
                        : const SizedBox.shrink()),
                  ],
                ),
              ),
              Tab(
                child: Row(
                  children: [
                    const Icon(Icons.storefront_rounded, size: 18),
                    const SizedBox(width: 6),
                    Text('showrooms'.tr),
                  ],
                ),
              ),
              const Tab(
                child: Row(
                  children: [
                    Icon(Icons.directions_car_rounded, size: 18),
                    SizedBox(width: 6),
                    Text('السيارات'),
                  ],
                ),
              ),
              const Tab(
                child: Row(
                  children: [
                    Icon(Icons.people_alt_rounded, size: 18),
                    SizedBox(width: 6),
                    Text('المستخدمين'),
                  ],
                ),
              ),
            ],
          ),
        ),
        body: Obx(() {
          if (controller.isLoading.value) {
            return const Center(child: CircularProgressIndicator());
          }

          return TabBarView(
            children: [
              // 1. Pending Cars Review Tab (Approve / Reject)
              _buildPendingListingsTab(controller),

              // 2. Showrooms Tab (Add / Delete)
              _buildShowroomsTab(context, controller),

              // 3. All Cars Tab
              _buildCarsTab(controller),

              // 4. Users Management Tab
              _buildUsersTab(context, controller),
            ],
          );
        }),
      ),
    );
  }

  // 1. Listings Review Tab
  Widget _buildPendingListingsTab(AdminController controller) {
    if (controller.pendingCars.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle_outline_rounded, size: 56, color: Colors.green.shade400),
            const SizedBox(height: 12),
            const Text(
              'رائع! لا توجد إعلانات معلقة في انتظار المراجعة',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 15),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: controller.pendingCars.length,
      itemBuilder: (context, index) {
        final car = controller.pendingCars[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.cardBorder),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${car.brand} ${car.model} (${car.year})',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.amber.shade100,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      'pending'.tr,
                      style: TextStyle(color: Colors.amber.shade900, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'السعر المطلوب: ${car.price.toStringAsFixed(0)} ${'currency'.tr} • المدينة: ${car.city}',
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
              ),
              if (car.phone != null)
                Text(
                  'هاتف المعلن: ${car.phone}',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                ),
              if (car.description != null) ...[
                const SizedBox(height: 6),
                Text(
                  car.description!,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                ),
              ],
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => controller.approveCar(car.id),
                      icon: const Icon(Icons.check_rounded, size: 16),
                      label: Text('approve'.tr),
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.success),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => controller.rejectCar(car.id),
                      icon: const Icon(Icons.close_rounded, size: 16, color: AppColors.danger),
                      label: Text('reject'.tr, style: const TextStyle(color: AppColors.danger)),
                      style: OutlinedButton.styleFrom(side: const BorderSide(color: AppColors.danger)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  // 2. Showrooms Management Tab
  Widget _buildShowroomsTab(BuildContext context, AdminController controller) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddShowroomDialog(context, controller),
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add_business_rounded, color: Colors.white),
        label: Text('add_showroom'.tr, style: const TextStyle(color: Colors.white)),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: controller.showrooms.length,
        itemBuilder: (context, index) {
          final showroom = controller.showrooms[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundColor: AppColors.primary,
                child: Icon(Icons.storefront, color: Colors.white),
              ),
              title: Text(showroom.name, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('${showroom.location} • ${showroom.phone ?? ""}'),
              trailing: IconButton(
                icon: const Icon(Icons.delete_outline_rounded, color: Colors.red),
                onPressed: () => controller.deleteShowroom(showroom.id),
              ),
            ),
          );
        },
      ),
    );
  }

  // 3. Cars Management Tab
  Widget _buildCarsTab(AdminController controller) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: controller.allCars.length,
      itemBuilder: (context, index) {
        final car = controller.allCars[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            title: Text('${car.brand} ${car.model} (${car.year})', style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('${car.price.toStringAsFixed(0)} ${'currency'.tr} • الحالة: ${car.status}'),
            trailing: IconButton(
              icon: const Icon(Icons.delete_outline, color: Colors.red),
              onPressed: () => controller.deleteCar(car.id),
            ),
          ),
        );
      },
    );
  }

  // 4. Users Management Tab
  Widget _buildUsersTab(BuildContext context, AdminController controller) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: controller.users.length,
      itemBuilder: (context, index) {
        final user = controller.users[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: user.isAdmin ? AppColors.accent : AppColors.primary,
              child: Icon(
                user.isAdmin ? Icons.shield_rounded : Icons.person,
                color: Colors.white,
              ),
            ),
            title: Text(user.name, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('${user.email}\nالصلاحية: ${user.role}'),
            isThreeLine: true,
            trailing: PopupMenuButton<String>(
              onSelected: (role) => controller.updateUserRole(user.id, role),
              itemBuilder: (_) => [
                const PopupMenuItem(value: 'user', child: Text('مستخدم عادي (User)')),
                const PopupMenuItem(value: 'showroom_owner', child: Text('صاحب معرض (Showroom Owner)')),
                const PopupMenuItem(value: 'admin', child: Text('مدير نظام (Admin)')),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showAddShowroomDialog(BuildContext context, AdminController controller) {
    final nameCtrl = TextEditingController();
    final locCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final descCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (_) {
        return AlertDialog(
          title: Text('add_showroom'.tr),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'اسم المعرض')),
                const SizedBox(height: 10),
                TextField(controller: locCtrl, decoration: const InputDecoration(labelText: 'الموقع والمدينة')),
                const SizedBox(height: 10),
                TextField(controller: phoneCtrl, decoration: const InputDecoration(labelText: 'رقم الهاتف / الاتصال')),
                const SizedBox(height: 10),
                TextField(controller: descCtrl, maxLines: 2, decoration: const InputDecoration(labelText: 'الوصف والنبذة')),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Get.back(), child: Text('cancel'.tr)),
            ElevatedButton(
              onPressed: () {
                if (nameCtrl.text.isNotEmpty && locCtrl.text.isNotEmpty) {
                  controller.addShowroom(
                    name: nameCtrl.text.trim(),
                    location: locCtrl.text.trim(),
                    phone: phoneCtrl.text.trim(),
                    description: descCtrl.text.trim(),
                  );
                }
              },
              child: Text('save'.tr),
            ),
          ],
        );
      },
    );
  }
}
