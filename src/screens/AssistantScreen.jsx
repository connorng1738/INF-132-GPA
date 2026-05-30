import { useEffect, useRef, useState } from 'react'
import './AssistantScreen.css'

const TYPING_DELAY_MS = 1500

const INITIAL_USER_MESSAGE =
  'Can I afford a $120 concert ticket this weekend?'

const BUDGET_ROWS = [
  { label: 'Weekly budget left', value: '$73', negative: false },
  { label: 'Concert ticket', value: '−$120', negative: true },
  { label: 'After purchase', value: '−$47', negative: true },
]

const CONTEXT_ROWS = [
  { label: 'Entertainment this month', value: '$58 of $80', negative: false },
  { label: 'Upcoming bills (next 14d)', value: '$1042', negative: false },
  { label: 'Available after bills', value: '$-200', negative: false },
]

function isConcertAffordabilityQuery(text) {
  const normalized = text.toLowerCase().trim()

  if (normalized.includes('concert ticket')) {
    return true
  }

  if (normalized.includes('$120 concert')) {
    return true
  }

  if (normalized.includes('can i afford') && normalized.includes('concert')) {
    return true
  }

  if (normalized.includes('$120') && normalized.includes('concert')) {
    return true
  }

  if (
    normalized.includes('concert') &&
    (normalized.includes('afford') || normalized.includes('ticket'))
  ) {
    return true
  }

  return false
}

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

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4L12 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12l16-7-7 16-2-7-7-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DataRow({ label, value, negative }) {
  return (
    <div className="data-row">
      <p className="data-row-label">{label}</p>
      <p
        className={[
          'data-row-value',
          negative ? 'data-row-value--negative' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </p>
    </div>
  )
}

function ConcertResponseCard() {
  return (
    <article className="ai-card" aria-label="Assistant response">
      <div className="ai-card-body">
        <div className="ai-card-label-row">
          <span className="ai-card-badge" aria-hidden="true">
            <SparkleIcon />
          </span>
          <p className="ai-card-label">Based on your account</p>
        </div>

        <h2 className="ai-card-headline">
          Technically yes — but it&apos;s tight.
        </h2>

        <p className="ai-card-text">
          A $120 ticket would put you $47 over your weekly budget and use up
          most of the cushion you&apos;d normally have for groceries before rent
          hits.
        </p>

        <div className="data-table">
          {BUDGET_ROWS.map((row) => (
            <DataRow key={row.label} {...row} />
          ))}
        </div>

        <div className="data-section">
          {CONTEXT_ROWS.map((row) => (
            <DataRow key={row.label} {...row} />
          ))}
        </div>

        <div className="suggestion-box">
          <p className="suggestion-label">Suggestion</p>
          <p className="suggestion-text">
            If you skip eating out twice this week (~$25) and use the $58 left
            in your entertainment budget, you could cover the ticket without
            dipping into rent money.
          </p>
        </div>
      </div>
    </article>
  )
}

function TypingIndicator() {
  return (
    <div className="typing-indicator" aria-label="Assistant is typing">
      <span className="typing-indicator-dot" />
      <span className="typing-indicator-dot" />
      <span className="typing-indicator-dot" />
    </div>
  )
}

function GenericResponseCard() {
  return (
    <article className="ai-card" aria-label="Assistant response">
      <div className="ai-card-body">
        <div className="ai-card-label-row">
          <span className="ai-card-badge" aria-hidden="true">
            <SparkleIcon />
          </span>
          <p className="ai-card-label">Based on your account</p>
        </div>

        <p className="ai-card-text">
          I can help you think through purchases like concert tickets, groceries,
          or bills. Try asking something like &ldquo;Can I afford a $120 concert
          ticket this weekend?&rdquo;
        </p>
      </div>
    </article>
  )
}

function AssistantScreen({ onNavigate }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 'initial-user', role: 'user', text: INITIAL_USER_MESSAGE },
    { id: 'initial-assistant', role: 'assistant', type: 'concert' },
  ])
  const contentRef = useRef(null)

  useEffect(() => {
    const container = contentRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  function handleSubmit(event) {
    event.preventDefault()

    const text = input.trim()
    if (!text) {
      return
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    }

    setInput('')
    setMessages((prev) => [...prev, userMessage])

    if (isConcertAffordabilityQuery(text)) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          type: 'concert',
        },
      ])
      return
    }

    const typingId = `assistant-${Date.now()}`

    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        role: 'assistant',
        type: 'typing',
      },
    ])

    window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === typingId
            ? { ...message, type: 'generic' }
            : message,
        ),
      )
    }, TYPING_DELAY_MS)
  }

  return (
    <div className="assistant-screen">
      <div className="assistant-content" ref={contentRef}>
        <header className="assistant-header">
          <button
            type="button"
            className="assistant-back"
            aria-label="Go back to Home"
            onClick={() => onNavigate?.('home')}
          >
            <BackArrowIcon />
          </button>
          <h1 className="assistant-title">
            <span className="assistant-title-icon" aria-hidden="true">
              <SparkleIcon />
            </span>
            Budget assistant
          </h1>
        </header>

        {messages.map((message) => {
          if (message.role === 'user') {
            return (
              <p key={message.id} className="user-message">
                {message.text}
              </p>
            )
          }

          if (message.type === 'typing') {
            return <TypingIndicator key={message.id} />
          }

          if (message.type === 'concert') {
            return <ConcertResponseCard key={message.id} />
          }

          return <GenericResponseCard key={message.id} />
        })}
      </div>

      <form className="assistant-input-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          className="assistant-input"
          placeholder="Ask about a purchase..."
          aria-label="Ask about a purchase"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit" className="assistant-send" aria-label="Send message">
          <SendIcon />
        </button>
      </form>
    </div>
  )
}

export default AssistantScreen
