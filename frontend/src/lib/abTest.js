export function getVariant(key = "main") {
  if (typeof window === "undefined") return "A";

  try {
    let variants = JSON.parse(localStorage.getItem("ab_tests") || "{}");

    if (!variants[key]) {
      variants[key] = Math.random() > 0.5 ? "A" : "B";
      localStorage.setItem("ab_tests", JSON.stringify(variants));
    }

    return variants[key];
  } catch (err) {
    console.error("A/B Storage Error", err);
    return "A";
  }
}
