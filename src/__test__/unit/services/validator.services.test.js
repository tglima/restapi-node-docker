import moment from 'moment-timezone';
import validatorServices from '../../../app/services/validator.services';
import utils from '../../../app/utils';

const { momentDateFormat } = require('../../testUtil');

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
