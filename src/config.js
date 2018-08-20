const dev = {
  STRIPE_KEY: "pk_test_sMqwDrU78tzHpaMyEjPW4lk6",
  s3: {
    REGION: "eu-west-2",
    BUCKET: "admin-portal-dev-attachmentsbucket-fm4i68pe3llc"
  },
  apiGateway: {
    REGION: "eu-west-2",
    URL: "https://g19hgig8b4.execute-api.eu-west-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "eu-west-2",
    USER_POOL_ID: "eu-west-2_TnsiF2nVe",
    APP_CLIENT_ID: "40sqn5t6kgl31pqg8lkvj9eep2",
    IDENTITY_POOL_ID: "eu-west-2:6f32ac80-cd30-491b-99c9-b181f56eb8bb"
  }

};

const prod = {
  STRIPE_KEY: "pk_test_sMqwDrU78tzHpaMyEjPW4lk6",
  s3: {
    REGION: "eu-west-2",
    BUCKET: "admin-portal-prod-attachmentsbucket-14rvb84isit9f"
  },
  apiGateway: {
    REGION: "eu-west-2",
    URL: "https://5tdirmxzy6.execute-api.eu-west-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "eu-west-2",
    USER_POOL_ID: "eu-west-2_czAXxF6ub",
    APP_CLIENT_ID: "26i9kphhe45pvsqj7tr5subvq2",
    IDENTITY_POOL_ID: "eu-west-2:cd3c9cc0-1af9-40e3-9b8a-fcbb503884b0"
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
