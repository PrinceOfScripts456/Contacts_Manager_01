import Avatar from '../Avatar/Avatar.jsx';
import { PhoneIcon, EmailIcon, EditIcon } from '../icons.jsx';
import { fullName, gradientFor, fmtTimestamp, getCreatedAt, getUpdatedAt } from '../../utils/helpers';
import './CardView.css';

export default function CardView({ contacts, selectedId, onOpen, onEdit }) {
  return (
    <div className="grid-cards">
      {contacts.map((c) => {
        const grad = gradientFor(c);
        const phone = c.phones && c.phones[0] ? c.phones[0].number : '';
        const email = c.emails && c.emails[0] ? c.emails[0].email : '';
        const createdAt = fmtTimestamp(getCreatedAt(c));
        const updatedAt = fmtTimestamp(getUpdatedAt(c));

        return (
          <div
            key={c.id}
            className={`contact-card${c.id === selectedId ? ' selected' : ''}`}
            onClick={() => onOpen(c.id)}
          >
            <div className="card-banner">
              <div className="card-banner-bg" style={{ background: grad }}></div>
              <div className="card-av-wrap">
                <Avatar contact={c} className="card-av" />
              </div>
            </div>
            <div className="card-body">
              <div className="card-name">{fullName(c)}</div>
              <div className="card-role">{[c.jobTitle, c.company].filter(Boolean).join(' · ')}</div>
              {phone && (
                <div className="card-info-line">
                  <PhoneIcon />
                  <span>{phone}</span>
                </div>
              )}
              {email && (
                <div className="card-info-line">
                  <EmailIcon />
                  <span>{email}</span>
                </div>
              )}
              {(createdAt || updatedAt) && (
                <div className="card-meta-line">
                  {createdAt && <span>Created {createdAt}</span>}
                  {createdAt && updatedAt && <span className="card-meta-sep">·</span>}
                  {updatedAt && <span>Updated {updatedAt}</span>}
                </div>
              )}
            </div>
            <div className="card-foot">
              {phone && (
                <button
                  className="card-action"
                  onClick={(e) => { e.stopPropagation(); window.open(`tel:${phone}`); }}
                >
                  <PhoneIcon size={12} /><span>Call</span>
                </button>
              )}
              {email && (
                <button
                  className="card-action"
                  onClick={(e) => { e.stopPropagation(); window.open(`mailto:${email}`); }}
                >
                  <EmailIcon size={12} /><span>Email</span>
                </button>
              )}
              <button
                className="card-action"
                onClick={(e) => { e.stopPropagation(); onEdit(c.id); }}
              >
                <EditIcon size={12} /><span>Edit</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
