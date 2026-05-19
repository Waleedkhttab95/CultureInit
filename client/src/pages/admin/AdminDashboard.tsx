import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listArticles,
  deleteArticle,
  updateArticle,
  logout,
  type AdminArticle,
} from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ExternalLink, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: articles, isLoading } = useQuery<AdminArticle[]>({
    queryKey: ["admin", "articles"],
    queryFn: listArticles,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "articles"] });

  const deleteMut = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      toast({ title: "تم حذف المقال" });
      invalidate();
    },
    onError: (e: Error) =>
      toast({ title: "فشل الحذف", description: e.message, variant: "destructive" }),
  });

  const togglePublishMut = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      updateArticle(id, { published }),
    onSuccess: () => invalidate(),
    onError: (e: Error) =>
      toast({ title: "فشل التحديث", description: e.message, variant: "destructive" }),
  });

  const handleLogout = async () => {
    await logout();
    await queryClient.invalidateQueries({ queryKey: ["admin", "me"] });
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/20 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">إدارة المقالات</h1>
          <div className="flex gap-2">
            <Link href="/admin/articles/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> مقال جديد
              </Button>
            </Link>
            <Button variant="outline" className="gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> خروج
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">جارٍ التحميل...</p>
        ) : !articles?.length ? (
          <Card className="p-8 text-center text-muted-foreground">
            لا توجد مقالات بعد.
          </Card>
        ) : (
          <div className="space-y-3">
            {articles.map((a) => (
              <Card
                key={a.id}
                className="p-4 flex items-center gap-4 flex-wrap"
              >
                <img
                  src={a.image}
                  alt=""
                  className="w-20 h-14 object-cover rounded bg-muted shrink-0"
                />
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{a.title}</span>
                    {!a.published && <Badge variant="secondary">مسودة</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {a.author} · {a.date} · /{a.slug}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">منشور</span>
                  <Switch
                    checked={a.published}
                    onCheckedChange={(v) =>
                      togglePublishMut.mutate({ id: a.id, published: v })
                    }
                  />
                </div>
                <a
                  href={`/articles/${a.slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="ghost" size="icon" title="عرض">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
                <Link href={`/admin/articles/${a.id}/edit`}>
                  <Button variant="ghost" size="icon" title="تعديل">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="حذف">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف المقال؟</AlertDialogTitle>
                      <AlertDialogDescription>
                        سيتم حذف «{a.title}» نهائيًا. لا يمكن التراجع.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMut.mutate(a.id)}
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
