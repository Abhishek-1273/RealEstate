import * as React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from "framer-motion";

const RenderTarget = {
    current: () => "preview",
    canvas: "canvas",
    export: "export",
    thumbnail: "thumbnail",
    preview: "preview",
};

const GRADIENT_FALLBACKS = [
    "linear-gradient(160deg, #ff6b6b, #ffd93d)",
    "linear-gradient(160deg, #4facfe, #00f2fe)",
    "linear-gradient(160deg, #43e97b, #38f9d7)",
    "linear-gradient(160deg, #fa709a, #fee140)",
    "linear-gradient(160deg, #a18cd1, #fbc2eb)",
    "linear-gradient(160deg, #f093fb, #f5576c)",
    "linear-gradient(160deg, #5ee7df, #b490ca)",
];

const RENDER_RANGE = 6;

function resolveImageSrc(input) {
    if (!input) return "";
    if (typeof input === "string") return input;
    if (typeof input === "object" && input.src) return input.src;
    return "";
}

function resolveImageSrcSet(input) {
    if (input && typeof input === "object" && input.srcSet) return input.srcSet;
    return undefined;
}

function resolveItemSrc(item) {
    const override = item?.srcUrl && item.srcUrl.trim();
    if (override) return override;
    return resolveImageSrc(item?.src);
}

function relOf(index, pos, count) {
    let rel = (((index - pos) % count) + count) % count;
    if (rel > count / 2) rel -= count;
    return rel;
}

function xForRel(rel, s, gap) {
    const ar = Math.abs(rel);
    const c1 = s.activeWidth / 2 + gap + s.restWidth / 2;
    const pitch = s.restWidth + gap;
    const mag = ar <= 1 ? ar * c1 : c1 + (ar - 1) * pitch;
    return (rel < 0 ? -1 : 1) * mag;
}

function blendForRel(rel) {
    return Math.min(Math.abs(rel), 1);
}

function Card({
    item,
    index,
    pos,
    count,
    R,
    sizing,
    gap,
    radius,
    gradient,
    onSelect,
}) {
    const src = resolveItemSrc(item);
    const srcSet = resolveImageSrcSet(item?.src);

    const x = useTransform(pos, (p) =>
        xForRel(relOf(index, p, count), sizing, gap)
    );
    const opacity = useTransform(pos, (p) => {
        const ar = Math.abs(relOf(index, p, count));
        return ar <= R ? 1 : ar >= R + 1 ? 0 : 1 - (ar - R);
    });
    const zIndex = useTransform(pos, (p) =>
        Math.round(1000 - Math.abs(relOf(index, p, count)) * 100)
    );
    const width = useTransform(pos, (p) => {
        const a = blendForRel(relOf(index, p, count));
        return sizing.activeWidth + (sizing.restWidth - sizing.activeWidth) * a;
    });
    const height = useTransform(pos, (p) => {
        const a = blendForRel(relOf(index, p, count));
        return (
            sizing.activeHeight + (sizing.restHeight - sizing.activeHeight) * a
        );
    });
    const borderRadius = useTransform(pos, (p) => {
        const a = blendForRel(relOf(index, p, count));
        const w =
            sizing.activeWidth + (sizing.restWidth - sizing.activeWidth) * a;
        const h =
            sizing.activeHeight + (sizing.restHeight - sizing.activeHeight) * a;
        return (Math.max(0, Math.min(20, radius)) / 20) * (Math.min(w, h) / 2);
    });
    const boxShadow = useTransform(pos, (p) =>
        Math.abs(relOf(index, p, count)) < 0.5
            ? "0 24px 70px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)"
            : "0 14px 40px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.05)"
    );

    // Text details fade in only when card is centered
    const textOpacity = useTransform(pos, (p) => {
        const ar = Math.abs(relOf(index, p, count));
        return ar < 0.25 ? 1 : 0;
    });

    return (
        <motion.div
            onClick={onSelect ? () => onSelect(index) : undefined}
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                x,
                zIndex,
                opacity,
                cursor: onSelect ? "pointer" : "default",
            }}
        >
            <motion.div
                style={{
                    x: "-50%",
                    y: "-50%",
                    width,
                    height,
                    borderRadius,
                    overflow: "hidden",
                    background: gradient,
                    boxShadow,
                }}
            >
                {src ? (
                    <img
                        src={src}
                        srcSet={srcSet}
                        alt={item?.alt || ""}
                        draggable={false}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            pointerEvents: "none",
                            userSelect: "none",
                        }}
                    />
                ) : null}

                {/* Agent Overlay Details */}
                {item?.name && (
                    <motion.div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, rgba(7, 26, 47, 0.95) 0%, rgba(7, 26, 47, 0.4) 50%, transparent 100%)",
                            opacity: textOpacity,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "end",
                            padding: "24px",
                            pointerEvents: "none",
                            color: "#ffffff"
                        }}
                    >
                        <h3 style={{ fontSize: "20px", fontWeight: 800, margin: 0, fontFamily: "Outfit, Inter, sans-serif" }}>
                            {item.name}
                        </h3>
                        <p style={{ color: "#D4AF37", fontSize: "11px", fontWeight: 600, margin: "4px 0 12px 0", fontFamily: "var(--font-accent)", letterSpacing: "1px", textTransform: "uppercase" }}>
                            {item.role}
                        </p>
                        
                        <div style={{ display: "flex", gap: "16px", fontSize: "11px", opacity: 0.8, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "10px" }}>
                            <span><strong>{item.propertiesSold}</strong> Sold</span>
                            <span><strong>{item.experience}yr</strong> Exp</span>
                            <span><strong>★ {item.rating}</strong> Rating</span>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}

function ArrowButton({
    side,
    onClick,
    color,
    background,
    size,
    position,
}) {
    const isLeft = side === "left";
    const p = Math.max(0, Math.min(100, position));
    const inset = `calc((50% - ${size}px) * ${(100 - p) / 100})`;
    return (
        <button
            type="button"
            aria-label={isLeft ? "Previous" : "Next"}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            style={{
                position: "absolute",
                top: "50%",
                [isLeft ? "left" : "right"]: inset,
                transform: "translateY(-50%)",
                width: size,
                height: size,
                borderRadius: "50%",
                border: "none",
                background,
                color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
                zIndex: 2000,
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                WebkitTapHighlightColor: "transparent",
            }}
        >
            <svg
                width={size * 0.4}
                height={size * 0.4}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pointerEvents: "none" }}
            >
                {isLeft ? (
                    <polyline points="15 18 9 12 15 6" />
                ) : (
                    <polyline points="9 18 15 12 9 6" />
                )}
            </svg>
        </button>
    );
}

export default function CoverflowCarousel(props) {
    props = { ...COMPONENT_DEFAULTS, ...props };
    const {
        images: rawImages,
        activeWidth,
        activeHeight,
        restWidth,
        restHeight,
        gap,
        radius,
        showArrows,
        arrowColor,
        arrowBackground,
        arrowSize,
        arrowPosition,
        autoplay,
        autoplayDirection,
        transition: transitionProp,
        style,
    } = props;

    const renderTarget = RenderTarget.current();
    const isStatic =
        renderTarget === RenderTarget.export ||
        renderTarget === RenderTarget.thumbnail;
    const prefersReducedMotion = useReducedMotion();

    const images = useMemo(
        () =>
            Array.isArray(rawImages) && rawImages.length > 0
                ? rawImages
                : [],
        [rawImages]
    );
    const count = Math.max(1, images.length);

    const sizing = useMemo(
        () => ({ restWidth, restHeight, activeWidth, activeHeight }),
        [restWidth, restHeight, activeWidth, activeHeight]
    );

    const moveDur =
        typeof transitionProp?.duration === "number"
            ? transitionProp.duration
            : 0.5;
    const dwell =
        typeof transitionProp?.delay === "number"
            ? Math.max(0, transitionProp.delay)
            : 1.2;

    const R = Math.max(1, Math.min(RENDER_RANGE, Math.floor(count / 2) - 1));

    const pos = useMotionValue(0);
    const targetRef = useRef(0);
    const rafRef = useRef(null);
    const lastTRef = useRef(null);
    const autoplayingRef = useRef(false);
    const dirRef = useRef(1);
    const dwellAccRef = useRef(0);
    const moveDurRef = useRef(moveDur);
    moveDurRef.current = moveDur;
    const dwellRef = useRef(dwell);
    dwellRef.current = dwell;
    const reducedRef = useRef(prefersReducedMotion);
    reducedRef.current = prefersReducedMotion;

    const tick = useCallback(
        (t) => {
            const last = lastTRef.current ?? t;
            const dt = Math.min((t - last) / 1000, 1 / 30);
            lastTRef.current = t;

            const cur = pos.get();
            const diff = targetRef.current - cur;
            const dur = Math.max(0.08, moveDurRef.current);
            const step = (1 / dur) * dt;
            const arriving = reducedRef.current || Math.abs(diff) <= step;

            if (arriving) {
                pos.set(targetRef.current);
                if (autoplayingRef.current) {
                    dwellAccRef.current += dt;
                    if (dwellAccRef.current >= Math.max(0, dwellRef.current)) {
                        dwellAccRef.current = 0;
                        targetRef.current += dirRef.current;
                    }
                    rafRef.current = requestAnimationFrame(tick);
                    return;
                }
                rafRef.current = null;
                lastTRef.current = null;
                return;
            }

            pos.set(cur + Math.sign(diff) * step);
            rafRef.current = requestAnimationFrame(tick);
        },
        [pos]
    );

    const ensureRunning = useCallback(() => {
        if (rafRef.current == null) {
            lastTRef.current = null;
            rafRef.current = requestAnimationFrame(tick);
        }
    }, [tick]);

    const goNext = useCallback(() => {
        targetRef.current += 1;
        ensureRunning();
    }, [ensureRunning]);
    
    const goPrev = useCallback(() => {
        targetRef.current -= 1;
        ensureRunning();
    }, [ensureRunning]);

    const goTo = useCallback(
        (index) => {
            const cur = targetRef.current;
            let d = index - cur;
            d = ((d % count) + count) % count;
            if (d > count / 2) d -= count;
            targetRef.current = cur + d;
            ensureRunning();
        },
        [ensureRunning, count]
    );

    useEffect(() => {
        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
    }, []);

    useEffect(() => {
        const on = !isStatic && autoplay && count > 1;
        autoplayingRef.current = on;
        if (on) {
            dirRef.current = autoplayDirection === "leftToRight" ? -1 : 1;
            dwellAccRef.current = 0;
            ensureRunning();
        }
        return () => {
            autoplayingRef.current = false;
        };
    }, [isStatic, autoplay, autoplayDirection, count, ensureRunning]);

    const isHoveredRef = useRef(false);
    useEffect(() => {
        if (isStatic || autoplay) return;
        const onKey = (e) => {
            if (!isHoveredRef.current) return;
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isStatic, autoplay, goPrev, goNext]);

    const containerStyle = {
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 320,
        minHeight: 240,
        overflow: "hidden",
        userSelect: "none",
        touchAction: isStatic ? undefined : "pan-y",
        outline: "none",
    };

    const selectable = !isStatic && !autoplay;
    const cards = images.map((img, i) => (
        <Card
            key={i}
            item={img}
            index={i}
            pos={pos}
            count={count}
            R={R}
            sizing={sizing}
            gap={gap}
            radius={radius}
            gradient={GRADIENT_FALLBACKS[i % GRADIENT_FALLBACKS.length]}
            onSelect={selectable ? goTo : undefined}
        />
    ));

    const arrows = showArrows && count > 1 && (
        <>
            <ArrowButton
                side="left"
                onClick={isStatic ? () => {} : goPrev}
                color={arrowColor}
                background={arrowBackground}
                size={arrowSize}
                position={arrowPosition}
            />
            <ArrowButton
                side="right"
                onClick={isStatic ? () => {} : goNext}
                color={arrowColor}
                background={arrowBackground}
                size={arrowSize}
                position={arrowPosition}
            />
        </>
    );

    return (
        <div
            tabIndex={0}
            onMouseEnter={() => {
                isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
                isHoveredRef.current = false;
            }}
            onFocus={() => {
                isHoveredRef.current = true;
            }}
            onBlur={() => {
                isHoveredRef.current = false;
            }}
            style={containerStyle}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    isolation: "isolate",
                    zIndex: 0,
                }}
            >
                {cards}
            </div>
            {arrows}
        </div>
    );
}

const COMPONENT_DEFAULTS = {
    images: [],
    activeWidth: 500,
    activeHeight: 350,
    restWidth: 150,
    restHeight: 270,
    gap: 20,
    radius: 3,
    showArrows: true,
    arrowColor: "#000000",
    arrowBackground: "#FFFFFF",
    arrowSize: 45,
    arrowPosition: 95,
    autoplay: false,
    autoplayDirection: "rightToLeft",
    transition: {
        type: "tween",
        duration: 0.3,
        delay: 1,
        ease: "easeInOut",
    },
};
