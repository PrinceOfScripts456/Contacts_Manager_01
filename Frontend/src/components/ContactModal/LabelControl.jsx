import { useState } from 'react';
import { cap } from '../../utils/helpers';

/**
 * Renders a <select> of preset labels (e.g. mobile/home/work/other) plus a
 * "Custom…" option. Picking "Custom…" reveals a free-text input so the
 * label can be any string, matching the backend schema (`label: String`).
 *
 * If the incoming `label` isn't one of the presets (e.g. a custom label
 * already saved on the backend), the control automatically starts in
 * "Custom…" mode with that label pre-filled — nothing is silently
 * overwritten, same as the original buildLabelControl().
 */
export default function LabelControl({ label, presets, onChange }) {
  const isCustomInitially = label && !presets.includes(label.toLowerCase());
  const [mode, setMode] = useState(isCustomInitially ? 'custom' : 'preset');
  const [customValue, setCustomValue] = useState(isCustomInitially ? label : '');

  function handleSelectChange(e) {
    const val = e.target.value;
    if (val === 'custom') {
      setMode('custom');
      setCustomValue('');
      onChange(''); // no real label yet until they type one
    } else {
      setMode('preset');
      onChange(val);
    }
  }

  function handleCustomInput(e) {
    setCustomValue(e.target.value);
    onChange(e.target.value);
  }

  const selectValue = mode === 'custom' ? 'custom' : (label || presets[0]);

  return (
    <div className="label-control">
      <select className="form-select label-select" value={selectValue} onChange={handleSelectChange}>
        {presets.map((v) => (
          <option key={v} value={v}>{cap(v)}</option>
        ))}
        <option value="custom">Custom…</option>
      </select>
      <input
        className="form-input label-custom-input"
        type="text"
        placeholder="Label name"
        maxLength={30}
        value={customValue}
        onChange={handleCustomInput}
        style={{ display: mode === 'custom' ? '' : 'none' }}
      />
    </div>
  );
}
