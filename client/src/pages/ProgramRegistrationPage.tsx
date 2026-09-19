import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useLocation } from "wouter";
import { useLocale, useT } from "@/i18n/locale";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  GraduationCap,
  Send,
  Check,
  Upload,
  Linkedin,
  CreditCard,
  Calendar,
} from "lucide-react";

const EN: Record<string, string> = {
  "تم إرسال طلبك بنجاح!": "Your application was submitted successfully!",
  "شكراً لك، سنراجع طلبك ونتواصل معك قريباً": "Thank you — we will review your application and contact you soon",
  "العودة لصفحة البرنامج": "Back to the program page",
  "نموذج التسجيل": "Registration form",
  "برنامج ممارس الإدارة الثقافية": "Cultural Management Practitioner Program",
  "يرجى تعبئة الحقول التالية:": "Please complete the following fields:",
  "القسم الأول: البيانات الأساسية": "Section 1: Basic information",
  "الاسم الرباعي": "Full name (four parts)",
  "رقم الهوية / الإقامة": "National ID / Iqama number",
  "الجنس": "Gender",
  "ذكر": "Male",
  "أنثى": "Female",
  "رقم الجوال": "Mobile number",
  "البريد الإلكتروني": "Email address",
  "المدينة": "City",
  "العمر": "Age",
  "الحساب المهني (LinkedIn إن وجد)": "Professional profile (LinkedIn, if available)",
  "القسم الثاني: الخلفية التعليمية والمهنية": "Section 2: Educational and professional background",
  "أعلى مؤهل علمي": "Highest academic qualification",
  "بكالوريوس": "Bachelor's degree",
  "ماجستير": "Master's degree",
  "دكتوراه": "Doctorate",
  "أخرى": "Other",
  "التخصص": "Major",
  "جهة الدراسة": "Institution of study",
  "جهة العمل": "Employer",
  "نوع جهة العمل": "Employer type",
  "حكومية": "Government",
  "خاصة": "Private",
  "غير ربحية": "Non-profit",
  "مستقل": "Freelancer",
  "عدد سنوات الخبرة": "Years of experience",
  "المسمى الوظيفي الحالي": "Current job title",
  "أرفق سيرتك الذاتية": "Attach your CV",
  "القسم الثالث: الخبرة في القطاع الثقافي": "Section 3: Experience in the cultural sector",
  "هل تعمل حاليًا في القطاع الثقافي؟": "Do you currently work in the cultural sector?",
  "نعم": "Yes",
  "لا": "No",
  "بشكل جزئي": "Partially",
  "صف خبرتك في المجال الثقافي (حد أقصى 300 كلمة)": "Describe your experience in the cultural field (maximum 300 words)",
  "القسم الرابع: الالتزام والاستعداد": "Section 4: Commitment and readiness",
  "هل يمكنك الالتزام بحضور اللقاءات كاملة؟": "Can you commit to attending all of the sessions?",
  "هل لديك القدرة على تصميم مشروع تخرج تطبيقي خلال مدة البرنامج؟": "Are you able to design an applied graduation project within the program's duration?",
  "هل حصلت على موافقة جهة عملك (إن لزم)؟": "Have you obtained your employer's approval (if required)?",
  "لا ينطبق": "Not applicable",
  "القسم الخامس: الأسئلة التقييمية": "Section 5: Assessment questions",
  "برأيك، ما أبرز فجوة في إدارة المشاريع الثقافية في المملكة اليوم؟": "In your view, what is the most significant gap in managing cultural projects in the Kingdom today?",
  "لو طُلب منك تطوير مبادرة ثقافية مستدامة، ما أول 3 عناصر ستبني عليها خطتك؟": "If you were asked to develop a sustainable cultural initiative, what are the first 3 elements you would build your plan on?",
  "صف تجربة فشل أو نجاح مهني مررت بها، وماذا تعلمت منها؟": "Describe a professional failure or success you experienced, and what you learned from it.",
  "جاري الإرسال...": "Sending...",
  "إرسال الطلب": "Submit request",
  "أدخل اسمك الرباعي": "Enter your full name (four parts)",
  "أدخل رقم الهوية أو الإقامة": "Enter your national ID or Iqama number",
  "أدخل بريدك الإلكتروني": "Enter your email address",
  "أدخل مدينتك": "Enter your city",
  "أدخل عمرك": "Enter your age",
  "اختر المؤهل العلمي": "Select your qualification",
  "أدخل تخصصك": "Enter your major",
  "أدخل جهة دراستك": "Enter your institution of study",
  "أدخل جهة عملك": "Enter your employer",
  "اختر نوع الجهة": "Select the employer type",
  "عدد السنوات": "Number of years",
  "أدخل مسماك الوظيفي": "Enter your job title",
  "صف خبرتك ومشاركاتك في القطاع الثقافي...": "Describe your experience and involvement in the cultural sector...",
  "اكتب إجابتك هنا...": "Write your answer here...",
  "المؤهل العلمي": "Academic qualification",
  "المسمى الوظيفي": "Job title",
  "هل تعمل في القطاع الثقافي": "Works in the cultural sector",
  "وصف الخبرة الثقافية": "Description of cultural experience",
  "الالتزام بحضور اللقاءات": "Commitment to attend the sessions",
  "القدرة على تصميم مشروع التخرج": "Ability to design the graduation project",
  "موافقة جهة العمل": "Employer approval",
  "سؤال فجوة إدارة المشاريع الثقافية": "Question: gap in cultural project management",
  "سؤال المبادرة الثقافية المستدامة": "Question: sustainable cultural initiative",
  "سؤال تجربة الفشل أو النجاح": "Question: experience of failure or success",
  "البريد الإلكتروني (صيغة غير صحيحة)": "Email address (invalid format)",
  "السيرة الذاتية": "CV",
  "حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.": "Something went wrong while sending your details. Please try again.",
  "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.": "A connection error occurred. Please try again.",
  "اضغط لرفع الملف (PDF, DOC)": "Click to upload your file (PDF, DOC)",
};

const inputClass =
  "h-12 text-base bg-card border-input text-foreground placeholder:text-muted-foreground focus:border-ring rounded-xl";
const labelClass =
  "text-sm font-semibold text-foreground flex items-center gap-2";
const textareaClass =
  "text-base bg-card border-input text-foreground placeholder:text-muted-foreground focus:border-ring rounded-xl resize-none";
const selectTriggerClass =
  "h-12 text-base bg-card border-input text-foreground placeholder:text-muted-foreground focus:border-ring rounded-xl [&>span]:text-foreground data-[placeholder]:text-muted-foreground";

export default function ProgramRegistrationPage() {
  const t = useT(EN);
  const { isEn, dir } = useLocale();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    gender: "",
    phone: "",
    email: "",
    city: "",
    age: "",
    linkedin: "",
    qualification: "",
    major: "",
    studyInstitution: "",
    organization: "",
    orgType: "",
    yearsOfExperience: "",
    jobTitle: "",
    worksInCulture: "",
    cultureExperience: "",
    canAttendAll: "",
    canDesignProject: "",
    hasEmployerApproval: "",
    gapQuestion: "",
    initiativeQuestion: "",
    experienceQuestion: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const FIELD_LABELS: Record<string, string> = {
    fullName: t("الاسم الرباعي"),
    idNumber: t("رقم الهوية / الإقامة"),
    gender: t("الجنس"),
    phone: t("رقم الجوال"),
    email: t("البريد الإلكتروني"),
    city: t("المدينة"),
    age: t("العمر"),
    qualification: t("المؤهل العلمي"),
    major: t("التخصص"),
    studyInstitution: t("جهة الدراسة"),
    organization: t("جهة العمل"),
    orgType: t("نوع جهة العمل"),
    yearsOfExperience: t("عدد سنوات الخبرة"),
    jobTitle: t("المسمى الوظيفي"),
    worksInCulture: t("هل تعمل في القطاع الثقافي"),
    cultureExperience: t("وصف الخبرة الثقافية"),
    canAttendAll: t("الالتزام بحضور اللقاءات"),
    canDesignProject: t("القدرة على تصميم مشروع التخرج"),
    hasEmployerApproval: t("موافقة جهة العمل"),
    gapQuestion: t("سؤال فجوة إدارة المشاريع الثقافية"),
    initiativeQuestion: t("سؤال المبادرة الثقافية المستدامة"),
    experienceQuestion: t("سؤال تجربة الفشل أو النجاح"),
  };

  const validateForm = (): string[] => {
    const missing: string[] = [];
    const minLengths: Record<string, number> = {
      fullName: 2, idNumber: 5, gender: 1, phone: 9, email: 1, city: 2, age: 1,
      qualification: 1, major: 2, studyInstitution: 2, organization: 2, orgType: 1,
      yearsOfExperience: 1, jobTitle: 2, worksInCulture: 1,
      cultureExperience: 10, canAttendAll: 1, canDesignProject: 1, hasEmployerApproval: 1,
      gapQuestion: 10, initiativeQuestion: 10, experienceQuestion: 10,
    };
    for (const [field, minLen] of Object.entries(minLengths)) {
      const value = formData[field as keyof typeof formData]?.trim() || "";
      if (value.length < minLen) {
        if (value.length === 0) {
          missing.push(FIELD_LABELS[field] || field);
        } else {
          missing.push(
            isEn
              ? `${FIELD_LABELS[field] || field} (must be at least ${minLen} characters)`
              : `${FIELD_LABELS[field] || field} (يجب ألا يقل عن ${minLen} أحرف)`,
          );
        }
      }
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email.trim())) {
      missing.push(t("البريد الإلكتروني (صيغة غير صحيحة)"));
    }
    // Resume is required
    if (!resumeFile) {
      missing.push(t("السيرة الذاتية"));
    }
    return missing;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const missing = validateForm();
    if (missing.length > 0) {
      setErrors(missing);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      if (resumeFile) {
        submitData.append("resume", resumeFile);
      }

      const response = await fetch("/api/program/register", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setErrors([t("حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.")]);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors([t("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.")]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background font-sans flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-chart-2/15 rounded-full mb-8">
              <Check className="h-12 w-12 text-chart-2" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("تم إرسال طلبك بنجاح!")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("شكراً لك، سنراجع طلبك ونتواصل معك قريباً")}
            </p>
            <Button
              onClick={() => navigate("/programs")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-8 h-12"
            >
              {t("العودة لصفحة البرنامج")}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <SEO page="programRegister" />
      <Header />
      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("نموذج التسجيل")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("برنامج ممارس الإدارة الثقافية")}
            </p>
          </div>

          {/* Error Display Banner */}
          {errors.length > 0 && (
            <div
              role="alert"
              aria-live="assertive"
              className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-2"
            >
              <h4 className="text-destructive font-bold text-lg mb-3">
                {t("يرجى تعبئة الحقول التالية:")}
              </h4>
              <ul className="space-y-1.5 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index} className="text-destructive/90 text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ===== القسم الأول: البيانات الأساسية ===== */}
            <div className="bg-muted/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border mb-8">
              <h3 className="text-xl font-bold text-primary mb-6 pb-3 border-b border-border">
                {t("القسم الأول: البيانات الأساسية")}
              </h3>
              <div className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className={labelClass}>
                    <User className="h-4 w-4 text-primary" />
                    {t("الاسم الرباعي")}
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={t("أدخل اسمك الرباعي")}
                    required
                    className={inputClass}
                    disabled={isSubmitting}
                  />
                </div>

                {/* ID Number */}
                <div className="space-y-2">
                  <Label htmlFor="idNumber" className={labelClass}>
                    <CreditCard className="h-4 w-4 text-primary" />
                    {t("رقم الهوية / الإقامة")}
                  </Label>
                  <Input
                    id="idNumber"
                    name="idNumber"
                    type="text"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder={t("أدخل رقم الهوية أو الإقامة")}
                    required
                    className={inputClass}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label className={labelClass} id="gender-label">
                    <User className="h-4 w-4 text-primary" />
                    {t("الجنس")}
                  </Label>
                  <RadioGroup
                    aria-labelledby="gender-label"
                    value={formData.gender}
                    onValueChange={(v) => handleSelectChange("gender", v)}
                    className="flex gap-6 pt-1"
                    dir={dir}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="male"
                        id="male"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="male"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("ذكر")}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="female"
                        id="female"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="female"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("أنثى")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Phone & Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className={labelClass}>
                      <Phone className="h-4 w-4 text-primary" />
                      {t("رقم الجوال")}
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="05xxxxxxxx"
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className={labelClass}>
                      <Mail className="h-4 w-4 text-primary" />
                      {t("البريد الإلكتروني")}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t("أدخل بريدك الإلكتروني")}
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* City & Age row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="city" className={labelClass}>
                      <MapPin className="h-4 w-4 text-primary" />
                      {t("المدينة")}
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder={t("أدخل مدينتك")}
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className={labelClass}>
                      <Calendar className="h-4 w-4 text-primary" />
                      {t("العمر")}
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder={t("أدخل عمرك")}
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className={labelClass}>
                    <Linkedin className="h-4 w-4 text-primary" />
                    {t("الحساب المهني (LinkedIn إن وجد)")}
                  </Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/..."
                    className={inputClass}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* ===== القسم الثاني: الخلفية التعليمية والمهنية ===== */}
            <div className="bg-muted/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border mb-8">
              <h3 className="text-xl font-bold text-primary mb-6 pb-3 border-b border-border">
                {t("القسم الثاني: الخلفية التعليمية والمهنية")}
              </h3>
              <div className="space-y-5">
                {/* Qualification */}
                <div className="space-y-2">
                  <Label className={labelClass}>
                    <GraduationCap className="h-4 w-4 text-primary" />
                    {t("أعلى مؤهل علمي")}
                  </Label>
                  <Select
                    value={formData.qualification}
                    onValueChange={(v) =>
                      handleSelectChange("qualification", v)
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder={t("اختر المؤهل العلمي")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bachelor">{t("بكالوريوس")}</SelectItem>
                      <SelectItem value="master">{t("ماجستير")}</SelectItem>
                      <SelectItem value="phd">{t("دكتوراه")}</SelectItem>
                      <SelectItem value="other">{t("أخرى")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Major & Study Institution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="major" className={labelClass}>
                      <GraduationCap className="h-4 w-4 text-primary" />
                      {t("التخصص")}
                    </Label>
                    <Input
                      id="major"
                      name="major"
                      type="text"
                      value={formData.major}
                      onChange={handleInputChange}
                      placeholder={t("أدخل تخصصك")}
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studyInstitution" className={labelClass}>
                      <Building2 className="h-4 w-4 text-primary" />
                      {t("جهة الدراسة")}
                    </Label>
                    <Input
                      id="studyInstitution"
                      name="studyInstitution"
                      type="text"
                      value={formData.studyInstitution}
                      onChange={handleInputChange}
                      placeholder={t("أدخل جهة دراستك")}
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Organization & Org Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="organization" className={labelClass}>
                      <Building2 className="h-4 w-4 text-primary" />
                      {t("جهة العمل")}
                    </Label>
                    <Input
                      id="organization"
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder={t("أدخل جهة عملك")}
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={labelClass}>
                      <Building2 className="h-4 w-4 text-primary" />
                      {t("نوع جهة العمل")}
                    </Label>
                    <Select
                      value={formData.orgType}
                      onValueChange={(v) => handleSelectChange("orgType", v)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder={t("اختر نوع الجهة")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="government">{t("حكومية")}</SelectItem>
                        <SelectItem value="private">{t("خاصة")}</SelectItem>
                        <SelectItem value="nonprofit">{t("غير ربحية")}</SelectItem>
                        <SelectItem value="freelance">{t("مستقل")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Years of Experience & Job Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience" className={labelClass}>
                      <Briefcase className="h-4 w-4 text-primary" />
                      {t("عدد سنوات الخبرة")}
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      placeholder={t("عدد السنوات")}
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className={labelClass}>
                      <Briefcase className="h-4 w-4 text-primary" />
                      {t("المسمى الوظيفي الحالي")}
                    </Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      type="text"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder={t("أدخل مسماك الوظيفي")}
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume" className={labelClass}>
                    <Upload className="h-4 w-4 text-primary" />
                    {t("أرفق سيرتك الذاتية")}{" "}<span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="resume"
                      className="flex items-center justify-center gap-2 h-12 w-full rounded-xl border border-dashed border-input bg-muted/40 text-muted-foreground cursor-pointer hover:border-primary/50 hover:bg-card transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      {resumeFile ? (
                        <span className="text-primary">
                          {resumeFile.name}
                        </span>
                      ) : (
                        t("اضغط لرفع الملف (PDF, DOC)")
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== القسم الثالث: الخبرة في القطاع الثقافي ===== */}
            <div className="bg-muted/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border mb-8">
              <h3 className="text-xl font-bold text-primary mb-6 pb-3 border-b border-border">
                {t("القسم الثالث: الخبرة في القطاع الثقافي")}
              </h3>
              <div className="space-y-5">
                {/* Works in culture */}
                <div className="space-y-2">
                  <Label className={labelClass} id="works-culture-label">
                    {t("هل تعمل حاليًا في القطاع الثقافي؟")}
                  </Label>
                  <RadioGroup
                    aria-labelledby="works-culture-label"
                    value={formData.worksInCulture}
                    onValueChange={(v) =>
                      handleSelectChange("worksInCulture", v)
                    }
                    className="flex flex-wrap gap-6 pt-1"
                    dir={dir}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="yes"
                        id="culture-yes"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="culture-yes"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("نعم")}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="no"
                        id="culture-no"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="culture-no"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("لا")}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="partial"
                        id="culture-partial"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="culture-partial"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("بشكل جزئي")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Culture experience */}
                <div className="space-y-2">
                  <Label htmlFor="cultureExperience" className={labelClass}>
                    {t("صف خبرتك في المجال الثقافي (حد أقصى 300 كلمة)")}
                  </Label>
                  <Textarea
                    id="cultureExperience"
                    name="cultureExperience"
                    value={formData.cultureExperience}
                    onChange={handleInputChange}
                    placeholder={t("صف خبرتك ومشاركاتك في القطاع الثقافي...")}
                    required
                    rows={5}
                    className={textareaClass}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* ===== القسم الرابع: الالتزام والاستعداد ===== */}
            <div className="bg-muted/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border mb-8">
              <h3 className="text-xl font-bold text-primary mb-6 pb-3 border-b border-border">
                {t("القسم الرابع: الالتزام والاستعداد")}
              </h3>
              <div className="space-y-5">
                {/* Can attend all */}
                <div className="space-y-2">
                  <Label className={labelClass} id="commit-attend-label">
                    {t("هل يمكنك الالتزام بحضور اللقاءات كاملة؟")}
                  </Label>
                  <RadioGroup
                    aria-labelledby="commit-attend-label"
                    value={formData.canAttendAll}
                    onValueChange={(v) =>
                      handleSelectChange("canAttendAll", v)
                    }
                    className="flex gap-6 pt-1"
                    dir={dir}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="yes"
                        id="attend-yes"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="attend-yes"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("نعم")}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="no"
                        id="attend-no"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="attend-no"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("لا")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Can design project */}
                <div className="space-y-2">
                  <Label className={labelClass} id="graduation-project-label">
                    {t("هل لديك القدرة على تصميم مشروع تخرج تطبيقي خلال مدة البرنامج؟")}
                  </Label>
                  <RadioGroup
                    aria-labelledby="graduation-project-label"
                    value={formData.canDesignProject}
                    onValueChange={(v) =>
                      handleSelectChange("canDesignProject", v)
                    }
                    className="flex gap-6 pt-1"
                    dir={dir}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="yes"
                        id="project-yes"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="project-yes"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("نعم")}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="no"
                        id="project-no"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="project-no"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("لا")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Employer approval */}
                <div className="space-y-2">
                  <Label className={labelClass} id="employer-approval-label">
                    {t("هل حصلت على موافقة جهة عملك (إن لزم)؟")}
                  </Label>
                  <RadioGroup
                    aria-labelledby="employer-approval-label"
                    value={formData.hasEmployerApproval}
                    onValueChange={(v) =>
                      handleSelectChange("hasEmployerApproval", v)
                    }
                    className="flex flex-wrap gap-6 pt-1"
                    dir={dir}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="yes"
                        id="approval-yes"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="approval-yes"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("نعم")}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="no"
                        id="approval-no"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="approval-no"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("لا")}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="na"
                        id="approval-na"
                        className="border-input text-primary"
                      />
                      <Label
                        htmlFor="approval-na"
                        className="text-muted-foreground cursor-pointer"
                      >
                        {t("لا ينطبق")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* ===== القسم الخامس: الأسئلة التقييمية ===== */}
            <div className="bg-muted/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border mb-8">
              <h3 className="text-xl font-bold text-primary mb-6 pb-3 border-b border-border">
                {t("القسم الخامس: الأسئلة التقييمية")}
              </h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="gapQuestion" className={labelClass}>
                    {t("برأيك، ما أبرز فجوة في إدارة المشاريع الثقافية في المملكة اليوم؟")}
                  </Label>
                  <Textarea
                    id="gapQuestion"
                    name="gapQuestion"
                    value={formData.gapQuestion}
                    onChange={handleInputChange}
                    placeholder={t("اكتب إجابتك هنا...")}
                    required
                    rows={4}
                    className={textareaClass}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initiativeQuestion" className={labelClass}>
                    {t("لو طُلب منك تطوير مبادرة ثقافية مستدامة، ما أول 3 عناصر ستبني عليها خطتك؟")}
                  </Label>
                  <Textarea
                    id="initiativeQuestion"
                    name="initiativeQuestion"
                    value={formData.initiativeQuestion}
                    onChange={handleInputChange}
                    placeholder={t("اكتب إجابتك هنا...")}
                    required
                    rows={4}
                    className={textareaClass}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceQuestion" className={labelClass}>
                    {t("صف تجربة فشل أو نجاح مهني مررت بها، وماذا تعلمت منها؟")}
                  </Label>
                  <Textarea
                    id="experienceQuestion"
                    name="experienceQuestion"
                    value={formData.experienceQuestion}
                    onChange={handleInputChange}
                    placeholder={t("اكتب إجابتك هنا...")}
                    required
                    rows={4}
                    className={textareaClass}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {t("جاري الإرسال...")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  {t("إرسال الطلب")}
                </div>
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
