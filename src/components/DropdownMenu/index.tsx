import * as React from 'react'

export enum DropdownMenuDirection {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT
}

export class DropdownMenuHeader {
  constructor(
    public label: string,
    public elements: Array<DropdownMenuElement>,
    public optional?: {
      direction?: DropdownMenuDirection,
      hoverable?: boolean,
      isSubmenu?: boolean,
    }
  ) { }
}

export class DropdownMenuButton {
  constructor(
    public label: string,
    public onSelect: () => void,
    public availabilityCondition?: () => boolean
  ) { }
}

type DropdownMenuElement = DropdownMenuHeader | DropdownMenuButton

export const DropdownMenu = (props: DropdownMenuHeader) => {
  const dropdownMenuBody = props.elements?.map((element, index) => element
    instanceof DropdownMenuHeader ?
    (<DropdownMenu
      key={index}
      label={element.label}
      elements={element.elements}
      optional={element.optional}
    />) :
    (<div className={`dropdown-menu-header dropdown-submenu ${
      (() => {
        if (element.availabilityCondition) {
          return element.availabilityCondition()
        } else return true
      })() ? "" : "dropdown-menu-inactive"
    }`} key={index} onClick={() => {
      if (!element.availabilityCondition || element.availabilityCondition()) {
        hideMenuBody()
        element.onSelect()
      }
    }}>{element.label}</div>)
  )

  const bodyRef = React.useRef(null)
  const headerRef = React.useRef(null)

  const showMenuBody = () => bodyRef.current.classList.add("visible")

  const hideMenuBody = () => bodyRef.current.classList.remove("visible")

  const headerClickHandler = () => {
    const isVisible = bodyRef.current.classList.contains("visible")
    if (isVisible) {
      hideMenuBody()
    } else {
      showMenuBody()
    }
  }

  window.addEventListener('click', (event: any) => hideMenuBody())

  const bodyStyles = new Map<DropdownMenuDirection, {}>([
    [DropdownMenuDirection.TOP, { bottom: "-0.1rem" }],
    [DropdownMenuDirection.RIGHT, { left: "calc(100% + 0.1rem)" }],
    [DropdownMenuDirection.BOTTOM, { top: "1.1rem" }],
    [DropdownMenuDirection.LEFT, { right: "-0.1rem" }],
  ])

  return (
    <div className="dropdown-menu" onClick={(event) => event.stopPropagation()}>
      <div className={`dropdown-menu-header 
        ${(props.optional?.isSubmenu ?? false) ? "dropdown-submenu" : ""}`
      } ref={headerRef} onClick={headerClickHandler}>{props.label}</div>
      <div
        className={"dropdown-menu-body"}
        style={bodyStyles.get(props.optional?.direction ?? DropdownMenuDirection.BOTTOM)}
        ref={bodyRef}>{dropdownMenuBody}
      </div>
    </div>
  )
}