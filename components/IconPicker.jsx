"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaShoppingCart,
  FaUtensils,
  FaCar,
  FaHome,
  FaFilm,
  FaHeartbeat,
  FaGift,
  FaLightbulb,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const iconMap = {
  Grocery: { icon: <FaShoppingCart size={22} />, color: "bg-blue-500" },
  "Food and Drink": { icon: <FaUtensils size={22} />, color: "bg-red-500" },
  Transportation: { icon: <FaCar size={22} />, color: "bg-purple-500" },
  Housing: { icon: <FaHome size={22} />, color: "bg-orange-500" },
  Entertainment: { icon: <FaFilm size={22} />, color: "bg-teal-500" },
  "Vehicle Maintenance": { icon: <FaCar size={22} />, color: "bg-yellow-500" },
  Health: { icon: <FaHeartbeat size={22} />, color: "bg-pink-500" },
  Gifts: { icon: <FaGift size={22} />, color: "bg-indigo-500" },
  Bills: { icon: <FaLightbulb size={22} />, color: "bg-gray-600" },
};

export { iconMap };

let globalSetOpen;

export default function IconPicker({ selectedIcon, onChange }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  // 🔹 Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".icon-picker") &&
        !e.target.closest(".icon-popup")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Ensure only one stays open
  useEffect(() => {
    if (open) {
      if (globalSetOpen && globalSetOpen !== setOpen) {
        globalSetOpen(false);
      }
      globalSetOpen = setOpen;

      // calculate button position
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 8, // 8px gap
          left: rect.left + window.scrollX,
        });
      }
    }
  }, [open]);

  return (
    <div className="relative icon-picker inline-block" ref={buttonRef}>
      {/* Toggle button */}
      <div
        className={`w-10 h-10 flex items-center justify-center 
                    rounded-full text-white cursor-pointer 
                    ${iconMap[selectedIcon]?.color}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {iconMap[selectedIcon]?.icon}
      </div>

      {/* Popup rendered at absolute screen position */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute z-[9999] icon-popup bg-white rounded-xl shadow-xl 
                           grid grid-cols-3 gap-4 p-4"
                style={{
                  top: position.top,
                  left: position.left,
                  position: "absolute",
                }}
              >
                {Object.keys(iconMap).map((key) => (
                  <div
                    key={key}
                    className={`w-12 h-12 flex items-center justify-center 
                                rounded-full cursor-pointer text-white 
                                ${iconMap[key].color}`}
                    onClick={() => {
                      onChange(key);
                      setOpen(false);
                    }}
                    title={key}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {iconMap[key].icon}
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
