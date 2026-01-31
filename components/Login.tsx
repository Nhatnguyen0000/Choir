
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
      setError('Tài khoản hoặc mật khẩu không chính xác. Xin anh chị vui lòng kiểm tra lại.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amberGold/10 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-900/5 rounded-full blur-[140px]"></div>

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-6">
          <div className="inline-flex p-6 bg-slate-900 rounded-[2rem] text-white shadow-2xl animate-in zoom-in duration-700">
            <Music2 size={44} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
             <h1 className="sacred-title text-4xl font-bold text-slate-900 italic tracking-tight uppercase">Sổ Vàng Hiệp Thông</h1>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] italic">Niên Giám Công Tác Phụng Vụ</p>
          </div>
        </div>

        <div className="glass-card p-12 rounded-[3.5rem] shadow-2xl bg-white/80 backdrop-blur-2xl">
          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-600 text-[11px] font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tài khoản cộng đoàn (Email)</label>
              <input 
                type="text" 
                required
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="thienthan@bachoa.com"
                className="w-full px-6 py-5 glass-card rounded-2xl text-[15px] font-bold outline-none border-white shadow-inner bg-slate-50/50 focus:ring-4 focus:ring-slate-100 transition-all" 
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu Sổ Vàng</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-5 glass-card rounded-2xl text-[15px] font-bold outline-none border-white shadow-inner bg-slate-50/50 focus:ring-4 focus:ring-slate-100 transition-all" 
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[12px] tracking-[0.25em] shadow-2xl active:scale-[0.98] hover:bg-slate-800 transition-all flex items-center justify-center gap-4 mt-6"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <> <LogIn size={24} /> Vào Hệ Thống Hiệp Thông </>}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-0.5 bg-slate-200 rounded-full"></div>
           <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.4em] italic opacity-60 leading-relaxed">
             Mọi sự vì Vinh Danh Thiên Chúa<br/>AMDG • BẮC HÒA 2027
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
