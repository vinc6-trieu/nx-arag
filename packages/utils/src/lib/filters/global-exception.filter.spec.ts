import { ArgumentsHost, Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { datadogTracer } from '@lib/observability';

jest.mock('@lib/observability', () => ({
  datadogTracer: {
    scope: jest.fn(),
  },
}));

describe('GlobalExceptionFilter', () => {
  const loggerErrorSpy = jest
    .spyOn(Logger.prototype, 'error')
    .mockImplementation(() => undefined);

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    loggerErrorSpy.mockRestore();
  });

  const createHost = (response: any): ArgumentsHost => ({
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => ({ url: '/test' }),
    }),
    switchToRpc: () => ({
      getContext: () => undefined,
    }),
    switchToWs: () => ({
      getClient: () => undefined,
      getData: () => undefined,
    }),
    getType: () => 'http',
    getArgByIndex: () => undefined,
    getArgs: () => [],
  }) as unknown as ArgumentsHost;

  it('tags the active Datadog span and logs when handling an Error', () => {
    const setTag = jest.fn();
    const active = jest.fn().mockReturnValue({ setTag });
    (datadogTracer.scope as jest.MockedFunction<
      typeof datadogTracer.scope
    >).mockReturnValue({ active });

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const response = { status } as any;

    const filter = new GlobalExceptionFilter();
    const error = new Error('Boom');
    error.stack = 'stack trace';

    filter.catch(error, createHost(response));

    expect(setTag).toHaveBeenCalledWith('error', error);
    expect(setTag).toHaveBeenCalledWith('error.message', 'Boom');
    expect(setTag).toHaveBeenCalledWith('error.stack', 'stack trace');
    expect(loggerErrorSpy).toHaveBeenCalledWith('Boom', 'stack trace');
    expect(status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('falls back to response message when exception is not an Error', () => {
    const setTag = jest.fn();
    const active = jest.fn().mockReturnValue({ setTag });
    (datadogTracer.scope as jest.MockedFunction<
      typeof datadogTracer.scope
    >).mockReturnValue({ active });

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const response = { status } as any;

    const filter = new GlobalExceptionFilter();

    filter.catch('unexpected', createHost(response));

    expect(setTag).toHaveBeenCalledWith('error', 'unexpected');
    expect(setTag).toHaveBeenCalledWith('error.message', 'unexpected');
    expect(setTag).not.toHaveBeenCalledWith('error.stack', expect.anything());
    expect(loggerErrorSpy).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('does nothing when there is no active span', () => {
    const active = jest.fn().mockReturnValue(null);
    (datadogTracer.scope as jest.MockedFunction<
      typeof datadogTracer.scope
    >).mockReturnValue({ active });

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const response = { status } as any;

    const filter = new GlobalExceptionFilter();

    filter.catch('failure', createHost(response));

    expect(active).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledTimes(1);
  });
});
