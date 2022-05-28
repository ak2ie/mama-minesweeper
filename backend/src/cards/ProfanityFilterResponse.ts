export type ProfanityFilterBaseResponse = {
  rsp: {
    '@attributes': {
      stat: string;
    };
  };
};

export type ProfanityFilterSuccessResponse = ProfanityFilterBaseResponse & {
  rsp: {
    '@attributes': {
      stat: 'ok';
    };
    method: string;
    format: string;
    found: string;
    api_key: string;
  };
};

export type ProfanityFilterErrorResponse = ProfanityFilterBaseResponse & {
  rsp: {
    '@attributes': {
      stat: 'fail';
    };
    err: {
      '@attributes': {
        code: string;
        msg: string;
      };
    };
    text: string;
  };
};

export type ProfanityFilterResponse =
  | ProfanityFilterSuccessResponse
  | ProfanityFilterErrorResponse;
