-- ==============================================================================
-- مشروع منصة معارض السيارات | CAR SHOWROOM PLATFORM
-- ملف مخطط قاعدة بيانات Supabase (PostgreSQL + RLS + Realtime + Storage)
-- ==============================================================================

-- 1. تفعيل الامتدادات المطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. إنشاء الجداول الأساسية
-- ==============================================================================

-- جدول المستخدمين (users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'showroom_owner', 'admin')),
    avatar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- جدول المعارض (showrooms)
CREATE TABLE IF NOT EXISTS public.showrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo TEXT,
    description TEXT,
    location TEXT NOT NULL,
    phone TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- جدول السيارات (cars)
CREATE TABLE IF NOT EXISTS public.cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    showroom_id UUID REFERENCES public.showrooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1970 AND year <= 2030),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    city TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    images TEXT[] NOT NULL DEFAULT '{}',
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'rejected', 'sold')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- جدول المحادثات (conversations)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant1 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    participant2 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    car_id UUID REFERENCES public.cars(id) ON DELETE SET NULL,
    last_message TEXT DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT distinct_participants CHECK (participant1 <> participant2)
);

-- جدول الرسائل (messages)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    car_id UUID REFERENCES public.cars(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. الفهارس لتسريع الاستعلامات (Indexes)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_cars_showroom ON public.cars(showroom_id);
CREATE INDEX IF NOT EXISTS idx_cars_user ON public.cars(user_id);
CREATE INDEX IF NOT EXISTS idx_cars_status ON public.cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_brand_model ON public.cars(brand, model);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations(participant1, participant2);

-- ==============================================================================
-- 4. إعداد Supabase Realtime للرسائل والمحادثات
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cars;

-- ==============================================================================
-- 5. تفعيل أمان مستوى الصفوف (Row Level Security - RLS)
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- دالة مساعدة للتحقق مما إذا كان المستخدم مديراً (Admin Helper)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- سياسات جدول المستخدمين (users policies)
-- ------------------------------------------------------------------------------
-- يمكن للجميع قراءة بيانات الملف الشخصي العامة
CREATE POLICY "Users are viewable by everyone" 
ON public.users FOR SELECT 
USING (true);

-- يمكن للمستخدم تعديل ملفه الشخصي فقط (أو المدير)
CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id OR public.is_admin());

-- يمكن إدراج مستخدم جديد عند التسجيل
CREATE POLICY "Users can insert their profile on signup" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- سياسات جدول المعارض (showrooms policies)
-- ------------------------------------------------------------------------------
-- يمكن للجميع استعراض المعارض
CREATE POLICY "Showrooms are viewable by everyone" 
ON public.showrooms FOR SELECT 
USING (true);

-- يمكن لصاحب المعرض أو المدير إضافة معرض
CREATE POLICY "Showroom owners or admins can insert showrooms" 
ON public.showrooms FOR INSERT 
WITH CHECK (
    auth.uid() = user_id OR public.is_admin()
);

-- يمكن لصاحب المعرض أو المدير تعديل المعرض
CREATE POLICY "Showroom owners or admins can update showrooms" 
ON public.showrooms FOR UPDATE 
USING (
    auth.uid() = user_id OR public.is_admin()
);

-- يمكن للمدير أو المالك حذف المعرض
CREATE POLICY "Showroom owners or admins can delete showrooms" 
ON public.showrooms FOR DELETE 
USING (
    auth.uid() = user_id OR public.is_admin()
);

-- ------------------------------------------------------------------------------
-- سياسات جدول السيارات (cars policies)
-- ------------------------------------------------------------------------------
-- يمكن للجميع قراءة السيارات المعتمدة (active)، بينما يرى المستخدم سياراته أو يرى المدير كل شيء
CREATE POLICY "Cars are viewable if active or owned or admin" 
ON public.cars FOR SELECT 
USING (
    status = 'active' 
    OR auth.uid() = user_id 
    OR public.is_admin()
);

-- يمكن للمستخدمين المسجلين إضافة سيارة (تكون pending افتراضياً)
CREATE POLICY "Authenticated users can insert cars" 
ON public.cars FOR INSERT 
WITH CHECK (
    auth.role() = 'authenticated'
);

-- يمكن للمستخدم تعديل سيارته، أو للمدير تعديل أي سيارة وتغيير الحالة (اعتماد/رفض)
CREATE POLICY "Users can update own cars or admin update all" 
ON public.cars FOR UPDATE 
USING (
    auth.uid() = user_id OR public.is_admin()
);

-- يمكن لمالك السيارة أو المدير حذفها
CREATE POLICY "Users can delete own cars or admin delete all" 
ON public.cars FOR DELETE 
USING (
    auth.uid() = user_id OR public.is_admin()
);

-- ------------------------------------------------------------------------------
-- سياسات جدول المحادثات (conversations policies)
-- ------------------------------------------------------------------------------
-- يرى المشاركون فقط محادثاتهم
CREATE POLICY "Participants can view their conversations" 
ON public.conversations FOR SELECT 
USING (
    auth.uid() = participant1 OR auth.uid() = participant2 OR public.is_admin()
);

-- إنشاء محادثة جديدة بين طرفين
CREATE POLICY "Users can create conversation if they are participant" 
ON public.conversations FOR INSERT 
WITH CHECK (
    auth.uid() = participant1 OR auth.uid() = participant2
);

-- تحديث المحادثة عند إرسال رسالة جديدة
CREATE POLICY "Participants can update conversation" 
ON public.conversations FOR UPDATE 
USING (
    auth.uid() = participant1 OR auth.uid() = participant2
);

-- ------------------------------------------------------------------------------
-- سياسات جدول الرسائل (messages policies)
-- ------------------------------------------------------------------------------
-- يرى المرسل أو المستقبل فقط الرسائل
CREATE POLICY "Users can view messages they sent or received" 
ON public.messages FOR SELECT 
USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id OR public.is_admin()
);

-- يمكن للمستخدم إرسال رسالة إذا كان هو المرسل
CREATE POLICY "Users can insert messages as sender" 
ON public.messages FOR INSERT 
WITH CHECK (
    auth.uid() = sender_id
);

-- ==============================================================================
-- 6. تهيئة حاويات التخزين (Supabase Storage Buckets)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('showroom-logos', 'showroom-logos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- سياسات الوصول لحاوية صور السيارات
CREATE POLICY "Car images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'car-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their car images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');

-- ==============================================================================
-- 7. بيانات تجريبية أولية (Seed Data)
-- ==============================================================================

-- إضافة مستخدمين تجريبيين
INSERT INTO auth.users (id, email) VALUES 
('11111111-1111-1111-1111-111111111111', 'admin@carplatform.com'),
('22222222-2222-2222-2222-222222222222', 'owner@alriyadhshowroom.com'),
('33333333-3333-3333-3333-333333333333', 'user@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, name, phone, role, avatar) VALUES 
('11111111-1111-1111-1111-111111111111', 'admin@carplatform.com', 'سلطان القحطاني (مدير النظام)', '+966500000001', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'),
('22222222-2222-2222-2222-222222222222', 'owner@alriyadhshowroom.com', 'معرض الرياض الفاخر', '+966555555555', 'showroom_owner', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'),
('33333333-3333-3333-3333-333333333333', 'user@example.com', 'محمد الشمري', '+966544444444', 'user', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200')
ON CONFLICT (id) DO NOTHING;

-- إضافة معارض سيارات تجريبية
INSERT INTO public.showrooms (id, name, logo, description, location, phone, user_id) VALUES 
('a1111111-0000-0000-0000-000000000001', 'معرض النخبة للسيارات الفاخرة', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=300', 'أفضل وجهة للسيارات الألمانية والفاخرة بأعلى معايير الفحص والضمان.', 'الرياض - طريق خريص', '+966501234567', '22222222-2222-2222-2222-222222222222'),
('a1111111-0000-0000-0000-000000000002', 'أوتو ستار العالمية', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300', 'وكلاء معتمدون لأفضل سيارات الدفع الرباعي والعائلية الجديدة والمستعملة.', 'جدة - شارع فلسطين', '+966509876543', '22222222-2222-2222-2222-222222222222'),
('a1111111-0000-0000-0000-000000000003', 'معرض الخليج المميز', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300', 'تشكيلة واسعة من سيارات تويوتا ونيسان وهيونداي مع إمكانية التقسيط الفوري.', 'الدمام - حي الشاطئ', '+966503332211', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- إضافة سيارات تجريبية معتمدة وقيد المراجعة
INSERT INTO public.cars (id, showroom_id, user_id, brand, model, year, price, city, phone, whatsapp, images, description, status) VALUES 
(
    'c1111111-0000-0000-0000-000000000001',
    'a1111111-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'مرسيدس بنز',
    'S-Class S500',
    2024,
    620000,
    'الرياض',
    '+966501234567',
    '+966501234567',
    ARRAY[
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
        'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800'
    ],
    'مرسيدس S500 فل كامل مواصفات خليجية، أصفار وكالة مع باقة الضمان والصيانة الشاملة 5 سنوات.',
    'active'
),
(
    'c1111111-0000-0000-0000-000000000002',
    'a1111111-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'بي إم دبليو',
    '7 Series 740i',
    2023,
    495000,
    'الرياض',
    '+966501234567',
    '+966501234567',
    ARRAY[
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800'
    ],
    'بي إم دبليو الفئة السابعة M-Sport كيت، شاشة المسرح الخلفية، رادار وقيادة ذاتية.',
    'active'
),
(
    'c1111111-0000-0000-0000-000000000003',
    'a1111111-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'تويوتا',
    'لاند كروزر VXR',
    2024,
    385000,
    'جدة',
    '+966509876543',
    '+966509876543',
    ARRAY[
        'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'
    ],
    'تويوتا لاند كروزر VXR توين تيربو، فتحة سقف، تبريد مقاعد ونظام ملاحة ثلاثي الأبعاد.',
    'active'
),
(
    'c1111111-0000-0000-0000-000000000004',
    'a1111111-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222222',
    'بورش',
    'باناميرا 4S',
    2023,
    510000,
    'الدمام',
    '+966503332211',
    '+966503332211',
    ARRAY[
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'
    ],
    'بورش باناميرا بحالة الوكالة، عداد 12,000 كم فقط، صيانة دورية لدى ساماكو.',
    'active'
),
(
    'c1111111-0000-0000-0000-000000000005',
    NULL,
    '33333333-3333-3333-3333-333333333333',
    'لكزس',
    'LX 600 VIP',
    2024,
    640000,
    'الرياض',
    '+966544444444',
    '+966544444444',
    ARRAY[
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
    ],
    'إعلان من المالك مباشرة: لكزس LX600 أعلى فئة VIP 4 مقاعد، حماية نانو سيراميك وتظليل عازل.',
    'pending'
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 9. جدول تفضيلات المستخدم للإشعارات (user_preferences) وجدول التنبيهات (notifications)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    preferred_brands TEXT[] DEFAULT '{}',
    max_price NUMERIC(12, 2),
    min_price NUMERIC(12, 2),
    preferred_cities TEXT[] DEFAULT '{}',
    notify_on_new_cars BOOLEAN DEFAULT true,
    notify_on_chat_messages BOOLEAN DEFAULT true,
    fcm_token TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'system',
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON public.user_preferences(user_id);

-- تفعيل Realtime على التنبيهات والتفضيلات
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_preferences;

-- تفعيل RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
    ON public.user_preferences FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view and update their own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- مزامنة حسابات Supabase Auth مع جدول users وتفضيلات التنبيهات
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'مستخدم جديد'),
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.users.name);

    INSERT INTO public.user_preferences (user_id, notify_on_new_cars, notify_on_chat_messages)
    VALUES (NEW.id, true, true)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- دالة إرسال إشعار فوري عند مطابقة سيارة جديدة مع تفضيلات المستخدم
CREATE OR REPLACE FUNCTION public.notify_matching_users_on_new_car()
RETURNS TRIGGER AS $$
DECLARE
    pref RECORD;
BEGIN
    IF NEW.status = 'active' AND (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status <> 'active')) THEN
        FOR pref IN
            SELECT user_id, preferred_brands, max_price, min_price, preferred_cities
            FROM public.user_preferences
            WHERE notify_on_new_cars = true
              AND user_id <> COALESCE(NEW.user_id, '00000000-0000-0000-0000-000000000000'::uuid)
        LOOP
            IF array_length(pref.preferred_brands, 1) IS NOT NULL AND NOT (NEW.brand = ANY(pref.preferred_brands)) THEN
                CONTINUE;
            END IF;

            IF pref.max_price IS NOT NULL AND NEW.price > pref.max_price THEN
                CONTINUE;
            END IF;

            IF array_length(pref.preferred_cities, 1) IS NOT NULL AND NOT (NEW.city = ANY(pref.preferred_cities)) THEN
                CONTINUE;
            END IF;

            INSERT INTO public.notifications (user_id, title, body, type, data)
            VALUES (
                pref.user_id,
                '🚗 سيارة مطابقة لتفضيلاتك!',
                'تمت إضافة ' || NEW.brand || ' ' || NEW.model || ' بسعر ' || NEW.price || ' ر.س في ' || NEW.city,
                'new_car_match',
                jsonb_build_object('car_id', NEW.id, 'brand', NEW.brand, 'price', NEW.price)
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_on_new_car ON public.cars;
CREATE TRIGGER trigger_notify_on_new_car
    AFTER INSERT OR UPDATE OF status ON public.cars
    FOR EACH ROW EXECUTE FUNCTION public.notify_matching_users_on_new_car();

-- ==============================================================================
-- 10. جدول تقييمات المعارض (Showroom Ratings & Reviews)
-- ==============================================================================
ALTER TABLE public.showrooms 
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3, 2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS ratings_count INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.showroom_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    showroom_id UUID NOT NULL REFERENCES public.showrooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_showroom_ratings_showroom ON public.showroom_ratings(showroom_id);
CREATE INDEX IF NOT EXISTS idx_showroom_ratings_user ON public.showroom_ratings(user_id);

-- تمكين RLS لجدول التقييمات
ALTER TABLE public.showroom_ratings ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول (RLS Policies)
CREATE POLICY "ratings_select_all" ON public.showroom_ratings
    FOR SELECT USING (true);

CREATE POLICY "ratings_insert_auth" ON public.showroom_ratings
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ratings_update_owner" ON public.showroom_ratings
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ratings_delete_owner" ON public.showroom_ratings
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- دالة إعادة حساب متوسط تقييم المعرض تلقائياً
CREATE OR REPLACE FUNCTION public.update_showroom_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_showroom_id UUID;
    new_avg NUMERIC(3, 2);
    new_count INTEGER;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_showroom_id := OLD.showroom_id;
    ELSE
        target_showroom_id := NEW.showroom_id;
    END IF;

    SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 5.00), COUNT(*)
    INTO new_avg, new_count
    FROM public.showroom_ratings
    WHERE showroom_id = target_showroom_id;

    UPDATE public.showrooms
    SET average_rating = new_avg,
        ratings_count = new_count
    WHERE id = target_showroom_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_showroom_rating_stats ON public.showroom_ratings;
CREATE TRIGGER trigger_update_showroom_rating_stats
    AFTER INSERT OR UPDATE OR DELETE ON public.showroom_ratings
    FOR EACH ROW EXECUTE FUNCTION public.update_showroom_rating_stats();


