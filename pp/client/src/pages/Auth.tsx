import { Link, useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useTitle } from "@/lib/use-title";
import { api, saveAuth } from "@/lib/api";

export default function AuthPage() {
  useTitle("Sign in — ProductPulse");
  const [tab, setTab] = useState("login");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
      });
      saveAuth(res.token, res.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    }
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const res = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          password: fd.get("password"),
        }),
      });
      saveAuth(res.token, res.user);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="hidden md:flex flex-col justify-between p-10 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
        <Link to="/" className="flex items-center gap-2 text-primary-foreground">
          <div className="h-8 w-8 rounded-md bg-white/15 grid place-items-center">
            <Activity className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight">ProductPulse</span>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold leading-tight max-w-md">Transform product data into decisions.</h1>
          <p className="mt-3 opacity-90 max-w-md">Funnels, retention, feature adoption, and A/B tests — in a single workspace built for product teams.</p>
        </div>
        <div className="text-sm opacity-80">© {new Date().getFullYear()} ProductPulse</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="md:hidden flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary-glow grid place-items-center">
              <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-semibold">ProductPulse</span>
          </Link>
          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in or create an account to continue.</p>

          <Tabs value={tab} onValueChange={setTab} className="mt-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="demo@productpulse.io" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} />
                </div>
                <Button type="submit" className="w-full">Sign in</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Swayam Sankar" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email-s">Email</Label>
                  <Input id="email-s" name="email" type="email" placeholder="you@company.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password-s">Password</Label>
                  <Input id="password-s" name="password" type="password" placeholder="At least 8 characters" required minLength={8} />
                </div>
                <Button type="submit" className="w-full">Create account</Button>
              </form>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}
