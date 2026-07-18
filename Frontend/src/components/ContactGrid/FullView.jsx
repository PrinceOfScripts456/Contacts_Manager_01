import Avatar from '../Avatar/Avatar.jsx';
import {
  PhoneIcon, EmailIcon, BdayIcon, WebIcon, LocIcon, NoteIcon, EditIcon, DeleteIcon,
} from '../icons.jsx';
import { fullName, cap, fmtDate, fmtTimestamp, getCreatedAt, getUpdatedAt, isSafeUrl } from '../../utils/helpers';
import './FullView.css';

function buildDetailRows(c) {
  const rows = [];
  (c.phones || []).forEach((p) => rows.push({
    icon: <PhoneIcon size={13} />, label: cap(p.label || 'phone'), val: p.number, href: `tel:${p.number}`,
  }));
  (c.emails || []).forEach((e) => rows.push({
    icon: <EmailIcon size={13} />, label: cap(e.label || 'email'), val: e.email, href: `mailto:${e.email}`,
  }));
  (c.dates || []).forEach((d) => {
    if (d.date) rows.push({ icon: <BdayIcon size={13} />, label: cap(d.label || 'date'), val: fmtDate(d.date) });
  });
  if (c.website) {
    rows.push({
      icon: <WebIcon size={13} />, label: 'Website', val: c.website,
      href: isSafeUrl(c.website) ? c.website : undefined,
    });
  }
  if (c.address) rows.push({ icon: <LocIcon size={13} />, label: 'Address', val: c.address });
  return rows;
}

export default function FullView({ contacts, selectedId, onOpen, onEdit, onDelete }) {
  return (
    <div className="grid-full">
      {contacts.map((c) => {
        const rows = buildDetailRows(c);
        const createdAt = fmtTimestamp(getCreatedAt(c));
        const updatedAt = fmtTimestamp(getUpdatedAt(c));

        return (
          <div
            key={c.id}
            className={`full-card${c.id === selectedId ? ' selected' : ''}`}
            onClick={() => onOpen(c.id)}
          >
            <div className="full-card-head">
              <Avatar contact={c} style={{ width: 52, height: 52, fontSize: 18, flexShrink: 0 }} />
              <div className="full-card-meta">
                <div className="full-card-name">{fullName(c)}</div>
                <div className="full-card-role">{[c.jobTitle, c.company].filter(Boolean).join(' · ')}</div>
              </div>
            </div>
            <div className="full-card-body">
              {rows.map((r, i) => (
                <div className="full-detail-row" key={i}>
                  <div className="full-detail-icon">{r.icon}</div>
                  <div className="full-detail-content">
                    <div className="full-detail-label">{r.label}</div>
                    <div className="full-detail-val">
                      {r.href
                        ? <a href={r.href} onClick={(e) => e.stopPropagation()}>{r.val}</a>
                        : r.val}
                    </div>
                  </div>
                </div>
              ))}
              {c.note && (
                <div className="full-detail-row">
                  <div className="full-detail-icon"><NoteIcon size={13} /></div>
                  <div className="full-detail-content">
                    <div className="full-detail-label">Note</div>
                    <div className="full-detail-val note-val">{c.note}</div>
                  </div>
                </div>
              )}
              {rows.length === 0 && !c.note && (
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>No details added.</div>
              )}
              {(createdAt || updatedAt) && (
                <div className="full-meta-line">
                  {createdAt && <span>Created {createdAt}</span>}
                  {createdAt && updatedAt && <span className="full-meta-sep">·</span>}
                  {updatedAt && <span>Updated {updatedAt}</span>}
                </div>
              )}
            </div>
            <div className="full-card-foot">
              <button className="fc-btn" onClick={(e) => { e.stopPropagation(); onEdit(c.id); }}>
                <EditIcon size={13} /> Edit
              </button>
              <button className="fc-btn danger" onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}>
                <DeleteIcon size={13} /> Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
