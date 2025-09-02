import { useEffect, useRef, useState } from "react";
import { IconButton } from "./iconButton";
import { Circle, Pencil, RectangleHorizontalIcon, ArrowRight } from "lucide-react";
import { Game } from "../draw/game";
import { useRouter } from "next/navigation";

export type Tool = "circle" | "rect" | "pencil" | "arrow";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")
    const router = useRouter();

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {

        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }


    }, [canvasRef]);

    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
        <div style={{
            position: "fixed",
            top: 10,
            right: 10
        }}>
            <button
                type="button"
                className="rounded-md border border-gray-800 bg-gray-900/90 px-3 py-2 text-sm text-gray-100 hover:bg-gray-800 transition-colors"
                onClick={() => router.push('/dashboard')}
            >
                Exit Canvas
            </button>
        </div>
    </div>
}

function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
            position: "fixed",
            top: 10,
            left: 10
        }}>
            <div className="flex gap-t">
                <IconButton 
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("rect")
                }} 
                    activated={selectedTool === "rect"} 
                    icon={<RectangleHorizontalIcon />}
                 />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("circle")
                    }} 
                    activated={selectedTool === "circle"} 
                    icon={<Circle />}
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("arrow")
                    }} 
                    activated={selectedTool === "arrow"} 
                    icon={<ArrowRight />}
                />
            </div>
        </div>
}