import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

function CategoryTooltip({ category }) {
  const categoryFormatted = category
    ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
    : '';

  return (
    <div className="tooltip">
        <p className='tooltiptext'>Catégorie : <span className='category-name'>{categoryFormatted}</span></p>
        <FontAwesomeIcon icon={faQuestion} />
    </div>
  );
}

export default CategoryTooltip;
