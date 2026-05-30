import { useEffect, useState } from 'react'
import './BudgetsScreen.css'

const PRESET_LIMITS = [100, 150, 200, 250]

const CATEGORY_CONFIG = [
  { id: 'food', name: 'Food & Dining', emoji: '🥪', defaultLimit: 150, defaultSpent: 96 },
  { id: 'groceries', name: 'Groceries', emoji: '🛒', defaultLimit: 200, defaultSpent: 142 },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎟️', defaultLimit: 80, defaultSpent: 58 },
  { id: 'transport', name: 'Transport', emoji: '🚗', defaultLimit: 60, defaultSpent: 34 },
  { id: 'subscriptions', name: 'Subscriptions', emoji: '🎧', defaultLimit: 30, defaultSpent: 23 },
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

function getCategoryBudget(categoryName, appData) {
  const config = CATEGORY_CONFIG.find((item) => item.name === categoryName)
  const fromApp = appData?.categories?.find(
    (item) => item.id === config?.id || item.name === categoryName,
  )

  const limit = fromApp?.limit ?? config?.defaultLimit ?? 150
  const spent = fromApp?.spent ?? config?.defaultSpent ?? 0
  const percent = Math.round((spent / limit) * 100)
  const remaining = limit - spent
  const status = percent >= 70 ? 'Getting close' : 'Plenty of room'

  return {
    limit,
    spent,
    percent,
    remaining,
    subtext: `${status} · $${remaining.toFixed(2)} left`,
    emoji: fromApp?.emoji ?? config?.emoji ?? '💳',
  }
}

function BudgetsScreen({
  onNavigate,
  appData,
  budgetCategory,
  onBudgetCategoryChange,
  showToast,
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    budgetCategory ?? 'Food & Dining',
  )
  const [selectedPreset, setSelectedPreset] = useState(150)

  const categoryBudget = getCategoryBudget(selectedCategory, appData)

  useEffect(() => {
    if (!budgetCategory) {
      return
    }

    const budget = getCategoryBudget(budgetCategory, appData)
    setSelectedCategory(budgetCategory)
    setSelectedPreset(budget.limit)
  }, [budgetCategory, appData])

  function handleCategorySelect(categoryName) {
    const budget = getCategoryBudget(categoryName, appData)
    setSelectedCategory(categoryName)
    setSelectedPreset(budget.limit)
    onBudgetCategoryChange?.(categoryName)
  }

  function handleSaveBudget() {
    showToast?.('Budget saved!')
  }

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
            {CATEGORY_CONFIG.map((category) => (
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
                onClick={() => handleCategorySelect(category.name)}
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
            <p className="spent-card-percent">{categoryBudget.percent}%</p>
          </div>
          <div className="spent-amount-row">
            <span className="spent-amount">${categoryBudget.spent}</span>
            <span className="spent-limit">of ${categoryBudget.limit}</span>
          </div>
          <div
            className="spent-progress"
            role="progressbar"
            aria-valuenow={categoryBudget.spent}
            aria-valuemin={0}
            aria-valuemax={categoryBudget.limit}
            aria-label="Monthly spending progress"
          >
            <div
              className="spent-progress-fill"
              style={{ '--progress-fill': `${categoryBudget.percent}%` }}
            />
          </div>
          <p className="spent-subtext">{categoryBudget.subtext}</p>
        </section>
      </div>

      <div className="budgets-footer">
        <button type="button" className="save-budget-button" onClick={handleSaveBudget}>
          Save budget
        </button>
      </div>
    </div>
  )
}

export default BudgetsScreen
