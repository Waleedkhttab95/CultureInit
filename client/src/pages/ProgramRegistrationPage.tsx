import Header from "@/components/Header";
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

const inputClass =
  "h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#d4a574] rounded-xl";
const labelClass =
  "text-sm font-semibold text-white/90 flex items-center gap-2";
const textareaClass =
  "text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#d4a574] rounded-xl resize-none";
const selectTriggerClass =
  "h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#d4a574] rounded-xl [&>span]:text-white data-[placeholder]:text-white/40";

export default function ProgramRegistrationPage() {
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
    fullName: "الاسم الرباعي",
    idNumber: "رقم الهوية / الإقامة",
    gender: "الجنس",
    phone: "رقم الجوال",
    email: "البريد الإلكتروني",
    city: "المدينة",
    age: "العمر",
    qualification: "المؤهل العلمي",
    major: "التخصص",
    studyInstitution: "جهة الدراسة",
    organization: "جهة العمل",
    orgType: "نوع جهة العمل",
    yearsOfExperience: "عدد سنوات الخبرة",
    jobTitle: "المسمى الوظيفي",
    worksInCulture: "هل تعمل في القطاع الثقافي",
    cultureExperience: "وصف الخبرة الثقافية",
    canAttendAll: "الالتزام بحضور اللقاءات",
    canDesignProject: "القدرة على تصميم مشروع التخرج",
    hasEmployerApproval: "موافقة جهة العمل",
    gapQuestion: "سؤال فجوة إدارة المشاريع الثقافية",
    initiativeQuestion: "سؤال المبادرة الثقافية المستدامة",
    experienceQuestion: "سؤال تجربة الفشل أو النجاح",
  };

  const validateForm = (): string[] => {
    const missing: string[] = [];
    const required = [
      "fullName", "idNumber", "gender", "phone", "email", "city", "age",
      "qualification", "major", "studyInstitution", "organization", "orgType",
      "yearsOfExperience", "jobTitle", "worksInCulture", "cultureExperience",
      "canAttendAll", "canDesignProject", "hasEmployerApproval",
      "gapQuestion", "initiativeQuestion", "experienceQuestion",
    ];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]?.trim()) {
        missing.push(FIELD_LABELS[field] || field);
      }
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
        setErrors(["حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى."]);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors(["حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0f172a] font-sans flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-8 animate-bounce">
              <Check className="h-12 w-12 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              تم إرسال طلبك بنجاح!
            </h2>
            <p className="text-white/70 text-lg mb-8">
              شكراً لك، سنراجع طلبك ونتواصل معك قريباً
            </p>
            <Button
              onClick={() => (window.location.href = "/programs")}
              className="bg-[#d4a574] hover:bg-[#c49564] text-[#0f172a] font-semibold rounded-xl px-8 h-12"
            >
              العودة لصفحة البرنامج
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans flex flex-col">
      <Header />
      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              نموذج التسجيل
            </h1>
            <p className="text-white/70 text-lg">
              برنامج ممارس الإدارة الثقافية
            </p>
          </div>

          {/* Error Display Banner */}
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-2">
              <h4 className="text-red-400 font-bold text-lg mb-3">
                يرجى تعبئة الحقول التالية:
              </h4>
              <ul className="space-y-1.5 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-300/90 text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ===== القسم الأول: البيانات الأساسية ===== */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 mb-8">
              <h3 className="text-xl font-bold text-[#d4a574] mb-6 pb-3 border-b border-white/10">
                القسم الأول: البيانات الأساسية
              </h3>
              <div className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className={labelClass}>
                    <User className="h-4 w-4 text-[#d4a574]" />
                    الاسم الرباعي
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الرباعي"
                    required
                    className={inputClass}
                    disabled={isSubmitting}
                  />
                </div>

                {/* ID Number */}
                <div className="space-y-2">
                  <Label htmlFor="idNumber" className={labelClass}>
                    <CreditCard className="h-4 w-4 text-[#d4a574]" />
                    رقم الهوية / الإقامة
                  </Label>
                  <Input
                    id="idNumber"
                    name="idNumber"
                    type="text"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم الهوية أو الإقامة"
                    required
                    className={inputClass}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label className={labelClass}>
                    <User className="h-4 w-4 text-[#d4a574]" />
                    الجنس
                  </Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(v) => handleSelectChange("gender", v)}
                    className="flex gap-6 pt-1"
                    dir="rtl"
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="male"
                        id="male"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="male"
                        className="text-white/80 cursor-pointer"
                      >
                        ذكر
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="female"
                        id="female"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="female"
                        className="text-white/80 cursor-pointer"
                      >
                        أنثى
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Phone & Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className={labelClass}>
                      <Phone className="h-4 w-4 text-[#d4a574]" />
                      رقم الجوال
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
                      <Mail className="h-4 w-4 text-[#d4a574]" />
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="أدخل بريدك الإلكتروني"
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
                      <MapPin className="h-4 w-4 text-[#d4a574]" />
                      المدينة
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="أدخل مدينتك"
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className={labelClass}>
                      <Calendar className="h-4 w-4 text-[#d4a574]" />
                      العمر
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="أدخل عمرك"
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className={labelClass}>
                    <Linkedin className="h-4 w-4 text-[#d4a574]" />
                    الحساب المهني (LinkedIn إن وجد)
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
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 mb-8">
              <h3 className="text-xl font-bold text-[#d4a574] mb-6 pb-3 border-b border-white/10">
                القسم الثاني: الخلفية التعليمية والمهنية
              </h3>
              <div className="space-y-5">
                {/* Qualification */}
                <div className="space-y-2">
                  <Label className={labelClass}>
                    <GraduationCap className="h-4 w-4 text-[#d4a574]" />
                    أعلى مؤهل علمي
                  </Label>
                  <Select
                    value={formData.qualification}
                    onValueChange={(v) =>
                      handleSelectChange("qualification", v)
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="اختر المؤهل العلمي" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highschool">ثانوية عامة</SelectItem>
                      <SelectItem value="diploma">دبلوم</SelectItem>
                      <SelectItem value="bachelor">بكالوريوس</SelectItem>
                      <SelectItem value="master">ماجستير</SelectItem>
                      <SelectItem value="phd">دكتوراه</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Major & Study Institution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="major" className={labelClass}>
                      <GraduationCap className="h-4 w-4 text-[#d4a574]" />
                      التخصص
                    </Label>
                    <Input
                      id="major"
                      name="major"
                      type="text"
                      value={formData.major}
                      onChange={handleInputChange}
                      placeholder="أدخل تخصصك"
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studyInstitution" className={labelClass}>
                      <Building2 className="h-4 w-4 text-[#d4a574]" />
                      جهة الدراسة
                    </Label>
                    <Input
                      id="studyInstitution"
                      name="studyInstitution"
                      type="text"
                      value={formData.studyInstitution}
                      onChange={handleInputChange}
                      placeholder="أدخل جهة دراستك"
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
                      <Building2 className="h-4 w-4 text-[#d4a574]" />
                      جهة العمل
                    </Label>
                    <Input
                      id="organization"
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="أدخل جهة عملك"
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={labelClass}>
                      <Building2 className="h-4 w-4 text-[#d4a574]" />
                      نوع جهة العمل
                    </Label>
                    <Select
                      value={formData.orgType}
                      onValueChange={(v) => handleSelectChange("orgType", v)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="اختر نوع الجهة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="government">حكومية</SelectItem>
                        <SelectItem value="private">خاصة</SelectItem>
                        <SelectItem value="nonprofit">غير ربحية</SelectItem>
                        <SelectItem value="freelance">مستقل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Years of Experience & Job Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience" className={labelClass}>
                      <Briefcase className="h-4 w-4 text-[#d4a574]" />
                      عدد سنوات الخبرة
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      placeholder="عدد السنوات"
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className={labelClass}>
                      <Briefcase className="h-4 w-4 text-[#d4a574]" />
                      المسمى الوظيفي الحالي
                    </Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      type="text"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="أدخل مسماك الوظيفي"
                      required
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume" className={labelClass}>
                    <Upload className="h-4 w-4 text-[#d4a574]" />
                    أرفق سيرتك الذاتية
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
                      className="flex items-center justify-center gap-2 h-12 w-full rounded-xl border border-dashed border-white/30 bg-white/5 text-white/60 cursor-pointer hover:border-[#d4a574]/50 hover:bg-white/10 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      {resumeFile ? (
                        <span className="text-[#d4a574]">
                          {resumeFile.name}
                        </span>
                      ) : (
                        "اضغط لرفع الملف (PDF, DOC)"
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== القسم الثالث: الخبرة في القطاع الثقافي ===== */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 mb-8">
              <h3 className="text-xl font-bold text-[#d4a574] mb-6 pb-3 border-b border-white/10">
                القسم الثالث: الخبرة في القطاع الثقافي
              </h3>
              <div className="space-y-5">
                {/* Works in culture */}
                <div className="space-y-2">
                  <Label className={labelClass}>
                    هل تعمل حاليًا في القطاع الثقافي؟
                  </Label>
                  <RadioGroup
                    value={formData.worksInCulture}
                    onValueChange={(v) =>
                      handleSelectChange("worksInCulture", v)
                    }
                    className="flex flex-wrap gap-6 pt-1"
                    dir="rtl"
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="yes"
                        id="culture-yes"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="culture-yes"
                        className="text-white/80 cursor-pointer"
                      >
                        نعم
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="no"
                        id="culture-no"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="culture-no"
                        className="text-white/80 cursor-pointer"
                      >
                        لا
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="partial"
                        id="culture-partial"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="culture-partial"
                        className="text-white/80 cursor-pointer"
                      >
                        بشكل جزئي
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Culture experience */}
                <div className="space-y-2">
                  <Label htmlFor="cultureExperience" className={labelClass}>
                    صف خبرتك في المجال الثقافي (حد أقصى 300 كلمة)
                  </Label>
                  <Textarea
                    id="cultureExperience"
                    name="cultureExperience"
                    value={formData.cultureExperience}
                    onChange={handleInputChange}
                    placeholder="صف خبرتك ومشاركاتك في القطاع الثقافي..."
                    required
                    rows={5}
                    className={textareaClass}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* ===== القسم الرابع: الالتزام والاستعداد ===== */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 mb-8">
              <h3 className="text-xl font-bold text-[#d4a574] mb-6 pb-3 border-b border-white/10">
                القسم الرابع: الالتزام والاستعداد
              </h3>
              <div className="space-y-5">
                {/* Can attend all */}
                <div className="space-y-2">
                  <Label className={labelClass}>
                    هل يمكنك الالتزام بحضور اللقاءات كاملة؟
                  </Label>
                  <RadioGroup
                    value={formData.canAttendAll}
                    onValueChange={(v) =>
                      handleSelectChange("canAttendAll", v)
                    }
                    className="flex gap-6 pt-1"
                    dir="rtl"
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="yes"
                        id="attend-yes"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="attend-yes"
                        className="text-white/80 cursor-pointer"
                      >
                        نعم
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="no"
                        id="attend-no"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="attend-no"
                        className="text-white/80 cursor-pointer"
                      >
                        لا
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Can design project */}
                <div className="space-y-2">
                  <Label className={labelClass}>
                    هل لديك القدرة على تصميم مشروع تخرج تطبيقي خلال مدة
                    البرنامج؟
                  </Label>
                  <RadioGroup
                    value={formData.canDesignProject}
                    onValueChange={(v) =>
                      handleSelectChange("canDesignProject", v)
                    }
                    className="flex gap-6 pt-1"
                    dir="rtl"
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="yes"
                        id="project-yes"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="project-yes"
                        className="text-white/80 cursor-pointer"
                      >
                        نعم
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="no"
                        id="project-no"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="project-no"
                        className="text-white/80 cursor-pointer"
                      >
                        لا
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Employer approval */}
                <div className="space-y-2">
                  <Label className={labelClass}>
                    هل حصلت على موافقة جهة عملك (إن لزم)؟
                  </Label>
                  <RadioGroup
                    value={formData.hasEmployerApproval}
                    onValueChange={(v) =>
                      handleSelectChange("hasEmployerApproval", v)
                    }
                    className="flex flex-wrap gap-6 pt-1"
                    dir="rtl"
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="yes"
                        id="approval-yes"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="approval-yes"
                        className="text-white/80 cursor-pointer"
                      >
                        نعم
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="no"
                        id="approval-no"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="approval-no"
                        className="text-white/80 cursor-pointer"
                      >
                        لا
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="na"
                        id="approval-na"
                        className="border-white/40 text-[#d4a574]"
                      />
                      <Label
                        htmlFor="approval-na"
                        className="text-white/80 cursor-pointer"
                      >
                        لا ينطبق
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* ===== القسم الخامس: الأسئلة التقييمية ===== */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 mb-8">
              <h3 className="text-xl font-bold text-[#d4a574] mb-6 pb-3 border-b border-white/10">
                القسم الخامس: الأسئلة التقييمية
              </h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="gapQuestion" className={labelClass}>
                    برأيك، ما أبرز فجوة في إدارة المشاريع الثقافية في المملكة
                    اليوم؟
                  </Label>
                  <Textarea
                    id="gapQuestion"
                    name="gapQuestion"
                    value={formData.gapQuestion}
                    onChange={handleInputChange}
                    placeholder="اكتب إجابتك هنا..."
                    required
                    rows={4}
                    className={textareaClass}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initiativeQuestion" className={labelClass}>
                    لو طُلب منك تطوير مبادرة ثقافية مستدامة، ما أول 3 عناصر
                    ستبني عليها خطتك؟
                  </Label>
                  <Textarea
                    id="initiativeQuestion"
                    name="initiativeQuestion"
                    value={formData.initiativeQuestion}
                    onChange={handleInputChange}
                    placeholder="اكتب إجابتك هنا..."
                    required
                    rows={4}
                    className={textareaClass}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceQuestion" className={labelClass}>
                    صف تجربة فشل أو نجاح مهني مررت بها، وماذا تعلمت منها؟
                  </Label>
                  <Textarea
                    id="experienceQuestion"
                    name="experienceQuestion"
                    value={formData.experienceQuestion}
                    onChange={handleInputChange}
                    placeholder="اكتب إجابتك هنا..."
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
              className="w-full h-14 text-lg font-semibold bg-[#d4a574] hover:bg-[#c49564] text-[#0f172a] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#0f172a]/30 border-t-[#0f172a] rounded-full animate-spin" />
                  جاري الإرسال...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  إرسال الطلب
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
