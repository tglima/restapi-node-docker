import moment from 'moment-timezone';
import validatorServices from '../../../app/services/validator.services';
import utils from '../../../app/utils';

const { apiKey, authorization, momentDateFormat, Request } = require('../../testUtil');

describe('Test validate datetime', () => {
  const dt_finish = utils.getDateNow();
  const dt_start = moment(dt_finish).subtract(10, 'hours').format(momentDateFormat);
  it('should return false to validateDateTime', async () => {
    const respValidate = validatorServices.validateDateTime();
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return false to validateDateTime', async () => {
    const respValidate = validatorServices.validateDateTime('2023-02-30 01:00:00');
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return true to validateDateTime', async () => {
    const respValidate = validatorServices.validateDateTime(dt_finish);
    const result = !respValidate.error && respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(true);
  });

  it('should return false to valDateTimeRange', async () => {
    const respValidate = validatorServices.valDateTimeRange(dt_start);
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return false to valDateTimeRange', async () => {
    const respValidate = validatorServices.valDateTimeRange(dt_finish);
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return false to valDateTimeRange', async () => {
    const respValidate = validatorServices.valDateTimeRange('', dt_finish);
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return false to valDateTimeRange', async () => {
    const respValidate = validatorServices.valDateTimeRange(dt_start, '');
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return false to valDateTimeRange', async () => {
    const respValidate = validatorServices.valDateTimeRange(dt_finish, dt_start);
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return true to valDateTimeRange', async () => {
    const respValidate = validatorServices.valDateTimeRange(dt_start, dt_finish);
    const result = !respValidate.error && respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(true);
  });
});

describe('Test validate Page,CodeEvent, FormatApiKey', () => {
  it('should return false to validatePage', async () => {
    const respValidate = validatorServices.validatePage('');
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return false to validatePage', async () => {
    const respValidate = validatorServices.validatePage('a1');
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return false to validatePage', async () => {
    const respValidate = validatorServices.validatePage('a');
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return true to validatePage', async () => {
    const respValidate = validatorServices.validatePage(+'2');
    const result = !respValidate.error && respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(true);
  });

  it('should return true to validatePage', async () => {
    const respValidate = validatorServices.validatePage(2);
    const result = !respValidate.error && respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(true);
  });

  it('should return false to validateCodeEvent', async () => {
    const respValidate = validatorServices.validateCodeEvent('b8f08c6f');
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return false to validateCodeEvent', async () => {
    const respValidate = validatorServices.validateCodeEvent('-335b-407d');
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return true to validateCodeEvent', async () => {
    const respValidate = validatorServices.validateCodeEvent('b8f08c6f-335b-407d-a16f-4bff394c477d');
    const result = !respValidate.error && respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(true);
  });

  //
  it('should return false to valFormatApiKey', async () => {
    const respValidate = validatorServices.valFormatApiKey('fedfaeeac-faeefaeeebf');
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return false to valFormatApiKey', async () => {
    const respValidate = validatorServices.valFormatApiKey('4d4faee7ebf7');
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return true to valFormatApiKey', async () => {
    const respValidate = validatorServices.valFormatApiKey('798fed97-4d4faee7ebf7');
    const result = !respValidate.error && respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(true);
  });
});

describe('Test validate validateRequest', () => {
  const request = new Request();
  request.headers = {
    'Content-Type': 'application/json',
    'api-key': apiKey,
    authorization,
  };

  it('should return false to validateRequest', async () => {
    request.headers['api-key'] = 'xpto';
    const respValidate = validatorServices.validateRequest(request);
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return false to validateRequest', async () => {
    request.headers.authorization = undefined;
    const respValidate = validatorServices.validateRequest(request);
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return false to validateRequest', async () => {
    request.headers['api-key'] = authorization;
    request.headers.authorization = apiKey;
    const respValidate = validatorServices.validateRequest(request);
    const result = !respValidate.error && !respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(false);
  });

  it('should return true to validateRequest', async () => {
    request.headers['api-key'] = apiKey;
    request.headers.authorization = authorization;
    const respValidate = validatorServices.validateRequest(request);
    const result = !respValidate.error && respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(true);
  });

  it('should return true to validateRequest', async () => {
    request.headers.authorization = undefined;
    request.originalUrl = '/v1/products/find';
    const respValidate = validatorServices.validateRequest(request);
    const result = !respValidate.error && respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(true);
  });

  it('should return true to validateRequest', async () => {
    request.headers['api-key'] = undefined;
    request.headers.authorization = undefined;
    request.originalUrl = '/swagger/#/LogError';
    const respValidate = validatorServices.validateRequest(request);
    const result = !respValidate.error && respValidate.response ? respValidate.response : 'ERROR';
    expect(result).toEqual(true);
  });
});
