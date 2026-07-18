import { useEffect, useRef, useState } from 'react';
import Avatar from '../Avatar/Avatar.jsx';
import MultiFieldList from './MultiFieldList.jsx';
import { CloseIcon, UploadIcon } from '../icons.jsx';
import './Modal.css';
import './ContactForm.css';

const EMPTY_FORM = {
  firstName: '', lastName: '', company: '', jobTitle: '',
  website: '', address: '', note: '',
};

function makeDefaultPhones() { return [{ label: 'mobile', number: '' }]; }
function makeDefaultEmails() { return [{ label: 'home', email: '' }]; }
function makeDefaultDates() { return [{ label: 'birthday', date: '' }]; }

/**
 * `editingContact` — the contact object being edited, or null when adding new.
 * `open` — whether the modal is visible.
 * `onClose` — called to dismiss without saving.
 * `onSave(payload, avatarFile, editId)` — called with the built payload on save.
 */
export default function ContactModal({ open, editingContact, onClose, onSave }) {
  const [fields, setFields] = useState(EMPTY_FORM);
  const [phones, setPhones] = useState(makeDefaultPhones);
  const [emails, setEmails] = useState(makeDefaultEmails);
  const [dates, setDates] = useState(makeDefaultDates);

  // Avatar state, mirroring the original three-variable split:
  // avatarPreview -> string used only for the live preview (base64 of a new
  // pick, or an existing URL when editing); avatarFile -> the actual File
  // object to upload via multipart; avatarRemoved -> user explicitly removed it.
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [saving, setSaving] = useState(false);

  const firstInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const isEditing = !!editingContact;

  // (Re)initialize all form state whenever the modal opens, or when
  // switching between add/edit — mirrors openAdd()/openEdit().
  useEffect(() => {
    if (!open) return;

    if (editingContact) {
      const c = editingContact;
      setFields({
        firstName: c.firstName || '', lastName: c.lastName || '',
        company: c.company || '', jobTitle: c.jobTitle || '',
        website: c.website || '', address: c.address || '', note: c.note || '',
      });
      const p = (c.phones || []).map((x) => ({ ...x }));
      setPhones(p.length ? p : makeDefaultPhones());
      const e = (c.emails || []).map((x) => ({ ...x }));
      setEmails(e.length ? e : makeDefaultEmails());
      const d = (c.dates || []).map((x) => ({ ...x }));
      setDates(d.length ? d : makeDefaultDates());
      setAvatarPreview(c.avatar || null);
    } else {
      setFields(EMPTY_FORM);
      setPhones(makeDefaultPhones());
      setEmails(makeDefaultEmails());
      setDates(makeDefaultDates());
      setAvatarPreview(null);
      setTimeout(() => firstInputRef.current?.focus(), 80);
    }

    setAvatarFile(null);
    setAvatarRemoved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [open, editingContact]);

  function updateField(key, value) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function handleAvatarFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarRemoved(false);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleRemoveAvatar() {
    setAvatarPreview(null);
    setAvatarFile(null);
    setAvatarRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function updatePhone(i, key, value) {
    setPhones((prev) => prev.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)));
  }
  function removePhone(i) {
    setPhones((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addPhone() {
    setPhones((prev) => [...prev, { label: 'mobile', number: '' }]);
  }

  function updateEmail(i, key, value) {
    setEmails((prev) => prev.map((e, idx) => (idx === i ? { ...e, [key]: value } : e)));
  }
  function removeEmail(i) {
    setEmails((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addEmail() {
    setEmails((prev) => [...prev, { label: 'home', email: '' }]);
  }

  function updateDate(i, key, value) {
    setDates((prev) => prev.map((d, idx) => (idx === i ? { ...d, [key]: value } : d)));
  }
  function removeDate(i) {
    setDates((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addDate() {
    setDates((prev) => [...prev, { label: 'birthday', date: '' }]);
  }

  async function handleSave() {
    const fn = fields.firstName.trim();
    const ln = fields.lastName.trim();
    if (!fn && !ln) {
      firstInputRef.current?.focus();
      return;
    }

    const payload = {
      firstName: fn,
      lastName: ln,
      phones: phones.filter((p) => p.number.trim()).map((p) => ({ ...p, label: (p.label || '').trim() || 'other' })),
      emails: emails.filter((e) => e.email.trim()).map((e) => ({ ...e, label: (e.label || '').trim() || 'other' })),
      dates: dates.filter((d) => d.date).map((d) => ({ ...d, label: (d.label || '').trim() || 'other' })),
    };

    // Only include optional fields when they actually have a value.
    // Sending an empty string for fields like `website` can trip up
    // backend validators (e.g. a URL-format check) that only run when
    // the field is present. Omitting the key entirely sidesteps that.
    const note = fields.note.trim();
    const website = fields.website.trim();
    const address = fields.address.trim();
    const company = fields.company.trim();
    const jobTitle = fields.jobTitle.trim();
    if (note) payload.note = note;
    if (website) payload.website = website;
    if (address) payload.address = address;
    if (company) payload.company = company;
    if (jobTitle) payload.jobTitle = jobTitle;
    // Note: `avatar` is intentionally NOT sent here. The backend stores the
    // actual image file via multer and fills in the avatar URL itself, so
    // the contact's create/update JSON body never carries an avatar value.
    // The photo (if any) is uploaded separately after the contact is saved.

    setSaving(true);
    try {
      await onSave(payload, avatarFile, editingContact?.id ?? null);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const fakeContactForAvatar = { firstName: fields.firstName, lastName: fields.lastName, id: 'x' };

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" role="dialog" aria-labelledby="modalTitle">
        <div className="modal-header">
          <span className="modal-title" id="modalTitle">{isEditing ? 'Edit contact' : 'New contact'}</span>
          <button className="icon-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="modal-body">
          {/* Avatar */}
          <div className="form-avatar-row">
            {avatarPreview ? (
              <div className="av form-av">
                <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
            ) : (
              <Avatar contact={fakeContactForAvatar} className="form-av" />
            )}
            <div className="form-av-actions">
              <label className="upload-label" htmlFor="avatarFile">
                <UploadIcon />
                Upload photo
              </label>
              <input
                type="file"
                id="avatarFile"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleAvatarFileChange}
              />
              <button
                className="av-remove"
                style={{ display: avatarPreview ? 'block' : 'none' }}
                onClick={handleRemoveAvatar}
                type="button"
              >
                ✕ Remove photo
              </button>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-hd">Name &amp; work</div>
            <div className="form-row col2">
              <div className="form-field">
                <label className="form-label" htmlFor="fFirst">First name</label>
                <input
                  className="form-input" id="fFirst" type="text" placeholder="First"
                  autoComplete="off" ref={firstInputRef}
                  value={fields.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="fLast">Last name</label>
                <input
                  className="form-input" id="fLast" type="text" placeholder="Last" autoComplete="off"
                  value={fields.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row col2">
              <div className="form-field">
                <label className="form-label" htmlFor="fCompany">Company</label>
                <input
                  className="form-input" id="fCompany" type="text" placeholder="Company" autoComplete="off"
                  value={fields.company}
                  onChange={(e) => updateField('company', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="fJob">Job title</label>
                <input
                  className="form-input" id="fJob" type="text" placeholder="Title" autoComplete="off"
                  value={fields.jobTitle}
                  onChange={(e) => updateField('jobTitle', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-hd">Phone numbers</div>
            <MultiFieldList
              items={phones}
              valueField="number"
              inputType="tel"
              placeholder="Phone number"
              presets={['mobile', 'home', 'work', 'other']}
              onChange={updatePhone}
              onRemove={removePhone}
            />
            <button className="add-field-btn" type="button" onClick={addPhone}>+ Add phone</button>
          </div>

          <div className="form-section">
            <div className="form-section-hd">Email addresses</div>
            <MultiFieldList
              items={emails}
              valueField="email"
              inputType="email"
              placeholder="Email address"
              presets={['home', 'work', 'other']}
              onChange={updateEmail}
              onRemove={removeEmail}
            />
            <button className="add-field-btn" type="button" onClick={addEmail}>+ Add email</button>
          </div>

          <div className="form-section">
            <div className="form-section-hd">Dates</div>
            <MultiFieldList
              items={dates}
              valueField="date"
              inputType="date"
              placeholder=""
              presets={['birthday', 'anniversary', 'other']}
              onChange={updateDate}
              onRemove={removeDate}
            />
            <button className="add-field-btn" type="button" onClick={addDate}>+ Add date</button>
          </div>

          <div className="form-section">
            <div className="form-section-hd">More details</div>
            <div className="form-row col2">
              <div className="form-field">
                <label className="form-label" htmlFor="fWebsite">Website</label>
                <input
                  className="form-input" id="fWebsite" type="url" placeholder="https://…" autoComplete="off"
                  value={fields.website}
                  onChange={(e) => updateField('website', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="fAddress">Address</label>
                <input
                  className="form-input" id="fAddress" type="text" placeholder="Street, City, Country" autoComplete="off"
                  value={fields.address}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row col1">
              <div className="form-field">
                <label className="form-label" htmlFor="fNote">Note</label>
                <textarea
                  className="form-textarea" id="fNote" placeholder="Any notes…"
                  value={fields.note}
                  onChange={(e) => updateField('note', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save contact'}
          </button>
        </div>
      </div>
    </div>
  );
}
