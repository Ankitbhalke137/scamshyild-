import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Newspaper, ExternalLink } from 'lucide-react';
import { getTranslation, Language } from '../lib/translations';
import { fraudNews, NewsArticle } from '../lib/newsData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface NewsScreenProps {
  language: Language;
}

export function NewsScreen({ language }: NewsScreenProps) {
  const [filter, setFilter] = useState<string>('all');
  const t = (key: string) => getTranslation(language, key);

  const filteredNews = filter === 'all' 
    ? fraudNews 
    : fraudNews.filter(news => news.category === filter);

  const getCategoryColor = (category: NewsArticle['category']) => {
    const colors = {
      phishing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      banking: 'bg-blue-100 text-blue-800 border-blue-200',
      'cyber-attack': 'bg-red-100 text-red-800 border-red-200',
      'data-breach': 'bg-purple-100 text-purple-800 border-purple-200',
      fraud: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[category];
  };

  const getCategoryLabel = (category: NewsArticle['category']) => {
    const labels = {
      phishing: 'Phishing',
      banking: 'Banking',
      'cyber-attack': 'Cyber Attack',
      'data-breach': 'Data Breach',
      fraud: 'Fraud',
    };
    return labels[category];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl">{t('fraudNews')}</h2>
            <p className="text-xs text-gray-500">Security alerts</p>
          </div>
        </div>
      </div>

      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="text-sm">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="phishing">Phishing</SelectItem>
          <SelectItem value="banking">Banking</SelectItem>
          <SelectItem value="fraud">Fraud</SelectItem>
          <SelectItem value="data-breach">Data Breach</SelectItem>
          <SelectItem value="cyber-attack">Cyber Attack</SelectItem>
        </SelectContent>
      </Select>

      <div className="space-y-3">
        {filteredNews.map((news) => (
          <Card key={news.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getCategoryColor(news.category)} text-xs`}>
                  {getCategoryLabel(news.category)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {news.region}
                </Badge>
              </div>
              <CardTitle className="text-sm leading-tight">
                {news.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs mb-3">
                {news.summary}
              </CardDescription>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div>
                  <span>{news.publisher}</span>
                  <span className="mx-1">•</span>
                  <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                </div>
                <button 
                  className="flex items-center gap-1 text-blue-600"
                  onClick={() => window.open(news.url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Newspaper className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No articles found.</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-orange-900 text-sm">⚠️ Stay Protected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-orange-800">
          <p>• Verify sender before sharing OTP</p>
          <p>• Banks never ask for passwords via SMS</p>
          <p>• Report suspicious activity immediately</p>
          <p>• Enable two-factor authentication</p>
        </CardContent>
      </Card>
    </div>
  );
}
