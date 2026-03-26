import { supabase } from "@/lib/supabase";

const THERAPIST_FILES_BUCKET = "therapist-files";

export async function uploadTherapistFile(file, folder) {
  const ext = file.name?.split(".").pop()?.toLowerCase() || "bin";
  const filePath = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(THERAPIST_FILES_BUCKET)
    .upload(filePath, file, { upsert: false });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(THERAPIST_FILES_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
