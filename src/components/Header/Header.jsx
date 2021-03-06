import React from 'react';
import PropTypes from 'prop-types';
import style from './Header.scss';

class Header extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  search = (e) => {
    const { history } = this.props;
    e.preventDefault();
    const query = document.querySelector('#searchField').value.replace(/[^\w]/g, ' ');
    history.location.pathname = '';
    history.push(`/search/${query}`);
  };

  render() {
    const { query } = this.props;
    let placeHolderValue;
    let value;
    if (query.search) {
      placeHolderValue = query.url;
      value = placeHolderValue;
    } else {
      placeHolderValue = 'search';
    }
    return (
      <header className={style.header}>
        <div className={style.container}>
          <h1 className={style.h1}>FILMS</h1>
          <form action="" onSubmit={this.search}>
            <input
              type="search"
              className={style.searchField}
              tabIndex="0"
              id="searchField"
              placeholder={placeHolderValue}
              autoComplete="false"
              defaultValue={value}
            />
            <input
              type="button"
              className={style.btnSearch}
              value="&#9906;"
              onClick={this.search}
            />
          </form>
        </div>
      </header>
    );
  }
}

Header.defaultProps = {
  history: {
    location: {},
  },
  query: { url: '' },
};

Header.propTypes = {
  history: PropTypes.objectOf(PropTypes.any),
  query: PropTypes.objectOf(PropTypes.any),
};

export default Header;
