
import React, { useState } from 'react';
import { Music2, Loader2, LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store';
import { Member, Choir } from '../types';

const Login: React.FC = () => {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const choirs: Record<string, Choir> = {
    'thienthan@bachoa.com': { id: 'c-thienthan', name: 'Ca đoàn Thiên Thần', parish: 'Bắc Hòa' },
    'seraphim@bachoa.com': { id: 'c-seraphim', name: 'Ca đoàn Seraphim', parish: 'Bắc Hòa' },
    'cecilia@bachoa.com': { id: 'c-cecilia', name: 'Ca đoàn Cecilia', parish: 'Bắc Hòa' }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const matchedChoir = choirs[account.toLowerCase()];

    if (matchedChoir && password === '123456') {
      const bdhUser: Member = {
        id: `usr-${matchedChoir.id}`,
        choirId: matchedChoir.id,
        saintName: account.includes('thienthan') ? 'Phêrô' : account.includes('seraphim') ? 'Maria' : 'Cecilia',
        name: 'Ban Điều Hành',
        phone: '0901234567',
        gender: 'Nam',
        role: 'Ca trưởng',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE'
      };
      login(bdhUser, matchedChoir);
    } else {
      setError('Tài khoản hoặc mật khẩu chưa đúng. Anh/chị vui lòng kiểm tra lại.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amberGold/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-royalBlue/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-sm space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 glass-card border-amberGold/30 rounded-2xl text-amberGold shadow-lg animate-in zoom-in duration-700 bg-white/60">
            <Music2 size={36} />
          </div>
          <div className="space-y-2">
             <h1 className="sacred-title text-3xl font-bold text-slate-900 italic tracking-tight uppercase leading-none">Sổ Vàng Hiệp Thông</h1>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] italic leading-none">Niên Giám Công Tác Phụng Vụ</p>
          </div>
        </div>

        <div className="glass-card p-12 rounded-[3.5rem] shadow-2xl border-white/60 bg-white/70 backdrop-blur-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-[10px] font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Email cộng đoàn</label>
              <input 
                type="text" 
                required
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="thienthan@bachoa.com"
                className="w-full px-5 py-4 glass-card rounded-2xl text-[14px] font-bold outline-none border-white shadow-inner bg-slate-50/30 focus:border-amberGold transition-all" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Mật khẩu</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 glass-card rounded-2xl text-[14px] font-bold outline-none border-white shadow-inner bg-slate-50/30 focus:border-amberGold transition-all" 
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4.5 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <> <LogIn size={20} /> Vào Hệ Thống </>}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-3">
           <div className="w-12 h-0.5 bg-slate-200 rounded-full"></div>
           <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] italic opacity-60 leading-relaxed">
             Mọi sự vì Vinh Danh Thiên Chúa<br/>AMDG • BẮC HÒA 2026
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
