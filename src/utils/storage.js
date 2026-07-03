const supabase = require("../config/supabase");

async function uploadFile(bucket, filePath, file) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return filePath;
}

async function deleteFile(bucket, filePath) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    throw error;
  }
}

function getPublicUrl(bucket, filePath) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

module.exports = {
  uploadFile,
  deleteFile,
  getPublicUrl,
};