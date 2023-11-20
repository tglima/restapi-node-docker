import logRepository from '../../../app/repository/log.repository';

const { apiKey } = require('../../testUtil');

describe('Test findByApiKey', () => {
  it('should return more one LogEvents', async () => {
    const respFindDB = await logRepository.findByApiKey(apiKey, 1);
    const result = !respFindDB.error && respFindDB.response ? respFindDB.response.total_items : 0;
    expect(result).toBeGreaterThan(1);
  });

  it('should return 0 LogEvents', async () => {
    const respFindDB = await logRepository.findByApiKey(apiKey, 1000);
    const result = !respFindDB.error && !respFindDB.response ? 0 : 'ERROR';
    expect(result).toEqual(0);
  });
});

describe('Test findByApiKey', () => {
  it('should return more one LogEvents', async () => {
    const respFindDB = await logRepository.findByApiKey(apiKey, 1);
    const result = !respFindDB.error && respFindDB.response ? respFindDB.response.total_items : 0;
    expect(result).toBeGreaterThan(1);
  });

  it('should return 0 LogEvents', async () => {
    const respFindDB = await logRepository.findByApiKey(apiKey, 1000);
    const result = !respFindDB.error && !respFindDB.response ? 0 : 'ERROR';
    expect(result).toEqual(0);
  });
});

describe('Test findByDateRange', () => {
  const dt_start = '2023-11-15 01:00:00';
  const dt_finish = '2023-11-30 01:00:00';

  it('should return more one LogEvents', async () => {
    const respFindDB = await logRepository.findByDateRange(dt_start, dt_finish, 1);
    const result = !respFindDB.error && respFindDB.response ? respFindDB.response.total_items : 0;
    expect(result).toBeGreaterThan(1);
  });

  it('should return 0 LogEvents', async () => {
    const respFindDB = await logRepository.findByDateRange(dt_start, dt_finish, 100);
    const result = !respFindDB.error && !respFindDB.response ? 0 : 'ERROR';
    expect(result).toEqual(0);
  });
});

describe('Test findByCodeEvent', () => {
  it('should return 1 LogEvent', async () => {
    const respFindDB = await logRepository.findByCodeEvent('b8f08c6f-335b-407d-a16f-4bff394c477d');
    const result = !respFindDB.error && respFindDB.response ? true : 'ERROR';
    expect(result).toEqual(true);
  });

  it('should return 0 LogEvents', async () => {
    const respFindDB = await logRepository.findByCodeEvent(apiKey);
    const result = !respFindDB.error && !respFindDB.response ? true : 'ERROR';
    expect(result).toEqual(true);
  });
});

describe('Test findLogErrorById', () => {
  it('should return 1 LogEvent', async () => {
    const respFindDB = await logRepository.findLogErrorById(3);
    const result = !respFindDB.error && respFindDB.response ? true : 'ERROR';
    expect(result).toEqual(true);
  });

  it('should return 0 LogEvents', async () => {
    const respFindDB = await logRepository.findLogErrorById(90);
    const result = !respFindDB.error && !respFindDB.response ? true : 'ERROR';
    expect(result).toEqual(true);
  });
});

describe('Test findLogErrorByDtRange', () => {
  const dt_start = '2023-11-02 00:00:00';
  const dt_finish = '2023-11-30 01:00:00';

  it('should return more one LogEvents', async () => {
    const respFindDB = await logRepository.findLogErrorByDtRange(dt_start, dt_finish, 1);
    const result = !respFindDB.error && respFindDB.response ? respFindDB.response.total_items : 0;
    expect(result).toBeGreaterThan(1);
  });

  it('should return 0 LogEvents', async () => {
    const respFindDB = await logRepository.findLogErrorByDtRange(dt_start, dt_finish, 100);
    const result = !respFindDB.error && !respFindDB.response ? 0 : 'ERROR';
    expect(result).toEqual(0);
  });
});

describe('Test countLog', () => {
  it('should return more one LogEvents', async () => {
    const respFindDB = await logRepository.countLogEvent();
    const result = !respFindDB.error && respFindDB.response ? respFindDB.response : 'ERROR';
    expect(result).toBeGreaterThan(4);
  });

  it('should return more one LogErrors', async () => {
    const respFindDB = await logRepository.countLogError();
    const result = !respFindDB.error && respFindDB.response ? respFindDB.response : 'ERROR';
    expect(result).toBeGreaterThan(2);
  });
});

describe('Test deleteLog', () => {
  it('should delete more one LogEvents', async () => {
    const respFindDB = await logRepository.deleteLogEvent();
    const result = !respFindDB.error && respFindDB.response ? respFindDB.response : 'ERROR';
    expect(result).toEqual(true);
  });

  it('should delete more one LogErrors', async () => {
    const respFindDB = await logRepository.deleteLogError();
    const result = !respFindDB.error && respFindDB.response ? respFindDB.response : 'ERROR';
    expect(result).toEqual(true);
  });
});
