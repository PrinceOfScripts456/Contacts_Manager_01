import { gradientFor, initials, fullName } from '../../utils/helpers';

/**
 * Renders a contact's avatar: their photo if `avatar` is set, otherwise
 * their initials on a deterministic gradient background (same palette
 * logic as the original mkAv() helper).
 *
 * `className` lets each view apply its own sizing class (e.g. "card-av",
 * "drawer-hero-av") exactly like the original did with `mkAv(c, cls)`.
 */
export default function Avatar({ contact, className = '', style = {} }) {
  const combinedClass = `av ${className}`.trim();

  if (contact?.avatar) {
    return (
      <div className={combinedClass} style={style}>
        <img src={contact.avatar} alt={fullName(contact)} />
      </div>
    );
  }

  return (
    <div
      className={combinedClass}
      style={{ background: gradientFor(contact), ...style }}
    >
      {initials(contact)}
    </div>
  );
}
