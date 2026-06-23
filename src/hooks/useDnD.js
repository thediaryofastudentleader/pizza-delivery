import { useEffect, useRef, useCallback } from "react";

const DRAG_TYPE = "PIZZA_INGREDIENT";

export const useDraggable = (name, onDragStart) => {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        el.draggable = true;
        const handleDragStart = (e) => {
            e.dataTransfer.setData(DRAG_TYPE, name);
            e.dataTransfer.effectAllowed = "copy";
            if (onDragStart) onDragStart(e, name);
        };
        el.addEventListener("dragstart", handleDragStart);
        return () => el.removeEventListener("dragstart", handleDragStart);
    }, [name, onDragStart]);
    return ref;
};

export const useDropzone = (onDrop) => {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        const handleDragOver = (e) => {
            e.preventDefault(); // required to allow drop
            e.dataTransfer.dropEffect = "copy";
        };
        const handleDrop = (e) => {
            e.preventDefault();
            const name = e.dataTransfer.getData(DRAG_TYPE);
            if (name) onDrop(name);
        };
        el.addEventListener("dragover", handleDragOver);
        el.addEventListener("drop", handleDrop);
        return () => {
            el.removeEventListener("dragover", handleDragOver);
            el.removeEventListener("drop", handleDrop);
        };
    }, [onDrop]);
    return ref;
};
