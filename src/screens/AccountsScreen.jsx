import './AccountsScreen.css'

const ACCOUNTS = [
  {
    id: 'chase-checking',
    bankName: 'Chase',
    accountType: 'Checking',
    lastFour: '4821',
    balance: 612.5,
    accentColor: '#117ACA',
  },
  {
    id: 'campus-savings',
    bankName: 'Campus Job',
    accountType: 'Savings',
    lastFour: '2290',
    balance: 230.0,
    accentColor: '#2D4A3E',
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

function formatBalance(amount) {
  return `$${amount.toFixed(2)}`
}

function AccountCard({ account }) {
  return (
    <article
      className="account-card"
      style={{ '--account-accent': account.accentColor }}
    >
      <div className="account-card-body">
        <div className="account-card-top">
          <p className="account-bank-name">{account.bankName}</p>
          <p className="account-balance">{formatBalance(account.balance)}</p>
        </div>
        <p className="account-meta">
          {account.accountType} ••{account.lastFour}
        </p>
      </div>
    </article>
  )
}

function AccountsScreen({ onNavigate, appData }) {
  const netWorth = appData?.balance ?? 842.5
  const [dollars, cents] = netWorth.toFixed(2).split('.')

  return (
    <div className="accounts-screen">
      <div className="accounts-content">
        <header className="accounts-header">
          <button
            type="button"
            className="accounts-back"
            aria-label="Go back to Home"
            onClick={() => onNavigate?.('home')}
          >
            <BackArrowIcon />
          </button>
          <h1 className="accounts-title">Accounts</h1>
        </header>

        <section className="net-worth-section" aria-label="Net worth">
          <p className="net-worth-label">Net worth</p>
          <div className="net-worth-amount" aria-label={`Net worth $${netWorth.toFixed(2)}`}>
            <span className="net-worth-currency">$</span>
            <span className="net-worth-dollars">{dollars}</span>
            <span className="net-worth-cents">.{cents}</span>
          </div>
        </section>

        <section className="accounts-list-section" aria-label="Connected accounts">
          <div className="accounts-list">
            {ACCOUNTS.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </section>
      </div>

      <div className="accounts-footer">
        <button
          type="button"
          className="add-account-button"
          onClick={() => onNavigate?.('add-account')}
        >
          + Add Account
        </button>
      </div>
    </div>
  )
}

export default AccountsScreen
