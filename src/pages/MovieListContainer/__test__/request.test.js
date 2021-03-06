import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

// import Request
import requestFilms from '../../../utils/requests';

const KEY = '75331f1a740385460b25b56203149aa8';
fetchMock.config.overwriteRoutes = true;

// Tests for requests;
// ##############################################
describe('Requests tests', () => {
  const dispatch = jest.fn(arg => arg);
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  describe('fetchData Succesed', () => {
    afterEach(() => {
      fetchMock.reset();
      fetchMock.restore();
    });
    const response = {
      headers: { 'content-type': 'application/json' },
      body: { page: 1, results: [1, 2, 3], status: 'ok' },
    };
    const query = ['coming_soon', 'trending', 'top_rated', '35'];

    it('all requests, except getmainMovie and fetchTrailer - fetch data successed', async () => {
      fetchMock.getOnce(
        `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=en-US&page=1`,
        response,
      );
      fetchMock.getOnce(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${KEY}&language=en-US&page=1`,
        response,
      );
      fetchMock.getOnce(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${KEY}&language=en-US&page=1`,
        response,
      );
      fetchMock.getOnce(
        `https://api.themoviedb.org/3/discover/movie?api_key=${KEY}&with_genres=35`,
        response,
      );

      const expectedActions = {
        payload: false,
        type: 'ITEMS_IS_LOADING',
      };

      fetchMock
        .getOnce(
          `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=en-US&page=1`,
          response,
        )
        .catch(err => err);
      const arrPromisesRequests = query.map(curr => requestFilms.fetchListMovies(dispatch, curr));
      await Promise.all(arrPromisesRequests)
        .then(value => value.map(c => expect(c).toEqual(expectedActions)))
        .catch(err => err);
    });

    it('initial request', async () => {
      fetchMock.getOnce(
        `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=en-US&page=1`,
        response,
      );
      const expectedActions = {
        payload: false,
        type: 'ITEMS_IS_LOADING',
      };
      await requestFilms.fetchListMovies(dispatch, '/').then((value) => {
        fetchMock.reset();
        fetchMock.restore();
        return expect(value).toEqual(expectedActions);
      });
    });

    it('Fetch Trailer - fetch data successed', async () => {
      const id = 280960;
      const response2 = {
        headers: { 'content-type': 'application/json' },
        body: {
          id: 280960,
          results: [
            {
              id: '5a200baa925141033608f5f0',
              iso_639_1: 'en',
              iso_3166_1: 'US',
              key: '6ZfuNTqbHE8',
              name: 'Official Trailer',
              site: 'YouTube',
              size: 1080,
              type: 'Test',
            },
            {
              id: '5a200baa925141033608f5f0',
              iso_639_1: 'en',
              iso_3166_1: 'US',
              key: '6ZfuNTqbHE8',
              name: 'Official Trailer',
              site: 'YouTube',
              size: 1080,
              type: 'Trailer',
            },
          ],
          status: 'ok',
        },
      };
      fetchMock
        .getOnce(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${KEY}&language=en-US`,
          response2,
        )
        .catch(err => err);
      const expectedActions = {
        type: 'FETCH_VIDEO_SUCCESS',
        payload: '6ZfuNTqbHE8',
      };
      await requestFilms.fetchVideo(dispatch, id).then((data) => {
        expect(data).toEqual(expectedActions);
      });
    });

    it('Fetch Search - fetch data successed', async () => {
      fetchMock
        .getOnce(
          `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&language=en-US&query=${
            query[0]
          }&page=1&include_adult=false`,
          response,
        )
        .catch(err => err);
      const expectedActions = {
        payload: false,
        type: 'ITEMS_IS_LOADING',
      };
      await requestFilms.fetchSearchResults(dispatch, query[0]).then((data) => {
        expect(data).toEqual(expectedActions);
      });
    });
  });

  describe('fail', () => {
    afterEach(() => {
      fetchMock.reset();
      fetchMock.restore();
    });

    const response = JSON.stringify({
      page: 1,
      results: [1, 2, 3],
      ok: false,
    });
    const expectError = new Error('Something wrong');
    const expectedActions = {
      type: 'ITEMS_HAS_ERRORED',
      payload: expectError,
    };
    const mockStore = configureMockStore([thunk]);
    it('fail requests - fetch data unsuccessed (listOfMovies)', async () => {
      fetchMock.getOnce(
        `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=en-US&page=1`,
        response,
      );
      fetchMock.getOnce(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${KEY}&language=en-US&page=1`,
        response,
      );
      fetchMock
        .getOnce(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${KEY}&language=en-US&page=1`,
          response,
        )
        .catch(err => err);
      fetchMock.getOnce(
        `https://api.themoviedb.org/3/discover/movie?api_key=${KEY}&with_genres=35`,
        response,
      );

      const query = ['coming_soon', 'trending', 'top_rated', '35'];
      const arrPromisesRequests = query.map(curr => requestFilms.fetchListMovies(dispatch, curr));
      await Promise.all(arrPromisesRequests)
        .then(value => value.map(c => expect(c).toEqual(expectedActions)))
        .catch(err => err);
    });

    it('fail requests - fetch data unsuccessed other requests', async () => {
      const id = 35;

      fetchMock.getOnce(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${KEY}&language=en-US`,
        response,
      );
      fetchMock.getOnce(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${KEY}&language=en-US`,
        response,
      );
      const fetchVideo = requestFilms.fetchVideo(dispatch, id);
      const getMainMovieDetails = requestFilms.getMainMovieDetails(dispatch, id);
      const store = mockStore({});
      await Promise.all([fetchVideo, getMainMovieDetails])
        .then((data) => {
          data.forEach((curr) => {
            const element = curr;
            return store.dispatch(element).then(value => expect(value).toEqual(expectedActions));
          });
        })
        .catch(err => err);
    });
    it('fail requests - fetch data unsuccessed search request - Nothing Found', async () => {
      const query = '/';
      const failResponse = JSON.stringify({
        page: 1,
        results: [],
      });
      const actions = {
        type: 'ITEMS_HAS_ERRORED',
        payload: 'Nothing found',
      };
      fetchMock.getOnce(
        `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&language=en-US&query=${query}&page=1&include_adult=false`,
        failResponse,
      );

      const fetchSearchResults = requestFilms.fetchSearchResults(dispatch, query);
      await Promise.all([fetchSearchResults]).then((data) => {
        data.forEach(value => expect(value).toEqual(actions));
      });
    });
  });
});
