import { useState } from 'react'
import './LogScreen.css'

const CATEGORIES = [
  { id: 'food', label: 'Food', emoji: '🥪', name: 'Food & Dining' },
  { id: 'groceries', label: 'Groceries', emoji: '🛒', name: 'Groceries' },
  { id: 'transport', label: 'Transport', emoji: '🚗', name: 'Transport' },
  { id: 'entertainment', label: 'Fun', emoji: '🎟️', name: 'Entertainment' },
  { id: 'subscriptions', label: 'Subs', emoji: '🎧', name: 'Subscriptions' },
  { id: 'bills', label: 'Bills', emoji: '💡', name: 'Bills' },
]

const NUMPAD_KEYS = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '.', '0', 'backspace',
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

function BackspaceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 6h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4-4V10l4-4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14 10l-4 4M10 10l4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function formatAmount(rawAmount) {
  if (!rawAmount.includes('.')) {
    return `${rawAmount}.00`
  }

  const [whole, decimal = ''] = rawAmount.split('.')
  return `${whole}.${decimal.padEnd(2, '0').slice(0, 2)}`
}

function formatTodayDisplay() {
  const today = new Date()
  const formatted = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `Today, ${formatted}`
}

function getTodayLabel() {
  return 'Today'
}

function LogScreen({ onNavigate, appData, addTransaction }) {
  const [amount, setAmount] = useState('0')
  const [selectedCategory, setSelectedCategory] = useState('food')
  const [description, setDescription] = useState('Coffee & sandwich')
  const [note, setNote] = useState('')

  function handleNumpadKey(key) {
    if (key === 'backspace') {
      setAmount((prev) => {
        if (prev.length <= 1) {
          return '0'
        }

        const next = prev.slice(0, -1)
        return next === '' || next === '.' ? '0' : next
      })
      return
    }

    setAmount((prev) => {
      if (key === '.' && prev.includes('.')) {
        return prev
      }

      if (prev === '0' && key !== '.') {
        return key
      }

      if (prev.includes('.')) {
        const [, decimal = ''] = prev.split('.')
        if (decimal.length >= 2) {
          return prev
        }
      }

      return `${prev}${key}`
    })
  }

  function handleSaveExpense() {
    const numericAmount = parseFloat(amount)
    if (!numericAmount || numericAmount <= 0) {
      return
    }

    const category = CATEGORIES.find((item) => item.id === selectedCategory)

    addTransaction?.({
      name: description.trim() || category?.name || 'Expense',
      amount: numericAmount,
      type: 'expense',
      categoryId: selectedCategory,
      category: category?.name ?? 'Other',
      date: getTodayLabel(),
      note: note.trim() || undefined,
    })

    onNavigate?.('home')
  }

  return (
    <div className="log-screen">
      <div className="log-content">
        <header className="log-header">
          <button
            type="button"
            className="log-back"
            aria-label="Go back to Home"
            onClick={() => onNavigate?.('home')}
          >
            <BackArrowIcon />
          </button>
          <h1 className="log-title">Log Spending</h1>
        </header>

        <section className="log-amount-section" aria-label="Amount">
          <p className="log-amount-label">Amount</p>
          <div className="log-amount-display" aria-live="polite">
            <span className="log-amount-currency">$</span>
            <span className="log-amount-value">{formatAmount(amount)}</span>
          </div>
        </section>

        <section className="log-category-section" aria-label="Category">
          <p className="log-section-label">Category</p>
          <div className="log-category-chips" role="tablist" aria-label="Categories">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category.id}
                className={[
                  'log-category-card',
                  selectedCategory === category.id ? 'log-category-card--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="log-category-emoji" aria-hidden="true">
                  {category.emoji}
                </span>
                <span className="log-category-label">{category.label}</span>
              </button>
            ))}
          </div>
        </section>

        <input
          type="text"
          className="log-input"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          aria-label="Description"
        />

        <div className="log-input log-input--date">
          <span className="log-input-icon" aria-hidden="true">
            📅
          </span>
          <span>{formatTodayDisplay()}</span>
        </div>

        <input
          type="text"
          className="log-input"
          placeholder="Note (optional) — e.g. between class"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          aria-label="Note (optional)"
        />

        <div className="log-numpad" aria-label="Number pad">
          {NUMPAD_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={[
                'log-numpad-key',
                key === 'backspace' ? 'log-numpad-key--action' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={key === 'backspace' ? 'Backspace' : key}
              onClick={() => handleNumpadKey(key)}
            >
              {key === 'backspace' ? <BackspaceIcon /> : key}
            </button>
          ))}
        </div>
      </div>

      <div className="log-footer">
        <button type="button" className="log-submit" onClick={handleSaveExpense}>
          Save expense
        </button>
      </div>
    </div>
  )
}

export default LogScreen
