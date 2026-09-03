import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/services/notification_service.dart';
import '../../controllers/auth_controller.dart';
import '../../../data/models/user_preference_model.dart';

class PreferencesView extends StatefulWidget {
  const PreferencesView({super.key});

  @override
  State<PreferencesView> createState() => _PreferencesViewState();
}

class _PreferencesViewState extends State<PreferencesView> {
  final NotificationService _notificationService = NotificationService.to;
  final AuthController _authController = AuthController.to;

  late bool _notifyOnNewCars;
  late bool _notifyOnChatMessages;
  final List<String> _selectedBrands = [];
  final TextEditingController _maxPriceController = TextEditingController();
  String _selectedCity = 'الرياض';
  bool _isSaving = false;

  final List<String> _availableBrands = [
    'مرسيدس بنز',
    'بي إم دبليو',
    'تويوتا',
    'بورش',
    'لكزس',
    'أودي',
    'لاند روفر',
    'هيونداي',
  ];

  final List<String> _availableCities = [
    'الكل',
    'الرياض',
    'جدة',
    'الدمام',
    'مكة المكرمة',
    'المدينة المنورة',
    'الخبر',
  ];

  @override
  void initState() {
    super.initState();
    final current = _notificationService.userPreferences.value;
    _notifyOnNewCars = current?.notifyOnNewCars ?? true;
    _notifyOnChatMessages = current?.notifyOnChatMessages ?? true;
    if (current != null) {
      _selectedBrands.addAll(current.preferredBrands);
      if (current.maxPrice != null) {
        _maxPriceController.text = current.maxPrice!.toStringAsFixed(0);
      }
      if (current.preferredCities.isNotEmpty) {
        _selectedCity = current.preferredCities.first;
      }
    }
  }

  @override
  void dispose() {
    _maxPriceController.dispose();
    super.dispose();
  }

  Future<void> _savePreferences() async {
    final user = _authController.currentUser.value;
    if (user == null) {
      Get.snackbar('تنبيه', 'يرجى تسجيل الدخول لحفظ التفضيلات', colorText: Colors.white);
      return;
    }

    setState(() => _isSaving = true);

    final double? maxPrice = double.tryParse(_maxPriceController.text.trim());
    final newPrefs = UserPreferenceModel(
      userId: user.id,
      notifyOnNewCars: _notifyOnNewCars,
      notifyOnChatMessages: _notifyOnChatMessages,
      preferredBrands: _selectedBrands,
      maxPrice: maxPrice,
      preferredCities: _selectedCity == 'الكل' ? [] : [_selectedCity],
    );

    final success = await _notificationService.saveUserPreferences(newPrefs);
    setState(() => _isSaving = false);

    if (success) {
      Get.snackbar(
        'تم الحفظ',
        'تم حفظ تفضيلات التنبيهات بنجاح، ستصلك إشعارات Supabase Realtime عند توفر سيارات مطابقة',
        backgroundColor: Colors.emerald.shade900,
        colorText: Colors.white,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0B0E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF11141B),
        elevation: 0,
        title: const Text(
          'تفضيلات الإشعارات والتنبيهات',
          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Get.back(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Push Notification Main Toggles Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF16191E),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.06)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.notifications_active_outlined, color: AppColors.primary, size: 20),
                      const SizedBox(width: 8),
                      const Text(
                        'إعدادات الإشعارات الفورية',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  SwitchListTile.adaptive(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('إشعارات الرسائل الجديدة', style: TextStyle(color: Colors.white, fontSize: 13)),
                    subtitle: Text('تنبيه فوري عند وصول رسالة جديدة من المعارض أو المشترين', style: TextStyle(color: Colors.grey.shade400, fontSize: 11)),
                    value: _notifyOnChatMessages,
                    activeColor: AppColors.primary,
                    onChanged: (val) => setState(() => _notifyOnChatMessages = val),
                  ),
                  const Divider(color: Colors.white10),
                  SwitchListTile.adaptive(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('تنبيهات السيارات المطابقة', style: TextStyle(color: Colors.white, fontSize: 13)),
                    subtitle: Text('إشعار فور إضافة سيارة جديدة تطابق تفضيلاتك في الماركة والسعر', style: TextStyle(color: Colors.grey.shade400, fontSize: 11)),
                    value: _notifyOnNewCars,
                    activeColor: AppColors.primary,
                    onChanged: (val) => setState(() => _notifyOnNewCars = val),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Car Matching Preferences
            if (_notifyOnNewCars) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF16191E),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.06)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.tune, color: AppColors.primary, size: 20),
                        const SizedBox(width: 8),
                        const Text(
                          'معايير تنبيهات السيارات المرغوبة',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    // Preferred Brands
                    const Text('الماركات المفضلة (اختر ماركة أو أكثر):', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _availableBrands.map((brand) {
                        final isSelected = _selectedBrands.contains(brand);
                        return FilterChip(
                          label: Text(brand),
                          selected: isSelected,
                          selectedColor: AppColors.primary,
                          backgroundColor: const Color(0xFF11141B),
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : Colors.grey.shade300,
                            fontSize: 11,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                          checkmarkColor: Colors.white,
                          side: BorderSide(color: isSelected ? AppColors.primary : Colors.white10),
                          onSelected: (selected) {
                            setState(() {
                              if (selected) {
                                _selectedBrands.add(brand);
                              } else {
                                _selectedBrands.remove(brand);
                              }
                            });
                          },
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),

                    // Max Price
                    const Text('الحد الأقصى للسعر (ر.س):', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _maxPriceController,
                      keyboardType: TextInputType.number,
                      style: const TextStyle(color: Colors.white, fontSize: 13),
                      decoration: InputDecoration(
                        hintText: 'مثال: 250000',
                        hintStyle: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                        suffixText: 'ر.س',
                        suffixStyle: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold),
                        filled: true,
                        fillColor: const Color(0xFF11141B),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Preferred City
                    const Text('المدينة المفضلة:', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF11141B),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _selectedCity,
                          isExpanded: true,
                          dropdownColor: const Color(0xFF16191E),
                          style: const TextStyle(color: Colors.white, fontSize: 13),
                          icon: const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
                          items: _availableCities.map((c) {
                            return DropdownMenuItem(value: c, child: Text(c));
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) setState(() => _selectedCity = val);
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Save Button
            SizedBox(
              height: 48,
              child: ElevatedButton.icon(
                onPressed: _isSaving ? null : _savePreferences,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: _isSaving
                    ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Icon(Icons.check_circle_outline, size: 20),
                label: const Text('حفظ تفضيلات الإشعارات', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
