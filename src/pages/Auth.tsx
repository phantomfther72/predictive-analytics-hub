
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword, validateEmail, sanitizeInput } from "@/utils/validation";
import { checkAuthRateLimit, rateLimiter } from "@/utils/rateLimiter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordErrors, setPasswordErrors] = React.useState<string[]>([]);
  const [emailErrors, setEmailErrors] = React.useState<string[]>([]);
  const [rateLimitMessage, setRateLimitMessage] = React.useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    // Clear any existing session
    supabase.auth.signOut();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = (isSignUp: boolean = false) => {
    const emailValidation = validateEmail(email);
    const passwordValidation = isSignUp ? validatePassword(password) : { isValid: true, errors: [] };

    setEmailErrors(emailValidation.errors);
    setPasswordErrors(passwordValidation.errors);

    return emailValidation.isValid && passwordValidation.isValid;
  };

  const getClientIdentifier = () => {
    return `${email}_${window.navigator.userAgent.slice(0, 50)}`;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(true)) {
      return;
    }

    const identifier = getClientIdentifier();
    if (!checkAuthRateLimit(identifier)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(identifier, 'auth') / 60000);
      setRateLimitMessage(`Too many attempts. Please try again in ${remainingTime} minutes.`);
      return;
    }

    setLoading(true);
    setRateLimitMessage("");

    try {
      const sanitizedEmail = sanitizeInput(email);
      
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }
      
      toast({
        title: "Success!",
        description: "Check your email for the confirmation link.",
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(false)) {
      return;
    }

    const identifier = getClientIdentifier();
    if (!checkAuthRateLimit(identifier)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(identifier, 'auth') / 60000);
      setRateLimitMessage(`Too many attempts. Please try again in ${remainingTime} minutes.`);
      return;
    }

    setLoading(true);
    setRateLimitMessage("");

    try {
      const sanitizedEmail = sanitizeInput(email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      navigate("/");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-fade-up">
        <CardHeader>
          <CardTitle>Welcome to Predictive Pulse</CardTitle>
          <CardDescription>
            Sign in to access premium market analytics features
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rateLimitMessage && (
            <Alert className="mb-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{rateLimitMessage}</AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  {emailErrors.length > 0 && (
                    <div className="mt-1 text-sm text-red-600">
                      {emailErrors.map((error, i) => (
                        <div key={i}>{error}</div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading || !!rateLimitMessage}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  {emailErrors.length > 0 && (
                    <div className="mt-1 text-sm text-red-600">
                      {emailErrors.map((error, i) => (
                        <div key={i}>{error}</div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {passwordErrors.length > 0 && (
                  <div className="text-sm text-red-600">
                    {passwordErrors.map((error, i) => (
                      <div key={i}>{error}</div>
                    ))}
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={loading || !!rateLimitMessage}>
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
