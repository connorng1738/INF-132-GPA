import './HomeScreen.css'

const WEEKLY_BUDGET_TOTAL = 175
const WEEKLY_BUDGET_REMAINING = 73
const WEEKLY_BUDGET_PROGRESS =
  ((WEEKLY_BUDGET_TOTAL - WEEKLY_BUDGET_REMAINING) / WEEKLY_BUDGET_TOTAL) * 100

const QUICK_ACTION_TABS = {
  log: 'log',
  spending: 'spending',
  budgets: 'budgets',
  'ask-ai': 'assistant',
}

const QUICK_ACTIONS = [
  { id: 'log', label: 'Log', primary: true },
  { id: 'spending', label: 'Spending' },
  { id: 'budgets', label: 'Budgets' },
  { id: 'ask-ai', label: 'Ask AI' },
]

const UPCOMING_BILLS = [
  {
    id: 'rent',
    emoji: '🏠',
    title: 'Rent — shared apt',
    subtitle: 'Due in 6 days',
    amount: '$685.00',
  },
  {
    id: 'phone',
    emoji: '📱',
    title: 'Phone (Mint)',
    subtitle: 'Due in 9 days',
    amount: '$15.00',
  },
  {
    id: 'utilities',
    emoji: '💡',
    title: 'Utilities split',
    subtitle: 'Due in 12 days',
    amount: '$47.00',
  },
]

function splitBalance(balance) {
  const [dollars, cents] = balance.toFixed(2).split('.')
  return { dollars, cents }
}

function getTransactionEmoji(transaction, categories) {
  if (transaction.type === 'income') {
    return '↗'
  }

  const category = categories.find(
    (item) =>
      item.id === transaction.categoryId ||
      item.name === transaction.category,
  )

  return category?.emoji ?? '💳'
}

function formatTransactionAmount(transaction) {
  const value = Math.abs(transaction.amount).toFixed(2)
  return transaction.type === 'income' ? `+$${value}` : `-$${value}`
}

function buildRecentActivity(transactions, categories) {
  return [...transactions]
    .reverse()
    .slice(0, 5)
    .map((transaction) => ({
      id: transaction.id,
      emoji: getTransactionEmoji(transaction, categories),
      title: transaction.name,
      subtitle: `${transaction.date} · ${transaction.category}`,
      amount: formatTransactionAmount(transaction),
      positive: transaction.type === 'income',
    }))
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PieChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9H12V3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="6"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3 10h18"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="12"
        width="7"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="16.5" cy="15" r="1" fill="currentColor" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4L12 2Z"
        fill="currentColor"
      />
      <path
        d="M19 13l.9 2.7L22.5 17l-2.6.8L19 20.5l-.9-2.7L15.5 17l2.6-.8L19 13Z"
        fill="currentColor"
      />
    </svg>
  )
}

function QuickActionIcon({ id }) {
  const iconClass = 'quick-action-icon'

  if (id === 'log') {
    return (
      <span className={iconClass}>
        <PlusIcon />
      </span>
    )
  }

  if (id === 'spending') {
    return (
      <span className={iconClass}>
        <PieChartIcon />
      </span>
    )
  }

  if (id === 'budgets') {
    return (
      <span className={iconClass}>
        <WalletIcon />
      </span>
    )
  }

  return (
    <span className={iconClass}>
      <SparkleIcon />
    </span>
  )
}

function ListCard({ items }) {
  return (
    <div className="list-card">
      {items.map((item) => (
        <div key={item.id} className="list-row">
          <div className="list-row-icon" aria-hidden="true">
            {item.emoji}
          </div>
          <div className="list-row-content">
            <p className="list-row-title">{item.title}</p>
            <p className="list-row-subtitle">{item.subtitle}</p>
          </div>
          <p
            className={[
              'list-row-amount',
              item.positive ? 'list-row-amount--positive' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {item.amount}
          </p>
        </div>
      ))}
    </div>
  )
}

function HomeScreen({ onNavigate, appData }) {
  const balance = appData?.balance ?? 0
  const { dollars, cents } = splitBalance(balance)
  const recentActivity = buildRecentActivity(
    appData?.transactions ?? [],
    appData?.categories ?? [],
  )

  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="home-header-text">
          <p className="home-date">Monday · May 18</p>
          <h1 className="home-greeting">Hi, Maya</h1>
        </div>
        <div className="home-avatar" aria-label="Maya profile">
          M
        </div>
      </header>

      <section className="balance-card" aria-label="Available balance">
        <p className="balance-label">Available balance</p>
        <div className="balance-amount" aria-label={`$${balance.toFixed(2)}`}>
          <span className="balance-currency">$</span>
          <span className="balance-dollars">{dollars}</span>
          <span className="balance-cents">.{cents}</span>
        </div>
        <p className="balance-subtext">
          <span className="balance-subtext-arrow" aria-hidden="true">
            ↗
          </span>
          +$312.40 from campus job today
        </p>
      </section>

      <section className="weekly-budget-card" aria-label="Weekly budget">
        <div className="weekly-budget-row">
          <p className="weekly-budget-label">This week</p>
          <p className="weekly-budget-reset">Resets Sunday</p>
        </div>

        <div className="weekly-budget-row">
          <div className="weekly-budget-amounts">
            <span className="weekly-budget-remaining">${WEEKLY_BUDGET_REMAINING}</span>
            <span className="weekly-budget-total">left of ${WEEKLY_BUDGET_TOTAL}</span>
          </div>
          <p className="weekly-budget-status">On track</p>
        </div>

        <div
          className="weekly-budget-progress"
          role="progressbar"
          aria-valuenow={WEEKLY_BUDGET_PROGRESS}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Weekly budget spent"
        >
          <div
            className="weekly-budget-progress-fill"
            style={{ '--progress-fill': `${WEEKLY_BUDGET_PROGRESS}%` }}
          />
        </div>
      </section>

      <section className="quick-actions" aria-label="Quick actions">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            className={[
              'quick-action',
              action.primary ? 'quick-action--primary' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onNavigate?.(QUICK_ACTION_TABS[action.id])}
          >
            <QuickActionIcon id={action.id} />
            {action.label}
          </button>
        ))}
      </section>

      <section aria-label="Upcoming bills">
        <div className="section-header">
          <h2 className="section-title">Upcoming bills</h2>
          <p className="section-total">$753.99 total</p>
        </div>
        <ListCard items={UPCOMING_BILLS} />
      </section>

      <section aria-label="Recent activity">
        <div className="section-header">
          <h2 className="section-title">Recent activity</h2>
        </div>
        <ListCard items={recentActivity} />
      </section>
    </div>
  )
}

export default HomeScreen
