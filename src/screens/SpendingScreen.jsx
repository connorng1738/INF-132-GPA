import { useState } from 'react'
import './SpendingScreen.css'

const SEGMENTS = ['Week', 'Month', 'Term']

const CHART_BARS = [
  { id: 'w1', label: 'W1', height: '42%', current: false },
  { id: 'w2', label: 'W2', height: '58%', current: false },
  { id: 'w3', label: 'W3', height: '50%', current: false },
  { id: 'this', label: 'This', height: '100%', current: true },
]

const CATEGORIES = [
  {
    id: 'groceries',
    emoji: '🛒',
    name: 'Groceries',
    spent: 142,
    limit: 200,
    warning: false,
  },
  {
    id: 'food-dining',
    emoji: '🥪',
    name: 'Food & Dining',
    spent: 96,
    limit: 150,
    warning: false,
  },
  {
    id: 'entertainment',
    emoji: '🎟️',
    name: 'Entertainment',
    spent: 58,
    limit: 80,
    warning: true,
  },
  {
    id: 'transport',
    emoji: '🚗',
    name: 'Transport',
    spent: 34,
    limit: 60,
    warning: false,
  },
  {
    id: 'subscriptions',
    emoji: '🎧',
    name: 'Subscriptions',
    spent: 23,
    limit: 30,
    warning: false,
  },
]

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SpendingScreen({ onNavigate, appData, addTransaction }) {
  const [activeSegment, setActiveSegment] = useState('Month')

  const categories = appData?.categories ?? CATEGORIES
  const monthlySpent = categories.reduce((total, category) => total + category.spent, 0)
  const monthlyBudget = categories.reduce((total, category) => total + category.limit, 0)

  return (
    <div className="spending-screen">
      <header className="spending-header">
        <button
          type="button"
          className="spending-back"
          aria-label="Go back to Home"
          onClick={() => onNavigate?.('home')}
        >
          <BackArrowIcon />
        </button>
        <h1 className="spending-title">Spending</h1>
      </header>

      <div className="segmented-control" role="tablist" aria-label="Spending period">
        {SEGMENTS.map((segment) => (
          <button
            key={segment}
            type="button"
            role="tab"
            aria-selected={activeSegment === segment}
            className={[
              'segmented-control-option',
              activeSegment === segment ? 'is-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActiveSegment(segment)}
          >
            {segment}
          </button>
        ))}
      </div>

      <section className="summary-card" aria-label="Monthly spending summary">
        <p className="summary-label">Spent in May</p>
        <div className="summary-amount-row">
          <span className="summary-amount">${monthlySpent}</span>
          <span className="summary-budget">of ${monthlyBudget} budget</span>
        </div>

        <div className="bar-chart" aria-hidden="true">
          {CHART_BARS.map((bar, index) => (
            <div key={bar.id} className="bar-chart-item">
              <div
                className={[
                  'bar-chart-bar',
                  bar.current ? 'bar-chart-bar--current' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  '--bar-height': bar.height,
                  '--bar-delay': `${index * 100}ms`,
                }}
              />
              <p className="bar-chart-label">{bar.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Spending by category">
        <div className="category-section-header">
          <h2 className="category-section-title">By category</h2>
          <p className="category-section-date">May 1 – May 18</p>
        </div>

        <div className="category-list">
          {categories.map((category) => {
            const progress = (category.spent / category.limit) * 100
            const warning = progress >= 70 && category.id !== 'transport'

            return (
              <div key={category.id} className="category-row">
                <div className="category-row-top">
                  <div className="category-row-icon" aria-hidden="true">
                    {category.emoji}
                  </div>
                  <p className="category-row-name">{category.name}</p>
                  <p className="category-row-amounts">
                    <span className="category-row-spent">${category.spent}</span>
                    <span className="category-row-limit"> / ${category.limit}</span>
                  </p>
                </div>
                <div
                  className="category-progress"
                  role="progressbar"
                  aria-valuenow={category.spent}
                  aria-valuemin={0}
                  aria-valuemax={category.limit}
                  aria-label={`${category.name} spending`}
                >
                  <div
                    className={[
                      'category-progress-fill',
                      warning || category.id === 'entertainment'
                        ? 'category-progress-fill--warning'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{ '--progress-fill': `${progress}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default SpendingScreen
