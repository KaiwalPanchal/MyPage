"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Globe, Linkedin } from "lucide-react"

interface WorkPopupProps {
    isOpen: boolean
    onClose: () => void
    work: {
        role: string
        company: string
        website?: string
        linkedin?: string
    } | null
    position: { x: number; y: number }
}

export default function WorkPopup({ isOpen, onClose, work, position }: WorkPopupProps) {
    const [isVisible, setIsVisible] = useState(false)
    const popupRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isVisible && !isOpen) return null

    // Calculate the popup position above the click point
    const popupOffset = isOpen ? -10 : 0 // Animation offset
    const scale = isOpen ? 1 : 0

    return (
        <div
            ref={popupRef}
            className={`fixed z-50 flex items-center gap-2 p-2 rounded-full border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `translate(-50%, calc(-100% - 6px + ${popupOffset}px)) scale(${scale})`,
                transformOrigin: 'center bottom',
                opacity: isOpen ? 1 : 0,
            }}
        >
            {work?.website && (
                <Link
                    href={work.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                    title="Visit Website"
                >
                    <Globe className="w-5 h-5" />
                </Link>
            )}

            {work?.linkedin && (
                <Link
                    href={work.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full hover:bg-[#0077b5]/20 hover:text-[#0077b5] transition-colors text-muted-foreground"
                    title="View on LinkedIn"
                >
                    <Linkedin className="w-5 h-5" />
                </Link>
            )}

            {/* Small arrow triangle at the bottom */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/80"
            />
        </div>
    )
}
