import { supabase } from "./supabaseClient.js";

export const uploadImageToGalleryBucket = async ({ file, folder }) => {
  const fileExt = file.name.split(".").pop();
  const filePath = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from("gallery")
    .getPublicUrl(filePath);

  return {
    publicUrl: publicUrlData?.publicUrl,
    filePath
  };
};
