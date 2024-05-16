import React from "react"
import { Box, Menu, MenuButton, MenuItem, MenuItemOption, MenuList } from "@chakra-ui/react"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"
import { MenuTitle, StyledMenuItem } from "@/components/DropDownButton/DropDown.style"

import { DropDownButtonProps } from "./type"
import { Link } from "react-router-dom"
import getMemberId from "@/hooks/getMemberId"

const DropDownButton: React.FC<DropDownButtonProps> = ({ title, contents }) => {
  const memberId = getMemberId()
  return (
    <Menu isLazy closeOnSelect={true}>
      {({ isOpen }) => (
        <>
          <MenuButton>
            <MenuTitle $isopened={isOpen}>
              {title}
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </MenuTitle>
          </MenuButton>
          <MenuList minWidth="140px">
            {/* MenuItems are not rendered unless Menu is open : is Lazy 때문에 */}

            {contents.map((item, index) => (
              <Box key={index}>
                <Link to={memberId === -1 ? "/login" : `/${item[1]}`}>
                  <MenuItem margin="0" padding="0">
                    <StyledMenuItem href="#">{item[0]}</StyledMenuItem>
                  </MenuItem>
                </Link>
              </Box>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  )
}

export default DropDownButton
