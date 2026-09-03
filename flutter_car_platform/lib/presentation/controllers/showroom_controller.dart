import 'package:get/get.dart';
import '../../core/services/supabase_service.dart';
import '../../data/models/showroom_model.dart';
import '../../data/models/car_model.dart';

class ShowroomController extends GetxController {
  final SupabaseService _supabase = SupabaseService.to;

  late final ShowroomModel showroom;
  final RxList<CarModel> allCars = <CarModel>[].obs;
  final RxBool isLoading = true.obs;
  final RxString searchQuery = ''.obs;

  // Filters
  final RxString selectedBrand = 'all'.obs;
  final RxDouble minPrice = 0.0.obs;
  final RxDouble maxPrice = 1000000.0.obs;
  final RxInt selectedYear = 0.obs; // 0 = all

  final RxList<String> availableBrands = <String>['all'].obs;

  @override
  void onInit() {
    super.onInit();
    if (Get.arguments is ShowroomModel) {
      showroom = Get.arguments as ShowroomModel;
      fetchShowroomCars();
    }
  }

  Future<void> fetchShowroomCars() async {
    try {
      isLoading.value = true;
      final data = await _supabase.client
          .from('cars')
          .select()
          .eq('showroom_id', showroom.id)
          .eq('status', 'active')
          .order('created_at', ascending: false);

      final cars = (data as List)
          .map((item) => CarModel.fromJson(item as Map<String, dynamic>))
          .toList();

      allCars.assignAll(cars);

      // Extract unique brands for filter chips
      final brands = {'all', ...cars.map((c) => c.brand)};
      availableBrands.assignAll(brands.toList());
    } catch (e) {
      Get.log('Error fetching showroom cars: $e');
    } finally {
      isLoading.value = false;
    }
  }

  List<CarModel> get filteredCars {
    return allCars.where((car) {
      // 1. Search Query
      if (searchQuery.isNotEmpty) {
        final q = searchQuery.value.toLowerCase();
        final match = car.brand.toLowerCase().contains(q) ||
            car.model.toLowerCase().contains(q) ||
            car.city.toLowerCase().contains(q);
        if (!match) return false;
      }

      // 2. Brand Filter
      if (selectedBrand.value != 'all' && car.brand != selectedBrand.value) {
        return false;
      }

      // 3. Price Filter
      if (car.price < minPrice.value || car.price > maxPrice.value) {
        return false;
      }

      // 4. Year Filter
      if (selectedYear.value > 0 && car.year != selectedYear.value) {
        return false;
      }

      return true;
    }).toList();
  }

  void resetFilters() {
    searchQuery.value = '';
    selectedBrand.value = 'all';
    minPrice.value = 0.0;
    maxPrice.value = 1000000.0;
    selectedYear.value = 0;
  }
}
