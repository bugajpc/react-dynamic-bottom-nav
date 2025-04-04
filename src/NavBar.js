import { useRef, useState, useEffect } from "react";
import "./NavBar.css";

function NavBar() {
    const [highlightStyle, setHighlightStyle] = useState({});
    const [activeItem, setActiveItem] = useState(1); // Set "About me" (index 1) as the default active item
    const [isNavVisible, setIsNavVisible] = useState(true); // Track if the nav is visible
    const containerRef = useRef(null);
    const lastScrollY = useRef(0); // Track the last scroll position

    const updateHighlight = (index) => {
        const items = document.querySelectorAll(".menu-desktop-item");
        if (items[index] && containerRef.current) {
            const item = items[index].getBoundingClientRect();
            const container = containerRef.current.getBoundingClientRect();
            const highlightPadding = 10; // Add extra width to the highlight

            setHighlightStyle({
                left: `${item.left - container.left - highlightPadding / 2}px`,
                width: `${item.width + highlightPadding}px`, // Increase the width
                height: `${item.height}px`,
                top: `${item.top - container.top}px`,
                activeIndex: index,
            });
        }
    };

    useEffect(() => {
        // Set the initial highlight style for the "About me" item on mount
        updateHighlight(activeItem);

        // Adjust the highlight on window resize
        const handleResize = () => {
            updateHighlight(activeItem); // Recalculate highlight for the current active item
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [activeItem]); // Re-run when activeItem changes

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                // Scrolling down and past a threshold
                setIsNavVisible(false);
            } else {
                // Scrolling up
                setIsNavVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const windowHeight = window.innerHeight;
            const cursorY = e.clientY;

            // Show the nav if the cursor is near the bottom of the screen
            if (cursorY > windowHeight - 100) {
                setIsNavVisible(true);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleHover = (e, index) => {
        const item = e.currentTarget.getBoundingClientRect();
        const container = containerRef.current.getBoundingClientRect();
        setHighlightStyle({
            left: `${item.left - container.left}px`,
            width: `${item.width}px`,
            height: `${item.height}px`,
            top: `${item.top - container.top}px`,
            activeIndex: index,
        });
    };

    const handleClick = (index) => {
        setActiveItem(index); // Update the active item
        updateHighlight(index); // Immediately update the highlight to the clicked item
    };

    const handleMouseLeave = () => {
        // Reset the highlight to the active item when the mouse leaves
        if (activeItem !== null) {
            updateHighlight(activeItem);
        }
    };

    return (
        <nav
            className={`menu-desktop ${isNavVisible ? "visible" : "hidden"}`}
            ref={containerRef}
        >
            <div className="menu-highlight" style={highlightStyle}></div>
            <ul className="menu-desktop-items">
                {["Contact", "About me", "Projects"].map((text, index) => {
                    const isActive = activeItem === index;
                    const isHighlighted = highlightStyle.activeIndex === index;

                    return (
                        <li
                            key={index}
                            className={`menu-desktop-item ${isActive ? "active" : ""}`}
                            onMouseEnter={(e) => handleHover(e, index)}
                            onClick={() => handleClick(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <a
                                href="#"
                                className="menu-desktop-item-link"
                                style={{
                                    color: isHighlighted
                                        ? "white"
                                        : isActive
                                        ? "var(--text-color-primary)"
                                        : "var(--text-color-primary)",
                                }}
                            >
                                {text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default NavBar;