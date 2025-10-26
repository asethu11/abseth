import Link from 'next/link';
import { useState } from 'react';
import styles from './PromptCard.module.css';

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  compatibleModels: string[];
  featured?: boolean;
  fullPrompt?: string;
}

interface PromptCardProps {
  prompt: Prompt;
  variant?: 'default' | 'featured' | 'compact';
}

export default function PromptCard({ prompt, variant = 'default' }: PromptCardProps) {
  const [isCopied, setIsCopied] = useState(false);


  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (prompt.fullPrompt) {
        await navigator.clipboard.writeText(prompt.fullPrompt);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = prompt.fullPrompt || '';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className={`${styles.promptCard} ${styles[`promptCard--${variant}`]}`}>
      <Link href={`/prompts/${prompt.id}`} className={styles.promptCardLink}>
        <div className={styles.promptCardTag}>
          {prompt.category}
        </div>

        <h3 className={styles.promptCardTitle}>
          {prompt.title}
        </h3>
        
        <p className={styles.promptCardDescription}>
          {prompt.description}
        </p>

        <div className={styles.promptCardModels}>
          {prompt.compatibleModels.map((model) => (
            <span key={model} className={styles.promptCardModel}>
              {model}
            </span>
          ))}
        </div>

        <div className={styles.promptCardHoverOverlay}>
          <div className={styles.promptCardHoverContent}>
            <div className={styles.promptCardPromptPreview}>
              <p className={styles.promptCardPromptText}>
                {prompt.fullPrompt ? prompt.fullPrompt : 'No prompt preview available'}
              </p>
            </div>
            <div className={styles.promptCardButtons}>
              <button 
                className={styles.promptCardCopyBtn}
                onClick={handleCopyPrompt}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                {isCopied ? 'Copied' : 'Copy'}
              </button>
              <button 
                className={styles.promptCardViewBtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/prompts/${prompt.id}`;
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
                Open
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
