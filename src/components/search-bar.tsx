"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
    const isErrorHighlight = value.trim().toUpperCase().startsWith("E-");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <div className={cn(
            "relative flex items-center w-full transition-all duration-300",
            isErrorHighlight ? "pulse-error-border rounded-full" : "",
            className
        )}>
            <Search className={cn(
                "absolute left-5 h-5 w-5 transition-colors z-10",
                isErrorHighlight ? "text-red-500" : "text-gray-400"
            )} strokeWidth={2} />

            <input
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="キーワードやエラーコードで検索"
                className={cn(
                    "w-full pl-13 pr-5 h-[52px] rounded-full text-[16px] font-normal transition-all duration-300 outline-none",
                    "bg-white border-2 placeholder:text-gray-400",
                    isErrorHighlight
                        ? "border-red-400 text-red-600"
                        : isFocused
                            ? "border-gray-900 shadow-lg"
                            : "border-gray-200 shadow-md hover:shadow-lg"
                )}
                style={{
                    boxShadow: isFocused && !isErrorHighlight
                        ? '0 6px 20px rgba(0,0,0,0.1)'
                        : '0 3px 12px rgba(0,0,0,0.06)'
                }}
            />
        </div>
    );
}
