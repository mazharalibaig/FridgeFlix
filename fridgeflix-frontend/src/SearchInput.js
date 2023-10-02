import React from 'react';
import { InputAdornment, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = ({ value, onSearch, onChange }) => (
  <TextField
    className="search-bar"
    variant="outlined"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={onSearch}>
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

export default SearchInput;
