import { useState } from 'react'
import './SpendingScreen.css'

const SEGMENTS = ['Week', 'Month', 'Term']

const PERIOD_VIEWS = {
  Week: {
    summaryLabel: 'Spent this week',
    dateRange: 'Mon – Fri',
    bars: [
      { id: 'mon', label: 'Mon', height: '32%', current: false },
      { id: 'tue', label: 'Tue', height: '48%', current: false },
      { id: 'wed', label: 'Wed', height: '41%', current: false },
      { id: 'thu', label: 'Thu', height: '67%', current: false },
      { id: 'fri', label: 'Fri', height: '100%', current: true },
    ],
    categories: [
      { id: 'groceries', emoji: '🛒', name: 'Groceries', spent: 38, limit: 50 },
      { id: 'food', emoji: '🥪', name: 'Food & Dining', spent: 28, limit: 38 },
      { id: 'entertainment', emoji: '🎟️', name: 'Entertainment', spent: 18, limit: 20 },
      { id: 'transport', emoji: '🚗', name: 'Transport', spent: 10, limit: 12 },
      { id: 'subscriptions', emoji: '🎧', name: 'Subscriptions', spent: 8, limit: 10 },
    ],
    getTotals: (appData) => ({
      spent: appData?.weeklySpent ?? 102,
      budget: appData?.weeklyLimit ?? 175,
    }),
  },
  Month: {
    summaryLabel: 'Spent in May',
    dateRange: 'May 1 – May 18',
    bars: [
      { id: 'w1', label: 'W1', height: '42%', current: false },
      { id: 'w2', label: 'W2', height: '58%', current: false },
      { id: 'w3', label: 'W3', height: '50%', current: false },
      { id: 'this', label: 'This', height: '100%', current: true },
    ],
    getTotals: (appData) => {
      const categories = appData?.categories ?? MONTH_FALLBACK_CATEGORIES
      return {
        spent: categories.reduce((total, category) => total + category.spent, 0),
        budget: categories.reduce((total, category) => total + category.limit, 0),
      }
    },
    getCategories: (appData) =>
      (appData?.categories ?? MONTH_FALLBACK_CATEGORIES).map((category) => ({
        id: category.id,
        emoji: category.emoji,
        name: category.name,
        spent: category.spent,
        limit: category.limit,
      })),
  },
  Term: {
    summaryLabel: 'Spent this term',
    dateRange: 'Jan – May',
    bars: [
      { id: 'm1', label: 'Month 1', height: '38%', current: false },
      { id: 'm2', label: 'Month 2', height: '62%', current: false },
      { id: 'm3', label: 'Month 3', height: '54%', current: false },
      { id: 'this', label: 'This', height: '100%', current: true },
    ],
    categories: [
      { id: 'groceries', emoji: '🛒', name: 'Groceries', spent: 380, limit: 600 },
      { id: 'food', emoji: '🥪', name: 'Food & Dining', spent: 290, limit: 450 },
      { id: 'entertainment', emoji: '🎟️', name: 'Entertainment', spent: 142, limit: 240 },
      { id: 'transport', emoji: '🚗', name: 'Transport', spent: 89, limit: 180 },
      { id: 'subscriptions', emoji: '🎧', name: 'Subscriptions', spent: 69, limit: 90 },
    ],
    getTotals: () => ({
      spent: 1847,
      budget: 3200,
    }),
  },
}

const MONTH_FALLBACK_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', emoji: '🥪', spent: 96, limit: 150 },
  { id: 'groceries', name: 'Groceries', emoji: '🛒', spent: 142, limit: 200 },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎟️', spent: 58, limit: 80 },
  { id: 'transport', name: 'Transport', emoji: '🚗', spent: 34, limit: 60 },
  { id: 'subscriptions', name: 'Subscriptions', emoji: '🎧', spent: 23, limit: 30 },
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

function formatCurrency(amount) {
  return amount.toLocaleString('en-US')
}

function SpendingScreen({ onNavigate, appData }) {
  const [activeSegment, setActiveSegment] = useState('Month')

  const view = PERIOD_VIEWS[activeSegment]
  const { spent, budget } = view.getTotals(appData)
  const categories =
    view.getCategories?.(appData) ?? view.categories

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

      <section className="summary-card" aria-label={`${activeSegment} spending summary`}>
        <p className="summary-label">{view.summaryLabel}</p>
        <div className="summary-amount-row">
          <span className="summary-amount">${formatCurrency(spent)}</span>
          <span className="summary-budget">of ${formatCurrency(budget)} budget</span>
        </div>

        <div key={activeSegment} className="bar-chart" aria-hidden="true">
          {view.bars.map((bar, index) => (
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
          <p className="category-section-date">{view.dateRange}</p>
        </div>

        <div key={activeSegment} className="category-list">
          {categories.map((category) => {
            const progress = (category.spent / category.limit) * 100
            const warning = progress >= 70

            return (
              <div key={category.id} className="category-row">
                <div className="category-row-top">
                  <div className="category-row-icon" aria-hidden="true">
                    {category.emoji}
                  </div>
                  <p className="category-row-name">{category.name}</p>
                  <p className="category-row-amounts">
                    <span className="category-row-spent">
                      ${formatCurrency(category.spent)}
                    </span>
                    <span className="category-row-limit">
                      {' '}/ ${formatCurrency(category.limit)}
                    </span>
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
                      warning ? 'category-progress-fill--warning' : '',
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
