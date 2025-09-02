"use client";

import { Navbar } from "./components/Navbar";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-mono flex flex-col">
            <Navbar hideLogout title="kanvas" />

            <main className="flex-1">
                {/* Hero */}
                <section className="px-6 py-16 md:py-24">
                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                                Collaborative canvas built for fast ideation
                            </h1>
                            <p className="mt-4 text-gray-300">
                                Draw shapes, sketch ideas with the pencil tool, and collaborate live with your team.
                                Smooth zoom and pan let you navigate large boards with ease.
                            </p>
                            <div className="mt-6 flex items-center gap-3">
                                <a href="/signup" className="rounded-md bg-gray-100 text-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">Get started</a>
                                <a href="/login" className="rounded-md border border-gray-700 text-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">I already have an account</a>
                            </div>
                        </div>
                        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
                            <div className="text-sm text-gray-300">
                                Live collaboration, drawing tools, and real-time updates in your browser.
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                                <div className="rounded-lg bg-gray-800/50 p-4 border border-gray-800">
                                    <div className="text-xl font-semibold">Circle</div>
                                    <div className="text-gray-400 text-xs mt-1">Quick shapes</div>
                                </div>
                                <div className="rounded-lg bg-gray-800/50 p-4 border border-gray-800">
                                    <div className="text-xl font-semibold">Rect</div>
                                    <div className="text-gray-400 text-xs mt-1">Wireframes</div>
                                </div>
                                <div className="rounded-lg bg-gray-800/50 p-4 border border-gray-800">
                                    <div className="text-xl font-semibold">Pencil</div>
                                    <div className="text-gray-400 text-xs mt-1">Freehand</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="px-6 py-12">
                    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
                        <div className="rounded-xl bg-gray-900 border border-gray-800 p-5">
                            <div className="text-lg font-semibold">Real‑time collaboration</div>
                            <p className="text-gray-300 mt-2 text-sm">Invite teammates to the same room and see changes instantly over websockets.</p>
                        </div>
                        <div className="rounded-xl bg-gray-900 border border-gray-800 p-5">
                            <div className="text-lg font-semibold">Powerful canvas</div>
                            <p className="text-gray-300 mt-2 text-sm">Zoom with the wheel, pan with Space + drag, and keep strokes crisp at any scale.</p>
                        </div>
                        <div className="rounded-xl bg-gray-900 border border-gray-800 p-5">
                            <div className="text-lg font-semibold">Simple tools</div>
                            <p className="text-gray-300 mt-2 text-sm">Use circles, rectangles, and the pencil tool to sketch and iterate quickly.</p>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="px-6 py-12">
                    <div className="max-w-5xl mx-auto rounded-xl border border-gray-800 bg-gray-900 p-6">
                        <div className="text-lg font-semibold">How Kanvas works</div>
                        <ol className="mt-3 list-decimal list-inside space-y-2 text-gray-300 text-sm">
                            <li>Sign up and log in to your account.</li>
                            <li>Create a new canvas room or join an existing one by slug.</li>
                            <li>Pick a tool (circle, rectangle, pencil) from the toolbar and start drawing.</li>
                            <li>Use your mouse wheel to zoom, hold Space and drag to pan around the board.</li>
                            <li>Everyone in the room sees updates live as you draw.</li>
                        </ol>
                        <div className="mt-5">
                            <a href="/signup" className="rounded-md bg-gray-100 text-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">Create your account</a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="px-6 py-6 border-t border-gray-800 text-gray-400 text-xs">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>© {new Date().getFullYear()} Kanvas. All rights reserved.</div>
                    <div className="flex gap-4">
                        <a href="/login" className="hover:text-gray-300">Login</a>
                        <a href="/signup" className="hover:text-gray-300">Signup</a>
                        <a href="/dashboard" className="hover:text-gray-300">Dashboard</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
