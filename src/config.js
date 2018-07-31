const dev = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "admin-portal-dev-attachmentsbucket-1livu1c7j4uum"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://kzmsils18f.execute-api.us-east-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_9HHcY6pZe",
    APP_CLIENT_ID: "552bvot3qdc0h78q36nmdloupc",
    IDENTITY_POOL_ID: "us-east-1:90f81b55-7e31-4f27-91f5-86639b2967e0"
  }
};

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "admin-portal-prod-attachmentsbucket-3f3i0f925z84"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://wrphrz5emk.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_QLs83dUxf",
    APP_CLIENT_ID: "3tqkiiagesqiuuah0fpkoat5lf",
    IDENTITY_POOL_ID: "us-east-1:d120818d-2859-4c44-99a6-9e8d87bad670"
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
