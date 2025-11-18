import React, { SVGProps } from "react";

const TaskEdit = (props: SVGProps<SVGSVGElement>) => {
  return (
   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
<rect width="4" height="4" rx="1" fill="#8CA3CD"/>
<rect y="5" width="4" height="4" rx="1" fill="#8CA3CD"/>
<rect y="10" width="4" height="4" rx="1" fill="#8CA3CD"/>
<rect x="5" width="4" height="4" rx="1" fill="#8CA3CD"/>
<rect x="5" y="5" width="4" height="4" rx="1" fill="#8CA3CD"/>
<rect x="5" y="10" width="4" height="4" rx="1" fill="#8CA3CD"/>
</svg>
  );
};

export default TaskEdit;
