"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { email, password } = formData;

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/transition"); // Changed this to go through transition page
    }
  }, [status, router]);

  // Open modal on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!isModalOpen && window.scrollY > 100) {
        setIsModalOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isModalOpen]);

  const handleOnChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Signing in...");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      toast.dismiss(toastId);
      if (result.ok) {
        toast.success("Login successful!");
        router.push("/transition"); // Changed this to go through transition page
      } else {
        toast.error(result.error || "Failed to login");
      }
    } catch {
      toast.dismiss(toastId);
      toast.error("Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div
      className="h-[200vh] bg-cover bg-center bg-no-repeat font-sans text-[rgb(var(--foreground)/0.7)]"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1538137524007-21e48fa42f3f?ixlib=rb-0.3.5&auto=format&fit=crop&w=1834&q=80')",
      }}
    >
      {!isModalOpen && (
        <div className="fixed top-1/2 left-1/2 flex flex-col items-center text-center text-[#8c7569] text-[32px] font-extrabold transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          SCROLL DOWN
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="mt-4 w-[52px] fill-current"
          >
            <path d="M16 3C8.832031 3 3 8.832031 3 16s5.832031 13 13 13 13-5.832031 13-13S23.167969 3 16 3zm0 2c6.085938 0 11 4.914063 11 11 0 6.085938-4.914062 11-11 11-6.085937 0-11-4.914062-11-11C5 9.914063 9.914063 5 16 5zm-1 4v10.28125l-4-4-1.40625 1.4375L16 23.125l6.40625-6.40625L21 15.28125l-4 4V9z" />
          </svg>
        </div>
      )}

      {/* Modal container */}
      <div
        className={`fixed left-0 bottom-0 w-full ${
          isModalOpen
            ? "h-full bg-black bg-opacity-[0.85]"
            : "h-[60px] bg-black bg-opacity-50"
        } flex items-center justify-center transition-all duration-400`}
      >
        <div
          className={`
    relative w-full max-w-[920px] h-full md:h-auto rounded-lg overflow-hidden bg-[rgb(var(--card)/1)]
    transform mx-auto my-auto
    ${isModalOpen
      ? "opacity-100 pointer-events-auto translate-y-0 scale-100 duration-600"
      : "opacity-0 pointer-events-none translate-y-[100px] scale-[0.4] duration-300"}
  `}
        
        
        >
          <div className="flex flex-col md:flex-row h-full">
          {/* Left pane */}
          <div
            className={`p-[60px_30px_20px] flex-[1.5] transform transition-all ${
              isModalOpen
                ? "translate-y-0 opacity-100 delay-100"
                : "translate-y-[80px] opacity-0"
            }`}
          >
            <h1 className="text-[26px] font-normal ">Welcome!</h1>
            <p className="mt-1.5 mb-7.5">
              Log in to manage your profile, post jobs, or find your next gig!
            </p>

            <form onSubmit={handleOnSubmit}>
              {/* Email */}
              <div className="mb-5 p-[10px_10px_8px] border border-[rgb(var(--border)/1)] rounded focus-within:border-[rgb(var(--primary)/1)]">
                <label
                  htmlFor="email"
                  className="block text-[11px] uppercase font-semibold tracking-[0.7px] text-[rgb(var(--secondary-foreground)/1)]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleOnChange}
                  required
                  className="mt-1 w-full border-0 outline-none placeholder-gray-400 bg-transparent"
                />
              </div>

              {/* Password */}
              <div className="mb-5 p-[10px_10px_8px] border border-[rgb(var(--border)/1)] rounded focus-within:border-[rgb(var(--primary)/1)]">
                <label
                  htmlFor="password"
                  className="block text-[11px] uppercase font-semibold tracking-[0.7px] text-[rgb(var(--secondary-foreground)/1)]"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleOnChange}
                  required
                  className="mt-1 w-full border-0 outline-none placeholder-gray-400 bg-transparent"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-2.5 px-10 rounded-full bg-[rgb(var(--primary)/1)] text-[rgb(var(--primary-foreground)/1)] font-sans text-lg shadow-[0_10px_40px_rgba(0,0,0,0.16)] hover:bg-[rgb(var(--primary)/0.8)] disabled:opacity-50"
                >
                  {isLoading ? "Signing In..." : "Login"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-[14px] text-center">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[rgb(var(--primary)/1)]">
                Sign up now
              </Link>
            </p>
          </div>

          {/* Right pane with image */}
          <div className="hidden md:flex flex-[2] overflow-hidden">
            <Image
              src="/images/6310507.jpg"
              alt="Login"
              width={400}
              height={300}
              className={`w-full h-full object-cover transition-transform duration-[1200ms] ${
                isModalOpen ? "scale-100" : "scale-[2]"
              }`}
            />
          </div>

          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 w-8 h-8 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              className="fill-[rgb(var(--foreground)/0.6)] hover:fill-[rgb(var(--foreground)/1)]"
            >
              <path d="M 25 3 C 12.86158 3 3 12.86158 3 25 C 3 37.13842 12.86158 47 25 47 C 37.13842 47 47 37.13842 47 25 C 47 12.86158 37.86158 3 25 3 z M 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.980469 15.990234 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 z" />
            </svg>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}