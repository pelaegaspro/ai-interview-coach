export function track(event, extra = {}) {
  if (typeof window === "undefined") return;

  try {
    const variants = JSON.parse(localStorage.getItem("ab_tests") || "{}");

    // In a production environment this would route to our analytic collector edge API
    console.log("[TRACKING EVENT]", {
      event,
      timestamp: new Date().toISOString(),
      variants,
      ...extra
    });

    // fetch("/api/v1/track", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     event,
    //     variant: variants,
    //     ...extra
    //   })
    // });
  } catch(e) { /* ignore tracking blockages */ }
}
