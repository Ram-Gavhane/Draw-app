import { Tool } from "./../components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    points: { x: number; y: number }[]
}

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle";
    private activeShape: Shape | null = null;
    private currentPencilStroke: { x: number; y: number }[] = [];
    private currentMouseX: number = 0;
    private currentMouseY: number = 0;

    // View transform
    private scale: number = 1;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private isPanning: boolean = false;
    private panLastX: number = 0; // screen space
    private panLastY: number = 0; // screen space
    private isSpaceDown: boolean = false;

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
        this.initZoomPanHandlers();
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("wheel", this.wheelHandler as EventListener);
        window.removeEventListener("keydown", this.keyDownHandler);
        window.removeEventListener("keyup", this.keyUpHandler);
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message);
                this.existingShapes.push(parsedShape)
                this.clearCanvas();
            }
        }
    }

    // Convert screen (pixel) to world (drawing) coords considering transform
    private toWorld(clientX: number, clientY: number) {
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        return {
            x: (x - this.offsetX) / this.scale,
            y: (y - this.offsetY) / this.scale
        };
    }

    private applyTransform() {
        this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
    }

    clearCanvas() {
        // Reset transform to clear in screen space
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw in world space with current transform
        this.applyTransform();

        // Keep a consistent on-screen stroke width
        const pixelStroke = 2 / this.scale;
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.ctx.lineWidth = pixelStroke;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";

        this.existingShapes.map((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            }else if (shape.type === "pencil") {
                if (shape.points.length > 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    shape.points.forEach((point) => this.ctx.lineTo(point.x, point.y));
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            } 
        })
    }

    mouseDownHandler = (e: MouseEvent) => {
        // Space + drag to pan (screen space deltas)
        if (this.isSpaceDown) {
            this.isPanning = true;
            this.panLastX = e.clientX;
            this.panLastY = e.clientY;
            return;
        }

        this.clicked = true
        const { x, y } = this.toWorld(e.clientX, e.clientY);
        this.startX = x;
        this.startY = y;
        this.currentMouseX = this.startX;
        this.currentMouseY = this.startY;

        if (this.selectedTool === "pencil") {
            this.currentPencilStroke = [{ x: this.startX, y: this.startY }];
        }
    }
    mouseUpHandler = (e: MouseEvent) => {
        if (this.isPanning) {
            this.isPanning = false;
            return;
        }

        this.clicked = false;
        const { x: endX, y: endY } = this.toWorld(e.clientX, e.clientY);

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        if (selectedTool === "rect") {
            const width = endX - this.startX;
            const height = endY - this.startY;
            if (Math.abs(width) > 1 && Math.abs(height) > 1) {
                shape = {
                    type: "rect",
                    x: Math.min(this.startX, endX),
                    y: Math.min(this.startY, endY),
                    width: Math.abs(width),
                    height: Math.abs(height)
                };
            }
        } else if (selectedTool === "circle") {
            const deltaX = endX - this.startX;
            const deltaY = endY - this.startY;
            const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (radius > 1) {
                shape = { 
                    type: "circle", 
                    centerX: this.startX, 
                    centerY: this.startY, 
                    radius 
                };
            }
        }else if(this.selectedTool === "pencil") {
            if (this.currentPencilStroke.length > 1) {
                shape = {
                    type: "pencil",
                    points: [...this.currentPencilStroke]
                }
            }
            this.currentPencilStroke = [];
        }

        if (!shape) {
            this.clearCanvas();
            return;
        }

        this.existingShapes.push(shape);
        const message = JSON.stringify(shape);
        this.socket.send(JSON.stringify({
            type: "chat",
            message,
            roomId: this.roomId
        }))
        this.clearCanvas();
    }
    mouseMoveHandler = (e: MouseEvent) => {
        if (this.isPanning) {
            const dx = e.clientX - this.panLastX;
            const dy = e.clientY - this.panLastY;
            this.panLastX = e.clientX;
            this.panLastY = e.clientY;
            this.offsetX += dx;
            this.offsetY += dy;
            this.clearCanvas();
            return;
        }

        if (this.clicked) {
            const { x: currentX, y: currentY } = this.toWorld(e.clientX, e.clientY);
            const width = currentX - this.startX;
            const height = currentY - this.startY;
            
            this.clearCanvas();
            const selectedTool = this.selectedTool;
            if (selectedTool === "rect") {
                const x = width >= 0 ? this.startX : currentX;
                const y = height >= 0 ? this.startY : currentY;
                this.ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));
            } else if (selectedTool === "circle") {
                const deltaX = currentX - this.startX;
                const deltaY = currentY - this.startY;
                const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                this.ctx.beginPath();
                this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (selectedTool === "pencil") {
                this.currentPencilStroke.push({ x: currentX, y: currentY });
                if (this.currentPencilStroke.length > 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.currentPencilStroke[0].x, this.currentPencilStroke[0].y);
                    this.currentPencilStroke.forEach((point) => this.ctx.lineTo(point.x, point.y));
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
        }
    }

    private wheelHandler = (e: WheelEvent) => {
        e.preventDefault();
        const zoomIntensity = 1.1;
        const mouse = this.toWorld(e.clientX, e.clientY);

        const oldScale = this.scale;
        const direction = e.deltaY < 0 ? 1 : -1;
        const newScale = direction > 0 ? oldScale * zoomIntensity : oldScale / zoomIntensity;
        // clamp
        this.scale = Math.min(5, Math.max(0.2, newScale));

        // keep mouse world point under cursor after zoom
        const rect = this.canvas.getBoundingClientRect();
        const mouseScreenX = e.clientX - rect.left;
        const mouseScreenY = e.clientY - rect.top;
        this.offsetX = mouseScreenX - mouse.x * this.scale;
        this.offsetY = mouseScreenY - mouse.y * this.scale;

        this.clearCanvas();
    }

    private keyDownHandler = (e: KeyboardEvent) => {
        if (e.code === "Space") {
            this.isSpaceDown = true;
        }
    }

    private keyUpHandler = (e: KeyboardEvent) => {
        if (e.code === "Space") {
            this.isSpaceDown = false;
            this.isPanning = false;
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)
        this.canvas.addEventListener("mouseup", this.mouseUpHandler)
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
    }

    initZoomPanHandlers() {
        // wheel with non-passive to allow preventDefault
        this.canvas.addEventListener("wheel", this.wheelHandler as EventListener, { passive: false });
        window.addEventListener("keydown", this.keyDownHandler);
        window.addEventListener("keyup", this.keyUpHandler);
    }
}