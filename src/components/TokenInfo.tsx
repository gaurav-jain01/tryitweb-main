import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface TokenInfoData {
  iat: number;
  exp: number;
  sub?: string;
  iss?: string;
  aud?: string | string[];
  roles?: string[] | string;
  isValid: boolean;
  isExpiringSoon: boolean;
}

const TokenInfo: React.FC = () => {
  const { getTokenInfo, logout } = useAuth();
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const tokenInfo = getTokenInfo();

  if (!tokenInfo) {
    return null;
  }

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getTimeUntilExpiration = (): string => {
    const now = Date.now() / 1000;
    const timeLeft = tokenInfo.exp - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = Math.floor(timeLeft % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="bg-bg-secondary border border-border-color rounded-xl p-5 m-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-text-primary text-lg font-semibold m-0">
          JWT Token Info
        </h3>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="bg-accent-primary text-white border-none py-2 px-4 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-accent-secondary hover:-translate-y-0.5 hover:shadow-lg"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
          tokenInfo.isValid 
            ? 'bg-success text-white' 
            : 'bg-danger text-white'
        }`}>
          {tokenInfo.isValid ? 'Valid' : 'Invalid'}
        </span>
        {tokenInfo.isExpiringSoon && (
          <span className="bg-warning text-text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Expiring Soon
          </span>
        )}
      </div>

      {showDetails && (
        <div className="bg-bg-primary border border-border-color rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center py-2 border-b border-border-light last:border-b-0">
            <strong className="text-text-primary font-semibold text-sm">Issued At:</strong>
            <span className="text-text-secondary text-sm font-mono">{formatTime(tokenInfo.iat)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border-light last:border-b-0">
            <strong className="text-text-primary font-semibold text-sm">Expires At:</strong>
            <span className="text-text-secondary text-sm font-mono">{formatTime(tokenInfo.exp)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border-light last:border-b-0">
            <strong className="text-text-primary font-semibold text-sm">Time Until Expiration:</strong>
            <span className="text-text-secondary text-sm font-mono">{getTimeUntilExpiration()}</span>
          </div>
          {tokenInfo.sub && (
            <div className="flex justify-between items-center py-2 border-b border-border-light last:border-b-0">
              <strong className="text-text-primary font-semibold text-sm">Subject (User ID):</strong>
              <span className="text-text-secondary text-sm font-mono">{tokenInfo.sub}</span>
            </div>
          )}
          {tokenInfo.iss && (
            <div className="flex justify-between items-center py-2 border-b border-border-light last:border-b-0">
              <strong className="text-text-primary font-semibold text-sm">Issuer:</strong>
              <span className="text-text-secondary text-sm font-mono">{tokenInfo.iss}</span>
            </div>
          )}
          {tokenInfo.aud && (
            <div className="flex justify-between items-center py-2 border-b border-border-light last:border-b-0">
              <strong className="text-text-primary font-semibold text-sm">Audience:</strong>
              <span className="text-text-secondary text-sm font-mono">
                {Array.isArray(tokenInfo.aud) ? tokenInfo.aud.join(', ') : tokenInfo.aud}
              </span>
            </div>
          )}
          {tokenInfo.roles && (
            <div className="flex justify-between items-center py-2 border-b border-border-light last:border-b-0">
              <strong className="text-text-primary font-semibold text-sm">Roles:</strong>
              <span className="text-text-secondary text-sm font-mono">
                {Array.isArray(tokenInfo.roles) ? tokenInfo.roles.join(', ') : tokenInfo.roles}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center py-2 border-b border-border-light last:border-b-0">
            <strong className="text-text-primary font-semibold text-sm">Token Type:</strong>
            <span className="text-text-secondary text-sm font-mono">JWT</span>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button 
          onClick={logout} 
          className="bg-danger text-white border-none py-2.5 px-5 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TokenInfo; 