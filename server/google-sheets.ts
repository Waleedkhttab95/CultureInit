import { google } from "googleapis";
import type { InsertProgramRegistration } from "@shared/schema";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getAuth() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!credentials) return null;

  try {
    const parsed = JSON.parse(credentials);
    return new google.auth.GoogleAuth({
      credentials: parsed,
      scopes: SCOPES,
    });
  } catch (err) {
    console.error("Failed to parse Google Service Account key:", err);
    return null;
  }
}

export async function isGoogleSheetsConfigured(): Promise<boolean> {
  return !!(process.env.GOOGLE_SERVICE_ACCOUNT_KEY && process.env.GOOGLE_SHEET_ID);
}

export async function appendRegistrationToSheet(
  data: InsertProgramRegistration,
  baseUrl?: string
): Promise<boolean> {
  const auth = getAuth();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!auth || !spreadsheetId) {
    console.log("Google Sheets not configured, skipping...");
    return false;
  }

  const sheets = google.sheets({ version: "v4", auth });

  const genderLabel = data.gender === "male" ? "ذكر" : "أنثى";
  const orgTypeLabels: Record<string, string> = {
    government: "حكومية",
    private: "خاصة",
    nonprofit: "غير ربحية",
    freelance: "مستقل",
  };
  const worksInCultureLabels: Record<string, string> = {
    yes: "نعم",
    no: "لا",
    partial: "بشكل جزئي",
  };
  const yesNoLabels: Record<string, string> = {
    yes: "نعم",
    no: "لا",
    na: "لا ينطبق",
  };

  const qualificationLabels: Record<string, string> = {
    highschool: "ثانوية عامة",
    diploma: "دبلوم",
    bachelor: "بكالوريوس",
    master: "ماجستير",
    phd: "دكتوراه",
    other: "أخرى",
  };

  const row = [
    new Date().toISOString(),
    data.fullName,
    data.idNumber,
    genderLabel,
    data.phone,
    data.email,
    data.city,
    data.age,
    data.linkedin || "",
    qualificationLabels[data.qualification] || data.qualification,
    data.major,
    data.studyInstitution,
    data.organization,
    orgTypeLabels[data.orgType] || data.orgType,
    data.yearsOfExperience,
    data.jobTitle,
    data.resumeFileName
      ? (baseUrl ? `${baseUrl}/uploads/${data.resumeFileName}` : data.resumeFileName)
      : "",
    worksInCultureLabels[data.worksInCulture] || data.worksInCulture,
    data.cultureExperience,
    yesNoLabels[data.canAttendAll] || data.canAttendAll,
    yesNoLabels[data.canDesignProject] || data.canDesignProject,
    yesNoLabels[data.hasEmployerApproval] || data.hasEmployerApproval,
    data.gapQuestion,
    data.initiativeQuestion,
    data.experienceQuestion,
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:Y",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });
    console.log("Registration appended to Google Sheet");
    return true;
  } catch (err) {
    console.error("Failed to append to Google Sheet:", err);
    return false;
  }
}

export async function initSheetHeaders(): Promise<void> {
  const auth = getAuth();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!auth || !spreadsheetId) return;

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:Y1",
    });

    if (response.data.values && response.data.values.length > 0) return;

    const headers = [
      "تاريخ التسجيل",
      "الاسم الرباعي",
      "رقم الهوية / الإقامة",
      "الجنس",
      "رقم الجوال",
      "البريد الإلكتروني",
      "المدينة",
      "العمر",
      "LinkedIn",
      "المؤهل العلمي",
      "التخصص",
      "جهة الدراسة",
      "جهة العمل",
      "نوع جهة العمل",
      "سنوات الخبرة",
      "المسمى الوظيفي",
      "السيرة الذاتية",
      "يعمل في قطاع ثقافي",
      "الخبرة الثقافية",
      "الالتزام بالحضور",
      "مشروع التخرج",
      "موافقة جهة العمل",
      "فجوة إدارة المشاريع الثقافية",
      "عناصر مبادرة ثقافية مستدامة",
      "تجربة فشل أو نجاح مهني",
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1:Y1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [headers],
      },
    });
    console.log("Google Sheet headers initialized");
  } catch (err) {
    console.error("Failed to init sheet headers:", err);
  }
}
