import React, { PropsWithChildren } from 'react';

const Section: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <section className="flex-1 bg-white p-4 rounded-lg shadow-md">
      {children}
    </section>
  );
};

export default Section;
