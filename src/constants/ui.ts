export const UI = {
  MODAL: {
    MAX_HEIGHT: '90vh',
    MAX_WIDTH: '800px',
    PADDING: '1.5rem',
  },
  LAYOUT: {
    CONTENT_WIDTH: '1fr',
    SIDEBAR_WIDTH: '250px',
  },
  SCROLL: {
    MAX_HEIGHT: '40vh',
  },
} as const;

export const COLORS = {
  PRIMARY: '#0284c7',
  SECONDARY: '#64748b',
  DANGER: '#ef4444',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  BACKGROUND: {
    LIGHT: 'rgba(243, 244, 246, 0.5)',
    HOVER: 'rgba(243, 244, 246, 0.8)',
  },
} as const;
