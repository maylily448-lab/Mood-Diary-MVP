import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FloatingBearLoader } from '@/components/FloatingBearLoader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BEAR_HAPPY } from '@/store/moodStore';
import { motion } from 'framer-motion';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [moodLevel, setMoodLevel] = useState('3'); // Default 3 (통보통)

    const [isLoading, setIsLoading] = useState(false);
    const [errorObj, setErrorObj] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorObj(null);

        // 1. Auth Signup
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            setErrorObj(authError.message);
            setIsLoading(false);
            return;
        }

        if (authData.user) {
            // 2. Insert Profile Metadata
            const { error: profileError } = await supabase.from('profiles').insert([
                {
                    id: authData.user.id,
                    email,
                    nickname,
                    age: age ? parseInt(age) : null,
                    gender: gender || null,
                    mood_level: parseInt(moodLevel),
                },
            ]);

            if (profileError) {
                // Rollback strategy or notify user in a real app, MVP ignores rollback
                setErrorObj("회원가입은 되었으나, 프로필 생성에 실패했습니다.");
                console.error(profileError);
                setIsLoading(false);
                return;
            }

            // Success
            setIsLoading(false);
            navigate('/');
        } else {
            setIsLoading(false);
            setErrorObj("알 수 없는 오류가 발생했습니다.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
            style={{ background: 'var(--sky-gradient)' }}
        >
            {isLoading && <FloatingBearLoader message="가입 처리 중..." />}

            <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-lg border border-border/50">
                <div className="mb-6 text-center flex flex-col items-center">
                    <motion.img
                        src={BEAR_HAPPY}
                        alt="Bear"
                        className="h-20 w-20 object-contain mb-4"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    />
                    <h1 className="text-2xl font-bold text-foreground">새로운 시작</h1>
                    <p className="mt-2 text-sm text-muted-foreground">당신의 감정 기록을 시작해보세요.</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email">이메일 *</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password">비밀번호 *</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="nickname">이름 / 닉네임 *</Label>
                        <Input id="nickname" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="age">나이</Label>
                            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="예: 25" min={1} max={120} />
                        </div>
                        <div className="space-y-1">
                            <Label>성별</Label>
                            <Select onValueChange={setGender} value={gender}>
                                <SelectTrigger>
                                    <SelectValue placeholder="선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">남성</SelectItem>
                                    <SelectItem value="female">여성</SelectItem>
                                    <SelectItem value="other">기타</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label>평소 감정 레벨 (1: 우울 ~ 5: 활기참)</Label>
                        <Select onValueChange={setMoodLevel} value={moodLevel}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 단계</SelectItem>
                                <SelectItem value="2">2 단계</SelectItem>
                                <SelectItem value="3">3 단계 (보통)</SelectItem>
                                <SelectItem value="4">4 단계</SelectItem>
                                <SelectItem value="5">5 단계</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {errorObj && <p className="text-sm text-destructive mt-2">{errorObj}</p>}

                    <Button type="submit" className="w-full rounded-xl font-bold mt-4" disabled={isLoading}>
                        회원가입 완료
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    이미 계정이 있으신가요?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        로그인
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default Signup;
