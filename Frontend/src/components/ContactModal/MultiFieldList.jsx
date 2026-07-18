import LabelControl from './LabelControl.jsx';

/**
 * Renders a list of rows, each with a label control + one value input
 * (phone number, email address, or date). Ports renderPhones()/
 * renderEmails()/renderDates() from the original app.js into one
 * reusable, data-driven component.
 *
 * `items` — array of { label, ...valueField }
 * `valueField` — the key holding the actual value (e.g. 'number', 'email', 'date')
 * `inputType` — the HTML input type ('tel' | 'email' | 'date')
 * `placeholder` — placeholder text for the value input (date inputs ignore this)
 * `presets` — preset label options passed to LabelControl
 * `onChange(index, field, value)` — called when a row's label or value changes
 * `onRemove(index)` — called when a row's remove button is clicked
 */
export default function MultiFieldList({
  items, valueField, inputType, placeholder, presets, onChange, onRemove,
}) {
  return (
    <div className="multi-list">
      {items.map((item, i) => (
        <div className="multi-row" key={i}>
          <LabelControl
            label={item.label}
            presets={presets}
            onChange={(val) => onChange(i, 'label', val)}
          />
          <input
            className="form-input"
            type={inputType}
            placeholder={placeholder}
            value={item[valueField] || ''}
            onChange={(e) => onChange(i, valueField, e.target.value)}
          />
          {items.length > 1 && (
            <button
              className="multi-remove"
              type="button"
              tabIndex={-1}
              onClick={() => onRemove(i)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
