import React, { PropsWithChildren } from 'react';

const H3: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <h3 className="text-2xl font-semibold text-gray-600 mb-2">{children}</h3>
  );
};

export default H3;
