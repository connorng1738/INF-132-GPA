import { useState } from 'react'
import './BudgetsScreen.css'

const CATEGORIES = [
  { name: 'Food & Dining', emoji: '🌮' },
  { name: 'Groceries', emoji: '🛒' },
  { name: 'Entertainment', emoji: '🎟️' },
  { name: 'Transport', emoji: '🚗' },
  { name: 'Subscriptions', emoji: '🎧' },
]

const PRESET_LIMITS = [100, 150, 200, 250]

const MONTHLY_LIMIT = 150
const SPENT = 96
const SPENT_PERCENT = Math.round((SPENT / MONTHLY_LIMIT) * 100)
const REMAINING = MONTHLY_LIMIT - SPENT

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

function BudgetsScreen({ onNavigate, appData, addTransaction }) {
  const [selectedCategory, setSelectedCategory] = useState('Food & Dining')
  const [selectedPreset, setSelectedPreset] = useState(150)

  return (
    <div className="budgets-screen">
      <div className="budgets-content">
        <header className="budgets-header">
          <button
            type="button"
            className="budgets-back"
            aria-label="Go back to Home"
            onClick={() => onNavigate?.('home')}
          >
            <BackArrowIcon />
          </button>
          <h1 className="budgets-title">Monthly budget</h1>
        </header>

        <section className="budgets-category-section" aria-label="Budget category">
          <p className="budgets-section-label">Category</p>
          <div className="category-chips" role="tablist" aria-label="Categories">
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category.name}
                className={[
                  'chip',
                  selectedCategory === category.name ? 'chip--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="chip-emoji" aria-hidden="true">
                  {category.emoji}
                </span>
                {category.name}
              </button>
            ))}
          </div>
        </section>

        <section className="limit-card" aria-label="Monthly limit">
          <p className="limit-label">Monthly limit</p>
          <div className="limit-amount-row">
            <span className="limit-amount">${selectedPreset}</span>
            <span className="limit-period">/ month</span>
          </div>
          <div className="preset-chips" role="group" aria-label="Preset limits">
            {PRESET_LIMITS.map((amount) => (
              <button
                key={amount}
                type="button"
                className={[
                  'preset-chip',
                  selectedPreset === amount ? 'preset-chip--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-pressed={selectedPreset === amount}
                onClick={() => setSelectedPreset(amount)}
              >
                ${amount}
              </button>
            ))}
          </div>
        </section>

        <section className="spent-card" aria-label="Spent this month">
          <div className="spent-card-top">
            <p className="spent-card-label">Spent this month</p>
            <p className="spent-card-percent">{SPENT_PERCENT}%</p>
          </div>
          <div className="spent-amount-row">
            <span className="spent-amount">${SPENT}</span>
            <span className="spent-limit">of ${MONTHLY_LIMIT}</span>
          </div>
          <div
            className="spent-progress"
            role="progressbar"
            aria-valuenow={SPENT}
            aria-valuemin={0}
            aria-valuemax={MONTHLY_LIMIT}
            aria-label="Monthly spending progress"
          >
            <div
              className="spent-progress-fill"
              style={{ '--progress-fill': `${SPENT_PERCENT}%` }}
            />
          </div>
          <p className="spent-subtext">
            Plenty of room · ${REMAINING.toFixed(2)} left
          </p>
        </section>
      </div>

      <div className="budgets-footer">
        <button type="button" className="save-budget-button">
          Save budget
        </button>
      </div>
    </div>
  )
}

export default BudgetsScreen
