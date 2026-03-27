function resolveDepth(experienceStr) {
  const str = (experienceStr || "").toLowerCase();
  
  if (str.includes("entry") || str.includes("internship")) return "junior";
  if (str.includes("junior")) return "junior";
  if (str.includes("mid")) return "mid";
  if (str.includes("senior") || str.includes("director") || str.includes("executive")) return "senior";
  
  return "mid";
}

module.exports = { resolveDepth };
