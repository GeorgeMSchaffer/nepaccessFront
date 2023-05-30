import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './index.css'
export default function NavDropdown(props) {
  console.log('NavDropdown props', props);
  const { title, options } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    event.preventDefault();
  };
  const handleClose = (event) => {
    setAnchorEl(null);
    event.preventDefault();
  };
  const onHover=(evt)=>{
    console.log('onHover', evt)
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
              textDecoration: 'none',
              color: '#000000',
//              textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              bgcolor: 'transparent',
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
        onHover={(evt) => onHover(evt)}
        onClick={(evt) => handleClick(evt)}
        onClose={(evt) => handleClose(evt)}
      >
        {options.map((option, index) => (
          <MenuItem
            key={`option-${index}`} onClick={handleClose}>

            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}