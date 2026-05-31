import { useState } from 'react'
import './AddAccountScreen.css'

const POPULAR_BANKS = [
  {
    id: 'chase',
    name: 'Chase',
    background: '#117ACA',
    color: '#FFFFFF',
    border: 'transparent',
  },
  {
    id: 'capital-one',
    name: 'Capital One',
    background: '#004977',
    color: '#FFFFFF',
    border: 'transparent',
  },
  {
    id: 'bank-of-america',
    name: 'Bank of America',
    background: '#E31837',
    color: '#FFFFFF',
    border: 'transparent',
  },
  {
    id: 'wells-fargo',
    name: 'Wells Fargo',
    background: '#CC0000',
    color: '#FFFFFF',
    border: 'transparent',
  },
  {
    id: 'citi',
    name: 'Citi',
    background: '#003B70',
    color: '#FFFFFF',
    border: 'transparent',
  },
  {
    id: 'discover',
    name: 'Discover',
    background: '#F0F0F0',
    color: '#1A1A1A',
    border: 'color-mix(in srgb, var(--color-text-secondary) 20%, transparent)',
  },
  {
    id: 'ally',
    name: 'Ally',
    background: '#6D1F7A',
    color: '#FFFFFF',
    border: 'transparent',
  },
  {
    id: 'apple',
    name: 'Apple',
    background: '#F5F5F5',
    color: '#1A1A1A',
    border: 'color-mix(in srgb, var(--color-text-secondary) 20%, transparent)',
  },
]

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AddAccountScreen({ onNavigate, showToast }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBanks = POPULAR_BANKS.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  )

  function handleBankSelect() {
    showToast?.('Account connected!')
    onNavigate?.('accounts')
  }

  return (
    <div className="add-account-screen">
      <div className="add-account-content">
        <header className="add-account-header">
          <h1 className="add-account-title">Add Accounts</h1>
          <button
            type="button"
            className="add-account-close"
            aria-label="Close add account"
            onClick={() => onNavigate?.('accounts')}
          >
            <CloseIcon />
          </button>
        </header>

        <section className="add-account-search-section" aria-label="Search banks">
          <label className="add-account-search-label" htmlFor="bank-search">
            Search for your bank
          </label>
          <input
            id="bank-search"
            type="search"
            className="add-account-search-input"
            placeholder="Search banks..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <p className="add-account-search-help">
            Search by institution name or web address (URL)
          </p>
        </section>

        <section className="popular-options-section" aria-label="Popular bank options">
          <h2 className="popular-options-heading">Popular Options</h2>
          <div className="popular-banks-grid">
            {filteredBanks.map((bank) => (
              <button
                key={bank.id}
                type="button"
                className="popular-bank-button"
                style={{
                  '--bank-background': bank.background,
                  '--bank-color': bank.color,
                  '--bank-border': bank.border,
                }}
                onClick={handleBankSelect}
              >
                {bank.name}
              </button>
            ))}
          </div>
        </section>

        <div className="add-account-divider" aria-hidden="true">
          <span className="add-account-divider-line" />
          <span className="add-account-divider-text">or</span>
          <span className="add-account-divider-line" />
        </div>

        <button type="button" className="unlinked-account-button">
          Add an Unlinked Account
        </button>
      </div>
    </div>
  )
}

export default AddAccountScreen
