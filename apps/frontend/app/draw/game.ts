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
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
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

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Common stroke style
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.ctx.lineWidth = 2;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";

        this.existingShapes.map((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
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
        this.clicked = true
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        this.currentMouseX = this.startX;
        this.currentMouseY = this.startY;

        if (this.selectedTool === "pencil") {
            this.currentPencilStroke = [{ x: this.startX, y: this.startY }];
        }
    }
    mouseUpHandler = (e: MouseEvent) => {
         this.clicked = false;
        const rect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        if (selectedTool === "rect") {
            // Calculate width and height as the difference between start and end points
            const width = endX - this.startX;
            const height = endY - this.startY;
            
            // Ensure positive dimensions and correct positioning
            if (Math.abs(width) > 1 && Math.abs(height) > 1) {
                shape = {
                    type: "rect",
                    x: this.startX,
                    y: this.startY ,
                    width: Math.abs(width),
                    height: Math.abs(height)
                };
            }
        } else if (selectedTool === "circle") {
            // Calculate radius based on distance from start point
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
            // reset temp stroke
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
        if (this.clicked) {
            const rect = this.canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            const width = currentX - this.startX;
            const height = currentY - this.startY;
            
            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255, 255, 255)"
            this.ctx.lineWidth = 2;
            this.ctx.lineJoin = "round";
            this.ctx.lineCap = "round";
            const selectedTool = this.selectedTool;
            console.log(selectedTool)
            if (selectedTool === "rect") {
                // Draw rectangle with proper positioning for negative dimensions
                const x = width >= 0 ? this.startX : currentX;
                const y = height >= 0 ? this.startY : currentY;
                this.ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));
            } else if (selectedTool === "circle") {
                // Calculate radius based on distance from start point
                const deltaX = e.clientX - this.startX;
                const deltaY = e.clientY - this.startY;
                const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                // Set stroke style for circle
                this.ctx.strokeStyle = "rgba(255, 255, 255)";
                
                // Draw the circle from the start point with calculated radius
                this.ctx.beginPath();
                this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (selectedTool === "pencil") {
                // Append current point and draw live stroke
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

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)    

    }
}