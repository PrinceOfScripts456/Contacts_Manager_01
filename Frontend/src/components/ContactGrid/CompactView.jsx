import Avatar from '../Avatar/Avatar.jsx';
import { EditIcon, DeleteIcon } from '../icons.jsx';
import { fullName } from '../../utils/helpers';
import './CompactView.css';

export default function CompactView({ contacts, selectedId, onOpen, onEdit, onDelete }) {
  return (
    <div className="grid-compact">
      <div className="compact-head">
        <div className="compact-head-cell">Name</div>
        <div className="compact-head-cell">Phone</div>
        <div className="compact-head-cell">Email</div>
        <div className="compact-head-cell">Company</div>
        <div className="compact-head-cell"></div>
      </div>

      {contacts.map((c) => {
        const phone = c.phones && c.phones[0] ? c.phones[0].number : '—';
        const email = c.emails && c.emails[0] ? c.emails[0].email : '—';

        return (
          <div
            key={c.id}
            className={`compact-row${c.id === selectedId ? ' selected' : ''}`}
            onClick={() => onOpen(c.id)}
          >
            <div className="compact-cell">
              <div className="compact-name-cell">
                <Avatar contact={c} style={{ width: 30, height: 30, fontSize: 11, flexShrink: 0 }} />
                <div>
                  <div className="compact-name">{fullName(c)}</div>
                  {c.jobTitle && <div className="compact-sub">{c.jobTitle}</div>}
                </div>
              </div>
            </div>
            <div className="compact-cell"><span className="compact-sub">{phone}</span></div>
            <div className="compact-cell"><span className="compact-sub">{email}</span></div>
            <div className="compact-cell">
              {c.company && <span className="compact-badge">{c.company}</span>}
            </div>
            <div className="compact-cell">
              <div className="compact-actions">
                <button
                  className="compact-icon-btn"
                  title="Edit"
                  onClick={(e) => { e.stopPropagation(); onEdit(c.id); }}
                >
                  <EditIcon size={13} />
                </button>
                <button
                  className="compact-icon-btn danger"
                  title="Delete"
                  onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                >
                  <DeleteIcon size={13} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
