// hooks/useScrollRestoration.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollRestoration() {
    const { pathname } = useLocation();

    useEffect(() => {
        // try restoring saved position
        const saved = sessionStorage.getItem(`scroll-${pathname}`);
        if (saved) {
            // wait a tick to ensure DOM is painted before scrolling
            requestAnimationFrame(() => {
                window.scrollTo(0, parseInt(saved, 10));
            });
        } else {
            window.scrollTo(0, 0);
        }

        const handleScroll = () => {
            sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString());
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);
}
