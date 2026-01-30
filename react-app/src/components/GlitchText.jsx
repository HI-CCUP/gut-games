import React from "react";
//import PropTypes from "prop-types";

const GlitchText = ({ children, className = "", tag: Tag = "span" }) => {
    return (
        <Tag className={`glitch-text ${className}`} data-text={children}>
            {children}
        </Tag>
    );
};

/*GlitchText.propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    tag: PropTypes.string,
};*/

export default GlitchText;
