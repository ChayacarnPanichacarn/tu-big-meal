// import React from 'react'
import "./SearchBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import Proptypes from 'prop-types';

function SearchBar(props) {
  const {query, setQuery} = props;

  return (
    <div className="bar">
        <div className="search-bar">
            <input
              type="text" 
              placeholder="ค้นหาเมนู..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <label htmlFor="" className="icon">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </label>
        </div>
    </div>
  )
}

SearchBar.propTypes = {
  query: Proptypes.string,
  setQuery: Proptypes.func
}

export default SearchBar;
