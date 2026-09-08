import { connectToDatabase } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import { apiError, createDocument, listDocuments } from "@/lib/api/crud";
export async function GET(request: Request) { try { await connectToDatabase(); return listDocuments(Alert, request); } catch { return apiError(); } }
export async function POST(request: Request) { try { await connectToDatabase(); return createDocument(Alert, request); } catch { return apiError(); } }
