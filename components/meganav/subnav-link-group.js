import React, {useEffect, useState} from "react"

import PropTypes from "prop-types"

const SubNavLinkGroup = ({headerText = '', items = []}) => {
    const [currentPathname, setCurrentPathname] = useState(null)
    useEffect(() => {
        setCurrentPathname(document.location.pathname)
    }, [])

    return (
        <div className="megamenu-submenu-group">
            <h3 className="megamenu-submenu-header">
                {headerText}
            </h3>
            <ul>
            {items.map((item, index) => (
                <li className="megamenu-submenu-link" key={index}>
                    <a
                        className="nav-link"
                        data-testid={`link-${index}`}
                        href={item.url}
                        aria-current={currentPathname === item.url ? 'page' : null}
                    >
                        {item.name}
                    </a>
                </li>
            ))}
            </ul>
        </div>
    )
}

SubNavLinkGroup.propTypes = {
    headerText: PropTypes.string,
    items: PropTypes.array
}

SubNavLinkGroup.defaultProps = {
    headerText: '',
    items: []
}

export default SubNavLinkGroup
