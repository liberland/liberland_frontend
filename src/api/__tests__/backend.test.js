/**
 * Tests for the best-effort referendum metadata writer.
 *
 * The whole point of tryAddReferendum is that a failing off-chain backend must
 * NOT prevent the on-chain proposal that follows it. So the key guarantee under
 * test is: it never rejects, even when the underlying POST throws.
 */

const mockPost = jest.fn();

jest.mock('axios', () => {
  const instance = {
    post: (...args) => mockPost(...args),
    get: jest.fn(),
    patch: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  };
  return { __esModule: true, default: { create: () => instance } };
});

jest.mock('../../utils/networkHelpers', () => ({
  getNetworkConfig: () => ({ api: 'https://api.example.test' }),
}));

describe('backend.tryAddReferendum', () => {
  let backend;
  let errorSpy;

  beforeEach(() => {
    jest.resetModules();
    mockPost.mockReset();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // eslint-disable-next-line global-require
    backend = require('../backend');
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  const params = {
    link: 'https://discuss.example/1',
    name: 'Test referendum',
    description: 'desc',
    hash: '0xabc',
    additionalMetadata: {},
    proposerAddress: '5Test',
  };

  it('posts the metadata to /referenda on success', async () => {
    mockPost.mockResolvedValueOnce({ data: {} });
    await backend.tryAddReferendum(params);
    expect(mockPost).toHaveBeenCalledTimes(1);
    const [url, body] = mockPost.mock.calls[0];
    expect(url).toBe('/referenda');
    expect(body).toMatchObject({ ...params, chainIndex: 0 });
  });

  it('resolves (does not throw) when the backend POST rejects', async () => {
    mockPost.mockRejectedValueOnce(new Error('Network Error'));
    await expect(backend.tryAddReferendum(params)).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('still swallows backend errors on auth/CORS-style failures', async () => {
    mockPost.mockRejectedValueOnce({ response: { status: 401 } });
    await expect(backend.tryAddReferendum(params)).resolves.toBeUndefined();
  });

  it('addReferendum (strict variant) still rejects so callers can opt in', async () => {
    mockPost.mockRejectedValueOnce(new Error('boom'));
    await expect(backend.addReferendum(params)).rejects.toThrow('boom');
  });
});
