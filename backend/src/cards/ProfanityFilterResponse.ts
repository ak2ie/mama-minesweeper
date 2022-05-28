export type ProfanityFilterSuccessResponse = {
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
