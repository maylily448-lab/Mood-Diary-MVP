import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FloatingBearLoader } from '@/components/FloatingBearLoader';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorObj, setErrorObj] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorObj(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorObj(error.message);
            setIsLoading(false);
            return;
        }

        // Success
        setIsLoading(false);
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
            style={{ background: 'var(--sky-gradient)' }}
        >
            {isLoading && <FloatingBearLoader message="로그인 중..." />}

            <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-lg border border-border/50">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-foreground">다시 만나서 반가워요! 🐻</h1>
                    <p className="mt-2 text-sm text-muted-foreground">감정을 기록하러 오셨군요.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-background/50"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-background/50"
                        />
                    </div>

                    {errorObj && <p className="text-sm text-destructive">{errorObj}</p>}

                    <Button type="submit" className="w-full rounded-xl font-bold mt-2" disabled={isLoading}>
                        로그인
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    아직 계정이 없으신가요?{' '}
                    <Link to="/signup" className="text-primary font-bold hover:underline">
                        회원가입
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default Login;
