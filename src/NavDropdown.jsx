import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import './index.css';
export default function NavDropdown(props) {
  const { title, options,anchor } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
//  (anchor) ? setAnchorEl(anchor) : setAnchorEl(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    console.log('handleClick', event.currentTarget);
    setAnchorEl(event.currentTarget);
    event.preventDefault();
  };
  const handleClose = (event) => {
    console.log('handleClose', event.currentTarget);
    setAnchorEl(null);
    event.preventDefault();
  };

  const onMouseEnter=(evt)=>{
    console.log('onMouseEnter', evt.currentTarget);
    setAnchorEl(evt.currentTarget);
    evt.preventDefault();
  }
  const onMouseLeave=(evt)=>{
    console.log('onMouseOut', evt.currentTarget);
    setAnchorEl(evt.currentTarget);
    evt.preventDefault();
  }
 
  return (
    <div>
      <Button
        id="menu-drowpdown-button"
        className='top-menu-link'
        aria-controls={open ? 'menu-dropdown-link' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        // onMouseOver={(evt) => onMouseEnter(evt)}
        sx={{
            dropShadow: '3px',
              textDecoration: 'none',
              textTransform: 'none',
              position: 'relative',
              fontFamily: 'Open Sans',
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: '1em',
              lineHeight: '25px',
              color: '#000000',
//              textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
//              bgcolor: 'transparent',
              "&:hover": {
  //           backgroundColor: //theme.palette.grey[200],
              // boxShadow: '0px 1px 1px rgba(0.5, 0.5, 0.5, 0.15)',
              color: '#fff',
              cursor: "pointer",
              "& .addIcon": {
                color: "white"
              }
          }
        }}
      >
        {title}
      </Button>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onMouseOver={onMouseEnter} 
        onMouseOut={onMouseLeave}
        onClick={handleClick}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <span key={`menu-item-container-${index}`}>
            <MenuItem
              sx={{
                width: 200,
              }}
              key={`option-${index}`}>
              {option.name}
            </MenuItem>
            <Divider />
          </span>
        ))}
      </Menu>
    </div>
  );
}