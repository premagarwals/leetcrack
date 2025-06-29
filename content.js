browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getSolved") {
    fetch("https://leetcode.com/api/problems/algorithms/", {
      method: "GET",
      credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
      const solved = data.stat_status_pairs.filter(p => p.status === "ac").map(p => ({
        title: p.stat.question__title,
        titleSlug: p.stat.question__title_slug,
        difficulty: ["Easy", "Medium", "Hard"][p.difficulty.level - 1],
        frontendId: p.stat.frontend_question_id
      }));
      sendResponse({ success: true, data: solved });
    })
    .catch(err => {
      console.error("Fetch failed:", err);
      sendResponse({ success: false });
    });

    return true;
  }
});
