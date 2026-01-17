"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../lib/api";
import { useRouter } from "next/navigation";


export default function AuthForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");

    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    // Start countdown when OTP field is shown
    useEffect(() => {

        const token = localStorage.getItem("token");
        if (token) router.push("/chat");

        if (!showOtp) return;

        setTimer(30);
        setCanResend(false);

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [showOtp]);

    async function handleContinue() {
        if (!email) return;

        try {
            await apiRequest("/api/auth/request-otp", {
                method: "POST",
                body: JSON.stringify({ email }),
            });

            setShowOtp(true);
        } catch (err: any) {
            alert(err.message);
        }
    }


    async function handleResendOtp() {
        if (!canResend) return;

        try {
            await apiRequest("/api/auth/request-otp", {
                method: "POST",
                body: JSON.stringify({ email }),
            });

            setTimer(30);
            setCanResend(false);
        } catch (err: any) {
            alert(err.message);
        }
    }


    async function handleVerify() {
        if (!otp) return;

        try {
            const data = await apiRequest("/api/auth/verify-otp", {
                method: "POST",
                body: JSON.stringify({ email, otp }),
            });

            // Example: store token
            localStorage.setItem("token", data.token);
            router.push("/chat");
        } catch (err: any) {
            alert(err.message);
        }
    }


    return (
        <div className="w-full max-w-sm text-center">

            {/* Heading */}
            <h2 className="text-2xl font-semibold mb-3">
                Sign in / Sign up
            </h2>

            <p className="text-sm text-gray-500 mb-7">
                We'll sign you in or create an account if you don't have one yet
            </p>

            {/* Google Button */}
            <button className="w-full bg-gray-500 hover:bg-gray-200 transition rounded-lg py-3 flex items-center justify-center gap-3 text-sm font-medium mb-5">
                <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.18 3.22l6.85-6.85C35.82 2.28 30.28 0 24 0 14.64 0 6.59 5.38 2.7 13.22l7.98 6.2C12.59 13.3 17.9 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.1 24.5c0-1.67-.15-3.27-.43-4.82H24v9.13h12.42c-.54 2.9-2.18 5.36-4.64 7.02l7.1 5.52C43.82 37.02 46.1 31.3 46.1 24.5z" />
                    <path fill="#FBBC05" d="M10.68 28.42c-.48-1.45-.75-2.98-.75-4.55s.27-3.1.75-4.55l-7.98-6.2C.9 16.64 0 20.23 0 24s.9 7.36 2.7 10.88l7.98-6.46z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.9-2.13 15.87-5.78l-7.1-5.52c-1.98 1.33-4.52 2.13-8.77 2.13-6.1 0-11.41-3.8-13.32-9.08l-7.98 6.46C6.59 42.62 14.64 48 24 48z" />
                </svg>
                Continue with Google
            </button>

            {/* OR Divider */}
            <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Email Input */}
            <input
                type="email"
                placeholder="Enter your work or personal email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-500 rounded-lg px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />

            {/* Continue Button */}
            {!showOtp && (
                <button
                    onClick={handleContinue}
                    disabled={!email}
                    className={`w-full rounded-lg py-3 text-sm font-medium transition
          ${email
                            ? "bg-black text-white hover:bg-gray-900"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Continue
                </button>
            )}

            {/* OTP Section */}
            {showOtp && (
                <div className="mt-4 space-y-3">

                    <div className="text-sm text-gray-600">
                        OTP sent to <span className="font-medium">{email}</span>
                    </div>

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    {/* Resend Timer */}
                    <div className="text-xs text-gray-400 text-right">
                        {canResend ? (
                            <button
                                onClick={handleResendOtp}
                                className="text-black font-medium hover:underline"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <>Resend in 0:{timer < 10 ? `0${timer}` : timer}</>
                        )}
                    </div>

                    {/* Verify Button */}
                    <button
                        onClick={handleVerify}
                        disabled={!otp}
                        className={`w-full rounded-lg py-3 text-sm font-medium transition
            ${otp
                                ? "bg-black text-white hover:bg-gray-900"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Verify OTP
                    </button>
                </div>
            )}

            {/* Footer */}
            <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                By signing up or signing in, you agree to our{" "}
                <span className="underline cursor-pointer">Terms</span> and{" "}
                <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>

        </div>
    );
}
