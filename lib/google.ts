import { google } from 'googleapis';

// ─── Service Account Credentials ─────────────────────────────────────────────

function getCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_KEY is not set. Please add it to .env.local',
    );
  }
  return JSON.parse(raw);
}

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

// ─── Auth Client ──────────────────────────────────────────────────────────────
// Using `any` to avoid duplicate google-auth-library type conflict
// between googleapis-common and google-auth-library packages

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let authClient: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAuthClient(): any {
  if (!authClient) {
    const credentials = getCredentials();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authClient = new (google.auth.GoogleAuth as any)({
      credentials,
      scopes: SCOPES,
    });
  }
  return authClient;
}

// ─── Sheets Client ────────────────────────────────────────────────────────────

export function getSheetsClient() {
  const auth = getAuthClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return google.sheets({ version: 'v4', auth } as any);
}

// ─── Drive Client ─────────────────────────────────────────────────────────────

export function getDriveClient(accessToken?: string) {
  if (accessToken) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    return google.drive({ version: 'v3', auth } as any);
  }
  const auth = getAuthClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return google.drive({ version: 'v3', auth } as any);
}

// ─── Spreadsheet IDs ──────────────────────────────────────────────────────────

export const SPREADSHEET_ID = process.env.SPREADSHEET_ID ?? '';

export const SHEET_NAMES = {
  logSubmission: 'Log Submission',
  daftarPengguna: 'Daftar Pengguna',
  departemenDivisi: 'Daftar Departemen & Divisi',
} as const;

// ─── Drive Folder IDs ─────────────────────────────────────────────────────────

export const DRIVE_ROOT_FOLDER_ID = process.env.DRIVE_ROOT_FOLDER_ID ?? '';
