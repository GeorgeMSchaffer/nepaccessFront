import React from 'react';
import {
  Paper,
  Button,
  Box,
  Divider,
  FormControl,
  TextField,
  InputLabel,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
// import {Option,Select} from '@mui/base'
import { counties, locations, agencies, actionOptions, decisionOptions } from '../../data/data';
import { makeStyles } from '@mui/styles';
import axios, { Get } from 'axios';
import results from './sample';
const handleSubmit = (evt) => {
  evt.preventDefault();
  console.log('Submitting form');
};


//used to override MUI styles via withStyles props
const drawerWidth = 200;
//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
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    m: 2,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 1,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: 120,
    width: '100%',
  },
  submitButton: {
    //margin: theme.spacing(3, 0, 2),},
  },
  formLabel: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    padding: 1,
  },
  box: {
    margin: 5,
    padding: 5,
  },
  autocomplete: {
    p: 0,
    m: 0,
    width: '100%',
  },
  select: {
    border: 'none',
    //backgroundColor: theme.palette.grey[150],
    '&:hover': {
      p: 0,
      backgroundColor: theme.palette.grey[100],
      '&:hover': {
        backgroundColor: theme.palette.grey[150],
        boxShadow: theme.palette.grey[300],
        cursor: 'pointer',
      },
    },
  },
}));

export default function SearchFilters(props) {
  console.log('SearchFilters props', props);
  console.log('SearchFilters PROP classes', props.classes);
  //const {classes} = props;

  const [] = React.useState('');
  const [formData] = React.useState({
    titleRaw: '',
    startPublish: null,
    endPublish: null,
    startComment: null,
    endComment: null,
    agency: [],
    agencyRaw: [],
    cooperatingAgency: [],
    cooperatingAgencyRaw: [],
    state: [],
    stateRaw: [],
    county: [],
    countyRaw: [],
    decision: [],
    decisionRaw: [],
    action: [],
    actionRaw: [],
    typeAll: true,
    typeFinal: false,
    typeDraft: false,
    typeEA: false,
    typeNOI: false,
    typeROD: false,
    typeScoping: false,
    typeOther: false,
    needsComments: false,
    needsDocument: false,
    optionsChecked: true,
    iconClassName: 'icon icon--effect',
    limit: 100,
    offset: 0,
    searchOption: 'B',
    tooltipOpen: undefined,
    proximityOption: null,
    proximityDisabled: true,
    hideOrganization: true,
    markup: true,
    fragmentSizeValue: 2,
    isDirty: false,
    surveyChecked: true,
    surveyDone: true,
    surveyResult: "Haven't searched yet",
    filtersHidden: false,
  });
  const classes = useStyles(props);
  const filters = [
    {
      label: 'Lead Agency or Agencies',
      id: 'agency',
      labelId: 'agency-label',
      data: agencies,
      placeholder: 'Type or select an agencies',
    },
    {
      label: 'Cooperating Agency',
      id: 'agencies',
      labelId: 'agencies-label',
      data: agencies,
      placeholder: 'Type or select an agencies',
    },
    {
      label: 'State(s) or location(s)',
      id: 'location',
      labelId: 'location-label',
      placeholder: 'Type or select an states',
      data: locations,
    },
    {
      label: 'County/counties',
      id: 'counties',
      labelId: 'counties-label',
      data: counties,
      placeholder: 'Type or select a counties',
    },
    {
      label: 'Action Type',
      labelId: 'action-label',
      id: 'action',
      data: actionOptions,
      placeholder: 'Type or select an action type',
    },
    {
      label: 'Decision Type',
      labelId: 'decision-label',
      id: 'decision',
      data: decisionOptions,
      placeholder: 'Type or select a decision',
    },
  ];
  console.log('SearchFilters useStlyes classes', classes);
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          margin: 1,
        }}
      >
        <div className={classes.drawerContainer}>
          <form onSubmit={handleSubmit}>
            {filters.map((filter) => (
              <Box className={classes.box}>
                <FormControl
                  variant="filled"
                  key={`${filter.id}-label`}
                  className={classes.formControl}
                  key={`${filter.id}-formcontrol`}
                >
                  <InputLabel className={classes.formLabel} key={filter.id} id={filter.labelId}>
                    {filter.label}
                  </InputLabel>
                  <Autocomplete
                    disablePortal
                    id={filter.id}
                    options={filter.data}
                    sx={{}}
                    key={`${filter.id}-autocomplete`}
                    className={classes.autocomplete}
                    renderInput={(params) => (
                      <TextField
                        key={`${filter.id}-textfield`}
                        className={classes.autocomplete}
                        placeholder={filter.placeholder}
                        {...params}
                      />
                    )}
                  />
                </FormControl>
                <Divider />
              </Box>
            ))}

            <Box width={'100%'} alignItems={'center'}>
              <Button variant="contained" type="submit" className={classes.submitButton}>
                Submit
              </Button>
            </Box>
          </form>
        </div>
      </Paper>
    </>
  );
}
//export default SearchFilters;

//export default withStyles(styles)(SearchFilters);
