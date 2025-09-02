import { ReactNode } from "react";

export function IconButton({
    icon, onClick, activated
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return <button
        type="button"
        className={`m-1 rounded-md border px-2.5 py-2 transition-colors ${
            activated
                ? "bg-gray-100 text-gray-900 border-gray-200"
                : "bg-gray-900 text-gray-200 border-gray-800 hover:bg-gray-800"
        }`}
        onClick={onClick}
    >
        {icon}
    </button>
}
