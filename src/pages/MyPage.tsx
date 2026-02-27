import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useMoodStore } from '@/store/moodStore';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingBearLoader } from '@/components/FloatingBearLoader';

const MyPage = () => {
    const { user, profile } = useMoodStore();
    const navigate = useNavigate();

    useEffect(() => {
        // If not logged in, boot to login page
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (!user || !profile) return <FloatingBearLoader message="사용자 정보를 불러오는 중..." />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen px-4 pb-24 pt-12"
            style={{ background: 'var(--sky-gradient)' }}
        >
            <h1 className="mb-6 text-center text-2xl font-bold text-foreground">마이페이지</h1>

            <div className="mx-auto max-w-sm overflow-hidden rounded-3xl bg-card shadow-lg border border-border/50">
                <div className="bg-primary/20 p-6 flex flex-col items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-primary/40 flex items-center justify-center mb-4">
                        <UserIcon size={40} className="text-primary-foreground" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{profile.nickname}</h2>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">나이</span>
                        <span className="font-medium text-foreground">{profile.age ? `${profile.age}세` : '미입력'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">성별</span>
                        <span className="font-medium text-foreground">
                            {profile.gender === 'male' ? '남성' : profile.gender === 'female' ? '여성' : profile.gender === 'other' ? '기타' : '미입력'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">기본 감정 레벨</span>
                        <span className="font-medium text-foreground">{profile.mood_level ? `${profile.mood_level} 단계` : '미입력'}</span>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full mt-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <LogOut size={16} className="mr-2" />
                        로그아웃
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default MyPage;
