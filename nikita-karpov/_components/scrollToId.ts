export default function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });

  // remove hash (keeps you at the same scroll position)
  history.replaceState(null, "", window.location.pathname);
}
