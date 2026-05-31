import { useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import SpendingScreen from './screens/SpendingScreen.jsx'
import BudgetsScreen from './screens/BudgetsScreen.jsx'
import AssistantScreen from './screens/AssistantScreen.jsx'
import LogScreen from './screens/LogScreen.jsx'
import AccountsScreen from './screens/AccountsScreen.jsx'
import AddAccountScreen from './screens/AddAccountScreen.jsx'
import {
  AssistantIcon,
  BudgetsIcon,
  HomeIcon,
  SpendingIcon,
} from './icons.jsx'

const TAB_ICONS = {
  home: HomeIcon,
  spending: SpendingIcon,
  budgets: BudgetsIcon,
  assistant: AssistantIcon,
}

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'spending', label: 'Spending' },
  { id: 'log', label: 'Log', fab: true },
  { id: 'budgets', label: 'Budgets' },
  { id: 'assistant', label: 'Assistant' },
]

const SCREENS = {
  home: HomeScreen,
  spending: SpendingScreen,
  log: LogScreen,
  budgets: BudgetsScreen,
  assistant: AssistantScreen,
}

const STACK_SCREENS = {
  accounts: AccountsScreen,
  'add-account': AddAccountScreen,
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
  const [stackScreen, setStackScreen] = useState(null)
  const [appData, setAppData] = useState(INITIAL_APP_DATA)
  const [budgetCategory, setBudgetCategory] = useState('Food & Dining')
  const [toast, setToast] = useState(null)
  const ActiveScreen = SCREENS[activeTab]
  const StackScreen = stackScreen ? STACK_SCREENS[stackScreen] : null
  const CurrentScreen = StackScreen ?? ActiveScreen

  function handleNavigate(tab, options = {}) {
    if (options.budgetCategory) {
      setBudgetCategory(options.budgetCategory)
    }

    if (tab === 'accounts' || tab === 'add-account') {
      setStackScreen(tab)
      return
    }

    setStackScreen(null)
    setActiveTab(tab)
  }

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => {
      setToast(null)
    }, 1500)
  }

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
        <div key={stackScreen ?? activeTab} className="screen-fade-in">
          {CurrentScreen ? (
            <CurrentScreen
              onNavigate={handleNavigate}
              appData={appData}
              addTransaction={addTransaction}
              budgetCategory={budgetCategory}
              onBudgetCategoryChange={setBudgetCategory}
              showToast={showToast}
            />
          ) : (
            <div className="placeholder-screen">
              {TABS.find((tab) => tab.id === activeTab)?.label ?? activeTab} screen
            </div>
          )}
        </div>
      </main>

      {toast ? (
        <div className="app-toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}

      <nav
        className={['tab-bar', stackScreen ? 'tab-bar--hidden' : '']
          .filter(Boolean)
          .join(' ')}
        aria-label="Main navigation"
        aria-hidden={stackScreen ? 'true' : undefined}
      >
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab.id]

          return (
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
            onClick={() => handleNavigate(tab.id)}
          >
            {tab.fab ? '+' : (
              <>
                <span className="tab-bar-icon" aria-hidden="true">
                  {Icon ? <Icon /> : null}
                </span>
                <span className="tab-bar-label">{tab.label}</span>
              </>
            )}
          </button>
          )
        })}
      </nav>
    </div>
  )
}

export default App
