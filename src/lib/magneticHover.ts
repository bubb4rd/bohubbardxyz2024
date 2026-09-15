import gsap from "gsap";

type MagneticOptions = {
  strength?: number;
};

export function attachMagneticHover(
  el: Element,
  { strength = 0.3 }: MagneticOptions = {},
) {
  const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

  const onMove = (event: Event) => {
    const { clientX, clientY } = event as MouseEvent;
    const rect = el.getBoundingClientRect();
    xTo((clientX - (rect.left + rect.width / 2)) * strength);
    yTo((clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onLeave = () => {
    xTo(0);
    yTo(0);
  };

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);

  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}
