import React from 'react';
import style from './FilmButtons.scss';
import { showModal } from '../ModalPlayer/ModalPlayer';

export const showMainFilmOverwie = () => {
  document.querySelector('#mainFilmOverwie').style.maxHeight = '100%';
  document.querySelector('#mainFilmOverwie > p').style.display = 'block';
};

class FilmButtons extends React.Component {
  render() {
    return (
      <div className={style.btnContainer}>
        <button
          id="watch"
          type="button"
          className={style.watch}
          onClick={showModal.bind(null, this.props)}
          tabIndex="0"
          ref={watch => {
            this.watch = watch;
            return this.viewInfo;
          }}
        >
          Watch Now
        </button>
        <button
          id="info"
          type="button"
          className={style.viewInfo}
          onClick={showMainFilmOverwie}
          tabIndex="0"
          ref={viewInfo => {
            this.viewInfo = viewInfo;
            return this.viewInfo;
          }}
        >
          View Info
        </button>
      </div>
    );
  }
}
export default FilmButtons;
