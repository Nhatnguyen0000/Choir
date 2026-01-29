
import React, { useState } from 'react';
import { Music2, Loader2, LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store';
import { Member } from '../types';

const Login: React.FC = () => {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email && password) {
      const adminUser: Member = {
        id: 'usr-admin',
        saintName: 'Phêrô',
        name: 'Giuse Nguyễn Văn A',
        phone: '0999888777',
        gender: 'Nam',
        role: 'Ca trưởng',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE'
      };
      login(adminUser);
    } else {
      setError('Anh chị vui lòng nhập đầy đủ thông tin đăng nhập.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amberGold/10 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-royalBlue/5 rounded-full blur-[80px]"></div>

      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-amberGold rounded-2xl text-white shadow-lg animate-in zoom-in duration-500">
            <Music2 size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
             <h1 className="sacred-title text-3xl font-bold text-slate-900 italic tracking-tight">THIÊN THẦN</h1>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] italic">Giáo xứ Bắc Hòa 2027</p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-xl border-slate-200 shadow-xl bg-white/90">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3 text-rose-600 text-[11px] font-bold">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email / Tài khoản</label>
              <input 
                type="text" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bachoa.com"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold outline-none focus:border-amberGold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mật khẩu</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-bold outline-none focus:border-amberGold" 
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 active-pill rounded-lg font-bold uppercase text-[11px] tracking-wider shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <> <LogIn size={18} /> Đăng nhập </>}
            </button>
          </form>
        </div>

        <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest italic">
          Nguyện Chúa chúc lành cho buổi Phụng vụ hôm nay
        </p>
      </div>
    </div>
  );
};

export default Login;
