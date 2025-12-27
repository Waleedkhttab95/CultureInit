# دليل تحسين محركات البحث (SEO Guide)

## ما تم إضافته

تم تحسين الموقع لمحركات البحث من خلال:

### 1. **Meta Tags الأساسية** (client/index.html)
- عنوان الصفحة (Title)
- الوصف (Description)
- الكلمات المفتاحية (Keywords)
- معلومات المؤلف (Author)
- تعليمات الروبوتات (Robots)

### 2. **Open Graph Tags**
لتحسين مظهر الموقع عند المشاركة على:
- Facebook
- LinkedIn
- WhatsApp

### 3. **Twitter Cards**
لتحسين مظهر الموقع عند المشاركة على Twitter/X

### 4. **JSON-LD Structured Data**
بيانات منظمة لمساعدة Google على فهم الموقع بشكل أفضل:
- معلومات المنظمة
- معلومات الاتصال
- الموقع الجغرافي
- روابط مواقع التواصل الاجتماعي

### 5. **robots.txt** (client/public/robots.txt)
ملف لتوجيه محركات البحث حول الصفحات المسموح والممنوع الوصول إليها

### 6. **sitemap.xml** (client/public/sitemap.xml)
خريطة الموقع التي تساعد محركات البحث على اكتشاف جميع الصفحات

### 7. **SEO Component** (client/src/components/SEO.tsx)
مكون React قابل لإعادة الاستخدام لتحديث Meta Tags ديناميكياً

## كيفية استخدام مكون SEO

يمكنك استخدام مكون SEO في أي صفحة لتخصيص المعلومات الخاصة بها:

```tsx
import SEO from "@/components/SEO";

export default function MyPage() {
  return (
    <div>
      <SEO
        title="عنوان الصفحة - مبادرة الإدارة الثقافية"
        description="وصف مختصر للصفحة"
        keywords="كلمات, مفتاحية, مخصصة"
        url="https://cultural-managment.com/my-page"
        image="https://cultural-managment.com/my-image.jpg"
      />
      {/* محتوى الصفحة */}
    </div>
  );
}
```

### مثال: صفحة مقالة

```tsx
<SEO
  title={article.title + " - مبادرة الإدارة الثقافية"}
  description={article.excerpt}
  keywords={article.tags.join(", ")}
  url={`https://cultural-managment.com/articles/${article.id}`}
  image={article.coverImage}
  type="article"
  author={article.author}
/>
```

## نصائح إضافية

### 1. تحديث sitemap.xml
عند إضافة صفحات جديدة، يجب تحديث ملف `client/public/sitemap.xml`

### 2. الكلمات المفتاحية
استخدم كلمات مفتاحية ذات صلة بالمحتوى:
- الإدارة الثقافية
- إدارة المشاريع الثقافية
- الابتكار الثقافي
- الاقتصاد الثقافي
- التسويق الثقافي
- وغيرها...

### 3. الأوصاف
- يجب أن يكون الوصف بين 150-160 حرف
- واضح وجذاب
- يحتوي على كلمات مفتاحية مهمة

### 4. العناوين
- يجب أن يكون العنوان أقل من 60 حرف
- فريد لكل صفحة
- يحتوي على الكلمات المفتاحية الأساسية

### 5. الصور
- استخدم صور بجودة عالية (1200x630 بكسل للـ Open Graph)
- تأكد من وجود نص بديل (alt text) للصور
- استخدم أسماء ملفات وصفية

## التحقق من التحسينات

### 1. Google Search Console
- أضف الموقع إلى Google Search Console
- قم برفع ملف sitemap.xml

### 2. اختبار Rich Results
استخدم أداة Google لاختبار البيانات المنظمة:
https://search.google.com/test/rich-results

### 3. Facebook Debugger
اختبر كيف يظهر الموقع على Facebook:
https://developers.facebook.com/tools/debug/

### 4. Twitter Card Validator
اختبر كيف يظهر الموقع على Twitter:
https://cards-dev.twitter.com/validator

## المراجع

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Open Graph Protocol](https://ogp.me/)
- [Schema.org](https://schema.org/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
