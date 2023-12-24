import React from 'react';
import { Link } from 'react-router-dom';

export type BreadCrumbsProps = {
  links: Map<string, string>;
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ links }) => {
  const entries = Array.from(links.entries());
  const lastEntryIndex = entries.length - 1;

  const breadCrumbStyle = {
    padding: '5px',
    margin: '0 10px',
    backgroundColor: '#f0f0f0',
  };

  return (
    <div>
      {entries.map(([key, value], index) => (
        <span key={key} style={breadCrumbStyle}>
          <Link to={value} style={{ textDecoration: 'none', color: 'black' }}>
            {key}
          </Link>
          {index < lastEntryIndex && ' > '}
        </span>
      ))}
    </div>
  );
}

export default BreadCrumbs;