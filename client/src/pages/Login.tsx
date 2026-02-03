import { useState } from "react";
import { LogIn, AlertCircle } from "lucide-react";

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 正确的凭证
  const VALID_USERNAME = "xiaodaochuan";
  const VALID_PASSWORD = "4233193Jy";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 模拟登录延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      // 保存登录状态到 localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      onLogin(username);
    } else {
      setError("账户名或密码错误，请重试");
      setPassword("");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-accent/10 border border-accent/30 mb-4">
            <LogIn className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">纯碱期货分析看板</h1>
          <p className="text-sm text-muted-foreground">登录以访问实时交易建议和风险管理工具</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              账户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入账户名"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleLogin(e as any);
                }
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full py-3 px-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                登录中...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                登录
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            本系统仅供授权用户使用。未经授权的访问将被记录。
          </p>
        </div>
      </div>
    </div>
  );
}
