import React from "react";
import Tippy from "@tippyjs/react";

const Tooltip = ({
  children,
  content = "content",
  title,
  className = "btn btn-dark",
  placement = "top",
  arrow = true,
  theme = "dark",
  animation = "shift-away",
  trigger = "mouseenter focus",
  interactive = false,
  allowHTML = false,
  maxWidth = 300,
  duration = 200,
}) => {
  return (
    <div className="custom-tippy">
      <Tippy content={content} placement={placement} arrow={arrow} theme={theme} animation={animation} trigger={trigger} interactive={interactive} allowHTML={allowHTML} maxWidth={maxWidth} duration={duration}>
        {children ? children : <button className={className}>{title}</button>}
      </Tippy>
    </div>
  );
};

export default Tooltip;
