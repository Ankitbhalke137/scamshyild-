import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Lock } from 'lucide-react';
import { getTranslation, Language } from '../lib/translations';
import logo from 'figma:asset/78a6bf560a6282d93bf2818b1a534c19b6c87bca.png';

interface LoginProps {
  onLogin: () => void;
  language: Language;
}

export function Login({ onLogin, language }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const t = (key: string) => getTranslation(language, key);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@safecypher.com' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid credentials. Use admin@safecypher.com / admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-green-400 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto">
            <img src={logo} alt="Safe Cypher" className="w-32 h-32 mx-auto" />
          </div>
          <CardTitle className="text-3xl">{t('appName')}</CardTitle>
          <CardDescription className="text-base">
            {t('tagline')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@safecypher.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-green-400 hover:from-cyan-600 hover:to-green-500" size="lg">
              <Lock className="mr-2 h-4 w-4" />
              {t('login')}
            </Button>
            <div className="text-xs text-center text-gray-500 mt-4">
              Demo: admin@safecypher.com / admin123
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
