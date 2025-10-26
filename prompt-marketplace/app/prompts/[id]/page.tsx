'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import PromptCard from '@/components/PromptCard/PromptCard';
import ChatPanel from '@/components/ChatPanel/ChatPanel';
import styles from './page.module.css';
import promptsData from '@/data/prompts.json';

interface Prompt {
  id: string;
  title: string;
  description: string;
  fullPrompt: string;
  category: string;
  tags: string[];
  compatibleModels: string[];
  featured?: boolean;
  createdAt?: string;
}


interface PromptDetailPageProps {
  params: {
    id: string;
  };
}

export default function PromptDetailPage({ params }: PromptDetailPageProps) {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  
  const prompt = promptsData.find((p: Prompt) => p.id === params.id) as Prompt;

  if (!prompt) {
    notFound();
  }

  const relatedPrompts = promptsData
    .filter((p: Prompt) => p.category === prompt.category && p.id !== prompt.id)
    .slice(0, 3);

  const handleTestPrompt = () => {
    setIsChatPanelOpen(true);
  };

  const handleCloseChatPanel = () => {
    setIsChatPanelOpen(false);
  };

  return (
    <div className={styles.promptDetailPage}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/" className={styles.breadcrumbLink}>Browse</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href={`/?category=${prompt.category}`} className={styles.breadcrumbLink}>
            {prompt.category}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{prompt.title}</span>
        </nav>

        <div className={styles.content}>
          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Prompt Header */}
            <div className={styles.promptHeader}>
              <div className={styles.promptMeta}>
                <span className={styles.categoryBadge}>{prompt.category}</span>
                {prompt.featured && (
                  <span className={styles.featuredBadge}>
                    <svg className={styles.starIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Featured
                  </span>
                )}
              </div>
              
              <div className={styles.titleRow}>
                <h1 className={styles.promptTitle}>{prompt.title}</h1>
                <button 
                  onClick={handleTestPrompt}
                  className={styles.testButton}
                >
                  <svg className={styles.testIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Test
                </button>
              </div>
            </div>

            {/* Prompt Details Section */}
            <div className={styles.section}>
              <div className={styles.promptDetails}>
                <div className={styles.compatibleModels}>
                  {prompt.compatibleModels.map((model) => (
                    <span key={model} className={styles.modelTag}>
                      {model}
                    </span>
                  ))}
                </div>
                
                <div className={styles.tagsList}>
                  {prompt.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <p className={styles.description}>{prompt.description}</p>
              </div>
            </div>

            {/* Full Prompt */}
            <div className={styles.section}>
              <div className={styles.promptSectionHeader}>
                <h2 className={styles.sectionTitle}>Full Prompt</h2>
                <button 
                  className={styles.copyBtn} 
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(prompt.fullPrompt);
                      console.log('Prompt copied to clipboard!');
                    } catch (err) {
                      console.error('Failed to copy prompt:', err);
                      const textArea = document.createElement('textarea');
                      textArea.value = prompt.fullPrompt;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textArea);
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy Prompt
                </button>
              </div>
              <div className={styles.promptContent}>
                <pre className={styles.promptText}>{prompt.fullPrompt}</pre>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>

            {/* Related Prompts */}
            {relatedPrompts.length > 0 && (
              <div className={styles.relatedCard}>
                <h3 className={styles.relatedTitle}>Related Prompts</h3>
                <div className={styles.relatedPrompts}>
                  {relatedPrompts.map((relatedPrompt) => (
                    <PromptCard 
                      key={relatedPrompt.id} 
                      prompt={relatedPrompt} 
                      variant="compact" 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isChatPanelOpen}
        onClose={handleCloseChatPanel}
        promptTitle={prompt.title}
        promptText={prompt.fullPrompt}
      />
    </div>
  );
}
