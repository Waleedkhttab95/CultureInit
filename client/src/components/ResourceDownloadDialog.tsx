import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, User, Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCopy } from "@/i18n/locale";

const COPY = {
  ar: {
    download: "تحميل الدليل",
    dialogTitle: (name: string) => `تحميل ${name}`,
    dialogIntro: "يرجى تعبئة البيانات التالية لتحميل الدليل",
    downloading: "جاري تحميل الدليل...",
    thanks: "شكراً لك!",
    nameLabel: "الاسم الكامل",
    namePlaceholder: "أدخل اسمك الكامل",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    processing: "جاري المعالجة...",
    errorTitle: "خطأ",
    errorBody: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
  },
  en: {
    download: "Download the guide",
    dialogTitle: (name: string) => `Download ${name}`,
    dialogIntro: "Please fill in the details below to download the guide",
    downloading: "Your download is starting...",
    thanks: "Thank you!",
    nameLabel: "Full name",
    namePlaceholder: "Enter your full name",
    emailLabel: "Email address",
    emailPlaceholder: "Enter your email address",
    processing: "Processing...",
    errorTitle: "Error",
    errorBody: "Something went wrong while processing your request. Please try again.",
  },
};

export interface DownloadableResource {
  title: string;
  file: string;
}

/**
 * Name + email gate in front of a guide PDF. Shared by the Resources list and
 * each guide's own page so the lead-capture flow is identical everywhere.
 */
export default function ResourceDownloadDialog({
  resource,
  open,
  onOpenChange,
}: {
  resource: DownloadableResource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const c = useCopy(COPY);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/pdf/download-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setIsSubmitted(true);

      if (resource) {
        const link = document.createElement("a");
        link.href = resource.file;
        link.download = `${resource.title.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTimeout(() => {
        onOpenChange(false);
        setIsSubmitted(false);
        setFormData({ name: "", email: "" });
      }, 2000);
    } catch (error) {
      toast({
        title: c.errorTitle,
        description: c.errorBody,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {c.dialogTitle(resource?.title ?? '')}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {c.dialogIntro}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-chart-2/10 rounded-full mb-4 motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:fade-in motion-safe:duration-500">
              <Check className="h-10 w-10 text-chart-2" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {c.downloading}
            </h3>
            <p className="text-muted-foreground">
              {c.thanks}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                {c.nameLabel}
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={c.namePlaceholder}
                required
                className="h-12 text-base border-2 border-card-border focus:border-primary transition-colors rounded-xl"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                {c.emailLabel}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={c.emailPlaceholder}
                required
                className="h-12 text-base border-2 border-card-border focus:border-primary transition-colors rounded-xl"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl shadow-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {c.processing}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  {c.download}
                </div>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
