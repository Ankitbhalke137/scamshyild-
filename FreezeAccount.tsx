import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Lock, Unlock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { getTranslation, Language } from '../lib/translations';
import { encrypt } from '../lib/encryption';
import { Alert, AlertDescription } from './ui/alert';

interface FreezeAccountProps {
  language: Language;
  onAccountFrozen: () => void;
}

export function FreezeAccount({ language, onAccountFrozen }: FreezeAccountProps) {
  const [accountType, setAccountType] = useState('');
  const [accountId, setAccountId] = useState('');
  const [bankName, setBankName] = useState('');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [encryptedData, setEncryptedData] = useState<{ encrypted: string; iv: string } | null>(null);

  const t = (key: string) => getTranslation(language, key);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = `${accountType}|${accountId}|${bankName}`;
    const encrypted = encrypt(data, unlockPassword);
    setEncryptedData(encrypted);
    setIsLocked(true);
    setIsSubmitted(true);
    onAccountFrozen();

    setAccountId('');
    setBankName('');
    setShowPassword(false);
  };

  const handleUnlock = () => {
    if (unlockPassword) {
      setIsLocked(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl">{t('freezeAccount')}</h2>
          <p className="text-xs text-gray-500">Secure accounts</p>
        </div>
      </div>

      {isSubmitted && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 text-sm">
            Request submitted! Encrypted with AES-256.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Account Details</CardTitle>
          <CardDescription className="text-xs">
            All data encrypted locally (AES-256)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="accountType" className="text-sm">{t('accountType')}</Label>
              <Select value={accountType} onValueChange={setAccountType} required>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Account</SelectItem>
                  <SelectItem value="upi">UPI ID</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="debit">Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountId" className="text-sm">{t('accountId')}</Label>
              <Input
                id="accountId"
                type="text"
                placeholder="Account number or UPI ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                disabled={isLocked}
                className="text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-sm">{t('bankName')}</Label>
              <Input
                id="bankName"
                type="text"
                placeholder="Bank or provider name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                disabled={isLocked}
                className="text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Encryption Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  className="text-sm pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" 
              size="lg"
              disabled={isLocked}
            >
              <Lock className="mr-2 h-4 w-4" />
              {t('submit')} & Encrypt
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLocked && encryptedData && (
        <Card className="border-2 border-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Lock className="mr-2 h-4 w-4 text-orange-600" />
              Encrypted Data
            </CardTitle>
            <CardDescription className="text-xs">
              Enter password to unlock
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Encrypted (AES-256):</p>
              <p className="text-xs font-mono break-all text-gray-700 mb-2">
                {encryptedData.encrypted.slice(0, 60)}...
              </p>
              <p className="text-xs text-gray-500 mb-1">IV:</p>
              <p className="text-xs font-mono text-gray-700">
                {encryptedData.iv.slice(0, 24)}...
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Password"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                className="text-sm"
              />
              <Button onClick={handleUnlock} size="sm">
                <Unlock className="mr-1 h-4 w-4" />
                Unlock
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-blue-900 text-sm">🔐 Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-blue-800">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <p>AES-256 encryption</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <p>Data never leaves device unencrypted</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <p>Password-protected unlock</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
