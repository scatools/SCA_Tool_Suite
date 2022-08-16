import React, { useEffect, useRef } from "react";

const UserReport = ({ reportScript }) => {
  const divRef = useRef();
  
  useEffect(() => {
    const fragment = document.createRange().createContextualFragment(reportScript);
    divRef.current.append(fragment);
  }, [reportScript]);
  
  return <div ref={divRef} />;
};

export default UserReport;
