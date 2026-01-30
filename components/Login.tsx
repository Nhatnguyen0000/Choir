
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
    
    // Giả lập xử lý đăng nhập và phân vùng ca đoàn dựa trên tài khoản
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const matchedChoir = choirs[account.toLowerCase()];

    if (matchedChoir && password === '123456') {
      const bdhUser: Member = {
        id: `usr-${matchedChoir.id}`,
        choirId: matchedChoir.id,
        saintName: account.includes('thienthan') ? 'Phêrô' : account.includes('seraphim') ? 'Maria' : 'Cecilia',
        name: 'Thành viên Ban Điều Hành',
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
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amberGold/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-900/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md space-y-10 relative z-10">
        <div className="text-center space-y-6">
          <div className="inline-flex p-5 bg-slate-900 rounded-3xl text-white shadow-2xl animate-in zoom-in duration-700">
            <Music2 size={40} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
             <h1 className="sacred-title text-4xl font-bold text-slate-900 italic tracking-tight uppercase">Sổ Vàng Hiệp Thông</h1>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] italic">Công Tác Phụng Vụ & Hiệp Thông</p>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] border-slate-200 shadow-2xl bg-white/90 backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-[11px] font-bold">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tài khoản (Email)</label>
              <input 
                type="text" 
                required
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="thienthan@bachoa.com"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold outline-none focus:border-amberGold shadow-sm" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold outline-none focus:border-amberGold shadow-sm" 
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] font-black uppercase text-[12px] tracking-[0.2em] shadow-xl active:scale-[0.98] hover:shadow-amberGold/20 transition-all flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <> <LogIn size={20} /> Vào Sổ Vàng </>}
            </button>
          </form>
        </div>

        <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.4em] italic">
          Mọi sự vì Vinh Danh Chúa • AMDG
        </p>
      </div>
    </div>
  );
};

export default Login;
