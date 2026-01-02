type TWebConfig = {
  port: string;
};

type TJwtConfig = {
  secret: string;
  expiresDay: string | number;
};

export type TConfig = {
  web: TWebConfig;
  jwt: TJwtConfig;
};
