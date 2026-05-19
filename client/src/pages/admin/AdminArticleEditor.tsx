import { useEffect, useRef, useState } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getArticle,
  createArticle,
  updateArticle,
  uploadImage,
  type ArticleInput,
} from "@/lib/adminApi";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

const empty: ArticleInput = {
  title: "",
  slug: "",
  author: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  image: "",
  content: "",
  published: true,
};

export default function AdminArticleEditor() {
  const [match, params] = useRoute("/admin/articles/:id/edit");
  const id = match ? params?.id : undefined;
  const isEdit = Boolean(id);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ArticleInput>(empty);
  const [saving, setSaving] = useState(false);

  const { data: existing } = useQuery({
    queryKey: ["admin", "article", id],
    queryFn: () => getArticle(id as string),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        author: existing.author,
        date: existing.date,
        excerpt: existing.excerpt,
        image: existing.image,
        content: existing.content,
        published: existing.published,
      });
    }
  }, [existing]);

  const set = <K extends keyof ArticleInput>(k: K, v: ArticleInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const url = await uploadImage(file);
      set("image", url);
      toast({ title: "تم رفع الصورة" });
    } catch (err) {
      toast({
        title: "فشل رفع الصورة",
        description: err instanceof Error ? err.message : "خطأ",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: ArticleInput = {
        ...form,
        slug: form.slug?.trim() || undefined,
      };
      if (isEdit) {
        await updateArticle(id as string, payload);
      } else {
        await createArticle(payload);
      }
      await queryClient.invalidateQueries({ queryKey: ["admin", "articles"] });
      toast({ title: isEdit ? "تم حفظ التعديلات" : "تم إنشاء المقال" });
      navigate("/admin");
    } catch (err) {
      toast({
        title: "فشل الحفظ",
        description: err instanceof Error ? err.message : "تحقق من الحقول",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 p-6" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowRight className="h-4 w-4" /> رجوع
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? "تعديل مقال" : "مقال جديد"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">العنوان</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">الكاتب</Label>
              <Input
                id="author"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              المعرّف في الرابط (اختياري — يُولّد تلقائيًا)
            </Label>
            <Input
              id="slug"
              value={form.slug}
              dir="ltr"
              placeholder="my-article-slug"
              onChange={(e) => set("slug", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">المقتطف</Label>
            <Textarea
              id="excerpt"
              rows={3}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">صورة الغلاف</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                value={form.image}
                dir="ltr"
                placeholder="/uploads/... أو رابط"
                onChange={(e) => set("image", e.target.value)}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
              >
                رفع
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFile}
              />
            </div>
            {form.image && (
              <img
                src={form.image}
                alt=""
                className="mt-2 h-32 rounded object-cover bg-muted"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>المحتوى</Label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => set("content", html)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="published"
              checked={form.published}
              onCheckedChange={(v) => set("published", v)}
            />
            <Label htmlFor="published">منشور (يظهر للزوار)</Label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </Button>
            <Link href="/admin">
              <Button type="button" variant="outline">
                إلغاء
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
