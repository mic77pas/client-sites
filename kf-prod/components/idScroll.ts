function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth" });

  // remove the # from the URL
  history.replaceState(null, "", window.location.pathname);
}

export default scrollToId;
