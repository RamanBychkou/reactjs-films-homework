import React from 'react';
import { Provider } from 'react-redux';
import ReactTestRender from 'react-test-renderer';
import thunk from 'redux-thunk';
import ReactTestUtils from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';
import MovieDetailsPage from '../index';

jest.mock('rc-util/lib/Portal');

//* ****************************************************************************
describe('MovieDetailsPage renders correctly', () => {
  const initialState = {
    movies: {}, genres: [], mainMovie: {},
  };
  const mockStore = configureStore([thunk]);
  const initial = {
    movies: {
      currentVideo: null,
      results: [
        {
          adult: false,
          backdrop_path: '/v4yVTbbl8dE1UP2dWu5CLyaXOku.jpg',
          genre_ids: [12, 14, 10402, 10749, 35, 10751],
          id: 420817,
          original_language: 'en',
          original_title: 'Aladdin',
          overview: 'A kindhearted street urchin named Aladdin embarks on a magical adventure after finding a lamp that releases a wisecracking genie while a power-hungry Grand Vizier vies for the same lamp that has the power to make their deepest wishes come true.',
          popularity: 630.556,
          poster_path: '/3iYQTLGoy7QnjcUYRJy4YrAgGvp.jpg',
          release_date: '2019-05-22',
          title: 'Aladdin',
          video: false,
          vote_average: 7.2,
          vote_count: 538,
        },
      ],
    },
    genres: [],
    mainMovie: { backdrop_path: 'test' },
  };
  const initial2 = {
    movies: {
      mainMovie: { backdrop_path: 'test' },
      currentVideo: 'test',
      results: [
        {
          adult: false,
          backdrop_path: '/v4yVTbbl8dE1UP2dWu5CLyaXOku.jpg',
          genre_ids: [12, 14, 10402, 10749, 35, 10751],
          original_title: 'Aladdin',
          overview: 'A kindhearted street urchin named Aladdin embarks on a magical adventure after finding a lamp that releases a wisecracking genie while a power-hungry Grand Vizier vies for the same lamp that has the power to make their deepest wishes come true.',
          popularity: 630.556,
          poster_path: '/3iYQTLGoy7QnjcUYRJy4YrAgGvp.jpg',
          release_date: '2019-05-22',
          title: 'Aladdin',
          video: false,
          vote_average: 7.2,
          vote_count: 538,
        },
      ],
    },
    genres: [{ id: 35, name: 'Drama' }],
    mainMovie: { backdrop_path: 'test' },
  };
  it('MovieDetailsPage: render preloader', () => {
    const store = mockStore(initialState);
    const container = ReactTestUtils
      .renderIntoDocument(<Provider store={store}><MovieDetailsPage /></Provider>);
    expect(container).toMatchSnapshot();
  });

  it('MovieDetailsPage: render component', () => {
    const store = mockStore(initial);
    const container = ReactTestRender
      .create(<Provider store={store}><MovieDetailsPage /></Provider>);
    expect(container).toMatchSnapshot();
  });


  describe('componentDidUpdate', () => {
    const store = mockStore(initial);
    const getMainMovieDetails = jest.fn();
    it('MovieDetailsPage: check componentDidUpdate - should return state', () => {
      const action = jest.spyOn(MovieDetailsPage.WrappedComponent.prototype, 'componentDidUpdate');
      MovieDetailsPage.WrappedComponent.prototype.componentDidUpdate.call(
        { props: { ...initial, getMainMovieDetails } }, { ...initial2 },
      );
      expect(getMainMovieDetails).toHaveBeenCalled();
    });

    it('MovieDetailsPage: check componentDidUpdate - should return null', () => {
      const action = jest.spyOn(MovieDetailsPage.WrappedComponent.prototype, 'componentDidUpdate');
      const method = MovieDetailsPage.WrappedComponent.prototype.componentDidUpdate.call(
        { props: { ...initial, getMainMovieDetails } }, { ...initial },
      );
      expect(method).toBeNull();
    });
  });

  describe('getDerivedStateFromProps', () => {
    it('getDerivedStateFromProps: first render', async () => {
      const fetchGenres = jest.fn(() => 1);
      const fetchPopular = jest.fn(() => 2);
      const action = await MovieDetailsPage.WrappedComponent.getDerivedStateFromProps.call(
        null, { ...initial, fetchPopular, fetchGenres },
      );

      expect(action).toBe(2);
    });

    it('getDerivedStateFromProps: other rendering', async () => {
      const fetchGenres = jest.fn(() => 1);
      const fetchPopular = jest.fn(() => 2);
      const action = await MovieDetailsPage.WrappedComponent.getDerivedStateFromProps.call(null, { ...initial2, fetchPopular, fetchGenres },
      );

      expect(action).toEqual({ ...initial2, fetchGenres, fetchPopular });
    });
  });

  describe('shouldComponentUpdate', () => {
    it('MovieDetailsPage: check shouldComponentUpdate to BE TRUE', () => {
      jest.spyOn(MovieDetailsPage.WrappedComponent.prototype, 'shouldComponentUpdate');
      const action = MovieDetailsPage.WrappedComponent.prototype.shouldComponentUpdate.call(
        { props: { ...initial } }, { ...initial2 },
      );
      expect(action).toBeTruthy();
    });

    it('MovieDetailsPage: check shouldComponentUpdate to BE FALSE', () => {
      const spy = jest.spyOn(MovieDetailsPage.WrappedComponent.prototype, 'shouldComponentUpdate');
      const action = MovieDetailsPage.WrappedComponent.prototype.shouldComponentUpdate.call(
        { props: { ...initial } }, { ...initial },
      );
      expect(action).toBeFalsy();
    });
  });

  // it('MovieDetailsPage: render component', () => {
  //   const store = mockStore(initial);
  //   const store2 = mockStore(initial2);
  //   const container = ReactTestRender
  //     .create(<Provider store={store}><MovieDetailsPage /></Provider>);
  //   container.update(<Provider store={store2}><MovieDetailsPage /></Provider>);
  //   container.update(<Provider store={store2}><MovieDetailsPage /></Provider>);
  //   expect(container).toMatchSnapshot();
  // });

  // it('MovieDetailsPage: render component with at the same props', () => {
  //   const store = mockStore(initial);
  //   const store2 = mockStore(initial2);
  //   const container = ReactTestRender
  //     .create(<Provider store={store}><MovieDetailsPage mainMovie={{ backdrop_path: 'test' }} /></Provider>);
  //   container.update(<Provider store={store}><MovieDetailsPage /></Provider>);
  //   expect(container).toMatchSnapshot();
  // });

//
});