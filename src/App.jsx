import { useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import SpendingScreen from './screens/SpendingScreen.jsx'
import BudgetsScreen from './screens/BudgetsScreen.jsx'
import AssistantScreen from './screens/AssistantScreen.jsx'
import LogScreen from './screens/LogScreen.jsx'

const TABS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'spending', label: 'Spending', icon: '📊' },
  { id: 'log', label: 'Log', fab: true },
  { id: 'budgets', label: 'Budgets', icon: '💳' },
  { id: 'assistant', label: 'Assistant', icon: '✨' },
]

const SCREENS = {
  home: HomeScreen,
  spending: SpendingScreen,
  log: LogScreen,
  budgets: BudgetsScreen,
  assistant: AssistantScreen,
}

const INITIAL_APP_DATA = {
  balance: 842.50,
  weeklySpent: 102,
  weeklyLimit: 175,
  categories: [
    { id: 'food', name: 'Food & Dining', emoji: '🥪', spent: 96, limit: 150 },
    { id: 'groceries', name: 'Groceries', emoji: '🛒', spent: 142, limit: 200 },
    { id: 'entertainment', name: 'Entertainment', emoji: '🎟️', spent: 58, limit: 80 },
    { id: 'transport', name: 'Transport', emoji: '🚗', spent: 34, limit: 60 },
    { id: 'subscriptions', name: 'Subscriptions', emoji: '🎧', spent: 23, limit: 30 },
  ],
  transactions: [
    { id: 1, name: 'Campus job deposit', amount: 312.40, type: 'income', category: 'Income', date: 'Today' },
    { id: 2, name: 'Trader Joe\'s', amount: -28.40, type: 'expense', category: 'Groceries', date: 'Today' },
    { id: 3, name: 'Blue Bottle Coffee', amount: -5.75, type: 'expense', category: 'Food & Dining', date: 'Yesterday' },
  ],
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [appData, setAppData] = useState(INITIAL_APP_DATA)
  const ActiveScreen = SCREENS[activeTab]

  function addTransaction(transaction) {
    const expenseAmount = Math.abs(transaction.amount)
    const signedAmount = transaction.type === 'income'
      ? expenseAmount
      : -expenseAmount

    setAppData((prev) => {
      const nextAppData = {
        ...prev,
        balance: prev.balance + signedAmount,
        transactions: [
          ...prev.transactions,
          {
            ...transaction,
            id: prev.transactions.length
              ? Math.max(...prev.transactions.map((item) => item.id)) + 1
              : 1,
            amount: signedAmount,
          },
        ],
        weeklySpent:
          transaction.type === 'expense'
            ? prev.weeklySpent + expenseAmount
            : prev.weeklySpent,
        categories: prev.categories.map((category) => {
          const matchesCategory =
            category.id === transaction.categoryId ||
            category.id === transaction.category ||
            category.name === transaction.category

          if (!matchesCategory || transaction.type !== 'expense') {
            return category
          }

          return {
            ...category,
            spent: category.spent + expenseAmount,
          }
        }),
      }

      return nextAppData
    })
  }

  return (
    <div className="app">
      <main className="app-main">
        <div key={activeTab} className="screen-fade-in">
          {ActiveScreen ? (
            <ActiveScreen
              onNavigate={setActiveTab}
              appData={appData}
              addTransaction={addTransaction}
            />
          ) : (
            <div className="placeholder-screen">
              {TABS.find((tab) => tab.id === activeTab)?.label ?? activeTab} screen
            </div>
          )}
        </div>
      </main>

      <nav className="tab-bar" aria-label="Main navigation">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={[
              'tab-bar-item',
              tab.fab ? 'tab-bar-item--fab' : '',
              activeTab === tab.id ? 'is-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            aria-label={tab.label}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.fab ? '+' : (
              <>
                <span className="tab-bar-icon" aria-hidden="true">
                  {tab.icon}
                </span>
                <span className="tab-bar-label">{tab.label}</span>
              </>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
