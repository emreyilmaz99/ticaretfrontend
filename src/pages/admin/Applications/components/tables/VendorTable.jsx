// src/pages/admin/Applications/components/tables/VendorTable.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ApplicationTable from './ApplicationTable';

/**
 * Wrapper for ApplicationTable that accepts 'vendors' prop
 * Provides backward compatibility
 */
const VendorTable = React.memo(({
  vendors,
  ...otherProps
}) => {
  return (
    <ApplicationTable
      applications={vendors}
      mode="pre"
      {...otherProps}
    />
  );
});

VendorTable.displayName = 'VendorTable';

VendorTable.propTypes = {
  vendors: PropTypes.array.isRequired,
};

export default VendorTable;
